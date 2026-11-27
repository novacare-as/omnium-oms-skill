# Suppliers

Source: https://api.omnium.no/documentation

> Suppliers

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Suppliers/{supplierId}`

**Get supplier**

Operation ID: `SuppliersGetSupplier`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `supplierId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumSupplier`](../schemas/OmniumSupplier.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/Suppliers/{supplierId}`

**Delete supplier**

Operation ID: `SuppliersDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `supplierId` | path | string | Yes |  |

**Responses:**

- 200: Supplier deleted
- 400: Invalid request
- 404: Supplier not found

---

## `GET /api/Suppliers/{supplierId}/{versionId}`

**Get supplier version**

Operation ID: `SuppliersGetSupplierVersion`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `supplierId` | path | string | Yes |  |
| `versionId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumSupplier`](../schemas/OmniumSupplier.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Suppliers/Search`

**Search suppliers**

Operation ID: `SuppliersSearch`

Search suppliers

**Request body:** [`OmniumSupplierSearchRequest`](../schemas/OmniumSupplierSearchRequest.md) — Search request object for suppliers

**Responses:**

- 200: [`OmniumSupplierOmniumSearchResult`](../schemas/OmniumSupplierOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `PUT /api/Suppliers`

**Update supplier**

Operation ID: `SuppliersUpdate`

Update supplier

**Request body:** [`OmniumSupplier`](../schemas/OmniumSupplier.md) — Supplier

**Responses:**

- 200: [`OmniumSupplier`](../schemas/OmniumSupplier.md) — Success
- 400: string — Bad Request

---

## `PUT /api/Suppliers/UpdateMany`

**Update many suppliers**

Operation ID: `SuppliersUpdateMany`

Update many suppliers

**Request body:** List<[`OmniumSupplier`](../schemas/OmniumSupplier.md)> — Suppliers

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `PATCH /api/Suppliers/PatchMany`

**Patch many suppliers - update only the values in the request**

Operation ID: `SuppliersPatchMany`

Patch many suppliers

**Request body:** List<[`OmniumSupplierPatch`](../schemas/OmniumSupplierPatch.md)> — List of supplier patches. Each patch must include the supplier Id, and the Ids must be unique. Max 1000 suppliers per request. Only fields with a value are updated, the rest of the supplier is left unchanged. Lists (Contacts, Addresses, StoreIds, StoreGroupIds, Tags, AssortmentCodes) replace the existing list when set, and an empty list clears it. Properties and ExternalIds are merged with the existing values. Use FieldsToForceNull to set a nullable field to null.

**Responses:**

- 200: [`OmniumSupplierUpdateResult`](../schemas/OmniumSupplierUpdateResult.md) — Summary of how many suppliers were updated, unchanged, not found and failed
- 400: string — The request is empty, has more than 1000 suppliers, or has a patch without Id or with a duplicate Id
