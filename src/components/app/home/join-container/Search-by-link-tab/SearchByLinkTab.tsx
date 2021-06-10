import React, { SyntheticEvent, useContext, useState } from 'react';
import { ConversationLinkContext } from '../../../App';
import './SearchByLinkTab.css';


function SearchByLinkTab() {
    const [searchInput, setSearchInput] = useState("")
    const { joinConversationByLink } = useContext(ConversationLinkContext)

    const handleChange = (event: any) => {
        setSearchInput(event.currentTarget.value)
    };


    const submitJoinByLink = (event: SyntheticEvent) => {
        event.preventDefault()
        if(joinConversationByLink) {
            joinConversationByLink(searchInput, true)
        }
    }

    return (
        <form onSubmit={submitJoinByLink}>
            <div>
                <div className="form-container">
                    <input className="join-input-field" name="linkInput" value={searchInput} onChange={(e) => handleChange(e)} id="conversationHash" type="text" />
                    <button className="go-button" type="submit">Ir</button>
                </div>
            </div>
        </form>
    )
}

export default SearchByLinkTab