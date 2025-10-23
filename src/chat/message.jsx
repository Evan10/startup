
import "../app.css"
import messageState from "./messageState"
import React, { useEffect, useState } from 'react';

export function Message({ text, fromUser, state }) {
    classAtribs = "message " + fromUser ? "from-me" : "from-other"

    return (<div>
                <div className={classAtribs}><p>{text}</p></div>
            </div>);
}