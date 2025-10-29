import express from "express";
import cookieParser from "cookie-parser";

import database from "./Database/testDB"; // eventually replace with db connection
import AuthVerifier from "./Auth/verifyAuth";
import validPassword from "./Auth/verifyValidPassword";

const myDatabase = database({dbUsername:"test", dbPassword:"test"});
const myAuthVerifier = AuthVerifier(myDatabase);

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

const APIRouter = express.Router();
app.use("/api", APIRouter);



APIRouter.post("/auth/create", (req, res)=>{

});

APIRouter.post("/auth/login", (req, res)=>{});

APIRouter.delete("/auth/logout", (req, res)=>{});
