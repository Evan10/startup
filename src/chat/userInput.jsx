import "./chat.css"
import "../app.css"

import messageState from "./messageState"
import React, { useEffect, useState, useRef } from 'react';

export function UserInput({onSendMessage, onFileSend}) {
    const inputRef = useRef(null);  
    const fileSelectorRef = useRef(null);
    

    const handleSend = () => {
        const messageText = inputRef.current.value;
        if(messageText.trim() !== ""){
            onSendMessage(messageText);
            inputRef.current.value = "";
        }

    }

    const handleKeyDown = (e) =>{
        if (e.key === "Enter"){
            e.preventDefault();
            handleSend();
    
        }

    }


    const handleSendFile = (e) => {
        const file = e.target.files[0];
        onFileSend(file.name);
    }

    return (
        <div id="message-input-container">
            
            <input onKeyDown={handleKeyDown} ref={inputRef} className="rounded-corners" type="text" placeholder="send message..."/>
            <button onClick={handleSend}>Send</button>
            <input ref={fileSelectorRef} type="file" onChange={handleSendFile} style={{display:"none"}}/>
            <button onClick={()=>fileSelectorRef.current.click()}>Files</button>
        
        </div>);
}
