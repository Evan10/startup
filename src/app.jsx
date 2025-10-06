import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Scores } from './scores/scores';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
    <div classNameName="body bg-dark text-light">
      <header>
        <h1 id="Title">WorkCircle</h1>
            <nav className="d-flex justify-content-center py-3">
                <menu className="nav nav-pills">
                    <li className="nav-item"><NavLink className="nav-link active" to="">Home</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="login">Login</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="join_group">Join Group</NavLink></li>
                </menu>
            </nav>
        </header>

      <main>App components go here</main>

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