# OmniumRentalAvailabilityRequest

Request rental availability information on the given rental products

**Fields:**

- `sourceProductSkuId`: string, required — The SKU of the source product of the rental products. Will search all rental products of this product.
- `rentalProductIds`: List<string>, nullable — The IDs of the rental products to fetch availability. Leave blank for all rental products.
- `from`: string (date-time), nullable — From what date/time to fetch availability.
- `to`: string (date-time), nullable — To what date/time to fetch availability.
- `storeId`: string, nullable — The store to search for rental products.

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
