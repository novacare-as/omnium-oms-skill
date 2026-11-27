# OmniumUpdateLineItemStatusPatch

Update line item

**Fields:**

- `status`: string, nullable — New status to update to
- `lineItemUpdates`: List<[`OmniumLineItemUpdate`](OmniumLineItemUpdate.md)>, required, max length 250 — Line items to update
- `userId`: string, nullable — User ID
- `shipmentInfo`: [`OmniumUpdateShipmentInfo`](OmniumUpdateShipmentInfo.md)
- `isShippingCostKeptForExistingShipment`: boolean — Is shipping cost kept for existing shipment. If true, shipping cost will not be transferred to the new partial shipment. If false, shipping cost will be transferred if new shipment is completed and existing shipment is not completed
- `enqueue`: boolean, nullable — When true, the update is processed asynchronously via a Service Bus queue and the API returns 202 Accepted immediately. Defaults to false (synchronous processing), but is the recommended way of using this endpoint.

**Used directly by endpoints in:**

- [Orders | Workflow](../endpoints/orders/workflow.md)
