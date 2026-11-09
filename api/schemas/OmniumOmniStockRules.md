# OmniumOmniStockRules

Rules that decide which of a store's products are exposed as OmniStock (stock made available to online channels),
and what the store may be used for when stock is sourced from it.
A product is exposed only when it passes every rule that is set; rules that are null or empty are ignored.

**Fields:**

- `excludedPromotionIds`: List<string>, nullable, max length 250 — Products participating in any of these currently active promotions are not exposed
- `excludedBrands`: List<string>, nullable, max length 250 — Products with any of these brands are not exposed
- `excludedSeasons`: List<string>, nullable, max length 250 — Products with any of these seasons are not exposed
- `includedCategoryIds`: List<string>, nullable, max length 250 — When set, only products in at least one of these categories are exposed. This is the categoryId from OmniumProductCategory.
- `excludedCategoryIds`: List<string>, nullable, max length 250 — Products in any of these categories are not exposed. Takes precedence over IncludedCategoryIds. This is the categoryId from OmniumProductCategory.
- `includedAssortmentCodes`: List<string>, nullable, max length 250 — When set, only products with at least one of these assortment codes are exposed, so a product without assortment codes is not. A variant with assortment codes of its own is judged on those, other variants on the product's codes. Only the codes that are valid now count. This is the assortmentCodeId from OmniumAssortmentCode.
- `excludedAssortmentCodes`: List<string>, nullable, max length 250 — Products with any of these assortment codes, valid now, are not exposed, judged the same way as IncludedAssortmentCodes. Takes precedence over IncludedAssortmentCodes. This is the assortmentCodeId from OmniumAssortmentCode.
- `excludedProductIds`: List<string>, nullable, max length 5000 — Products with any of these product ids are not exposed
- `profitabilityThreshold`: number (decimal), nullable — Minimum margin (unit price minus cost) a product must have to be exposed. Evaluated in CurrencyCode against the store's market with that currency; ignored when null or zero.
- `currencyCode`: string, nullable — Currency ProfitabilityThreshold is expressed in. Required for the threshold to take effect.
- `isCentralWarehouse`: boolean, nullable — Marks the store as a central warehouse for allocation. Falls back to the tenant's central warehouse codes when not set.
- `isExcludedFromAllocation`: boolean, nullable — The allocation engine never sources from this store, whatever it holds in stock.
- `minimumAvailableQuantity`: number (decimal), nullable — The store only becomes an allocation candidate for a line once it holds at least this quantity, so a shelf with a single copy is not treated as a reliable source.
- `capabilities`: List<string>, nullable — What the store can physically handle: for example temperature, adr, crane, bulky. Matched by allocation rules and by shipment options that require a capability.
- `excludedShippingOptions`: List<string>, nullable — Shipping method names this store cannot hand over to a carrier.
- `maxShipmentWeightKg`: number (double), nullable — Heaviest shipment the store can pack.
