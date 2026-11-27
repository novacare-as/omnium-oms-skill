# Reset All Package Components

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/reset-all-package-components

> Restore package products to their original state by removing broken-down components.

## Overview

The **Reset All Package Components** step reverses a previous package breakdown operation. It removes the individual component order lines and restores the original package/bundle line items to their pre-breakdown state.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ResetAllPackageComponents` |
| **Group** | Modify |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `resetComponentsFromProduct` | boolean | No | If true, resets components based on current product definition |

## Behavior

### What It Does

1.  Reads the `resetComponentsFromProduct` configuration
2.  Restores package products to their original bundled state
3.  Removes component line items that were created during breakdown
4.  Clears the "broken down" status on package line items

### Prerequisites

*   Order must have previously undergone package breakdown
*   Original package products must still be identifiable

### Side Effects

*   Removes component order lines
*   Restores package line items to original state
*   May affect order totals if reverting pricing changes

## Business Cases

### When to Use

*   **Order modification**: Customer changes their order, requiring re-calculation from original packages
*   **Workflow restart**: Order needs to be reprocessed from the beginning
*   **Error recovery**: Breakdown was performed incorrectly and needs to be reversed

### Example Scenarios

**Scenario 1: Order Edit** A customer wants to change quantities. Reset the packages, apply the edit, then break down again for proper inventory allocation.

**Scenario 2: Allocation Change** After discovering inventory issues, reset packages to allow the distribution logic to recalculate from scratch.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No packages to reset | Success (no modification) | Yes |
| Order was modified | Success with message | Yes |
| Order was not modified | Success with message | Yes |

## Related Steps

*   [Product Package Breakdown](product-package-breakdown.md) - The operation this step reverses
