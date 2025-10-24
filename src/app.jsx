import React, {useState} from 'react';
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
                </menu>
            </nav>
        </header>
      <main>
      <Routes>
        <Route path='/' element={<LandingPage user={user}/>} exact />
        <Route path='/login' element={<Login updateUser={updateUser} user={user} />} />
        <Route path='/join_group' element={<JoinGroup user={user}/>} />
        <Route path='/create_group' element={<CreateGroup user={user}/>} />
        <Route path='/chat/:chatID' element={<Chat user={user}/>}/>
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