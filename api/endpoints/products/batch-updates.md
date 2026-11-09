# Products | Batch Updates

Source: https://api.omnium.no/documentation

> Batch updates for products.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PATCH /api/Products/PatchMany`

**Patch product - update only values in request**

Operation ID: `ProductsPatchMany`

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

**Request body:** List<[`OmniumProductPatch`](../../schemas/OmniumProductPatch.md)> — Patch requests. Id is required. If not set, the patch request will be skipped.

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
