# OmniumProjectTypeReportRequest

Request for generating project type stats

**Fields:**

- `fromDate`: string (date-time), required — From date
- `toDate`: string (date-time), required — To date
- `storeIds`: List<string>, nullable, max length 1000 — Filter by store IDs

**Used directly by endpoints in:**

- [Projects | Reports](../endpoints/projects/reports.md)
