# Products | Price List Items

Source: https://api.omnium.no/documentation

> Product price list items.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/PriceListItems/Search`

**Search price list items**

Operation ID: `PriceListItemsSearch`

**Request body:** [`OmniumPriceListItemSearchRequest`](../../schemas/OmniumPriceListItemSearchRequest.md)

**Responses:**

- 200: [`OmniumPriceListItemOmniumResult`](../../schemas/OmniumPriceListItemOmniumResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/PriceListItems/ScrollSearch`

**Scroll price list items using available parameters in OmniumPriceListItemSearchRequest.**

Operation ID: `PriceListItemsScrollSearch`

Notice that the 'scrollId' property has been populated as totalHits exceeds 1000, meaning that you should use the scroll endpoint to fetch remaining prices list items

    {
      "totalHits": 41244,
      "result": [
        {
          "priceListId": "...",
          "skuId": "SKU12345678",
          ...
        },
        {
          "marketId: "NOR",
          ...
        }
      ],
      "scrollId": "ifd42421406egc603b2c4f0d8b3ef60b"
    }

Please note that if the total amount is larger than 1000 (or scrollSize if specified) , the response will contain a Scroll ID which can be used with the Scroll endpoint to fetch all remaining items.

**Request body:** [`OmniumPriceListItemSearchRequest`](../../schemas/OmniumPriceListItemSearchRequest.md) — The PriceListItemSearchRequest contains properties for filtering prices

**Responses:**

- 200: [`OmniumPriceListItemOmniumResult`](../../schemas/OmniumPriceListItemOmniumResult.md) — Search successful, returning prices
- 400: string — Search request invalid

---

## `GET /api/PriceListItems/Scroll/{id}`

**Scroll price list items is used to get a large amount of prices.**

Operation ID: `PriceListItemsScroll`

The scroll ID can be obtained from a standard search request that supports scrolling.
Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumPriceListItemOmniumResult`](../../schemas/OmniumPriceListItemOmniumResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/PriceLists/AddPriceListItems`

**Add or update priceListItems. PriceListId is required on the items. If the priceList does not exist, items will be ignored.**

Operation ID: `PriceListsAddPriceListItems`

**Request body:** List<[`OmniumPriceListItem`](../../schemas/OmniumPriceListItem.md)>

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `PATCH /api/PriceLists/PatchPriceListItems`

**Partially update price list items. Only non-null fields will be updated. Derived fields (DiscountedPrice, Profit, etc.) are recalculated automatically. Items that don't exist will be auto-created. The Id can be provided directly or derived from PriceListId + SkuId/ProductId.**

Operation ID: `PriceListsPatchPriceListItems`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `activatePriceLists` | query | boolean | No | When true, affected price lists will be activated after patching (pushes prices to products). Default: false. |
| `enrichWithProductData` | query | boolean | No | When true, product data (e.g. product name, cost price) will be fetched and stored on the price list items in the background. This can be used even when no price fields are changed in the patches — for example, to enrich existing items with product data without modifying prices. Note: the returned Omnium.Public.PriceLists.OmniumPriceListItemPatchUpdateResult will not contain the enriched product data; it is only persisted on the price list items in the background. |
| `updateAllPriceLists` | query | boolean | No | When true, the base prices of the created and changed items - unit price, cost and store cost price - are also written to the same products in every other price list that has not expired and has the same currency, such as campaign price lists. Those lists keep the prices they discount to: the discount amount and percent are recalculated against the new base price, an item without a discount follows the new base price, and a discount is cleared when the new base price is at or below the discounted price. Items in the same request are left as they are sent. Runs in the background after the response; with activatePriceLists the changed items are published on the other price lists that are already active. Default: false. |

**Request body:** List<[`OmniumPriceListItemPatch`](../../schemas/OmniumPriceListItemPatch.md)> — List of partial updates. Each patch must include the Id or PriceListId + SkuId/ProductId.

**Responses:**

- 200: [`OmniumPriceListItemPatchUpdateResult`](../../schemas/OmniumPriceListItemPatchUpdateResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/PriceLists/{id}/priceListItems`

**Get price list items for a price list**

Operation ID: `PriceListsGetPriceListItems`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The id of the price list |
| `page` | query | integer (int32) | No | Page number |
| `take` | query | integer (int32) | No | Number of elements |

**Responses:**

- 200: List<[`OmniumPriceListItem`](../../schemas/OmniumPriceListItem.md)> — Success
- 400: string — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `DELETE /api/PriceLists/DeletePriceListItems`

**Delete price list items**

Operation ID: `PriceListsDeletePriceListItems`

**Request body:** List<string> — Ids of the price list items to delete

**Responses:**

- 200: Success
