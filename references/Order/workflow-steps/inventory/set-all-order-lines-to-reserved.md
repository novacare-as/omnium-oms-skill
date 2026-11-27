# Set All Order Lines To Reserved

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/set-all-order-lines-to-reserved

> Mark all order lines as having reserved inventory regardless of allocation results.

## Overview

The **Set All Order Lines To Reserved** step forces all order lines to be marked as having reserved inventory. This bypasses normal allocation results and ensures all items are treated as reserved.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetAllOrderLinesToReserved` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Validates order exists
2.  Iterates through all order line items
3.  For each line item:
    *   Sets `ReservedInventory = true`
    *   Sets `ReservedInventoryQuantity = Quantity - CanceledQuantity`
4.  Returns success after updating all lines

### Prerequisites

*   Order must exist with line items

### Side Effects

*   All line items marked as reserved
*   Reserved quantity set to full quantity (minus cancellations)
*   Does NOT actually reserve inventory in the inventory system

## Business Cases

### When to Use

*   **Skip allocation**: When allocation should be bypassed
*   **Manual processing**: When inventory is managed outside Omnium
*   **Override allocation**: Force orders to proceed despite allocation failures
*   **External inventory**: When using external inventory management

### Example Scenarios

**Scenario 1: Skip Allocation** Business decides all orders should proceed without allocation checks. Step marks all items as reserved so workflow continues.

**Scenario 2: External Inventory System** Inventory is managed in an external system. Step marks items reserved in Omnium while external system handles actual reservation.

**Scenario 3: Override Failed Allocation** Allocation failed but order should proceed. Step forces reserved status on all items.

**Scenario 4: Partial Cancellation** Order has 10 items, 2 canceled. Step marks 8 as reserved (quantity - canceled).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order not found | Error | No |
| Update successful | Success | Yes |
| Exception during update | Error | No |

## Related Steps

*   [Allocate to Warehouse](../allocation/allocate-to-warehouse.md) - Standard allocation step
*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Actually reserves inventory
