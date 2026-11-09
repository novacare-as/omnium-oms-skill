# OmniumReturnRequestModel

Request model for order/order line returns

**Fields:**

- `returns`: List<[`OmniumLineItemReturn`](OmniumLineItemReturn.md)>, nullable, max length 250 — Returned orderlines
- `storeId`: string, nullable — Store id for the return
- `userId`: string, nullable — User handeling the return
- `projectTypeId`: string, nullable — If the return has a connection to a project type
- `comment`: string, nullable — Return comment
- `creditPayment`: boolean — Should payment be credited
- `creditAmount`: number (decimal), nullable — Amount already credited on this return.
- `creditShipment`: boolean — Should shipment be credited
- `creditShipmentAmount`: number (decimal), nullable — Amount to credit for shipment. If not specified, the original order's shipping cost will be used. Use this to credit additional fees like payment fees along with the shipping cost.
- `chargeShipmentCost`: boolean — Should user pay for the shipping return cost
- `chargeShipmentCostAmount`: number (decimal) — Amout for return shipping cost. If ChargeShipmentCost is true and ChargeShipmentCostAmount is 0, the cost will be overriden standard return cost for market.
- `rmaNumber`: string, nullable — Return rma identifier
- `handlingTotal`: number (decimal) — Used if there is handling cost/fee
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Properties
- `status`: string, nullable — Status for the return
- `returnType`: string, nullable — Type of return
- `omniumExchangeOrderOptions`: [`OmniumExchangeOrderOptions`](OmniumExchangeOrderOptions.md)

**Used directly by endpoints in:**

- [Obsolete](../endpoints/obsolete.md)
- [Orders | Returns](../endpoints/orders/returns.md)
