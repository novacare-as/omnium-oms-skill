# OmniumProductFieldSelection

Product-specific field selection with shorthand flags for common product field exclusions.
Extends the generic OmniumFieldSelection with product-specific convenience flags.

**Fields:**

- `excludeVariants`: boolean, nullable — Exclude all variant data
- `excludeCategories`: boolean, nullable — Exclude all product category data
- `excludePrices`: boolean, nullable — Exclude all price data
- `excludeProperties`: boolean, nullable — Exclude all custom properties
- `excludeAssets`: boolean, nullable — Exclude all assets (except MainImageUrl)
- `excludeInventory`: boolean, nullable — Exclude all inventory data
- `include`: List<string>, nullable, max length 250 — Only return these specific fields. Fields use camelCase with dot notation for nested fields. When set, only these fields (plus Id) are returned.
- `exclude`: List<string>, nullable, max length 250 — Exclude these specific fields. Fields use camelCase with dot notation.
