import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"

export function CreateGroup() {
    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        navigate("/chat");
    }

  return (
    <main className="container-fluid bg-secondary text-center">
    <div className="form-format">
        <form className="form-format" onSubmit={handleFormSubmit}> 
            <input className="form-input-format" type="text" required placeholder="Group Name"/>
            <button className="form-input-format" type="submit">Create Group</button>
        </form>
    </div>
    </main>
  );
}