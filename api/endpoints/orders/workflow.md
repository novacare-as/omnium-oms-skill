# Orders | Workflow

Source: https://api.omnium.no/documentation

> Order workflow processing.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Orders/{orderId}/UpdateStatus`

**Update status and run workflow for an order or shipment**

Operation ID: `WorkflowUpdateStatus`

If you need to update status on a shipment and not the order, set the corresponding "shipmentId" on the "shipmentInfo" object. The shipmentInfo object also allows you to update shipment information, such as tracking link or shipping method.

If you do not wish to automatically run the workflow for the order or shipment, you can specify this using "skipRunWorkflow:true".

Set "executeWorkFlowAsync:true" to process the status update and workflow asynchronously via a Service Bus queue. The API returns 202 Accepted immediately without waiting for the workflow to complete. Ignored when "skipRunWorkflow:true".

Basic example on how you would update status to "InProgress" for an existing order:

     POST /api/orders/{orderId}/UpdateStatus
     {
         "status": "InProgress"
     }

Example on how you would set status for an existing shipment (with shipmentId "1") to "Completed" and run workflow for the shipment while also updating tracking url:

     POST /api/orders/{orderId}/UpdateStatus
     {
         "status": "Completed",
         "shipmentInfo": {
              "shipmentId": "1",
              "trackingUrl" : "https://omnium.no/not-an-actual-tracking-link"
         }
     }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the order |

**Request body:** [`OmniumUpdateStatusPatch`](../../schemas/OmniumUpdateStatusPatch.md) — The status which will be set on the order. New, InProgress, InTransit, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped

**Responses:**

- 200: [`OmniumOrderWorkflowExecutionResult`](../../schemas/OmniumOrderWorkflowExecutionResult.md) — Success
- 202: Success
- 400: string — Bad Request
- 404: string — Order to update was not found
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Orders/{orderId}/OrderLinesUpdate`

**Create or update shipments and order lines,  and run workflow.**

Operation ID: `WorkflowPartialUpdate`

If no shipmentId is set, the first (and possible only) shipment is used. If a non-existing shipment ID is specific, a new shipment will be created.

If you target an existing shipment, by specifying shipmentId, you could also update shipment tracking link/number and shippingMethodName.
If you create a new partial shipment and do not specify shipping information, shipping information will be copied from the previous existing shipment.

Combination of deliveredQuantity and splitQuantity should not be used. SplitQuantity will then be ignored.

Asynchronous processing (recommended): Set {enqueue: true} to process the update asynchronously via a Service Bus queue.
The API returns {202 Accepted} immediately without waiting for the workflow to complete.
When omitted or set to {false}, the update is processed synchronously and returns {200 OK} with the workflow result.

Example on how you create a partial delivered shipment (with shipmentId "2" - this could be set to any string) containing order lines with lineItemId "4" and "6", to "Completed" and run workflow for the shipment:

     POST /api/orders/1234/OrderLinesUpdate
     {
         "status": "Completed",
         "enqueue": true,
         "lineItemUpdates": [
         {
             "lineItemId": "4",
             "deliveredQuantity": 4
         },
         {
             "lineItemId": "6",
             "deliveredQuantity": 6
         }
         ],
         "shipmentInfo": {
             "shipmentId": "2",
             "shippingMethodName": "Bring"
         }
     }

 Example on how you create a partial shipment without delivered items(using splitQuantity, with shipmentId "2" - this could be set to any string) containing order lines with lineItemId "4" and "6", to "InProgress" and run workflow for the shipment.
 If the new partial shipment should be sent from a different warehouse that original shipment, set shipmentInfo.warehouseCode.
 You can also specify pickup point information if the partial shipment should be delivered to a different pickup point:

     POST /api/orders/1234/OrderLinesUpdate
     {
         "status": "InProgress",
         "enqueue": true,
         "lineItemUpdates": [
         {
             "lineItemId": "4",
             "splitQuantity": 2
         },
         {
             "lineItemId": "6",
             "splitQuantity": 1
         }
         ],
         "shipmentInfo": {
             "shipmentId": "2",
             "shippingMethodName": "Bring",
             "warehouseCode": "warehouse4",
             "servicePointId": "12345",
             "pickUpPointInformation": {
                 "servicePointId": "12345",
                 "name": "Pickup Point Name",
                 "address": {
                     "street": "Main Street 1",
                     "postalCode": "12345",
                     "city": "City Name",
                     "country": "Norway",
                     "countryCode": "NO"
                 }
             }
         }
     }

Example on how you would set status for an existing shipment (with shipmentId "1") to "Completed", while setting delivered quantity and cancelled quantity:

     POST /api/orders/1234/OrderLinesUpdate
     {
         "status": "Completed",
         "enqueue": true,
         "lineItemUpdates": [
         {
             "lineItemId": "4",
             "deliveredQuantity": 4
         },
         {
             "lineItemId": "5",
             "deliveredQuantity": 2,
             "canceledQuantity": 3
         },
         {
             "lineItemId": "6",
             "canceledQuantity": 6
         }
         ],
         "shipmentInfo": {
             "shipmentId": "1"
         }
     }

Example on how you would split a single order line (that has more than 1 quantity), creating a partial delivery (a new shipment) which will be set to "Completed"

     POST /api/orders/1234/OrderLinesUpdate
     {
         "status": "Completed",
         "enqueue": true,
         "lineItemUpdates": [
            {
                "lineItemId": "4",
                "splitQuantity": 1
            }
         ],
         "shipmentInfo": {
             "orderStatus": "Completed",
         }
     }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the order |

**Request body:** [`OmniumUpdateLineItemStatusPatch`](../../schemas/OmniumUpdateLineItemStatusPatch.md) — Line items to update and The status which will be set on the order. New, InProgress, InTransit, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped

**Responses:**

- 200: [`OmniumOrderWorkflowExecutionResult`](../../schemas/OmniumOrderWorkflowExecutionResult.md) — Success
- 202: Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Orders/{cartId}/processCartWorkflowTest/{status}`

**Process cart workflow test (Dry run of workflow, no changes to order or shipment will be made)**

Operation ID: `WorkflowProcessCartWorkflowTest`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes |  |
| `status` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumOrderWorkflowExecutionResult`](../../schemas/OmniumOrderWorkflowExecutionResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/Orders/processExternalCartWorkflowTest/{status}`

**Process cart workflow test from a posted cart or order (Dry run of workflow).**

Operation ID: `WorkflowProcessExternalCartWorkflowTest`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `status` | path | string | Yes |  |

**Request body:** [`OmniumCart`](../../schemas/OmniumCart.md)

**Responses:**

- 200: [`OmniumOrderWorkflowExecutionResult`](../../schemas/OmniumOrderWorkflowExecutionResult.md) — Success
- 400: string — Bad Request
