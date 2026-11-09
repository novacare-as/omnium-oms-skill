# Validation

Source: https://docs.omnium.no/docs/Carts/validation

> How cart validation works in Omnium — ensuring carts are valid before they become orders.

## Introduction

Validation in Omnium ensures that a cart meets all business requirements before it can be converted into an order. When a cart is validated, Omnium runs all configured validators and collects any errors or warnings. If validation fails, the cart cannot proceed to order creation until the issues are resolved.

Validators are executed automatically when:

*   The cart is modified in the Omnium UI
*   The cart is opened in the Omnium UI
*   The cart is modified via the API

Validation can also be triggered manually via the [Cart Validate endpoint](https://api.omnium.no/documentation/index.html#/Carts/CartValidate), and can be configured to only run manually by enabling the `IsCartValidatedManually` setting in [Cart Configuration](cart-config.md).

Each validator returns a `ValidationResult` that can contain:

*   **Validation errors** — block the cart from becoming an order
*   **Validation warnings** — displayed to the user but do not block order creation

Omnium ships with a set of built-in validators covering common scenarios such as inventory checks, payment validation, and product availability. You can also implement custom validators using webhooks. See [Cart Configuration](cart-config.md) for details on how to add and configure validators.

## Validation result

Validating a cart returns a result listing any problems found. When validation fails, the response carries a `422 Unprocessable Entity` status; a clean validation returns `200 OK`. The result has these fields:

| Field | Type | Description |
| --- | --- | --- |
| `isValidatedSuccessful` | bool | `true` when there are no errors. |
| `validationErrors` | array | Issues that block the cart from becoming an order. |
| `validationWarnings` | array | Issues surfaced to the caller that do not block order creation. |

Each entry in `validationErrors` and `validationWarnings` has these fields:

| Field | Type | Description |
| --- | --- | --- |
| `message` | string | Human-readable, localized description. Not stable — do not branch on it. |
| `errorCode` | string | Stable, machine-readable code identifying the error (for example `ProductNotActive`). Use this for programmatic handling. Each validator page lists the codes it can return. |
| `validationType` | string | High-level category, such as `Product`, `Inventory`, `Payment`, `Shipment`, `Price`, `Discount`, `Customer`, or `General`. |
| `referenceId` | string | The affected entity when applicable — typically the SKU or line code (or field name for required-field errors). |
| `translateKey` | string | Localization resource key. Populated only by some validators — prefer `errorCode` for programmatic handling. |

A single response can contain multiple errors from different validators. Validators that flag individual line items (such as inactive products or insufficient stock) return one entry per affected SKU, each with the same `errorCode` and a distinct `referenceId`.

### Example

```json
{
  "isValidatedSuccessful": false,
  "validationErrors": [
    {
      "message": "Inactive product: 73653010001",
      "errorCode": "ProductNotActive",
      "validationType": "Product",
      "referenceId": "73653010001"
    }
  ],
  "validationWarnings": []
}
```

## Running specific validators

By default, every validator configured for the tenant runs together. The [Validate](cart-api.md#validate-cart) and [Checkout](cart-api.md#single-call-checkout) endpoints also accept an optional `validators` array, so you can run only named validators — for example, to re-check inventory without re-running payment validation. Omitting the array (or sending `null`) runs all configured validators on both endpoints. One difference: on **Checkout**, sending an empty array `[]` skips validation entirely, whereas on **Validate** an empty array still runs all validators.

To list the validator names available for the current tenant, call `GET /api/Cart/Validators` and pass any of the returned names in the `validators` array.

Validators can be [restricted to specific order types](validation/cart-validators.md#restricting-a-validator-to-order-types). A validator that is not available for the cart's order type is skipped even when named explicitly in the `validators` array.
