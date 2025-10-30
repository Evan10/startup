import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"

import testDB from "./Database/testDB"; // eventually replace with db connection
import AuthVerifier from "./Auth/verifyAuth";
import validPassword from "./Auth/verifyValidPassword";
import {TOKEN_NAME, USERNAME} from "./consts"

const myDatabase = testDB({dbUsername:"test", dbPassword:"test"});
const myAuthVerifier = AuthVerifier(myDatabase);

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

const APIRouter = express.Router();
app.use("/api", APIRouter);

const checkToken = (req, res, next) => {
    const token = req.cookies[TOKEN_NAME];
    if(!token){
        res.status(401).send({message:"Missing credentials, try signing in again."});
    }else if(!myAuthVerifier.verifySessionToken(token)){
        res.status(401).send({message:"Incorrect token, try signing in again."});
    }else{
        next();
    }

}

APIRouter.post("/auth/create", async (req, res)=>{
    const username = req.body?.username, password = req.body?.password;
    if(!username || !password) {
        res.status(401).send({success:false, message:"Missing password or username"}); 
        return;
    }

    const passwordStatus = validPassword(password);
    if(!passwordStatus.valid){
        const message = `Password must include ${passwordStatus.reasons.forEach((val,i)=>{`${i}) ${val} \n`})}`;
        res.status(401).send({success:false, message:message}); 
        return;
    }

    const pwhash = await bcrypt.hash(password);
    const success = myDatabase.createNewUser(username, pwhash);

    if (success){
        const token = myAuthVerifier.verifyCredentials(username, password);
        if(!token){
            res.status(401).send({success:false,message:"Account was created but you weren't signed in"});
        }else{
            res.send({success:true, sessionToken:token});
        }
    }else{
        res.status(401).send({success:false,message:"Account could not be created"});
    }
});

APIRouter.post("/auth/login", (req, res)=>{
    const username = req.body?.username, password = req.body?.password;
    if(!username || !password) res.status(401).send({success:false, message:"Missing password or username"});

    const token = myAuthVerifier.verifyCredentials(username, password);
    if(!token){
        res.status(401).send({success:false,message:"Incorrect username or password"});
    }else{
        res.send({success:true, sessionToken:token});
    }

});

APIRouter.delete("/auth/logout", checkToken, (req, res)=>{
    const token = req.cookies[TOKEN_NAME];
    if(!token)res.status(401).send({message:"Couldn't find user."});

    myAuthVerifier.endSession(token);
    res.status(200).send({message:"User successfully signed out"});
});


APIRouter.get("/chat/getChatData", checkToken, ()=>{});


APIRouter.post("/chat/sendMessage", ()=>{});

