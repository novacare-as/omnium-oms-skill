# OmniumSearchRequest

Generic search request

**Fields:**

- `searchQuery`: string, nullable — Free text search query
- `take`: integer (int32) — Number of items to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])

**Used directly by endpoints in:**

- [Orders | Search](../endpoints/orders/search.md)
