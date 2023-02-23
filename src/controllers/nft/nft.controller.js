import { Nft, Transfer, Sale, DropsFloorPrice } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const allNfts = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const limit = 100;
    const { rows } = await Nft.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });

    return successResponse(req, res, rows);
  } catch (error) {
    return errorResponse(req, res, 'nft/allNfts', error.message);
  }
};

export const addNft = async (req, res) => {
  try {
    const { name, chain, address } = req.body;

    const nft = await Nft.findOne({
      where: { address, chain },
    });

    if (nft) {
      return errorResponse(
        req,
        res,
        'nft/addNft',
        'NFT already exists with same contract on the same network'
      );
    }

    const payload = {
      name,
      address,
      chain,
      etherPrice: 0,
      usdPrice: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    await Nft.create(payload);

    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, 'nft/addNft', error.message);
  }
};

export const removeNft = async (req, res) => {
  try {
    const { id } = req.params;

    const nft = await Nft.findByPk(id);

    if (nft) {
      await Price.destroy({
        where: {
          nftId: id,
        },
      });

      await nft.destroy();
    }

    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, 'nft/removeNft', error.message);
  }
};

export const updateNft = async (req, res) => {
  try {
    const { id } = req.params;

    let nft = await Nft.findByPk(id);
    if (nft === null) {
      return errorResponse(req, res, 'nft/updateNft', 'Nft not found');
    }

    let name = nft.name;
    if (req.body.name && req.body.name !== '') {
      name = req.body.name;
    }

    let address = nft.address;
    if (req.body.address && req.body.address !== '') {
      address = req.body.address;
    }

    let chain = nft.chain;
    if (req.body.chain && req.body.chain !== '') {
      chain = req.body.chain;
    }

    let etherPrice = nft.etherPrice;
    if (req.body.etherPrice && req.body.etherPrice !== '') {
      etherPrice = parseFloat(req.body.etherPrice);
    }

    let usdPrice = nft.etherPrice;
    if (req.body.usdPrice && req.body.usdPrice !== '') {
      usdPrice = parseFloat(req.body.usdPrice);
    }

    const payload = {
      name,
      address,
      chain,
      usdPrice,
      etherPrice,
      updatedAt: new Date(),
    };

    await nft.update(payload);
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, 'nft/updateNft', error.message);
  }
};

export const getNft = async (req, res) => {
  try {
    const { id } = req.params;

    let nft = await Nft.findByPk(id);

    if (nft) {
      return successResponse(req, res, nft);
    }

    return errorResponse(req, res, 'nft/getNft', 'Not Found');
  } catch (error) {
    return errorResponse(req, res, 'nft/getNft', error.message);
  }
};
