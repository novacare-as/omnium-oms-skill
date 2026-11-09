# Date Planners

Source: https://api.omnium.no/documentation

> Date planners.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/DatePlanners`

**Gets a single date planner**

Operation ID: `DatePlannersGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | query | string | No |  |

**Responses:**

- 200: [`OmniumDatePlanner`](../schemas/OmniumDatePlanner.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/DatePlanners`

**Create or overwrite a date planner.**

Operation ID: `DatePlannersPut`

**Request body:** [`OmniumDatePlanner`](../schemas/OmniumDatePlanner.md)

**Responses:**

- 200: [`OmniumDatePlanner`](../schemas/OmniumDatePlanner.md) — Success
- 400: string — Bad Request

---

## `DELETE /api/DatePlanners`

**Delete a date planner**

Operation ID: `DatePlannersDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | query | string | No |  |

**Responses:**

- 200: [`OmniumDatePlanner`](../schemas/OmniumDatePlanner.md) — Success
- 400: string — Bad Request
