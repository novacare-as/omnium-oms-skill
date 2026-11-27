# Orders | Batch Updates

Source: https://api.omnium.no/documentation

> Endpoints for batch updates for orders.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Orders/Update`

**Update an order.**

Operation ID: `OrdersUpdate`

Sample request:

    POST /api/orders/Update?runWorkflow=true
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

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No | If true, the workflow will be processed. |

**Request body:** [`OmniumOrder`](../../schemas/OmniumOrder.md) — The order to update.

**Responses:**

- 200: [`OmniumOrderWorkflowExecutionResult`](../../schemas/OmniumOrderWorkflowExecutionResult.md) — The order was updated successfully and the workflow was executed.
- 400: string — The request was invalid.
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Orders/Update`

**Put an order. CAUTION: overwriting existing order.**

Operation ID: `OrdersOverwrite`

Sample request:

    PUT /api/orders/Update
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

**Request body:** [`OmniumOrder`](../../schemas/OmniumOrder.md) — The order to update/overwrite.

**Responses:**

- 200: [`OmniumOrderWorkflowExecutionResult`](../../schemas/OmniumOrderWorkflowExecutionResult.md) — The order was updated successfully.
- 400: string — The request was invalid.
- 404: The user has not access to overwrite the order.
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Orders/UpdateMany`

**Update a range of orders. Adds order if order does not already exist.**

Operation ID: `OrdersUpdateMany`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No | If true, workflow will run based on order status. False, will only save updated order |

**Request body:** List<[`OmniumOrder`](../../schemas/OmniumOrder.md)> — A list of orders to update

**Responses:**

- 204: Success
- 400: string — Bad Request

---

## `POST /api/Orders/AddMany`

**Adds a range of new orders to the OMS. Does not overwrite existing orders.**

Operation ID: `OrdersAddMany`

**Request body:** List<[`OmniumOrder`](../../schemas/OmniumOrder.md)> — A list of Order objects that needs to be added to the OMS

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `POST /api/Orders/ImportMany`

**Adds a range of orders to the OMS, without running workflows.**

Operation ID: `OrdersImportMany`

**Request body:** List<[`OmniumOrder`](../../schemas/OmniumOrder.md)> — A list of Order objects that needs to be imported to the OMS

**Responses:**

- 201: Success
- 400: string — Bad Request
