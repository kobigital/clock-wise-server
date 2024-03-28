import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    newUser: boolean;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    newUser: { type: Boolean, default: true },
});

export default mongoose.model<IUser>('User', userSchema, 'users');