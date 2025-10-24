import React from 'react';
import {NavLink} from 'react-router-dom';
import "../app.css"

export function LandingPage({user}) {
    return (
        <div className="container-fluid text-center border-0 m-0 p-0">
           <div className ="full-width fade-to-white border-0 m-0 p-0">
           <img className ="full-width" src="./landing_page.jpg" />
            </div>
            
            <div className="col-8 offset-3 card w-50 h-30">
                <div id="login" className=" w-100 h-100 card-body d-flex flex-column align-items-center">
                    <h5 className="card-title mb-4 mt-4">Create new group</h5>
                    {user.length == 0 ? 
                    <p>Log in to create a group</p> : 
                    <NavLink className="w-100 h-25 mt-4" to="create_group"><button className="w-75">Create Group</button></NavLink>}
                    
                </div>
            </div>
        </div>
    );
}