import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader/root";
import { machineId } from 'node-machine-id';

import './App.css';
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
import Connection from '../../commons/Connection';
import { UserState, Display, ChatState } from './AppState'


export const OpenedConversationContext: React.Context<Partial<{ openedConversation: Conversation, setOpenedConversation: Function }>> = React.createContext({}) //establish the root of a context environment. It's what allows any descendent component to consume the data stored on the context.
export const UserContext: React.Context<Partial<{ user: User, setUser: Function }>> = React.createContext({})
export const ConversationListContext: React.Context<Partial<{ conversationList: Conversation[], setConversationList: Function, getConversationList: Function }>> = React.createContext({})
export const ConversationLinkContext: React.Context<Partial<{ joinConversationByLink: Function }>> = React.createContext({})

Connection.connect()


function App() {
  const [user, setUser] = useState<UserState>({ clientId: "", name: "guest" })
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

      Connection.getSocket().emit("user-id", id)
      Connection.getSocket().on("conversation-joined", (res: { conversation: Conversation, isOpenedConversation: boolean }) => {
        if(res.isOpenedConversation){
          setOpenedConversation({...res.conversation})
          setDisplay({ chatState: ChatState.OPENED })
        }
      })


    }

    init()
    return () => {
      Connection.getSocket().off("conversation-joined");
    };
  }, [])

  useEffect(()=>{
    Connection.getSocket().on("message-posted", (res: Conversation) => {
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
      Connection.getSocket().off("message-posted");
    }
  }, [openedConversation])




  const showNewChatOptions = () => {
    setDisplay({ chatState: ChatState.OPTIONS })
  }

  const joinConversationByLink = (conversationLink: string, isOpenedConversation: boolean) => {
    Connection.getSocket().emit("join-conversation", {
      conversationLink: conversationLink, 
      user: {
        clientId: user.clientId,
        name: user.name
      },
      isOpenedConversation: isOpenedConversation
    })
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


  const minimizeConversation = ()=>{
    Connection.getSocket().emit("leave-conversation", openedConversation.conversationLink)
    setOpenedConversation({
      _id: "",
      conversationLink: "",
      users: [],
      messages: []
    })
    setDisplay(({ chatState: ChatState.CLOSED }))
    getConversationList(user.clientId)
  }


  const backToHomeScreen = () => {
    setDisplay({ chatState: ChatState.CLOSED })
  }



  return (
    <div className="app-container">
      <div className="app-body">
        <UserContext.Provider value={{ user: user, setUser: setUser }}>

          {display.chatState === ChatState.OPTIONS ? <ChatOptions backToHomeScreen={backToHomeScreen} /> : <></>}

          <OpenedConversationContext.Provider value={{ openedConversation: openedConversation, setOpenedConversation: setOpenedConversation }}>
            {display.chatState === ChatState.OPENED ?
              <Chat minimizeConversation={minimizeConversation} /> :
              <></>}
          </OpenedConversationContext.Provider>

          <ConversationLinkContext.Provider value={{ joinConversationByLink: joinConversationByLink }}>
            <ConversationListContext.Provider value={{ conversationList: conversationList, setConversationList: setConversationList, getConversationList: getConversationList }}>
              {display.chatState === ChatState.CLOSED ?
                <Home showNewChatOptions={showNewChatOptions} />
                : <></>
              }
            </ConversationListContext.Provider>
          </ConversationLinkContext.Provider>

          {!!conversationList && conversationList.length > 0 ?
            <ChatListContainer conversations={conversationList} openedConversation={openedConversation} />
            : <></>}

        </UserContext.Provider>
      </div>
    </div>
  );
}


export default hot(App);
