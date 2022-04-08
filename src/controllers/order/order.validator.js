const Joi = require('joi');

export const addOrder = {
  body: {
    event_name: Joi.string().valid('OrdersMatched').required(),
    contract_address: Joi.string().required(),
    tx_id: Joi.string().required(),
  },
};

export const getOrder = {
  params: {
    transactionHash: Joi.string().required(),
  },
};

export const deleteOrder = {
  params: {
    transactionHash: Joi.string().required(),
  },
};
