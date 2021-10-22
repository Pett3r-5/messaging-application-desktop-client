import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader/root";
import { machineId } from 'node-machine-id';
import ReactDOM from "react-dom";
import { HashRouter, Route, useHistory } from "react-router-dom";

import './App.css';
import DesktopHeader from './desktop-header/DesktopHeader';
import Home from './home/Home';
import Chat from './chat/Chat';
import Conversation from '../../models/Conversation';
import User from '../../models/User';
import ChatListContainer from './ChatsListContainer/ChatsListContainer';
import ChatOptions from './ChatOptions/ChatOptions';
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
  const history = useHistory()

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

    }

    init()
  }, [])

  useEffect(() => {
    Connection.getSocket().on("conversation-joined", (res: { conversation: Conversation, isOpenedConversation: boolean, requestOwner: string }) => {
      if (res.isOpenedConversation && res.requestOwner === user.clientId) {
        setOpenedConversation({ ...res.conversation })
        history.push('/conversation')
      }
    })

    return () => {
      Connection.getSocket().off("conversation-joined");
    };
  }, [user])

  useEffect(() => {
    Connection.getSocket().on("message-posted", (res: Conversation) => {
      if (res.conversationLink === openedConversation.conversationLink) {
        setOpenedConversation(res)
      } else {
        let convsWithNewMessage = conversationList.map(el => {
          if (res.conversationLink === el.conversationLink) {
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
  }, [openedConversation, conversationList])




  const showNewChatOptions = () => {
    history.push('/options')
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
      conversationList.map((el: Conversation) => {
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


  const minimizeConversation = () => {
    Connection.getSocket().emit("leave-conversation", openedConversation.conversationLink)
    setOpenedConversation({
      _id: "",
      conversationLink: "",
      users: [],
      messages: []
    })
    history.push('/')
    getConversationList(user.clientId)
  }


  const backToHomeScreen = () => {
    history.push('/')
  }



  return (
    <div className="app-container">
      <DesktopHeader />
      <div className="app-body">
        <UserContext.Provider value={{ user: user, setUser: setUser }}>

          <HashRouter>
            <Route exact path='/'>
              <ConversationLinkContext.Provider value={{ joinConversationByLink: joinConversationByLink }}>
                <ConversationListContext.Provider value={{ conversationList: conversationList, setConversationList: setConversationList, getConversationList: getConversationList }}>
                  <Home showNewChatOptions={showNewChatOptions} />
                </ConversationListContext.Provider>
              </ConversationLinkContext.Provider>
            </Route>

            <Route exact path='/options'>
              <ChatOptions backToHomeScreen={backToHomeScreen} />
            </Route>

            <Route path='/conversation'>
              <OpenedConversationContext.Provider value={{ openedConversation: openedConversation, setOpenedConversation: setOpenedConversation }}>
                <Chat minimizeConversation={minimizeConversation} />
              </OpenedConversationContext.Provider>
            </Route>


          </HashRouter>

          {!!conversationList && conversationList.length > 0 ?
            <ChatListContainer conversations={conversationList} openedConversation={openedConversation} />
            : <></>}

        </UserContext.Provider>
      </div>
    </div>
  );
}


export default hot(App);
