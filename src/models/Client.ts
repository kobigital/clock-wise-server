import mongoose, { Document, Schema } from 'mongoose';
import { IClock } from './Clock';

export interface IClient extends Document {
    name: string;
    isFavorite: boolean;
    note?: string;
    userId: Schema.Types.ObjectId;
    clocks?: IClock[];
    defaultPricePerHour: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

const ClientSchema = new Schema<IClient>({
    name: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    note: { type: String, default: undefined },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
    defaultPricePerHour: { type: Number, required: true },
}, { timestamps: true });

export const Client = mongoose.model<IClient>('Client', ClientSchema);


