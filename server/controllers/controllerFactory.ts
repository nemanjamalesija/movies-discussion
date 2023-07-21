import { NextFunction, Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import catchAsync from '../helpers/catchAsync.ts';
import { AppError } from '../helpers/appError.ts';

const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'sucess',
      length: doc.length,
      data: { doc },
    });
  });

const getOne = <T>(Model: Model<T>, populateField: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findById(req.params.id).populate(populateField);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'sucess',
      data: { doc },
    });
  });

const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: { doc },
    });
  });

const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(201).json({
      status: 'sucess',
      data: {
        data: doc,
      },
    });
  });

const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  });

export default { getAll, createOne, updateOne, deleteOne, getOne };
