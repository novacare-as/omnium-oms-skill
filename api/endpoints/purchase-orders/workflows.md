# Purchase Orders | Workflows

Source: https://api.omnium.no/documentation

> Purchase order workflows

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/PurchaseOrders/UpdateAndRunWorkflow`

**Update purchase order and run workflow**

Operation ID: `PurchaseOrdersUpdateAndRunWorkflow`

Update purchase order

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `updateAtpValues` | query | boolean | No | If true ATP providers will calculate new ATP values based on the purchase order |

**Request body:** [`OmniumPurchaseOrder`](../../schemas/OmniumPurchaseOrder.md) — Purchase order

**Responses:**

- 200: [`OmniumPurchaseOrderWorkflowExecutionResult`](../../schemas/OmniumPurchaseOrderWorkflowExecutionResult.md) — Success
- 400: string — Bad Request
- 409: Conflict

---

## `POST /api/PurchaseOrders/{purchaseOrderId}/UpdateStatus`

**Update status and run workflow for a purchase order**

Operation ID: `PurchaseOrdersRunWorkflow`

If you need to update status on a purchase order, set the corresponding. The workflow request object allows you to add expected delivery date.

If you do not wish to automatically run the workflow for the purchase order, you can specify this using "skipRunWorkflow:true".

Basic example on how you would update status to "Confirmed" for an existing order:

     POST /api/purchaseOrders/{purchaseOrderId}/UpdateStatus
     {
         "status": "Confirmed",
         "expectedDeliveryDate": 2024-01-01
     }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes | The ID of the purchase order |

**Request body:** [`OmniumPurchaseOrderWorkflowRequest`](../../schemas/OmniumPurchaseOrderWorkflowRequest.md) — Information about the

**Responses:**

- 200: [`OmniumPurchaseOrderWorkflowExecutionResult`](../../schemas/OmniumPurchaseOrderWorkflowExecutionResult.md) — Success
- 400: string — Bad Request
- 404: string — Purchase order to update was not found
- 409: Conflict
