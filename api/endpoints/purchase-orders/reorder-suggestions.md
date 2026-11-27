# Purchase Orders | Reorder Suggestions

Source: https://api.omnium.no/documentation

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/ReorderSuggestions/{skuId}/{warehouseCode}`

**Returns the reorder suggestion for a SKU in a warehouse**

Operation ID: `ReorderSuggestionsGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `skuId` | path | string | Yes | Product SKU / Code / Variant / ID |
| `warehouseCode` | path | string | Yes | Warehouse Code / ID |

**Responses:**

- 200: [`OmniumReorderSuggestion`](../../schemas/OmniumReorderSuggestion.md) — Reorder suggestion found
- 404: string — No reorder suggestion exists for the SKU and warehouse

---

## `POST /api/ReorderSuggestions/Search`

**Search and filtering of reorder suggestions**

Operation ID: `ReorderSuggestionsSearch`

**Request body:** [`OmniumReorderSuggestionSearchRequest`](../../schemas/OmniumReorderSuggestionSearchRequest.md) — The search request contains properties for filtering reorder suggestions

**Responses:**

- 200: [`OmniumReorderSuggestionOmniumResult`](../../schemas/OmniumReorderSuggestionOmniumResult.md) — Search successful, returning reorder suggestions
- 400: string — Search request invalid

---

## `POST /api/ReorderSuggestions/ScrollSearch`

**Search reorder suggestions and start a scroll for fetching large result sets**

Operation ID: `ReorderSuggestionsScrollSearch`

Returns the first batch together with a scrollId. Pass the scrollId to the Scroll endpoint to fetch the
remaining batches. Every batch holds up to 1000 suggestions, and the scroll ends with the first batch that holds fewer.
Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

**Request body:** [`OmniumReorderSuggestionSearchRequest`](../../schemas/OmniumReorderSuggestionSearchRequest.md) — The search request contains properties for filtering reorder suggestions. Page and Take are ignored.

**Responses:**

- 200: [`OmniumReorderSuggestionOmniumResult`](../../schemas/OmniumReorderSuggestionOmniumResult.md) — Search successful, returning the first batch of reorder suggestions
- 400: string — Search request invalid

---

## `GET /api/ReorderSuggestions/Scroll/{id}`

**Fetch the next batch of reorder suggestions from a scroll**

Operation ID: `ReorderSuggestionsScroll`

The scroll id can be obtained from the ScrollSearch endpoint.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumReorderSuggestionOmniumResult`](../../schemas/OmniumReorderSuggestionOmniumResult.md) — Returning the next batch of reorder suggestions
- 404: string — Scroll does not exist or has expired

---

## `PATCH /api/ReorderSuggestions`

**Patch a reorder suggestion - update only the values present in the request**

Operation ID: `ReorderSuggestionsPatchReorderSuggestion`

The suggestion is identified by SkuId and WarehouseCode. Changes to fields involved in the calculation
trigger a recalculation, and the recalculated suggestion is returned in the result. Planning parameters
(MinQuantity, MaxQuantity, ReorderMinQuantity, Location) are persisted to the inventory item, so they
survive the next scheduled recalculation. Changes to the sales period (AverageDailyUsageFrom / To)
re-fetch sales data in the background - the result will not contain the recalculated suggestion.

**Request body:** [`OmniumReorderSuggestionPatch`](../../schemas/OmniumReorderSuggestionPatch.md) — Patch request containing the identifiers and fields to update

**Responses:**

- 200: [`OmniumReorderSuggestionUpdateResult`](../../schemas/OmniumReorderSuggestionUpdateResult.md) — Reorder suggestion patch processed (see result for details)
- 400: string — Patch request is invalid
- 404: string — Reorder suggestion not found

---

## `PATCH /api/ReorderSuggestions/PatchMany`

**Patch many reorder suggestions - update only the values present in each request**

Operation ID: `ReorderSuggestionsPatchMany`

Each suggestion is identified by SkuId and WarehouseCode. Changes to fields involved in the calculation
trigger a recalculation. Changes to the sales period (AverageDailyUsageFrom / To) re-fetch sales data in
the background. Max 1000 patches per request.

**Request body:** List<[`OmniumReorderSuggestionPatch`](../../schemas/OmniumReorderSuggestionPatch.md)> — List of patch requests

**Responses:**

- 200: [`OmniumReorderSuggestionUpdateResult`](../../schemas/OmniumReorderSuggestionUpdateResult.md) — Reorder suggestion patches processed (see result for details)
- 400: string — Patch request is invalid
