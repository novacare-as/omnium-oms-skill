# OmniumPurchaseOrderOmniumScrollableQueryResult

Result from a scroll-capable Query endpoint. Adds a scroll continuation token
to the standard Omnium.Public.Search.Query.OmniumQueryResult`1.

**Fields:**

- `scrollId`: string, nullable — Scroll continuation token. Pass this to the scroll continuation endpoint to fetch the next batch. Null when there are no more results.
- `totalHits`: integer (int64) — Total number of items matching the query (not just this page)
- `result`: List<[`OmniumPurchaseOrder`](OmniumPurchaseOrder.md)>, nullable — The items in this page/batch
- `facets`: List<[`OmniumFacetViewModel`](OmniumFacetViewModel.md)>, nullable — Facet/aggregation results. Only populated when facets are specified in the request.

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
