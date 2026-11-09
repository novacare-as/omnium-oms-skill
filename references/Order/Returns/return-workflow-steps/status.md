# Status Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/status

> Workflow steps for updating order and project statuses based on return processing.

## Overview

Status workflow steps update the status of related entities when returns are processed. They keep the original order, associated projects, and return itself in sync.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Update Order Status](status/update-order-status.md) | `UpdateOrderStatus` | Update the original order's status to reflect the return |
| [Update Project Status](status/update-project-status.md) | `UpdateProjectStatus` | Update associated project/claim status |
| [Cancel Return](status/cancel-return.md) | `CancelReturn` | Cancel the return and reset financial values |

## Order Status Updates

The `UpdateOrderStatus` step automatically updates the original order's status based on return processing:

*   **Partial Return**: Order status may change to "PartiallyReturned"
*   **Full Return**: Order status may change to "Returned"

The exact status values depend on your order status configuration.

## Return Cancellation

The `CancelReturn` step is typically used in a "Cancelled" return status. It resets all return-related financial calculations and marks the return as void.
