
import React, { useState } from 'react';
import './JoinContainer.css';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
import SearchBySubjectTab from './Search-by-subject-tab/SearchBySubjectTab';
import SearchByLinkTab from './Search-by-link-tab/SearchByLinkTab';


function JoinContainer(props: any) {
    const [dropdown, setDropdown] = useState<boolean>(false)
    
    const expandForm = () => {
        setDropdown(!dropdown)
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
                        <SearchByLinkTab/>
                    </TabPanel>
                    <TabPanel>
                        <SearchBySubjectTab/>
                    </TabPanel>
                    </Tabs>
                </div>
                : <></>}
        </div>
    )
}

export default JoinContainer