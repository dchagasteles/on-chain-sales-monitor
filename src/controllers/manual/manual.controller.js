import { successResponse, errorResponse } from '../../helpers';
import { removeOldSales } from '../../engine/remove';
import { updateSales } from '../../engine/sale';

export const doManual = async (req, res) => {
  try {
    const { type } = req.body;

    if (type === 'updateSales') {
      await updateSales();
    }

    if (type === 'removeOldSales') {
      await removeOldSales();
    }

    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, 'manual/doManual', error.message);
  }
};
