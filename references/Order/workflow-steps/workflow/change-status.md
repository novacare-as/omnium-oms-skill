# Change Status

Source: https://docs.omnium.no/docs/Order/workflow-steps/workflow/change-status

> Change order or shipment status and/or order type.

## Overview

The **Change Status** step changes the order or shipment status to a specified value. It can also change the order type. This is a fundamental step for controlling order flow through the workflow.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeStatus` |
| **Group** | Modify |
| **Applicable Statuses** | New, InProgress, Completed, OrderCanceled, Ship, Returned, ReadyForPickup |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `orderStatus` | String | Yes | \- | The new status to set |
| `orderType` | String | No | \- | Optional new order type to set |
| `triggerNewStatusWithoutWorkflow` | Boolean | No | false | Skip workflow execution for new status |

## Behavior

### What It Does

1.  Gets the target status from `orderStatus` property
2.  Returns error if no status is specified
3.  If `orderType` is specified, sets it to trigger order type change
4.  Checks for status loop (same status as current):
    *   If changing to same status, sets `triggerNewStatusWithoutWorkflow=true` to avoid loop
5.  Returns result with new status to trigger

### Prerequisites

*   `orderStatus` must be configured

### Side Effects

*   Triggers status change on order/shipment
*   May trigger order type change
*   May skip workflow for new status (loop prevention)

## Business Cases

### When to Use

*   **Status transitions**: Move orders through workflow stages
*   **Order type changes**: Change order type along with status
*   **Conditional routing**: Route orders to different statuses based on conditions

### Example Scenarios

**Scenario 1: Simple Status Change** Configure `orderStatus=Completed`. Order status changes to Completed.

**Scenario 2: Status and Type Change** Configure `orderStatus=InProgress` and `orderType=B2B`. Both status and type updated.

**Scenario 3: Same Status (Loop Prevention)** Changing to same status. `triggerNewStatusWithoutWorkflow` set to true automatically.

**Scenario 4: Missing Status** No `orderStatus` configured. Returns error.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Status changed | Success | Yes (triggers new status) |
| No status specified | Error | Yes |
| Same status (loop) | Success (no workflow) | Yes |

## Related Steps

*   [Change Shipment Order Status](change-shipment-order-status.md) - Change shipment-level status
*   [Change Status Based On Product Properties](change-status-based-on-product-properties.md) - Conditional status change
