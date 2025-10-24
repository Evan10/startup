import React, { useEffect, useState } from 'react';
import "../app.css"
import "./chat.css"
import { UserInput } from './userInput';
import { Message } from './message';
import messageState from "./messageState"
import { useParams,useNavigate } from 'react-router-dom';

export function Chat({ user, chatId }) {
  const [messages, updateMessages] = useState([]);
  const [title, updateTitle] = useState("Title Loading...");
  const {chatID} = useParams();
  const navigate = useNavigate();

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
          user: "321",
          text: `This is a test`,
          state: messageState.Sending,
          id: crypto.randomUUID()
        }]
      }
      )

    }, 5000);//simulate recieving messages

  }, []);

  useEffect(() => { 
    if(chatID == null)return;

    const data = JSON.stringify({title:title, messages:messages});
    localStorage.setItem(`Chat:${chatID}`, data);
  }, [messages]);

  const sendMessage = (msg) => {
    const messageData = {text: msg, user: user, state:messageState.Sending, id:crypto.randomUUID()}
    updateMessages((msgs) => {
        return [...msgs, messageData]
      });
  };

  return (
    <div className="container-fluid text-center">
        <div id="chat-container">
            <div id="message-container">
              {
                !messages ? (<p>Loading...</p>) :
                  (messages.map((p) => (
                    <Message key={p.id} messageData={p} fromUser={user == p.user} />
                  )))
              }
            </div>
          </div>
        <UserInput onSend={sendMessage}/>
    </div>
  );
}