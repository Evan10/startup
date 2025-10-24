import "./chat.css"
import "../app.css"

import messageState from "./messageState"
import React, { useEffect, useState, useRef } from 'react';

export function UserInput({onSend}) {
    const inputRef = useRef(null);

    const handleSend = () => {
        const messageText = inputRef.current.value;
        if(messageText.trim() !== ""){
            onSend(messageText);
            inputRef.current.value = "";
        }        

    }

    const handleSendFile = () => {

    }

    return (
        <div id="message-input-container">
            
            <input ref={inputRef} className="rounded-corners" type="text" placeholder="send message..."/>
            <button onClick={handleSend}>Send</button>
            <button onClick={handleSendFile}>Files</button>
            
        </div>);
}
