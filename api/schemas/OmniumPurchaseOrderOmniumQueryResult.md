# OmniumPurchaseOrderOmniumQueryResult

Generic result from a paginated Query endpoint. Contains plain entity objects.
Works with any entity type: OmniumProduct, OmniumOrder, OmniumCustomer, OmniumCart, etc.
For scroll-capable endpoints, see Omnium.Public.Search.Query.OmniumScrollableQueryResult`1.

**Fields:**

- `totalHits`: integer (int64) — Total number of items matching the query (not just this page)
- `result`: List<[`OmniumPurchaseOrder`](OmniumPurchaseOrder.md)>, nullable — The items in this page/batch
- `facets`: List<[`OmniumFacetViewModel`](OmniumFacetViewModel.md)>, nullable — Facet/aggregation results. Only populated when facets are specified in the request.

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
