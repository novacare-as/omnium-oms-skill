# OmniumUpdateRentalProductPriceRequest

Request for updating a single price (daily rate or deposit) on a rental product

**Fields:**

- `rentalProductId`: string, required — The SKU ID of the rental product whose price should be updated
- `unitPrice`: number (decimal), required — The new unit price

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
