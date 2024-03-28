import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeInterval extends Document {
    startAt: Date;
    endAt?: Date;
    paid: number;
    paidAt?: Date;
}

const TimeIntervalSchema = new Schema<ITimeInterval>({
    startAt: { type: Date, required: true },
    endAt: Date,
    paid: { type: Number, required: true },
    paidAt: Date,
});

export const TimeInterval = mongoose.model<ITimeInterval>('TimeInterval', TimeIntervalSchema);
