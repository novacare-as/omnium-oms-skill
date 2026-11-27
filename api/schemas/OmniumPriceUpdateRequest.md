# OmniumPriceUpdateRequest

Price update request

**Fields:**

- `prices`: List<[`OmniumPrice`](OmniumPrice.md)>, nullable — Prices to update
- `productId`: string, nullable — ProductId of the product to update. (If multiple language versions, all versions will be updated.) Optional: can be omitted when every price in the request carries the SKU in its Code property. Omnium then resolves the product from the SKU, and the SKUs in one request may belong to different products. SKUs that match no product are reported in OmniumPriceUpdateResult.UnresolvedCodes.
- `ignoreDates`: boolean — If true, prices for variant will replace existing prices with other dates. If false, only prices with exact same dates will be overridden.
- `ignoreValidUntilDate`: boolean — If true, prices for variant will replace existing prices with other dates for the "ValidUntil" property, but will still need an exact match for the "ValidFrom" property. This will only work if "IgnoreDates" is set to "false".
- `pricesMergeMode`: [`OmniumPatchMergeMode`](OmniumPatchMergeMode.md)

**Used directly by endpoints in:**

- [Products | Prices](../endpoints/products/prices.md)
