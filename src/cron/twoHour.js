import cron from 'node-cron';
import axios from 'axios';
import { Nft, Log } from '../models';

import { useNFTBankPrice } from '../engine/useNFTBankPrice';
import { useAveragePrice } from '../engine/useAveragePrice';

export const prepareNFTBankPrices = async (chain = 'ETHEREUM') => {
  const { rows, count } = await Nft.findAndCountAll({
    where: {
      chain,
    },
  });

  if (count == 0) {
    return;
  }

  try {
    const asset_contracts = rows.map((r) => r.address);

    const url = `https://api.nftbank.ai/estimates-v2/floor_price/bulk`;
    const res = await axios.post(
      url,
      {
        asset_contracts,
        chain_id: chain,
      },
      {
        headers: {
          'x-api-key': process.env.NFTBANKAI_API_KEY,
        },
      }
    );

    let floorPrices = [];

    if (
      res.status === 200 &&
      res.data &&
      res.data.data &&
      res.data.data.length > 0
    ) {
      floorPrices = res.data.data;
    }

    for (let i = 0; i < asset_contracts.length; i++) {
      const nft = rows[i];

      const index = floorPrices.findIndex(
        (d) => d.asset_contract.toLowerCase() === nft.address.toLowerCase()
      );

      if (index > -1 && floorPrices[index].floor_price) {
        await useNFTBankPrice(nft.id, floorPrices[index].floor_price);
      } else {
        await useAveragePrice(nft.id, 3);
      }
    }
  } catch (error) {
    await Log.create({
      from: 'cron/prepareNFTBankPrices',
      msg: error.message,
      type: 'error',
    });
  }
};

export const every2hourJob = cron.schedule('0 0 */2 * * *', async () => {
  console.log('every2hourJob started');
  await prepareNFTBankPrices();
  console.log('every2hourJob started');
});
