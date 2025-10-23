import React, { useEffect, useState } from 'react';
import "../app.css"
import { UserInput } from './userInput';
import messageState from "./messageState"

export function Chat({user, chatId}) {
  [messages, updateMessages] = useState({});
  [title, updateTitle] = useState("Title Loading...");
  useEffect(()=>{
    const tempMessageData = [{
      user:"123",
      text:"This is a text message",
      state:messageState.Seen
    },{
      user:"321",
      text:"This is another text message",
      state:messageState.Seen
    },{
      user:"123",
      text:"testing",
      state:messageState.Delivered
    },{
      user:"123",
      text:"This is yet another message",
      state:messageState.Sending
    }]
    updateMessages(tempMessageData);

  },[]);

  return (
    <main classNameName="container-fluid bg-secondary text-center">
      <div id="chat-container">
        <div id="message-container">
          {
          !messages?<p>Loading...</p>:
            messages.map((p) =>{
              <Message state={message.state} fromUser={p.user == user} text={p.text}/>
            })
          }
        </div>
        <hr/>
        <UserInput/>
    </div>
    </main>
  );
}