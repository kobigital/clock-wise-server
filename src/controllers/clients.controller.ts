import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { ClientDB, ClockDB, TimeIntervalDB } from '../db/db.interface';
import { IClient } from '../models/Client';

const clientDB = new ClientDB();
const clockDB = new ClockDB();
const timeIntervalDB = new TimeIntervalDB();

export class ClientController {
    async createClient(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clientData = req.body;

            const newClient = await clientDB.create({ ...clientData, user: userId });
            res.status(201).json(newClient);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getClientById(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clientId = req.params.id;

            const { clocks, intervals } = req.query

            const client = await clientDB.findById(clientId);

            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
            // Check if the client belongs to the user
            if (client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            // Add clocks and interval if asked
            if (!clocks) {
                return res.json(client);
            }
            const clientClocks = await clockDB.findByClient(client._id.toString())
            const clientWithClocks = { ...client.toObject(), clocks: clientClocks } as IClient
            if (!intervals || !clientWithClocks.clocks) {
                return res.json(client);
            }
            const clocksWithIntervals = await Promise.all(
                clientWithClocks.clocks.map(async (clock) => {
                    const intervals = await timeIntervalDB.findByClockId(clock._id.toString());
                    return { ...clock.toObject(), intervals };
                })
            );

            clientWithClocks.clocks = clocksWithIntervals;



            res.json(clientWithClocks);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getClientsByUserId(req: Request, res: Response) {
        try {

            const userId = (req.user as IUser)._id;

            const { clocks, intervals } = req.query

            const clients = await clientDB.findByUser(userId);

            if (!clocks) {
                return res.json(clients);
            }
            // Add clocks and interval if asked
            const clientsWithClocksAndIntervals = await Promise.all(
                clients.map(async (client) => {
                    const clocks = await clockDB.findByClient(client._id.toString());

                    if (!intervals) {
                        return { clocks, ...client.toObject() };
                    }
                    const clocksWithIntervals = await Promise.all(
                        clocks.map(async (clock) => {
                            const intervals = await timeIntervalDB.findByClockId(clock._id.toString());
                            return { ...clock.toObject(), intervals };
                        })
                    );

                    return { ...client.toObject(), clocks: clocksWithIntervals };
                })
            );
            return res.json(clientsWithClocksAndIntervals);

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateClient(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clientId = req.params.id;
            const updates = req.body;

            const client = await clientDB.findById(clientId);
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            // Check if the client belongs to the user
            if (client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const updatedClient = await clientDB.update(clientId, updates);
            res.json(updatedClient);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteClient(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id;
            const clientId = req.params.id;

            const client = await clientDB.findById(clientId);
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            // Check if the client belongs to the user
            if (client.user.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await clientDB.delete(clientId);
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}