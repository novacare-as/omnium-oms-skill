# OmniumPurchaseOrderActionExecutionResult

Result from single workflow action

**Fields:**

- `actionStatus`: string, nullable — "Success", "Warning or "Error".
- `errorReason`: string, nullable — Error description
- `translateKey`: string, nullable — Translation key for result description
- `actionType`: string, nullable — Order action type (e.g. "Notification", "CapturePayment", "ReduceInventory", etc)
- `cancelWorkflow`: boolean — Is this step cancelling further workflow execution
- `isInvisible`: boolean — True if workflow step and result should be hidden for end user
