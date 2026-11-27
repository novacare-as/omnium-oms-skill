# Transfer Replacement Order Payment

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/transfer-replacement-order-payment

> Transfer payment from the original order to replacement orders.

## Overview

The **Transfer Replacement Order Payment** step handles payment transfer when a replacement order is created from an original order. It moves payment authorization or credits from the original to the replacement order.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TransferReplacementOrderPayment` |
| **Group** | Payments |
| **Applicable Statuses** | New |
| **Hidden** | Yes |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Checks if order is a replacement order (`IsReplacementOrder` property)
2.  Checks if order has linked replacement order IDs
3.  If not a replacement order, skips silently
4.  Transfers payments from the original order to the replacement order

### Prerequisites

*   Order must be marked as a replacement order
*   Order must have `ReplacementOrderIds` linking to original order
*   Original order must have payment to transfer

### Side Effects

*   Transfers payment authorization from original order
*   Links payment between original and replacement orders
*   This step is invisible (doesn't show in workflow history)

## Business Cases

### When to Use

*   **Replacement orders**: Automatic step for replacement order workflows
*   **Exchange processing**: When exchanging items, payment transfers to new order
*   **Refund/reorder**: When creating a new order from a returned order

### Example Scenarios

**Scenario 1: Item Exchange** Customer exchanges shirt size M for size L. New replacement order created. Payment transferred from original order.

**Scenario 2: Not a Replacement** Regular new order (not a replacement). Step does nothing and returns invisibly.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Not a replacement order | Success (invisible, no action) | Yes |
| No replacement order IDs | Success (invisible, no action) | Yes |
| Transfer successful | Success (invisible) | Yes |

## Related Steps

*   [Create Payment Remaining](create-payment-remaining.md) - If additional payment needed
*   [Capture Payments](capture-payments.md) - Captures the transferred payment
