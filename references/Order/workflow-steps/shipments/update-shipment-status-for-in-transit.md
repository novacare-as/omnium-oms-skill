# Update Shipment Status for In Transit

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/update-shipment-status-for-in-transit

> Update shipment status specifically for packages being transferred between warehouses.

## Overview

The **Update Shipment Status for In Transit** step updates shipment status for packages that are being transferred between warehouses. It only processes shipments marked as in transit.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateShipmentStatusForInTransit` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship, PickedUp, Completed, ReadyForPickup |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies shipments that are not shipped AND have `Transit = true`
2.  If running at shipment level, only processes the current shipment
3.  For each qualifying shipment:
    *   Updates the shipment status to reflect the transit state
4.  Returns warning if no shipments qualify

### Prerequisites

*   Shipments must have `Transit = true` flag set
*   Shipments must not be in Shipped status

### Side Effects

*   Shipment status updated for transit shipments
*   Enables tracking of inter-warehouse transfers

## Business Cases

### When to Use

*   **Warehouse transfers**: Track packages moving between warehouses
*   **Cross-dock operations**: Update status during consolidation
*   **Click-and-collect**: Track items in transit to pickup location

### Example Scenarios

**Scenario 1: Warehouse Transfer** Package shipped from central warehouse to store for pickup. Step updates transit shipment status.

**Scenario 2: Cross-Dock** Items from multiple warehouses consolidating. Each transit shipment status is updated.

**Scenario 3: No Transit Shipments** Order has regular shipments (not in transit). Step returns warning.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No transit shipments | Warning | Yes |
| Update successful | Success | Yes |

## Related Steps

*   [Update Shipment Status](update-shipment-status.md) - General status update
*   [Set Shipment or Order Ready for Pickup](../inventory/set-shipment-or-order-ready-for-pickup.md) - When transit completes
