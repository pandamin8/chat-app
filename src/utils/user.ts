import { Types } from 'mongoose'
import User, { IUser } from '../model/user'

export const addUser = async({ username, room, socketId}: any) => {
    try {
        // Clean the data
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

        if (!username || !room)
            return { error: 'Username and room are required!' }    

        // Check for existing user
        const existingUsers = await User.findOne({ username, room })

        // Validate username
        if (existingUsers)
            return { error: 'Username is in use!' }
        
        // Store user
        const user = await User.create({ username, room, socketId })    
        return { user }
    } catch (e) {
        if (e instanceof Error) return { error: e.message }
    }
}

export const removeUser = async(socketId: String) => {
    try {
        const user = await User.findOneAndDelete({ socketId })
        if (!user)
            return { error: 'User not found' }
            
        return { user }
    } catch(e) {
        if (e instanceof Error) return { error: e.message }
    }
}

export const getUser = async(socketId: String) => {
    try {
        const user = await User.findOne({ socketId })

        if (!user)
            return { error: 'User not found' }

        return { user }
    } catch(e) {
        if (e instanceof Error) return { error: e.message }
    }
}

export const getUsersInRoom = async(room: String) => {
    try {
        const users = await User.find({ room })
        return { users }
    } catch(e) {
        if (e instanceof Error) return { error: e.message }
    }
}