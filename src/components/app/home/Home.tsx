import React, { useEffect, useState } from 'react';
import User from '../../../models/User';
import './Home.css';
import JoinContainer from './join-container/JoinContainer';
import UserName from './UserName/UserName';

const appLogo = require('../../../assets/bubble-logo5.png').default

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
          <img style={{height:90}} alt="logo" src={appLogo}/>
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
  