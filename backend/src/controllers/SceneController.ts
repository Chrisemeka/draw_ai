import { Request, Response } from "express";
import prisma from "../prisma";

interface AuthRequest extends Request{
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export class SceneController {
    static createScene = async (req: AuthRequest, res: Response) => {
        try {
            const {title, elements, elementCount} = req.body;

            const userId = req.user?.id;

            if(!userId) {
                return res.status(401).json({status: 'error', message: 'User is not authenticated'});
            } 
            
            const scene = await prisma.scene.create({
                data:{
                    userId,
                    title,
                    elements,
                    elementCount,
                }
            });

            return res.status(201).json({status: 'success', message: 'Scene created successfully', data: {scene}});
        } catch (error) {
            console.error('Error creating scene:', error);
            res.status(500).json({status: 'error', message: 'Failed to create scene'});
        };
    };

    static getUserScenes = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ status: 'error', message: 'User is not authenticated' });
            }

            const scenes = await prisma.scene.findMany({
                where: {userId},
                orderBy: { updatedAt: 'desc' }
            });

            return res.status(200).json({status: 'success', message: 'All scenes retrieved successfully', data: {scenes}})
        } catch (error) {
            console.error('Error retrieving scene:', error);
            res.status(500).json({status: 'error', message: 'Failed to retrieve user scenes'});
        };
    };

    static getSceneById = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;

            const { id } = res.locals.validatedParams;
            
            if (!userId) {
                return res.status(401).json({ status: 'error', message: 'User is not authenticated' });
            }

            const scene = await prisma.scene.findUnique({
                where:{id}
            });

            if(!scene) {
                return res.status(404).json({status: 'error', message: 'Failed to find the scene'});
            }

            if(userId !== scene.userId) {
                return res.status(403).json({status: 'error', message: 'You do not have permission to view this scene'});
            }

            return res.status(200).json({status: 'success', message: 'Scene retrieved successfully', data: {scene}});
        } catch (error) {
            console.error('Error retrieving  scene:', error);
            res.status(500).json({status: 'error', message: 'Failed to retrieve user scenes'});
        }
    };

    static updateScene = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;

            const { id } = res.locals.validatedParams;

            if (!userId) {
                return res.status(401).json({ status: 'error', message: 'User is not authenticated' });
            }

            const {title, elements, elementCount} = req.body;

            const scene = await prisma.scene.findUnique({
                where:{id}
            });
            
            if(!scene) {
                return res.status(404).json({status: 'error', message: 'Failed to find the scene'});
            }

            if(userId !== scene.userId) {
                return res.status(403).json({status: 'error', message: 'You do not have permission to make changes to this scene'});
            }

            const updatedScene = await prisma.scene.update({
                where:{
                    id: id,
                },
                data:{
                    title,
                    elements,
                    elementCount,
                }
            })

            return res.status(200).json({status: 'success', message: 'Scene was successfully updated', data: {updatedScene}});
        } catch (error) {
            console.error('Error updating scene:', error);
            res.status(500).json({status: 'error', message: 'Failed to retrieve user scenes'}); 
        }
    };

    static deleteScene = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;

            const { id } = res.locals.validatedParams;

            if (!userId) {
                return res.status(401).json({ status: 'error', message: 'User is not authenticated' });
            } 
            
            const scene = await prisma.scene.findUnique({
                where:{id}
            });
            
            if(!scene) {
                return res.status(404).json({status: 'error', message: 'Failed to find the scene'});
            }

            if(userId !== scene.userId) {
                return res.status(403).json({status: 'error', message: 'You do not have permission to make changes to this scene'});
            }

            const deletedScene = await prisma.scene.delete({
                where: {
                    id: id
                }
            })
            return res.status(200).json({status: 'success', message: 'Scene was successfully deleted', data: {deletedScene}});
        } catch (error) {
            console.error('Error deleting scene:', error);
            res.status(500).json({status: 'error', message: 'Failed to retrieve user scenes'}); 
        }
    }
}