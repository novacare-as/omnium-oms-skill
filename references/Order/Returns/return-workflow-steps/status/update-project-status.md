# Update Project Status

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/status/update-project-status

> Update the status of a project or claim associated with the return.

## Overview

The **Update Project Status** step updates the status of a project or claim that is linked to the return. This is used when returns are part of a larger project workflow, such as warranty claims or customer service cases.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateProjectStatus` |
| **Group** | Status |

## Configuration Properties

This step has no configurable properties. The target project step is not set on the workflow step itself — it is derived from the return status. Each return status carries a `ProjectWorkflowStep` property naming the project workflow step the linked project should be moved to.

## Behavior

### What It Does

1.  Checks if the return is linked to a project/claim (via the claim's project)
2.  Retrieves the associated project
3.  Resolves the return status that matches the return's current status
4.  Reads the `ProjectWorkflowStep` property on that return status to determine the target project step
5.  Moves the linked project to the matching project workflow step

### Prerequisites

*   Return must be linked to a project
*   Project must exist and be accessible
*   The matching return status must define a `ProjectWorkflowStep` property, and that step must exist on the project

### Side Effects

*   Changes project status
*   May trigger project workflows
*   Updates project history
*   Affects project reporting

## Business Cases

### When to Use

*   When returns are part of warranty claims
*   Customer service case management
*   Tracking grouped returns under projects
*   Multi-step return approval workflows

### Example Scenarios

**Warranty Claim** Return processed for defective item under warranty claim project. Step updates project status to "Claim Resolved".

**Customer Service Case** Return completes a customer service issue. Step updates project from "In Progress" to "Resolved".

**Quality Investigation** Defective item return linked to quality project. Step updates project to "Under Investigation".

## Sample Configuration

```json
{
  "Name": "UpdateProjectStatus",
  "Active": true,
  "TranslateKey": "WorkflowStep_UpdateProject"
}
```

The target project step is configured on the return status (via its `ProjectWorkflowStep` property), not on this step.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Project updated | Success | Yes |
| No linked project | Success (skipped) | Yes |
| Project not found | Warning | Yes |
| Update failed | Error | Depends on StopOnError |

## Related Steps

*   [Update Order Status](update-order-status.md) - Update original order
*   [Notification](../notifications/notification.md) - Notify about project updates
