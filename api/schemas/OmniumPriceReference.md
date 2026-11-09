# OmniumPriceReference

**Fields:**

- `currencyCode`: string, nullable
- `marketId`: string, nullable
- `unit`: string, nullable — The unit the price is given in. A product sold in several units (piece, pack, pallet) has one lowest price per unit. Null for a price that names no unit.
- `date`: string (date-time)
- `promotionId`: string, nullable
- `priceListId`: string, nullable
- `promotionName`: string, nullable
- `unitPrice`: number (decimal)
- `isCurrentPrice`: boolean, nullable
