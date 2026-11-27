# OmniumShipmentLineItemsUpdateModel

Shipment line items update model for adding existing line items to a shipment

**Fields:**

- `shipmentId`: string, nullable — Id of shipment to add line items to
- `lineItemIds`: List<string>, nullable, max length 250 — Ids of existing line items to add to shipment

**Used directly by endpoints in:**

- [Orders | Shipments](../endpoints/orders/shipments.md)
