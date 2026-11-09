# OmniumPriceListItemSearchRequest

Price list item search request.

**Fields:**

- `priceListId`: string, nullable — Price list ID
- `priceListIds`: List<string>, nullable, max length 1000 — Price list IDs
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take]).
- `take`: integer (int32) — Number of items to take.
- `searchText`: string, nullable — Free text search
- `sortOrder`: string, nullable — Sort order for the results. Defaults to created date descending. Possible values: CreatedAscending,
- `scrollSize`: integer (int32), nullable — Optional: The number of items returned for each scroll request. Default value is 1000. Max is 20000 and minimum is 500.

**Used directly by endpoints in:**

- [Products | Price List Items](../endpoints/products/price-list-items.md)
