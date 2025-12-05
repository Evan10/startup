import {WebSocketServer} from "ws";
import cookie from "cookie";

const TYPE_MESSAGE = "message";
const TYPE_CONNECT_TO_CHAT = "connect"
const TYPE_DISCONNECT = "disconnect";
const TYPE_PING = "ping";
const TYPE_PONG = "pong";


export default class chatProxy{

    constructor(httpServer, authHandler, dbConnection){
        this.server = httpServer;
        this.authHandler = authHandler;
        this.dbConnection = dbConnection;
        this.wss = new WebSocketServer(this.server);
        this.chats = {};
        this.users = {};
        this.userTimeoutInterval = null;
        
        proxySetup();
    }
    proxySetup(){
        
        this.server.on("upgrade", async (req, socket, head)=>{
            let cookies = req.headers.cookie || "";
            cookies = cookie.parse(cookie);
            const userID = "";

            if(TOKEN_NAME in cookies){
                if(!this.authHandler.verifySessionToken(TOKEN_NAME)){
                    socket.destroy();
                    return;
                }
                const client = await this.authHandler.getUserWithToken(TOKEN_NAME);


            }else if(GUEST_TOKEN_NAME in cookies){


            }else{
                socket.destroy();
                return;
            }


            this.wss.handleUpgrade(req, socket, head,()=>{
                wss.emit("connection", ws, req);
            });
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

    async changeCurrentUserChat(u, chatID){
        const chat = await this.dbConnection.getChatWithID(chatID);
        if(!chat) return;

        const idx = chat.users.indexOf(u.username);
        if(idx == -1){return;}// not apart of the chat
        
        if(chatID!= null){
            this.chats[chatID].addUser(u);
            u.setNewChat(this.chats[chatID]);
        }
        else{
            const c = new chatRoom(chat, this);
            c.addUser(u);
            u.setNewChat(c);
            this.chats[chat.chatID] = c;
        }
    }

    onMessage(u, message){
        const type = message?.type | "";
        switch(type){
            case TYPE_MESSAGE:
                break;
            case TYPE_CONNECT_TO_CHAT:
                this.changeCurrentUserChat(u, message.chatID);
                break;
            case TYPE_DISCONNECT:
                u.close();
                const rmIdx2 =this.users.indexOf(sender);
                if(rmIdx2!=-1) this.users.splice(rmIdx2,1);
                break;
            default:
                console.log("Unknown Message Type");
        }
    }

}

class chatRoom {

    constructor(chatData, proxy){
        this.chatData = chatData;
        this.proxy = proxy;
        this.users = [];    
    }

    sendMessageToOthers(sender, message){
        for(u in this.users){
            if(u != sender && !u.closed){
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

    constructor(webSocket, userData, proxy, chat = null){
        this.webSocket = webSocket;
        this.userData = userData;
        this.chat = chat;
        this.proxy = proxy;
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

    setupProxyConnection(){
        this.webSocket.on("message", (message, isBinary)=>{
            if(isBinary){console.log("binary message recieved");return;}
            try{
                const msg = JSON.parse(message.toString());
                if(msg?.type != TYPE_PONG){
                    this.proxy.onMessage(this, msg);
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