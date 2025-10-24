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
  useEffect(() => { 
    const chatAsString = localStorage.getItem(`Chat:${chatID}`);
    if (!chatAsString){
      alert("Chat not found");

    }
    const chat = JSON.parse(localStorage.getItem(`Chat:${chatID}`));
    updateTitle(chat.title);
    updateMessages(chat.tempMessageData);

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
    localStorage.setItem(`Chat:${chatID}`, );
  }, [messages]);




  return (
    <div className="container-fluid text-center">
        <div id="chat-container">
            <div id="message-container">
              {
                messages.length === 0 ? (<p>Loading...</p>) :
                  (messages.map((p) => (
                    <Message key={p.id} messageData={p} fromUser={user == p.user} />
                  )))
              }
            </div>
          </div>
        <UserInput />
    </div>
  );
}