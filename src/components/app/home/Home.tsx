import React, { useEffect, useState } from 'react';
import './Home.css';
import JoinContainer from './join-container/JoinContainer';
import UserName from './UserName/UserName';

const appLogo = require('../../../assets/speech-bubble-svgrepo-com.svg').default

interface HomeProps {
    showNewChatOptions: Function
}

function Home({ showNewChatOptions }: HomeProps) {
    
    const onClickOpenNewConversation = ()=> {
      showNewChatOptions()
    }


  
    return (

      <div className="home-container">
        <div style={{margin:25}}>
          <img style={{height:100}} alt="logo" src={appLogo}/>
        </div>
        <UserName/>
        <div>
            <button className="creation-button" onClick={onClickOpenNewConversation}>
            Criar conversa
            </button>
        </div>
        <JoinContainer/>
        
      </div>
      
    );
  }
  
  
  export default Home;
  