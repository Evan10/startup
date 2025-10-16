


export function UserInput({ text, fromUser, state }) {

    return (
<div id="message-input-container">
            <input className="rounded-corners" type="text" placeholder="send message..."/>
            <button>Send</button>
            <button>Files</button>
        </div>);
}
