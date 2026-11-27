# OmniumRentalProductCreateResult

Result of rental product creation

**Fields:**

- `isSuccessful`: boolean — Whether the rental products were successfully created
- `errorMessage`: string, nullable — Possible error message
- `createdProducts`: List<[`OmniumProduct`](OmniumProduct.md)>, nullable — The rental products that were created from the request
- `inventoryReduced`: integer (int32) — The quantity of stock removed from inventory

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
