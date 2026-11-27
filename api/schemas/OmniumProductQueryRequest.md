# OmniumProductQueryRequest

Request model for the paginated product Query endpoint (POST /api/products/Query).
Inherits all product filter fields from Omnium.Public.Products.Query.OmniumProductQueryRequestBase; adds
pagination controls.

For bulk extraction (full-catalog syncs, exports, reindexing), use
Omnium.Public.Products.Query.OmniumProductScrollQueryRequest with the scroll endpoint instead.

**Fields:**

- `take`: integer (int32), nullable — Number of items per page. Default applied when null: 10. Allowed range: 1–1000.
- `page`: integer (int32), nullable — Page number (1-indexed). Default applied when null: 1. Max offset (Take * Page) is 10,000. For larger datasets — bulk exports, system syncs, reindexing — use the scroll endpoint instead.
- `savedSearchId`: string, nullable, max length 100 — ID of a saved product search (created in the Omnium UI) to run as the base query. The saved search supplies the filters — including UI-only filters that have no counterpart on this model — and every field explicitly set on this request then overrides the saved value for that field (replace semantics: lists and values are replaced, never merged, and an explicitly empty value clears the saved filter). Pagination, sorting (when given) and field selection always come from this request. Price context is never taken from the saved search — pass market/store/customer context explicitly to scope prices. An unknown ID, or the ID of a non-product saved search, is rejected with 400. Mutually exclusive with Omnium.Public.Products.Query.OmniumProductQueryRequestBase.SearchGroupId.
- `searchGroupId`: string, nullable, max length 100 — ID of a search group to AND onto this query as membership. Mutually exclusive with Omnium.Public.Products.Query.OmniumProductQueryRequestBase.SavedSearchId. Extra filters on this request AND with membership; they do not replace member saved-search fields. Unknown id → 400.
- `marketIds`: List<string>, nullable, max length 50 — Filter products by market IDs (product availability). Also the default market for pricing unless overridden by Omnium.Public.Products.Query.OmniumProductQueryRequestBase.PriceContext. The first market is the primary context for price sorting and language resolution.
- `marketGroupIds`: List<string>, nullable, max length 50 — Filter products by market group IDs (product availability); all member markets are included. Also the default market scope for pricing unless overridden by Omnium.Public.Products.Query.OmniumProductQueryRequestBase.PriceContext.
- `isMarketRequired`: boolean, nullable — Controls how products without any market are treated. A product with no markets counts as available in every market, so it matches any market filter by default. - true: the product must carry one of the requested markets — products with no market are excluded. - false: products with no market are returned alongside the market matches. - null (default): the tenant configuration decides. Only applies when Omnium.Public.Products.Query.OmniumProductQueryRequestBase.MarketIds or Omnium.Public.Products.Query.OmniumProductQueryRequestBase.MarketGroupIds is set.
- `storeIds`: List<string>, nullable, max length 250 — Filter products by store IDs (assortment availability). Also the default store scope for pricing unless overridden by Omnium.Public.Products.Query.OmniumProductQueryRequestBase.PriceContext. The first store is the primary context for price sorting and assortment.
- `customerId`: string, nullable — Customer ID for customer assortment filtering (availability) and customer-specific pricing. The price customer can be overridden independently via Omnium.Public.Products.Query.OmniumProductQueryRequestBase.PriceContext.
- `customerGroups`: List<string>, nullable, max length 250 — Customer groups for assortment (availability) and group-specific pricing. The price groups can be overridden independently via Omnium.Public.Products.Query.OmniumProductQueryRequestBase.PriceContext.
- `priceContext`: [`OmniumProductPriceContext`](OmniumProductPriceContext.md)
- `priceValidFrom`: string (date-time), nullable — Only return prices valid from this date
- `priceValidTo`: string (date-time), nullable — Only return prices valid until this date
- `includeAllPrices`: boolean — When true, all prices are returned regardless of price context. Products are still filtered by the top-level availability fields. Use this for data export or price management scenarios. Default: false. Overridable via Omnium.Public.Products.Query.OmniumProductQueryRequestBase.PriceContext.
- `isCustomerClubMember`: boolean, nullable — Controls customer club (member) pricing. Club prices are excluded by default. - true: treated as a club member — club prices are included and the single 'price' field can be a club price (the lowest applicable price wins). - null (default) or false: club prices are excluded and the single 'price' field is the lowest non-club price. Overridable via Omnium.Public.Products.Query.OmniumProductQueryRequestBase.PriceContext. Ignored when Omnium.Public.Products.Query.OmniumProductQueryRequestBase.IncludeAllPrices is true.
- `searchText`: string, nullable, max length 300 — Free text search query. Max 300 characters.
- `productIds`: List<string>, nullable, max length 2000 — Filter by Product.ProductId (your business product ID). Strict match — does not search SKU or other ID fields. Use Omnium.Public.Products.Query.OmniumProductQueryRequestBase.SkuIds for SKU lookups, Omnium.Public.Products.Query.OmniumProductQueryRequestBase.Ids for internal IDs, or Omnium.Public.Products.Query.OmniumProductQueryRequestBase.AnyIds when the ID type is unknown.
- `skuIds`: List<string>, nullable, max length 2000 — Filter by SKU. Matches Product.SkuId OR Variants[].SkuId — a SKU is treated as a single logical concept regardless of whether it lives at the product or variant level.
- `ids`: List<string>, nullable, max length 2000 — Filter by Product.Id (the internal Omnium document identifier). Strict match. Most consumers should use Omnium.Public.Products.Query.OmniumProductQueryRequestBase.ProductIds instead.
- `anyIds`: List<string>, nullable, max length 2000 — Filter by ANY ID type. Matches against Product.ProductId, Product.SkuId, Product.Id, Product.ParentId, or Variants[].SkuId. Use this when you don't know which type of ID you have (e.g. barcode scanning, dirty data imports, customer-provided IDs). Prefer the strict fields (Omnium.Public.Products.Query.OmniumProductQueryRequestBase.ProductIds, Omnium.Public.Products.Query.OmniumProductQueryRequestBase.SkuIds, Omnium.Public.Products.Query.OmniumProductQueryRequestBase.Ids) when the ID type is known — they are more predictable.
- `productParentIds`: List<string>, nullable, max length 2000 — Filter by parent product IDs
- `productCategoryIds`: List<string>, nullable, max length 250 — Filter by product category IDs
- `excludedProductCategoryIds`: List<string>, nullable, max length 250 — Product category IDs to exclude from results
- `excludedProductIds`: List<string>, nullable, max length 2000 — Product IDs to exclude from results
- `gtins`: List<string>, nullable, max length 250 — Filter by GTIN codes (searches EAN, GTINS, and Units.EAN on products and variants)
- `tags`: List<string>, nullable, max length 250 — Filter by product tags
- `excludedTags`: List<string>, nullable, max length 250 — Tags to exclude from results
- `externalIds`: List<string>, nullable, max length 250 — Filter by external IDs
- `supplierIds`: List<string>, nullable, max length 250 — Filter by supplier IDs
- `supplierSkuIds`: List<string>, nullable, max length 250 — Filter by supplier SKU IDs
- `seoUris`: List<string>, nullable, max length 250 — Filter by SEO URIs
- `componentIds`: List<string>, nullable — Filter by component IDs (returns products containing any of the specified component IDs)
- `promotionIds`: List<string>, nullable, max length 250 — Filter by promotion IDs (returns products with active prices matching any of the specified promotion IDs)
- `assortmentCodeIds`: List<string>, nullable, max length 500 — Filter by assortment code IDs
- `ignoreCustomerAssortment`: boolean — If true, the customer's assortment codes from the price context will not be applied as a filter
- `isAssortmentCodesRequired`: boolean, nullable — When true, the product must have a matching assortment code. When null, uses the tenant configuration default.
- `productType`: string, nullable — Filter by product type
- `isActive`: boolean, nullable — True: only active products. False: only inactive products. Null: both.
- `isSku`: boolean, nullable — True: only SKU products (without variants). False: only non-SKU products. Null: both.
- `isBundle`: boolean, nullable — True: only bundle products. False: only non-bundles. Null: both.
- `isPackage`: boolean, nullable — True: only package products. False: only non-packages. Null: both.
- `isDeleted`: boolean, nullable — True: only deleted products. False: only non-deleted products. Null (default): both.
- `isInStock`: boolean, nullable — True: only products in stock. False: only products not in stock. Null: both. Should be combined with InStockWarehouseIds or InStockMarketIds for specific filtering.
- `isOnSale`: boolean, nullable — True: only products on sale. False: only products not on sale. Null: both.
- `isPublished`: boolean, nullable — True: only products published today. Null: no publication filter.
- `isMainProductVariant`: boolean, nullable — True: only main product variants. Null: both.
- `isAvailableOnline`: boolean, nullable — True: only products available online. False: only products not available online. Null: both.
- `isLocalProduct`: boolean, nullable — True: only local products. False: only non-local products. Null: both. Only relevant when IsLocalProductsEnabled is enabled in product settings.
- `modifiedFrom`: string (date-time), nullable — Filter products modified on or after this date
- `modifiedTo`: string (date-time), nullable — Filter products modified on or before this date
- `startPublishFrom`: string (date-time), nullable — Filter products published on or after this date
- `startPublishTo`: string (date-time), nullable — Filter products published on or before this date
- `stopPublishFrom`: string (date-time), nullable — Filter products with publication end date on or after this date
- `stopPublishTo`: string (date-time), nullable — Filter products with publication end date on or before this date
- `priceFrom`: number (decimal), nullable — Filter products with price greater than or equal to this value. Uses the first market from MarketIds for price resolution.
- `priceTo`: number (decimal), nullable — Filter products with price less than or equal to this value. Uses the first market from MarketIds for price resolution.
- `priceActivatedFrom`: string (date-time), nullable — Filter products with prices activated on or after this date
- `priceActivatedTo`: string (date-time), nullable — Filter products with prices activated on or before this date
- `priceDeactivatedFrom`: string (date-time), nullable — Filter products with prices deactivated on or after this date
- `priceDeactivatedTo`: string (date-time), nullable — Filter products with prices deactivated on or before this date
- `isUnionDeltaQuery`: boolean, nullable — When true, uses OR logic for delta queries: returns products modified OR with price changes. When false (default), uses AND logic.
- `productLanguage`: string, nullable — Language code (e.g. "en", "no", "es") for filtering product content
- `ignoreLanguageFilter`: boolean, nullable — When true, ignores language filtering and searches across all languages. When false/null, uses the specified ProductLanguage. If no language is specified and markets are provided, resolves language from the market.
- `inStockWarehouseIds`: List<string>, nullable, max length 500 — Warehouse IDs for the IsInStock filter. If not set, IsInStock matches any warehouse.
- `inStockMarketIds`: List<string>, nullable, max length 250 — Market IDs for the IsInStock filter. If not set, IsInStock matches any market.
- `includeInventoryForSelectedStores`: boolean, nullable — When true, inventory data for selected stores is included in the response
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 20 — Filter products by custom property key/value pairs (AND semantics — products must match ALL listed property pairs to be included). Each entry is a (key, value) pair on the product's Properties collection. Useful for narrowing by attributes like Color, Size, Brand, etc.
- `excludedProperties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 20 — Exclude products matching any of these property key/value pairs. OR semantics — a product matching any one excluded property is removed from the result.
- `propertyListId`: string, nullable — Property list ID controlling which properties are RETURNED in the response (response shaping, not filtering). Uses predefined named property lists from tenant settings — only properties whose keys are in the named list will be present on the returned products.
- `facets`: List<[`OmniumFacetViewModel`](OmniumFacetViewModel.md)>, nullable, max length 250 — Facet definitions to include in the response. When null or empty, no facets are returned.
- `fields`: [`OmniumProductFieldSelection`](OmniumProductFieldSelection.md)
- `completionRate`: [`OmniumCompletionRateFilter`](OmniumCompletionRateFilter.md)
- `sort`: List<[`OmniumSortField`](OmniumSortField.md)>, nullable, max length 10 — Sort fields in priority order. Each entry specifies a field name and direction ("asc" or "desc"). Available field names are entity-specific (e.g. "price", "name", "modified" for products).

**Used directly by endpoints in:**

- [Products | Query](../endpoints/products/query.md)
