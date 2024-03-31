import { Client, IClient } from "../models/Client";
import { Clock, IClock } from "../models/Clock";
import { ITimeInterval, TimeInterval } from "../models/TimeInterval";

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
        return TimeInterval.findById(id).exec();
    }

    async findByClockId(clockId: string): Promise<ITimeInterval[]> {
        return TimeInterval.find({ clockId }).exec();
    }

    async update(id: string, updates: Partial<ITimeInterval>): Promise<ITimeInterval | null> {
        return TimeInterval.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await TimeInterval.findByIdAndDelete(id).exec();
    }

    async findOngoingByClockId(clockId: string): Promise<ITimeInterval | null> {
        return TimeInterval.findOne({ clockId, endAt: { $exists: false } }).exec();
    }
}

interface IClockDB {
    create(clock: Omit<IClock, '_id'>): Promise<IClock>;
    findById(id: string): Promise<IClock | null>;
    findByClientId(clientId: string): Promise<IClock[]>;
    update(id: string, updates: Partial<IClock>): Promise<IClock | null>;
    delete(id: string): Promise<void>;
}

class ClockDB implements IClockDB {
    async create(clock: Omit<IClock, '_id'>): Promise<IClock> {
        const newClock = new Clock(clock);
        return newClock.save();
    }

    async findById(id: string): Promise<IClock | null> {
        return Clock.findById(id).exec();
    }

    async findByClientId(clientId: string): Promise<IClock[]> {
        return Clock.find({ clientId }).exec();
    }

    async update(id: string, updates: Partial<IClock>): Promise<IClock | null> {
        return Clock.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await Clock.findByIdAndDelete(id).exec();
    }
}

interface IClientDB {
    create(client: Omit<IClient, '_id'>): Promise<IClient>;
    findById(id: string): Promise<IClient | null>;
    findByUserId(userId: string): Promise<IClient[]>;
    update(id: string, updates: Partial<IClient>): Promise<IClient | null>;
    delete(id: string): Promise<void>;
}

class ClientDB implements IClientDB {
    async create(client: Omit<IClient, '_id'>): Promise<IClient> {
        const newClient = new Client(client);
        return newClient.save();
    }

    async findById(id: string): Promise<IClient | null> {
        return await Client.findById(id);
    }

    async findByUserId(userId: string): Promise<IClient[]> {
        return await Client.find({ userId });
    }

    async update(id: string, updates: Partial<IClient>): Promise<IClient | null> {
        return await Client.findByIdAndUpdate(id, updates, { new: true });
    }

    async delete(id: string): Promise<void> {
        await await Client.findByIdAndDelete(id);
    }
}

export { ITimeIntervalDB, TimeIntervalDB, IClockDB, ClockDB, IClientDB, ClientDB };