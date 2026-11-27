# Change Shipment Order Status

Source: https://docs.omnium.no/docs/Order/workflow-steps/workflow/change-shipment-order-status

> Change the order status of shipments to a specified status.

## Overview

The **Change Shipment Order Status** step changes the order status on shipment level. It can target a specific shipment, all shipments, or only shipments with a particular status.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeShipmentOrderStatus` |
| **Group** | Modify |
| **Applicable Statuses** | New, InProgress, Completed, OrderCanceled, Ship, Returned, ReadyForPickup |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ToStatus` | String | Yes | \- | The new status to set on shipments |
| `FromStatus` | String | No | \- | Only change shipments with this status |

## Behavior

### What It Does

1.  Validates that shipments exist (returns error if none)
2.  Gets `ToStatus` (required) and `FromStatus` (optional) from configuration
3.  Returns error if `ToStatus` is not specified
4.  If running on a specific shipment:
    *   Changes that shipment's order status to `ToStatus`
5.  If no `FromStatus` specified:
    *   Changes all shipments to `ToStatus`
6.  If `FromStatus` specified:
    *   Only changes shipments currently at `FromStatus`
    *   Queues status updates for matching shipments

### Prerequisites

*   Order must have shipments
*   `ToStatus` must be configured

### Side Effects

*   Shipment order statuses updated
*   May trigger new status workflows for shipments

## Business Cases

### When to Use

*   **Shipment completion**: Mark individual shipments as completed
*   **Bulk status update**: Change all shipments to same status
*   **Conditional updates**: Only update shipments at specific status

### Example Scenarios

**Scenario 1: Specific Shipment** Running on shipment context. Only that shipment's status changes.

**Scenario 2: All Shipments** No `FromStatus` specified. All shipments change to `ToStatus`.

**Scenario 3: Filtered Update** `FromStatus=InProgress`, `ToStatus=Ship`. Only InProgress shipments change to Ship.

**Scenario 4: No Shipments** Order has no shipments. Returns error.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Status changed | Success | Yes |
| ToStatus not specified | Error | Yes |
| No shipments | Error | Yes |
| No matching shipments | Success (no changes) | Yes |

## Related Steps

*   [Change Status](change-status.md) - Change order-level status
*   [Update Shipment Status](../shipments/update-shipment-status.md) - Update shipment delivery status
