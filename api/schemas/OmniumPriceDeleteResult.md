# OmniumPriceDeleteResult

Returned (with 200) by a price delete when at least one request was sent without a ProductId, so Omnium resolved
the product from the SKU on each price. A delete where every request carries a ProductId returns 204 No Content.

**Fields:**

- `resolvedCount`: integer (int32) — Number of distinct SKUs (the Code on the price) that were resolved to exactly one product. Of these, the ones listed in NoMatchCodes had no price to delete, so the number of SKUs a price was deleted for is ResolvedCount minus the number of NoMatchCodes.
- `deletedPriceCount`: integer (int32) — Number of prices deleted by the whole request, including items that sent a ProductId (the SKU lists below cover only the items sent without one). A price counts once, however many language versions of the product hold it. With separate prices, prices deleted by exact id (IgnoreDates and IgnoreValidUntilDate off) are removed without a lookup, so this is the number of prices requested: a price that is not stored is counted too, and NoMatchCodes stays empty for those. Set IgnoreDates or IgnoreValidUntilDate to have prices looked up first.
- `unresolvedCodes`: List<string>, nullable — SKUs (the Code on the price) that matched no product in Omnium. Their prices were NOT deleted - the rest of the request was. Null when every SKU was recognised.
- `ambiguousCodes`: List<string>, nullable — SKUs (the Code on the price) that exist under more than one product in Omnium, which makes it impossible to tell which product the price belongs to. Their prices were NOT deleted - the rest of the request was. Send ProductId explicitly for these SKUs. Null when there were none.
- `noMatchCodes`: List<string>, nullable — SKUs (the Code on the price) that belong to a product, but where no stored price matched the price sent, so nothing was deleted for them. Check that the market, currency, store, price list and other fields on the price are the same as on the price you want to delete. Null when there were none.

**Used directly by endpoints in:**

- [Products | Prices](../endpoints/products/prices.md)
