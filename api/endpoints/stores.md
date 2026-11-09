# Stores

Source: https://api.omnium.no/documentation

> Warehouses, stores, and other sales channels.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Stores/{storeId}`

**Returns a single store**

Operation ID: `StoresGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | path | string | Yes | ID of the store to return |

**Responses:**

- 200: [`OmniumStore`](../schemas/OmniumStore.md) — Store found and returned
- 400: string — Store ID is invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Store does not exist

---

## `DELETE /api/Stores/{storeId}`

**Deletes a single store from the OMS**

Operation ID: `StoresDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | path | string | Yes |  |

**Responses:**

- 200: Store deleted
- 400: Store ID is invalid
- 404: Store not found

---

## `GET /api/Stores/{storeId}/TaxGroups`

**Returns the VAT rates a store sells under: the store's own VAT rates merged over the tenant VAT rates by code**

Operation ID: `StoresGetTaxGroups`

Returns the active rows. Without validOn, every date window of a code is returned; with validOn, only the rows
valid on that day. The list is empty when the tenant does not use tax groups. Account overrides are left out.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | path | string | Yes | ID of the store |
| `validOn` | query | string (date-time) | No | Optional day to return the VAT rates of |

**Responses:**

- 200: List<[`OmniumTaxGroup`](../schemas/OmniumTaxGroup.md)> — VAT rates returned
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Store does not exist

---

## `GET /api/Stores/GetByExternalId`

**Returns a list of stores**

Operation ID: `StoresGetByExternalId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | query | string | No | External ID of the store to return |

**Responses:**

- 200: [`OmniumStoreOmniumSearchResult`](../schemas/OmniumStoreOmniumSearchResult.md) — Store(s) with external ID found and returned
- 400: string — Store external ID is invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Store does not exist

---

## `GET /api/Stores`

**Get all stores**

Operation ID: `GetAllStores`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `filterPublicVisible` | query | boolean | No |  |

**Responses:**

- 200: [`OmniumStoreOmniumSearchResult`](../schemas/OmniumStoreOmniumSearchResult.md) — Returning all stores
- 404: No stores found

---

## `POST /api/Stores`

**Add a store to the OMS**

Operation ID: `StoresPost`

**Request body:** [`OmniumStore`](../schemas/OmniumStore.md) — Store object that is added to the OMS

**Responses:**

- 201: Store is added
- 400: string — Store ID is invalid

---

## `PUT /api/Stores`

**Create or update store in Omnium, overriding the fields of an existing store that this model carries. Settings that are only edited in Omnium, such as the chart of accounts, are kept.**

Operation ID: `StoresPut`

**Request body:** [`OmniumStore`](../schemas/OmniumStore.md) — Store object that needs to be added to the OMS

**Responses:**

- 200: Store is updated
- 400: Store ID is invalid

---

## `DELETE /api/Stores`

**Deletes a single store from the OMS**

Operation ID: `DeleteStoreByObject`

**Request body:** [`OmniumStore`](../schemas/OmniumStore.md)

**Responses:**

- 200: Store deleted
- 400: Store is invalid
- 404: Store not found

---

## `PATCH /api/Stores/PatchStore`

**Patch store - update only some values in request**

Operation ID: `StoresPatchStore`

**Request body:** [`OmniumStorePatch`](../schemas/OmniumStorePatch.md) — Store patch. Properties with value will be updated.

**Responses:**

- 200: [`OmniumStoreUpdateResult`](../schemas/OmniumStoreUpdateResult.md) — Store updated successfully
- 400: string — Store patch are invalid
- 404: string — Not Found

---

## `POST /api/Stores/Update`

**Update existing store, replacing all properties**

Operation ID: `StoresUpdate`

**Request body:** [`OmniumStore`](../schemas/OmniumStore.md) — The store object to be updated in the OMS

**Responses:**

- 200: [`OmniumStore`](../schemas/OmniumStore.md) — Store is updated, and returned
- 400: Store ID is invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Store does not exist

---

## `POST /api/Stores/Enrich`

**Adding or enrich an existing store to the OMS**

Operation ID: `StoresEnrich`

**Request body:** [`OmniumStore`](../schemas/OmniumStore.md) — Store object that needs to be enriched in the OMS

**Responses:**

- 200: Store is updated
- 201: Store is created
- 400: string — Store ID is invalid

---

## `POST /api/Stores/AddMany`

**Adds a range of stores to the OMS.**

Operation ID: `StoresAddMany`

**Request body:** List<[`OmniumStore`](../schemas/OmniumStore.md)> — A list of Store objects that needs to be added to the OMS

**Responses:**

- 201: Stores are added
- 400: string — Stores in request are invalid

---

## `POST /api/Stores/SearchStores`

**Search stores and warehouses**

Operation ID: `StoresSearchStores`

**Request body:** [`OmniumStoreSearchRequest`](../schemas/OmniumStoreSearchRequest.md) — The OmniumStoreSearchRequest contains properties for filtering stores and warehouses

**Responses:**

- 200: [`OmniumStoreOmniumResult`](../schemas/OmniumStoreOmniumResult.md) — Search successful, returning stores
- 400: string — Search request invalid
