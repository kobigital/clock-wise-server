import mongoose, { Document, Schema } from 'mongoose'
import { IClock } from './Clock';

export interface IClient extends Document {
    name: string;
    creditTime: number;
    isFavorite: boolean;
    note?: string;
    color: string;
    userId: Schema.Types.ObjectId;
    clocks?: IClock[];
}

const ClientSchema = new Schema<IClient>({
    name: { type: String, required: true },
    creditTime: { type: Number, required: true },
    isFavorite: { type: Boolean, required: true },
    note: String,
    color: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
export const Client = mongoose.model<IClient>('Client', ClientSchema);
