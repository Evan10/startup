
import "../app.css"
import "./chat.css"
import messageState from "./messageState"
import React, { useEffect, useState } from 'react';

export function DogImageMessage({ messageData, fromUser }) {
    const classAtribs = "message " + ( fromUser ? "from-me" : "from-other")


    return (<div>
                <div className={classAtribs}>
                    <img src={messageData.content} style={{ maxWidth: "70%", height: "auto" }}></img>
                </div>
            </div>);
}