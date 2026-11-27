# Set Canceled Date

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/set-canceled-date

> Set the cancellation timestamp on orders and line items.

## Overview

The **Set Canceled Date** step sets the cancellation date and time on orders and order line items. This records when cancellation occurred for reporting and tracking.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetCanceledDate` |
| **Group** | Enrich |
| **Applicable Statuses** | Ship, PickedUp, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Sets `Canceled` timestamp on order (if not already set)
2.  Iterates through all order line items
3.  Sets `CanceledDate` on each line item (if not already set)
4.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order should be in cancellation workflow

### Side Effects

*   Order `Canceled` timestamp set
*   All line items get `CanceledDate` set

## Business Cases

### When to Use

*   **Order cancellation**: Record when order was canceled
*   **Reporting**: Track cancellation timing
*   **Analytics**: Analyze cancellation patterns

### Example Scenarios

**Scenario 1: Full Cancellation** Order canceled. Step sets cancellation date on order and all 5 line items.

**Scenario 2: Already Set** Cancellation date already exists on order. Step preserves and only sets on items missing date.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Date set | Success (invisible) | Yes |
| Already set | Success (invisible, preserves) | Yes |

## Related Steps

*   [Set Completed Date](set-completed-date.md) - Completion timestamp
*   [Reduce Reserved Inventory](../inventory/reduce-reserved-inventory.md) - Release inventory on cancel
