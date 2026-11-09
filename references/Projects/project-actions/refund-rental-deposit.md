# Refund Rental Deposit

Source: https://docs.omnium.no/docs/Projects/project-actions/refund-rental-deposit

> Configure the RefundRentalDeposit project action to credit rental deposit amounts back to the customer when a rental project closes.

## Overview

The **Refund Rental Deposit** action refunds the rental deposit for each product on the project. It calculates the refundable amount as `TotalRentalDepositAmount - WithheldRentalDepositAmount` per product and credits the payment on the linked order.

If a portion of the deposit is intentionally withheld (e.g. due to damage), set `WithheldRentalDepositAmount` on the product before this action runs — only the remainder is refunded.

**Key behaviours:**

*   Processes all products on the project in sequence
*   Splits the refund across multiple active payments if needed (credits each until the refund amount is exhausted)
*   Credits the deposit line item specifically (identified by the `DepositFor` property on the order line)
*   If a payment credit fails or is disabled, the remaining amount is skipped for that payment
*   The order is updated after each successful credit

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `RefundRentalDeposit` |
| **Group** | Project Actions |

* * *

## Configuration

No properties are required. Deposit amounts are read from the project products.

```json
{
  "name": "RefundRentalDeposit",
  "active": true
}
```

### All Available Options

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| **name** | Yes | string | Must be `RefundRentalDeposit` |
| **StopOnError** | No | boolean | Cancel the workflow if the refund fails |
| **TranslateKey** | No | string | Translation key shown in the UI action log |

* * *

## Requirements

*   Each product on the project must have a linked `OrderId`
*   The order must have a deposit line item with a `DepositFor` property matching the product's `SkuId`
*   The order must have active payments with available credit
*   The payment provider must support crediting

### Deposit amounts on project products

| Field | Description |
| --- | --- |
| `TotalRentalDepositAmount` | The full deposit collected for this product |
| `WithheldRentalDepositAmount` | Amount withheld (e.g. for damage). Set this before the action runs to reduce the refund. Defaults to `0`. |

The refunded amount is `TotalRentalDepositAmount - WithheldRentalDepositAmount`.

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| All deposits refunded | Success | Yes |
| Unhandled exception during processing | Error | Yes |
| Payment credit disabled | Skipped for that payment | Yes |
| No available credit on payment | Skipped for that payment | Yes |

* * *

## Related

*   [Project Actions overview](../project-actions.md)
*   [Credit Return](credit-return.md) — credits the full return payment (not deposit-specific)
