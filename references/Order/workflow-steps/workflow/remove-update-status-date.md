# Remove Update Status Date

Source: https://docs.omnium.no/docs/Order/workflow-steps/workflow/remove-update-status-date

> Cancel a scheduled automatic status update.

## Overview

The **Remove Update Status Date** step cancels any previously scheduled automatic status update on an order. Use this to prevent scheduled status changes when orders are manually progressed.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `RemoveUpdateStatusDate` |
| **Group** | Modify |
| **Applicable Statuses** | Ship, PickedUp, Completed, InProgress, OrderCanceled, Returned, ReadyForPickup |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Sets `order.UpdateStatusDate` to null
2.  Sets `order.NextOrderStatus` to null
3.  Returns invisibly (no UI notification)

### Prerequisites

None - safe to run even if no scheduled update exists.

### Side Effects

*   Clears any scheduled status update
*   Prevents automatic status change from occurring

## Business Cases

### When to Use

*   **Manual completion**: Cancel auto-complete when order is manually completed
*   **Status change**: Clear scheduled update when status changes
*   **Workflow cancellation**: Remove pending automation on cancelled orders

### Example Scenarios

**Scenario 1: Manual Completion** Order was scheduled to auto-complete in 7 days. User manually completes it. Scheduled update removed.

**Scenario 2: Order Cancelled** Order had scheduled status update. Order is cancelled. Scheduled update cleared.

**Scenario 3: No Scheduled Update** Order has no scheduled update. Step runs successfully, no changes.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Schedule removed | Success (invisible) | Yes |
| No schedule exists | Success (invisible) | Yes |

## Related Steps

*   [Set Update Status Date](set-update-status-date.md) - Schedule status update
*   [Change Status](change-status.md) - Immediate status change
