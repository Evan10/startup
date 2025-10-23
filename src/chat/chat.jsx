import React, { useEffect, useState } from 'react';
import "../app.css"
import "./chat.css"
import { UserInput } from './userInput';
import { Message } from './message';
import messageState from "./messageState"

export function Chat({ user, chatId }) {
  const [messages, updateMessages] = useState([]);
  const [title, updateTitle] = useState("Title Loading...");

  useEffect(() => {
    const tempMessageData = [{
      user: "123",
      text: "This is a text message",
      state: messageState.Seen,
      id: crypto.randomUUID()
    }, {
      user: "321",
      text: "This is another text message",
      state: messageState.Seen,
      id: crypto.randomUUID()
    }, {
      user: "123",
      text: "testing",
      state: messageState.Delivered,
      id: crypto.randomUUID()
    }, {
      user: "123",
      text: "This is yet another message",
      state: messageState.Sending,
      id: crypto.randomUUID()
    }]
    updateMessages(tempMessageData);

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
    console.log("Messages updated:", messages);
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
        <hr />
        <UserInput />
      </div>
    </div>
  );
}