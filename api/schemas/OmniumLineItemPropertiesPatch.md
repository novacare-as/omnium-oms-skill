# OmniumLineItemPropertiesPatch

Used for patch update properties on a orderline

**Fields:**

- `lineItemId`: string, nullable — id to update
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Properties to update

**Used directly by endpoints in:**

- [Orders | Order Lines](../endpoints/orders/order-lines.md)
