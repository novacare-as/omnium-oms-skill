# Cart Validators

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators

> Reference for all built-in cart validators in Omnium.

## Overview

Omnium provides the following built-in cart validators. Each validator implements the `IValidator<IOrder>` interface and is registered as a connector. To enable a validator, add it to the **Connectors** section in tenant settings with the `IValidator` implementation.

| Validator | Connector ID | Description |
| --- | --- | --- |
| [Active Products](cart-validators/active-products-validator.md) | `activeProductsValidator` | Ensures all products in the cart are active |
| [Credit Limit](cart-validators/credit-limit-validator.md) | `creditLimitValidator` | Validates customer credit availability |
| [Discount](cart-validators/discount-validator.md) | `discountValidator` | Validates discount configuration |
| [Inactive Customer](cart-validators/inactive-customer-validator.md) | `inactiveCustomerValidator` | Blocks checkout for inactive customers |
| [Inventory](cart-validators/inventory-validator.md) | `inventoryValidator` | Validates stock availability across warehouses |
| [Inventory ATP](cart-validators/inventory-atp-validator.md) | `inventoryAtpValidator` | Validates availability using Available-to-Promise data |
| [Null Price](cart-validators/null-price-validator.md) | `nullPriceValidator` | Ensures all line items have a non-zero price |
| [Payments](cart-validators/payments-validator.md) | `paymentsValidator` | Validates that payment amounts match the order total |
| [Pricat ID](cart-validators/pricat-id-validator.md) | `priCatIdValidator` | Validates Pricat IDs on pre-orders |
| [Promotion Coupon](cart-validators/promotion-coupon-validator.md) | `promotionCouponValidator` | Validates and removes invalid coupon codes |
| [Recalculate Cart Prices](cart-validators/recalculate-cart-prices-validator.md) | `recalculateCartPricesValidator` | Recalculates line item prices from current product data |
| [Required Fields](cart-validators/required-fields-validator.md) | `RequiredFieldsValidator` | Ensures required order fields are populated |
| [Sales Limitation](cart-validators/sales-limitation-validator.md) | `salesLimitationValidator` | Enforces product sales restrictions per customer and market |
| [Shipment](cart-validators/shipment-validator.md) | `shipmentValidator` | Ensures at least one shipment is selected |
| [Webhook](cart-validators/webhook-validator.md) | `webhookValidator` | Delegates cart validation to an external HTTP endpoint |

## Connector configuration

To enable a built-in validator, add it to the `connectors` array in tenant settings:

```json
{
  "name": "inventoryValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```

Some validators accept additional configuration via the `properties` array. Refer to each validator's page for details.

### Restricting a validator to order types

A validator can be limited to specific order types with the `enabledForOrderTypes` and `disabledForOrderTypes` arrays on its connector entry. The values are order type names as configured for the tenant (for example `Online`, `Pos`, `B2B`).

```json
{
  "name": "creditLimitValidator",
  "implementations": ["IValidator"],
  "enabledForOrderTypes": ["B2B"],
  "disabledForOrderTypes": ["Pos"]
}
```

*   When both fields are omitted or empty, the validator runs for all order types.
*   `disabledForOrderTypes` skips the validator for the listed order types, and overrides `enabledForOrderTypes`.
*   When `enabledForOrderTypes` is set, the validator runs only for the listed order types. A cart without an order type does not run these validators.
*   Matching is case-insensitive.

The restriction always applies — a validator outside the cart's order type is skipped even when requested by name in the `validators` array on [Validate or Checkout](../validation.md#running-specific-validators).
