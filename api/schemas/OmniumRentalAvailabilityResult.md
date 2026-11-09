# OmniumRentalAvailabilityResult

Availability information

**Fields:**

- `sourceProductSkuId`: string, nullable — SKU ID of the source product for the rental products
- `rentalProducts`: List<string>, nullable — Total rental products
- `periods`: List<[`OmniumRentalAvailabilityPeriod`](OmniumRentalAvailabilityPeriod.md)>, nullable — The time periods of availability
- `bookings`: List<[`OmniumRentalBooking`](OmniumRentalBooking.md)>, nullable — The individual bookings on rental products

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
