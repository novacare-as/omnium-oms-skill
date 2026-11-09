# Orders | Update

Source: https://api.omnium.no/documentation

> Main endpoints for order management.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Orders`

**Add a new order to the OMS.**

Operation ID: `OrdersPost`

Sample request for adding a basic order with one order line, 50% discount, paid with Klarna and delivered by PostNord.

    POST /api/orders
    {
        "id": "EPIC000001",
        "customerId": "4793246662",
        "billingCurrency": "NOK",
        "customerName": "Ola Nordmann",
        "marketId": "epic_market_no",
        "storeId": "epic_webshop_no",
        "customerPhone": "4793246662",
        "customerEmail": "ola.nordmann@omnium.no",
        "status": "New",
        "billingAddress": {
            "daytimePhoneNumber": "4793246662",
            "name": "Ola Nordmann",
            "line1": "Lille Grensen 3",
            "city": "Oslo",
            "countryCode": "NO",
            "countryName": "Norge",
            "postalCode": "1415",
            "email": "ola.nordmann@omnium.no"
        },
        "orderForm": {
            "payments": [
            {
                "amount": 49.5,
                "paymentMethodName": "Klarna",
                "status": "Processed",
                "transactionId": "123456789",
                "transactionType": "Authorization"
            }
            ],
            "shipments": [
            {
                "shipmentId": "1",
                "shippingMethodName": "PostNord",
                "warehouseCode": "epic_company_main_warehouse",
                "lineItems": [
                {
                    "lineItemId": "1",
                    "code": "0123ABC",
                    "placedPrice": 99.0,
                    "quantity": 1.0,
                    "taxRate": 25
                }
                ],
                "address": {
                    "name": "Ola Nordmann",
                    "line1": "Lille Grensen 3",
                    "city": "Oslo",
                    "countryName": "Norge",
                    "countryCode": "NO",
                    "postalCode": "0159",
                    "email": "ola.nordmann@omnium.no"
                }
            }
            ],
            "lineItems": [
            {
                "lineItemId": "1",
                "code": "0123ABC",
                "placedPrice": 99.0,
                "quantity": 1.0,
                "taxRate": 25
            }
            ],
            "discounts": [
            {
                "discountType": "Order",
                "discountName": "Fifty percent discount!",
                "discountValue": 50,
                "rewardType": "Percentage"
            }
            ]
        },
        "orderType": "Online"
    }

**Request body:** [`OmniumOrder`](../../schemas/OmniumOrder.md) — Order object that needs to be added to the OMS

**Responses:**

- 201: Success
- 400: string — Bad Request
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Could not add order. Order with the same order ID has already been added.

---

## `PUT /api/Orders`

**Create a new order in the OMS, with an auto generated order number (orderNumber). If ID is not specified when creating the order, it will be set to the newly generated order number.**

Operation ID: `OrdersCreate`

Sample request:

    PUT /api/orders
    {
        "id": "NotNeededButMayBeSpecified",
        "customerId": "4793246662",
        "billingCurrency": "NOK",
        "customerName": "Ola Nordmann",
        "marketId": "epic_market_no",
        "storeId": "epic_webshop_no",
        "customerPhone": "4793246662",
        "customerEmail": "ola.nordmann@omnium.no",
        "status": "New",
        "billingAddress": {
            "daytimePhoneNumber": "4793246662",
            "name": "Ola Nordmann",
            "line1": "Lille Grensen 3",
            "city": "Oslo",
            "countryCode": "NO",
            "countryName": "Norge",
            "postalCode": "1415",
            "email": "ola.nordmann@omnium.no"
        },
        "orderForm": {
            "payments": [
            {
                "amount": 49.5,
                "paymentMethodName": "Klarna",
                "status": "Processed",
                "transactionId": "123456789",
                "transactionType": "Authorization"
            }
            ],
            "shipments": [
            {
                "shipmentId": "1",
                "shippingMethodName": "PostNord",
                "warehouseCode": "epic_company_main_warehouse",
                "lineItems": [
                {
                    "lineItemId": "1",
                    "code": "0123ABC",
                    "placedPrice": 99.0,
                    "quantity": 1.0,
                    "taxRate": 25
                }
                ],
                "address": {
                    "name": "Ola Nordmann",
                    "line1": "Lille Grensen 3",
                    "city": "Oslo",
                    "countryName": "Norge",
                    "countryCode": "NO",
                    "postalCode": "0159",
                    "email": "ola.nordmann@omnium.no"
                }
            }
            ],
            "lineItems": [
            {
                "lineItemId": "1",
                "code": "0123ABC",
                "placedPrice": 99.0,
                "quantity": 1.0,
                "taxRate": 25
            }
            ],
            "discounts": [
            {
                "discountType": "Order",
                "discountName": "Fifty percent discount!",
                "discountValue": 50,
                "rewardType": "Percentage"
            }
            ]
        },
        "orderType": "Online"
    }

**Request body:** [`OmniumOrder`](../../schemas/OmniumOrder.md)

**Responses:**

- 201: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 400: string — Bad Request
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Could not add order. Order with the same ID has already been added.

---

## `PATCH /api/Orders/{orderId}/PatchOrder`

**Patch Order - update only values in request**

Operation ID: `OrdersPatchOrder`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | ID of existing order. (Required) |

**Request body:** [`OmniumOrderPatch`](../../schemas/OmniumOrderPatch.md) — Order patches. Properties with value will be updated

**Responses:**

- 200: [`OmniumOrderPatchUpdateResult`](../../schemas/OmniumOrderPatchUpdateResult.md) — Order updated successfully
- 400: string — Order patch is invalid
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `DELETE /api/Orders/{orderId}`

**Deletes an order from the OMS. Soft delete is default (order status will be set to "deleted").**

Operation ID: `OrdersDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes |  |
| `deletePermanently` | query | boolean | No | If true, the order will be permanently deleted. No way back! |

**Responses:**

- 200: Success
- 400: string — Bad Request
- 404: string — Order to delete was not found

---

## `GET /api/Orders/GetOrders/ByIds`

**Get multiple orders by IDs**

Operation ID: `OrdersGetOrdersByIds`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `ids` | query | List<string> | No | List of orders IDs which will be used to fetch corresponding orders |

**Responses:**

- 200: [`OmniumGetMultipleResponse`](../../schemas/OmniumGetMultipleResponse.md) — Success
- 400: string — Bad Request
- 404: string — No orders were found
