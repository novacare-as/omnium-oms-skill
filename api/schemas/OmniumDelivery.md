# OmniumDelivery

Delivery model for purchase orders

**Fields:**

- `id`: string, nullable — ID of the delivery.
- `modified`: string (date-time), nullable — Date and time when the delivery was last modified.
- `created`: string (date-time), nullable — Date and time when the delivery was created.
- `isCounted`: boolean — Indicates whether the delivery quantity has been verified before goods reception.
- `deliveryTrackingNumber`: string, nullable — Tracking number associated with the delivery.
- `deliveryTrackingLink`: string, nullable — Tracking link associated with the delivery.
- `warehouseCode`: string, nullable — Code of the receiving warehouse associated with the delivery.
- `supplierWarehouseCode`: string, nullable — Code of the supplier warehouse associated with the delivery (Internal transfers).
- `deliveryProvider`: string, nullable — Provider of the delivery.
- `invoiceNumber`: string, nullable — Invoice number associated with the delivery.
- `estimatedTimeOfDeparture`: string (date-time), nullable — Estimated time of departure for the delivery.
- `estimatedTimeOfArrival`: string (date-time), nullable — Estimated time of arrival for the delivery.
- `invoiceDate`: string (date-time), nullable — Invoice date associated with the delivery.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List of properties associated with the delivery.
- `deliveryNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — List of internal comments
- `publicDeliveryNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — List of public comments
- `suppliers`: List<string>, nullable, max length 250 — List of suppliers
- `supplierIds`: List<string>, nullable, max length 250 — List of supplier Ids
- `deliveryStatus`: string, nullable — Status of the delivery.
- `isAutoDeliveryStatusDisabled`: boolean — Disables automatic calculation of DeliveryStatus, allowing it to be set manually
- `orderType`: string, nullable — Purchase order type (InternalTransfer or PurchaseOrder)
- `tags`: List<string>, nullable, max length 250 — Delivery tags (Used for grouping / filtering deliveries)

**Used directly by endpoints in:**

- [Purchase Orders | Deliveries](../endpoints/purchase-orders/deliveries.md)
