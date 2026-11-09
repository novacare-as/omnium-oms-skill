# Ratings

Source: https://api.omnium.no/documentation

> Add or get ratings.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PUT /api/Ratings`

**Add or save a rating. If ID is null, it will be created.**

Operation ID: `RatingsPut`

**Request body:** [`OmniumRating`](../schemas/OmniumRating.md) — The rating object

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `DELETE /api/Ratings/{id}`

**Deletes a single rating from the OMS**

Operation ID: `RatingsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 204: Success
- 400: string — Bad Request

---

## `GET /api/Ratings/GetRatings`

**Get ratings for an Omnium object**

Operation ID: `RatingsGetRatings`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `type` | query | string | No | The object class to get ratings from (e.g. BusinessCustomer, Product, etc) |
| `objectId` | query | string | No | The object id to get ratings from (e.g. 12345) |
| `page` | query | integer (int32) | No | Page number |
| `take` | query | integer (int32) | No | Number of elements |
| `ignoreRequiresAttention` | query | boolean | No | Ignore ratings that needs attention by customer service (default: true) |
| `parentObjectId` | query | string | No | The parent object id to get ratings for. If both objectId and parentObjectd has value, "or" query will be used |
| `includeOnlyRatingsWithComments` | query | boolean | No | Return only ratings with comments |

**Request body:** List<string> — Filter ratings by markets

**Responses:**

- 200: [`OmniumRatingOmniumSearchResult`](../schemas/OmniumRatingOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/Ratings/Search`

**Search for ratings**

Operation ID: `RatingsSearchRatings`

**Request body:** [`OmniumSearchRatingRequest`](../schemas/OmniumSearchRatingRequest.md)

**Responses:**

- 200: [`OmniumRatingOmniumSearchResult`](../schemas/OmniumRatingOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/Ratings/ScrollSearch`

**Scroll large amounts of ratings**

Operation ID: `RatingsScrollSearchRatings`

The scroll Id obtained here should be passed to the scroll endpoint to continue the scroll operation (fetch the next page of results). Page/take not relevant default is 5000 ratings in each batch.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

**Request body:** [`OmniumSearchRatingRequest`](../schemas/OmniumSearchRatingRequest.md)

**Responses:**

- 200: [`OmniumRatingOmniumSearchResult`](../schemas/OmniumRatingOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/Ratings/Scroll/{id}`

**Scroll ratings is used to get a large amount of ratings.**

Operation ID: `RatingsScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumRatingOmniumResult`](../schemas/OmniumRatingOmniumResult.md) — Success

---

## `GET /api/Ratings/GetAverageRatings`

**Get average rating for an Omnium object**

Operation ID: `RatingsGetAverageRatings`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `type` | query | string | No | The object class to get ratings from (e.g. BusinessCustomer, Product, etc) |
| `objectId` | query | string | No | The object id to get ratings from (e.g. 12345) |
| `ignoreRequiresAttention` | query | boolean | No | Ignore ratings that needs attention by customer service |
| `parentObjectId` | query | string | No | The parent object id to get ratings for. If both objectId and parentObjectd has value, "or" query will be used |

**Request body:** List<string> — Filter by marketIds

**Responses:**

- 200: number (double) — Success
- 400: string — Bad Request
