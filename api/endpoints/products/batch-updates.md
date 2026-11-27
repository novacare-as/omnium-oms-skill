# Products | Batch Updates

Source: https://api.omnium.no/documentation

> Batch updates for products.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PATCH /api/Products/PatchMany`

**Patch product - update only values in request**

Operation ID: `ProductsPatchMany`

A patch with SkuId and no Id is applied to every product that has this SKU, in all languages. When a variant has the SKU, the patch is applied to that variant and not to its product.
Set "Patch.Language" to apply it to one language only. Without "Patch.Language", values such as "Patch.Name" are written to all languages.
A patch with both Id and SkuId identifies the product by Id, and SkuId is a value to update.
A request cannot have both patches with Id and patches with SkuId and no Id. Such a request returns 400 and changes nothing.
A request can have at most 1000 patches with SkuId and no Id. A patch with SkuId and no Id cannot set ProductId, or set Id, SkuId, ProductId or Language in "Patch.FieldsToForceNull".

"ProductUpdateResultTotal.TotalCount" counts each product a SkuId patch was applied to.

Patch of "Properties" is flexible and can be customized in several ways:

- The "Patch.Properties" property contains the properties to be updated.

- The "Patch.PropertiesRemovalConditions" property specifies conditions for removing existing properties before applying updates.

- The "Patch.KeepExistingCustomProperties" property controls whether new properties are added to existing ones (default: "true") or if the entire list should be replaced (default: "false").

- The "Patch.DontOverwriteExistingPropertyValues" property prevents updating properties that already have values.

This is especially useful for list or multi-select properties. Set this to "true" along with 'ValueType: "List" or "DropDown"' in "Properties" to add to lists without replacing them.

See property summary under schema for more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `excludeProductExport` | query | boolean | No | If this is set to true, Omnium will not export products to external systems |

**Request body:** List<[`OmniumProductPatch`](../../schemas/OmniumProductPatch.md)> — Patch requests. Id or SkuId is required. If neither is set, the patch request will be skipped.

**Responses:**

- 200: [`OmniumProductsAndVariantsUpdateResult`](../../schemas/OmniumProductsAndVariantsUpdateResult.md) — Product updated successfully
- 400: string — Products are invalid

---

## `POST /api/Products/AddMany`

**Add multiple products to Omnium**

Operation ID: `ProductsAddMany`

**Request body:** List<[`OmniumProduct`](../../schemas/OmniumProduct.md)>

**Responses:**

- 204: Products added successfully
- 400: List<string> — Products are invalid

---

## `DELETE /api/Products/DeleteMany`

**Delete multiple products from Omnium**

Operation ID: `ProductsDeleteMany`

**Request body:** List<string> — The Ids of the products to delete (OmniumProduct.Id, e.g 12345_en)

**Responses:**

- 200: Success
- 204: Products deleted successfully
- 400: List<string> — Delete request not valid

---

## `POST /api/Products/UpdateMany`

**Update (add) many products, enriching existing products if they exist ExternalIds will be added or updated. PropertyItems will be overwritten.**

Operation ID: `ProductsUpdateMany`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `excludeProductExport` | query | boolean | No | True if products not should be exported to external systems (by integration, queues, webhooks, etc) |

**Request body:** List<[`OmniumProduct`](../../schemas/OmniumProduct.md)> — List of products to be updated

**Responses:**

- 200: Success
- 204: Products added successfully
- 400: List<string> — Products are invalid
