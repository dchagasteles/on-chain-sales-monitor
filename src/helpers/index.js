import { Nft } from '../models';

export const successResponse = (req, res, data, code = 200) =>
  res.send({
    code,
    data,
    success: true,
  });

export const errorResponse = (
  req,
  res,
  errorMessage = 'Something went wrong',
  code = 500,
  error = {}
) =>
  res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

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
