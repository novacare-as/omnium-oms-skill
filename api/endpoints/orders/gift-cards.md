# Orders | Gift Cards

Source: https://api.omnium.no/documentation

> Gift cards

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/GiftCard/Search`

**Search gift cards**

Operation ID: `GiftCardSearch`

**Request body:** [`OmniumGiftCardSearchRequest`](../../schemas/OmniumGiftCardSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumGiftCardOmniumSearchResult`](../../schemas/OmniumGiftCardOmniumSearchResult.md) — Returns list of gift cards

---

## `POST /api/GiftCard/Scroll`

**Scroll gift cards by search**

Operation ID: `GiftCardScrollSearch`

Scrolling is not intended for real time user requests, but rather for processing large amounts of data. Only use scroll endpoints if you intend to fetch all items returned by the search request.
           Paging (take, page) is disabled for scroll searches.

**Request body:** [`OmniumGiftCardSearchRequest`](../../schemas/OmniumGiftCardSearchRequest.md)

**Responses:**

- 200: [`OmniumGiftCardOmniumSearchResult`](../../schemas/OmniumGiftCardOmniumSearchResult.md) — Search successful, returning gift cards
- 400: Search request invalid

---

## `GET /api/GiftCard/Scroll/{id}`

**Scroll gift card is used to get a large number of gift cards.**

Operation ID: `GiftCardScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumGiftCardOmniumResult`](../../schemas/OmniumGiftCardOmniumResult.md) — Success

---

## `GET /api/GiftCard/{code}`

**Get gift card by gift card code**

Operation ID: `GiftCardGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `code` | path | string | Yes |  |
| `marketId` | query | string | No |  |
| `giftCardPin` | query | string | No | Gift card PIN, if required, along with the code provided by the gift card provider. |

**Responses:**

- 200: [`OmniumGiftCard`](../../schemas/OmniumGiftCard.md) — Gift card found and returned
- 404: string — Gift card does not exist
