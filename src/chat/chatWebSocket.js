
const TYPE_MESSAGE = "message";
const TYPE_CONNECT_TO_CHAT = "connect"
const TYPE_DISCONNECT = "disconnect";
const TYPE_PING = "ping";
const TYPE_PONG = "pong";

class chatWebSocket{
    

    constructor(){
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const loc = `${protocol}://${window.location.hostname}:${port}`
        this.handlers = [];
        this.addPingHandler();
        this.socket = WebSocket(loc);
        this.socket.onmessage = async (msg) => {
            const message = JSON.parse(await msg.data.text());
            for(const handler of this.handlers){
                handler(message);
            }
        };
        
    }
    addPingHandler(){
        this.addHandler((msg)=>{
            if(msg?.type == TYPE_PING){
                this.sendMessage(`{"type":${TYPE_PONG}}`);
            }
        });
    }

    addHandler(handler){
        this.handlers.push(handler);
    }
    removeHandler(handler){
        const idx = this.handlers.indexOf(handler);
        this.handlers.splice(idx,1);
    }

    sendMessage(message){
        this.socket.send(JSON.stringify(message));
    }

}


const csw = new chatWebSocket();
export default getChatWebSocket(){
    if(csw == null){
        csw = new chatWebSocket();
    }
    return csw
}