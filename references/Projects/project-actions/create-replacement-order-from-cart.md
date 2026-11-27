# Create Replacement Order From Cart

Source: https://docs.omnium.no/docs/Projects/project-actions/create-replacement-order-from-cart

> Configure the CreateReplacementOrderFromCart project action to convert an existing replacement cart into an order.

## Overview

The **Create Replacement Order From Cart** action finds the replacement cart linked to the project and converts it into a placed order. This is the second step in a two-step replacement flow where a cart was previously created by the [Create Replacement Cart](create-replacement-cart.md) action.

**Key behaviours:**

*   The action searches for a cart linked to the project by `ProjectId`
*   If a cart is found, it is immediately converted to an order
*   If no cart is found, the action returns an error

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReplacementOrderFromCart` |
| **Group** | Project Actions |

* * *

## Configuration

No properties are required. The action finds the linked cart automatically.

```json
{
  "name": "CreateReplacementOrderFromCart",
  "active": true
}
```

### All Available Options

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| **name** | Yes | string | Must be `CreateReplacementOrderFromCart` |
| **StopOnError** | No | boolean | Cancel the workflow if placing the order fails |
| **TranslateKey** | No | string | Translation key shown in the UI action log |

* * *

## Requirements

*   A replacement cart linked to the project must exist (created by [Create Replacement Cart](create-replacement-cart.md))

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Cart found and order placed | Success | Yes |
| No replacement cart found | Error | Yes |

* * *

## Related

*   [Project Actions overview](../project-actions.md)
*   [Create Replacement Cart](create-replacement-cart.md) — the preceding action that creates the cart
*   [Create Replacement Order](create-replacement-order.md) — creates a cart and places the order in one step
