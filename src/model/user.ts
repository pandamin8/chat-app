import mongoose, { Document, Model, Types } from 'mongoose'
import mainDb from '../db/mongoose'

export interface IUser extends Document {
    username: String,
    room: String,
    socketId: String
}

interface UserModel extends Model<IUser> {

}

const userSchema = new mongoose.Schema <IUser>({
    username: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    }
}, { timestamps: true })


const User = mainDb.model<IUser, UserModel>('User', userSchema)
export default User