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
        this.chats = {};
        this.users = {};
        this.userTimeoutInterval = null;
        proxySetup();
    }
    proxySetup(){
        
        this.server.on("upgrade", (req, socket, head)=>{
            const cookies = req.headers.cookie || "";
            


            this.wss.handleUpgrade(req, socket, head,()=>{
                wss.emit("connection", ws, req);
            })
        })

        setupCheckTimeOut();
    }

    setupCheckTimeOut(){
        this.userTimeoutInterval = setInterval(()=>{
            Object.values(this.users).forEach(e => {
                if(e.isTimedOut()){
                    e.close();
                }
            });

            this.users = Object.fromEntries(
                Object.entries(this.users).filter(([key, val]) => !val.closed)
            );

        },10*1000);
    }

    changeCurrentUserChat(u, chatID){
        if(chatID!= null)
            this.chats[chatID].addUser(u);
    }

}

class chatRoom {

    constructor(chatID, proxy){
        this.chatID = chatID;
        this.proxy = proxy;
        this.users = [];    
    }

    sendMessageToOthers(sender, message){
        for(u in this.users){
            if(u != sender){
                u.sendMessage(message);
            }
        }
    }

    onMessage(sender, message){
        const type = message?.type | "";
        switch(type){
            case TYPE_MESSAGE:
                this.sendMessageToOthers(sender,message);
                break;
            case TYPE_CONNECT_TO_CHAT:
                const rmIdx =this.users.indexOf(sender);
                if(rmIdx!=-1) this.users.splice(rmIdx,1);
                this.proxy.changeCurrentUserChat(sender, message.chatID);
                break;
            case TYPE_DISCONNECT:
                sender.close();
                const rmIdx2 =this.users.indexOf(sender);
                if(rmIdx2!=-1) this.users.splice(rmIdx2,1);
                break;
            default:
                console.log("Unknown Message Type");
        }

    }


    addUser(u){
        this.users.push(u);
    }

}

TIME_OUT = 60; //seconds
class user{

    PING_MESSAGE = `{"type":"${TYPE_PING}"}`;

    constructor(webSocket, userID, chat = null){
        this.webSocket = webSocket;
        this.userID = userID;
        this.chat = chat;
        this.recieveMessage = null;
        this.pingInterval = null;
        this.lastContact = now();
        this.closed = false;
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
                    this.chat.onMessage(this, msg);
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
        clearInterval(this.pingInterval);
        this.webSocket.close();
        this.closed = true;
    }

}



function now(){
    return Math.floor(Date.now() / 1000);
}