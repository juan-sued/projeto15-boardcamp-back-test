import { Router } from 'express';
import { getCustomers, registerCustomer } from '../controllers/customersController.js';
import validateNewCustomer from '../middlewares/registerCustomerMiddleware.js';

const router = Router();

router.post('/customers', validateNewCustomer, registerCustomer);

router.get('/customers', getCustomers);
export default router;
