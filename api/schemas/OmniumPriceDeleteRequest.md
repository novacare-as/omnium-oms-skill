# OmniumPriceDeleteRequest

Request for deleting prices

**Fields:**

- `productId`: string, nullable — ProductId of the product to delete prices for. (If multiple language versions, all versions will be deleted.) Optional: can be omitted when Prices is set and every price carries the SKU in its Code property. Omnium then resolves the product from the SKU, and the SKUs in one request may belong to different products. SKUs that match no product are reported in OmniumPriceDeleteResult.UnresolvedCodes.
- `prices`: List<[`OmniumPrice`](OmniumPrice.md)>, nullable, max length 1000 — Prices to delete. If this is null, all prices for the given productId will be deleted. If empty list, no prices will be deleted.
- `ignoreDates`: boolean — If true, prices for variant will replace existing prices with other dates. If false, only prices with exact same dates will be overridden.
- `ignoreValidUntilDate`: boolean — If true, prices for variant will replace existing prices with other dates for the "ValidUntil" property, but will still need an exact match for the "ValidFrom" property. This will only work if "IgnoreDates" is set to "false".

**Used directly by endpoints in:**

- [Products | Prices](../endpoints/products/prices.md)
