import { Router } from 'express';
import {
  getRentals,
  registerRental,
  returnRental
} from '../controllers/rentalsController.js';
import validateNewRental from '../middlewares/registerRentalMiddleware.js';
import validateReturnRental from '../middlewares/validateReturnRental.js';

const router = Router();

router.post('/rentals', validateNewRental, registerRental);

router.get('/rentals', getRentals);

router.post('/rentals/:id/return', validateReturnRental, returnRental);

export default router;
