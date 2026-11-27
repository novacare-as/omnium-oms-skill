# OmniumProductSearchRequest

Search request object for products

**Fields:**

- `take`: integer (int32) — Number of items pr page
- `page`: integer (int32) — Page to fetch
- `marketId`: string, nullable — Search by market. Only prices valid for market will be returned
- `marketGroupId`: string, nullable — Search by market group. Only products
- `marketIds`: List<string>, nullable — Search by markets. Only prices valid for the markets will be returned
- `marketGroupIds`: List<string>, nullable — Search by market groups.
- `storeId`: string, nullable — Search by store. Only products available for store, and prices valid for store will be returned
- `storeIds`: List<string>, nullable — Search by stores. Only products available for stores, and prices valid for stores will be returned
- `storeGroupIds`: List<string>, nullable — Search by store groups. Only products available for the stores in the store groups, and prices valid for stores will be returned
- `storeIdPriceFilter`: string, nullable — Only prices valid for store will be returned
- `priceFrom`: number (decimal), nullable — Search for products with price above FromPrice
- `priceTo`: number (decimal), nullable — Search for products with price below ToPrice
- `priceActivatedFrom`: string (date-time), nullable — Search for products with prices that became valid (activated) on or after this date/time
- `priceActivatedTo`: string (date-time), nullable — Search for products with prices that became valid (activated) on or before this date/time
- `priceDeactivatedFrom`: string (date-time), nullable — Search for products with prices that became invalid (deactivated) on or after this date/time
- `priceDeactivatedTo`: string (date-time), nullable — Search for products with prices that became invalid (deactivated) on or before this date/time
- `isUnionDeltaQuery`: boolean, nullable — When true, uses OR logic: returns products that are either modified since ModifiedFrom OR have prices that became active in PriceActivatedFrom/To range OR have prices that became inactive in PriceDeactivatedFrom/To range. When false (default), uses AND logic (current behavior).
- `customerId`: string, nullable — Search by customer ID. Only prices valid for customer will be returned
- `customerGroup`: string, nullable, **deprecated** — Obsolete! Please use CustomerGroups instead. \| Search by customer group. Only prices valid for customer group will be returned
- `customerGroups`: List<string>, nullable, max length 250 — Search by customer groups. Only prices valid for customer group will be returned
- `searchText`: string, nullable, max length 200 — Search text
- `productIds`: List<string>, nullable, max length 2000 — Search by product ids
- `productParentIds`: List<string>, nullable, max length 2000 — Search by product parent ids
- `productCategoryIds`: List<string>, nullable, max length 250 — Search by category ids
- `gtins`: List<string>, nullable, max length 250 — Search by gtins on product. This searches for matches on fields EAN, GTINS and Units.EAN both on product and variants
- `facets`: List<[`OmniumFacetViewModel`](OmniumFacetViewModel.md)>, nullable, max length 250 — Product facets
- `tags`: List<string>, nullable, max length 250 — Product tags
- `excludedTags`: List<string>, nullable, max length 250 — List of excluded tag names
- `productType`: string, nullable — Product type
- `isFacetsDisabled`: boolean, nullable — If set to true, facets (aggregations) will not be created and returned in the search request. Should always be set if you do not need facets as it will both speed up the search request and reduce the response size.
- `sortOrder`: string, nullable — Primary (1st) sort order. List of options can be found in docs: https://docs.omnium.no/docs/Product/product-api#sort-order
- `sortOrder2nd`: string, nullable — Secondary (2nd) sort order - if set, primary sort order (SortOrder) is required
- `sortOrder3rd`: string, nullable — Tertiary (3rd) sort order - if set,  primary (SortOrder) and secondary (SortOrder2nd) sort order is required
- `sortIndexThreshold`: integer (int32), nullable — If set result will not contain products with sort index lower than threshold
- `isActive`: boolean — True will only return active products. False will return both active and inactive products.
- `isInactive`: boolean — True will only return inactive products. Ignored if IsActive == true.
- `isSku`: boolean, nullable — True will only return products that are SKUs (products without variants). False will only return products that are not SKUs.
- `isBundle`: boolean, nullable — True will only return products that are bundles.
- `isPackage`: boolean, nullable — True will only return products that are packages.
- `isDeleted`: boolean — True will only return deleted products (Status == "Deleted"). Value is false by default, only returning products that are not deleted.
- `isInStock`: boolean, nullable — True returns products in stock. False returns products not in stock. Null returns both. Should be combined with InStockMarketIds or InStockWarehouseIds for additional filtering.
- `inStockMarketIds`: List<string>, nullable, max length 250 — Select which market(s) the IsInStock filter should be applied to. If not set, IsInStock will return true if any market has the item in stock.
- `inStockWarehouseIds`: List<string>, nullable, max length 500 — Select which warehouse(s) the IsInStock filter should be applied to. If not set, IsInStock will return true if any warehouse has the item in stock.
- `isMainProductVariant`: boolean, nullable — True returns only main variants.
- `isOnSale`: boolean, nullable — True returns products on sale. False returns products not on sale. Null returns both.
- `isCostOnSale`: boolean, nullable — Only works if separate cost prices are enabled in the configuration. True returns products with cost on sale. False returns products with cost not on sale. Null returns both.
- `promotionIds`: List<string>, nullable, max length 250 — List of promotion IDs. Return only products with active prices with any of the promotion IDs.
- `property`: [`OmniumPropertyItem`](OmniumPropertyItem.md)
- `modifiedFrom`: string (date-time), nullable — Products modified from date
- `modifiedTo`: string (date-time), nullable — Products modified before date
- `isPricesExcluded`: boolean, nullable — If true, prices are searched, parsed and sorted in Omnium, but the price list is not returned
- `excludedFields`: [`OmniumExcludedProductFieldOptions`](OmniumExcludedProductFieldOptions.md)
- `includedFields`: [`OmniumIncludedFieldsOptions`](OmniumIncludedFieldsOptions.md)
- `daysSincePublished`: integer (int32), nullable — Number of days since published. This will replace StartPublishFrom date.
- `startPublishFrom`: string (date-time), nullable — Products published from date
- `startPublishTo`: string (date-time), nullable — Products published to date
- `stopPublishFrom`: string (date-time), nullable — Products stopped published from date
- `stopPublishTo`: string (date-time), nullable — Products stopped published from date
- `isPublished`: boolean, nullable — \| If true - only returns products published today
- `productLanguage`: string, nullable — Language code e.g. en, no, es
- `isProductLanguageFilterIgnored`: boolean, nullable — Ignore product language filter. If "ProductLanguage" is not specified in the request, we use the selected market's productContentLanguage with fallback to default product language. Set this option to true if you wish to search on all languages.
- `excludedProductIds`: List<string>, nullable, max length 2000 — List of specified product Ids to exclude. Typically used if you want to search for sibling products (with a common parent ID) but you'll want to exclude the products you already have.
- `propertyListId`: string, nullable — Property list ID - Predefined property lists in settings for filtering
- `supplierIds`: List<string>, nullable, max length 250 — Search by supplier.
- `supplierSkuIds`: List<string>, nullable, max length 250 — Search by supplier skuIds.
- `assortmentCodeIds`: List<string>, nullable, max length 500 — Search by assortment codes.
- `ignoreCustomerAssortment`: boolean — If set to 'true', the customer in product search context's assortment codes will not be used in the product search.
- `externalIds`: List<string>, nullable, max length 250 — Search products with external IDs
- `isAssortmentCodesRequired`: boolean, nullable — When true, the product must have an assortment that matches one of the provided assortment codes and if the product search request does not include any assortment codes, only products without assortment codes are returned. If null, the system defaults to the 'IsAssortmentStoreIdRequired' configuration setting.
- `assortmentCodeEvaluationDate`: string (date-time), nullable — Explicit override for the date used to evaluate AssortmentCode ValidFrom/ValidTo windows on customer and product assortments. When null the search falls back to Omnium.Public.Products.Search.OmniumProductSearchRequest.RequestedDeliveryDate and then to the current UTC time. Compared at minute granularity.
- `requestedDeliveryDate`: string (date-time), nullable — The requested delivery date for this search context. When set, assortment-code validity is evaluated against this date instead of the current time, so products whose assortment becomes valid only after this date (or expires before it) are filtered accordingly. Overridden by Omnium.Public.Products.Search.OmniumProductSearchRequest.AssortmentCodeEvaluationDate when both are provided. Treated as unset when null.
- `componentIds`: List<string>, nullable — Search for products by component IDs. Returns all products that contain any of the specified IDs in their component-related properties (e.g., skuId, productId).
- `isAvailableOnline`: boolean, nullable — When true, returns only products that are available online (have stock in online-enabled warehouses). When false, returns only products not available online. When null (default), returns both.
- `excludedProductCategoryIds`: List<string>, nullable, max length 250 — Product category IDs to exclude from search results. Products in these categories will not be returned.
- `seoUris`: List<string>, nullable, max length 250 — Search by SEO URI(s)
- `completionRate`: [`OmniumCompletionRateFilter`](OmniumCompletionRateFilter.md)
- `isLocalProduct`: boolean, nullable — Only relevant when IsLocalProductsEnabled is enabled in productSettings. Filter by local product

**Used directly by endpoints in:**

- [Obsolete](../endpoints/obsolete.md)
- [Products | Categories](../endpoints/products/categories.md)
- [Products | Search](../endpoints/products/search.md)
- [Promotions](../endpoints/promotions.md)
