import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeInterval extends Document {
    startAt: Date;
    endAt?: Date;
    paid: number;
    paidAt?: Date;
    clockId: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

const TimeIntervalSchema = new Schema<ITimeInterval>({
    clockId: { type: Schema.Types.ObjectId, ref: 'Clock', required: true },
    startAt: { type: Date, required: true },
    endAt: Date,
    paid: { type: Number, default: 0 },
    paidAt: Date,
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

TimeIntervalSchema.index({ _id: 1, clockId: 1 });

export const TimeInterval = mongoose.model<ITimeInterval>('TimeInterval', TimeIntervalSchema);
