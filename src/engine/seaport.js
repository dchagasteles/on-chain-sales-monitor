import axios from 'axios';

import { Log } from '../models';

const callAlchemyTransferFunc = async (fromBlock, toBlock, pageKey) => {
  const param = {
    fromBlock,
    toBlock,
    toAddress: '0x00000000006c3852cbef3e08e8df289169ede581',
    category: ['external', 'token'],
  };

  if (pageKey && pageKey !== '') {
    param.pageKey = pageKey;
  }

  const res = await axios.post(
    `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API}`,
    {
      jsonrpc: '2.0',
      id: 0,
      method: 'alchemy_getAssetTransfers',
      params: [param],
    }
  );

  if (
    res &&
    res.data &&
    res.data.result &&
    res.data.result.transfers &&
    res.data.result.transfers.length > 0
  ) {
    const { pageKey, transfers } = res.data.result;
    return {
      nextPageKey: pageKey ? pageKey : '',
      transfers,
    };
  }

  return {
    nextPageKey: '',
    transfers: [],
  };
};

export const getSeaportOrders = async (fromBlock, toBlock) => {
  // retrieve all seaport order transactions using pagination
  let transactions = [];

  try {
    // validation check for blocks
    const intFromBlock = parseInt(fromBlock, 16);
    const intToBlock = parseInt(toBlock, 16);
    if (intFromBlock >= intToBlock) {
      return [];
    }

    let pageKey = '';

    while (true) {
      const res = await callAlchemyTransferFunc(fromBlock, toBlock, pageKey);

      if (res.transfers && res.transfers.length > 0) {
        transactions = transactions.concat(res.transfers);
      } else {
        break;
      }

      if (res.nextPageKey === '') {
        break;
      } else {
        pageKey = res.nextPageKey;
      }
    }

    if (transactions.length > 0) {
      transactions = transactions
        .filter((tx) => {
          if (tx.value && parseFloat(tx.value) > 0 && tx.asset === 'ETH')
            return true;
          return false;
        })
        .map((tx) => {
          const order = {
            blockNumber: parseInt(tx.blockNum, 16),
            transactionHash: tx.hash,
            // from: tx.from,
            // to: tx.to,
            etherPrice: parseFloat(tx.value),
          };
          return order;
        });
    }
  } catch (error) {
    await Log.create({
      from: 'engine/seaport/getSeaportOrders',
      msg: error.message,
      type: 'error',
    });
  }

  return transactions;
};
