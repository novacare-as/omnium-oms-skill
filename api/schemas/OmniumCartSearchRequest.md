# OmniumCartSearchRequest

Cart search request

**Fields:**

- `storeIds`: List<string>, nullable, max length 1000 — Filter for store IDs
- `customerId`: string, nullable — Filter by customer
- `name`: string, nullable — Filter by cart name (Not to be confused with customer name)
- `customerContact`: string, nullable — Filter by contact person
- `projectId`: string, nullable — Filter by project
- `changedSince`: string (date-time), nullable — Filter by changed date
- `createdFrom`: string (date-time), nullable — Filter by created from date
- `createdTo`: string (date-time), nullable — Filter by created to date
- `salesPersonId`: string, nullable — Filter by sales person ID
- `statuses`: List<string>, nullable, max length 250 — Filter by cart statuses
- `isActiveOnly`: boolean — Get only active carts
- `tags`: List<string>, nullable, max length 250 — Filter by tags
- `excludedTags`: List<string>, nullable, max length 250 — Exclude tags
- `orderTypes`: List<string>, nullable, max length 250 — Order types
- `followUpDateFrom`: string (date-time), nullable — Orders with follow-up from date
- `followUpDateTo`: string (date-time), nullable — Orders with follow-up to date
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List with custom properties to search for
- `marketIds`: List<string>, nullable, max length 1000 — Filter for market IDs
- `sortOrder`: string, nullable — Sort order for the results. Defaults to modified date descending. Possible values: CreatedAscending, CreatedDescending, ModifiedAscending, ModifiedDescending, CustomerNameAscending, CustomerNameDescending StatusAscending, StatusDescending, CartIdAscending, CartIdDescending, StoreAscending, StoreDescending, TotalAscending, TotalDescending and DocumentID. If you do not care about the order you should use DocumentId
- `lineItemSalesOriginId`: string, nullable — Filter to only include carts that have at least one order line with a SalesOriginId matching the given value
- `searchQuery`: string, nullable — Free text search query
- `take`: integer (int32) — Number of items to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])

**Used directly by endpoints in:**

- [Carts | Search](../endpoints/carts/search.md)
