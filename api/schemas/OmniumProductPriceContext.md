# OmniumProductPriceContext

Optional price scope for the product Query endpoints. Controls which prices are returned and how
they are sorted — it never affects which products are returned (use the top-level
{MarketIds}/{StoreIds}/{ProductCategoryIds} etc. for availability).

Every field is optional and overrides the matching top-level field for pricing only; anything
left null falls back to the top-level value. So the common case needs no price context at all —
setting top-level {MarketIds} already scopes both availability and prices to that market.
Reach for this object only when pricing should differ from availability, e.g. "products available in
market A, priced for store group G" or "products in SWE, priced as NOR".

A price is kept when, for every dimension, it either matches the requested value or is
unscoped on that dimension (no store group, no store, …). Dimensions are combined with AND, so you
get market-relevant and store-group-relevant prices, but never a store-group price belonging
to a different market.

**Fields:**

- `marketIds`: List<string>, nullable, max length 50 — Markets to price for. Overrides the top-level {MarketIds} for price selection only (products are still filtered by the top-level markets).
- `marketGroupIds`: List<string>, nullable, max length 50 — Market groups to price for (expanded to their member markets). Overrides the top-level {MarketGroupIds} for price selection only.
- `storeIds`: List<string>, nullable, max length 250 — Stores to price for. Overrides the top-level {StoreIds} for price selection only — use this to get store-specific pricing without restricting which products are returned.
- `storeGroupIds`: List<string>, nullable, max length 50 — Store groups to price for. Store-group prices scoped to any of these groups are returned in addition to non-store-group prices. Has no top-level equivalent — store groups are price-only.
- `customerId`: string, nullable — Customer ID for customer-specific pricing. Overrides the top-level {CustomerId} for price selection only — it does not change customer assortment/availability.
- `customerGroups`: List<string>, nullable, max length 250 — Customer groups for group-specific pricing. Overrides the top-level {CustomerGroups} for price selection only.
- `additionalStoreIds`: List<string>, nullable, max length 250 — Additional store IDs whose prices are appended to the result (after the primary store prices, preserving sort order). Has no top-level equivalent.
- `isCustomerClubMember`: boolean, nullable — Controls customer club (member) pricing. Overrides the top-level {IsCustomerClubMember}. - true: club prices are included and the single 'price' field can be a club price. - false: club prices are excluded. - null (default): falls back to the top-level value.
- `includeAllPrices`: boolean, nullable — When true, all prices are returned regardless of context (products are still filtered by the top-level availability fields). Overrides the top-level {IncludeAllPrices}.
