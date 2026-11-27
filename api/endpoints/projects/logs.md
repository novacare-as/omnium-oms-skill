# Projects | Logs

Source: https://api.omnium.no/documentation

> Project logs

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/{projectId}/Log`

**Get log items for a project (sorted by date descending)**

Operation ID: `ProjectLogsGetProjectLog`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |
| `page` | query | integer (int32) | No |  |
| `take` | query | integer (int32) | No |  |

**Responses:**

- 200: [`OmniumProjectLogOmniumSearchResult`](../../schemas/OmniumProjectLogOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/Projects/ProjectLogs/Search`

**Search project logs**

Operation ID: `ProjectLogsSearch`

Search project logs.

**Request body:** [`OmniumProjectLogSearchRequest`](../../schemas/OmniumProjectLogSearchRequest.md) — Search request object for project logs

**Responses:**

- 200: List<[`OmniumProjectLog`](../../schemas/OmniumProjectLog.md)> — Success
- 400: string — Bad Request

---

## `PUT /api/Projects/ProjectLogs/Add`

**Add/update project log item**

Operation ID: `ProjectLogsAdd`

Add/update a project log item.

**Request body:** [`OmniumProjectLog`](../../schemas/OmniumProjectLog.md) — Omnium ProjectLog object

**Responses:**

- 200: [`OmniumProjectLog`](../../schemas/OmniumProjectLog.md) — Success
- 400: string — Bad Request

---

## `DELETE /api/Projects/ProjectLogs/{id}`

**Delete project log item**

Operation ID: `ProjectLogsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 200: Project log item deleted
- 400: Invalid request
- 404: Project not found
