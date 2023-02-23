import { Op } from 'sequelize';

import { Sale, Log } from '../models';

export const removeOldSales = async () => {
  console.log('=====>removeOldSales');
  const now = new Date();
  const ONE_HOUR = 60 * 60 * 1000; /* ms */
  const fourHoursAgo = new Date(now.getTime() - ONE_HOUR * 24);

  try {
    await Sale.destroy({
      where: {
        createdAt: {
          [Op.lte]: fourHoursAgo,
        },
      },
    });
  } catch (error) {
    await Log.create({
      from: 'engine/remove/removeSales',
      msg: error.message,
      type: 'error',
    });
  }
};
