import { z } from 'zod';
import { Request, Response, NextFunction } from "express";
import path from 'path';

export const validateBody = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validateData = schema.parse(req.body);
            req.body = validateData;
            next();
        }   catch(error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
                });
            }

            return res.status(500).json({
                status: 'error',
                message: 'An internal server error occurred'
            });
        }
    };
};

export const validateParams = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
          try {
            const validateData = schema.parse(req.params);
            res.locals.validatedParams = validateData;
            next();
          } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
                });
            }

            return res.status(500).json({
                status: 'error',
                message: 'An internal server error occurred'
            });
          }
    };
};