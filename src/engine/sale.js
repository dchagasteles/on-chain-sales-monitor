import { getSeaportOrders } from './seaport';
import { getNFTTransfers } from './nft';
import { Sale, Log } from '../models';
import { getToBlock, getFromBlock, updateLatestBlockNumber } from './block';

const prepareSales = async (fromBlock, toBlock) => {
  // process orders
  const orderTxs = await getSeaportOrders(fromBlock, toBlock);

  let orders = {};
  let orderHashs = [];
  for (let i = 0; i < orderTxs.length; i++) {
    orderHashs.push(orderTxs[i].transactionHash);
    orders[orderTxs[i].transactionHash] = orderTxs[i];
  }

  // process transfers
  const transferTxs = await getNFTTransfers(fromBlock, toBlock);

  let transfers = {};
  let transferHashs = [];
  for (let i = 0; i < transferTxs.length; i++) {
    transferHashs.push(transferTxs[i].transactionHash);
    transfers[transferTxs[i].transactionHash] = transferTxs[i];
  }

  // get sales
  const saleTxHashs = orderHashs.filter((val) => {
    return transferHashs.indexOf(val) != -1;
  });

  const sales = [];
  for (let i = 0; i < saleTxHashs.length; i++) {
    const txHash = saleTxHashs[i];
    const order = orders[txHash];
    const transfer = transfers[txHash];

    sales.push({
      blockNumber: order.blockNumber,
      transactionHash: txHash,
      etherPrice: order.etherPrice,
      from: transfer.from,
      to: transfer.to,
      tokenId: transfer.tokenId,
    });
  }

  return sales;
};

const storeSales = async (sales) => {
  let salesAdded = 0;
  for (let i = 0; i < sales.length; i++) {
    const count = await Sale.count({
      where: {
        transactionHash: sales[i].transactionHash,
        chainId: '1',
      },
    });

    if (count === 0) {
      await Sale.create({
        chainId: '1',
        createdAt: new Date(),
        blockNumber: sales[i].blockNumber,
        transactionHash: sales[i].transactionHash,
        price: sales[i].etherPrice,
        from: sales[i].from,
        to: sales[i].to,
        tokenId: sales[i].tokenId.toString(),
      });
      salesAdded++;
    }
  }
  return salesAdded;
};

export const updateSales = async () => {
  console.log('=====>updateSales');
  try {
    let addedSales = 0;
    const startTime = new Date();

    const toBlock = await getToBlock();
    if (toBlock === '') return;

    const fromBlock = await getFromBlock();
    if (fromBlock !== '') {
      // get sale transactions
      const sales = await prepareSales(fromBlock, toBlock);

      // store into database
      addedSales = await storeSales(sales);
    }
    await updateLatestBlockNumber(toBlock, fromBlock);

    const processTimeInSeconds =
      (new Date().getTime() - startTime.getTime()) / 1000;

    if (addedSales > 0) {
      await Log.create({
        from: 'engine/sale/updateSales',
        msg: `${addedSales} sales added in ${processTimeInSeconds} seconds from ${fromBlock} ~ ${toBlock}`,
        type: 'Log',
      });
    }
  } catch (error) {
    await Log.create({
      from: 'engine/sale/updateSales',
      msg: error.message,
      type: 'error',
    });
  }
};
