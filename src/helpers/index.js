import BigNumber from 'bignumber.js';
import { Nft, Log } from '../models';
import { contractAddresses } from '../config/contractAddresses';

export const successResponse = (req, res, data, code = 200) =>
  res.send({
    code,
    data,
    success: true,
  });

export const errorResponse = async (
  req,
  res,
  from,
  errorMessage = 'Something went wrong',
  code = 500,
  error = {}
) => {
  if (from !== '') {
    await Log.create({
      from: from,
      msg: errorMessage,
      type: 'error',
    });
  }

  return res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });
};

export const checkNFT = async (address, chainId) => {
  let nft = await Nft.findOne({
    where: { address, chainId },
  });
  if (nft === null) {
    nft = await Nft.create({
      name: '',
      chainId,
      address,
      roundId: 1,
      dropsPrice: 0,
      seed: false,
      truncatedMean: 0,
    });
  }
  return nft;
};

export const parseQuickNodeRequest = (req) => {
  let type = 0;
  let error = '';
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
  const chainId = req.query.chainId || '1';

  if (contractAddresses[chainId].wyvernExchangeV2 !== contract_address) {
    return {
      error: 'Not supportive contract_address.',
    };
  }
  if (!args) {
    return {
      error: 'Invalid args',
    };
  }

  const bigPrice = new BigNumber(args[3]);
  const price = bigPrice.div('1000000000000000000').toNumber().toFixed(8);

  return {
    error: '',
    data: {
      transactionHash: tx_id,
      price,
      chainId,
    },
  };
};
