import * as dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/.env' })

import express from 'express'
import { Server } from 'socket.io'
import http from 'http'

import { generateMessage, generateLocationMessage } from './utils/messages'
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/user'

import path from 'path'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', async({ username, room }, callback) => {
        const { user, error } = await addUser({ socketId: socket.id, username, room }) as any        

        if (error) return callback(error)

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        callback()
    })

    socket.on('sendMessage', async(message, callback) => {
        const { user, error } = await getUser(socket.id) as any

        if (error) return callback(error)

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', async(location, callback) => {
        const { user, error } = await getUser(socket.id) as any

        if (error) callback(error)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.lat},${location.long}`))
        callback()
    })

    socket.on('disconnect', async() => {        
        const { user, error } = await removeUser(socket.id) as any

        if (error) return console.log(error)
        
        if (user)
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
    })
})

const port = process.env.PORT

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})