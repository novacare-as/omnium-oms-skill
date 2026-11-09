# Create Exchange Order

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/replacement/create-exchange-order

> Create a new order for items exchanged as part of the return.

## Overview

The **Create Exchange Order** step completes (finalizes) a previously created exchange order when a customer exchanges their returned items for different products. The exchange order itself is created earlier through the exchange cart/order endpoint and referenced by its order number; this step looks that order up, moves payment from the original order, and sets the exchange order's status. This handles scenarios where customers want a different size, color, or alternative product.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateExchangeOrder` |
| **Group** | Replacement |

## Configuration Properties

This step has no configurable properties. Exchange order configuration is controlled by Order Settings.

## Behavior

### What It Does

1.  Looks up the previously created exchange order by its referenced order number
2.  Verifies the credit available from the return covers the exchange order amount
3.  Moves payment from the original order to the exchange order (crediting the original, authorizing/capturing on the exchange order)
4.  Calculates price differences (customer may pay more or receive credit)
5.  Links the processed exchange order back to the return
6.  Sets the exchange order's status and runs its workflow

### Prerequisites

*   An exchange order must already exist and be referenced by its order number on the return
*   The exchange order must have an exchange payment
*   The credit available from the return must cover the exchange order amount

### Side Effects

*   Credits the original order and authorizes/captures payment on the exchange order
*   Links the processed exchange order to the return
*   Sets the exchange order's status and runs its workflow

## Business Cases

### When to Use

*   Customer wants different size or color
*   Customer exchanges for different product
*   Upgrade/downgrade scenarios
*   Variant swaps

### Example Scenarios

**Size Exchange** Customer returns Medium shirt, wants Large. Exchange order created with Large shirt. No price difference.

**Product Upgrade** Customer returns $50 item, exchanges for $75 item. Exchange order created, customer pays $25 difference.

**Product Downgrade** Customer returns $100 item, exchanges for $60 item. Exchange order created, customer receives $40 credit.

**Different Product** Customer returns blue pants, exchanges for black pants of same style. Exchange order created with new product.

## Price Handling

Exchange orders handle price differences:

*   **Same price**: No additional payment needed
*   **Higher price**: Customer charged the difference
*   **Lower price**: Customer receives credit/refund for difference

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Exchange order completed | Success | Yes |
| No exchange order referenced on return | Error | Depends on StopOnError |
| Referenced exchange order not found | Error | Depends on StopOnError |
| No exchange payment on the order | Error | Depends on StopOnError |
| Credit insufficient to cover exchange amount | Error | Depends on StopOnError |

## Related Steps

*   [Create Replacement Order](create-replacement-order.md) - For same-item replacements
*   [Update Order Status](../status/update-order-status.md) - Update original order
