import * as dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/.env' })

import express from 'express'
import { Server } from 'socket.io'
import http from 'http'

import { generateMessage } from './utils/messages'
import { removeUser, getUsersInRoom } from './utils/user'
import userHandlers from './handler/user-handler'

import path from 'path'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    userHandlers(io, socket)

    socket.on('disconnect', async() => {        
        const { user, error } = await removeUser(socket.id) as any

        if (error) return console.log(error)
        
        if (user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))

            const { users, error } = await getUsersInRoom(user.room) as any

            if (error) return console.log(error)

            io.to(user.room).emit('roomData', {
                room: user.room,
                users
            })
        }
    })
})

const port = process.env.PORT

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})