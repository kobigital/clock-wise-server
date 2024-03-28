import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    picture: string;
    providerId: string;
    newUser: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    providerId: { type: String, required: true, unique: true },
    picture: { type: String },
    newUser: { type: Boolean, default: true },
});

export default mongoose.model<IUser>('User', userSchema, 'users');