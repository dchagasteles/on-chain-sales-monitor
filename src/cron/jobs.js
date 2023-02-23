import cron from 'node-cron';

import { updateSales } from '../engine/sale';
import { removeOldSales } from '../engine/remove';

// fetch sales job (every 1 hour)
export const fetchSalesJob = cron.schedule('0 0 * * * *', async () => {
  await updateSales();
});

// remove old sales (every day)
export const removeOldSalesJob = cron.schedule('0 0 0 * * *', async () => {
  await removeOldSales();
});
