# Projects | Project types

Source: https://api.omnium.no/documentation

> Project types

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/ProjectTypes/GetAll`

**Get all project types**

Operation ID: `ProjectTypesGetAll`

**Responses:**

- 200: List<[`OmniumProjectType`](../../schemas/OmniumProjectType.md)> — Success
- 404: Not Found

---

## `PATCH /api/ProjectTypes`

**Patch Project Type - update only values in request**

Operation ID: `ProjectTypesPatchProject`

**Request body:** [`OmniumProjectTypePatch`](../../schemas/OmniumProjectTypePatch.md) — Project type patches. Properties with value will be updated

**Responses:**

- 200: [`OmniumProjectType`](../../schemas/OmniumProjectType.md) — Project Type updated successfully
- 400: string — Project Type patch is invalid
- 404: string — Not Found
