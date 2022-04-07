import { Log } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const getLogs = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 100;

    const { rows } = await Log.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });

    return successResponse(req, res, rows);
  } catch (error) {
    return await errorResponse(req, res, 'log/getLogs', error.message);
  }
};

export const clearLogs = async (req, res) => {
  try {
    await Log.destroy({
      where: {},
      truncate: true,
    });

    return successResponse(req, res, {});
  } catch (error) {
    return await errorResponse(req, res, 'log/clearLogs', error.message);
  }
};
