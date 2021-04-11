import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { hot } from "react-hot-loader/root";
import { machineId } from 'node-machine-id';

import './App.css';
import io from 'socket.io-client';
import DesktopHeader from './desktop-header/DesktopHeader';
import Home from './home/Home';
import Chat from './chat/Chat';


function App() {
  let socket:any;

  useEffect(()=>{

    socket = io("http://localhost:5000");
    socket.on('connect', function(){
      console.log("Connected")
      socket.emit("test-event", {prop: "some word"})
    });
    

    socket.on('disconnect', function(){
      console.log("Disconnected")
    });
  }, [])
  
  const createConversation = async ()=> {
    const user = await machineId()
    console.log(`user: ${user}`)
    socket.emit("create-conversation", {owner: user})
  }




  return (
    <HashRouter>
      <div style={{margin: 0, padding: 0}}>
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
