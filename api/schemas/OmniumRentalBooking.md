# OmniumRentalBooking

A booking for a rental product

**Fields:**

- `rentalProductId`: string, nullable — The rental product
- `projectId`: string, nullable — The connected project id
- `projectName`: string, nullable — The connected project name
- `customerName`: string, nullable — Name of the customer the booking is made for
- `rentalFrom`: string (date-time) — Start of booking period
- `rentalTo`: string (date-time) — End of booking period
- `reservedUntil`: string (date-time) — When the rental unit is free again: the registered return (the rental project is completed), or RentalTo until then, plus ReturnBufferMinutes. Equal to RentalTo when the tenant does not reserve units after a return. Use this, not RentalTo, to decide when the unit can be rented again.
