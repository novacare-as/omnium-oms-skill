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
- `lowestGeneralPrice`: number (decimal), nullable — The general price of one unit on the order date: the price the cart would charge a customer club member with no customer or customer group prices, in the order's store. Read-only, and only set when the tenant has the lowest general price turned on.
- `lowestGeneralPriceExclTax`: number (decimal), nullable — The lowest general price of one unit excluding tax.
- `lowestGeneralPriceDate`: string (date-time), nullable — When the lowest general price was looked up.
- `lowestGeneralPriceSource`: string, nullable — Where the lowest general price came from: Current (the product's prices shortly after the sale), History (the product's prices on the order date, looked up later) or PlacedPrice (no general price was found, so the line's own placed price stands in for it).
- `lowestGeneralPriceTotal`: number (decimal), nullable — The lowest general price times the net quantity of the line.
- `lowestGeneralPriceTotalExclTax`: number (decimal), nullable — The lowest general price total excluding tax.
- `extraDiscount`: number (decimal), nullable — The discount the line got below the lowest general price, after line discounts. Negative when the customer paid more than the general price.
- `extraDiscountExclTax`: number (decimal), nullable — The extra discount excluding tax.
