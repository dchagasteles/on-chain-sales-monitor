import { Nft, Log, Price } from '../../models';

export const updateNFTPrice = async (chain = 'ETHEREUM') => {
  const { rows, count } = await Nft.findAndCountAll({
    where: {
      chain,
    },
  });

  if (count == 0) return;

  try {
    for (let i = 0; i < count; i++) {
      const nftId = rows[i].id;

      const prices = await Price.findAll({
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 6,
        where: {
          nftId,
        },
      });

      if (prices.length > 0) {
        let totalEther = 0;
        for (let i = 0; i < prices.length; i++) {
          totalEther += prices[i].etherPrice;
        }

        const newEtherPrice = totalEther / prices.length;
        await Nft.update(
          {
            etherPrice: newEtherPrice,
          },
          {
            where: {
              id: nftId,
            },
          }
        );

        await Log.create({
          from: 'engine/update/updateNFTPrice',
          msg: `${nftId}, updated with etherPrice of ${newEtherPrice}`,
          type: 'log',
        });
      }
    }
  } catch (error) {
    await Log.create({
      from: 'engine/update/updateNFTPrice',
      msg: error.message,
      type: 'error',
    });
  }
};
