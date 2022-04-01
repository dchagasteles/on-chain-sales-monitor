#!/bin/bash
cd /home/ubuntu/opensea-orders-api
node_modules/.bin/sequelize db:migrate
pm2 restart server