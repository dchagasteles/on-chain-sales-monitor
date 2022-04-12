import BigNumber from 'bignumber.js';

import { Order } from '../../models';
import { successResponse, errorResponse } from '../../helpers';
import { contractAddresses } from '../../config/contractAddresses';

export const getOrders = async (req, res) => {
  try {
    const chainId = req.query.chainId || '1';
    const page = req.query.page || 1;
    const limit = 100;

    const { rows } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
      where: {
        chainId,
      },
    });

    return successResponse(req, res, rows);
  } catch (error) {
    console.log(error);
    return await errorResponse(req, res, 'order/getORders', error.message);
  }
};

export const addOrder = async (req, res) => {
  try {
    const { tx_id, args, contract_address, event_name } = req.body;
    const chainId = req.query.chainId || '1';

    let errorMessage = '';
    if (!contract_address) {
      errorMessage += 'No contract_address,';
    }
    if (contract_address != contractAddresses[chainId].wyvernExchangeV2) {
      errorMessage += 'Invalid contract_address';
    }
    if (!args) {
      errorMessage += 'No args';
    }
    if (args.length < 3) {
      errorMessage += 'Invalid args';
    }
    if (!tx_id) {
      errorMessage += 'No tx_id';
    }
    if (!event_name) {
      errorMessage += 'No event_name';
    }
    if (event_name !== 'OrdersMatched') {
      errorMessage += 'Invalid event_name';
    }

    if (errorMessage !== '') {
      return errorResponse(req, res, 'transfer/addTransfer', errorMessage);
    }

    if (args && args.length > 0) {
      const transactionHash = tx_id;

      const bigPrice = new BigNumber(args[3]);
      const price = bigPrice.div('10000000000000000000').toNumber().toFixed(2);

      const order = await Order.findOne({
        where: { transactionHash, chainId },
      });

      if (!order) {
        const payload = {
          transactionHash,
          price,
          chainId,
          used: false,
          source: contract_address,
        };

        await Order.create(payload);
      }
    }

    return successResponse(req, res, {});
  } catch (error) {
    console.log(error);
    return await errorResponse(req, res, 'order/addOrder', error.message);
  }
};

export const getOrder = async (req, res) => {
  try {
    const { transactionHash } = req.params;
    const chainId = req.query.chainId || '1';
    const page = req.query.page || 1;
    const limit = 100;

    const { count, rows } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
      where: {
        transactionHash,
        chainId,
      },
    });

    return successResponse(req, res, count > 0 ? rows[0] : {});
  } catch (error) {
    console.log(error);
    return await errorResponse(req, res, 'order/getOrder', error.message);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { transactionHash } = req.params;
    const chainId = req.query.chainId || '1';

    await Order.destroy({
      where: {
        transactionHash,
        chainId,
      },
    });

    return successResponse(req, res, {});
  } catch (error) {
    return await errorResponse(req, res, 'order/deleteOrder', error.message);
  }
};
