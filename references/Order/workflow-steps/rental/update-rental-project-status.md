# Update Rental Project Status

Source: https://docs.omnium.no/docs/Order/workflow-steps/rental/update-rental-project-status

> Moves all rental projects linked to an order to a specified project workflow step.

## Overview

The **Update Rental Project Status** step advances all rental projects linked to the order to a configured project workflow step. Use it to drive the rental project lifecycle in sync with order status transitions — for example, moving rental projects to a "Rented Out" step when an order ships, or to a "Awaiting Return" step when the order completes.

The step acts on all projects where `isRentalProject` is `true`. Projects of other types on the same order are not affected.

This step's execution is not shown in the order's action log in the Omnium UI. It runs silently as part of the workflow.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateRentalProjectStatus` |
| **Group** | Project |
| **Applicable Statuses** | New, InProgress, Ship, PickedUpAndPaid, PickedUp, Completed, OrderCanceled |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `WorkflowStepId` | ProjectWorkflowStep | Yes | The project workflow step to move all linked rental projects to |
| `Comment` | string | No | Comment recorded on the project when the step transition is made |

## Behavior

### What It Does

1.  Reads the `WorkflowStepId` configuration property. Returns an error if it is missing.
2.  Checks whether the order has any linked projects. If not, completes with no action.
3.  Fetches all projects linked to the order.
4.  Filters to only projects where `isRentalProject` is `true`.
5.  If no rental projects are found, completes with no action.
6.  Calls `WorkflowGoToStep` on each rental project, setting the target step to `WorkflowStepId` and attaching the optional `Comment`.

### Prerequisites

*   The order must have at least one linked rental project. These are created by the [Create Rental Project from Order](create-rental-project-from-order.md) step.
*   The `WorkflowStepId` must match a valid step in the project's workflow.

### Side Effects

*   Transitions each linked rental project to the configured workflow step.
*   Executes any project workflow actions configured on the target step.

## Business Cases

### When to Use

*   Trigger rental project transitions automatically when an order changes status — for example, marking projects as active when an order ships.
*   Coordinate rental return tracking by advancing projects to a return-pending step when an order reaches a specific status.
*   Cancel rental projects when an order is cancelled.

### Example Scenarios

**Scenario 1: Mark rental as active on shipment**

Add this step to the `Ship` status workflow. Configure `WorkflowStepId` to the project step that represents an active rental (e.g., `"rented-out"`). When the order ships, all linked rental projects move to that step automatically.

**Scenario 2: Initiate return flow on order completion**

Add this step to the `Completed` status workflow with `WorkflowStepId` set to a step that triggers return notifications or deposit settlement logic in the project workflow.

**Scenario 3: Cancel rental projects on order cancellation**

Add this step to the `OrderCanceled` status workflow with `WorkflowStepId` set to the project's cancelled step. Include a `Comment` such as `"Order cancelled"` for the project audit trail.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| `WorkflowStepId` property missing | Error | Depends on StopOnError |
| Order has no linked projects | Success (no action) | Yes |
| No rental projects among linked projects | Success (no action) | Yes |
| `WorkflowGoToStep` throws an exception | Error | Depends on StopOnError |

## Related

*   [Create Rental Project from Order](create-rental-project-from-order.md) — Creates the rental projects this step transitions
*   [Rental Overview](../../Rental/rental-overview.md) — How rental products and order lines are structured
*   [Refund Rental Deposit](../../../Projects/project-actions/refund-rental-deposit.md) — Project action for refunding deposits, typically configured on the project step this action targets
