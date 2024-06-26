import mongoose, { Document, Schema } from 'mongoose';
import { ITimeInterval } from './TimeInterval';


export interface IClock extends Document {
    clientId: Schema.Types.ObjectId;
    name: string;
    note: string;
    intervals?: ITimeInterval[];
    isFavorite: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    // should passed to object 
    pricePerHour?: number;
    fixedPrice?: number;
    isPriceIsFixed: boolean;
}

const ClockSchema = new Schema<IClock>({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    isFavorite: { type: Boolean, default: false },
    name: { type: String, required: true },
    note: { type: String, default: '' },
    pricePerHour: { type: Number, required: true },
    fixedPrice: { type: Number },
    isPriceIsFixed: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

ClockSchema.index({ _id: 1, clientId: 1 });

export const Clock = mongoose.model<IClock>('Clock', ClockSchema);
