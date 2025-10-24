import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"
import messageState from '../chat/messageState';

export function CreateGroup({user}) {
    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const chatID = crypto.randomUUID();

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

        const chatKey = "Chat:"+chatID;
        const chatInfo = JSON.stringify({title:formData.get("groupName"),messages:tempMessageData});

        localStorage.setItem(chatKey, chatInfo)
        
        const chats = JSON.parse(localStorage.getItem("Chats")) || {};
        
        chats[chatID] = chatKey;
        localStorage.setItem("Chats", JSON.stringify(chats));

        navigate(`/chat/${chatID}`);
    }

  return (
    <div className="container-fluid text-center">
    <div className="form-format">
        <form className="form-format" onSubmit={handleFormSubmit}> 
            <input className="form-input-format" name="groupName" type="text" required placeholder="Group Name"/>
            {user.length == 0? <p>Log in to create a group</p> : <button className="form-input-format" type="submit">Create Group</button>}
        </form>
    </div>
    </div>
  );
}