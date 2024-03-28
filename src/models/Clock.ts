import mongoose, { Document, Schema } from 'mongoose';
import { ITimeInterval } from './TimeInterval';

interface IClock extends Document {
    intervals: ITimeInterval[];
    client: Schema.Types.ObjectId;
}

interface IClock extends Document {
    intervals: ITimeInterval[];
    client: Schema.Types.ObjectId;
}

const ClientSchema = new Schema<IClock>({
    intervals: [{ type: Schema.Types.ObjectId, ref: 'TimeInterval' }],
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
});
export const Clock = mongoose.model<IClock>('Clock', ClientSchema);
