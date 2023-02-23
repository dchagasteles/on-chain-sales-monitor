import { Price, Log } from '../../models';

export const useAveragePrice = async (nftId, limit, save = true) => {
  let usdPrice = 0;
  let etherPrice = 0;

  try {
    const prices = await Price.findAll({
      order: [['createdAt', 'DESC']],
      offset: 0,
      limit,
      where: {
        nftId,
      },
    });

    let cnt = 0;
    let totalEther = 0;
    let totalUsd = 0;
    for (let i = 0; i < prices.length; i++) {
      if (prices[i] && prices[i].etherPrice && prices[i].usdPrice) {
        totalEther += prices[i].etherPrice;
        totalUsd += prices[i].usdPrice;
        cnt++;
      }
    }

    if (cnt > 0 && totalEther > 0) {
      usdPrice = totalUsd / cnt;
      etherPrice = totalEther / cnt;

      if (save) {
        await Price.create({
          nftId,
          usdPrice,
          etherPrice,
        });
      }
    }
  } catch (error) {
    await Log.create({
      from: 'engine/useAveragePrice',
      msg: `nftId: ${nftId}: ${error.message}`,
      type: 'error',
    });
  }

  return {
    usdPrice,
    etherPrice,
  };
};
