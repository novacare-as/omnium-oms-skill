# OmniumOrderOmniumResult

Generic query result

**Fields:**

- `totalHits`: integer (int64) — Total number of hits
- `result`: List<[`OmniumOrder`](OmniumOrder.md)>, nullable — Search results
- `scrollId`: string, nullable — The Scroll ID is used when fetching large amounts of data. Whenever the search results yields a ContinuationToken, the Scroll endpoints should be used to continue fetching documents
- `isValid`: boolean — Deprecated

**Used directly by endpoints in:**

- [Orders | Search](../endpoints/orders/search.md)
