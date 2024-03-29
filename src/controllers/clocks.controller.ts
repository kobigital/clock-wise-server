// controllers/clientController.ts
import { Request, Response } from 'express';
import { Clock } from '../models/Clock';

export const getClocks = async (req: Request, res: Response) => {
    try {
        const clocks = await Clock.find();
        res.json(clocks);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

export const getClock = async (req: Request, res: Response) => {
    try {
        const clock = await Clock.findById(req.params.id);
        if (clock == null) {
            return res.status(404).json({ message: 'Cannot find clock' });
        }
        res.json(clock);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

export const createClock = async (req: Request, res: Response) => {
    const clock = new Clock({
        intervals: [],
        client: req.body.client,
        name: req.body.name,
        note: req.body.note
    });

    console.log(req.body);

    try {
        const newClock = await clock.save();
        res.status(201).json(newClock);
    } catch (err) {
        res.status(400).json({ message: err });
    }
};

export const updateClock = async (req: Request, res: Response) => {
    try {
        const clock = await Clock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(clock);
    } catch (err) {
        res.status(400).json({ message: err });
    }
};

export const deleteClock = async (req: Request, res: Response) => {
    try {
        await Clock.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted clock' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
