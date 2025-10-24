
import "../app.css"
import "./chat.css"
import messageState from "./messageState"
import React, { useEffect, useState } from 'react';

export function FileMessage({ messageData, fromUser }) {
    const classAtribs = "message " + ( fromUser ? "from-me" : "from-other")

    const handleFileDownload = () => {
        console.log("download file from 3rd party source");
    }

    return (<div>
                <div className={classAtribs}>
                    <button onClick={handleFileDownload}>Download File</button>
                </div>
            </div>);
}