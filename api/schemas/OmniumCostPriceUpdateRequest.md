# OmniumCostPriceUpdateRequest

**Fields:**

- `costPrices`: List<[`OmniumCostPrice`](OmniumCostPrice.md)>, nullable — Cost prices to add or update
- `productId`: string, nullable — Products ProductId to update cost prices for
- `ignoreDates`: boolean — If true, prices for variant will replace existing prices with other dates. If false, only prices with exact same dates will be overridden.
- `ignoreValidUntilDate`: boolean — If true, prices for variant will replace existing prices with other dates for the "ValidUntil" property, but will still need an exact match for the "ValidFrom" property. This will only work if "IgnoreDates" is set to "false".

**Used directly by endpoints in:**

- [Products | Cost Prices](../endpoints/products/cost-prices.md)
