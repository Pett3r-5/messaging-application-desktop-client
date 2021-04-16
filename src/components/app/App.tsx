import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { hot } from "react-hot-loader/root";
import { machineId } from 'node-machine-id';

import './App.css';
import io from 'socket.io-client';
import DesktopHeader from './desktop-header/DesktopHeader';
import Home from './home/Home';
import Chat from './chat/Chat';
import { init } from 'electron-compile';
import Message from '../../models/Message';


function App() {
  let socket:any;

  useEffect(()=>{
    init()
    
  }, [])

  function init(){
    socket = io("http://localhost:5000");
    socket.on('connect', function(){
      console.log("Connected here")
    });

    socket.on("conversation-created", (res:any)=>{
      console.log("created")
      console.log(res)
    })

    socket.on("message-posted", (res:any)=>{
      console.log("posted")
      console.log(res)
    })
    
  }
  
  const createConversation = async ()=> {
    const user = await machineId()
    console.log(`user: ${user}`)
    socket.emit("create-conversation",
    {
      conversationLink: undefined,
      messages: [],
      users: [
        {
          clientId: user, 
          name: "User", 
          isConversationOwner: true,
          isOnline: true
        }
      ]
    } 
    )
    
  }

  const postMessage = async (message:Message)=> {
    const user = await machineId()
    message.sentBy = {
      name: "name",
      clientId: user
    }

    socket.emit("post-message",message)
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
            <Chat postMessage={postMessage}/>
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}


export default hot(App);
