import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client/build/socket';
import User from '../../../models/User';
import './Home.css';
import JoinContainer from './join-container/JoinContainer';
import UserName from './UserName/UserName';

const appLogo = require('../../../assets/speech-bubble-svgrepo-com.svg').default

interface HomeProps {
    user: User
    showNewChatOptions: Function
    editUsername: Function
    joinConversationByLink: Function
}

function Home({ user, showNewChatOptions, joinConversationByLink, editUsername }: HomeProps) {
    useEffect(()=>{

    }, [user])
    
    const onClickOpenNewConversation = ()=> {
      showNewChatOptions()
    }


  
    return (

      <div className="home-container">
        <div style={{margin:25}}>
          <img style={{height:100}} alt="logo" src={appLogo}/>
        </div>
        <UserName user={user} editUsername={editUsername} />
        <div>
            <button className="creation-button" onClick={onClickOpenNewConversation}>
            Criar conversa
            </button>
        </div>
        <JoinContainer joinConversationByLink={joinConversationByLink}/>
        
      </div>
      
    );
  }
  
  
  export default Home;
  