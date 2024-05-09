// db.interface.ts
import { UpdateWriteOpResult } from "mongoose";
import { Client, IClient } from "../models/Client";
import { Clock, IClock } from "../models/Clock";
import { ITimeInterval, TimeInterval } from "../models/TimeInterval";

interface BulkUpdateResult {
    successIds: string[];
    failureIds: string[];
}

interface ITimeIntervalDB {
    create(data: { clockId: string; startAt: Date }): Promise<ITimeInterval>;
    findById(id: string): Promise<ITimeInterval | null>;
    findByClockId(clockId: string): Promise<ITimeInterval[]>;
    update(id: string, updates: Partial<ITimeInterval>): Promise<ITimeInterval | null>;
    delete(id: string): Promise<void>;
}

class TimeIntervalDB implements ITimeIntervalDB {
    async create(data: { clockId: string; startAt: Date }): Promise<ITimeInterval> {
        const newTimeInterval = new TimeInterval(data);
        return newTimeInterval.save();
    }

    async findById(id: string): Promise<ITimeInterval | null> {
        return TimeInterval.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findByClockId(clockId: string): Promise<ITimeInterval[]> {
        return TimeInterval.find({ clockId, deletedAt: null }).exec();
    }

    async update(id: string, updates: Partial<ITimeInterval>): Promise<ITimeInterval | null> {
        return TimeInterval.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await TimeInterval.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
    }

    async findOngoingByClockId(clockId: string): Promise<ITimeInterval | null> {
        return TimeInterval.findOne({ clockId, endAt: { $exists: false }, deletedAt: null }).exec();
    }

    async updateBulk(updates: ITimeInterval[]): Promise<BulkUpdateResult> {
        const bulkOperations = updates.map(({ _id, ...interval }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: interval }
            }
        }));
        const result: BulkUpdateResult = { successIds: [], failureIds: [] };
        try {
            const writeResult = await TimeInterval.bulkWrite(bulkOperations);
        } catch (error) {
            console.error(`Error updating bulk intervals: ${error}`);
            result.failureIds = updates.map(({ _id }) => _id);
        }
        return result;
    }
}

interface IClockDB {
    create(clock: Omit<IClock, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<IClock>;
    findById(id: string): Promise<IClock | null>;
    findByClientId(clientId: string): Promise<IClock[]>;
    update(id: string, updates: Partial<IClock>): Promise<IClock | null>;
    delete(id: string): Promise<void>;
}

class ClockDB implements IClockDB {
    async create(clock: Omit<IClock, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<IClock> {
        const newClock = new Clock(clock);
        return newClock.save();
    }

    async findById(id: string): Promise<IClock | null> {
        return Clock.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findByClientId(clientId: string): Promise<IClock[]> {
        return Clock.find({ clientId, deletedAt: null }).exec();
    }

    async update(id: string, updates: Partial<IClock>): Promise<IClock | null> {
        return Clock.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await Clock.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
    }
}

interface IClientDB {
    create(client: Omit<IClient, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<IClient>;
    findById(id: string): Promise<IClient | null>;
    findByUserId(userId: string): Promise<IClient[]>;
    update(id: string, updates: Partial<IClient>): Promise<IClient | null>;
    delete(id: string): Promise<void>;
}

class ClientDB implements IClientDB {
    async create(client: Omit<IClient, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<IClient> {
        const newClient = new Client(client);
        return newClient.save();
    }

    async findById(id: string): Promise<IClient | null> {
        return await Client.findOne({ _id: id, deletedAt: null });
    }

    async findByUserId(userId: string): Promise<IClient[]> {
        return await Client.find({ userId, deletedAt: null });
    }

    async update(id: string, updates: Partial<IClient>): Promise<IClient | null> {
        return await Client.findByIdAndUpdate(id, updates, { new: true });
    }

    async delete(id: string): Promise<void> {
        await Client.findByIdAndUpdate(id, { deletedAt: new Date() });
    }
}

export { ITimeIntervalDB, TimeIntervalDB, IClockDB, ClockDB, IClientDB, ClientDB };