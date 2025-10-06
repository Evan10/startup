import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"

export function Login() {
     const navigate = useNavigate();

    const handleFormSubmit = (e) =>{
        e.preventDefault();
        navigate("/");
    }

    return (
        <main classNameName="container-fluid bg-secondary text-center">
            <div className="container col-12">
                <div className="col-8 offset-2 card">
                    <div id="login" className=" card-body ">
                        <form onSubmit={handleFormSubmit} id="login-form" className="form-format">
                            <div className="form-body d-flex flex-column align-items-center">
                                <input className="row w-75" id="username" type="text" required placeholder="username" />
                                <input className="row w-75" id="password" type="password" required placeholder="password" />
                                <button id="login-submit" type="submit" className="row">Log in</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-8 offset-2 card">
                    <div id="new-account" className="justify-content-center card-body ">
                        <form onSubmit={handleFormSubmit} id="login-form" className="form-format">
                            <div className="form-body d-flex flex-column align-items-center">
                                <input className="row w-75" id="new-username" type="text" required placeholder="username" />
                                <input className="row w-75" id="new-password" type="password" required placeholder="password" />
                                <button id="new-account-submit" type="submit" className="row">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}