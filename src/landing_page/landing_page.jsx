import React from 'react';
import {NavLink} from 'react-router-dom';

export function LandingPage() {
    return (
        <main classNameName="container-fluid bg-secondary text-center">
            <div className="col-8 offset-3 card w-50 h-30">
                <div id="login" className=" w-100 h-100 card-body d-flex flex-column align-items-center">
                    <h5 className="card-title mb-4 mt-4">Create new group</h5>
                    <NavLink className="offset-3 w-100 h-25 mt-4" to="create_group"><button className="w-75">Create Group</button></NavLink>
                </div>
            </div>
        </main>
    );
}