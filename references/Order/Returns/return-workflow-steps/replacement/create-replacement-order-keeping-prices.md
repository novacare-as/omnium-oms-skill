# Create Replacement Order Keeping Prices

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/replacement/create-replacement-order-keeping-prices

> Create a replacement order that preserves the original order's pricing.

## Overview

The **Create Replacement Order Keeping Prices** step creates a replacement order while preserving the original order's pricing. This is essential when the original order had promotional pricing, discounts, or special pricing that should carry over to the replacement.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReplacementOrderKeepingPrices` |
| **Group** | Replacement |

## Configuration Properties

This step has no configurable properties. Behavior follows ReplacementSettings configuration.

## Behavior

### What It Does

1.  Creates a new order with items from the return
2.  **Preserves original order prices** (not current catalog prices)
3.  Maintains promotional discounts and special pricing
4.  Copies customer and shipping information
5.  Links replacement to return and original order
6.  Processes through order workflow

### Prerequisites

*   Return must have items to replace
*   Original order price information accessible
*   Products must still be available

### Side Effects

*   Creates new order with historical pricing
*   Links orders (original → return → replacement)
*   May clear metadata per ReplacementSettings
*   Starts fulfillment workflow

## Business Cases

### When to Use

*   Replacing items from promotional orders
*   Honoring original sale prices
*   VIP/special customer pricing
*   Bundle or package deal replacements

### Example Scenarios

**Sale Price Replacement** Customer ordered item during 50% off sale ($50 instead of $100). Item defective. Replacement created at $50 sale price, not current $100.

**Bundle Replacement** Customer had "Buy 2 Get 1 Free" bundle. One item defective. Replacement honors the bundle pricing structure.

**Loyalty Discount** VIP customer had 20% loyalty discount. Replacement maintains the 20% discount on line items.

**Coupon Price** Original order used coupon code. Replacement shows the discounted price without needing the coupon again.

## Comparison with Create Replacement Order

| Feature | Create Replacement Order | Create Replacement Order Keeping Prices |
| --- | --- | --- |
| Pricing | Current catalog prices | Original order prices |
| Discounts | Not preserved | Preserved |
| Use case | Standard replacements | Promotional/discounted orders |

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order created | Success | Yes |
| No items to replace | Success (skipped) | Yes |
| Original prices unavailable | Warning (falls back to current) | Yes |
| Product discontinued | Error | Depends on StopOnError |
| Order creation failed | Error | Depends on StopOnError |

## Related Steps

*   [Create Replacement Order](create-replacement-order.md) - Standard pricing
*   [Create Exchange Order](create-exchange-order.md) - Different items
