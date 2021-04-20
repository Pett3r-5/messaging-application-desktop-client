import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import JoinContainer from './join-container/JoinContainer';

const appLogo = require('../../../assets/speech-bubble-svgrepo-com.svg').default

interface HomeProps {
    createConversation: Function
    joinConversationByLink: Function
}

function Home({ createConversation, joinConversationByLink }: HomeProps) {

    
    const onClickCreateConversation = ()=> {
      console.log("here1")
      createConversation();
    }

  
    return (

      <div className="home-container">
        <div style={{margin:50}}>
          <img style={{height:100}} alt="logo" src={appLogo}/>
        </div>
  
        <div>
            <button className="creation-button" onClick={onClickCreateConversation}>
            Criar conversa
            </button>
        </div>
        <JoinContainer joinConversationByLink={joinConversationByLink}/>
        
      </div>
      
    );
  }
  
  
  export default Home;
  