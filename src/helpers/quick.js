import BigNumber from 'bignumber.js';

import { contractAddresses } from '../config/contractAddresses';

export const parseQuickNodeRequest = (req) => {
  let type = 0;
  let data;

  if (req.body && req.body.tx_id && req.body.tx_id !== '') {
    type = 1;
    data = req.body;
  }

  if (
    req.body &&
    req.body.body &&
    req.body.body.tx_id &&
    req.body.body.tx_id !== ''
  ) {
    type = 2;
    data = req.body.body;
  }

  if (type === 0) {
    return {
      error: 'invliad request body',
    };
  }

  const { contract_address, tx_id, args } = data;
  const chain = req.query.chain || '1';

  if (!contractAddresses[chain].supportedNFTs.includes(contract_address)) {
    return {
      error: 'Not supportive contract_address.',
    };
  }
  if (!args) {
    return {
      error: 'Invalid args',
    };
  }

  return {
    error: '',
    data: {
      contract: contract_address,
      transactionHash: tx_id,
      from: args[0],
      to: args[1],
      tokenId: args[2],
      chain,
    },
  };
};

export const parseQuickNodePunkRequest = (req) => {
  let type = 0;
  let data;

  if (req.body && req.body.tx_id && req.body.tx_id !== '') {
    type = 1;
    data = req.body;
  }

  if (
    req.body &&
    req.body.body &&
    req.body.body.tx_id &&
    req.body.body.tx_id !== ''
  ) {
    type = 2;
    data = req.body.body;
  }

  if (type === 0) {
    return {
      error: 'invliad request body',
    };
  }

  const { contract_address, tx_id, args } = data;
  const chain = req.query.chain || '1';

  if (!contractAddresses[chain].supportedNFTs.includes(contract_address)) {
    return {
      error: 'Not supportive contract_address.',
    };
  }
  if (!args) {
    return {
      error: 'Invalid args',
    };
  }

  let price = new BigNumber(args[3]);
  price = price.div('1000000000000000000').toNumber().toFixed(18);

  return {
    error: '',
    data: {
      contract: contract_address,
      transactionHash: tx_id,

      tokendId: args[0].toString(),
      from: args[1].toString(),
      to: args[2].toString(),

      chain,
      price,
    },
  };
};
