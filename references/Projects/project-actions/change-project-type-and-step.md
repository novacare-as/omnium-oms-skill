# Change Project Type and Step

Source: https://docs.omnium.no/docs/Projects/project-actions/change-project-type-and-step

> Configure the ChangeProjectTypeAndStep project action to move a project to a different project type and workflow step automatically.

## Overview

The **Change Project Type and Step** action transitions the project to a different project type and sets it to a specific workflow step within that type. After the transition, the new step's workflow actions are executed immediately.

This is useful for escalation flows — for example, automatically moving a claim project to a repair project type when certain conditions are met.

**Key behaviours:**

*   The project's type, workflow steps, and checklists are all replaced with those from the target project type
*   The current workflow is cancelled after this action executes — no further actions from the original step run
*   The new step's workflow is triggered immediately (via `RestartWorkflow`)
*   If `ProjectType` is not configured, the action returns an error

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeProjectTypeAndStep` |
| **Group** | Project Actions |

* * *

## Configuration

### Minimum Required Configuration

```json
{
  "name": "ChangeProjectTypeAndStep",
  "active": true,
  "properties": [
    {
      "key": "ProjectType",
      "value": "Repair Project"
    }
  ]
}
```

### All Available Options

| Property | Required | Type | Description | Example |
| --- | --- | --- | --- | --- |
| **name** | Yes | string | Must be `ChangeProjectTypeAndStep` | `"ChangeProjectTypeAndStep"` |
| **properties.ProjectType** | Yes | string | The **name** of the target project type | `"Repair Project"` |
| **properties.ProjectStep** | No | string | The **name** of the target workflow step in the new type | `"In Progress"` |
| **properties.ProjectStepId** | No | string | The **ID** of the target workflow step in the new type | `"c6363ea9-..."` |
| **StopOnError** | No | boolean | Cancel the workflow if the type change fails | `true` or `false` |
| **TranslateKey** | No | string | Translation key shown in the UI action log |  |

> **Note:** Provide either `ProjectStep` (step name) or `ProjectStepId` (step ID) to target a specific step. If neither is provided, the first step of the new project type (lowest index) is used.

### Example — move to a specific step by name

```json
{
  "name": "ChangeProjectTypeAndStep",
  "active": true,
  "properties": [
    { "key": "ProjectType", "value": "Repair Project" },
    { "key": "ProjectStep", "value": "Received" }
  ]
}
```

* * *

## Requirements

*   The target project type (specified in `ProjectType`) must exist in the system
*   The target step name or ID (if specified) must exist on the target project type

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Type changed and new workflow started | Success (original workflow cancelled) | No — new workflow starts |
| `ProjectType` property missing | Error | Depends on `StopOnError` |
| Target project type not found | Error | Depends on `StopOnError` |

* * *

## Related

*   [Project Actions overview](../project-actions.md)
