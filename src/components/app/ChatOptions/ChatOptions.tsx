import React, { SyntheticEvent, useContext, useState } from 'react';
import ChatCreationForm from '../../../models/ChatCreationForm';
import './ChatOptions.css';
const closeButton = require('../../../assets/close.svg').default
import Connection from '../../../commons/Connection'
import { UserContext } from '../App';

interface ChatOptions {
    backToHomeScreen: Function
}

function ChatOptions({ backToHomeScreen }: ChatOptions) {

    const { user } = useContext(UserContext)
    const [formData, setFormData] = useState<ChatCreationForm>({
        subject: "",
        isPublic: "false",
        persist: "true"
    })

    const handleChange = (event: any) => {
        setFormData({ ...formData, [event.currentTarget.name]: event.currentTarget.value })
    }

    const handleIsPublicSwitch = () => {
        const value:string= formData.isPublic === "true" ? "false" : "true"
        setFormData({ ...formData, isPublic: value })
    }

    const handlePersistSwitch = () => {
        const value:string= formData.persist === "true" ? "false" : "true"
        setFormData({ ...formData, persist: value })
    }

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault()

        const conv = {
            conversationLink: "",
            messages: [],
            subject: formData.subject,
            isPublic: formData.isPublic === "true" ? true : false,
            persist: formData.persist === "true" ? true : false,
            users: [{
              clientId: user?.clientId,
              name: user?.name
            }]
          }
          Connection.getSocket().emit("create-conversation", conv)
    }

    function closeModal() {
        backToHomeScreen()
    }

    return (
        <div className="options-modal">
            <div className="closing-modal">
                        <img className="close-btn" alt="x" onClick={closeModal} src={closeButton} />
             </div>
            <form onSubmit={handleSubmit}>
                <div className="form-section" style={{padding: "15px 0px 5px 0px", borderBottom: "solid black 1px"}}>
                   Nova Conversa
                </div>
                <div className="form-section">
                    <label htmlFor="subject">Assunto:</label>
                    <input id="subject" type="text" name="subject" onChange={handleChange} />
                </div>
                <div className="form-section">
                    <div className="form-row" style={{justifyContent:"space-between"}}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="isPublic">{formData.isPublic === "true" ? "É público " : "É privado "}</label>
                            <label className="switch">
                                <input type="checkbox" checked={formData.isPublic === "false"} onChange={handleIsPublicSwitch} />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", maxWidth: "50%" }}>
                            <label htmlFor="isPublic">{formData.persist === "false" ? "Descartada após terminada" : "Não descartada"}</label>
                            <label className="switch">
                                <input type="checkbox" checked={formData.persist === "false"} onChange={handlePersistSwitch} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-section" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="create-form-button" onSubmit={handleSubmit} type="submit">Criar</button>
                </div>
            </form>
        </div>
    )
}

export default ChatOptions