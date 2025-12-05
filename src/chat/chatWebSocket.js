
export const TYPE_MESSAGE = "message";
export const TYPE_CONNECT_TO_CHAT = "connect"
export const TYPE_DISCONNECT = "disconnect";
export const TYPE_PING = "ping";
export const TYPE_PONG = "pong";

class chatWebSocket{
    

    constructor(){
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const loc = `${protocol}://${window.location.hostname}:${port}`
        this.connected = "unknown";
        this.handlers = [];
        this.addPingHandler();
        this.socket = WebSocket(loc);
        this.socket.onmessage = async (msg) => {
            const message = JSON.parse(await msg.data.text());
            for(const handler of this.handlers){
                handler(message);
            }
        };
        this.socket.onopen = ()=>{this.connected = "connected";};
        this.socket.onclose = ()=>{this.connected = "not connected";};
        this.socket.onerror = ()=>{this.connected = "not connected";};
        
        
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

    isRunning(){
        return this.connected == "connected";
    }
}


let csw;
export default function getChatWebSocket(){
    if(csw == null || !csw.isRunning()){
        csw = new chatWebSocket();
    }
    return csw;
};