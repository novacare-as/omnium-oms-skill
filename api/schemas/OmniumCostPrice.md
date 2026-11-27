# OmniumCostPrice

Product cost price

**Fields:**

- `cost`: number (decimal), nullable — The cost price, including discount amount. Cost or OriginalCost is required. The other will be calculated based on DiscountAmount.
- `originalCost`: number (decimal), nullable — The original cost price before discount.
- `currencyCode`: string, nullable — Currency code. E.g. USD, EUR, NOK
- `productId`: string, nullable — Calculated: ProductId of product.
- `skuId`: string, nullable — The SkuId the cost price is valid for. If empty, the cost price will be linked to the product, and be valid for all variants.
- `ean`: string, nullable — The ean the cost price is valid for
- `unit`: string, nullable — The unit the cost price is valid for
- `supplier`: string, nullable — The related supplier for the cost price
- `type`: string, nullable — The type of cost price - if you have different types of cost prices
- `marketId`: string, nullable — Market ID the cost price is valid in
- `marketGroupId`: string, nullable — Market group ID the cost price is valid in
- `storeId`: string, nullable — Store ID the cost price is valid in
- `storeGroupId`: string, nullable — Store group ID the cost price is valid in
- `validFrom`: string (date-time), nullable — Cost price available from this date
- `validUntil`: string (date-time), nullable — Cost price available until this date
- `discountAmount`: number (decimal), nullable — Discount amount
- `discountCode`: string, nullable — Name of discount campaign
- `modified`: string (date-time), nullable — When the price was last modified
