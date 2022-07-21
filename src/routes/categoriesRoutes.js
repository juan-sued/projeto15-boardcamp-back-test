import { Router } from 'express';
import registerCategory from '../controllers/categoriesController.js';
import validateNewCategory from '../middlewares/registerCategoriesMiddleware.js';

const router = Router();

router.post('/categories', validateNewCategory, registerCategory);

export default router;
