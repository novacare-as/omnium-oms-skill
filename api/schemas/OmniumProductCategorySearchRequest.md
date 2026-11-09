# OmniumProductCategorySearchRequest

Search request object for products

**Fields:**

- `take`: integer (int32) — Number of items pr page
- `page`: integer (int32) — Page to fetch
- `productCategoryId`: string, nullable — Search by category id
- `parentIds`: List<string>, nullable, max length 250 — Filter by parent IDs
- `isMainCategory`: boolean, nullable — Filter by main category flag. True returns only categories marked as main categories, false returns only categories that are not, null (default) applies no filter
- `language`: string, nullable — Language filter (language code)
- `productCategoryIds`: List<string>, nullable, max length 250 — Filter by category IDs
- `ratingType`: string, nullable — Filter by rating
- `searchText`: string, nullable — Free text search
- `facets`: List<[`OmniumFacetViewModel`](OmniumFacetViewModel.md)>, nullable, max length 250 — Filter by facets

**Used directly by endpoints in:**

- [Products | Categories](../endpoints/products/categories.md)
