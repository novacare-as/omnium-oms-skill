# Products | Update

Source: https://api.omnium.no/documentation

> Update products.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PATCH /api/Products/{productId}`

**Patch product - update only values in request**

Operation ID: `ProductsPatchProduct`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID to patch |

**Request body:** [`OmniumProductPatch`](../../schemas/OmniumProductPatch.md) — Patch request

**Responses:**

- 200: [`OmniumProductUpdateResult`](../../schemas/OmniumProductUpdateResult.md) — Product updated successfully
- 400: string — Products are invalid
- 404: string — Not Found

---

## `DELETE /api/Products/{productId}`

**Deletes a product from the OMS**

Operation ID: `ProductsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes |  |

**Responses:**

- 204: Product deleted successfully
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product was not found

---

## `POST /api/Products`

**Create new product, update if exists**

Operation ID: `ProductsPost`

Sample request for adding a product with three variants, market prices and customer specific price, assets and a custom property.

    POST /api/products
    {
      "id": "ABC-123_no",
      "productId": "ABC-123",
      "parentId": "ABC",
      "language": "no",
      "name": "Omnium Super Stylish sweater /w logo",
      "color": "black",
      "shortDescription": "A black cotton sweater",
      "description": "A beautifully made sweater, with a stylish black color and the well known Omnium logo in white large print. 100% cotton. Designed in Oslo.",
      "brand": "Omnium Sweaters 'n Jeans",
      "season": "FW22",
      "unit": "pcs",
      "weight": 900,
      "created": "2022-11-11T00:00:00",
      "published": "2022-12-12T00:00:00",
      "discontinued": "2026-06-03T00:00:00",
      "isActive": true,
      "variants": [
        {
          "skuId": "000000000001",
          "isActive": true,
          "isSku": true,
          "size": "S"
        },
        {
          "skuId": "000000000002",
          "isActive": true,
          "isSku": true,
          "size": "M"
        },
        {
          "skuId": "000000000003",
          "isActive": true,
          "isSku": true,
          "size": "L"
        }
      ],
      "prices": [
        {
          "marketId": "NOR",
          "unitPrice": 500,
          "currencyCode": "NOK"
        },
        {
          "marketId": "NOR",
          "code": "000000000002",
          "validFrom": "2022-01-01T00:00:00",
          "validUntil": "2023-01-01T00:00:00",
          "unitPrice": 250,
          "currencyCode": "NOK",
          "customerGroup": "100",
          "discountAmount": 250,
          "discountPercent": 50,
          "originalUnitPrice": 500
        }
      ],
      "assets": [
        {
          "assetId": "78901",
          "sortOrder": 1,
          "url": "https://omnium-cdn-url-goes-here.com/id/305/200/300",
          "externalUrl": "https://i.picsum.photos/id/305/200/300.jpg?hmac=qqxVDT5GPIxyVNSo9Y_9u_qZSwXU4Cy94gp7VAMVRIw",
          "isMainImage": true
        },
        {
          "assetId": "12345",
          "sortOrder": 2,
          "url": "https://omnium-cdn-url-goes-here.com/id/544/200/300",
          "externalUrl": "https://i.picsum.photos/id/544/200/300.jpg?hmac=YL3M_fg_84Kqg0EQTvbltmjeGeQetARWPFA5YLn5hS0",
          "name": "Close-up Omnium Awesome Sweater",
          "description": "Close-up on the sweater, but this is just a random image though.",
          "altText": "Close-up"
        }
      ],
      "properties": [
        {
          "key": "CollarType",
          "value": "CrewNeck"
        },
        {
          "key": "IsAwesome",
          "value": "true",
          "valueType": "Boolean"
        }
      ]
    }

**Request body:** [`OmniumProduct`](../../schemas/OmniumProduct.md) — Product to add

**Responses:**

- 201: Product created successfully
- 400: List<string> — Product is invalid

---

## `PUT /api/Products`

**Put a product to Omnium, CAUTION: overwriting existing product**

Operation ID: `ProductsPutProduct`

**Request body:** [`OmniumProduct`](../../schemas/OmniumProduct.md) — Product to put

**Responses:**

- 204: Product put successfully
- 400: List<string> — Product is invalid
