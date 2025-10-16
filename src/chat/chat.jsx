import React from 'react';
import "../app.css"

export function Chat() {
  return (
    <main classNameName="container-fluid bg-secondary text-center">
      <div id="chat-container">
        <div id="message-container">
          <Message fromUser={false} text={"Did you decide on the format for the title page yet?"} />
          <Message fromUser={true} text={"Yes, give me a second to grab the link"} />
          <Message fromUser={false} text={"fakelink.com/fake?fakelinkdata=123123"} />
          <Message fromUser={true} text={"Awesome looks great!"} />
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