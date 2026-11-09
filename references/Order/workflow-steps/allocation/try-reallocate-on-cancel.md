# Try Reallocate on Cancel

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-on-cancel

> Reallocate an order to the nearest warehouse with stock when a fulfillment location cancels.

## Overview

The **Try Reallocate on Cancel** step handles order reallocation when a fulfillment location cancels an order or shipment. It finds the nearest available warehouse based on zip code and transfers the order there, typically restarting the workflow from the beginning.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateOnCancel` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `retryLimit` | number | No | Maximum number of reallocation attempts |
| `StoreRoles` | string | No | Filter eligible warehouses by role |
| `PreventPackageSplit` | boolean | No | Keep package and bundle groups whole: the group is only reallocated to a warehouse that can supply every component. A package product's own `preventPackageSplit` setting overrides this default. |

## Behavior

### What It Does

1.  Checks if reallocation should be skipped (`context.SkipReallocation`)
2.  Uses zip code proximity to find the nearest warehouse with stock
3.  If successful, logs an event and triggers status change back to "New"
4.  Sets `CancelWorkflow = true` to stop current workflow and restart

### Package Handling

*   With `PreventPackageSplit` enabled - via the step property or `preventPackageSplit: true` on the package product - a package or bundle group only moves to a warehouse that can supply every component. A warehouse that cannot supply the whole group is skipped.
*   When splitting is allowed, components linked with `shipTogetherWithComponentId` still stay together: linked components are always reallocated to the same warehouse. A linked component that is already reserved on another shipment anchors its partners in place. See [Component Model Reference](../../../Product/product-components/component-model.md).

### Partial Reallocation

When only some lines of a shipment can be reallocated, the reallocated shipment restarts at status "New" while the remaining lines are split into a shipment that keeps its current status, so reallocation is retried for them. When the step runs at order level, only the order status and the reallocated shipments change status - other shipments are not affected.

### Prerequisites

*   Order must have sufficient inventory somewhere in the network
*   `context.SkipReallocation` must not be set to true

### Side Effects

*   Changes warehouse assignment
*   Records reallocation event with from/to warehouses
*   Triggers status change to "New" to restart order processing
*   Cancels the current workflow to prevent further steps

## Business Cases

### When to Use

*   **Store cancellation**: When a store can't fulfill a click-and-collect order
*   **Out of stock discovery**: When picking reveals inventory discrepancy
*   **Capacity issues**: When a warehouse can't handle the order in time

### Example Scenarios

**Scenario 1: Store Cancellation** A store cancels a click-and-collect order. The step finds the next closest store with stock and reassigns the order.

**Scenario 2: Retry Limit** Configure `retryLimit = 3` to prevent infinite reallocation loops if multiple locations cancel.

**Scenario 3: Skip Reallocation** If `context.SkipReallocation = true` (set by previous logic), the step does nothing.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Reallocation skipped | Success | Yes |
| No alternative warehouse | Warning | Yes |
| Successful reallocation | Success (triggers New status) | No (cancels workflow) |

## Related Steps

*   [Try Reallocate on Cancel Using Geo Location](try-reallocate-on-cancel-using-geo-location.md) - Uses coordinates instead of zip
*   [Set Try Reallocate Deadline](set-try-reallocate-deadline.md) - Sets automatic trigger for this
