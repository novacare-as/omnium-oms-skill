# Orders | Order Lines

Source: https://api.omnium.no/documentation

> Order lines.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PATCH /api/Orders/{orderId}/PatchUpdateOrderLines`

**Patch OrderLines - update only values in request**

Operation ID: `OrdersPatchOrderLine`

Sample request for patching order line with lineItemId "1". Updating color and placedPrice.

    PATCH /api/{orderId}/patchUpdateOrderLines
    {
        [
            {
                "lineItemId": "1",
                "color" : "blue",
                "placedPrice": 100
            }
        ]
    }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | ID of existing order. (Required) |

**Request body:** List<[`OmniumOrderLinePatch`](../../schemas/OmniumOrderLinePatch.md)> — OrderLine patches. OrderLine with value will be updated. LineItemId is required

**Responses:**

- 200: [`OmniumOrderLineUpdateResult`](../../schemas/OmniumOrderLineUpdateResult.md) — OrderLines updated successfully
- 400: string — OrderLines patch are invalid

---

## `POST /api/Orders/{orderId}/OrderLines/{lineItemId}/Cancel`

**Cancel order line**

Operation ID: `OrdersCancelOrderLine`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID (Required) |
| `lineItemId` | path | string | Yes | Order line ID (Required) |
| `sendNotifications` | query | boolean | No | If true, notification about cancellation is sent to customer |

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Order line cancelled successfully
- 400: string — Order line could not be cancelled
- 404: string — Order line was not found

---

## `POST /api/Orders/OrderLines/Cancel`

**Cancel order lines (100 orders limit)**

Operation ID: `OrdersCancelOrderLines`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `sendNotifications` | query | boolean | No | If true, notification about cancellation is sent to customer |

**Request body:** List<[`OmniumOrderLineIdRequest`](../../schemas/OmniumOrderLineIdRequest.md)> — List of orderLineIdRequests with cancellations

**Responses:**

- 200: integer (int32) — Order lines cancelled successfully
- 400: string — Order lines could not be cancelled
- 404: string — Not Found

---

## `POST /api/Orders/{orderId}/OrderLines`

**Add order line**

Operation ID: `OrdersAddOrderLine`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID (Required) |
| `shipmentId` | query | string | No |  |

**Request body:** [`OmniumOrderLine`](../../schemas/OmniumOrderLine.md)

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Order line added successfully
- 400: string — Order line could not be added
- 404: string — Order was not found

---

## `POST /api/Orders/{orderId}/AddManyOrderLines`

**Add many order lines**

Operation ID: `OrdersAddManyOrderLines`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID (Required) |
| `shipmentId` | query | string | No |  |

**Request body:** List<[`OmniumOrderLine`](../../schemas/OmniumOrderLine.md)>

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Order line added successfully
- 400: string — Order line could not be added
- 404: string — Order was not found

---

## `PUT /api/Orders/{orderId}/AddOrderLineProperties`

**Add or update properties on order lines**

Operation ID: `OrdersAddOrderLineProperties`

Sample request:

    PUT /api/orders/EPIC000001/AddOrderLineProperties
    [
        {
            "lineItemId": "1",
            "properties": [
                {
                    "key": "color",
                    "value": "red"
                },
                {
                    "key": "size",
                    "value": "medium"
                }
            ]
        },
        {
            "lineItemId": "2",
            "properties": [
                {
                    "key": "color",
                    "value": "blue"
                },
                {
                    "key": "size",
                    "value": "large"
                }
            ]
        }
    ]

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | ID of existing order. (Required) |

**Request body:** List<[`OmniumLineItemPropertiesPatch`](../../schemas/OmniumLineItemPropertiesPatch.md)> — OrderLineId and List of properties to add or update.

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Order lines updated with properties
- 400: string — Missing order lines or missing patch request
- 404: string — Order does not exist
