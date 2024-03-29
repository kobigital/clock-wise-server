
import { Request, Response } from 'express';
import { Client } from '../models/Client';
import { IUser } from '../models/User';
import { ObjectId } from 'bson';

export const getClients = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as IUser)._id;
        const clients = await Client.find({ user: new ObjectId(userId as string) }).populate({
            path: 'clocks',
            populate: {
                path: 'intervals',
                model: 'TimeInterval'
            }
        });
        res.json(clients);
    } catch (err) {
        console.log({ err });
        res.status(500).json({ message: err });
    }
};

export const getClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findById(req.params.id);
        if (client == null) {
            return res.status(404).json({ message: 'Cannot find client' });
        }
        res.json(client);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

export const createClient = async (req: Request, res: Response) => {
    console.log(req.body);
    const userId = (req.user as IUser)._id;
    const client = new Client({
        name: req.body.name,
        creditTime: req.body.creditTime,
        isFavorite: req.body.isFavorite,
        note: req.body.note,
        color: req.body.color,
        user: userId,
    });

    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        console.log({ err });
        res.status(400).json({ message: err });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(client);
    } catch (err) {
        res.status(400).json({ message: err });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Client' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
