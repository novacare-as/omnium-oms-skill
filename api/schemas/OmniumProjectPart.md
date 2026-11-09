# OmniumProjectPart

Project part

**Fields:**

- `title`: string, nullable — Project part title
- `description`: string, nullable — Description of project part
- `status`: string, nullable — Project part status [Sent, Rejected, Approved, Cancelled]
- `id`: string, nullable — Project part unique identifier
- `tasks`: List<[`OmniumProjectTask`](OmniumProjectTask.md)>, nullable, max length 250 — Tasks for project part
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `cartIds`: List<string>, nullable, max length 250 — Cart IDs connected to project part
- `created`: string (date-time) — Date created
- `modified`: string (date-time) — Date modified
- `transactions`: List<[`OmniumProjectTransaction`](OmniumProjectTransaction.md)>, nullable, max length 250 — Project part level transactions
- `transactionSummary`: [`OmniumProjectTransaction`](OmniumProjectTransaction.md)

**Used directly by endpoints in:**

- [Projects | Parts](../endpoints/projects/parts.md)
