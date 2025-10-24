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
    const chatAsString = localStorage.getItem(`Chat:${chatID}`);
    if (!chatAsString){
      alert("Chat not found");
      setTimeout(()=>{navigate("/")}, 3000);
      return;
    }
    const chat = JSON.parse(chatAsString);

    updateTitle(chat.title);
    updateMessages(chat.messages);

    setInterval(() => {
      updateMessages((msgs) => {
        return [...msgs, {
          type:"text",
          user: "321",
          content: `This is a test`,
          state: messageState.Sending,
          id: crypto.randomUUID()
        }]
      }
      )

      updateMessages((msgs) => {
        return [...msgs, {
          type:"file",
          user: "321",
          content: `thirdPartyURLStuff`,
          state: messageState.Sending,
          id: crypto.randomUUID()
        }]
      }
      )
    }, 5000);//simulate recieving messages

  }, [chatID]);

  useEffect(() => { 
    if(chatID == null)return;

    const data = JSON.stringify({title:title, messages:messages});
    localStorage.setItem(`Chat:${chatID}`, data);
  }, [messages]);

  const sendMessage = (msg) => {
    const messageData = {type:"text",content:msg, user: user, state:messageState.Sending, id:crypto.randomUUID()}
    updateMessages((msgs) => {
        return [...msgs, messageData]
      });
      setTimeout(()=>{scrollToEnd()},50);
  };

  const sendFile = (flData) => {
        const fileMessageData = {type:"file",content:flData, user: user, state:messageState.Sending, id:crypto.randomUUID()}
    updateMessages((msgs) => {
        return [...msgs, fileMessageData]
      });
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