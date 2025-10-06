import React from 'react';

export function JoinGroup() {
    return (
        <main className="container-fluid bg-secondary text-center">

            <div class="col-8 offset-2 card">
                <div id="join-group-form" class=" card-body ">
                    <form id="login-form" class="form-format" action="./chat.html">
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
