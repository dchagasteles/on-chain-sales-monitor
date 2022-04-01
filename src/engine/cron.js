import cron from 'node-cron';

import { Order } from '../models';

////////////////////////////////////////////////////////////////////////////////////////
/// remove unncessary sales every 4 hours
////////////////////////////////////////////////////////////////////////////////////////
export const updateOrders = async () => {
  console.log('===>updateOrders');

  const now = new Date();
  const ONE_HOUR = 60 * 60 * 1000; /* ms */
  const dateFourHoursAgo = new Date(now.getTime() - ONE_HOUR * 4);

  await Order.destry({
    where: {
      nftId,
      tokenId,
      blockTimestamp: {
        $between: [dateFourHoursAgo, now],
      },
    },
  });
};
export const updateOrdersCronJob = cron.schedule('0 0 */4 * * *', async () => {
  try {
    await calculateDropsFloorPrice();
  } catch (e) {
    console.log(e);
  }
});
