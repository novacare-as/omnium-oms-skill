# Create Replacement Order

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/replacement/create-replacement-order

> Create a replacement order with current pricing for returned items.

## Overview

The **Create Replacement Order** step creates a new order to replace returned items using current pricing. This is typically used when items need to be replaced due to defects or shipping errors, where the customer receives the same items again.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReplacementOrder` |
| **Group** | Replacement |

## Configuration Properties

This step has no configurable properties. Replacement order behavior is controlled by:

*   `DefaultReplacementOrderType` in Order Settings
*   `ReplacementSettings` configuration

## Behavior

### What It Does

1.  Creates a new order with the same items as the return
2.  Uses current product prices (not original order prices)
3.  Copies customer and shipping information
4.  Marks order as replacement (typically zero-cost to customer)
5.  Links replacement order to return and original order
6.  Processes through order workflow

### Prerequisites

*   Return must have items to replace
*   Products must still be available
*   Customer information accessible

### Side Effects

*   Creates new order in system
*   May clear metadata based on ReplacementSettings
*   Links orders (original → return → replacement)
*   Starts fulfillment workflow

## Business Cases

### When to Use

*   Defective item replacement
*   Items damaged in shipping
*   Wrong items sent to customer
*   Lost shipment replacement

### Example Scenarios

**Defective Product** Customer received defective item. Replacement order created with same product at $0 cost (covered by company).

**Shipping Damage** Item arrived damaged. Replacement created and shipped immediately.

**Lost Package** Package confirmed lost by carrier. Replacement order created for all items.

## Metadata Handling

Based on `ReplacementSettings`:

*   `IsMetaDataDeleted`: Clears order metadata from replacement
*   `DeletedMetaDataOnOrder`: Specific order properties to remove
*   `DeletedMetaDataOnOrderLine`: Specific line properties to remove

This prevents irrelevant data (like original payment references) from carrying over.

## Pricing Note

This step uses **current pricing**. If prices have changed since the original order, the replacement shows different line prices. For promotional or discounted orders, use [Create Replacement Order Keeping Prices](create-replacement-order-keeping-prices.md) instead.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order created | Success | Yes |
| No items to replace | Success (skipped) | Yes |
| Product discontinued | Error | Depends on StopOnError |
| Order creation failed | Error | Depends on StopOnError |

## Related Steps

*   [Create Replacement Order Keeping Prices](create-replacement-order-keeping-prices.md) - Preserve original pricing
*   [Create Exchange Order](create-exchange-order.md) - For different items
