# OmniumRentalAvailabilityPeriod

A time period specifying which products are available for rental

**Fields:**

- `from`: string (date-time) — The start of the period
- `to`: string (date-time), nullable — The end of the period
- `products`: List<string>, nullable — The products that are available for rental during this period. As in the products that are not booked.
