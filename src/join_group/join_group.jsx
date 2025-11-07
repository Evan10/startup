import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"


export function JoinGroup({user, updateChats}) {
    const navigate = useNavigate();

        const handleFormSubmit = async (e) =>{
            e.preventDefault();
            const formData = new FormData(e.target);
            const roomCode = formData.get("roomCode");
            const username = user || formData.get("username");
            if(!roomCode){
                alert("Please enter a room code");
                return
            }
            if(!username){
                alert("Please choose a username or sign in");
                return;
            }
            let res = await fetch("/api/chat/JoinChat",{method:"PATCH", 
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({joinCode:roomCode, username:username})});

            res = await res.json();
            if(!res?.chatID){
                return;
            }
            updateChats((chats)=>[...chats, {chatID:res.chatID, title:res.title}]);
            navigate(`/chat/${res.chatID}`);
        }

    return (
        <div className="container-fluid text-center">

            <div className="col-8 offset-2 card">
                <div id="join-group-form" className=" card-body ">
                    <form id="login-form" className="form-format" onSubmit={handleFormSubmit}>
                        <div className="form-body d-flex flex-column align-items-center">
                            <input className="form-input-format" name="roomCode" type="text" required placeholder="Enter Room Code" />
                            {!user && <input className="form-input-format" name="username" type="text" required placeholder="Choose a name" />}
                            <button type="submit">Join Room</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
