# Orders | Returns

Source: https://api.omnium.no/documentation

> Return processing.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Returns/Claims/ClaimTypes`

**Get all available claim project types**

Operation ID: `ReturnsGetClaimTypes`

**Responses:**

- 200: List<[`OmniumProjectType`](../../schemas/OmniumProjectType.md)> — Success
- 404: Not Found

---

## `POST /api/Returns/{orderId}/UpdateStatus`

**Update status on a return**

Operation ID: `ReturnsUpdateStatus`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the order |

**Request body:** [`OmniumUpdateStatusPatch`](../../schemas/OmniumUpdateStatusPatch.md) — The status which will be set on the return. New, InProgress, InTransit, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped

**Responses:**

- 200: [`OmniumOrderWorkflowExecutionResult`](../../schemas/OmniumOrderWorkflowExecutionResult.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `POST /api/Returns/SearchReturnOrders`

**Search returns**

Operation ID: `ReturnsSearchReturnOrders`

**Request body:** [`OmniumReturnOrderSearchRequest`](../../schemas/OmniumReturnOrderSearchRequest.md)

**Responses:**

- 200: [`OmniumReturnOrderViewModelOmniumSearchResult`](../../schemas/OmniumReturnOrderViewModelOmniumSearchResult.md) — Success
- 404: Not Found

---

## `POST /api/Returns/{orderId}/Return`

**Create a return with all or some of the line items, with optional exchange order.**

Operation ID: `ReturnsReturn`

Sample request to create a return for a single order line:

    POST /api/returns/EPIC000001/return
    {
       "returns": [
            {
                "lineItemId": "1",
                "returnQuantity": 1,
                "returnReason": "Too small!",
                "returnType": "ProductWrongSize",
                "isStockUpdated": true
            }
       ],
       "storeId": "epic_webshop_no",
       "userId": "permagne@omnium.no",
       "creditPayment": true,
       "creditShipment": true,
       "chargeShipmentCost": true,
       "chargeShipmentCostAmount": 10,
       "handlingTotal": 5,
       "properties": [
           { "key": "CreateReturnLabel", "value": "true" }
       ]
    }

Example 1: Exchange with same value
Customer returns product A (100 NOK) and gets product B (also 100 NOK). In this case, the return was done in physical store, so we'll also update shippingMethodName to "PickUpInStore" and set the order type for the exchange order to POS

    {
       "returns": [
           {
               "lineItemId": "1",
               "returnQuantity": 1,
               "returnReason": "Too small!",
               "returnType": "ProductWrongSize",
               "isStockUpdated": true
           }
       ],
       "storeId": "epic_webshop_no",
       "userId": "permagne@omnium.no",
       "creditPayment": true,
       "omniumExchangeOrderOptions": {
           "exchangeOrderLines": [
               {
                   "lineItemId": "1",
                   "code": "076331601706",
                   "placedPrice": 100,
                   "quantity": 1
               }
           ],
           "orderType": "POS",
           "shippingMethodName": "PickUpInStore"
       }
    }

Example 2: Exchange with higher value
Customer returns product A (100 NOK) and buys product B (150 NOK)

    {
       "returns": [
           {
               "lineItemId": "1",
               "returnQuantity": 1,
               "returnReason": "Wrong product",
               "returnType": "ProductWrongItem",
               "isStockUpdated": true
           }
       ],
       "storeId": "epic_webshop_no",
       "userId": "permagne@omnium.no",
       "creditPayment": true,
       "omniumExchangeOrderOptions": {
           "exchangeOrderLines": [
               {
                   "lineItemId": "1",
                   "code": "076331601707",
                   "placedPrice": 150,
                   "quantity": 1
               }
           ],
           "additionalPayments": [
               {
                   "amount": 50,
                   "paymentMethodName" : "PaidInStore",
                   "status": "Processed",
                   "transactionId": "be5422f4-25d7-47fc-a664-61590266c7fa",
                   "transactionType": "Sale"
               }
           ]
       }
    }

Example 3: Exchange with lower value
Customer returns product A (100 NOK) and gets product B (90 NOK)

    {
       "returns": [
           {
               "lineItemId": "1",
               "returnQuantity": 1,
               "returnReason": "Preferred another product",
               "returnType": "ChangedMind",
               "isStockUpdated": true
           }
       ],
       "storeId": "epic_webshop_no",
       "userId": "permagne@omnium.no",
       "creditPayment": true,
       "omniumExchangeOrderOptions": {
           "exchangeOrderLines": [
               {
                   "lineItemId": "1",
                   "code": "076331601708",
                   "placedPrice": 90,
                   "quantity": 1
               }
           ]
       }
    }

Example 4: Exchange that must be shipped from the warehouse
Customer returns product A and gets product B which is NOT handed over in store but shipped from the warehouse.
Set "shipmentOrderStatus" to "New" so the exchange order's shipment enters the normal warehouse fulfilment flow
(awaiting inventory → picked → sent). When omitted the shipment inherits the exchange order's "orderStatus"
(so a "New" exchange order gets a "New" shipment); if neither is set it defaults to "Completed" (already fulfilled, e.g. in-store pickup).

    {
       "returns": [
           {
               "lineItemId": "1",
               "returnQuantity": 1,
               "returnReason": "Too small!",
               "returnType": "ProductWrongSize",
               "isStockUpdated": true
           }
       ],
       "storeId": "epic_webshop_no",
       "userId": "permagne@omnium.no",
       "creditPayment": true,
       "omniumExchangeOrderOptions": {
           "exchangeOrderLines": [
               {
                   "lineItemId": "1",
                   "code": "076331601709",
                   "placedPrice": 100,
                   "quantity": 1
               }
           ],
           "shippingMethodName": "Bring",
           "shipmentOrderStatus": "New"
       }
    }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the order |

**Request body:** [`OmniumReturnRequestModel`](../../schemas/OmniumReturnRequestModel.md) — List of items to return. StoreId for return and userId

**Responses:**

- 200: [`OmniumReturnOrderForm`](../../schemas/OmniumReturnOrderForm.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `POST /api/Returns/CreateReplacementOrder`

**Create a replacement order with all or some of the line items.**

Operation ID: `ReturnsCreateReplacementOrder`

Sample request to create a replacement order for a single order line

    POST /api/returns/CreateReplacementOrder
    {
       "orderId": "EPIC000001",
       "orderLineReplacements": [
            {
                "lineItemId": "1",
                "quantity": 1,
                "replacementType": "Damaged",
                "replacementReason": "Replacement for damaged goods"
                "skuId": "product sku if you want to replace current item with another product"
            },
        ],
       "comment": "Replacement for damaged goods",
       "amountToCredit": "399.00",
    }

**Request body:** [`OmniumReplacementRequestModel`](../../schemas/OmniumReplacementRequestModel.md) — Id of order, and order lines to replace.

**Responses:**

- 200: List<[`OmniumReturnOrderForm`](../../schemas/OmniumReturnOrderForm.md)> — Success
- 400: Bad Request
- 404: Not Found

---

## `PATCH /api/Returns/{orderId}/{returnId}`

**Patch Return - update only values in request**

Operation ID: `ReturnsPatchReturn`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | ID of existing order. (Required) |
| `returnId` | path | string | Yes | ID of return. (Required) |

**Request body:** [`OmniumReturnOrderFormPatch`](../../schemas/OmniumReturnOrderFormPatch.md) — Order patches. Properties with value will be updated

**Responses:**

- 200: [`OmniumOrderPatchUpdateResult`](../../schemas/OmniumOrderPatchUpdateResult.md) — Return updated successfully
- 400: string — Return patch is invalid
- 404: string — Order is not found
