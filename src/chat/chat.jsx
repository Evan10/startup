import React, { useEffect, useState, useRef } from 'react';
import "../app.css"
import "./chat.css"
import { UserInput } from './userInput';
import { Message } from './message';
import { FileMessage } from "./fileMessage"
import messageState from "./messageState"
import { useParams,useNavigate } from 'react-router-dom';

export function Chat({ user, chatId }) {
  const [messages, updateMessages] = useState([]);
  const [title, updateTitle] = useState("Title Loading...");
  const {chatID} = useParams();
  const navigate = useNavigate();

  const endOfSectionRef = useRef(null);

  useEffect(() => { 
    console.log(chatID)
    fetch(`/api/chat/getChat?chatID=${chatID}&isGuest=!${!user}`,{
        method:'GET',
        headers: { 'content-type': 'application/json' }}) 
      .then((res)=>{if(!res.ok){
        throw new Error("Chat not found");
      }}).then((res)=>res.json())
      .then((chat)=>{
        updateTitle(chat.title);
        updateMessages(chat.messages);
      }).catch((err)=>{
        alert(err.message);
        setTimeout(()=>{navigate("/")}, 3000);
      });
  }, []);


  const sendMessage = (msg) => {
    const messageData = {type:"text",content:msg, user: user, state:messageState.Sending, id:crypto.randomUUID()}
    updateMessages((msgs) => {
        return [...msgs, messageData]
      });

    fetch("/api/chat/sendMessage", {method:"POST", body:{
      chatID:chatID,
      message:messageData
    }});

    setTimeout(()=>{scrollToEnd()},50);
  };

  const sendFile = (flData) => {
    const fileMessageData = {type:"file",content:flData, user: user, state:messageState.Sending, id:crypto.randomUUID()}
    updateMessages((msgs) => {
      return [...msgs, fileMessageData]
    });
    
    fetch("/api/chat/sendMessage", {method:"POST", body:{
      chatID:chatID,
      message:fileMessageData
    }});

    setTimeout(()=>{scrollToEnd()},50);
  }

  const scrollToEnd = () => {
    endOfSectionRef.current.scrollIntoView({behavior:"smooth"});
  }

  return (
    <div className="container-fluid text-center">
        <div id="chat-container">
            <div id="message-container">
              {
                !messages ? (<p>Loading...</p>) :
                  (messages.map((p) => (
                    p.type === "text" ?
                    <Message key={p.id} messageData={p} fromUser={user == p.user} />:
                    <FileMessage key={p.id} messageData={p} fromUser={user == p.user} />
                  )))
              }
              <div ref={endOfSectionRef}></div>
            </div>
          </div>
        <UserInput onSendMessage={sendMessage} onFileSend={sendFile}/>
    </div>
  );
}