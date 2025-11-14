import { z } from 'zod';

export const createSceneSchema = z.object({
    title: z
        .string()
        .min(1, "Scene title is required")
        .max(100, "Scene title must be less than 100 characters"),
    elements:z.string().min(1, "At least one element is required"),
    elementCount: z
        .number()
        .int()
        .positive("Element count must be a positive number")
});

export const updateSceneSchema = z.object({
    title: z
        .string()
        .min(1, "Scene title is required")
        .optional(),
    elements:z
        .string()
        .optional(),
    elementCount: z
        .number()
        .positive()
        .optional(),
}).refine(
  (data) => data.title !== undefined || data.elements !== undefined || data.elementCount !== undefined,
  { message: "At least one field (title, elements, or elementCount) must be provided" }
); 

export const sceneIdSchema = z.object({
  id: z.string().uuid({ message: "This is not a valid UUID" })
});

export type CreateSceneInput = z.infer<typeof createSceneSchema>;
export type UpdateSceneInput = z.infer<typeof updateSceneSchema>;
export type SceneIdInput = z.infer<typeof sceneIdSchema>;