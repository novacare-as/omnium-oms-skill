# Remove Try Reallocate Deadline

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/remove-try-reallocate-deadline

> Clear the automatic reallocation deadline from shipments.

## Overview

The **Remove Try Reallocate Deadline** step clears the `TryReallocateDeadline` property from shipments. This deadline is typically used to trigger automatic reallocation if an order hasn't been processed within a certain timeframe (e.g., for click-and-collect orders not picked up).

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `RemoveTryReallocateDeadline` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  If a specific shipment is provided, clears its `TryReallocateDeadline`
2.  If no shipment is provided, clears the deadline on all shipments in the order
3.  Sets the deadline value to `null`

### Prerequisites

*   Order must have shipments (unless running at shipment level)

### Side Effects

*   Clears the `TryReallocateDeadline` property
*   Prevents any scheduled automatic reallocation job from processing these shipments

## Business Cases

### When to Use

*   **Order confirmed**: Clear deadline after customer picks up a click-and-collect order
*   **Order processed**: Clear deadline once the order moves to fulfillment
*   **Manual override**: When an operator decides to keep an order at its current location

### Example Scenarios

**Scenario 1: Click-and-Collect Pickup** When a click-and-collect order is marked as picked up, remove the deadline so it won't be reallocated.

**Scenario 2: Processing Started** When a warehouse confirms they're picking an order, remove the deadline since reallocation would disrupt the process.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments on order | Warning | Yes |
| Successful removal | Success | Yes |
| Shipment provided | Success (clears that shipment only) | Yes |

## Related Steps

*   [Set Try Reallocate Deadline](set-try-reallocate-deadline.md) - Sets the deadline this step removes
