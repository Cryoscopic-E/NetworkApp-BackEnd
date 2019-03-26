const express = require('express');
require('./db/dbconnection');

const http = require('http');
const socketio = require('socket.io');

const social_app = express();

const { getOnlineUsersInProjectRoom } = require('./utils/userUtils');

const port = process.env.PORT || 4000;

//SETUP ROUTERS
const userRouter = require('./routers/user');

//CORS MIDDLEWARE
social_app.use(express.json());
social_app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

social_app.use(userRouter);


// CREATE SERVER
const server = http.createServer(social_app);
// SOCKET IO
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', async ({ username, room }) => {
        socket.join(room);

        users = await getOnlineUsersInProjectRoom(room)
        io.to(room).emit('chatData', {
            users
        })
    })

    socket.on('newMessage', ({ message, from, room }) => {
        io.to(room).emit('message', { message, from });
    })

    socket.on('drawing', ({ room, from, to }) => {
        socket.broadcast.to(room).emit('receiveDrawings', { from, to });
    });

    socket.on('disconnected', async ({ room }) => {
        users = await getOnlineUsersInProjectRoom(room)
        io.to(room).emit('chatData', {
            users
        })
    })

})

// START SERVER
server.listen(port, () => {
    console.log(`Server listenng on port ${port}`);
});