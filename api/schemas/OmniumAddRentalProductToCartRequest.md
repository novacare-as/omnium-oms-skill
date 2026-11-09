# OmniumAddRentalProductToCartRequest

Request for adding a rental product as a line item to a cart

**Fields:**

- `cartId`: string, required — Id of the cart to add the rental product to
- `rentalProductSkuId`: string, required — The SKU ID of the rental product you wish to add to the cart
- `rentalFrom`: string (date-time), required — The date and time the rental period begins
- `rentalTo`: string (date-time), required — The date and time the rental period ends
- `addDeposit`: boolean — Whether to add the deposit as a line item to the cart, default is true

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
