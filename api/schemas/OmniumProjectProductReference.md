# OmniumProjectProductReference

Used for listing products associated to a project

**Fields:**

- `name`: string, nullable — Product name
- `referenceType`: string, nullable — Reference type (available reference types are defined on project type)
- `orderType`: string, nullable — Order type the product is related to
- `skuId`: string, nullable — Product SkuId
- `productId`: string, nullable — Product Id
- `lineItemId`: string, nullable — The line item ID from the originating order or purchase order
- `quantity`: number (decimal) — Number of products
- `deliveredQuantity`: number (decimal) — Number of products delivered
- `canceledQuantity`: number (decimal) — Number of products canceled
- `status`: string, nullable — Product-level status (e.g. Active, Cancelled, Completed)
- `returnReason`: string, nullable — Return reason from the originating return order line
- `returnType`: string, nullable — Return type code from the originating return order line — usable for order-type mapping in downstream systems
- `cancellationCode`: string, nullable — Complaint/cancellation reason code for this product
- `cancellationReason`: string, nullable — Free text complaint/cancellation reason for this product
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties for this product
- `totalRentalDepositAmount`: number (decimal) — Total deposit amount for rental product
- `claimedRentalDepositAmount`: number (decimal) — Amount to claim from the deposit, the amount that will not be refunded when the rental product is returned
- `orderId`: string, nullable — The ID of the order this product is associated
- `purchaseOrderId`: string, nullable — The ID of the purchase order this product is associated
- `rentalProductId`: string, nullable — The specific rental product instance SKU ID
- `rentalFrom`: string (date-time), nullable — Rental period start for this product
- `rentalTo`: string (date-time), nullable — Rental return date for this product
- `dailyRate`: number (decimal) — Daily rental rate
