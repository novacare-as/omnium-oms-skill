# Cases

Source: https://api.omnium.no/documentation

> Customer cases and support tickets.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Cases/{id}`

**Get single case by ID**

Operation ID: `CasesGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Case ID |

**Responses:**

- 200: [`OmniumCase`](../schemas/OmniumCase.md) — Case found and returned
- 400: string — Case ID is invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Case does not exist

---

## `DELETE /api/Cases/{id}`

**Delete a case**

Operation ID: `CasesDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Case ID |

**Responses:**

- 200: Case deleted
- 400: string — Case ID is invalid

---

## `POST /api/Cases`

**Create a new case**

Operation ID: `CasesPost`

**Request body:** [`OmniumCase`](../schemas/OmniumCase.md) — Case to create

**Responses:**

- 200: [`OmniumCase`](../schemas/OmniumCase.md) — Case created and returned
- 400: string — Invalid case data

---

## `PUT /api/Cases`

**Full update of an existing case**

Operation ID: `CasesPut`

**Request body:** [`OmniumCase`](../schemas/OmniumCase.md) — Case with updated values

**Responses:**

- 200: [`OmniumCase`](../schemas/OmniumCase.md) — Case updated and returned
- 400: string — Invalid case data
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Case not found

---

## `PATCH /api/Cases`

**Partial update of an existing case. Only non-null values will be applied.**

Operation ID: `CasesPatch`

**Request body:** [`OmniumCasePatch`](../schemas/OmniumCasePatch.md) — Patch with values to update

**Responses:**

- 200: [`OmniumCase`](../schemas/OmniumCase.md) — Case patched and returned
- 400: string — Invalid patch data
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Case not found

---

## `POST /api/Cases/Search`

**Search for cases**

Operation ID: `CasesSearch`

**Request body:** [`OmniumCaseSearchRequest`](../schemas/OmniumCaseSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumCaseOmniumSearchResult`](../schemas/OmniumCaseOmniumSearchResult.md) — Search results returned

---

## `POST /api/Cases/{id}/AssignTo`

**Assign a case to a user**

Operation ID: `CasesAssignTo`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Case ID |
| `userId` | query | string | No | User ID to assign to |
| `userName` | query | string | No | Display name of the user |

**Responses:**

- 200: [`OmniumCase`](../schemas/OmniumCase.md) — Case assigned and returned
- 400: string — Invalid parameters
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Case not found

---

## `POST /api/Cases/{id}/ChangeStatus`

**Change the status of a case**

Operation ID: `CasesChangeStatus`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Case ID |
| `status` | query | string | No | New status |

**Responses:**

- 200: [`OmniumCase`](../schemas/OmniumCase.md) — Case status changed and returned
- 400: string — Invalid parameters
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Case not found
