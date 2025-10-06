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

            <div class="col-8 offset-2 card">
                <div id="join-group-form" class=" card-body ">
                    <form id="login-form" class="form-format" onSubmit={handleFormSubmit}>
                        <div class="form-body d-flex flex-column align-items-center">
                            <input class="form-input-format" type="text" required placeholder="Enter Room Code" />
                            <input class="form-input-format" type="text" required placeholder="Choose a name" />
                            <button type="submit">Join Room</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
