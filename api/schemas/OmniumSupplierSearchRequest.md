# OmniumSupplierSearchRequest

Supplier search request

**Fields:**

- `take`: integer (int32) — Number of items to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `createdFrom`: string (date-time), nullable — Project created after date
- `createdTo`: string (date-time), nullable — Project created before date
- `modifiedFrom`: string (date-time), nullable — Project modified after date
- `modifiedTo`: string (date-time), nullable — Project modified before date
- `supplierId`: string, nullable — Supplier ID
- `searchText`: string, nullable — Free text search
- `storeIds`: List<string>, nullable, max length 1000 — Filter by store IDs
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List with custom properties to search for
- `externalIds`: List<string>, nullable, max length 250 — Search by external IDs

**Used directly by endpoints in:**

- [Suppliers](../endpoints/suppliers.md)
