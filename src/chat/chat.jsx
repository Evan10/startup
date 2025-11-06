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
      }else{return res;}}).then((res)=>res.json())
      .then((chat)=>{
        updateTitle(chat.title);
        chat.messages.forEach(element => {
          element.state = messageState.Delivered
        });
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

    fetch("/api/chat/sendMessage", {method:"POST",headers:{"Content-Type":"application/json"}, body:JSON.stringify({
      chatID:chatID,
      message:messageData
    })});

    setTimeout(()=>{scrollToEnd()},50);
  };

  const sendFile = async (flData) => {
    const formData = new FormData()
    formData.append("file",flData);
    const res = awaitfetch("https://0x0.st", {method:'POST',body:formData})
    res = await res.json();
    const storageURL = res.text();

    console.log(storageURL);


    const fileMessageData = {type:"file",content:flData.name, location: storageURL, user: user, state:messageState.Sending, id:crypto.randomUUID()}
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