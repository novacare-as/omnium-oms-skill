# OmniumUpdateStatusPatch

Update status patch

**Fields:**

- `status`: string, required — New status to update to
- `userId`: string, nullable — User ID
- `shipmentInfo`: [`OmniumUpdateShipmentInfo`](OmniumUpdateShipmentInfo.md)
- `returnId`: string, nullable — For return order workflows (ReturnOrderForm.Id)
- `skipRunWorkflow`: boolean — If set to true, order will only be saved, and no workflows will run
- `executeWorkFlowAsync`: boolean — When true, the status update and workflow are processed asynchronously via a Service Bus queue. The API returns 202 Accepted immediately without waiting for the workflow to complete. Defaults to false (synchronous processing). Ignored when Omnium.Public.Orders.Models.OmniumUpdateStatusPatch.SkipRunWorkflow is true.

**Used directly by endpoints in:**

- [Orders | Returns](../endpoints/orders/returns.md)
- [Orders | Workflow](../endpoints/orders/workflow.md)
