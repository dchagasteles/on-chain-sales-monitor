import axios from 'axios';

import { Log } from '../models';
import { nfts } from '../config/contractAddresses';

const callAlchemyTransferFunc = async (fromBlock, toBlock, pageKey) => {
  const param = {
    fromBlock,
    toBlock,
    contractAddresses: nfts,
    category: ['token', 'erc721'],
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

export const getNFTTransfers = async (fromBlock, toBlock) => {
  let transactions = [];

  try {
    // validation check for blocks
    const intFromBlock = parseInt(fromBlock, 16);
    const intToBlock = parseInt(toBlock, 16);
    if (intFromBlock >= intToBlock) {
      return [];
    }

    // retrieve all seaport order transactions using pagination

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
      transactions = transactions.map((tx) => {
        const transfer = {
          blockNumber: parseInt(tx.blockNum, 16),
          transactionHash: tx.hash,
          from: tx.from,
          to: tx.to,
          tokenId: parseInt(tx.tokenId, 16),
        };
        return transfer;
      });
    }
  } catch (error) {
    await Log.create({
      from: 'engine/nft/getNFTTransfers',
      msg: error.message,
      type: 'error',
    });
  }

  return transactions;
};
