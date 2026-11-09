# Purchase Orders | Deliveries

Source: https://api.omnium.no/documentation

> Deliveries

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Deliveries/{deliveryId}`

**Get delivery**

Operation ID: `DeliveriesGetDelivery`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `deliveryId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumDelivery`](../../schemas/OmniumDelivery.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `PATCH /api/Deliveries/{deliveryId}`

**Patch delivery**

Operation ID: `DeliveriesPatch`

Patch delivery

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `deliveryId` | path | string | Yes | Delivery ID to patch |

**Request body:** [`OmniumDeliveryPatch`](../../schemas/OmniumDeliveryPatch.md) — Delivery patch

**Responses:**

- 200: [`OmniumDeliveryPatch`](../../schemas/OmniumDeliveryPatch.md) — Success
- 400: Bad Request

---

## `DELETE /api/Deliveries/{deliveryId}`

**Delete delivery**

Operation ID: `DeliveriesDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `deliveryId` | path | string | Yes |  |

**Responses:**

- 200: Delivery is deleted
- 400: Invalid request
- 404: Delivery not found

---

## `GET /api/Deliveries/{deliveryId}/PurchaseOrderLines`

**Get delivery purchase order lines**

Operation ID: `DeliveriesGetDeliveryPurchaseOrderLines`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `deliveryId` | path | string | Yes |  |

**Responses:**

- 200: List<[`OmniumPurchaseOrderLine`](../../schemas/OmniumPurchaseOrderLine.md)> — Success
- 400: Bad Request
- 404: Not Found

---

## `POST /api/Deliveries/Search`

**Search deliveries**

Operation ID: `DeliveriesSearch`

Search deliveries

**Request body:** [`OmniumDeliverySearchRequest`](../../schemas/OmniumDeliverySearchRequest.md) — Search request object for deliveries

**Responses:**

- 200: [`OmniumDeliveryOmniumSearchResult`](../../schemas/OmniumDeliveryOmniumSearchResult.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `POST /api/Deliveries/CreateDelivery/{purchaseOrderId}`

**Create delivery with purchase order lines. Use either SKU or Code to identify line items. Package SKU ID can be set but is not required.**

Operation ID: `DeliveriesCreateDelivery`

Create delivery from order lines. Use either SKU or Code to identify line items. Package SKU ID can be set but is not required.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes |  |
| `existingDeliveryId` | query | string | No | If set, the purchase order lines will be added to the existing delivery |
| `cancelRemainingLineItems` | query | boolean | No | If true, remaining line items on purchase order will be cancelled |
| `expectedDeliveryDate` | query | string (date-time) | No |  |
| `barcode` | query | string | No | Use this to add barcode to the shipment. Used for goodsreception |
| `newDeliveryId` | query | string | No | You can pick the Id of the new delivery. Do this at your own responsibility. |
| `preventDuplicateLineItems` | query | boolean | No | If true, the request will fail with BadRequest if duplicate line item IDs are found |

**Request body:** List<[`OmniumPurchaseOrderLineReference`](../../schemas/OmniumPurchaseOrderLineReference.md)>

**Responses:**

- 200: [`OmniumDelivery`](../../schemas/OmniumDelivery.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `PUT /api/Deliveries`

**Update delivery**

Operation ID: `DeliveriesUpdate`

Update delivery

**Request body:** [`OmniumDelivery`](../../schemas/OmniumDelivery.md) — Delivery

**Responses:**

- 200: [`OmniumDelivery`](../../schemas/OmniumDelivery.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `PUT /api/Deliveries/UpdateMany`

**Update many deliveries**

Operation ID: `DeliveriesUpdateMany`

Update many deliveries

**Request body:** List<[`OmniumDelivery`](../../schemas/OmniumDelivery.md)> — Deliveries

**Responses:**

- 200: [`OmniumDelivery`](../../schemas/OmniumDelivery.md) — Success
- 400: Bad Request

---

## `POST /api/Deliveries/{deliveryId}/AddPublicDeliveryComment`

**Add public delivery comment**

Operation ID: `DeliveriesAddPublicDeliveryComment`

Add public delivery comment

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `deliveryId` | path | string | Yes |  |

**Request body:** [`OmniumComment`](../../schemas/OmniumComment.md)

**Responses:**

- 200: List<[`OmniumComment`](../../schemas/OmniumComment.md)> — Success
- 400: Bad Request
- 404: Not Found

---

## `POST /api/Deliveries/{deliveryId}/AddInternalDeliveryComment`

**Add internal delivery comment**

Operation ID: `DeliveriesAddInternalDeliveryComment`

Add internal delivery comment

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `deliveryId` | path | string | Yes |  |

**Request body:** [`OmniumComment`](../../schemas/OmniumComment.md)

**Responses:**

- 200: List<[`OmniumComment`](../../schemas/OmniumComment.md)> — Success
- 400: Bad Request
- 404: Not Found

---

## `POST /api/Deliveries/ProcessGoodsReception`

**Process goods reception**

Operation ID: `DeliveriesProcessGoodsReception`

Process goods reception

**Request body:** List<[`OmniumDeliveryGoodsReceptionLine`](../../schemas/OmniumDeliveryGoodsReceptionLine.md)>

**Responses:**

- 200: Success
- 400: Bad Request

---

## `POST /api/Deliveries/{deliveryId}/ProcessGoodsReception`

**Process goods reception**

Operation ID: `DeliveriesProcessGoodsReceptionForDelivery`

Process goods reception

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `deliveryId` | path | string | Yes | Id of delivery containing the line items |

**Request body:** List<[`OmniumDeliveryGoodsReceptionLine`](../../schemas/OmniumDeliveryGoodsReceptionLine.md)>

**Responses:**

- 200: Success
- 400: Bad Request
