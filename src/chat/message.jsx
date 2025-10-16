
import "../app.css"

export function Message({ text, fromUser, state }) {
    classAtribs = "message " + fromUser ? "from-me" : "from-other"

    return (<div>
                <div className={classAtribs}><p>{text}</p></div>
            </div>);
}