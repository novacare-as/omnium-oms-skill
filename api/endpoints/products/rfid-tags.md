# Products | RFID Tags

Source: https://api.omnium.no/documentation

> RFID EPC tags with loose references to products, deliveries and orders.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/EpcTags/{epc}`

**Returns a single EPC tag**

Operation ID: `EpcTagsGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `epc` | path | string | Yes | The EPC hex string (case and separators are ignored) |

**Responses:**

- 200: [`OmniumEpcTag`](../../schemas/OmniumEpcTag.md) — The EPC tag
- 400: string — The EPC is not a valid hex string
- 404: string — No tag stored for the EPC

---

## `DELETE /api/EpcTags/{epc}`

**Deletes a single EPC tag**

Operation ID: `EpcTagsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `epc` | path | string | Yes | The EPC hex string (case and separators are ignored) |

**Responses:**

- 200: EPC tag deleted
- 400: string — The EPC is not a valid hex string
- 404: string — No tag stored for the EPC

---

## `POST /api/EpcTags/Search`

**Searches EPC tags**

Operation ID: `EpcTagsSearch`

**Request body:** [`OmniumEpcTagSearchRequest`](../../schemas/OmniumEpcTagSearchRequest.md) — Search filters, paging and sorting. Filter by sku, GTIN, brand, status, store, order/supplier/purchase-order/delivery references, last-seen and modified dates.

**Responses:**

- 200: [`OmniumEpcTagOmniumResult`](../../schemas/OmniumEpcTagOmniumResult.md) — Result object with total hits and a list of EPC tags
- 400: string — Search request is missing

---

## `POST /api/EpcTags/Count`

**Counts EPC tags grouped by field**

Operation ID: `EpcTagsCount`

**Request body:** [`OmniumEpcTagCountRequest`](../../schemas/OmniumEpcTagCountRequest.md) — The tags to count and the fields to group by (Brand, Gtin, SkuId, Status, CompanyPrefix, Scheme, StoreId, LastSeenSource, BatchId, Label, VerificationStatus, ProductInfoState). Only counts are returned - use it for reconciliation tables and facets.

**Responses:**

- 200: [`OmniumEpcTagCountResult`](../../schemas/OmniumEpcTagCountResult.md) — Total hits and one group of buckets per requested field
- 400: string — Count request is missing

---

## `POST /api/EpcTags`

**Adds or updates a single EPC tag**

Operation ID: `EpcTagsPost`

**Request body:** [`OmniumEpcTag`](../../schemas/OmniumEpcTag.md) — The EPC tag to store. The EPC is the identity, so posting the same EPC again updates the stored tag. Missing GTIN/serial values are decoded from SGTIN EPCs, and missing skuId/brand/product name are resolved from the product matching the GTIN.

**Responses:**

- 201: EPC tag stored
- 400: string — The EPC tag is missing or has an invalid EPC

---

## `PATCH /api/EpcTags`

**Patch a single EPC tag**

Operation ID: `EpcTagsPatchEpcTag`

**Request body:** [`OmniumEpcTagPatch`](../../schemas/OmniumEpcTagPatch.md) — Patch request containing the EPC and fields to update. Only the values present in the request are updated.

**Responses:**

- 200: [`OmniumEpcTagUpdateResult`](../../schemas/OmniumEpcTagUpdateResult.md) — EPC tag patch processed (see result for details)
- 400: string — Patch request is invalid
- 404: string — EPC tag not found

---

## `POST /api/EpcTags/UpsertMany`

**Adds or updates a batch of EPC tags**

Operation ID: `EpcTagsUpsertMany`

**Request body:** List<[`OmniumEpcTag`](../../schemas/OmniumEpcTag.md)> — The EPC tags to store (e.g. supplier source tags). At least one, at most 10 000. The EPC is the identity, so existing tags are updated. Tags with invalid EPCs are skipped, and duplicates within the batch collapse to the last occurrence.

**Responses:**

- 201: EPC tags stored
- 400: string — The list is missing, too large, or contains no valid EPCs

---

## `POST /api/EpcTags/RefreshProductInfo`

**Re-resolves product info for stored EPC tags in the background**

Operation ID: `EpcTagsRefreshProductInfo`

**Request body:** [`OmniumEpcTagRefreshRequest`](../../schemas/OmniumEpcTagRefreshRequest.md) — Selection of tags to refresh. Send an empty object to sweep all tags missing product info. The refresh fills missing skuIds and re-syncs the denormalized brand/product name from the products currently in Omnium - use it after pushing source tags that arrived before their products, or after product/brand corrections. The request returns immediately.

**Responses:**

- 200: Refresh started
- 400: string — Refresh request is missing

---

## `PATCH /api/EpcTags/PatchMany`

**Patch many EPC tags**

Operation ID: `EpcTagsPatchMany`

**Request body:** List<[`OmniumEpcTagPatch`](../../schemas/OmniumEpcTagPatch.md)> — List of patch requests. Only the values present in each request are updated, and only tags that already exist are updated - new tags are not created.

**Responses:**

- 200: [`OmniumEpcTagUpdateResult`](../../schemas/OmniumEpcTagUpdateResult.md) — EPC tag patches processed (see result for details)
- 400: string — Patch request is invalid
