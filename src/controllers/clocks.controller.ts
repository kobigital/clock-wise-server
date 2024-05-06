import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { ClockDB, ClientDB, TimeIntervalDB } from '../db/db.interface';

const clockDB = new ClockDB();
const clientDB = new ClientDB();
const timeIntervalDB = new TimeIntervalDB();


export class ClockController {
    async createClock(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockData = req.body;
            const clientId = clockData.clientId
            if (!clientId) {
                return res.status(400).json({ error: 'client Id is missing' });
            }

            // Check if the client belongs to the user
            const client = await clientDB.findById(clientId);
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const newClock = await clockDB.create({ ...clockData, client: clientId });
            res.status(201).json(newClock);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getClockById(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockId = req.params.id;
            const { intervals } = req.query

            const clock = await clockDB.findById(clockId);
            if (!clock) {
                return res.status(404).json({ error: 'Clock not found' });
            }


            // Check if the client belongs to the user
            const client = await clientDB.findById(clock.clientId.toString());
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            if (!intervals) {
                return res.json(clock);
            }
            const clockIntervals = await timeIntervalDB.findByClockId(clock._id.toString());
            return res.json({ ...clock, intervals: clockIntervals });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getClocksByClientId(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clientId = req.params.clientId;

            // Check if the client belongs to the user
            const client = await clientDB.findById(clientId);
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const clocks = await clockDB.findByClientId(clientId);
            res.json(clocks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateClock(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockId = req.params.id;
            const updates = req.body;

            const clock = await clockDB.findById(clockId);
            if (!clock) {
                return res.status(404).json({ error: 'Clock not found' });
            }

            // Check if the client belongs to the user
            const client = await clientDB.findById(clock.clientId.toString());
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const updatedClock = await clockDB.update(clockId, updates);
            res.json(updatedClock);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteClock(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockId = req.params.id;

            const clock = await clockDB.findById(clockId);
            if (!clock) {
                return res.status(404).json({ error: 'Clock not found' });
            }

            // Check if the client belongs to the user
            const client = await clientDB.findById(clock.clientId.toString());
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await clockDB.delete(clockId);
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async startClock(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockId = req.params.id;

            const clock = await clockDB.findById(clockId);
            if (!clock) {
                return res.status(404).json({ error: 'Clock not found' });
            }

            // Check if the client belongs to the user
            const client = await clientDB.findById(clock.clientId.toString());
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Check if there is an ongoing interval without endAt attribute
            const ongoingInterval = await timeIntervalDB.findOngoingByClockId(clockId);
            if (ongoingInterval) {
                return res.status(400).json({ error: 'An interval is already ongoing' });
            }

            // Create a new interval with the clock ID
            const newInterval = await timeIntervalDB.create({ clockId, startAt: new Date() });
            res.status(201).json(newInterval);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async stopClock(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockId = req.params.id;

            const clock = await clockDB.findById(clockId);
            if (!clock) {
                return res.status(404).json({ error: 'Clock not found' });
            }

            // Check if the client belongs to the user
            const client = await clientDB.findById(clock.clientId.toString());
            if (!client || client.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Find the ongoing interval without endAt attribute
            const ongoingInterval = await timeIntervalDB.findOngoingByClockId(clockId);
            if (!ongoingInterval) {
                return res.status(400).json({ error: 'No ongoing interval found' });
            }

            // Set the endAt attribute of the ongoing interval
            const updatedInterval = await timeIntervalDB.update(ongoingInterval._id.toString(), { endAt: new Date() });
            res.json(updatedInterval);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}