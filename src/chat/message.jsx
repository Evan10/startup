
import "../app.css"
import "./chat.css"
import messageState from "./messageState"
import React, { useEffect, useState } from 'react';

export function Message({ messageData, fromUser }) {
    const classAtribs = "message " + ( fromUser ? "from-me" : "from-other")

    return (<div>
                <div className={classAtribs}>
                    <p className={"msg-user"}>{"From: " + messageData.user}</p>
                    <p className={"msg-text"}>{messageData.content}</p>
                    <p className={"msg-state"}>{messageData.state.name}</p>
                    </div>
            </div>);
}