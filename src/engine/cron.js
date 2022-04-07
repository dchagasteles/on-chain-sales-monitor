import cron from 'node-cron';
import { Op } from 'sequelize';

import { Order, Log } from '../models';

////////////////////////////////////////////////////////////////////////////////////////
/// remove unncessary sales every 4 hours
////////////////////////////////////////////////////////////////////////////////////////
export const removeOrders = async () => {
  await Log.create({
    from: 'cron/updateOrdres',
    msg: 'removing orders before 4 hours ago',
    type: 'log',
  });

  const now = new Date();
  const ONE_HOUR = 60 * 60 * 1000; /* ms */
  const dateFourHoursAgo = new Date(now.getTime() - ONE_HOUR * 4);

  try {
    await Order.destroy({
      where: {
        createdAt: {
          [Op.lte]: dateFourHoursAgo,
        },
      },
    });
  } catch (e) {
    await Log.create({
      from: 'cron/updateOrdres',
      msg: `failed to remove orders before ${dateFourHoursAgo.toString()}`,
      type: 'error',
    });
  }
};

export const removeOrdersCron = cron.schedule('0 0 */4 * * *', async () => {
  try {
    await removeOrders();
  } catch (e) {
    console.log(e);
  }
});
