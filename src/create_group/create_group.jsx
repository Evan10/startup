import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"

export function CreateGroup({user}) {
    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const chatID = crypto.randomUUID();

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