# OmniumOrderWorkflowExecutionResult

Order workflow execution result

**Fields:**

- `orderActionExecutionResults`: List<[`OmniumOrderActionExecutionResult`](OmniumOrderActionExecutionResult.md)>, nullable, max length 250 — List of action results
- `isAborted`: boolean — True if workflow failed and is aborted
- `order`: [`OmniumOrder`](OmniumOrder.md)

**Used directly by endpoints in:**

- [Orders | Batch Updates](../endpoints/orders/batch-updates.md)
- [Orders | Returns](../endpoints/orders/returns.md)
- [Orders | Workflow](../endpoints/orders/workflow.md)
