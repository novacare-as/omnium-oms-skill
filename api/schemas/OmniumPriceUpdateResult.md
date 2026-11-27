# OmniumPriceUpdateResult

Result of a price update. Only relevant when prices are sent without a ProductId, since Omnium then has to
resolve the product from the SKU on each price and can report the SKUs it did not recognise.

**Fields:**

- `updatedProductCount`: integer (int32) — Number of products the supplied prices were applied to.
- `unresolvedCodes`: List<string>, nullable — SKUs (the Code on the price) that matched no product in Omnium. Their prices were NOT applied - the rest of the request was. Null when every SKU was recognised.
- `ambiguousCodes`: List<string>, nullable — SKUs (the Code on the price) that exist under more than one product in Omnium, which makes it impossible to tell which product the price belongs to. Their prices were NOT applied - the rest of the request was. Send ProductId explicitly for these SKUs, or resolve the duplicate products. Null when there were none.

**Used directly by endpoints in:**

- [Products | Prices](../endpoints/products/prices.md)
