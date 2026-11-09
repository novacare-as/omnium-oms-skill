# Set Ready for Pickup Date

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/set-ready-for-pickup-date

> Set the ready for pickup timestamp on click-and-collect orders.

## Overview

The **Set Ready for Pickup Date** step sets the ready for pickup timestamp on orders. This records when click-and-collect items became available for customer pickup.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetReadyForPickupDate` |
| **Group** | Enrich |
| **Applicable Statuses** | ReadyForPickup |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Sets `ReadyForPickup` to current UTC timestamp on order
2.  Always sets the value (overwrites if exists)
3.  Returns success result

### Prerequisites

*   Order should be in ReadyForPickup status

### Side Effects

*   Order `ReadyForPickup` timestamp set
*   Enables pickup notification timing
*   Triggers pickup deadline calculation

## Business Cases

### When to Use

*   **Click-and-collect**: Record when items are ready
*   **Customer notification**: Trigger pickup ready email
*   **Pickup deadline**: Start countdown for customer

### Example Scenarios

**Scenario 1: Ready for Pickup** Order moves to ReadyForPickup status. Step records the exact time items became available.

**Scenario 2: Re-run** Workflow runs again. Step updates timestamp to new value.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Date set | Success | Yes |

## Related Steps

*   [Set Completed Date](set-completed-date.md) - Completion timestamp
*   [Set Shipment or Order Ready for Pickup](../inventory/set-shipment-or-order-ready-for-pickup.md) - Full pickup preparation
