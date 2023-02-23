import { Price, Nft } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const allPrices = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 100;
    const { rows } = await Price.findAndCountAll({
      where: {
        nftId: req.params.id,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, rows);
  } catch (error) {
    return errorResponse(req, res, 'price/Prices', error.message);
  }
};

export const getPrice = async (req, res) => {
  try {
    const { chain, name } = req.query;

    const nft = await Nft.findOne({
      order: [['createdAt', 'DESC']],
      where: { name, chain },
    });

    return successResponse(req, res, {
      etherPrice: nft ? nft.etherPrice : 0,
      usdPrice: nft ? nft.usdPrice : 0,
    });
  } catch (error) {
    return errorResponse(req, res, 'nft/getPrice', error.message);
  }
};
