# Payment Settlements

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/payment-settlements

> Retrieve and record payment settlement data from payment providers

## Overview

This task synchronizes payment settlement information from external payment providers. It queries each configured payment provider for settlement reports, matches the settlements to orders, and updates the orders with detailed payment transaction data including settlement references and payout information.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `PaymentSettlementsScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic retrieval of payment settlement data from payment providers
*   Matching of settlements to orders for reconciliation
*   Recording of settlement references and payout details on orders
*   Payment transaction number tracking

* * *

## Configuration Properties

This task has no configurable properties in the scheduled task settings. Settlement behavior is controlled by:

| Setting | Location | Description |
| --- | --- | --- |
| `PaymentTypes` | Tenant Settings | List of configured payment providers with credentials |
| `AddPaymentTransactionNumbers` | Payment Configuration | When `true`, adds transaction numbers to payments |

* * *

## Behavior

### What It Does

1.  Iterates through all configured payment types in tenant settings
2.  For each payment provider that supports settlement retrieval:
    *   Queries the provider for settlements since the last run
    *   Groups settlements by transaction ID
3.  For each settlement group:
    *   Searches for matching orders by payment transaction ID
    *   If no match by transaction ID, attempts to match by order reference
4.  Updates matched orders with settlement data:
    *   Adds new payment records for each settlement
    *   Optionally adds transaction numbers to payment records
    *   Preserves existing payment records while adding settlement info
5.  Saves all updated orders in a batch operation

### Provider Deduplication

*   Only queries each merchant ID once, even if configured in multiple payment types
*   This prevents duplicate settlements when the same merchant account is used across payment methods

### Order Matching

The task uses multiple strategies to find the correct order:

1.  **Primary**: Match by payment transaction ID stored on the order
2.  **Fallback**: For certain providers, match by order ID extracted from the internal reference

### Prerequisites

*   Payment providers must be configured with valid credentials
*   Payment providers must support the settlement retrieval interface
*   Orders must have payment transaction IDs recorded

### Side Effects

*   Adds settlement payment records to orders
*   Updates payment transaction numbers (if configured)
*   Does not remove or modify existing payment records
*   Creates log entries for errors and successful updates

* * *

## Example Configuration

```json
{
    "ImplementationType": "PaymentSettlementsScheduledTask",
    "Schedule": "0 */6 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 6 hours (`0 */6 * * *`) to retrieve settlement data regularly. Settlement data from payment providers is typically available with a delay, so frequent runs are not necessary.

* * *

## Related Tasks

*   [Order Automation](order-automation.md) - Automate based on payment status
*   [Update Order Status](update-order-status.md) - Process scheduled status changes
