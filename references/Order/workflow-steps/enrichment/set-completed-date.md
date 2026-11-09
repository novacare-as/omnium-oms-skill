# Set Completed Date

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/set-completed-date

> Set the completion timestamp on orders and shipments.

## Overview

The **Set Completed Date** step sets the completion date and time on orders and/or shipments. This records when fulfillment was completed for reporting and tracking purposes.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetCompletedDate` |
| **Group** | Enrich |
| **Applicable Statuses** | Ship, PickedUp, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  If running at shipment level:
    *   Sets `Completed` on the shipment (if not already set)
    *   If all shipments are completed or have same status, sets order `Completed`
    *   Syncs order status if all shipments match
2.  If running at order level:
    *   Sets `Completed` on order (if not already set)
    *   Sets `Completed` on all shipments (if not already set)
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order should be in completion status

### Side Effects

*   Order `Completed` timestamp set
*   Shipment `Completed` timestamps set
*   May sync order status with shipments

## Business Cases

### When to Use

*   **Order completion**: Record when order is fulfilled
*   **Reporting**: Track fulfillment time metrics
*   **SLA tracking**: Measure delivery performance

### Example Scenarios

**Scenario 1: Order Level** Order moves to Completed status. Step sets completion date on order and all shipments.

**Scenario 2: Shipment Level** Single shipment completes. Only that shipment gets date. Order date set only if all shipments done.

**Scenario 3: Already Set** Completion date already exists. Step preserves existing value.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Date set | Success (invisible) | Yes |
| Already set | Success (invisible, preserves) | Yes |

## Related Steps

*   [Set Canceled Date](set-canceled-date.md) - Cancellation timestamp
*   [Set Ready for Pickup Date](set-ready-for-pickup-date.md) - Pickup ready timestamp
