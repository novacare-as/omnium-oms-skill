# Create Replacement Order

Source: https://docs.omnium.no/docs/Projects/project-actions/create-replacement-order

> Configure the CreateReplacementOrder project action to automatically create a replacement order from a linked return.

## Overview

The **Create Replacement Order** action creates a new replacement order directly from the return order form linked to the project. It determines which line items to replace, creates a cart, validates it, and immediately converts it to an order.

Use this when you want the replacement order placed automatically as part of a project workflow step, without requiring the agent to manually create it.

**Key behaviours:**

*   Line items and quantities are derived from the return order form — no manual selection required
*   The replacement order is linked back to the original order via `ReplacementOrderIds`
*   The project ID is attached to both the replacement order and the original order
*   A log entry is added to the project on success

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReplacementOrder` |
| **Group** | Project Actions |

* * *

## Configuration

No properties are required. The action resolves the linked order and return form automatically.

```json
{
  "name": "CreateReplacementOrder",
  "active": true
}
```

### All Available Options

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| **name** | Yes | string | Must be `CreateReplacementOrder` |
| **StopOnError** | No | boolean | Cancel the workflow if the order creation fails |
| **TranslateKey** | No | string | Translation key shown in the UI action log |

* * *

## Requirements

*   The project must be linked to an order via a claim
*   The return order form must have line items with a return quantity set
*   Cart validation must pass before the order is placed

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Replacement order created successfully | Success | Yes |
| No linked order found | Error | Yes |
| Cart validation failed | Error | Yes |
| No returnable line items found | No result (silent) | Yes |

* * *

## Related

*   [Project Actions overview](../project-actions.md)
*   [Create Replacement Cart](create-replacement-cart.md) — creates a cart only, without placing the order
*   [Create Replacement Order From Cart](create-replacement-order-from-cart.md) — places an order from an existing replacement cart
