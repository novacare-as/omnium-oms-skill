# OmniumAnalyticsOrder

**Fields:**

- `orderId`: string, nullable — The unique identifier for the order.
- `orderNumber`: string, nullable — The number associated with the order.
- `orderType`: string, nullable — The type of the order.
- `status`: string, nullable — The current status of the order.
- `salesPersonId`: string, nullable — The ID of the salesperson associated with the order.
- `salesPersonName`: string, nullable — The name of the salesperson associated with the order.
- `created`: string (date-time) — The date the order was created.
- `completed`: string (date-time), nullable — The date the order was completed (if applicable).
- `properties`: List<[`OmniumAnalyticsPropertyItem`](OmniumAnalyticsPropertyItem.md)>, nullable — List of custom properties associated with the order.
