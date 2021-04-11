import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader/root";
import './App.css';
import JoinContainer from './join-container/JoinContainer';
import io from 'socket.io-client';
import DesktopHeader from './desktop-header/DesktopHeader';

const appLogo = require('../../assets/speech-bubble-svgrepo-com.svg').default


function App() {

  useEffect(()=>{

    const socket = io("http://localhost:5000");
    socket.on('connect', function(){
      console.log("Connected")
      socket.emit("test-event", {prop: "some word"})
    });
    

    socket.on('disconnect', function(){
      console.log("Disconnected")
    });
  }, [])


  return (
    <div style={{margin: 0, padding: 0}}>
      <DesktopHeader/>
    <div className="App">
      <div style={{margin:50}}>
        <img style={{height:100}} alt="logo" src={appLogo}/>
      </div>

      <div>
        <button className="creation-button">
        Criar convers
        </button>
      </div>
      <JoinContainer/>
      
    </div>
    </div>
    
  );
}


export default hot(App);
