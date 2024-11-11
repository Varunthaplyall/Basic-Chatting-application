const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io')
require('dotenv').config()
const {PORT, MONGO_URL} = process.env;
const authRoutes = require('./routes/auth.routes');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const userModel = require('./model/user.model');
const userRoutes = require('./routes/users.route');
const { userAuthenticate } = require('./middleware/tokenCheck');

//io setup 
const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors : {
        origin : 'http://localhost:5173',
        methods : ['GET', 'POST'],
        credentials : true
    }
});


app.use(express.json());
app.use(cors())
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1',userRoutes)

const activeUsers = new Map();


io.on('connection', (socket)=>{
   console.log(socket.id)    
 
    socket.on('user-data', async (data)=>{
        const userId = userAuthenticate(data)

        if(userId){
            const user = await userModel.findById(userId)

            activeUsers.set(socket.id, {socketId : socket.id, username : user.userName, userId : user._id})

            const updatedUserList = Array.from(activeUsers.values())
            .map((user)=>{
                return {
                    username : user.username,
                    socketId : user.socketId,
                    userId : user.userId
                    
                }

            })

            io.emit('active-users', updatedUserList)
            console.log('updated user list', updatedUserList)

            socket.emit('user', {username : user.userName, userId : user._id} )
        }
    })

    socket.on('send-message', (data)=>{
        if(data.isPrivate === true){
            const targetSocketId =  data.to;
            socket.to(targetSocketId).emit('receive-message', data);
            console.log(`data is private `, data)
            socket.emit('receive-message', data)

        }else{
            console.log(`data is public`, data)
             io.emit('receive-message', data)
        }
    })  

    socket.on('disconnect', ()=>{
        activeUsers.delete(socket.id)
        const updatedUserList = Array.from(activeUsers.values())
            .map((user)=>{
                return {
                    username : user.username,
                    socketId : user.socketId,
                    userId : user.userId
                }

            })

            io.emit('active-users', updatedUserList)
           
            
    })

})







mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log('DB connected')
    })
    .catch((error)=>{
        console.log(error)
    })


httpServer.listen(PORT, ()=>{
    console.log('Server is up')
})

