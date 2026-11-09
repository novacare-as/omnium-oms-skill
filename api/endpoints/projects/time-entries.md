# Projects | Time entries

Source: https://api.omnium.no/documentation

> Project time entries

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/{projectId}/TimeEntries`

**Get all project types**

Operation ID: `TimeEntriesGetTimeEntriesForProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |
| `page` | query | integer (int32) | No |  |
| `pageSize` | query | integer (int32) | No |  |

**Responses:**

- 200: List<[`OmniumTimeEntry`](../../schemas/OmniumTimeEntry.md)> — Success
- 400: string — Bad Request

---

## `POST /api/Projects/TimeEntries/Search`

**Find time entries**

Operation ID: `TimeEntriesSearch`

Search time entries.

**Request body:** [`OmniumTimeEntrySearchRequest`](../../schemas/OmniumTimeEntrySearchRequest.md) — Search request object for finding time entries

**Responses:**

- 200: List<[`OmniumTimeEntry`](../../schemas/OmniumTimeEntry.md)> — Success
- 400: string — Bad Request

---

## `PUT /api/Projects/TimeEntries/Add`

**Create time entry**

Operation ID: `TimeEntriesAdd`

Add/update a time entry.

**Request body:** [`OmniumTimeEntry`](../../schemas/OmniumTimeEntry.md) — Omnium TimeEntry object

**Responses:**

- 200: [`OmniumTimeEntry`](../../schemas/OmniumTimeEntry.md) — Success
- 400: string — Bad Request

---

## `DELETE /api/Projects/TimeEntries/{id}`

**Delete time entries**

Operation ID: `TimeEntriesDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 200: Time entry deleted
- 400: Bad request
- 404: Not found

---

## `POST /api/Projects/TimeEntries/DeleteMany`

**Delete time entries**

Operation ID: `TimeEntriesDeleteMany`

**Request body:** List<string> — Ids of objects to delete

**Responses:**

- 200: Time entries deleted
- 400: Bad request
