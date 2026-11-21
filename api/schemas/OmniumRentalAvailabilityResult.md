# OmniumRentalAvailabilityResult

Availability information

**Fields:**

- `sourceProductSkuId`: string, nullable — SKU ID of the source product for the rental products
- `rentalProducts`: List<string>, nullable — Total rental products
- `periods`: List<[`OmniumRentalAvailabilityPeriod`](OmniumRentalAvailabilityPeriod.md)>, nullable — The time periods of availability
- `bookings`: List<[`OmniumRentalBooking`](OmniumRentalBooking.md)>, nullable — The individual bookings on rental products
- `returnBufferMinutes`: integer (int32) — How many minutes a rental unit stays reserved after it is returned. A rental must also end this long before the next booking of the unit starts. 0 when the tenant does not reserve units after a return.

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
