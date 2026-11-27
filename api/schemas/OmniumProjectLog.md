# OmniumProjectLog

Project log items (added by Omnium upon project updates)

**Fields:**

- `id`: string, nullable — Id
- `projectId`: string, nullable — ProjectId
- `text`: string, nullable — Logtext
- `date`: string (date-time) — Date log item is created
- `comment`: string, nullable — Comment from customer
- `user`: string, nullable — User updating project
- `dueDate`: string (date-time), nullable — When the current workflow step is due
- `dueText`: string, nullable — Comment of due date
- `newWorkflowStepName`: string, nullable — New workflow step when project is updated
- `previousWorkflowStepName`: string, nullable — The current / previous workflow step when project is updated
- `hidden`: boolean — If true, log item should be hidden from customers or partners
- `hiddenFromCustomer`: boolean — If true, log item should be hidden from customer
- `hiddenFromPartner`: boolean — If true, log item should be hidden from partner
- `data`: string, nullable — Log data

**Used directly by endpoints in:**

- [Projects](../endpoints/projects.md)
- [Projects | Logs](../endpoints/projects/logs.md)
