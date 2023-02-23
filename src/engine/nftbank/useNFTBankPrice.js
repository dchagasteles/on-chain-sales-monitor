import { Price, Log } from '../../models';

export const useNFTBankPrice = async (nftId, floor_price) => {
  try {
    let usdPrice = 0;
    let etherPrice = 0;

    if (floor_price.length == 0) {
      return;
    }

    // get usdPrice
    const usdPriceIndex = floor_price.findIndex(
      (f) => f.currency_symbol === 'USD'
    );
    if (usdPriceIndex >= 0) {
      usdPrice = floor_price[usdPriceIndex].floor_price;
    }

    // get etherPRice
    const etherPriceIndex = floor_price.findIndex(
      (f) => f.currency_symbol === 'ETH'
    );
    if (etherPriceIndex >= 0) {
      etherPrice = floor_price[etherPriceIndex].floor_price;
    }

    if (usdPrice > 0 && etherPrice > 0) {
      await Price.create({
        nftId,
        usdPrice: parseFloat(usdPrice).toFixed(4),
        etherPrice: parseFloat(etherPrice).toFixed(4),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    await Log.create({
      from: 'engine/useNFTBankPrice',
      msg: error.message,
      type: 'error',
    });
  }
};
