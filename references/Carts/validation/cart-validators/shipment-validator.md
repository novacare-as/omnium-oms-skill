# Shipment Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/shipment-validator

> Ensures that at least one shipment is selected on the cart.

## Overview

The **Shipment Validator** checks that the cart has at least one shipment configured. Without a shipment, the order cannot be fulfilled, so this validator blocks checkout if no shipment is present.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `shipmentValidator` |
| **Validation Type** | Shipment |

## Behavior

1.  Checks if the cart's order form has any shipments
2.  If no shipments are found, returns a validation error
3.  If at least one shipment exists, validation passes

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| No shipments on cart | `ShipmentNotSelected` | `ShipmentNotSelected` |

## Configuration

No additional properties required.

```json
{
  "name": "shipmentValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
