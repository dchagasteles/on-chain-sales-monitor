import BigNumber from 'bignumber.js';

import { Order } from '../../models';
import { successResponse, errorResponse } from '../../helpers';
import { contractAddresses } from '../../config/contractAddresses';

export const addOrder = async (req, res) => {
  try {
    const { tx_id, args, event_name, contract_address } = req.body;
    const transactionHash = tx_id;
    const chainId = req.query.chainId || '1';
    const bigPrice = new BigNumber(args[3]);
    const price = bigPrice.div('1000000000000000000').toNumber().toString();
    const wyvernExchangeV2 = contractAddresses[chainId].wyvernExchangeV2;

    if (
      event_name === 'OrdersMatched' &&
      contract_address === wyvernExchangeV2
    ) {
      const order = await Order.findOne({
        where: { transactionHash },
      });

      if (!order) {
        const payload = {
          transactionHash,
          price,
          chainId,
          createdAt: new Date(),
          updatedAt: new Date(),
          used: false,
        };

        await Order.create(payload);
      } else {
        await Order.destroy({
          where: {
            transactionHash,
          },
        });
      }
    }

    return successResponse(req, res, {});
  } catch (error) {
    console.log('===>addorder failed', error);
    return errorResponse(req, res, error.message);
  }
};

export const getOrder = async (req, res) => {
  try {
    const { transactionHash } = req.params;

    const { rows, count } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
      where: {
        transactionHash,
      },
    });

    if (count === 1) {
      return successResponse(req, res, rows[0]);
    } else if (count > 1) {
      await Order.destroy({
        where: {
          transactionHash,
        },
      });
    }
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { transactionHash } = req.params;

    await Order.destroy({
      where: {
        transactionHash,
      },
    });

    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
