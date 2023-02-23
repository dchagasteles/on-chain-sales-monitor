const Joi = require('joi');

export const getSales = {
  query: {
    blockNumber: Joi.string().required(),
  },
};

export const deleteSales = {
  //   body: {
  //     blockNumber: Joi.string().required(),
  //   },
};
