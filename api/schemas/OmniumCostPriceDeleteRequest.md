# OmniumCostPriceDeleteRequest

**Fields:**

- `costPrices`: List<[`OmniumCostPrice`](OmniumCostPrice.md)>, nullable, max length 10000 — Cost prices to delete. If list is null, all cost prices for the product will be deleted. If list is empty, no cost prices will be deleted for the product.
- `productId`: string, nullable — Products ProductId to delete cost prices for
- `ignoreDates`: boolean — Must match the "IgnoreDates" flag used when the cost prices were added. Cost prices added with "IgnoreDates" set to "true" are stored without dates in their identifier, and can only be deleted by setting this to "true" as well.
- `ignoreValidUntilDate`: boolean — Must match the "IgnoreValidUntilDate" flag used when the cost prices were added. Cost prices added with "IgnoreValidUntilDate" set to "true" are stored without a ValidUntil date in their identifier, and can only be deleted by setting this to "true" as well. This will only work if "IgnoreDates" is set to "false".

**Used directly by endpoints in:**

- [Products | Cost Prices](../endpoints/products/cost-prices.md)
