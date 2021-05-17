import React, { SyntheticEvent, useState } from 'react';
import './SearchBySubjectTab.css';
import { baseUrls, defaultHeader } from '../../../../../commons/http-constants';
import Modal from 'react-modal';
import Conversation from '../../../../../models/Conversation';
const closeButton = require('../../../../../assets/close.svg').default

interface SearchBySubjectTabProps {
    joinConversationByLink: Function
}


const customStyles = {
    content: {
        margin: "auto",
        backgroundColor: "rgb(149, 105, 153)",
        borderRadius: 10,
        border: 0,
        padding: "0px 20px 30px 20px",
        top: 40,
        left: 40,
        minHeight: "10%",
        maxHeight: "40%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "1px 1px 3px #111111"
    },
    overlay: {
        backgroundColor: "invisible"
    }
}



function SearchBySubjectTab({ joinConversationByLink }: SearchBySubjectTabProps) {
    const [searchInput, setSearchInput] = useState("")
    const [modalIsOpen, setIsOpen] = React.useState(false)
    const [conversationsSearched, setConversationsSearched] = useState<Array<Conversation>>([])

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleChange = (event: any) => {
        setSearchInput(event.currentTarget.value)
    };

    const submitSearchBySubject = async (event: SyntheticEvent) => {
        event.preventDefault()
        openModal()
        const unparsedConvs = await fetch(`${baseUrls.applicationServiceUrl}/conversation/subject/${searchInput}`,
            { method: 'GET', headers: defaultHeader })
        const conversations: Array<Conversation> = await unparsedConvs.json()
        console.log(conversations);

        setConversationsSearched(conversations)
    }

    const joinConversationBySubject = (conversationLink: string) => {
        if (!!conversationLink) {
            joinConversationByLink(conversationLink)
            closeModal()
        }
    }

    return (
        <>
            <form onSubmit={submitSearchBySubject}>
                <div>
                    <div className="form-container">
                        <input className="join-input-field" name="searchInput" value={searchInput} onChange={(e) => handleChange(e)} id="searchInput" type="text" />
                        <button className="go-button" type="submit">Procurar</button>
                    </div>
                </div>
            </form>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Search"
                style={customStyles}>

                <div>
                    <div className="closing-modal">
                        <img className="close-btn" alt="x" onClick={closeModal} src={closeButton} />
                    </div>
                    <p>{conversationsSearched.length} {conversationsSearched.length > 1 ? "resultados" : "resultado"}</p>
                    <div>
                        {conversationsSearched && conversationsSearched.length > 0 ?
                            conversationsSearched.map((element, index) => (
                                <div className="conversation-found" key={index} onClick={() => joinConversationBySubject(element?.conversationLink)}>{element?.subject}</div>
                            ))
                            : <></>}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default SearchBySubjectTab