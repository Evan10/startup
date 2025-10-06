import React from 'react';
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
  return (
    <BrowserRouter>
    <div classNameName="body bg-dark text-light">
      <header>
        <h1 id="Title">WorkCircle</h1>
            <nav className="d-flex justify-content-center py-3">
                <menu className="nav nav-pills">
                    <li className="nav-item"><NavLink className="nav-link" to="">Home</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="login">Login</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="join_group">Join Group</NavLink></li>
                </menu>
            </nav>
        </header>

      <Routes>
        <Route path='/' element={<LandingPage />} exact />
        <Route path='/login' element={<Login />} />
        <Route path='/join_group' element={<JoinGroup />} />
        <Route path='/create_group' element={<CreateGroup/>} />
        <Route path='/chat' element={<Chat/>}/>
        <Route path='*' element={<NotFound />} />
      </Routes>

        <footer>
            <hr/>
                <p>Author Name:</p>
            <hr/>
            <p><a href="https://github.com/Evan10">Evan Royal</a></p>
        </footer>
    </div>
     </BrowserRouter>
  );
}



function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}