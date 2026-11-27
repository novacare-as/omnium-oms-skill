# OmniumProjectTypeReport

Project type report

**Fields:**

- `totalProjects`: integer (int32) — Total number of projects in the period (not deleted, not cancelled, not finished)
- `newProjects`: integer (int32) — Total number of projects created in the period
- `completedProjects`: integer (int32) — Total number of projects finished in the period
- `cancelledProjects`: integer (int32) — Total number of projects cancelled in the period
- `projectTypeName`: string, nullable — Project type
- `timeToComplete`: string — Average completion time for completed projects
- `timeToRespond`: string — Average response time for projects responded to

**Used directly by endpoints in:**

- [Projects | Reports](../endpoints/projects/reports.md)
