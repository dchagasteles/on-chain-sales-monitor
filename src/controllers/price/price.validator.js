const Joi = require('joi');

export const allPrices = {
  params: {
    id: Joi.string().required(),
  },
};

export const getPrice = {
  query: {
    chain: Joi.string().required(),
    name: Joi.string().required(),
  },
};
