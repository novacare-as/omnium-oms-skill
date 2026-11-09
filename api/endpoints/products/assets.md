# Products | Assets

Source: https://api.omnium.no/documentation

> Product assets.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Products/AddProductImage`

**Add image to product**

Operation ID: `ProductsAddProductImage`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `url` | query | string | No |  |
| `productId` | query | string | No |  |

**Responses:**

- 200: Image added successfully
- 400: string — Bad Request
- 401: Product ID or url missing
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product does not exist

---

## `POST /api/Products/Assets/AddAsset/{productId}`

**Add asset to product from a binary stream. The request body should be the raw file content.**

Operation ID: `ProductsAddAsset`

Add new product asset from stream

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID |
| `fileName` | query | string | No | File name including extension (e.g. "image.png") |

**Request body:** `application/octet-stream`

**Responses:**

- 200: [`OmniumAsset`](../../schemas/OmniumAsset.md) — Asset added successfully
- 400: string — Unknown file type or upload failed
- 404: string — Product does not exist

---

## `GET /api/Products/Assets/GetAssets`

**Get product assets**

Operation ID: `ProductsGetAssets`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `assetIds` | query | List<string> | No |  |

**Responses:**

- 200: List<[`OmniumAsset`](../../schemas/OmniumAsset.md)> — Returning assets
- 401: Asset ids missing
- 404: string — Product does not exist

---

## `POST /api/Products/Assets/AddAssets/{skuId}`

**Add assets to product. Will overwrite existing assets if there are assets added with the same asset ID on the product.**

Operation ID: `ProductsAddAssets`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `skuId` | path | string | Yes | Product ID or SKU for the product, or a matching SKU for one on the product variants |
| `isAddedToVariant` | query | boolean | No | If set to true, the asset will be added to the variant with a matching |

**Request body:** List<[`OmniumAsset`](../../schemas/OmniumAsset.md)>

**Responses:**

- 200: Asset added successfully
- 401: Asset ids missing
- 404: string — Product does not exist

---

## `POST /api/Products/Assets/UpdateAssets`

**Update asset to product**

Operation ID: `ProductsUpdateAssets`

**Request body:** List<[`OmniumAsset`](../../schemas/OmniumAsset.md)>

**Responses:**

- 200: Asset updated successfully
- 401: Asset ids missing
- 404: string — Product does not exist

---

## `DELETE /api/Products/Assets/DeleteAssets`

**Delete assets from products**

Operation ID: `ProductsDeleteAssets`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `assetIds` | query | List<string> | No |  |

**Responses:**

- 200: Asset deleted successfully
- 400: Product ID or url missing
- 404: string — Product does not exist
