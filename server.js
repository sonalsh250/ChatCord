const path = require('path');
const http = require('http');
const express = require('express'); //regular express server
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app); //creating an http server and passing our express app
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatCord Bot';

//run when a client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id,username, room);
        socket.join(user.room);

        //Welcome current user
    socket.emit('message', formatMessage(botName,'Welcome to ChatCord!'));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat.`));

    //Send users and room info
    io.to(user.room).emit('roomUsers', {
        room : user.room,
        users: getRoomUsers(user.room)
    });

    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        //console.log(msg);
        const user = getCurrentUser(socket.id);

        //emit message to everybody
        io.to(user.room).emit('message', formatMessage(user.username,msg));
        //io.emit('message', formatMessage('USER',msg));
    });

        //Runs when client disconnects
        socket.on('disconnect', ()=>{

            const user = userLeave(socket.id);
            if(user)
            {
                io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat.`)); //io.emit always emits to everybody

                //Send users and room info
    io.to(user.room).emit('roomUsers', {
        room : user.room,
        users: getRoomUsers(user.room)
    });
            }
        });
});

const PORT = 3000 || process.env.PORT;
//checks if we have an environment variable called port and use that, otherwise use 3000
//app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)); 
server.listen(PORT, ()=> console.log(`Server running on ${PORT}`)); 
