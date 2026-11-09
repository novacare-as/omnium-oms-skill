# OmniumProjectWorkflowStep

A single step of the project workflow

**Fields:**

- `id`: string, nullable — Step ID (provided by Omnium)
- `index`: integer (int32) — Index (for sorting)
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external order IDs
- `name`: string, nullable — Name of the step
- `description`: string, nullable — Description of the step (what should be done by users during this step)
- `acceptText`: string, nullable — Text on accept button (moving forward to the next step)
- `declineText`: string, nullable — Text on decline button (moving backwards to the previous step)
- `dateText`: string, nullable — Text describing a date input. User should be able to add date if this property has value.
- `current`: boolean — True if this step is the current workflow step
- `startDate`: string (date-time), nullable — Date the step was started
- `dateCompleted`: string (date-time), nullable — Date the step was completed (if null, the step was never completed)
- `hiddenFromCustomer`: boolean — If step should be hidden from customer
- `hiddenFromPartner`: boolean — If step should be hidden from partner
- `isCommentsDisabled`: boolean — If user should be able to enter comments on this step
