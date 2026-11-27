# OmniumPurchaseOrderWorkflowExecutionResult

Purchase order workflow execution result

**Fields:**

- `purchaseOrderActionExecutionResults`: List<[`OmniumPurchaseOrderActionExecutionResult`](OmniumPurchaseOrderActionExecutionResult.md)>, nullable, max length 250 — List of action results
- `isAborted`: boolean — True if workflow failed and is aborted
- `purchaseOrder`: [`OmniumPurchaseOrder`](OmniumPurchaseOrder.md)

**Used directly by endpoints in:**

- [Purchase Orders | Workflows](../endpoints/purchase-orders/workflows.md)
