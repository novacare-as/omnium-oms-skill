# Products | Prices

Source: https://api.omnium.no/documentation

> Fetch and update product prices.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Prices/Scroll/{id}`

**Scroll prices is used to get a large amount of prices.**

Operation ID: `PricesScroll`

NB! Only to be used when price index is enabled for tenant. Send email to support@omnium.no if you need more information.

            The scroll Id can be obtained from a standard search request that supports scrolling.
            Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumPriceOmniumResult`](../../schemas/OmniumPriceOmniumResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/Prices/Search`

**Search prices using available parameters in OmniumPriceSearchRequest.**

Operation ID: `PricesSearch`

NB! Only to be used when price index is enabled for tenant. Send email to support@omnium.no if you need more information.

             Sample request for a delta query:

                 POST /api/prices/search
                 {
                    "LastModified": "2019-11-21T17:32:28Z"
                 }

             Sample request for prices for a specific customer in one or more markets:

                 POST /api/prices/search
                 {
                    "CustomerId": "CU12345",
                    "MarketIds": ["NOR", "SWE"]
                 }

             Sample request for prices valid at a specific point in time (set ValidFrom and ValidUntil to the same timestamp):

                 POST /api/prices/search
                 {
                    "ProductCodes": ["SKU12345678"],
                    "ValidFrom": "2026-06-18T00:00:00Z",
                    "ValidUntil": "2026-06-18T00:00:00Z"
                 }

             Samples response if the number of prices exceeds 1000 (totalHits).

             Notice that the 'scrollId' property has been populated as totalHits exceeds 1000, meaning that you should use the scroll endpoint to fetch remaining prices

                 {
                   "totalHits": 41244,
                   "result": [
                     {
                       "marketId": "NOR",
                       "code": "SKU12345678",
                       "validFrom": "2020-01-01T00:00:00",
                       "validUntil": "2020-02-01T00:00:00",
                       "minQuantity": 0,
                       "unitPrice": 900,
                       "currencyCode": "NOK",
                       "customerId": "C-123",
                       "discountAmount": 100,
                       "discountPercent": 10,
                       "originalUnitPrice": 1000,
                       "recommendedRetailPrice": 2000
                     },
                     {
                       "marketId: "NOR",
                       ...
                     }
                   ],
                   "scrollId": "2f842421e06e4c60bb2c4f0d8b3ef60b"
                 }

             Please note that if the total amount is larger than 1000 (or scrollSize if specified) , the response will contain a Scroll ID which can be used with the Scroll endpoint to fetch all remaining items.

**Request body:** [`OmniumPriceSearchRequest`](../../schemas/OmniumPriceSearchRequest.md) — The PriceSearchRequest contains properties for filtering prices

**Responses:**

- 200: [`OmniumPriceOmniumResult`](../../schemas/OmniumPriceOmniumResult.md) — Search successful, returning prices
- 400: string — Search request invalid

---

## `PUT /api/Prices/AddMany`

**Put one or more prices to a product in Omnium. Will overwrite existing price if found, or add a new price if no match is found. The price is identified by checking CustomerId, CustomerGroup, VariantId, MarketId, MarketGroupId, CurrencyCode, SalesCode, PromotionId, StoreId, and PriceListId. If IgnoreDates is false, dates are also considered when fetching existing prices. By default (PricesMergeMode = Replace) a matched price is overwritten in full, so fields you do not send are reset to their defaults. Set PricesMergeMode to AddOrUpdate or UpdateOnly to only apply the fields you send and keep the existing values for the rest. See OmniumPriceUpdateRequest.PricesMergeMode for details. ProductId can be omitted when every price in the request carries the SKU in its Code property - Omnium then resolves the product from the SKU. This is intended for source systems that only know the SKU. SKUs that match no product (UnresolvedCodes) or more than one product (AmbiguousCodes) are skipped and returned in the response; the rest of the request is still applied.**

Operation ID: `PricesPutPrices`

Sample request using SKU only (no ProductId). Use this when the source system does not know Omnium's ProductId.
Each price is matched to its variant by "code", so sizes/colours can have different prices:

    PUT /api/prices/AddMany
    [
      {
        "prices": [
          { "code": "SKU-SHIRT-S", "unitPrice": 199, "currencyCode": "NOK", "marketId": "NOR", "validFrom": "2026-01-01T00:00:00Z" },
          { "code": "SKU-SHIRT-L", "unitPrice": 249, "currencyCode": "NOK", "marketId": "NOR", "validFrom": "2026-01-01T00:00:00Z" }
        ]
      }
    ]

The SKUs above may belong to different products - Omnium groups them per product on its own. Response:

    {
      "updatedProductCount": 1,
      "unresolvedCodes": null,
      "ambiguousCodes": null
    }

Sample request using ProductId (unchanged behaviour). "code" still selects the variant, and omitting it
puts the price on product level:

    PUT /api/prices/AddMany
    [
      {
        "productId": "P-12345",
        "ignoreDates": true,
        "prices": [
          { "code": "SKU-SHIRT-S", "unitPrice": 199, "currencyCode": "NOK", "marketId": "NOR" }
        ]
      }
    ]

Sample response when some SKUs could not be used. The prices for these SKUs were NOT applied, everything
else in the request was. "unresolvedCodes" means the SKU does not exist in Omnium; "ambiguousCodes" means it
exists under several products, so send ProductId for those:

    {
      "updatedProductCount": 42,
      "unresolvedCodes": ["SKU-DISCONTINUED"],
      "ambiguousCodes": ["SKU-DUPLICATED"]
    }

NB! Sending the SKU in "productId" does not work - the price would be silently ignored. Either leave
"productId" out entirely and set "code" on every price, or send the real ProductId.

**Request body:** List<[`OmniumPriceUpdateRequest`](../../schemas/OmniumPriceUpdateRequest.md)>

**Responses:**

- 200: [`OmniumPriceUpdateResult`](../../schemas/OmniumPriceUpdateResult.md) — Success
- 400: string — Bad Request

---

## `DELETE /api/Prices`

**Delete one or more prices on a product in Omnium. Will delete existing price if found. ProductId is optional: when it is omitted, every price must carry the SKU in Code and Omnium resolves the product from it. SKUs that match no product, more than one product, or no stored price are returned in the 200 response, together with the number of prices deleted; the rest of the request is still deleted. A request that sends ProductId on every item returns 204.**

Operation ID: `PricesDeletePrices`

**Request body:** List<[`OmniumPriceDeleteRequest`](../../schemas/OmniumPriceDeleteRequest.md)>

**Responses:**

- 200: [`OmniumPriceDeleteResult`](../../schemas/OmniumPriceDeleteResult.md) — Success
- 204: Success
- 400: string — Bad Request
