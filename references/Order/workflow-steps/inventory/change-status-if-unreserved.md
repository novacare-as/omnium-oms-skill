# Change Status If Unreserved

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/change-status-if-unreserved

> Split unreserved order lines into a new shipment and change their status.

## Overview

The **Change Status If Unreserved** step identifies order lines that do not have reserved inventory and splits them into a new shipment with a configured status. This allows separate handling of reserved and unreserved items — for example, cancelling or backordering unreserved lines while the reserved lines continue through fulfillment.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeStatusIfUnreserved` |
| **Group** | Inventory |
| **Applicable Statuses** | New |
| **Hidden** | Yes |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `orderStatus` | String | Yes | \- | The order status to assign to the new shipment containing unreserved lines |

## Behavior

### What It Does

1.  Retrieves the target `orderStatus` from configuration
2.  Looks up the order status configuration for the current order type to determine the shipment status:
    *   If the order status has a configured `ShipmentStatusUpdate`, that value is used as the shipment status
    *   Otherwise, defaults to `Cancelled`
3.  Identifies unreserved order lines (lines where inventory has not been reserved):
    *   If running at shipment level, checks the current shipment's line items
    *   If running at order level, checks all order line items
4.  If unreserved lines are found:
    *   Creates a new shipment by cloning the first existing shipment on the order
    *   Moves the unreserved lines into the new shipment with the resolved shipment status and the configured order status
    *   Logs an event indicating that unreserved order lines were cancelled
    *   Runs the workflow on the newly created shipment
5.  Returns success regardless of whether unreserved lines were found

### Prerequisites

*   `orderStatus` property must be configured
*   The order must have at least one existing shipment (used as a template for the new shipment)

### Side Effects

*   Creates a new shipment containing the unreserved order lines
*   The new shipment's shipment status is set based on the order status configuration's `ShipmentStatusUpdate` value, falling back to `Cancelled` if not configured
*   The unreserved lines are removed from the original shipment
*   Workflow is triggered on the newly created shipment
*   An order event is logged for the operation

## Business Cases

### When to Use

*   **Partial fulfillment**: Split orders so reserved items can ship immediately while unreserved items are handled separately
*   **Backorder management**: Route unreserved lines to a backorder status for later fulfillment
*   **Cancellation of unavailable items**: Automatically cancel lines that could not be reserved
*   **Inventory-based routing**: Separate order processing based on inventory reservation status

### Example Scenarios

**Scenario 1: Partial Reservation** An order contains 3 line items but only 2 have reserved inventory. The step splits the 1 unreserved line into a new shipment with a "Backorder" status, while the 2 reserved lines remain on the original shipment for fulfillment.

**Scenario 2: No Unreserved Lines** All order lines have reserved inventory. The step completes successfully without creating a new shipment or making any changes.

**Scenario 3: All Lines Unreserved** No lines have reserved inventory. All lines are moved to a new shipment with the configured status (e.g., "Cancelled"), effectively cancelling the entire order's fulfillment.

**Scenario 4: Shipment-Level Execution** Running at shipment level on a specific shipment. Only the unreserved lines within that shipment are split out, leaving other shipments unaffected.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| `orderStatus` not configured | Error | No |
| No existing shipments on order | Error (logged) | Yes |
| Unreserved lines found and split | Success | Yes |
| No unreserved lines found | Success (no action) | Yes |

## Related Steps

*   [Change Status If Out of Stock](change-status-if-out-of-stock.md) - Trigger status change based on inventory availability
*   [Set All Order Lines To Reserved](set-all-order-lines-to-reserved.md) - Force all lines to reserved status
*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Reserve inventory for order lines
