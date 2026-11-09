# Credit Return

Source: https://docs.omnium.no/docs/Projects/project-actions/credit-return

> Configure the CreditReturn project action to issue a payment credit for a linked return order.

## Overview

The **Credit Return** action credits the payment on the return order form linked to the project. It finds the original order via the project's claim ID, locates the associated return order form, and calls the payment provider's credit method.

This action is intended for claim projects where the customer is owed a refund for returned goods.

**Key behaviours:**

*   The action finds the linked order automatically via the project ID — no configuration required
*   If no linked order or return order form is found, the action returns an error but does not cancel the workflow
*   On success, the order is updated to reflect the credited payment

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreditReturn` |
| **Group** | Project Actions |

* * *

## Configuration

No properties are required. The action resolves the linked order automatically.

```json
{
  "name": "CreditReturn",
  "active": true
}
```

### All Available Options

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| **name** | Yes | string | Must be `CreditReturn` |
| **StopOnError** | No | boolean | Cancel the workflow if the credit fails |
| **TranslateKey** | No | string | Translation key shown in the UI action log |

* * *

## Requirements

*   The project must be linked to an order via a claim (`project.ProjectId` must match a return order form's claim)
*   The order must have an active payment that supports crediting
*   The payment provider must support refunds

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Linked order found, credit successful | Success | Yes |
| No linked order found | Error | Yes |
| No matching return order form | No result (silent) | Yes |

* * *

## Related

*   [Project Actions overview](../project-actions.md)
*   [Refund Rental Deposit](refund-rental-deposit.md) — refunds deposit amounts specifically for rental products
