# Update Return Status

Source: https://docs.omnium.no/docs/Projects/project-actions/update-return-status

> Configure the UpdateReturnStatus project action to change the status of the linked return order form when a project workflow step executes.

## Overview

The **Update Return Status** action updates the status of the return order form linked to the project. It finds the return form via the project's claim ID and calls the return workflow with the configured target status.

This is commonly used to automatically progress a return (e.g. mark it as `completedByStore`) when a claim project reaches a certain workflow step.

**Key behaviours:**

*   The `status` property is **required** — the action returns an error if it is missing
*   The action triggers the return order workflow with the new status, so any return workflow actions configured for that status will also run
*   If no linked return order form is found, the action returns an error

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateReturnStatus` |
| **Group** | Project Actions |

* * *

## Configuration

### Minimum Required Configuration

```json
{
  "name": "UpdateReturnStatus",
  "active": true,
  "properties": [
    {
      "key": "status",
      "value": "completedByStore"
    }
  ]
}
```

### All Available Options

| Property | Required | Type | Description | Example |
| --- | --- | --- | --- | --- |
| **name** | Yes | string | Must be `UpdateReturnStatus` | `"UpdateReturnStatus"` |
| **properties.status** | Yes | string | The return status to set on the linked return order form | `"completedByStore"` |
| **StopOnError** | No | boolean | Cancel the workflow if the status update fails | `true` or `false` |
| **TranslateKey** | No | string | Translation key shown in the UI action log on success | `"ReturnIsUpdated"` |

### Common status values

The accepted values depend on the return workflow configured for the tenant. Common values include:

| Value | Description |
| --- | --- |
| `completedByStore` | Return has been processed and completed by the store |
| `received` | Return has been received |
| `rejected` | Return has been rejected |

Check the return order workflow configuration for the full list of valid statuses for your tenant.

* * *

## Requirements

*   The project must be linked to an order via a claim (`project.ProjectId` must match a return order form's claim)
*   The `status` property must be configured on the action
*   The target status must be a valid status in the return order workflow

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Status updated successfully | Success | Yes |
| `status` property missing from configuration | Error | Yes |
| No linked return order form found | Error | Yes |

* * *

## Related

*   [Project Actions overview](../project-actions.md)
