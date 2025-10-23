import React, { useEffect, useState } from 'react';
import "../app.css"
import { UserInput } from './userInput';
import {Message} from './message';
import messageState from "./messageState"

export function Chat({ user, chatId }) {
  const [messages, updateMessages] = useState([]);
  const [title, updateTitle] = useState("Title Loading...");
  useEffect(() => {
    const tempMessageData = [{
      user: "123",
      text: "This is a text message",
      state: messageState.Seen
    }, {
      user: "321",
      text: "This is another text message",
      state: messageState.Seen
    }, {
      user: "123",
      text: "testing",
      state: messageState.Delivered
    }, {
      user: "123",
      text: "This is yet another message",
      state: messageState.Sending
    }]
    updateMessages(tempMessageData);

  }, []);

  return (
    <main className="container-fluid bg-secondary text-center">
      <div id="chat-container">
        <div id="message-container">
          {
            messages.length === 0 ? (<p>Loading...</p>) :
              (messages.map((p, i) => {
                <Message id={i} state={p.state} fromUser={p.user == user} text={p.text} />
              }))
          }
        </div>
        <hr />
        <UserInput />
      </div>
    </main>
  );
}