# Update Shipment Status

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/update-shipment-status

> Update the status of shipments based on order status transitions.

## Overview

The **Update Shipment Status** step updates the internal shipment status to reflect the order's workflow progress. It synchronizes shipment status with order status.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateShipmentStatus` |
| **Group** | Shipments |
| **Applicable Statuses** | New, Ship, PickedUp, Completed, ReadyForPickup |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  If running at shipment level:
    *   Validates shipment is not already shipped
    *   Updates order status on the shipment
    *   Updates the shipment status to synchronize with the order
2.  If running at order level:
    *   Iterates through all shipments
    *   Updates the shipment status for each to synchronize with the order

### Prerequisites

*   Order must have shipments
*   Shipments must not already be in Shipped status

### Side Effects

*   Shipment status updated
*   Shipment order status synchronized with order
*   May trigger shipment state machine transitions

## Business Cases

### When to Use

*   **Status transitions**: Keep shipment status in sync with order
*   **Workflow milestones**: Update shipment when order reaches key statuses
*   **Bulk updates**: Update all shipments at once

### Example Scenarios

**Scenario 1: Order to Ship Status** Order moves to Ship status. Step updates all shipment statuses accordingly.

**Scenario 2: Single Shipment Update** Running at shipment level. Only the current shipment status is updated.

**Scenario 3: Already Shipped** Shipment already marked as shipped. Step returns warning and skips.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Already shipped | Warning | Yes |
| No shipments | Warning | Yes |
| Update successful | Success | Yes |

## Related Steps

*   [Update Shipment Status for In Transit](update-shipment-status-for-in-transit.md) - For warehouse transfers
*   [Complete Shipment](complete-shipment.md) - Final shipment status
