# OmniumChangeProjectTypeRequest

Request for changing the project type of a project, or for refreshing a project from the project type it already has

**Fields:**

- `projectTypeId`: string, nullable — ID of the project type to change to. Leave empty to refresh the project from its current project type, for example after the project type has been changed
- `workflowStepId`: string, nullable — ID of the workflow step in the project type to set as current step. Leave empty to stay on the step that matches the current step of the project (by ID, then by name), or to go to the first step when no step matches
- `resetWorkflowSteps`: boolean — If false (default), steps and check list items that match keep their dates and completion. If true, the workflow steps and check lists start over from the project type
- `removePartner`: boolean — If true, the main partner is removed from the project
- `comment`: string, nullable — Comment for the project log. When empty, the log shows the old and the new project type

**Used directly by endpoints in:**

- [Projects](../endpoints/projects.md)
