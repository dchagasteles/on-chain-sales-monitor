import axios from 'axios';

import { Block } from '../models';

export const getToBlock = async () => {
  // get current block number
  const lastestBlockNumberRes = await axios.post(
    `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API}`,
    {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 0,
    }
  );

  if (
    lastestBlockNumberRes &&
    lastestBlockNumberRes.data &&
    lastestBlockNumberRes.data.result &&
    lastestBlockNumberRes.data.result.startsWith('0x')
  ) {
    return lastestBlockNumberRes.data.result;
  }
  return '';
};

export const getFromBlock = async () => {
  const searchedBlock = await Block.findOne({
    order: [['createdAt', 'DESC']],
    offset: 0,
    limit: 10,
  });

  return searchedBlock ? searchedBlock.lastBlockNumber : '';
};

export const updateLatestBlockNumber = async (blockNumber, fromBlock) => {
  if (fromBlock === '') {
    // new
    await Block.create({
      lastBlockNumber: blockNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    await Block.update(
      {
        lastBlockNumber: blockNumber,
      },
      {
        where: {
          lastBlockNumber: fromBlock,
        },
      }
    );
  }
};
