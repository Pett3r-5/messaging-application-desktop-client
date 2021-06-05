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
import { baseUrls, defaultHeader } from '../../commons/http-constants';

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


let socket = io(baseUrls.applicationManagerUrl);
socket.on('connect', function () {
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

      socket.emit("user-id", id)
      socket.on("conversation-joined", (res:{conversation: Conversation, isOpenedConversation: boolean}) => {
        console.log("conversation-joined");
        console.log(res);
        
        if(res.isOpenedConversation){
          setOpenedConversation({...res.conversation})
          setDisplay({ chatState: ChatState.OPENED })
        }
      })


    }

    init()
    return () => {
      socket.off("conversation-joined");
    };
  }, [])

  useEffect(()=>{
    socket.on("message-posted", (res: Conversation) => {
      if(res.conversationLink === openedConversation.conversationLink){
        setOpenedConversation(res)
      } else {
        let convsWithNewMessage = conversationList.map(el=>{
          if(res.conversationLink === el.conversationLink) {
            el.hasNewMessage = true
          }
          return el
        })
        console.log("convsWithNewMessage")
        console.log(convsWithNewMessage)
        setConversationList(convsWithNewMessage)
      }
    })

    return () => {
      socket.off("message-posted");
    }
  }, [openedConversation])




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
    socket.emit("create-conversation", conv)
  }

  const postMessage = (message: Message) => {
    message.sentBy = {
      name: user.name,
      clientId: user.clientId
    }
    socket.emit("post-message", { conversation: openedConversation, message: message })
  }

  const joinConversationByLink = (conversationLink: string, isOpenedConversation: boolean) => {
    socket.emit("join-conversation", {
      conversationLink: conversationLink, 
      user: {
        clientId: user.clientId,
        name: user.name
      },
      isOpenedConversation: isOpenedConversation
    })
  }

  const openConversation = (conversationLink: string) => {
    socket.emit("get-conversation", { conversationLink: conversationLink })

  }

  const backToHomeScreen = () => {
    setDisplay({ chatState: ChatState.CLOSED })
  }

  const getConversationList = async (id: string) => {
    let conversationList
    let userUpserted
    try {
      const conversationReq = await fetch(`${baseUrls.applicationServiceUrl}/conversation/clientId/${id}`, {
        method: 'GET',
        headers: defaultHeader
      })

      conversationList = await conversationReq.json()

      const userReq = await fetch(`${baseUrls.applicationServiceUrl}/user`, {
        method: 'PUT',
        headers: defaultHeader,
        body: JSON.stringify({ clientId: id, name: user.name })
      })

      userUpserted = await userReq.json()
    } catch (error) {
      console.log(error)
    }

    if (!!conversationList) {
      setConversationList([...conversationList])
      conversationList.map((el:Conversation)=>{
        joinConversationByLink(el.conversationLink, false)
        return el
      })
      
    } else {
      setConversationList([])
    }

    if (!!userUpserted) {
      setUser({ clientId: userUpserted.clientId, name: userUpserted.name })
    }
  }



  const editUsername = async (user: User) => {
    let data: User | undefined = undefined
    try {
      const dataUnparsed = await fetch(`${baseUrls.applicationServiceUrl}/user/name/${user.name}`,
        {
          method: 'PUT',
          headers: defaultHeader,
          body: JSON.stringify({ clientId: user.clientId, name: user.name })
        })

      await Promise.all([
        fetch(`${baseUrls.applicationServiceUrl}/message/user/name`,
          {
            method: 'PUT',
            headers: defaultHeader,
            body: JSON.stringify({ id: user.clientId, name: user.name })
          }),
        fetch(`${baseUrls.applicationServiceUrl}/conversation/users/name`,
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
        {display.chatState === ChatState.OPTIONS ? <ChatOptions createConversation={createConversation} backToHomeScreen={backToHomeScreen} /> : <></>}

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
