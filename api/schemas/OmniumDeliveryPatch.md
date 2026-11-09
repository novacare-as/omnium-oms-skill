# OmniumDeliveryPatch

**Fields:**

- `id`: string, nullable — ID of the delivery.
- `deliveryTrackingNumber`: string, nullable — Tracking number associated with the delivery.
- `deliveryTrackingLink`: string, nullable — Tracking link associated with the delivery.
- `invoiceNumber`: string, nullable — Invoice number associated with the delivery.
- `estimatedTimeOfDeparture`: string (date-time), nullable — Estimated time of departure for the delivery.
- `estimatedTimeOfArrival`: string (date-time), nullable — Estimated time of arrival for the delivery.
- `invoiceDate`: string (date-time), nullable — Invoice date associated with the delivery.
- `deliveryProvider`: string, nullable — Provider of the delivery.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List of properties associated with the delivery.

**Used directly by endpoints in:**

- [Purchase Orders | Deliveries](../endpoints/purchase-orders/deliveries.md)
