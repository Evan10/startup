import {WebSocketServer} from "ws";
import cookie from "cookie";
import {TOKEN_NAME, GUEST_TOKEN_NAME} from "./consts.js";

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
        this.wss = new WebSocketServer({noServer:true});
        this.chats = {};
        this.users = {};
        this.userTimeoutInterval = null;
        
        this.proxySetup();
    }
    proxySetup(){
        
        this.server.on("upgrade", async (req, socket, head)=>{

            let cookies = req.headers.cookie ?? "";
            cookies = cookie.parse(cookies);
            
            let clientData = {};
            
            if(TOKEN_NAME in cookies){
                const tkn = cookies[TOKEN_NAME];
                if(!this.authHandler.verifySessionToken(tkn)){
                    socket.destroy();
                    return;
                }
                clientData = await this.authHandler.getUserWithToken(tkn);
                if(!clientData){
                    socket.destroy();
                    return;
                }

            }else if(GUEST_TOKEN_NAME in cookies){
                const tkn = cookies[GUEST_TOKEN_NAME];
                if(!this.authHandler.verifyGuestToken(tkn)){
                    socket.destroy();
                    return;
                }
                const nm = this.authHandler.getGuestName(tkn);
                clientData = {userID:nm, username:nm};

            }else{
                socket.destroy();
                return;
            }


            this.wss.handleUpgrade(req, socket, head,(ws)=>{
                this.wss.emit("connection", ws, req, clientData);
            });
        })

        this.wss.on("connection", (ws, req, clientData)=>{
            const userClient = new User(ws,clientData,this);
            this.users[clientData.userID] = userClient;
        });

        this.setupCheckTimeOut();
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

    async changeCurrentUserChat(user, chatID){
        if(chatID == null) return;
        const chat = await this.dbConnection.getChatWithID(chatID);
        if(!chat) return;

        const idx = chat.users.indexOf(user.userData.username);
        if(idx == -1){return;}// not apart of the chat

        if(this.chats[chatID]){
            this.chats[chatID].addUser(user);
            user.setNewChat(this.chats[chatID]);
        }else{
            const c = new chatRoom(chat, this);
            c.addUser(user);
            user.setNewChat(c);
            this.chats[chat.chatID] = c;
        }
    }

    onMessage(user, message){
        console.log(JSON.stringify(message));
        const type = message?.type ?? "";
        switch(type){
            case TYPE_MESSAGE:
                break;
            case TYPE_CONNECT_TO_CHAT:
                this.changeCurrentUserChat(user, message.chatID);
                break;
            case TYPE_DISCONNECT:
                user.close();
                delete this.users[user.userData.userID];
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
        this.chatUsers = [];    
    }

    sendMessageToOthers(sender, message){
        for(const user of this.chatUsers){
            console.log("message to others: " + JSON.stringify(message)); 
            if(user != sender && !user.closed){
                user.sendMessage(message);
            }
        }
    }

    onMessage(sender, message){
        const type = message?.type ?? "";
        switch(type){
            case TYPE_MESSAGE:
                this.sendMessageToOthers(sender,message);
                break;
            case TYPE_CONNECT_TO_CHAT:
                const rmIdx =this.chatUsers.indexOf(sender);
                if(rmIdx!=-1) this.chatUsers.splice(rmIdx,1);
                break;
            case TYPE_DISCONNECT:
                sender.close();
                const rmIdx2 =this.chatUsers.indexOf(sender);
                if(rmIdx2!=-1) this.chatUsers.splice(rmIdx2,1);
                break;
            default:
                console.log("Unknown Message Type");
        }

    }


    addUser(u){
        this.chatUsers.push(u);
    }

}

const TIME_OUT = 60; //seconds
class User{

    static PING_MESSAGE = `{"type":"${TYPE_PING}"}`;

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
            this.addHook();
        }
        this.setupPingPong();
        this.setupProxyConnection();
    }

    setupPingPong(){
        this.renewLastContact();

        this.pingInterval = setInterval(()=>{
            this.webSocket.send(User.PING_MESSAGE);
        }, 10 * 1000);

        this.webSocket.on("message",async (message, isBinary)=>{
            try{
                const msg = JSON.parse(message.toString());
                if(msg?.type == TYPE_PONG){
                    this.renewLastContact();
                    console.log("Pong recieved")
                }
            }catch(e){
                console.error("invalid JSON message", e);
            }
        });
        this.webSocket.on("close", () => clearInterval(this.pingInterval));
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
        return now() - this.lastContact > TIME_OUT;
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
        if(!this.recieveMessage) return;
        this.webSocket.off("message", this.recieveMessage);
    }

    sendMessage(message){
        this.webSocket.send(JSON.stringify(message));
    }

    close(){
        this.removeHook();
        clearInterval(this.pingInterval);
        this.webSocket.close();
        this.closed = true;
    }

}



function now(){
    return Math.floor(Date.now() / 1000);
}