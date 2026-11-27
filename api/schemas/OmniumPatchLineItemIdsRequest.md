# OmniumPatchLineItemIdsRequest

Request model for patching line item IDs across order, shipments, and return forms

**Fields:**

- `orderId`: string, nullable — Order ID to patch line item IDs for (Required)
- `lineItemIdMappings`: List<[`LineItemIdMapping`](LineItemIdMapping.md)>, nullable, max length 250 — List of line item ID mappings (old ID to new ID)

**Used directly by endpoints in:**

- [Orders | Others](../endpoints/orders/others.md)
