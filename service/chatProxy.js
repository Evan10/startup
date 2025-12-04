import {WebSocketServer} from "ws";

TYPE_MESSAGE = "message";
TYPE_CONNECT_TO_CHAT = "connect"
TYPE_DISCONNECT = "disconnect";


export default class chatProxy{

    constructor(httpServer){
        this.server = httpServer;
        this.wss = WebSocketServer(this.server);
    }
    proxySetup(){
        this.server.on("upgrade",(req, socket, head)=>{

        })

    }




}




class user{
    constructor(webSocket, token){
        this.webSocket = webSocket;
        this.token = token;
        this.timeout = now() + 10;
        
    }

    renewTimeout(){
        this.timeout = now() + 10;
    }

    isTimedOut(){
        return now() >= this.timeout;
    }

    setup(){
        this.webSocket.on()

    }

}



function now(){
    return Math.floor(Date.now() / 1000);
}