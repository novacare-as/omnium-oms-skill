# Reserve Gift Cards

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/reserve-gift-cards

> Reserve gift card balances used as payment on the order.

## Overview

The **Reserve Gift Cards** step reserves the balance on gift cards used as payment for the order. This ensures the gift card funds are held and can't be used elsewhere while the order is being processed.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ReserveGiftCards` |
| **Group** | Payments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies gift card payments on the order
2.  Reserves the gift card balance for the order
3.  Places a hold on the gift card balance for the payment amount
4.  Returns success or warning based on reservation result

### Prerequisites

*   Order must have gift card payments
*   Gift card provider must be configured

### Side Effects

*   Places hold on gift card balance
*   Reserved amount becomes unavailable for other orders

## Business Cases

### When to Use

*   **Gift card payments**: When customers pay with gift cards
*   **Payment authorization**: Ensure funds are available before processing
*   **Split payments**: Reserve gift card portion of split payments

### Example Scenarios

**Scenario 1: Full Gift Card Payment** Customer pays $100 order entirely with gift card. Step reserves $100 from the gift card balance.

**Scenario 2: Partial Payment** Customer pays $50 with gift card, $50 with credit card. Step reserves $50 from the gift card.

**Scenario 3: Insufficient Balance** Gift card has $30 but order needs $50. Reservation may fail or partially succeed depending on provider.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Reservation successful | Success | Yes |
| Reservation failed | Warning | Yes |

## Related Steps

*   [Create and Send Gift Cards](create-and-send-gift-cards.md) - Creates gift cards from purchases
*   [Capture Payments](capture-payments.md) - Captures the reserved amount
