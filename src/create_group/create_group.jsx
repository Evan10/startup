import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"
import messageState from '../chat/messageState';

export function CreateGroup({user, AvailableChats, updateChats}) {
    const navigate = useNavigate();

    const handleCreateChat = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const groupName = formData.get("groupName");

        fetch("/api/chat/createChat", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({
          title:groupName
        })})
        .then(res=>res.json())
        .then(res=>{
          updateChats([...AvailableChats, {title:groupName, chatID:res.chatID}]);
          navigate(`/chat/${res.chatID}`);
        });

        
        
    }

  return (
    <div className="container-fluid text-center">
    <div className="form-format">
        <form className="form-format" onSubmit={handleCreateChat}> 
            <input className="form-input-format" name="groupName" type="text" required placeholder="Group Name"/>
            {user.length == 0? <p>Log in to create a group</p> : <button className="form-input-format" type="submit">Create Group</button>}
        </form>
    </div>
    </div>
  );
}