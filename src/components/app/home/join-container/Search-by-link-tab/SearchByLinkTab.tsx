import React, { SyntheticEvent, useEffect, useState } from 'react';
import './SearchByLinkTab.css';


interface SearchByLinkTabProps {
    joinConversationByLink: Function
}

function SearchByLinkTab({ joinConversationByLink }: SearchByLinkTabProps) {
    const [searchInput, setSearchInput] = useState("")

    const handleChange = (event: any) => {
        setSearchInput(event.currentTarget.value)
    };


    const submitJoinByLink = (event: SyntheticEvent) => {
        event.preventDefault()
        joinConversationByLink(searchInput, true)
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