import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader/root";
import { machineId } from 'node-machine-id';

import './App.css';
import io from 'socket.io-client';
import DesktopHeader from './desktop-header/DesktopHeader';
import Home from './home/Home';
import Chat from './chat/Chat';
import Conversation from '../../models/Conversation';
import Message from '../../models/Message';
import User from '../../models/User';
import ChatListContainer from './ChatsListContainer/ChatsListContainer';
import ChatOptions from './ChatOptions/ChatOptions';
import ChatCreationForm from '../../models/ChatCreationForm';
import axios, { AxiosResponse } from 'axios';

enum ChatState {
  OPTIONS,
  OPENED,
  CLOSED
}

interface Display {
  chatState: ChatState
}

interface UserState {
  clientId: string
  name: string
}

const chatApplicationServiceBaseUrl = "http://localhost:7011"
const chatApplicationManagerBaseUrl = "http://localhost:5000"

const defaultHeader = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

let socket = io(chatApplicationManagerBaseUrl);
socket.on('connect', function () {
  console.log("Connected here")
});



function App() {
  const [user, setUser] = useState<UserState>({ clientId: "", name: "guest" });
  const [display, setDisplay] = useState<Display>({ chatState: ChatState.CLOSED })

  const [openedConversation, setOpenedConversation] = useState<Conversation>({
    _id: "",
    conversationLink: "",
    users: [],
    messages: []
  })

  const [conversationList, setConversationList] = useState<Conversation[]>([])

  useEffect(() => {


    async function init() {
      let id = ""
      try {
        id = await machineId()
      } catch (error) {
        console.log(error)
      }

      setUser({ ...user, clientId: id })


      getConversationList(id)
      socket.on("conversation-joined", (res: Conversation) => {

        setOpenedConversation(res)
        setDisplay({ chatState: ChatState.OPENED })

        console.log("conversation-joined")
        console.log(JSON.stringify(res, undefined, 4))
      })

      socket.on("message-posted", (res: any) => {
        console.log("message-posted")
        console.log(res)

        setOpenedConversation(res)
      })

    }

    init()
    return () => {
      socket.off("conversation-joined");
      socket.off("message-posted");
    };
  }, [])




  const showNewChatOptions = () => {
    setDisplay({ chatState: ChatState.OPTIONS })
  }

  const createConversation = (chatCreationForm: ChatCreationForm) => {
    const conv = {
      conversationLink: "",
      messages: [],
      subject: chatCreationForm.subject,
      isPublic: chatCreationForm.isPublic === "true" ? true : false,
      persist: chatCreationForm.persist === "true" ? true : false,
      users: [{
        clientId: user.clientId,
        name: user.name
      }]
    }

    console.log(JSON.stringify(conv, undefined, 4));

    socket.emit("create-conversation", conv)
  }

  const postMessage = (message: Message) => {
    message.sentBy = {
      name: user.name,
      clientId: user.clientId
    }

    console.log("post-message posting conversation");
    console.log(JSON.stringify(message, undefined, 4));
    socket.emit("post-message", { conversation: openedConversation, message: message })
  }

  const joinConversationByLink = (conversationLink: string) => {

    console.log("join-conversation");
    console.log(JSON.stringify(conversationLink, undefined, 4));
    socket.emit("join-conversation", {
      conversationLink: conversationLink, user: {
        clientId: user.clientId,
        name: user.name
      }
    })
  }

  const openConversation = (conversationLink: string) => {

    console.log("get-conversation");
    console.log(JSON.stringify(conversationLink, undefined, 4));
    socket.emit("get-conversation", { conversationLink: conversationLink })

  }

  const getConversationList = async (id: string) => {
    console.log("getConversationList")
    console.log(id)
    let conversationList
    let userUpserted
    try {
      const conversationReq = await fetch(`${chatApplicationServiceBaseUrl}/conversation/clientId/${id}`, {
        method: 'GET',
        headers: defaultHeader
      })

      conversationList = await conversationReq.json()

      const userReq = await fetch(`${chatApplicationServiceBaseUrl}/user`, {
        method: 'PUT',
        headers: defaultHeader,
        body: JSON.stringify({ clientId: id, name: user.name })
      })

      userUpserted = await userReq.json()

    } catch (error) {
      console.log(error)
    }
    console.log("userUpserted")
    console.log(userUpserted)
    if (!!conversationList) {
      setConversationList([...conversationList])
    } else {
      setConversationList([])
    }

    if (!!userUpserted) {
      setUser({ clientId: userUpserted.clientId, name: userUpserted.name })
    }
  }



  const editUsername = async (user: User) => {
    console.log("edit-usernmae")
    console.log(user)
    let data: User | undefined = undefined
    try {
      const dataUnparsed = await fetch(`${chatApplicationServiceBaseUrl}/user/name/${user.name}`,
        {
          method: 'PUT',
          headers: defaultHeader,
          body: JSON.stringify({ clientId: user.clientId, name: user.name })
        })

      await Promise.all([
        fetch(`${chatApplicationServiceBaseUrl}/message/user/name`,
          {
            method: 'PUT',
            headers: defaultHeader,
            body: JSON.stringify({ id: user.clientId, name: user.name })
          }),
        fetch(`${chatApplicationServiceBaseUrl}/conversation/users/name`,
          {
            method: 'PUT',
            headers: defaultHeader,
            body: JSON.stringify({ id: user.clientId, name: user.name })
          })
      ])

      data = await dataUnparsed.json()

    } catch (error) {
      console.log(error)
    }
    if (!!data) {
      setUser({ clientId: data.clientId, name: data.name })
    }

    getConversationList(user.clientId)
  }

  const minimizeConversation = ()=>{
    socket.emit("leave-conversation", openedConversation.conversationLink)
    setOpenedConversation({
      _id: "",
      conversationLink: "",
      users: [],
      messages: []
    })
    setDisplay(({ chatState: ChatState.CLOSED }))
    getConversationList(user.clientId)
  }




  return (
    <div className="app-container">
      <DesktopHeader />
      <div className="app-body">
        {display.chatState === ChatState.OPTIONS ? <ChatOptions createConversation={createConversation} /> : <></>}

        {display.chatState === ChatState.OPENED ?
          <Chat openedConversation={openedConversation} postMessage={postMessage} userId={user.clientId} minimizeConversation={minimizeConversation} /> :
          <></>}

        {display.chatState === ChatState.CLOSED ?
          <Home user={user} showNewChatOptions={showNewChatOptions} editUsername={editUsername} joinConversationByLink={joinConversationByLink} />
          : <></>
        }

        {!!conversationList && conversationList.length > 0 ?
          <ChatListContainer conversations={conversationList} openedConversation={openedConversation} openConversation={openConversation} />
          : <></>}

      </div>

    </div>
  );
}


export default hot(App);
