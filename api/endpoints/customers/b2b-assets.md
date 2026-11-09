# Customers | B2B | Assets

Source: https://api.omnium.no/documentation

> Manage assets on Business Customers.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/BusinessCustomer/{businessCustomerId}/Assets/GetAssets`

**Get customer assets**

Operation ID: `BusinessCustomerAssetsGetAssets`

Get customer assets by asset IDs

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `assetIds` | query | List<string> | No |  |
| `businessCustomerId` | path | string | Yes |  |

**Responses:**

- 200: List<[`OmniumAsset`](../../schemas/OmniumAsset.md)> — Returning assets
- 400: string — Bad Request
- 401: Asset ids missing
- 404: string — BusinessCustomer does not exist

---

## `POST /api/BusinessCustomer/{businessCustomerId}/Assets/AddAsset`

**Add asset to customer from stream**

Operation ID: `BusinessCustomerAssetsAddAsset`

Add new customer asset from stream

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerId` | path | string | Yes |  |
| `fileName` | query | string | No |  |
| `name` | query | string | No | Display name of the asset. Defaults to the file name |
| `description` | query | string | No | Description of the asset |
| `purpose` | query | string | No | Purpose of the asset, used to categorize it |
| `altText` | query | string | No | Alternative text for the asset |

**Request body:** `application/octet-stream`

**Responses:**

- 200: [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — Asset added successfully
- 400: string — Bad Request
- 401: Asset ids missing
- 404: string — BusinessCustomer does not exist

---

## `POST /api/BusinessCustomer/{businessCustomerId}/Assets/AddAssets`

**Add assets to customer**

Operation ID: `BusinessCustomerAssetsAddAssets`

Add new customer assets

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerId` | path | string | Yes |  |

**Request body:** List<[`OmniumAsset`](../../schemas/OmniumAsset.md)>

**Responses:**

- 200: [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — Asset added successfully
- 400: string — Bad Request
- 401: Asset ids missing
- 404: string — BusinessCustomer does not exist

---

## `POST /api/BusinessCustomer/{businessCustomerId}/Assets/UpdateAssets`

**Update asset to customer**

Operation ID: `BusinessCustomerAssetsUpdateAssets`

Update existing customer assets

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerId` | path | string | Yes |  |

**Request body:** List<[`OmniumAsset`](../../schemas/OmniumAsset.md)>

**Responses:**

- 200: [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — Asset updated successfully
- 400: string — Bad Request
- 401: Asset ids missing
- 404: string — BusinessCustomer does not exist

---

## `DELETE /api/BusinessCustomer/{businessCustomerId}/Assets/DeleteAssets`

**Delete assets from customers**

Operation ID: `BusinessCustomerAssetsDeleteAssets`

Delete customer assets by asset IDs

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `assetIds` | query | List<string> | No |  |
| `businessCustomerId` | path | string | Yes |  |

**Responses:**

- 200: Asset deleted successfully
- 400: string — Bad Request
- 401: BusinessCustomer ID or url missing
- 404: string — BusinessCustomer does not exist
