# OmniumTimeEntry

Time entry related to project.

**Fields:**

- `id`: string, nullable — Id
- `projectId`: string, nullable — Id of related project
- `userId`: string, nullable — Id of the user connected to the time entry
- `activityId`: string, nullable — ActivityId
- `activityName`: string, nullable — Name of the activity
- `date`: string (date-time), nullable — Date of the time entry
- `hours`: integer (int32), nullable — The number of hours for the time entry
- `comment`: string, nullable — Comment
- `timeCode`: string, nullable — Time code
- `timeCodeName`: string, nullable — Time code name
- `status`: string, nullable — Status [Active, Approved, Draft]
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external ids connected to the time entry

**Used directly by endpoints in:**

- [Projects | Time entries](../endpoints/projects/time-entries.md)
