import {Server} from 'socket.io';
import {createServer} from 'http';
import express from 'express';

const app = express();

const server = createServer(app);

const io = new Server(server,{
    origin:"http://localhost:5173",    
});

io.on("connection",(socket)=>{
    console.log("New Client Connected",socket.id);


    io.on("disconnect",()=>{
        console.log("Client disconnected",socket.id);
    });
});

export {app,io,server};

