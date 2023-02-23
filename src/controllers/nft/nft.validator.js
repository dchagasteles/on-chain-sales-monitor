const Joi = require('joi');

export const addNft = {
  body: {
    name: Joi.string().required(),
    address: Joi.string().required(),
    chain: Joi.string().required(),
  },
};

export const removeNft = {
  params: {
    id: Joi.string().required(),
  },
};

export const updateNft = {
  body: {
    name: Joi.string().required(),
    address: Joi.string().required(),
    chain: Joi.string().required(),
  },
  params: {
    id: Joi.string().required(),
  },
};

export const getNft = {
  params: {
    id: Joi.string().required(),
  },
};
