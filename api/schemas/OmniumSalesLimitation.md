# OmniumSalesLimitation

Class for Sales Limitation

**Fields:**

- `marketGroupId`: string, nullable — Market group ID
- `customerId`: string, nullable — Customer ID
- `from`: string (date-time) — Excluded from
- `to`: string (date-time) — Excluded to
- `code`: string, nullable — Could be SKU / Product Id / Product Group ID / Barcode
- `salesLimitationType`: string, nullable — SKU / ProductId / ProductGroupId / Barcode

**Used directly by endpoints in:**

- [Customers | B2B](../endpoints/customers/b2b.md)
