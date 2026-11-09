# OmniumAnalyticsOrderLineInfo

**Fields:**

- `lineItemId`: string, nullable
- `name`: string, nullable
- `skuId`: string, nullable
- `quantity`: number (decimal)
- `returnQuantity`: number (decimal)
- `discountedPrice`: number (decimal)
- `discountedPriceExclTax`: number (decimal)
- `taxRate`: number (decimal)
- `extendedPrice`: number (decimal)
- `extendedPriceExclTax`: number (decimal)
- `costTotal`: number (decimal)
- `profit`: number (decimal)
- `profitPercent`: number (decimal)
- `deliveredQuantity`: number (decimal)
- `deliveredDate`: string (date-time), nullable
- `canceledQuantity`: number (decimal)
- `canceledDate`: string (date-time), nullable
- `replacedQuantity`: number (decimal), nullable
- `replacedDate`: string (date-time), nullable
- `readyForPickupQuantity`: number (decimal), nullable
- `readyForPickupDate`: string (date-time), nullable
- `replacementType`: string, nullable
- `replacementReason`: string, nullable
- `properties`: List<[`OmniumAnalyticsPropertyItem`](OmniumAnalyticsPropertyItem.md)>, nullable — Properties
