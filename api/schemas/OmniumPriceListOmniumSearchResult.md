# OmniumPriceListOmniumSearchResult

Generic class for receiving search results with facets

**Fields:**

- `facets`: List<[`OmniumFacetViewModel`](OmniumFacetViewModel.md)>, nullable, max length 250 — Search result facets
- `totalHits`: integer (int64) — Total number of hits
- `result`: List<[`OmniumPriceList`](OmniumPriceList.md)>, nullable — Search results
- `scrollId`: string, nullable — The Scroll ID is used when fetching large amounts of data. Whenever the search results yields a ContinuationToken, the Scroll endpoints should be used to continue fetching documents
- `isValid`: boolean — Deprecated

**Used directly by endpoints in:**

- [Products | Price Lists](../endpoints/products/price-lists.md)
