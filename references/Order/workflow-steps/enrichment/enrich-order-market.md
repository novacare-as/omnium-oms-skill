# Enrich Order Market

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-order-market

> Set the market ID on the order based on the store configuration.

## Overview

The **Enrich Order Market** step sets the market identifier on an order based on the store where the order was placed. This ensures orders are associated with the correct market for pricing, shipping, and fulfillment rules.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichOrderMarket` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Looks up market based on order's store ID
2.  Sets the `MarketId` property on the order
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have a store ID
*   Store must be configured with a market

### Side Effects

*   Order `MarketId` set
*   Affects downstream market-specific logic
*   Determines applicable shipping options, taxes, etc.

## Business Cases

### When to Use

*   **POS orders**: POS orders may lack market info
*   **Multi-market tenants**: Ensure correct market assignment
*   **Store-based routing**: Market determines fulfillment rules

### Example Scenarios

**Scenario 1: POS Order** POS order has store ID "STORE-001" but no market. Step looks up store and sets market "NO".

**Scenario 2: Already Set** Order already has market ID. Step may validate or skip.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| Store not found | Success (invisible, may leave empty) | Yes |

## Related Steps

*   [Enrich Order from Products](enrich-order-from-products.md) - Product enrichment
*   [Select Default Shipping Method](../shipments/select-default-shipping-method.md) - Uses market for shipping
