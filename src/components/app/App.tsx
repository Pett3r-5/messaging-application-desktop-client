import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
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
let socket = io("http://localhost:5000");
socket.on('connect', function(){
  console.log("Connected here")
});


function App() {
  let [userId, setUserId]  = useState<string>("");

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
      socket.off("conversation-created");
      socket.off("message-posted");
    };
  }, [])

  async function createUser(){
    let idd = await machineId()
    setUserId(idd)
  }

  function init(){
    
    
    socket.emit("request-conversation-list", userId)
    socket.on("get-conversation-list",(conversationList:Conversation[])=>{
      setConversationList(conversationList)
    })

    socket.on("conversation-created", (res:Conversation)=>{

      setOpenedConversation(res)
      console.log("conversation-created")
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
        clientId: userId, 
            name: "User"
      }]
    }
    

    setOpenedConversation(conv)

    console.log(`create-conversation: ${JSON.stringify(conv, undefined, 4)}`)
    socket.emit("create-conversation", conv)
  }

  const postMessage = (message:Message)=> {
    message.sentBy = {
      name: "name",
      clientId: userId
    }

    console.log("post-message posting conversation");
    console.log(JSON.stringify(message, undefined, 4));
    socket.emit("post-message",{ conversation:openedConversation, message:message })
  }




  return (
    <HashRouter>
      <div className="app-container">
        <DesktopHeader/>
        
        <Switch>
          <Route exact path='/'>
            <Home createConversation={createConversation}/>
          </Route>
          <Route path='/chat'>
            <Chat openedConversation={openedConversation} postMessage={postMessage} userId={userId}/>
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}


export default hot(App);
