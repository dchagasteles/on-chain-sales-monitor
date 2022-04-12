# DropsOrg NFT Price API

## Project Setup

Once you clone or download project go into you folder

> now cope **.env.local** file to **.env** file

### Install all dependent libraries

```
npm install
```

## API endpoints

### POST /api/orders

```
curl -X POST -H 'Content-Type: application/json' 'https://openseaorders.drops.co/api/v1/orders?api_key=DCl30d9scVa&chainId=1' -d '{
    "event_name": "OrdersMatched",
    "tx_id": "0xTransactionHash",
    "contract_address": "0x7f268357a8c2552623316e2562d90e642bb538e5",
    "args": ["","","","0xDE0B6B3A7640000",""]
}'
```

### GET /api/v1/orders/:txHash

```
curl -X GET -H 'Content-Type: application/json' 'https://openseaorders.drops.co/api/v1/orders/0xTransactionHash?api_key=DCl30d9scVa'
```

### DELETE /api/v1/orders/:txHash

```
curl -X DELETE -H 'Content-Type: application/json' 'https://openseaorders.drops.co/api/v1/orders/0xTransactionHash?api_key=DCl30d9scVa'
```

### GET /api/v1/logs

```
curl -X GET -H 'Content-Type: application/json' 'https://openseaorders.drops.co/api/v1/logs?api_key=DCl30d9scVa'
```

### DELETE /api/v1/logs

```
curl -X DELETE -H 'Content-Type: application/json' 'https://openseaorders.drops.co/api/v1/logs?api_key=DCl30d9scVa'
```

# QuickNode Webhook

- Contract Name:
  WyvernExchangeContract
- Contract Address:
  0x7f268357a8c2552623316e2562d90e642bb538e5
- Event Name:
  OrdersMatched
- ABI URL:
  https://raw.githubusercontent.com/Dropsorg/smart-contracts-abis/master/abis/WyvernExchangeV2.abi
- WebHook URL:
  https://openseaorders.drops.co/api/v1/orders?chainId=1&api_key=DCl30d9scVa
