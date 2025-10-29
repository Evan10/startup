import express from "express";
import cookieParser from "cookie-parser";

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
