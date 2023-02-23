import express from 'express';
import validate from 'express-validation';

import * as orderController from '../controllers/order/order.controller';
import * as orderValidator from '../controllers/order/order.validator';
import * as logController from '../controllers/log/log.controller';
import * as saleController from '../controllers/sale/sale.controller';
import * as saleValidator from '../controllers/sale/sale.validator';

const router = express.Router();

// get ether price of NFT
router.get(
  '/price',
  validate(priceValidator.getPrice),
  priceController.getPrice
);

// get ether all price of NFT
router.get(
  '/prices/:id',
  validate(priceValidator.allPrices),
  priceController.allPrices
);

// for CRUD of NFTs
router.get('/nfts', nftController.allNfts);
router.get('/nfts/:id', validate(nftValidator.getNft), nftController.getNft);
router.post('/nfts', validate(nftValidator.addNft), nftController.addNft);
router.put(
  '/nfts/:id',
  validate(nftValidator.updateNft),
  nftController.updateNft
);
router.delete(
  '/nfts/:id',
  validate(nftValidator.removeNft),
  nftController.removeNft
);

// for testing purpose
router.post('/manual', manualController.doManual);

// for quicknode
router.post(
  '/orders',
  validate(orderValidator.addOrder),
  orderController.addOrder
);
router.get('/orders', orderController.getOrders);
router.delete('/orders', orderController.deleteOrders);

router.get('/sales', validate(saleValidator.getSales), saleController.getSales);
router.delete(
  '/sales',
  validate(saleValidator.deleteSales),
  saleController.deleteSales
);

// for Drops API
router.get(
  '/orders/:transactionHash',
  validate(orderValidator.getOrder),
  orderController.getOrder
);

router.post(
  '/getOrderPrices',
  validate(orderValidator.getOrderPrices),
  orderController.getOrderPrices
);

router.delete(
  '/orders/:transactionHash',
  validate(orderValidator.deleteOrder),
  orderController.deleteOrder
);

// for Logs
router.get('/logs', logController.getLogs);
router.delete('/logs', logController.clearLogs);

module.exports = router;
