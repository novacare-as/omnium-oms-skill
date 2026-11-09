# Projects | Parts

Source: https://api.omnium.no/documentation

> Project parts

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/{projectId}/ProjectParts/{projectPartId}`

**Get project part**

Operation ID: `ProjectsPartsGetProjectPart`

Get project part by project ID and project part ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `projectPartId` | path | string | Yes | Project part ID to get |

**Responses:**

- 200: [`OmniumProjectPart`](../../schemas/OmniumProjectPart.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/Projects/{projectId}/ProjectParts/{projectPartId}`

**Update project part**

Operation ID: `ProjectsPartsProjectPartDelete`

Delete project part by project and project part ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `projectPartId` | path | string | Yes | Project part ID to delete |

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Projects/{projectId}/ProjectParts`

**Add project part**

Operation ID: `ProjectsPartsProjectPartAdd`

Add project part by project ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** [`OmniumProjectPart`](../../schemas/OmniumProjectPart.md) — Project part to add

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Projects/{projectId}/ProjectParts`

**Update project part**

Operation ID: `ProjectsPartsProjectPartUpdate`

Update or add project part by project ID. Projects parts with same ID will be overriden.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** [`OmniumProjectPart`](../../schemas/OmniumProjectPart.md) — Project part to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Projects/{projectId}/ProjectParts/AddMany`

**Update many project parts**

Operation ID: `ProjectsPartsProjectPartAddMany`

Add project parts by project ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** List<[`OmniumProjectPart`](../../schemas/OmniumProjectPart.md)> — Project parts to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Projects/{projectId}/ProjectParts/{projectPartId}/UpdateProjectTask`

**Update task on project part**

Operation ID: `ProjectsPartsUpdateProjectTask`

Update or add task on project part.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `projectPartId` | path | string | Yes | Project part ID |

**Request body:** [`OmniumProjectTask`](../../schemas/OmniumProjectTask.md) — Project task to add or update on project part

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Projects/{projectId}/ProjectParts/UpdateMany`

**Update many project parts**

Operation ID: `ProjectsPartsProjectPartUpdateMany`

Update or add project parts by project ID. Projects parts with same ID will be overriden.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** List<[`OmniumProjectPart`](../../schemas/OmniumProjectPart.md)> — Project parts to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
