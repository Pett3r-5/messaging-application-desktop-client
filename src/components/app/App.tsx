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
let socket = io("http://localhost:5000");
socket.on('connect', function(){
  console.log("Connected here")
});

interface Display {
  isChatOpened: boolean
}

interface UserState {
  id: string
  name: string
}

function App() {
  const [user, setUser]  = useState<UserState>({id:"", name:"guest"});
  const [ display, setDisplay ] = useState<Display>({isChatOpened: false})

  const [ openedConversation, setOpenedConversation ] = useState<Conversation>({
    conversationLink: "",
    users: [],
    messages: []
  })

  const [ conversationList, setConversationList ] = useState<Conversation[]>([])

  useEffect(()=>{
    createUser()
    init()
    return  () => {
      socket.off("get-conversation-list");
      socket.off("conversation-joined");
      socket.off("message-posted");
    };
  }, [])

  async function createUser(){
    
  }

  async function init(){
    let id = await machineId()
    setUser({...user, id: id})
    
    socket.emit("request-conversation-list", id)
    socket.on("listen-conversation-list",(conversationList:Conversation[])=>{
      console.log("listen-conversation-list")
      setConversationList(conversationList)
    })

    socket.on("conversation-joined", (res:Conversation)=>{

      setOpenedConversation(res)
      setDisplay({...display, isChatOpened: true})

      console.log("conversation-joined")
      console.log(JSON.stringify(res, undefined, 4))
    })

    socket.on("message-posted", (res:any)=>{
      console.log("message-posted")
      console.log(res)

      setOpenedConversation(res)
    })
    
  }
  
  const createConversation = async ()=> {
    const conv = {
      conversationLink: "",
      messages: [],
      users: [{
        clientId: user.id, 
            name: user.name
      }]
    }
    

    setOpenedConversation(conv)

    console.log(`create-conversation: ${JSON.stringify(conv, undefined, 4)}`)
    socket.emit("create-conversation", conv)
  }

  const postMessage = (message:Message)=> {
    message.sentBy = {
      name: user.name,
      clientId: user.id
    }

    console.log("post-message posting conversation");
    console.log(JSON.stringify(message, undefined, 4));
    socket.emit("post-message",{ conversation:openedConversation, message:message })
  }

  const joinConversationByLink = (conversationLink:string)=> {

    console.log("join-conversation");
    console.log(JSON.stringify(conversationLink, undefined, 4));
    socket.emit("join-conversation",{ conversationLink:conversationLink, user: {
      clientId: user.id,
      name: user.name
    } })
  }

  const openConversation = (conversationLink:string)=> {

    console.log("join-conversation");
    console.log(JSON.stringify(conversationLink, undefined, 4));
    socket.emit("join-conversation",{ conversationLink:conversationLink, user: {
      clientId: user.id,
      name: user.name
    } })

  }




  return (
    <div className="app-container">
      <DesktopHeader/>
      <div className="app-body">
        {display.isChatOpened ? 
        <Chat openedConversation={openedConversation} postMessage={postMessage} userId={user.name}/> : 
        <Home createConversation={createConversation} joinConversationByLink={joinConversationByLink}/>}

        {!!conversationList && conversationList.length > 0 ? 
        <ChatListContainer conversations={conversationList} openedConversation={openedConversation} openConversation={openConversation} /> 
        : <></>}
        
      </div>
      
    </div>
  );
}


export default hot(App);
