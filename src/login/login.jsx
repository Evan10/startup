import React from 'react';
import {useNavigate} from "react-router-dom"
import "../app.css"

export function Login({updateUser, user}) {
    const navigate = useNavigate();
     
    const handleLogin = (e) =>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username"), password = formData.get("password");
        if(!username || !password){
            alert("Please fill out all required fields!");
            return;
        }
            
        fetch("/api/auth/login",{method:"post",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({
            username:username,
            password:password
        })})
        .then(res=>res.json())
        .then(res=>{if(res.success){
            updateUser(username)
            localStorage.setItem("username",username);
            navigate("/");
        }else{
            throw new Error(res.message);
        }})
        .catch((reason)=>{alert(reason)});
    }

        const handleNewAccount= (e) =>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username"), password = formData.get("password");
        if(!username || !password){
            alert("Please fill out all required fields!");
            return;
        }
        
        fetch("/api/auth/create",{method:"POST", 
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({
            username:username,
            password:password
        })})
        .then(res=>res.json())
        .then(res=>{if(res.success){
            localStorage.setItem("username",username);
            updateUser(formData.get("username"));
            navigate("/")
        }else{
            throw new Error(res.message);
        }})
        .catch((reason)=>{alert(reason)});
    }

    const handleLogout = () => {
        fetch("/api/auth/logout",{method:"DELETE"});
        updateUser("");
    }

    return (
        <div className="container-fluid text-center">
            <div className="container col-12">
                {user.length !=0 && (<div className="col-8 offset-2 card">
                    <p>Hello {user}</p>
                    <button onClick={handleLogout}>Log out</button>
                </div>)}

                {user.length == 0 && (  <div>
                    <div className="col-8 offset-2 card">
                        <div id="login" className=" card-body ">
                            <form onSubmit={handleLogin} id="login-form" className="form-format">
                                <div className="form-body d-flex flex-column align-items-center">
                                    <input className="row w-75" name="username" id="username" type="text" required placeholder="username" />
                                    <input className="row w-75" name="password" id="password" type="password" required placeholder="password" />
                                    <button id="login-submit" type="submit" className="row">Log in</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-8 offset-2 card">
                        <div id="new-account" className="justify-content-center card-body ">
                            <form onSubmit={handleNewAccount} id="new-account-form" className="form-format">
                                <div className="form-body d-flex flex-column align-items-center">
                                    <input className="row w-75" name="username" id="new-username" type="text" required placeholder="username" />
                                    <input className="row w-75" name="password" id="new-password" type="password" required placeholder="password" />
                                    <button id="new-account-submit" type="submit" className="row">Create Account</button>
                                </div>
                                <p></p>
                            </form>
                        </div>
                    </div>
                    </div>
                 )} 
            </div>
        </div>
    );
}