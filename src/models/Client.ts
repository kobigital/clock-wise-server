import mongoose, { Document, Schema } from 'mongoose'
import { Clock } from './Clock';

interface IClient extends Document {
    name: string;
    creditTime: number;
    isFavorite: boolean;
    note?: string;
    color: string;
    clocks: Schema.Types.ObjectId[];
    user: Schema.Types.ObjectId;
}

const ClientSchema = new Schema<IClient>({
    name: { type: String, required: true },
    creditTime: { type: Number, required: true },
    isFavorite: { type: Boolean, required: true },
    note: String,
    color: { type: String, required: true },
    clocks: [{ type: Schema.Types.ObjectId, ref: 'Clock' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
export const Client = mongoose.model<IClient>('Client', ClientSchema);
