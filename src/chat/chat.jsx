import React from 'react';
import "../app.css"

export function Chat() {
  return (
    <main classNameName="container-fluid bg-secondary text-center">
      <div id="chat-container">
        <div id="message-container">
            <div className="message from-other"><p>Did you decide on the format for the title page yet?</p></div>
            <div className="message from-me"><p>Yes, give me a second to grab the link</p></div>
            <div className="message from-me"><p>fakelink.com/fake?fakelinkdata=123123</p></div>
            <div className="message from-other"><p>Awesome looks great!</p></div>
        </div>
        <hr/>
        <div id="message-input-container">
            <input className="rounded-corners" type="text" placeholder="send message..."/>
            <button>Send</button>
            <button>Files</button>
        </div>
    </div>
    </main>
  );
}