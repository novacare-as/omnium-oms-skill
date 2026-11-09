# Promotions

Source: https://api.omnium.no/documentation

> Discount and promotion API

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Products/GetActivePromotions`

**Search for active promotion IDs**

Operation ID: `ProductsGetActivePromotions`

**Request body:** [`OmniumProductSearchRequest`](../schemas/OmniumProductSearchRequest.md)

**Responses:**

- 200: [`OmniumProductPromotionIdSearchResultOmniumSearchResult`](../schemas/OmniumProductPromotionIdSearchResultOmniumSearchResult.md) — Search successful, returning list of promotion ids
- 400: Search request invalid

---

## `GET /api/Promotions/{id}`

**Returns a single promotion**

Operation ID: `PromotionsGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the promotion to return |

**Responses:**

- 200: [`OmniumPromotion`](../schemas/OmniumPromotion.md) — Success
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — The promotion was not found

---

## `DELETE /api/Promotions/{id}`

**Delete a promotion**

Operation ID: `PromotionsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the promotion to delete |

**Responses:**

- 200: Success
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Not Found

---

## `POST /api/Promotions/Search`

**Search for promotions**

Operation ID: `PromotionsSearch`

Sample request for getting promotions that are valid during the time interval 2024-10-01 - 2024-10-07

    POST /api/Promotions/Search
    {
        {
          "activatedBeforeDate": "2024-10-01T00:00:00",
          "endedAfterDate": "2024-10-07T00:00:00",
          "marketIds": ["NOR"],
          "page":1,
          "take":10
        }
    }

Sample request for getting promotions that will become active during the time interval 2024-10-01 - 2024-10-07, for shipping and order amount promotion types

    POST /api/Promotions/Search
    {
        {
          "promotionTypes": ["ShippingPromotion", "OrderAmountPromotion"],
          "activeFrom": "2024-10-01T00:00:00",
          "activatedBeforeDate": "2024-10-07T00:00:00",
          "marketIds": ["NOR"],
          "page": 1,
          "take": 10
        }
    }

Sample request for fetching a known set of promotions in one call, e.g. the ids found in promotionIds on
products or in promotion events (max 250 ids per request; set take to at least the number of ids)

    POST /api/Promotions/Search
    {
        {
          "promotionIds": ["promo-1", "promo-2", "promo-3"],
          "page": 1,
          "take": 100
        }
    }

For bulk extraction of large result sets, use POST /api/Promotions/Search/Scroll instead.

**Request body:** [`OmniumPromotionSearchRequest`](../schemas/OmniumPromotionSearchRequest.md)

**Responses:**

- 200: [`OmniumPromotionOmniumSearchResult`](../schemas/OmniumPromotionOmniumSearchResult.md) — Success

---

## `POST /api/Promotions/Search/Scroll`

**Search for promotions and open a scroll for bulk extraction of large result sets.**

Operation ID: `PromotionsSearchScroll`

Returns the first batch of promotions together with a scrollId. Pass the scrollId to
GET /api/Promotions/Scroll/{id} to fetch each subsequent batch, and keep scrolling until the
response no longer contains a scrollId. ScrollSize controls the batch size (default 500, range 100-1000).
Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

    POST /api/Promotions/Search/Scroll
    {
        {
          "marketIds": ["NOR"],
          "scrollSize": 500
        }
    }

**Request body:** [`OmniumPromotionScrollSearchRequest`](../schemas/OmniumPromotionScrollSearchRequest.md)

**Responses:**

- 200: [`OmniumPromotionOmniumResult`](../schemas/OmniumPromotionOmniumResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/Promotions/Scroll/{id}`

**Scroll promotions is used to get a large amount of promotions.**

Operation ID: `PromotionsScroll`

The scroll Id can be obtained from a scroll search request.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request for the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumPromotionOmniumResult`](../schemas/OmniumPromotionOmniumResult.md) — Success

---

## `GET /api/Promotions/GenerateSingleUsagePromotionCoupons/{id}`

**Generate n number for promotion coupon codes. The codes will be only for single usage**

Operation ID: `PromotionsGenerateSingleUsagePromotionCoupons`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Promotion id |
| `numberOfCouponsToGenerate` | query | integer (int32) | Yes | Number of coupon codes to generate. Max is 1000 |
| `couponCharLength` | query | integer (int32) | No | Optional: Length (number of characters)  of the generate coupon code. Default and max length is 32 |

**Responses:**

- 200: List<string> — Success
- 400: string — Bad Request
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Not Found

---

## `POST /api/Promotions`

**Add a new promotion**

Operation ID: `PromotionsAdd`

**Request body:** [`OmniumPromotionRequest`](../schemas/OmniumPromotionRequest.md) — OmniumPromotion

**Responses:**

- 200: string — Success
- 400: string — Bad Request

---

## `PATCH /api/Promotions`

**Patch update a promotion**

Operation ID: `PromotionsPatch`

**Request body:** [`OmniumPromotionPatch`](../schemas/OmniumPromotionPatch.md) — OmniumPromotion

**Responses:**

- 200: [`OmniumPromotionPatchUpdateResult`](../schemas/OmniumPromotionPatchUpdateResult.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Promotions/{id}/Convert`

**Manually trigger conversion of a promotion's prices to regular prices with a configurable tag. This creates a new regular price list from the promotion's price list, activates it, and deactivates the promotion. Used for immediate conversion without waiting for the scheduled task.**

Operation ID: `PromotionsConvert`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the promotion to convert |

**Responses:**

- 200: Conversion result
- 400: string — Bad Request
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — The promotion was not found

---

## `GET /api/Promotions/GetPotentialDiscounts`

**Get potential-discount hints for a cart: promotions that would apply if more items were added, an order amount was met, a club member was attached, or a coupon was entered.**

Operation ID: `PromotionsGetPotentialDiscounts`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | query | string | No | ID of the cart to evaluate |

**Responses:**

- 200: List<[`OmniumPotentialDiscountHint`](../schemas/OmniumPotentialDiscountHint.md)> — Success
- 400: string — Bad Request
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — The cart was not found
