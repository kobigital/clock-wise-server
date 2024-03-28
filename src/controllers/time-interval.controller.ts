// controllers/clientController.ts
import { Request, Response } from 'express';
import { TimeInterval } from '../models/TimeInterval';

export const getTimeIntervals = async (req: Request, res: Response) => {
    try {
        const intervals = await TimeInterval.find();
        res.json(intervals);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

export const getTimeInterval = async (req: Request, res: Response) => {
    try {
        const interval = await TimeInterval.findById(req.params.id);
        if (interval == null) {
            return res.status(404).json({ message: 'Cannot find interval' });
        }
        res.json(interval);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

export const createTimeInterval = async (req: Request, res: Response) => {
    const interval = new TimeInterval({
        intervals: [],
        client: req.user
    });

    try {
        const newInterval = await interval.save();
        res.status(201).json(newInterval);
    } catch (err) {
        res.status(400).json({ message: err });
    }
};

export const updateTimeInterval = async (req: Request, res: Response) => {
    try {
        const interval = await TimeInterval.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(interval);
    } catch (err) {
        res.status(400).json({ message: err });
    }
};

export const deleteTimeInterval = async (req: Request, res: Response) => {
    try {
        await TimeInterval.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted interval' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
