import {WebSocketServer} from "ws";

const TYPE_MESSAGE = "message";
const TYPE_CONNECT_TO_CHAT = "connect"
const TYPE_DISCONNECT = "disconnect";
const TYPE_PING = "ping";
const TYPE_PONG = "pong";


export default class chatProxy{

    constructor(httpServer){
        this.server = httpServer;
        this.wss = new WebSocketServer(this.server);
    }
    proxySetup(){
        this.server.on("upgrade", (req, socket, head)=>{



            this.wss.handleUpgrade(req, socket, head,()=>{
                wss.emit("connection", ws, req);
            })
        })

    }




}

class chatRoom {

    constructor(){
        this.users = [];    
    }

    sendMessageToOthers(sender, message){
        for(u in this.users){
            if(u != sender){
                u.sendMessage(message);
            }
        }
    }

    onMessage(message){

    }

}

TIME_OUT = 60; //seconds
class user{

    PING_MESSAGE = `{"type":"${TYPE_PING}"}`;

    constructor(webSocket, token, chat = null){
        this.webSocket = webSocket;
        this.token = token;
        this.chat = chat;
        this.recieveMessage = null;
        this.pingInterval = null;
        this.lastContact = now();
        
        if(chat!=null){
            addHook();
        }
        setupPingPong();
    }

    setupPingPong(){
        this.renewLastContact();

        this.pingInterval = setInterval(()=>{
            this.webSocket.send(user.PING_MESSAGE);
        }, 10 * 1000);

        this.webSocket.on("message",async (message, isBinary)=>{
            try{
                const msg = JSON.parse(message.toString());
                if(msg?.type == TYPE_PONG){
                    renewLastContact();

                }
            }catch(e){
                console.error("invalid JSON message", e);
            }
        });
    }

    renewLastContact(){
        this.lastContact = now();
    }

    isTimedOut(){
        return this.lastContact - now() > TIME_OUT;
    }

    setNewChat(chat){
        this.removeHook();
        this.chat = chat;
        this.addHook();
    }

    addHook(){
        this.recieveMessage = (message, isBinary) => {
            if(isBinary){console.log("binary message recieved");return;}
            try{
                const msg = JSON.parse(message.toString());
                if(msg?.type != TYPE_PONG){
                    this.chat.onMessage(msg);
                }
            }catch(e){
                console.error("invalid JSON message", e);
            }
            
        };

        this.webSocket.on("message", this.recieveMessage);
    }

    removeHook(){
        this.webSocket.off("message", this.recieveMessage);
    }

    sendMessage(message){
        this.webSocket.send(JSON.stringify(message));
    }

    close(){
        removeHook();
        this.webSocket.close()
    }

}



function now(){
    return Math.floor(Date.now() / 1000);
}