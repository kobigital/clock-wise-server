import mongoose, { Document } from 'mongoose';

export interface IMessage {
    name: string;
    content: string;
    date: Date;
    alwaysDisplay: boolean;
    to?: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    picture: string;
    providerId: string;
    newUser: boolean;
    messages: IMessage[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    providerId: { type: String, required: true, unique: true },
    picture: { type: String },
    newUser: { type: Boolean, default: true },
    messages: [
        {
            name: { type: String, required: true },
            content: { type: String, required: true },
            date: { type: Date, default: Date.now },
            alwaysDisplay: { type: Boolean, default: false },
            to: { type: String, required: false },
        },
    ],
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema, 'users');