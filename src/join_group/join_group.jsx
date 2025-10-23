import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"


export function JoinGroup() {
    const navigate = useNavigate();

        const handleFormSubmit = (e) =>{
            e.preventDefault();
            navigate("/chat");
        }

    return (
        <main className="container-fluid bg-secondary text-center">

            <div className="col-8 offset-2 card">
                <div id="join-group-form" className=" card-body ">
                    <form id="login-form" className="form-format" onSubmit={handleFormSubmit}>
                        <div className="form-body d-flex flex-column align-items-center">
                            <input className="form-input-format" type="text" required placeholder="Enter Room Code" />
                            <input className="form-input-format" type="text" required placeholder="Choose a name" />
                            <button type="submit">Join Room</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
