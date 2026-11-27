# OmniumLineItemUpdate

Request model for updating line items

**Fields:**

- `lineItemId`: string, nullable — LineItem / Order line ID
- `deliveredQuantity`: number (decimal) — Delivered quantity
- `canceledQuantity`: number (decimal) — Cancelled quantity
- `splitQuantity`: number (decimal) — Used when you only want to split shipment and not deliver
- `readyForPickupQuantity`: number (decimal)
- `reallocateQuantity`: number (decimal) — Reallocate quantity (Will try to reallocate the quantity to other warehouse if possible)
- `cost`: number (decimal), nullable — Cost price
