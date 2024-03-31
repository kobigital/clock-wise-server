import mongoose, { Document, Schema } from 'mongoose';
import { ITimeInterval } from './TimeInterval';

export interface IClock extends Document {
    clientId: Schema.Types.ObjectId;
    name: string;
    note: string;
    intervals?: ITimeInterval[];
}

const ClientSchema = new Schema<IClock>({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    name: { type: String, required: true },
    note: { type: String, default: '' }
});

ClientSchema.index({ _id: 1, clientId: 1 });

export const Clock = mongoose.model<IClock>('Clock', ClientSchema);
