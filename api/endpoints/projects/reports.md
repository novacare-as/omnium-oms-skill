# Projects | Reports

Source: https://api.omnium.no/documentation

> Project reports

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/ProjectReports/GetProjectDailyReports`

**Search, filter and generate project daily stats**

Operation ID: `ProjectReportsGetProjectDailyReports`

**Request body:** [`OmniumProjectSearchRequest`](../../schemas/OmniumProjectSearchRequest.md) — Search request

**Responses:**

- 200: List<[`OmniumProjectDailyReport`](../../schemas/OmniumProjectDailyReport.md)> — Success
- 400: string — Bad Request

---

## `POST /api/ProjectReports/GetProjectTypeReports`

**Get project type stats for a given time-span. Stats exclude deleted projects and projects without ProjectTypeName. Stats only return stats on stores to which the user has access. Stats include all project created before toDate that are still ongoing or was cancelled or finished within the time-span.**

Operation ID: `ProjectReportsGetProjectTypeReports`

**Request body:** [`OmniumProjectTypeReportRequest`](../../schemas/OmniumProjectTypeReportRequest.md) — Search request

**Responses:**

- 200: List<[`OmniumProjectTypeReport`](../../schemas/OmniumProjectTypeReport.md)> — Success
- 400: string — Bad Request
