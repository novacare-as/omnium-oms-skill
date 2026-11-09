# OmniumPriceListSearchRequest

Price list search request

**Fields:**

- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take]).
- `take`: integer (int32) — Number of items to take.
- `searchText`: string, nullable — Free text search
- `sortOrder`: string, nullable — Sort order for the results. Defaults to created date descending. Possible values: CreatedAscending, CreatedDescending, ModifiedAscending, ModifiedDescending, NameAscending, NameDescending, MarketAscending, MarketDescending, CurrencyAscending, CurrencyDescending.
- `storeIds`: List<string>, nullable — Store ID filter
- `currencyCodes`: List<string>, nullable — Currency filter
- `marketIds`: List<string>, nullable — Market filter
- `marketGroupIds`: List<string>, nullable — Market group filter
- `includeEmptyMarketId`: boolean — If true, price lists with empty market IDs are returned
- `includeEmptyStoreIds`: boolean — If true, price lists with empty store IDs are returned
- `supplierIds`: List<string>, nullable — Supplier filter
- `isActive`: boolean, nullable — If true, only active price lists are returned.

**Used directly by endpoints in:**

- [Products | Price Lists](../endpoints/products/price-lists.md)
