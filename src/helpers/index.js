import { Nft } from '../models';

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
