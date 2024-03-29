import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeInterval extends Document {
    startAt: Date;
    endAt?: Date;
    paid: number;
    paidAt?: Date;
    clockId: Schema.Types.ObjectId;
}

const TimeIntervalSchema = new Schema<ITimeInterval>({
    clockId: { type: Schema.Types.ObjectId, ref: 'Clock', required: true },
    startAt: { type: Date, required: true },
    endAt: Date,
    paid: { type: Number, required: true },
    paidAt: Date,
});

export const TimeInterval = mongoose.model<ITimeInterval>('TimeInterval', TimeIntervalSchema);
