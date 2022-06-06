import cron from 'node-cron';
import { Op } from 'sequelize';

import { Order, Log } from '../models';

////////////////////////////////////////////////////////////////////////////////////////
/// remove unncessary sales every 4 hours
////////////////////////////////////////////////////////////////////////////////////////
export const removeOrders = async () => {
  const now = new Date();
  const ONE_HOUR = 60 * 60 * 1000; /* ms */
  const fourHoursAgo = new Date(now.getTime() - ONE_HOUR * 4);

  try {
    await Order.destroy({
      where: {
        createdAt: {
          [Op.lte]: fourHoursAgo,
        },
      },
    });
  } catch (e) {
    await Log.create({
      from: 'cron/updateOrdres',
      msg: `failed to remove orders before ${fourHoursAgo.toString()}, ${
        e.message
      }`,
      type: 'error',
    });
  }
};

export const removeOrdersCron = cron.schedule('0 0 */4 * * *', async () => {
  await removeOrders();
});
