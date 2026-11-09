# Try Split Unreserved Order Lines to New Shipment

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-split-unreserved-order-lines-to-new-shipment

> Move unreserved order lines to a new shipment, optionally at a specific warehouse.

## Overview

The **Try Split Unreserved Order Lines to New Shipment** step creates a new shipment for order lines that don't have inventory reserved at the current warehouse. This simple split operation separates available and unavailable items without complex proximity calculations.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TrySplitUnreservedOrderLinesToNewShipment` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `warehouseCode` | string | No | Target warehouse for the new shipment |
| `SplitToStatus` | string | No | Status to assign to the new shipment |

## Behavior

### What It Does

1.  Identifies order lines without sufficient inventory reservation
2.  Creates a new shipment for unreserved lines
3.  Optionally assigns a specific warehouse to the new shipment
4.  Optionally sets a specific status on the new shipment

### Prerequisites

*   Order must have lines with insufficient inventory reservation
*   If `warehouseCode` is specified, it must be a valid warehouse

### Side Effects

*   Creates a new shipment
*   Moves unreserved line items to the new shipment
*   May set warehouse and status on the new shipment

## Business Cases

### When to Use

*   **Simple separation**: Separate available and unavailable items without complex routing
*   **Backorder handling**: Move unavailable items to a "waiting" status
*   **Manual routing**: Split now, let operators manually assign the new shipment

### Example Scenarios

**Scenario 1: Backorder Workflow** Configure `SplitToStatus = "AwaitingStock"` to move unavailable items to a backorder status while available items proceed to fulfillment.

**Scenario 2: Central Warehouse Fallback** Configure `warehouseCode = "CENTRAL"` to route unavailable items to the central warehouse with the largest inventory.

**Scenario 3: No Configuration** Without configuration, simply creates a new shipment without warehouse assignment for manual handling.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Lines split successfully | Success | Yes |
| No lines to split | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Split Unreserved Order Lines](try-split-unreserved-order-lines.md) - More configuration options
*   [Try Split Unreserved to Closest Zip](try-split-unreserved-order-lines-to-closest-zip.md) - Automatic warehouse by proximity
*   [Set All Order Lines Not Reserved to Be Purchased](set-all-order-lines-not-reserved-to-be-purchased.md) - Mark lines for purchase order instead
