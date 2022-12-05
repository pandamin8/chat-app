import * as dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/.env' })

import express from 'express'
import { Server } from 'socket.io'
import http from 'http'

import path from 'path'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.broadcast.emit('message', 'A new user has joined!')

    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('message', `https://google.com/maps?q=${location.lat},${location.long}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

const port = process.env.PORT

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})