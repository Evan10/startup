import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { LandingPage } from './landing_page/landing_page';
import { JoinGroup } from './join_group/join_group';
import { Chat } from "./chat/chat"
import { CreateGroup } from './create_group/create_group';
import "./app.css"

export default function App() {

  const [user, updateUser] = useState("");
  const [AvailableChats, updateChats] = useState([]);

  const logoutCleanup = () =>{
    updateChats([]);
  }

  const loadUserChats = ()=>{
    fetch("/api/chat/getUserChats", { method: 'GET', headers: { "Content-Type": "application/json" }})
          .then((res)=>{
            if(res.ok){return res.json()}else{return false}})
          .then((res)=>{
              updateChats(res);
          })
          .catch(err=>{});
  }; 

  useEffect(() => {
    fetch("/api/auth/getSelf", {method: "GET",headers:{"Content-Type":"application/json"}})
    .then((res)=>res.json())
    .then(res=>{
      if("username" in res){
        updateUser(res.username);
      }
    }).catch(err=>{});
  }, []);

  useEffect(()=>{
    loadUserChats();
  },[user]);

  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <h1 id="Title">WorkCircle</h1>
          <nav className="d-flex justify-content-center py-3">
            <menu className="nav nav-pills">
              <li className="nav-item"><NavLink className="nav-link" to="">Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="login">Login</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="join_group">Join Group</NavLink></li>

              {user.length !== 0 && (<li className="nav-link nav-item dropdown">
                <span>Chats</span>
                <ul className='dropdown-menu'>
                  {AvailableChats && AvailableChats.map((c) => {
                     return <li key={c.chatID} >
                      <NavLink  className=" dropdown-item" to={`/chat/${c.chatID}`}>{c.title}</NavLink>
                      </li> 
                    })}
                </ul>
              </li>)
              }

            </menu>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path='/' element={<LandingPage user={user} />} exact />
            <Route path='/login' element={<Login logoutCleanup={logoutCleanup} updateUser={updateUser} user={user} />} />
            <Route path='/join_group' element={<JoinGroup user={user} />} />
            <Route path='/create_group' element={<CreateGroup user={user} />} />
            <Route path='/chat/:chatID' element={<Chat user={user} />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
        <footer className='d-flex flex-column justify-content-start'>
          <hr className="m-0" />
          <div className="d-flex flex-row justify-content-between">
            <p>Author Name:</p>
            <p><a href="https://github.com/Evan10/startup">Evan Royal</a></p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}



function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}