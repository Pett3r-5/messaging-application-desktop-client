import './DesktopHeader.css'
const remote = window.require('electron').remote;
import React, { useEffect, useState } from 'react';
const closeButton = require('../../assets/close.svg').default

function DesktopHeader() {
    const BrowserWindow = remote.BrowserWindow;

    const closeWindow = ()=> {
        const window = BrowserWindow.getFocusedWindow();
        window!.close();
    }

    return (
        <div>
            <div id="title-bar-btns">
                <img id="close-btn" alt="x" onClick={closeWindow} src={closeButton}/>
            </div>
        </div>
    )
}

export default DesktopHeader;