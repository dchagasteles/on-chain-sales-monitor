import BigNumber from 'bignumber.js';

import { Order } from '../../models';
import {
  successResponse,
  errorResponse,
  parseQuickNodeRequest,
} from '../../helpers';
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
    const { error, data } = parseQuickNodeRequest(req);

    if (error != '') {
      return errorResponse(req, res, 'order/addOrder', error);
    }

    const { transactionHash, price, chainId } = data;

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

export const deleteOrders = async (req, res) => {
  try {
    const chainId = req.query.chainId || '1';

    await Order.destroy({
      where: {
        chainId,
      },
    });

    return successResponse(req, res, {});
  } catch (error) {
    return await errorResponse(req, res, 'order/deleteOrders', error.message);
  }
};
