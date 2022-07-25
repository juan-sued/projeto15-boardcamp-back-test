import { Router } from 'express';
import { registerRental } from '../controllers/rentalsController.js';
import validateNewRental from '../middlewares/registerRentalMiddleware.js';

const router = Router();

router.post('/rentals', validateNewRental, registerRental);

export default router;
