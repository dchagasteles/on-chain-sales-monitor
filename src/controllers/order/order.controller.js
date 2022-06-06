import { Op } from 'sequelize';
import { Order } from '../../models';
import {
  successResponse,
  errorResponse,
  parseQuickNodeRequest,
} from '../../helpers';

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
    return await errorResponse(req, res, 'order/getORders', error.message);
  }
};

export const addOrder = async (req, res) => {
  try {
    const { error, data } = parseQuickNodeRequest(req);

    if (error === '') {
      const { transactionHash, price, chainId, contract } = data;

      const order = await Order.findOne({
        where: { transactionHash, chainId },
      });

      if (!order) {
        const payload = {
          transactionHash,
          price,
          chainId,
          used: false,
          source: contract,
        };

        await Order.create(payload);
      }
    }

    return successResponse(req, res, {});
  } catch (error) {
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

export const getOrderPrices = async (req, res) => {
  try {
    const chainId = req.query.chainId || '1';
    const page = req.query.page || 1;
    const limit = 100;
    const transactionHashs = (req.body.transactionHashs || '').split(',');

    const { rows, count } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
      where: {
        chainId,
        transactionHash: {
          [Op.in]: transactionHashs,
        },
      },
    });

    const resData = {
      count,
      hashs: rows.map((r) => r.transactionHash),
      prices: rows.map((r) => r.price),
    };

    return successResponse(req, res, resData);
  } catch (error) {
    return await errorResponse(req, res, 'order/getORders', error.message);
  }
};
