# Workflow Execution Results

Source: https://docs.omnium.no/docs/Order/order-logging/workflow-execution-results

> Understand the results produced by each workflow step when processing orders, including status, errors, and duration.

## Workflow Execution Results

Each time a workflow runs on an order, every workflow step produces an `OrderActionExecutionResult`. These results are attached to the [Event Log](event-log.md) entry for the workflow completion event, giving you detailed insight into what each step did.

### Result Model

| Property | Type | Description |
| --- | --- | --- |
| `actionStatus` | string | Outcome of the step (e.g., success, error) |
| `actionType` | string | Type of action performed |
| `errorReason` | string | Error details if the step failed |
| `message` | string | Human-readable result message |
| `messageHeading` | string | Message heading/title |
| `duration` | TimeSpan | How long the step took to execute |
| `cancelWorkflow` | bool | Whether this step canceled the remaining workflow |
| `triggerNewStatus` | string | If set, the order transitioned to this new status |
| `orderStatusChanged` | bool | Whether the order status changed as a result |
| `isInvisible` | bool | Whether the result is hidden in the UI |

### How to Access

Workflow execution results are available via:

*   **Event Log attachments**: Look for Event Log entries with category `Workflow`. The results are stored as attachments with type `workflowJson`.
*   **Order detail page in the UI**: After a workflow runs, the execution results are displayed on the order detail page showing the outcome of each step.
