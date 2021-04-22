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
    createConversation: Function
    editUsername: Function
    joinConversationByLink: Function
}

function Home({ user, createConversation, joinConversationByLink, editUsername }: HomeProps) {
    useEffect(()=>{

    }, [user])
    
    const onClickCreateConversation = ()=> {
      createConversation()
    }


  
    return (

      <div className="home-container">
        <div style={{margin:25}}>
          <img style={{height:100}} alt="logo" src={appLogo}/>
        </div>
        <UserName user={user} editUsername={editUsername} />
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
  