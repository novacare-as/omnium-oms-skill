# Projects | Assets

Source: https://api.omnium.no/documentation

> Project assets

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/Assets/GetAssets`

**Get project assets**

Operation ID: `ProjectsGetAssets`

Get project assets by asset IDs

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `assetIds` | query | List<string> | No |  |

**Responses:**

- 200: List<[`OmniumAsset`](../../schemas/OmniumAsset.md)> — Returning assets
- 400: string — Bad Request
- 401: Asset ids missing
- 404: string — Project does not exist

---

## `POST /api/Projects/Assets/AddAsset/{projectId}`

**Add asset to project from stream**

Operation ID: `ProjectsAddAsset`

Add new project asset from stream

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |
| `fileName` | query | string | No |  |

**Request body:** `application/octet-stream`

**Responses:**

- 200: [`OmniumAsset`](../../schemas/OmniumAsset.md) — Asset added successfully
- 400: string — Bad Request
- 401: Asset ids missing
- 404: string — Project does not exist
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/Assets/AddAssets/{projectId}`

**Add assets to project**

Operation ID: `ProjectsAddAssets`

Add new project assets

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |

**Request body:** List<[`OmniumAsset`](../../schemas/OmniumAsset.md)>

**Responses:**

- 200: Asset added successfully
- 401: Asset ids missing
- 404: string — Project does not exist
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/Assets/UpdateAssets`

**Update asset to project**

Operation ID: `ProjectsUpdateAssets`

Update existing project assets

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | No |  |

**Request body:** List<[`OmniumAsset`](../../schemas/OmniumAsset.md)>

**Responses:**

- 200: List<[`OmniumAsset`](../../schemas/OmniumAsset.md)> — Asset updated successfully
- 401: Asset ids missing
- 404: string — Project does not exist

---

## `DELETE /api/Projects/Assets/DeleteAssets`

**Delete assets from projects**

Operation ID: `ProjectsDeleteAssets`

Delete project assets by asset IDs

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `assetIds` | query | List<string> | No |  |

**Responses:**

- 200: Asset deleted successfully
- 401: Project ID or url missing
- 404: string — Project does not exist

---

## `DELETE /api/Projects/Assets/DeleteAssetsFromProject`

**Delete all assets from project**

Operation ID: `ProjectsDeleteAssetsFromProject`

Delete all assets on a project by project ID

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | No |  |

**Responses:**

- 200: Asset deleted successfully
- 401: Project ID or url missing
- 404: string — Project does not exist
