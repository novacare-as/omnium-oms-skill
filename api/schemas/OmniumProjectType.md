# OmniumProjectType

A type of project, with definitions of workflow steps. Used as template when Omnium is creating new projects.

**Fields:**

- `projectTypeId`: string, nullable — Unique project type ID
- `projectTypeName`: string, nullable — Name of project type
- `workflowSteps`: List<[`OmniumProjectWorkflowStep`](OmniumProjectWorkflowStep.md)>, nullable, max length 250 — All steps defining the project workflow
- `projectCategory`: string, nullable — Project type category (e.g. Claim, Service)
- `partnerCheckList`: List<[`OmniumProjectCheckListItem`](OmniumProjectCheckListItem.md)>, nullable, max length 250 — Project type checklist
- `availablePartnerIds`: List<string>, nullable, max length 250 — Business customer IDs that can be related to project as partners
- `isPartnerDisabled`: boolean — True if projects of this type cannot be assigned to partners
- `active`: boolean — True if project type is active
- `finishOnLastStep`: boolean — True if projects of this type should get status completed on last workflow step
- `canHaveMultiplePartners`: boolean — True if project can have multiple partners
- `internalCheckList`: List<[`OmniumProjectCheckListItem`](OmniumProjectCheckListItem.md)>, nullable, max length 250 — Check list items for project type
- `publicUrl`: string, nullable — Internal check list items for project type
- `defaultOrderType`: string, nullable — Default order type for new carts created from projects
- `setDeliveryAddressToMainStoreAddress`: boolean — Set cart delivery/billing address from project main store
- `projectTypeDescription`: string, nullable — Description of the project type
- `defaultProperties`: List<[`OmniumDefaultPropertyItem`](OmniumDefaultPropertyItem.md)>, nullable, max length 250 — Default values for schema on project type
- `terms`: string, nullable — Terms text for projects with project type

**Used directly by endpoints in:**

- [Orders | Returns](../endpoints/orders/returns.md)
- [Projects](../endpoints/projects.md)
- [Projects | Project types](../endpoints/projects/project-types.md)
