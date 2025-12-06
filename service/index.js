import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"

import dbConnection from "./dbConnection.js"; // eventually replace with db connection
import AuthVerifier from "./verifyAuth.js";
import validPassword from "./verifyValidPassword.js";
import {TOKEN_NAME,GUEST_TOKEN_NAME, USERNAME} from "./consts.js"
import {generateRandomString} from "./Util.js";

import dbConfig from "./dbConfig.json" with { type: "json" };import chatProxy from "./chatProxy.js";
;

const port = process.argv.length > 2 ? process.argv[2] : 3000;

const myDatabase = new dbConnection(dbConfig);
const myAuthVerifier = new AuthVerifier(myDatabase);

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

const APIRouter = express.Router();
app.use("/api", APIRouter);

const checkToken =(allowGuestToken)=>{ return (req, res, next) => {
    const userToken = req.cookies[TOKEN_NAME];
    if(!userToken){
        if(allowGuestToken){
        const guestToken = req.cookies[GUEST_TOKEN_NAME];
        if(!guestToken || !myAuthVerifier.verifyGuestToken(guestToken)){
            res.status(401).send({message:"Missing credentials, try signing in again."});
            return;
        }else{
            next();
            return;
        }
    }else {
        res.status(401).send({message:"Missing credentials, try signing in again."});
        return;
    }

    }else if(!myAuthVerifier.verifySessionToken(userToken)){
        res.status(401).send({message:"Incorrect token, try signing in again."});
    }else{
        next();
    }

}};

APIRouter.post("/auth/create", async (req, res)=>{
    const username = req.body?.username, password = req.body?.password;
    if(!username || !password) {
        res.status(401).send({success:false, message:"Missing password or username"}); 
        return;
    }

    const passwordStatus = validPassword(password);
    if(!passwordStatus.valid){
        const message = `Invalid password. Password must include:\n 
        ${passwordStatus.reasons.map((val,i)=>`${i+1}) ${val}`).join("\n")}`;
        res.status(400).send({success:false, message:message}).end(); 
        return;
    }

    const pwhash = await bcrypt.hash(password, 10);
    const success = await myDatabase.createNewUser(username, pwhash);

    if (!!success){
        const userToken = await myAuthVerifier.verifyCredentials(username, password);
        if(!userToken){
            res.status(400).send({success:false,message:"Account was created but you weren't signed in"});
        }else{
            res.cookie(TOKEN_NAME,userToken,{
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24
        })
            res.send({success:true});
        }
    }else{
        res.status(400).send({success:false,message:"Account could not be created"});
    }
});

APIRouter.post("/auth/login", async (req, res)=>{
    const username = req.body?.username, password = req.body?.password;
    if(!username || !password) {
        res.status(401).send({success:false, message:"Missing password or username"});
        return;
    }
    const userToken = await myAuthVerifier.verifyCredentials(username, password);
    if(!userToken){
        res.status(401).send({success:false,message:"Incorrect username or password"});
    }else{
        res.cookie(TOKEN_NAME,userToken,{
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.send({success:true});
    }

});

APIRouter.delete("/auth/logout", (req, res)=>{
    const userToken = req.cookies[TOKEN_NAME];
    if(!userToken){res.status(401).send({message:"Couldn't find user."});return;}

    myAuthVerifier.endSession(userToken);
    res.status(200).clearCookie(TOKEN_NAME).send({message:"User successfully signed out"});
});

APIRouter.get("/auth/getSelf", checkToken(false), async (req,res)=>{
    const userToken = req.cookies[TOKEN_NAME];
    if(!userToken){
        res.send({});
        return
    }
    const user = await myAuthVerifier.getUserWithToken(userToken);
    if(!user){
        res.send({});
        return;
    }
    res.send({username:user.username, chats:user.chats});
})

APIRouter.patch("/chat/JoinChat", async (req, res)=>{
    const joinCode = req.body?.joinCode;
    let username = req.body?.username;
    const userToken = req.cookies[TOKEN_NAME];
    const chat = await myDatabase.getChatWithJoinCode(joinCode);
    if(!userToken){
        username = `${username}#${generateRandomString(6,"0123456789")}`;
        const guestToken = myAuthVerifier.generateGuestToken(username);
        res.cookie(GUEST_TOKEN_NAME, guestToken, {
            httpOnly:true,
            secure:true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        await myDatabase.addGuestUserToChat(username,chat.chatID);
    }else{
        const user = await myAuthVerifier.getUserWithToken(userToken);
        if(!user){res.status(401).clearCookie(TOKEN_NAME).end();return;}
        await myDatabase.addUsertoChat(user.username,chat.chatID);
    }
    
    res.status(200).send({chatID:chat.chatID, title:chat.title, guestUsername:username}).end();
});

APIRouter.post("/chat/createChat", checkToken(false), async (req, res)=>{
    const title = req.body?.title;
    const chatID = crypto.randomUUID();
    const userToken = req.cookies[TOKEN_NAME];
    const user = await myAuthVerifier.getUserWithToken(userToken);
    const chatJoinCode = generateRandomString();
    await myDatabase.createNewChat(title,chatID,user,chatJoinCode);
    res.send({chatID:chatID});
});


APIRouter.get("/chat/getUserChats", checkToken(false),async (req, res)=>{
    const userToken = req.cookies[TOKEN_NAME];
    const user = await myAuthVerifier.getUserWithToken(userToken); 
    const allChatIDs = await myDatabase.getUserChats(user.username);
    const allChats = await myDatabase.getManyChatTitlesWithIDs(allChatIDs);
    if(!allChats){res.status(200).send({}).end();return;}
    res.status(200).send(allChats);
});

APIRouter.get("/chat/getChat", checkToken(true), async (req, res)=>{
    const chatID = req.query?.chatID;
    const isGuest = req.query?.isGuest  === "true";
    const chat = await myDatabase.getChatWithID(chatID);
    if(!chat){res.status(400).end();return;}

    let username = "";
    if(isGuest){
        const guestUserToken = req.cookies[GUEST_TOKEN_NAME];
        username = myAuthVerifier.getGuestName(guestUserToken); 
    }else{
        const userToken = req.cookies[TOKEN_NAME];
        const user = await myAuthVerifier.getUserWithToken(userToken); 
        username = user.username;
    }
    
    
    if(!(chat.users.includes(username))){
        res.status(401).end();
        return;
    }
    res.status(200).send(chat);
});

APIRouter.post("/chat/sendMessage", checkToken(true), async (req, res)=>{

    const userToken = req.cookies[TOKEN_NAME];
    const user = await myAuthVerifier.getUserWithToken(userToken);

    const chatID = req.body?.chatID;
    const message = req.body?.message;
    message.createdOn = new Date().toUTCString();
    // give the message a new id to stop someone theoretically 
    // manually editing id to cause a double up of ids which would cause error on the front end
    message.id = crypto.randomUUID(); 
    delete message.state; // state is for front end and websockets

    if(!userToken){
        const guestToken = req.cookies[GUEST_TOKEN_NAME];
        if(!guestToken){
            res.status(401).end();
            return;
        }
        const guestName = myAuthVerifier.getGuestName(guestToken);
        message.username = guestName;
        await myDatabase.addChatMessage(guestName,message, chatID);
    }else{
        await myDatabase.addChatMessage(user.username,message, chatID);
        
    }
    res.send(200).end();
});



const httpServer = app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
});

const proxy = new chatProxy(httpServer, myAuthVerifier, myDatabase);