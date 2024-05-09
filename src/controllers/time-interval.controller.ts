import { Request, Response } from 'express';
import { ClientDB, ClockDB, TimeIntervalDB } from '../db/db.interface';
import { IUser } from '../models/User';
import { ITimeInterval } from '../models/TimeInterval';


const timeIntervalDB = new TimeIntervalDB();
const clockDB = new ClockDB();
const clientDB = new ClientDB();

export class TimeIntervalController {
    async createTimeInterval(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const { clockId, ...timeIntervalData } = req.body;

            // Check if the clock belongs to the user
            const clock = await clockDB.findById(clockId);
            if (!clock || clock.clientId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const newTimeInterval = await timeIntervalDB.create({ clockId, ...timeIntervalData });
            res.status(201).json(newTimeInterval);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getTimeIntervalById(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const timeIntervalId = req.params.id;

            const timeInterval = await timeIntervalDB.findById(timeIntervalId);
            if (!timeInterval) {
                return res.status(404).json({ error: 'Time interval not found' });
            }

            // Check if the clock belongs to the user
            const clock = await clockDB.findById(timeInterval.clockId.toString());
            if (!clock || !clock.clientId) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            const client = await clientDB.findById(String(clock.clientId));
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            res.json(timeInterval);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateBulk(req: Request, res: Response) {

        try {
            const userId = (req.user as IUser)._id;
            const timeIntervals = req.body as ITimeInterval[];

            if (!timeIntervals) {
                return res.status(404).json({ error: 'Time intervals not sent' });
            }
            const clockIdsSet = new Set(timeIntervals.map(ti => ti.clockId))
            if (clockIdsSet.size !== 1) {
                return res.status(400).json({ error: 'Modofication of multiple clocks not allowed' });
            }
            const clockId = Array.from(clockIdsSet)[0]
            const clock = await clockDB.findById(clockId.toString());
            if (!clock || !clock.clientId) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            const client = await clientDB.findById(clock.clientId.toString());
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            const updateResult = await timeIntervalDB.updateBulk(timeIntervals);

            res.json(updateResult);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getTimeIntervalsByClockId(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockId = req.params.clockId;

            // Check if the clock belongs to the user
            const clock = await clockDB.findById(clockId);
            if (!clock || clock.clientId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const timeIntervals = await timeIntervalDB.findByClockId(clockId);
            res.json(timeIntervals);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateTimeInterval(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const timeIntervalId = req.params.id;
            const updates = req.body;

            const timeInterval = await timeIntervalDB.findById(timeIntervalId);
            if (!timeInterval) {
                return res.status(404).json({ error: 'Time interval not found' });
            }

            // Check if the clock belongs to the user
            const clock = await clockDB.findById(timeInterval.clockId.toString());
            if (!clock || clock.clientId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const updatedTimeInterval = await timeIntervalDB.update(timeIntervalId, updates);
            res.json(updatedTimeInterval);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteTimeInterval(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const timeIntervalId = req.params.id;

            const timeInterval = await timeIntervalDB.findById(timeIntervalId);
            if (!timeInterval) {
                return res.status(404).json({ error: 'Time interval not found' });
            }

            // Check if the clock belongs to the user
            const clock = await clockDB.findById(timeInterval.clockId.toString());
            if (!clock || clock.clientId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await timeIntervalDB.delete(timeIntervalId);
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}