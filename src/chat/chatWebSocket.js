
export const TYPE_MESSAGE = "message";
export const TYPE_CONNECT_TO_CHAT = "connect"
export const TYPE_DISCONNECT = "disconnect";
export const TYPE_PING = "ping";
export const TYPE_PONG = "pong";

class chatWebSocket{
    

    constructor(){
        this.connected = "unknown";
        this.handlers = [];
        this.addPingHandler();
        this.preconnectMessageQueue = [];
        this.socket = null;
        this.connect();
    }

    addPingHandler(){
        this.addHandler((msg)=>{
            if(msg?.type == TYPE_PING){
                this.sendMessage({"type":TYPE_PONG});
                console.log("ping");
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
        if(!this.isRunning()){ this.preconnectMessageQueue.push(message);return;}
        this.socket.send(JSON.stringify(message));
    }

    isRunning(){
        return this.connected === "connected";
    }

    connect(){
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const loc = `${protocol}://${window.location.hostname}:${port}`;
        this.connected = "unknown";
        if(this.socket!=null){
            this.socket.close();
        }
        this.socket = new WebSocket(loc);
        this.socket.onmessage = (msg) => {
            const message = JSON.parse(msg.data);
            for(const handler of this.handlers){
                handler(message);
            }
        };
        
        this.socket.onopen = ()=>{this.connected = "connected";
            for(const m of this.preconnectMessageQueue){
                this.sendMessage(m);
            }
        };
        this.socket.onclose = ()=>{this.connected = "not connected";};
        this.socket.onerror = ()=>{this.connected = "not connected";};
    }
}


let csw;
export function getChatWebSocket(){
    if(csw == null){
        csw = new chatWebSocket();
    }else if(!csw.isRunning()){
        csw.connect();
    }
    return csw;
};