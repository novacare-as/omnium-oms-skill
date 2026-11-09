# Projects | Versions

Source: https://api.omnium.no/documentation

> Project versioning

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/Versions/{projectId}`

**Get list of all version items.**

Operation ID: `ProjectsVersionsVersionList`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID to fetch version list for |

**Responses:**

- 200: List<[`OmniumVersionListItem`](../../schemas/OmniumVersionListItem.md)> — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `GET /api/Projects/Versions/{projectId}/{versionId}`

**Get specific project version**

Operation ID: `ProjectGetVersion`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `versionId` | path | string | Yes | Version ID to fetch |

**Responses:**

- 200: [`OmniumProjectOmniumVersion`](../../schemas/OmniumProjectOmniumVersion.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
