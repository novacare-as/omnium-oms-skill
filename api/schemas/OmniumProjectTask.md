# OmniumProjectTask

Project task item

**Fields:**

- `id`: string, nullable — Unique identifier for the task
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Properties
- `created`: string (date-time), nullable — Created
- `text`: string, nullable — Description of task
- `comment`: string, nullable — Comment on performed task
- `completed`: string (date-time), nullable — Date and time task was completed
- `completedById`: string, nullable — ID of user performing task
- `completedByName`: string, nullable — Name of user performing task
- `isCompleted`: boolean — Is task completed?

**Used directly by endpoints in:**

- [Projects | Parts](../endpoints/projects/parts.md)
