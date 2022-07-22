import { Router } from 'express';

import { registerGame } from '../controllers/gamesControllers.js';

import validateNewGame from '../middlewares/registerGameMiddleware.js';

const router = Router();

router.post('/games', validateNewGame, registerGame);

export default router;
