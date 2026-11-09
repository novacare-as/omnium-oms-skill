# Add Reallocation Metadata

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/add-reallocation-metadata

> Update order metadata based on shipment information after reallocation.

## Overview

The **Add Reallocation Metadata** step updates order metadata based on the current state of shipments. This is typically used after reallocation operations to ensure the order reflects the correct fulfillment status for downstream processing and status transitions.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddReallocationMetadata` |
| **Group** | Reallocate |
| **Applicable Statuses** | All |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Checks if a shipment is provided
2.  If no shipment is provided, completes successfully with no changes
3.  Updates order properties to reflect the current shipment state and reallocation status

### Prerequisites

*   A shipment must be provided for the metadata to be updated
*   The step is typically used in shipment-level workflows

### Side Effects

*   Updates order properties to reflect reallocation state
*   Affects available order statuses in subsequent processing

## Business Cases

### When to Use

*   **After reallocation**: Update order metadata to reflect new warehouse assignments
*   **Status-dependent workflows**: When order status transitions depend on knowing whether reallocation has occurred
*   **Reporting**: Capture reallocation information for analytics and reporting

### Example Scenarios

**Scenario: Post-Reallocation Processing** After using `TryReallocateOnCancel`, add this step to update order metadata so the workflow can correctly determine available next statuses.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipment provided | Success (no action) | Yes |
| Successful update | Success | Yes |

## Related Steps

*   [Try Reallocate on Cancel](try-reallocate-on-cancel.md) - Often used before this step
*   [Try Reallocate Entire Order](try-reallocate-entire-order.md) - Often used before this step
