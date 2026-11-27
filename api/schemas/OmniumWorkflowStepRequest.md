# OmniumWorkflowStepRequest

Workflow step response

**Fields:**

- `projectId`: string, nullable — Project ID
- `date`: string (date-time), nullable — Date
- `updateType`: string, nullable — Next or previous or specific step
- `workflowStepId`: string, nullable — Specific step
- `comment`: string, nullable — Workflow step comment
- `partnerId`: string, nullable — Partner ID sending request
- `partnerName`: string, nullable — Partner name sending the request
- `userId`: string, nullable — User id sending the request
- `userName`: string, nullable — User name sending the request
- `data`: string, nullable

**Used directly by endpoints in:**

- [Projects](../endpoints/projects.md)
