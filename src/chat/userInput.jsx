import "./chat.css"
import "../app.css"

import messageState from "./messageState"
import React, { useEffect, useState } from 'react';

export function UserInput({}) {
    return (
        <div id="message-input-container">
            <input className="rounded-corners" type="text" placeholder="send message..."/>
            <button>Send</button>
            <button>Files</button>
        </div>);
}
