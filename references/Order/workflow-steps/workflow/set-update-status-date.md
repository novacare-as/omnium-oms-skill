# Set Update Status Date

Source: https://docs.omnium.no/docs/Order/workflow-steps/workflow/set-update-status-date

> Schedule automatic status update for a future time.

## Overview

The **Set Update Status Date** step schedules an automatic order status change for a future date/time. This enables time-based workflow automation such as auto-completion after delivery windows.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetUpdateStatusDate` |
| **Group** | Modify |
| **Applicable Statuses** | New, Ship, PickedUp, Completed, InProgress, OrderCanceled, Returned, ReadyForPickup |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `TimeSpan` | TimeSpan | Yes | \- | Time duration from now (e.g., "1.00:00:00" for 1 day) |
| `Status` | String | Yes | \- | Status to change to when time elapses |

## Behavior

### What It Does

1.  Gets `TimeSpan` and `Status` from configuration
2.  Returns error if either is missing
3.  Parses the TimeSpan value
4.  Returns error if TimeSpan is invalid
5.  Sets `order.UpdateStatusDate` to current UTC time plus TimeSpan
6.  Sets `order.NextOrderStatus` to the configured status
7.  Returns invisibly (no UI notification)

### Prerequisites

*   Both `TimeSpan` and `Status` must be configured
*   TimeSpan must be a valid format

### Side Effects

*   `UpdateStatusDate` set on order
*   `NextOrderStatus` set on order
*   Background process will change status when date is reached

## Business Cases

### When to Use

*   **Auto-completion**: Complete orders after delivery window
*   **Reminder workflows**: Trigger follow-up after specified time
*   **SLA management**: Escalate orders not processed within timeframe

### Example Scenarios

**Scenario 1: Auto-Complete After 7 Days** `TimeSpan=7.00:00:00`, `Status=Completed`. Order auto-completes 7 days after step runs.

**Scenario 2: 2-Hour Reminder** `TimeSpan=02:00:00`, `Status=NeedsAttention`. Order flagged after 2 hours.

**Scenario 3: Invalid TimeSpan** `TimeSpan=invalid`. Returns error.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Schedule set | Success (invisible) | Yes |
| TimeSpan missing | Error | Yes |
| Status missing | Error | Yes |
| Invalid TimeSpan | Error | Yes |

## Related Steps

*   [Remove Update Status Date](remove-update-status-date.md) - Cancel scheduled update
*   [Change Status](change-status.md) - Immediate status change
