# Required Fields Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/required-fields-validator

> Validates that required fields are populated on the cart.

## Overview

The **Required Fields Validator** ensures that specified fields on the cart are not empty. The fields to validate and an optional order type filter are configured through connector properties. It supports both built-in properties on the order object (e.g., `CustomerReference`) and custom properties.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `RequiredFieldsValidator` |
| **Validation Type** | General |

## Behavior

1.  Reads the list of required fields and optional order type filter from the connector configuration
2.  If an `OrderType` is specified and the cart's order type doesn't match, validation is skipped
3.  For each configured `Field`:
    *   First checks if it matches a built-in property on the `IOrder` interface
    *   If not found as a built-in property, checks custom properties on the cart
    *   If the value is empty or missing, adds a validation error
4.  Returns one error per missing field

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Required field is empty | `RequiredField` + field name | `RequiredFieldMissing` |

## Configuration

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `OrderType` | string | No | When set, only validates carts with this order type |
| `Field` | string | Yes (repeatable) | Name of a field to validate. Add multiple `Field` entries for multiple required fields. |

### Example

The following configuration requires `CustomerReference` to be set on all carts with order type `Online`:

```json
{
  "name": "RequiredFieldsValidator",
  "implementations": ["IValidator"],
  "properties": [
    { "key": "OrderType", "value": "Online" },
    { "key": "Field", "value": "CustomerReference" }
  ],
  "disableStandardErrorPolicy": false
}
```

You can register multiple instances of this validator with different connector IDs to validate different fields for different order types.
