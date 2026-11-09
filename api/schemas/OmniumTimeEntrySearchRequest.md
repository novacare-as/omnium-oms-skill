# OmniumTimeEntrySearchRequest

**Fields:**

- `take`: integer (int32)
- `page`: integer (int32)
- `ids`: List<string>, nullable, max length 250
- `projectId`: string, nullable
- `userId`: string, nullable
- `activityId`: string, nullable
- `activityName`: string, nullable
- `dateFrom`: string (date-time), nullable
- `dateTo`: string (date-time), nullable
- `timeCode`: string, nullable
- `timeCodeName`: string, nullable
- `status`: string, nullable
- `externalIds`: List<string>, nullable, max length 250

**Used directly by endpoints in:**

- [Projects | Time entries](../endpoints/projects/time-entries.md)
