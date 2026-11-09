# OmniumRentalProductCreateRequest

Request for creation of rental products from existing product

**Fields:**

- `sourceProductId`: string, required — Product to use for new rental products
- `storeId`: string, required — A store for which the rental product will be associated
- `count`: integer (int32), required — How many rental products to create
- `warehouseCode`: string, nullable — If set, will reduce stock of the source product from this warehouse
- `prices`: List<[`OmniumPrice`](OmniumPrice.md)>, nullable — The prices set on the rental product, can also include deposit prices

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
