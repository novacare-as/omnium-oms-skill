# OmniumStoreSearchRequest

Search request object for stores

**Fields:**

- `take`: integer (int32) — Number of items pr page
- `page`: integer (int32) — Page to fetch
- `marketIds`: List<string>, nullable, max length 250 — Search by markets
- `storeIds`: List<string>, nullable, max length 1000 — Search by individual stores
- `storeGroupId`: string, nullable — Search by store group
- `marketGroupId`: string, nullable — Search by market group
- `searchText`: string, nullable — Search text
- `isWarehouse`: boolean, nullable — If true, only warehouses will be returned, if false, only stores not warehouse will be returned. Null returns all stores.
- `includeInactive`: boolean, nullable — If null or false all inactive stores are excluded from search result
- `isInactive`: boolean, nullable — Null returns all stores, true returns only inactive stores, false returns only active stores (isInactive false or null).
- `zipCodeRangeFilter`: integer (int32), nullable — Return only stores with ZipCode Range including the specified ZipCode
- `email`: string, nullable — Search store by email
- `createdFrom`: string (date-time), nullable — Stores created from date (utc)
- `createdTo`: string (date-time), nullable — Stores created before date (utc)
- `modifiedFrom`: string (date-time), nullable — Stores modified from date (utc)
- `modifiedTo`: string (date-time), nullable — Stores modified before date (utc)
- `externalIds`: List<string>, nullable, max length 250 — Search stores with external IDs
- `property`: [`OmniumPropertyItem`](OmniumPropertyItem.md)
- `sortOrder`: string, nullable — Sort order. E.g. ModifiedAscending, ModifiedDescending, CreatedAscending, CreatedDescending, ZipCodeMatchDescending

**Used directly by endpoints in:**

- [Stores](../endpoints/stores.md)
