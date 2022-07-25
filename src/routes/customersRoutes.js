import { Router } from 'express';
import {
  getCustomers,
  putCustomers,
  registerCustomer
} from '../controllers/customersController.js';
import validateAttCustomer from '../middlewares/attCustomerMiddleware.js';
import validateNewCustomer from '../middlewares/registerCustomerMiddleware.js';

const router = Router();

router.post('/customers', validateNewCustomer, registerCustomer);

router.get('/customers/:id', getCustomers);

router.put('/customers/:id', validateAttCustomer, putCustomers);

export default router;
