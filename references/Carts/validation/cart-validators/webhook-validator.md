# Webhook Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/webhook-validator

> Calls an external HTTP endpoint to validate and optionally modify the cart during cart validation.

## Overview

The **Webhook Validator** delegates cart validation to an external HTTP endpoint that you host. During cart validation, Omnium sends the cart to your endpoint as a `POST` request. Your endpoint inspects the cart and returns a validation result that can:

*   approve the cart,
*   reject it with one or more validation errors,
*   attach warnings that are shown to the user without blocking the cart, and/or
*   return a modified cart (for example with adjusted line items, prices, or properties) that Omnium applies back to the cart.

This makes it suitable for custom validation rules, external stock or price checks, fraud screening, or any logic that must run against the cart and lives in your own systems.

The Webhook Validator operates on the **cart**. It runs when the cart is validated — for example via the cart `Validate` endpoint and other cart validation flows. It does not run against orders.

## Identifier

| Property | Value |
| --- | --- |
| **Connector name** | `webhookValidator` |
| **Implementation** | `IValidator` |
| **Validation type** | `External` — the type Omnium sets on errors it raises itself when the call fails |

## When the validator runs

Omnium calls your endpoint every time a cart is validated. The main entry points are:

| Trigger | Description |
| --- | --- |
| `POST /api/Cart/{cartId}/Validate` | Explicit validation of a cart |
| Omnium UI | The cart is validated when it is opened and after it is changed |
| In-Store app | Cart operations validate the cart |
| `DELETE /api/Cart/{cartId}/RemoveCouponCode/{couponCode}` | The cart is revalidated after the coupon is removed |
| `POST /api/Returns/CreateReplacementOrder` | The replacement cart is validated before the order is created |
| `POST /api/Cart/{cartId}/Checkout` | Only when the request body's `validators` list names `webhookValidator` |

Checkout without an explicit `validators` list validates the **order** that is built from the cart, not the cart itself, so the Webhook Validator does not run. If your rules must also be enforced at checkout, send `"validators": ["webhookValidator"]` in the checkout request body.

Because the cart is validated on every change in the UI, your endpoint is called frequently. Keep it fast and idempotent — it must be safe to call repeatedly with the same cart.

## Setup

Add a connector named `webhookValidator` to the **Connectors** section in tenant settings. The connector's `host` is the URL Omnium posts the cart to.

```json
{
  "name": "webhookValidator",
  "host": "https://validation.example.com/api/cart-validate",
  "implementations": ["IValidator"],
  "bearerToken": "YOUR_API_KEY",
  "timeOut": "00:00:10",
  "properties": [
    { "key": "IsOnlyLineItemsUpdated", "value": "true" }
  ]
}
```

The `name` must be exactly `webhookValidator` — that is how Omnium locates the connector for this validator.

### Authentication

Omnium sets the `Authorization` header on every request based on the connector configuration. Use one of:

| Field | Header sent |
| --- | --- |
| `bearerToken` | `Authorization: Bearer <token>` |
| `token` | `Authorization: Token <token>` |
| `username` + `password` | `Authorization: Basic <base64>` |

For other schemes, add headers via `customHeaders` instead.

### Properties

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `IsOnlyLineItemsUpdated` | bool | `false` | When `true` and your response returns a cart in `value`, only the line items (`value.orderForm.lineItems`) are applied back to the cart. When `false`, the entire returned cart is applied. |

### Optional connector fields

| Field | Type | Description |
| --- | --- | --- |
| `customHeaders` | array | Extra HTTP headers added to every request |
| `timeOut` | timespan | Request timeout, e.g. `"00:00:10"`. When not set, a default of 100 seconds applies |
| `enabledForMarkets` | string\[\] | Only run for these markets |
| `disabledForMarkets` | string\[\] | Exclude these markets |
| `enabledForMarketGroups` | string\[\] | Only run for these market groups |
| `disabledForMarketGroups` | string\[\] | Exclude these market groups |
| `enabledForOrderTypes` | string\[\] | Only run for these order types |
| `disabledForOrderTypes` | string\[\] | Exclude these order types |

You can add several `webhookValidator` connectors with different market or order type restrictions to route carts to different endpoints. Every connector that matches the cart's market and order type is called.

## Request — what your endpoint receives

Omnium sends a `POST` request to the connector's `host` with the full cart as the JSON body.

```
POST /api/cart-validate HTTP/1.1
Content-Type: application/json; charset=utf-8
Authorization: Bearer YOUR_API_KEY
Accept: application/json
User-Agent: OmniumOms/{version}
```

The body is the full cart — the same model the [Cart API](../../cart-api.md) returns. Property names are camelCase, `null` values are omitted, and default values such as `0` and `false` **are** included, so a real payload is larger than the example below.

### Sample request

```json
{
  "id": "C123456",
  "orderNumber": "C123456",
  "status": "Draft",
  "orderType": "Online",
  "marketId": "NOR",
  "storeId": "7080001234567",
  "billingCurrency": "NOK",
  "salesChannel": "Web",
  "session": "b4f1c0d2-6a55-4f2c-9a7d-7b1d0f3e8a21",
  "created": "2026-09-18T09:12:44Z",
  "modified": "2026-09-18T09:31:02Z",
  "customerId": "10042",
  "customerNumber": "10042",
  "customerName": "Ingrid Solberg",
  "customerEmail": "ingrid.solberg@example.com",
  "customerPhone": "+4790112233",
  "customerType": "Private",
  "customerGroups": ["Member"],
  "isReadOnly": false,
  "isReadOnlyByCustomer": false,
  "isNewCustomer": false,
  "billingAddress": {
    "firstName": "Ingrid",
    "lastName": "Solberg",
    "line1": "Storgata 14",
    "postalCode": "0184",
    "city": "Oslo",
    "countryCode": "NO",
    "email": "ingrid.solberg@example.com",
    "daytimePhoneNumber": "+4790112233"
  },
  "properties": [
    { "key": "GiftWrap", "value": "true", "valueType": "Boolean" }
  ],
  "orderForm": {
    "cartId": "C123456",
    "couponCodes": ["AUTUMN10"],
    "lineItems": [
      {
        "lineItemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "code": "SHOE-BLACK-42",
        "ean": "7038010068744",
        "displayName": "Trail Runner GTX - Black - 42",
        "productId": "SHOE-TRAIL-RUNNER",
        "brand": "Fjellsport",
        "size": "42",
        "color": "Black",
        "quantity": 1,
        "unit": "pcs",
        "placedPrice": 999.00,
        "placedPriceExclTax": 799.20,
        "extendedPrice": 999.00,
        "extendedPriceExclTax": 799.20,
        "lineItemDiscountAmount": 0,
        "taxTotal": 199.80,
        "taxRate": 25,
        "cost": 420.00,
        "costTotal": 420.00,
        "isGift": false,
        "isBackorder": false,
        "imageUrl": "https://cdn.example.com/products/shoe-trail-runner-black.jpg"
      },
      {
        "lineItemId": "f7e6d5c4-b3a2-1098-7654-32100fedcba9",
        "code": "SOCK-WHITE-M",
        "ean": "7038010071232",
        "displayName": "Merino Hiking Sock - White - M",
        "productId": "SOCK-MERINO",
        "brand": "Fjellsport",
        "size": "M",
        "color": "White",
        "quantity": 2,
        "unit": "pcs",
        "placedPrice": 149.00,
        "placedPriceExclTax": 119.20,
        "extendedPrice": 298.00,
        "extendedPriceExclTax": 238.40,
        "lineItemDiscountAmount": 0,
        "taxTotal": 59.60,
        "taxRate": 25,
        "cost": 95.50,
        "costTotal": 191.00,
        "isGift": false,
        "isBackorder": false
      }
    ],
    "shipments": [
      {
        "shipmentId": "1",
        "shippingMethodId": "3f7b1d9e-2c48-4a51-9f0c-8d61a2b3c4d5",
        "shippingMethodName": "Home delivery",
        "warehouseCode": "WH-OSLO",
        "shippingSubTotal": 79.00,
        "shippingSubTotalExclTax": 63.20,
        "shippingTax": 15.80,
        "shipmentTaxRate": 25,
        "expectedDeliveryDate": "2026-09-22T00:00:00Z",
        "address": {
          "firstName": "Ingrid",
          "lastName": "Solberg",
          "line1": "Storgata 14",
          "postalCode": "0184",
          "city": "Oslo",
          "countryCode": "NO",
          "email": "ingrid.solberg@example.com",
          "daytimePhoneNumber": "+4790112233"
        }
      }
    ],
    "payments": [
      {
        "id": "1",
        "paymentId": 1,
        "paymentMethodName": "Klarna",
        "paymentType": "KlarnaCheckout",
        "transactionType": "Authorization",
        "status": "Pending",
        "amount": 1376.00,
        "transactionId": "3d9a51f0-77b2-4f8e-9b1a-2c0d5e6f7a88",
        "created": "2026-09-18T09:30:58Z"
      }
    ],
    "discountAmount": 0,
    "subTotal": 1297.00,
    "subTotalExclTax": 1037.60,
    "shippingSubTotal": 79.00,
    "shippingSubTotalExclTax": 63.20,
    "taxTotal": 275.20,
    "total": 1376.00,
    "totalExclTax": 1100.80
  },
  "subTotal": 1297.00,
  "taxTotal": 275.20,
  "total": 1376.00,
  "totalExclTax": 1100.80,
  "lineItemsCost": 611.00,
  "remainingPayment": 0
}
```

### Request headers

| Header | Value |
| --- | --- |
| `Content-Type` | `application/json; charset=utf-8` |
| `Accept` | `application/json` |
| `User-Agent` | `OmniumOms/{version}` |
| `Authorization` | Based on connector auth config (see [Authentication](webhook-validator.md#authentication)) |

Plus any headers configured via `customHeaders`.

## Response — what your endpoint must return

Return HTTP `200` with a JSON validation result:

| Field | Type | Description |
| --- | --- | --- |
| `isValidatedSuccessful` | bool | `true` if the cart passed. Defaults to `true` if omitted. Forced to `false` whenever `validationErrors` is non-empty. |
| `validationErrors` | array | Validation errors. A non-empty list fails validation. |
| `validationWarnings` | array | Warnings. Shown to the user but do not fail validation. |
| `value` | object | Optional. A modified cart to apply back (see [Modifying the cart](webhook-validator.md#modifying-the-cart)). |

Each entry in `validationErrors` / `validationWarnings`:

| Field | Type | Description |
| --- | --- | --- |
| `message` | string | Human-readable message. Shown in the Omnium UI and returned to the API caller. |
| `errorCode` | string | Optional stable, machine-readable code your integration defines. Returned to the caller unchanged. |
| `translateKey` | string | Optional translation key. When it matches a key Omnium knows, the translated text is shown instead of `message`. |
| `validationType` | string | Category. Use `External` for your own rules. `Customer`, `Payment`, `Shipment` and `Store` also highlight the matching panel in the cart UI. |
| `referenceId` | string | Optional reference, e.g. a SKU or line item ID. |

Field matching on the response is case-insensitive, so `isValidatedSuccessful` and `IsValidatedSuccessful` are both accepted. Unknown fields are ignored. Numbers may be sent as JSON numbers or as numeric strings.

### Approve the cart

Return `200` with `{}` or:

```json
{
  "isValidatedSuccessful": true
}
```

The response body must be valid JSON. An empty body or `204 No Content` cannot be parsed and makes validation fail with an `Internal error` message on the cart.

### Reject the cart

Return one or more `validationErrors`. A non-empty list marks the cart as invalid regardless of `isValidatedSuccessful`.

```json
{
  "isValidatedSuccessful": false,
  "validationErrors": [
    {
      "message": "SHOE-BLACK-42 cannot be delivered to postal code 0184",
      "errorCode": "DeliveryNotAvailable",
      "validationType": "External",
      "referenceId": "SHOE-BLACK-42"
    }
  ]
}
```

### Warn without blocking

Warnings are shown to the user and returned to the API caller, but the cart stays valid.

```json
{
  "isValidatedSuccessful": true,
  "validationWarnings": [
    {
      "message": "SOCK-WHITE-M is expected to ship 3-5 days later than the rest of the order",
      "errorCode": "DelayedShipping",
      "validationType": "External",
      "referenceId": "SOCK-WHITE-M"
    }
  ]
}
```

### Modifying the cart

To change the cart, return the updated cart in `value`. Omnium applies it back to the cart, saves it, and recalculates totals. Omit `value` (or return `null`) to leave the cart untouched.

How much of `value` is applied depends on the `IsOnlyLineItemsUpdated` property.

#### Line items only (recommended)

With `IsOnlyLineItemsUpdated = true`, only `value.orderForm.lineItems` is read; everything else in the returned cart is ignored. This is the safest mode when your rules only adjust lines.

```json
{
  "isValidatedSuccessful": true,
  "value": {
    "orderForm": {
      "lineItems": [
        {
          "lineItemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "code": "SHOE-BLACK-42",
          "quantity": 1,
          "placedPrice": 899.00,
          "extendedPrice": 899.00
        },
        {
          "lineItemId": "f7e6d5c4-b3a2-1098-7654-32100fedcba9",
          "code": "SOCK-WHITE-M",
          "quantity": 2,
          "placedPrice": 149.00,
          "extendedPrice": 298.00
        }
      ]
    }
  }
}
```

The list you return **replaces** the cart's line items. Return every line that should remain in the cart — any line you leave out is removed. Lines are matched on `lineItemId`: when the id matches an existing line, your values are merged into that line and the fields you omit keep their current values. A line with an unknown or missing `lineItemId` is added as a new line.

#### The full cart

With `IsOnlyLineItemsUpdated = false` (the default), the whole returned cart is applied back.

In this mode the returned cart **overwrites** the cart in Omnium field by field. Fields you leave out are cleared, not kept — omitting `orderForm` empties the cart, omitting both `id` and `orderNumber` leaves the cart without an id, and omitting `orderType` resets it to `Online`. Take the cart you received, change only what you need, and return the complete object.

```json
{
  "isValidatedSuccessful": true,
  "value": {
    "id": "C123456",
    "orderNumber": "C123456",
    "status": "Draft",
    "orderType": "Online",
    "marketId": "NOR",
    "billingCurrency": "NOK",
    "customerId": "10042",
    "customerName": "Ingrid Solberg",
    "properties": [
      { "key": "GiftWrap", "value": "true", "valueType": "Boolean" },
      { "key": "CreditCheck", "value": "Approved", "valueType": "String" }
    ],
    "orderForm": {
      "lineItems": [
        {
          "lineItemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "code": "SHOE-BLACK-42",
          "quantity": 1,
          "placedPrice": 899.00,
          "extendedPrice": 899.00
        },
        {
          "lineItemId": "f7e6d5c4-b3a2-1098-7654-32100fedcba9",
          "code": "SOCK-WHITE-M",
          "quantity": 2,
          "placedPrice": 149.00,
          "extendedPrice": 298.00
        }
      ]
    }
  }
}
```

Errors and a modified cart can be combined: return `validationErrors` together with `value` when you both change the cart and want the user to know why.

## Behavior

| Condition | Result |
| --- | --- |
| HTTP 200, `isValidatedSuccessful: true`, no `validationErrors` | Cart passes |
| HTTP 200 with a non-empty `validationErrors` | Cart fails validation; errors are returned to the caller and shown in the UI |
| HTTP 200 with `validationWarnings` only | Cart passes; warnings are returned to the caller and shown in the UI |
| HTTP 200 with `value` | The returned cart (or only its line items) is applied back, and the cart is saved and recalculated |
| HTTP 200 with a `null` body | Treated as "no opinion" — the cart is left unchanged and no errors are added |
| HTTP 200 with an empty or non-JSON body | Validation fails with an `Internal error` message |
| Non-2xx response | Validation fails with an `External` error containing the status code and response body |
| Timeout or connection failure | Validation fails with an `Internal error` message |

The call is made once — there is no retry. An endpoint that is slow or unavailable blocks the cart for as long as it stays down, so set a short `timeOut` on the connector and make sure the endpoint answers quickly.

The cart `Validate` endpoint returns HTTP `422` whenever the result contains errors **or** warnings, with the validation result and the current cart in the response body.

## Getting started

1.  Build an endpoint that accepts `POST` with a JSON cart body and always answers `200` with a JSON object.
2.  Start by returning `{ "isValidatedSuccessful": true }` for every cart, and log the payloads you receive.
3.  Add the `webhookValidator` connector in tenant settings with your `host`, credentials and a short `timeOut`.
4.  Open a cart in the Omnium UI, or call `POST /api/Cart/{cartId}/Validate`, and confirm your endpoint is called.
5.  Add your rules, returning `validationErrors` and `validationWarnings`. Verify the messages appear on the cart.
6.  If you need to change the cart, set `IsOnlyLineItemsUpdated` to `true` and return the line items in `value.orderForm.lineItems`.

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
