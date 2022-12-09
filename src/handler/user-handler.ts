import { Socket, Server } from "socket.io"

import { addUser, getUsersInRoom, getUser } from "../utils/user"
import { generateMessage, generateLocationMessage } from "../utils/messages"

const userHandlers = (io: Server, socket: Socket) => {

    socket.on('join', async({ username, room }, callback) => {
        const { user, error } = await addUser({ socketId: socket.id, username, room }) as any        

        if (error) return callback(error)

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        const { users, error: usersError } = await getUsersInRoom(user.room) as any

        if (usersError) return console.log(usersError)

        io.to(user.room).emit('roomData', {
            room: user.room,
            users
        })

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
}

export default userHandlers