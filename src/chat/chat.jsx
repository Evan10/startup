import React, { useEffect, useState, useRef } from 'react';
import "../app.css"
import "./chat.css"
import { UserInput } from './userInput';
import { Message } from './message';
import { DogImageMessage } from "./DogImageMessage"
import messageState from "./messageState"
import { useParams,useNavigate } from 'react-router-dom';
import {getChatWebSocket, TYPE_CONNECT_TO_CHAT, TYPE_MESSAGE} from "./chatWebSocket";

export function Chat({ user, chatId }) {
  const [messages, updateMessages] = useState([]);
  const [title, updateTitle] = useState("Title Loading...");
  const [joinCode, updateJoinCode] = useState("");
  const {chatID} = useParams();
  const navigate = useNavigate();
  let cws = getChatWebSocket();
  const endOfSectionRef = useRef(null);


  useEffect(() => {
    cws.addHandler((msg)=>{
      if(msg?.type == TYPE_MESSAGE){
        const data = msg?.data;
        updateMessages((msgs) => {
          return [...msgs, data]
        });
      }
    })
   },[]);

  useEffect(() => { 
    console.log(chatID);

    const wsMessage = {"type":TYPE_CONNECT_TO_CHAT, "chatID":chatID};
    cws.sendMessage(wsMessage);

    fetch(`/api/chat/getChat?chatID=${chatID}&isGuest=${!user}`,{
        method:'GET',
        headers: { 'Content-Type': 'application/json' }}) 
      .then((res)=>{
        if(!res.ok){
          throw new Error("Chat not found");
        }
        return res.json()})
      .then((chat)=>{
        updateTitle(chat.title);
        updateJoinCode(chat.joinCode);
        chat.messages.forEach(element => {
          element.state = messageState.Delivered
        });
        updateMessages(chat.messages);
      }).catch((err)=>{
        alert(err.message);
        setTimeout(()=>{navigate("/")}, 3000);
      });
  }, [chatID]);


  const sendMessage = (msg) => {
    const messageData = {type:"text",content:msg, user: user, state:messageState.Sending, id:crypto.randomUUID()}

    const wsMessage = {type:TYPE_MESSAGE, "data":messageData};
    cws.sendMessage(wsMessage);

    updateMessages((msgs) => {
        return [...msgs, messageData]
      });

    fetch("/api/chat/sendMessage", {method:"POST",headers:{"Content-Type":"application/json"}, body:JSON.stringify({
      chatID:chatID,
      message:messageData
    })});

    setTimeout(()=>{scrollToEnd()},50);
  };

  const getDogPhoto = async () => {
    let res = await fetch("https://dog.ceo/api/breeds/image/random");
    res = await res.json();


    const messageData = {type:"image",content:res.message, user: user, state:messageState.Sending, id:crypto.randomUUID()}

    const wsMessage = {type:TYPE_MESSAGE, "data":messageData};
    cws.sendMessage(wsMessage);

    updateMessages((msgs) => {
      return [...msgs, messageData]
    });


    fetch("/api/chat/sendMessage", {method:"POST",headers:{"Content-Type":"application/json"}, body:JSON.stringify({
      chatID:chatID,
      message:messageData
    })});

    setTimeout(()=>{scrollToEnd()},50);
  }

  const scrollToEnd = () => {
    endOfSectionRef.current.scrollIntoView({behavior:"smooth"});
  }

  return (
    <div className="container-fluid text-center">
      <div className='chat-header'>
        <h5>{title}</h5>
        <h6>Join Code: {joinCode}</h6>
      </div>
        <div id="chat-container">
            <div id="message-container">
              {
                !messages ? (<p>Loading...</p>) :
                  (messages.map((p) => (
                    p.type === "text" ?
                    <Message key={p.id} messageData={p} fromUser={user == p.user} />:
                    <DogImageMessage key={p.id} messageData={p} fromUser={user == p.user} />
                  )))
              }
              <div ref={endOfSectionRef}></div>
            </div>
          </div>
        <UserInput onSendMessage={sendMessage} getDogPhoto={getDogPhoto}/>
    </div>
  );
}