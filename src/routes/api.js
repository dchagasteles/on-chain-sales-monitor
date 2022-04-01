import express from 'express';
import validate from 'express-validation';

import * as orderController from '../controllers/order/order.controller';
import * as orderValidator from '../controllers/order/order.validator';

const router = express.Router();

// for quicknode
router.post(
  '/orders',
  validate(orderValidator.addOrder),
  orderController.addOrder
);

// for Drops API
router.get(
  '/orders/:transactionHash',
  validate(orderValidator.getOrder),
  orderController.getOrder
);

router.delete(
  '/orders/:transactionHash',
  validate(orderValidator.deleteOrder),
  orderController.deleteOrder
);

module.exports = router;
