# Workflow Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/workflow

> Steps for controlling order status transitions and workflow flow.

## Overview

Workflow steps control order status transitions and workflow routing. They enable status changes, conditional routing, and time-based automation.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Change Status](workflow/change-status.md) | `ChangeStatus` | Change order/shipment status and order type |
| [Change Shipment Order Status](workflow/change-shipment-order-status.md) | `ChangeShipmentOrderStatus` | Change status at shipment level |
| [Change Status Based On Product Properties](workflow/change-status-based-on-product-properties.md) | `ChangeStatusBasedOnProductProperties` | Conditional status change based on products |
| [Set Update Status Date](workflow/set-update-status-date.md) | `SetUpdateStatusDate` | Schedule future status change |
| [Remove Update Status Date](workflow/remove-update-status-date.md) | `RemoveUpdateStatusDate` | Cancel scheduled status change |

## Common Use Cases

### Status Transitions

Move orders through workflow stages:

```
New → ChangeStatus (InProgress) → Process → ChangeStatus (Completed)
```

### Conditional Routing

Route orders based on product properties:

```
New → ChangeStatusBasedOnProductProperties (Hazmat → HazmatReview)
```

### Time-Based Automation

Auto-complete orders after delivery window:

```
Ship → SetUpdateStatusDate (7 days → Completed)
↓
If manually completed: RemoveUpdateStatusDate
```

### Shipment-Level Control

Change status for specific shipments:

```
ChangeShipmentOrderStatus (FromStatus=InProgress, ToStatus=Ship)
```

## Status vs Order Type

The Change Status step can modify two order attributes:

*   **Status**: The workflow stage (New, InProgress, Completed, etc.)
*   **Order Type**: The order classification (Standard, Express, B2B, etc.)

Changing order type can route the order to a completely different workflow.

## Scheduled Updates

The Set/Remove Update Status Date steps work with a background process:

1.  **SetUpdateStatusDate** schedules a future status change
2.  Background worker monitors `UpdateStatusDate` field
3.  When date is reached, status changes to `NextOrderStatus`
4.  **RemoveUpdateStatusDate** cancels the scheduled change

This enables time-based automation without blocking the workflow.
