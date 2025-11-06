import "./chat.css"
import "../app.css"

import messageState from "./messageState"
import React, { useEffect, useState, useRef } from 'react';

export function UserInput({onSendMessage, getDogPhoto}) {
    const inputRef = useRef(null);  
    
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


    const handleGetDogPicture = async (e) => {
        await getDogPhoto();
    }

    return (
        <div id="message-input-container">
            
            <input onKeyDown={handleKeyDown} ref={inputRef} className="rounded-corners" type="text" placeholder="send message..."/>
            <button onClick={handleSend}>Send</button>
            <button onClick={handleGetDogPicture}>Get dog picture</button>
        
        </div>);
}
