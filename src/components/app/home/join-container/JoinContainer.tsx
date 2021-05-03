
import React, { SyntheticEvent, useEffect, useState } from 'react';
import './JoinContainer.css';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
import { baseUrls, defaultHeader } from '../../../../commons/http-constants';
import Modal from 'react-modal';
import Conversation from '../../../../models/Conversation';
const closeButton = require('../../../../assets/close.svg').default

const customStyles = {
    content : {
        margin: "auto",
        backgroundColor:"rgb(149, 105, 153)",
        borderRadius: 10,
        border: 0,
        padding: "0px 20px 30px 20px",
        top: 40,
        left: 40,
        minHeight: "10%",
        maxHeight: "40%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }
  }

interface JoinContainerProps {
    joinConversationByLink: Function
}

interface JoinContainerForm {
    linkInput: string
    searchInput: string
}

function JoinContainer(props: any & JoinContainerProps) {
    const [dropdown, setDropdown] = useState<boolean>(false)
    const [modalIsOpen,setIsOpen] = React.useState(false)

    const [formValue, setFormValue] = useState<JoinContainerForm>({
        linkInput: "",
        searchInput: ""
    })

    const [ conversationsSearched, setConversationsSearched ] = useState<Array<Conversation>>([])

    const expandForm = () => {
        setDropdown(!dropdown)
    }


    const handleChange = (event: any) => {
        setFormValue({ ...formValue, [event.currentTarget.name]: event.currentTarget.value })
    };


    const submitJoinByLink = (event: SyntheticEvent) => {
        event.preventDefault()
        props.joinConversationByLink(formValue.linkInput)
    }

    const submitSearchBySubject = async (event: SyntheticEvent) => {
        event.preventDefault()
        openModal()
        const unparsedConvs= await fetch(`${baseUrls.applicationServiceUrl}/conversation/subject/${formValue.searchInput}`,
        { method: 'GET', headers: defaultHeader })
        const conversations:Array<Conversation> = await unparsedConvs.json()
        console.log(conversations);
        
        setConversationsSearched(conversations)
    }

    function openModal() {
        setIsOpen(true);
      }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
      }
    
      function closeModal(){
        setIsOpen(false);
      }


    return (
        <div className={dropdown ? "join-box-expanded" : "join-box"}>
            <div onClick={expandForm} className={dropdown ? "join-message-expanded" : "join-message"}>Entrar em uma conversa<i className={dropdown ? "arrow down" : "arrow right"}></i></div>
            {dropdown ?
                <div style={{margin:"5px 0px", width:"100%"}}>
                    <Tabs>
                    <TabList style={{display:"flex", justifyContent:"flex-start"}}>
                        <Tab style={{backgroundColor: "transparent", color:"white"}}>Por link</Tab>
                        <Tab style={{backgroundColor: "transparent", color:"white"}}>Por assunto</Tab>
                    </TabList>
                    <TabPanel>
                        <form onSubmit={submitJoinByLink}>
                            <div>
                                <div className="form-container">
                                    <input className="join-input-field" name="linkInput" value={formValue.linkInput} onChange={(e) => handleChange(e)} id="conversationHash" type="text" />
                                    <button className="go-button" type="submit">Ir</button>
                                </div>
                            </div>
                        </form>
                    </TabPanel>
                    <TabPanel>
                        <form onSubmit={submitSearchBySubject}>
                            <div>
                                <div className="form-container">
                                    <input className="join-input-field" name="searchInput" value={formValue.searchInput} onChange={(e) => handleChange(e)} id="searchInput" type="text" />
                                    <button className="go-button" type="submit">Procurar</button>
                                </div>
                            </div>
                        </form>
                    </TabPanel>
                    </Tabs>
                </div>
                : <></>}
                <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          contentLabel="Search"
          style={customStyles}
        >
          
          <div>
          <div className="closing-modal">
              <img className="close-btn" alt="x" onClick={closeModal} src={closeButton}/>
          </div>
          <p>{conversationsSearched.length} {conversationsSearched.length>1 ? "resultados" : "resultado" }</p>
            <div>
                {conversationsSearched && conversationsSearched.length > 0 ?
                conversationsSearched.map((element, index)=>(
                    <div className="conversation-found" key={index}>{element?.subject}</div>
                )) 
                : <></>}
            </div>
            </div>
        </Modal>
        </div>
    )
}

export default JoinContainer