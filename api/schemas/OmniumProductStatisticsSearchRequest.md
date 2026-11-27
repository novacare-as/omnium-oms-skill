# OmniumProductStatisticsSearchRequest

Search request object for products

**Fields:**

- `take`: integer (int32) — Number of items pr page
- `page`: integer (int32) — Page to fetch
- `from`: string (date-time), nullable — Date to search from
- `to`: string (date-time), nullable — Date to search to
- `customerId`: string, nullable — Customer ID
- `searchText`: string, nullable — Search text
- `productIds`: List<string>, nullable, max length 250 — Product facets

**Used directly by endpoints in:**

- [Products](../endpoints/products.md)
