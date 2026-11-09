# Settings | Products

Source: https://api.omnium.no/documentation

> Product related tenant settings

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/settings/ProductSettings/ProductSettings`

**Returns all product settings.**

Operation ID: `ProductSettingsProductSettings`

**Responses:**

- 200: [`OmniumProductSettings`](../../schemas/OmniumProductSettings.md) — Success

---

## `PUT /api/settings/ProductSettings/ProductType`

**Add a product type, or update if a product type with the same name already exists.**

Operation ID: `ProductSettingsProductType`

**Request body:** [`OmniumProductTypeItem`](../../schemas/OmniumProductTypeItem.md)

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `DELETE /api/settings/ProductSettings/DeleteProductType/{name}`

**Delete the product type with the given name.**

Operation ID: `ProductSettingsDeleteProductType`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `name` | path | string | Yes |  |

**Responses:**

- 200: Success
- 404: Not Found
