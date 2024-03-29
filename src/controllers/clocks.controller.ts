import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { ClockDB, ClientDB } from '../db/db.interface';

const clockDB = new ClockDB();
const clientDB = new ClientDB();

export class ClockController {
    async createClock(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockData = req.body;
            const clientId = clockData.client
            if (!clientId) {
                return res.status(400).json({ error: 'client Id is missing' });
            }

            // Check if the client belongs to the user
            const client = await clientDB.findById(clientId);
            if (!client || client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const newClock = await clockDB.create({ ...clockData, client: clientId });
            res.status(201).json(newClock);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getClockById(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clockId = req.params.id;

            const clock = await clockDB.findById(clockId);
            if (!clock) {
                return res.status(404).json({ error: 'Clock not found' });
            }

            // Check if the client belongs to the user
            const client = await clientDB.findById(clock.client.toString());
            if (!client || client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            res.json(clock);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getClocksByClientId(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clientId = req.params.clientId;

            // Check if the client belongs to the user
            const client = await clientDB.findById(clientId);
            if (!client || client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const clocks = await clockDB.findByClient(clientId);
            res.json(clocks);
        } catch (error) {
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
            const client = await clientDB.findById(clock.client.toString());
            if (!client || client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const updatedClock = await clockDB.update(clockId, updates);
            res.json(updatedClock);
        } catch (error) {
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
            const client = await clientDB.findById(clock.client.toString());
            if (!client || client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await clockDB.delete(clockId);
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}