const path = require('path');
const http = require('http');
const express = require('express'); //regular express server
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')


const app = express();
const server = http.createServer(app); //creating an http server and passing our express app
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatCord Bot';

//run when a client connects
io.on('connection', socket => {

    //Welcome current user
    //socket.emit('message', formatMessage(botName,'Welcome to ChatCord'));
    socket.emit('message', 'Welcome to ChatCord');

    //Broadcast when a user connects
    //socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat.'));
    socket.broadcast.emit('message', 'A user has joined the chat.');

    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat.'); //io.emit always emits to everybody
    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        //console.log(msg);

        //emit message to everybody
        io.emit('message', msg);
    });
});

const PORT = 3000 || process.env.PORT;
//checks if we have an environment variable called port and use that, otherwise use 3000
//app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)); 
server.listen(PORT, ()=> console.log(`Server running on ${PORT}`)); 
