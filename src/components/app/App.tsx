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




  return (
    <HashRouter>
      <div className="app-container">
        <DesktopHeader/>
        
        <Switch>
          <Route exact path='/'>
            <Home createConversation={createConversation}/>
          </Route>
          <Route path='/chat'>
            <Chat />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}


export default hot(App);
