import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"

import testDB from "./Database/testDB"; // eventually replace with db connection
import AuthVerifier from "./Auth/verifyAuth";
import validPassword from "./Auth/verifyValidPassword";

const myDatabase = testDB({dbUsername:"test", dbPassword:"test"});
const myAuthVerifier = AuthVerifier(myDatabase);

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

const APIRouter = express.Router();
app.use("/api", APIRouter);



APIRouter.post("/auth/create", async (req, res)=>{
    const username = req.body?.username, password = req.body?.password;
    if(!username || !password){ res.status(401).send({success:false, message:"Missing password or username"});
}
    const pwhash = await bcrypt.hash(password);
    const success = myDatabase.createNewUser(username, pwhash);

    if (success){
        const token = myAuthVerifier.verifyCredentials(username, password);
        res.send({success:true, sessionToken:token});
    }else{
        res.status(401).send({success:false,message:"Account could not be created"});
    }
});

APIRouter.post("/auth/login", (req, res)=>{
    

});

APIRouter.delete("/auth/logout", (req, res)=>{});
