# OmniumGetRentalProductsBySourceRequest

Request for getting rental products from source products

**Fields:**

- `sourceProductSkuIds`: List<string>, nullable — The source products SKU IDs to find rental products from
- `storeId`: string, nullable — When set only retrieves rental products from the given store.
- `storeIds`: List<string>, nullable — When set only retrieves rental products from the given stores. Leave empty to retrieve from all stores.

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
