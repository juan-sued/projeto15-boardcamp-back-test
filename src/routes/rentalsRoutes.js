import { Router } from 'express';
import { getRentals, registerRental } from '../controllers/rentalsController.js';
import validateNewRental from '../middlewares/registerRentalMiddleware.js';

const router = Router();

router.post('/rentals', validateNewRental, registerRental);

router.get('/rentals', getRentals);

export default router;
