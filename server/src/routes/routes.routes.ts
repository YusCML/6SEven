import { Router } from 'express';
import { getRouteController, listRoutesController } from '@/controllers/routes.controller';

const router = Router();

router.get('/', listRoutesController);
router.get('/:id', getRouteController);

export default router;
