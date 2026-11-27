# Set Try Reallocate Deadline

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/set-try-reallocate-deadline

> Set a deadline for automatic reallocation if the order isn't processed in time.

## Overview

The **Set Try Reallocate Deadline** step sets a deadline on shipments after which the order should be automatically reallocated if not processed. This is commonly used for click-and-collect orders where stores have limited time to pick the order before it's reassigned.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetTryReallocateDeadline` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Deadline` | TimeSpan | No | Time period until deadline (default: 2 days). Format: "d.hh:mm:ss" or "hh:mm:ss" |
| `SetBasedOnStoreOpeningHours` | boolean | No | If true, calculates deadline based on store opening hours |

## Behavior

### What It Does

1.  Parses the `Deadline` property (defaults to 2 days if not specified)
2.  If `SetBasedOnStoreOpeningHours` is enabled:
    *   Retrieves store information for each shipment's warehouse
    *   Calculates deadline considering store opening hours
3.  Sets `TryReallocateDeadline` on shipments to the calculated date/time
4.  Works on either a specific shipment or all shipments in the order

### Prerequisites

*   Order must have shipments
*   If using store opening hours, stores must be configured with opening hour data

### Side Effects

*   Sets `TryReallocateDeadline` property on shipments
*   Enables scheduled jobs to automatically reallocate orders past their deadline

## Business Cases

### When to Use

*   **Click-and-collect**: Give stores a window to pick orders before reassigning
*   **Store fulfillment SLA**: Ensure orders don't sit indefinitely at a store
*   **Capacity management**: Automatically redistribute orders from overwhelmed locations

### Example Scenarios

**Scenario 1: 48-Hour Store SLA** Configure `Deadline = "2.00:00:00"` to give stores 2 days to process click-and-collect orders.

**Scenario 2: Business Hours Only** Configure `SetBasedOnStoreOpeningHours = true` with `Deadline = "08:00:00"` to give stores 8 business hours.

**Scenario 3: Same-Day Processing** Configure `Deadline = "06:00:00"` for orders that must be picked within 6 hours.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments on order | Warning | Yes |
| Invalid deadline format | Uses default (2 days) | Yes |
| Store not found | Uses deadline without opening hours | Yes |
| Successful | Success | Yes |

## Related Steps

*   [Remove Try Reallocate Deadline](remove-try-reallocate-deadline.md) - Clears the deadline this step sets
*   [Try Reallocate on Cancel](try-reallocate-on-cancel.md) - The reallocation that may occur after deadline
