import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { Price, Log, Nft } from '../../models';
import { ethers } from 'ethers';

import PairABI from '../../config/abi/SushiswapPair.json';

const provider = new StaticJsonRpcProvider(process.env.ETHEREUM_RPC);
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

export const calcOneNftPrice = async (pair) => {
  let etherAmounts;
  let nftAmounts;

  const PairContract = new ethers.Contract(pair, PairABI, provider);
  const { _reserve0, _reserve1 } = await PairContract.getReserves();

  const token0 = await PairContract.token0();
  if (token0.toLowerCase() === WETH.toLowerCase()) {
    etherAmounts = ethers.utils.formatEther(_reserve0);
    nftAmounts = ethers.utils.formatEther(_reserve1);
  } else {
    etherAmounts = ethers.utils.formatEther(_reserve1);
    nftAmounts = ethers.utils.formatEther(_reserve0);
  }

  let etherPrice = 0;
  if (etherAmounts > 0 && nftAmounts > 0) {
    etherPrice = etherAmounts / nftAmounts;
  }

  return etherPrice;
};

export const calcNftPrice = async (chain = 'ETHEREUM') => {
  const { rows, count } = await Nft.findAndCountAll({
    where: {
      chain,
    },
  });

  if (count == 0) return;

  try {
    for (let i = 0; i < count; i++) {
      const nft = rows[i];

      const etherPrice = await calcOneNftPrice(nft.pair);

      if (etherPrice > 0) {
        await Price.create({
          nftId: nft.id,
          chain: nft.chain,
          etherPrice,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  } catch (error) {
    await Log.create({
      from: 'engine/price/calcNftPrice',
      msg: error.message,
      type: 'error',
    });
  }
};
