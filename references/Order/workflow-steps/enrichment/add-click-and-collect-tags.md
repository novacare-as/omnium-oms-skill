# Add Click and Collect Tags

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/add-click-and-collect-tags

> Add specific tags to click-and-collect orders for notification routing.

## Overview

The **Add Click and Collect Tags** step adds specific tags to click-and-collect orders to enable different notification templates and processing paths based on pickup type.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddClickAndCollectTags` |
| **Group** | ClickAndCollect |
| **Applicable Statuses** | New |
| **Hidden** | Yes |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Validates order has shipments
2.  Clears `CustomerPickupDeadline` (set later when ready)
3.  For click-and-collect orders, analyzes pickup warehouse codes:
    *   `normalClickAndCollect` - All shipments have empty/zero pickup warehouse
    *   `multiClickAndCollect` - Mixed pickup warehouses
    *   `orderClickAndCollect` - All shipments have pickup warehouse set
4.  Clears `StorePickDate` for multi and order click-and-collect

### Prerequisites

*   Order must have shipments
*   Order should be click-and-collect type

### Side Effects

*   Click-and-collect tags added
*   `CustomerPickupDeadline` cleared
*   `StorePickDate` may be cleared

## Business Cases

### When to Use

*   **Notification routing**: Different emails for pickup types
*   **Processing logic**: Different handling by pickup type
*   **Reporting**: Track pickup type distribution

### Example Scenarios

**Scenario 1: Normal Click-and-Collect** Customer picks up at store, no transfer needed. Gets "normalClickAndCollect" tag.

**Scenario 2: Multi Click-and-Collect** Some items at store, some shipping from warehouse. Gets "multiClickAndCollect" tag.

**Scenario 3: Order Click-and-Collect** All items shipping to store for pickup. Gets "orderClickAndCollect" tag.

**Scenario 4: Not Click-and-Collect** Regular home delivery order. No tags added.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Tags added | Success | Yes |
| No shipments | Error | Yes |
| Not click-and-collect | Success (no tags) | Yes |

## Related Steps

*   [Add Order Tags](add-order-tags.md) - General order tags
*   [Set Shipment or Order Ready for Pickup](../inventory/set-shipment-or-order-ready-for-pickup.md) - Pickup preparation
