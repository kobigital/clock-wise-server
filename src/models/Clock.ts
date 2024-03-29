import mongoose, { Document, Schema } from 'mongoose';
import { ITimeInterval } from './TimeInterval';

export interface IClock extends Document {
    client: Schema.Types.ObjectId;
    name: string;
    note: string;
    intervals?: ITimeInterval[];
}

const ClientSchema = new Schema<IClock>({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    name: { type: String, required: true },
    note: { type: String, default: '' }
});
export const Clock = mongoose.model<IClock>('Clock', ClientSchema);
