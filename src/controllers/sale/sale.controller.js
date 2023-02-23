import { Sale } from '../../models';
import { Op } from 'sequelize';

export const getSales = async (req, res) => {
  try {
    const blockNumber = parseInt(req.query.blockNumber);
    const chainId = req.query.chainId || '1';
    const page = req.query.page || 1;
    const limit = 100;

    const { rows } = await Sale.findAndCountAll({
      Sale: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
      where: {
        chainId,
        blockNumber: {
          [Op.gte]: blockNumber,
        },
      },
    });

    return successResponse(req, res, rows);
  } catch (error) {
    return await errorResponse(req, res, 'Sale/getSales', error.message);
  }
};

export const deleteSales = async (req, res) => {
  try {
    const chainId = req.query.chainId || '1';

    if (req.body.blockNumber) {
      await Sale.destroy({
        where: {
          chainId,
          blockNumber: {
            [Op.lte]: parseInt(req.body.blockNumber),
          },
        },
      });
    } else {
      await Sale.destroy({
        where: {
          chainId,
        },
      });
    }

    return successResponse(req, res, {});
  } catch (error) {
    return await errorResponse(req, res, 'Sale/clearSales', error.message);
  }
};
