# OmniumPurchaseOrder

Purchase orders from suppliers

**Fields:**

- `id`: string, nullable — ID of the purchase order
- `purchaseOrderNumber`: string, nullable — Purchase order number
- `name`: string, nullable — Purchase order name
- `supplierWarehouseCode`: string, nullable — Warehouse code of the supplier. If set, this purchase order is regarded as an internal transfer, and selected supplier warehouse will be reduced in inventory upon creation of delivery.
- `supplierId`: string, nullable — ID of the supplier
- `supplierPhone`: string, nullable — Phone number of the supplier
- `supplierEmail`: string, nullable — Email address of the supplier
- `billingCurrency`: string, nullable — Billing currency for the purchase order
- `supplierName`: string, nullable — Name of the supplier
- `costPriceListId`: string, nullable — Selected cost price list for this purchase order. When set, products added will use prices from this list (with fallback to regular cost prices).
- `costPriceListName`: string, nullable — Display name of the selected cost price list.
- `marketId`: string, nullable — Market ID
- `purchaseOrderForm`: [`OmniumPurchaseOrderForm`](OmniumPurchaseOrderForm.md)
- `purchaseOrderNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — List of purchase order comments
- `publicPurchaseOrderNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — List of public purchase order comments
- `referenceNumber`: string, nullable — Reference number of the purchase order
- `status`: string, nullable — Status of the purchase order
- `subTotal`: number (decimal) — Subtotal of the purchase order
- `subTotalExclTax`: number (decimal) — Subtotal excluding tax of the purchase order
- `taxTotal`: number (decimal) — Tax total of the purchase order
- `total`: number (decimal) — Total amount of the purchase order
- `totalExclTax`: number (decimal) — Total amount excluding tax of the purchase order
- `purchaserId`: string, nullable — ID of the purchaser
- `purchaserName`: string, nullable — Name of the purchaser
- `modified`: string (date-time), nullable — Last modified date and time of the purchase order
- `created`: string (date-time), nullable — Creation date and time of the purchase order
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List of properties associated with the purchase order
- `storeId`: string, nullable — ID of the store
- `requestedDeliveryDate`: string (date-time), nullable — Requested delivery date of the purchase order
- `origin`: string, nullable — Origin of the purchase order
- `versionId`: string, nullable — Version ID of the purchase order
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable, max length 250 — List of errors on the current purchase order.
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external IDs. External IDs are visible in Omnium's UI and useful for display, searching and filtering on IDs originating from other systems. A typical use case could be to add the IDs from ERP/POS/E-COM systems that does not match the purchase order ID in order to simplify integration and traceability
- `isDelivery`: boolean — If true, a delivery is created. All changes on the purchase order is reflected on the delivery.
- `deliveryId`: string, nullable — If set, all the changes to the line items are reflected in this delivery
- `tags`: List<string>, nullable, max length 250 — Purchase order tags (Used by notification filters, and for grouping / filtering purchase orders)
- `projectIds`: List<string>, nullable, max length 250 — List of project IDs linked to this purchase order
- `promotionIds`: List<string>, nullable, max length 250 — List of promotion IDs linked to this purchase order. Ties the order to the campaign work it is bought for, and seeds the promotion filter on the product search.

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
- [Purchase Orders | Workflows](../endpoints/purchase-orders/workflows.md)
