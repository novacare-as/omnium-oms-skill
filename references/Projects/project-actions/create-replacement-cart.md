# Create Replacement Cart

Source: https://docs.omnium.no/docs/Projects/project-actions/create-replacement-cart

> Configure the CreateReplacementCart project action to create a replacement cart from a linked return without immediately placing an order.

## Overview

The **Create Replacement Cart** action creates a replacement cart from the return order form linked to the project, but does **not** place the order. An agent can then review and modify the cart before converting it to an order — either manually or via the [Create Replacement Order From Cart](create-replacement-order-from-cart.md) action.

Use this when you want human review before the replacement order is placed.

**Key behaviours:**

*   A cart is created with the return line items and quantities
*   The cart is linked to the original order and the project
*   The order is **not** placed — this must happen separately
*   A log entry is added to the project on success

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReplacementCart` |
| **Group** | Project Actions |

* * *

## Configuration

No properties are required.

```json
{
  "name": "CreateReplacementCart",
  "active": true
}
```

### All Available Options

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| **name** | Yes | string | Must be `CreateReplacementCart` |
| **StopOnError** | No | boolean | Cancel the workflow if the cart creation fails |
| **TranslateKey** | No | string | Translation key shown in the UI action log |

* * *

## Requirements

*   The project must be linked to an order via a claim
*   The return order form must have line items with a return quantity set

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Cart created successfully | Success | Yes |
| No linked order found | Error | Yes |
| Cart validation failed | Error | Yes |
| No returnable line items | No result (silent) | Yes |

* * *

## Typical workflow pattern

1.  Project reaches a step → **CreateReplacementCart** runs → cart is created
2.  Agent reviews and adjusts the cart
3.  Project moves to next step → **CreateReplacementOrderFromCart** runs → order is placed

* * *

## Related

*   [Project Actions overview](../project-actions.md)
*   [Create Replacement Order](create-replacement-order.md) — creates the cart and places the order in one step
*   [Create Replacement Order From Cart](create-replacement-order-from-cart.md) — places an order from an existing replacement cart
