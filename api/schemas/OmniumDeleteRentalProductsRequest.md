# OmniumDeleteRentalProductsRequest

Request for deleting rental products

**Fields:**

- `productIds`: List<string>, required — The rental products to delete
- `reclaimInventory`: boolean — When true, the inventory will be reclaimed to the warehouse set in the `ReclaimToWarehouse` field
- `reclaimToWarehouse`: string, nullable — The Warehouse to reclaim inventory to

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
