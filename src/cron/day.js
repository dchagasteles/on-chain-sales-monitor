import cron from 'node-cron';
import { Nft, Log } from '../models';

import { useAveragePrice } from '../engine/useAveragePrice';

export const updateNFTPrice = async (chain = 'ETHEREUM') => {
  const { rows, count } = await Nft.findAndCountAll({
    where: {
      chain,
    },
  });

  if (count == 0) {
    return;
  }

  try {
    for (let i = 0; i < count; i++) {
      const nftId = rows[i].id;

      const { etherPrice, usdPrice } = await useAveragePrice(nftId, 12, false);

      if (etherPrice && usdPrice && etherPrice > 0 && usdPrice > 0) {
        await Nft.update(
          {
            etherPrice,
            usdPrice,
          },
          {
            where: {
              id: nftId,
            },
          }
        );

        await Log.create({
          from: 'cron/day/updateNFTPrice',
          msg: `${nftId}, updated with etherPrice of ${etherPrice}`,
          type: 'log',
        });
      }
    }
  } catch (error) {
    await Log.create({
      from: 'cron/day/updateNFTPrice',
      msg: error.message,
      type: 'error',
    });
  }
};

export const everyDayJob = cron.schedule('0 0 0 * * *', async () => {
  console.log('everyDayJob started');
  await updateNFTPrice();
  console.log('everyDayJob ended');
});
