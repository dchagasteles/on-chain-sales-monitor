/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */

import express from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import cors from 'cors';

import apiRoutes from './src/routes/api';
import errorHandler from './src/middleware/errorHandler';

dotenv.config();
require('./src/config/sequelize');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(bodyParser.json());

function validateAuthorization(req) {
  if (req.query && req.query.api_key) {
    return req.query.api_key === process.env.DROP_API_KEY;
  }
  return false;
}

app.use('/api', (req, res, next) => {
  if (!validateAuthorization(req)) {
    res.send({
      success: false,
      code: 401,
      errorMessage: 'The provided api_key is not valid',
      error: 'Authentication Required',
      data: null,
    });
  } else {
    next();
  }
});

app.use('/api/v1', apiRoutes);
app.use(errorHandler);

module.exports = app;
