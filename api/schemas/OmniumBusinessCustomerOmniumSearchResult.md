# OmniumBusinessCustomerOmniumSearchResult

Generic class for receiving search results with facets

**Fields:**

- `facets`: List<[`OmniumFacetViewModel`](OmniumFacetViewModel.md)>, nullable, max length 250 — Search result facets
- `totalHits`: integer (int64) — Total number of hits
- `result`: List<[`OmniumBusinessCustomer`](OmniumBusinessCustomer.md)>, nullable — Search results
- `scrollId`: string, nullable — The Scroll ID is used when fetching large amounts of data. Whenever the search results yields a ContinuationToken, the Scroll endpoints should be used to continue fetching documents
- `isValid`: boolean — Deprecated

**Used directly by endpoints in:**

- [Customers | B2B](../endpoints/customers/b2b.md)
