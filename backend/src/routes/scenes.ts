import { Router } from 'express';
import { SceneController } from '../controllers/SceneController';
import { validateAuth } from '../middleware/validateAuth';
import { validateBody, validateParams } from '../middleware/validation';
import { createSceneSchema, sceneIdSchema, updateSceneSchema } from '../validations/sceneValidations';

const router = Router();
router.use(validateAuth);

router.post('/', validateBody(createSceneSchema), SceneController.createScene);
router.get('/', SceneController.getUserScenes);
router.get('/:id', validateParams(sceneIdSchema), SceneController.getSceneById);
router.put('/:id', validateParams(sceneIdSchema), validateBody(updateSceneSchema), SceneController.updateScene);
router.delete('/:id', validateParams(sceneIdSchema), SceneController.deleteScene);

export default router;