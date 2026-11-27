# Purchase Orders

Source: https://api.omnium.no/documentation

> Purchase orders

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/PurchaseOrders/Query`

**🧪 [Preview] Query purchase orders. Returns full purchase order models with explicit control over filters, sorting, pagination and field selection.**

Operation ID: `PurchaseOrderQueryQuery` · **Preview**

> **🧪 Preview** — early access! This endpoint is fully functional, but its shape may still change while we finalize it.

Primary endpoint for fetching purchase orders: single lookups, filtered lists, and
paginated UI queries. Pagination is capped at offset (Take * Page) of 10,000 — past that,
use POST /api/PurchaseOrders/Query/Scroll.

All filter fields are documented on the request schema below.

### Default values are omitted

To keep responses small, a field is left out when it holds its default value: `false`, `0`,
`null`, the empty date `0001-01-01T00:00:00`, the empty id
`00000000-0000-0000-0000-000000000000`, or an enum's first value. **A missing field means
that value, not "unknown".** `""` and `[]` are real values and are always returned.

A field marked `nullable` in the schema has `null` as its default, so it is left out only
when it is null — a nullable boolean holding `false`, or a nullable number holding `0`, is
still returned.

### Examples

**1. Specific purchase orders by ID.**
```json
{
  "purchaseOrderIds": ["PO-123", "PO-456"]
}
```

**2. Filtered list with a tight payload** (recommended). Order lines are usually the bulk
of the document — exclude them when you only need header data.
```json
{
  "take": 50,
  "page": 1,
  "statuses": ["Sent"],
  "storeIds": ["store-1"],
  "sort": [{ "field": "created", "direction": "desc" }],
  "fields": { "exclude": ["purchaseOrderForm.lineItems"] }
}
```

**3. Only the fields you need.** The document `id` is always returned.
```json
{
  "supplierId": "SUPPLIER-1",
  "fields": { "include": ["purchaseOrderNumber", "status", "total"] }
}
```

**Request body:** [`OmniumPurchaseOrderQueryRequest`](../schemas/OmniumPurchaseOrderQueryRequest.md) — Query request with filters, pagination, and field selection

**Responses:**

- 200: [`OmniumPurchaseOrderOmniumQueryResult`](../schemas/OmniumPurchaseOrderOmniumQueryResult.md) — Query successful
- 400: string — Invalid request parameters

---

## `POST /api/PurchaseOrders/Query/Scroll`

**🧪 [Preview] Initiate a scroll session for retrieving large purchase order datasets.**

Operation ID: `PurchaseOrderQueryQueryScroll` · **Preview**

> **🧪 Preview** — early access! This endpoint is fully functional, but its shape may still change while we finalize it.

Bulk extraction endpoint — full syncs to other systems (ERP, BI), data exports. Also
required past the 10,000 offset cap on POST /Query.

Returns a `scrollId` and the first batch. Pass `scrollId` to
GET /api/PurchaseOrders/Query/Scroll/{scrollId} until it comes back null. Sessions expire
after 10 minutes of inactivity; per-tenant concurrency is capped.

Same filter set as POST /Query (see request schema) and identical response shape — field
selection applies to both the initial batch and continuations.

### Default values are omitted

To keep responses small, a field is left out when it holds its default value: `false`, `0`,
`null`, the empty date `0001-01-01T00:00:00`, the empty id
`00000000-0000-0000-0000-000000000000`, or an enum's first value. **A missing field means
that value, not "unknown".** `""` and `[]` are real values and are always returned.

A field marked `nullable` in the schema has `null` as its default, so it is left out only
when it is null — a nullable boolean holding `false`, or a nullable number holding `0`, is
still returned.

### Canonical example
Delta sync — every purchase order modified since the last run, without order lines:
```json
{
  "modifiedFrom": "2026-01-08T10:15:00Z",
  "scrollSize": 500,
  "fields": { "exclude": ["purchaseOrderForm.lineItems"] }
}
```

**Request body:** [`OmniumPurchaseOrderScrollQueryRequest`](../schemas/OmniumPurchaseOrderScrollQueryRequest.md) — Query request with filters and field selection

**Responses:**

- 200: [`OmniumPurchaseOrderOmniumScrollableQueryResult`](../schemas/OmniumPurchaseOrderOmniumScrollableQueryResult.md) — Scroll initiated successfully
- 400: string — Invalid request parameters

---

## `GET /api/PurchaseOrders/Query/Scroll/{scrollId}`

**🧪 [Preview] Continue an active scroll session and fetch the next batch of purchase orders.**

Operation ID: `PurchaseOrderQueryScrollContinuation` · **Preview**

> **🧪 Preview** — early access! This endpoint is fully functional, but its shape may still change while we finalize it.

Call repeatedly with the latest returned `scrollId` until it comes back null. Sessions
expire after 10 minutes of inactivity. See `POST /api/PurchaseOrders/Query/Scroll` for the
initiation endpoint and full request shape.

### Default values are omitted

To keep responses small, a field is left out when it holds its default value: `false`, `0`,
`null`, the empty date `0001-01-01T00:00:00`, the empty id
`00000000-0000-0000-0000-000000000000`, or an enum's first value. **A missing field means
that value, not "unknown".** `""` and `[]` are real values and are always returned.

A field marked `nullable` in the schema has `null` as its default, so it is left out only
when it is null — a nullable boolean holding `false`, or a nullable number holding `0`, is
still returned.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `scrollId` | path | string | Yes | The scroll ID from the previous response (initial Scroll call or a prior continuation) |

**Responses:**

- 200: [`OmniumPurchaseOrderOmniumScrollableQueryResult`](../schemas/OmniumPurchaseOrderOmniumScrollableQueryResult.md) — Scroll continuation successful

---

## `GET /api/PurchaseOrders/{purchaseOrderId}`

**Get purchase order**

Operation ID: `PurchaseOrdersGetPurchaseOrder`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/PurchaseOrders/{purchaseOrderId}`

**Update ATP values**

Operation ID: `PurchaseOrdersUpdateAtpValues`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes | Purchase order ID |

**Responses:**

- 200: ATP values updated
- 404: Purchase order not found
- 409: Conflict

---

## `PATCH /api/PurchaseOrders/{purchaseOrderId}`

**Patch purchase order**

Operation ID: `PurchaseOrdersPatch`

Patch purchase order

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes | Purchase order ID to patch |
| `updateAtpValues` | query | boolean | No | If true ATP providers will calculate new ATP values based on the purchase order |

**Request body:** [`OmniumPurchaseOrderPatch`](../schemas/OmniumPurchaseOrderPatch.md) — Purchase order patch

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: Conflict

---

## `DELETE /api/PurchaseOrders/{purchaseOrderId}`

**Delete purchase order**

Operation ID: `PurchaseOrdersDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes |  |

**Responses:**

- 200: Purchase order deleted
- 400: Invalid request
- 404: Purchase order not found
- 409: Conflict

---

## `POST /api/PurchaseOrders/Search`

**Search purchase orders**

Operation ID: `PurchaseOrdersSearch`

Search purchase orders

**Request body:** [`OmniumPurchaseOrderSearchRequest`](../schemas/OmniumPurchaseOrderSearchRequest.md) — Search request object for purchase orders

**Responses:**

- 200: [`OmniumPurchaseOrderOmniumSearchResult`](../schemas/OmniumPurchaseOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/PurchaseOrders/Scroll`

**Scroll purchaseOrders by search**

Operation ID: `PurchaseOrdersScrollSearch`

Scrolling is not intended for real time user requests, but rather for processing large amounts of data. Only use scroll endpoints if you intend to fetch all items returned by the search request.
            Paging (take, page) is disabled for scroll searches.
            Sample request for a delta query using modified date and filtering on an order type:

            POST /api/PurchaseOrders/Scroll
            {
               "ModifiedFrom": "2022-12-24T17:32:28Z"
            }

**Request body:** [`OmniumPurchaseOrderSearchRequest`](../schemas/OmniumPurchaseOrderSearchRequest.md)

**Responses:**

- 200: [`OmniumPurchaseOrderOmniumResult`](../schemas/OmniumPurchaseOrderOmniumResult.md) — Search successful, returning orders
- 400: Search request invalid

---

## `GET /api/PurchaseOrders/Scroll/{id}`

**Scroll purchaseOrders is used to get a large amount of customers.**

Operation ID: `PurchaseOrdersScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumPurchaseOrderOmniumResult`](../schemas/OmniumPurchaseOrderOmniumResult.md) — Success

---

## `POST /api/PurchaseOrders`

**Add a purchase order**

Operation ID: `PurchaseOrdersPost`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No |  |

**Request body:** [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Purchase order to add

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Success
- 400: string — Bad Request

---

## `PUT /api/PurchaseOrders`

**Update purchase order**

Operation ID: `PurchaseOrdersUpdate`

Update purchase order

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `updateAtpValues` | query | boolean | No | If true ATP providers will calculate new ATP values based on the purchase order |

**Request body:** [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Purchase order

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Success
- 400: string — Bad Request
- 409: Conflict

---

## `PUT /api/PurchaseOrders/UpdateMany`

**Update many purchase orders**

Operation ID: `PurchaseOrdersUpdateMany`

Update many purchase orders

**Request body:** List<[`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md)> — Purchase orders

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `POST /api/PurchaseOrders/{purchaseOrderId}/AddPublicPurchaseOrderComment`

**Add public purchase order comment**

Operation ID: `PurchaseOrdersAddPublicPurchaseOrderComment`

Add public purchase order comment

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes |  |

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md)

**Responses:**

- 200: List<[`OmniumComment`](../schemas/OmniumComment.md)> — Success
- 404: Not Found
- 409: Conflict

---

## `POST /api/PurchaseOrders/{purchaseOrderId}/AddInternalPurchaseOrderComment`

**Add internal purchase order comment**

Operation ID: `PurchaseOrdersAddInternalPurchaseOrderComment`

Add internal purchaser order comment

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes |  |

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md)

**Responses:**

- 200: List<[`OmniumComment`](../schemas/OmniumComment.md)> — Success
- 404: Not Found
- 409: Conflict

---

## `GET /api/PurchaseOrders/Extended/{purchaseOrderId}`

**Get extended purchase order**

Operation ID: `PurchaseOrdersGetExtendedPurchaseOrder`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumPurchaseOrderExtendedModel`](../schemas/OmniumPurchaseOrderExtendedModel.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/PurchaseOrders/{purchaseOrderId}/Merge`

**Merge a purchase order into another purchase order**

Operation ID: `PurchaseOrdersMerge`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes | Source purchase order ID (will be merged and deleted) |

**Request body:** [`OmniumMergePurchaseOrderRequest`](../schemas/OmniumMergePurchaseOrderRequest.md) — Merge request containing the destination purchase order ID

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: Conflict

---

## `GET /api/PurchaseOrders/{purchaseOrderLineItemId}/Reservations`

**Search sales order reservations by purchase order line item ID**

Operation ID: `PurchaseOrdersSearchReservations`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderLineItemId` | path | string | Yes | Purchase order line item ID |
| `page` | query | integer (int32) | No | Page number (default 1) |
| `pageSize` | query | integer (int32) | No | Page size (default 10, max 100) |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../schemas/OmniumOrderOmniumSearchResult.md) — Success

---

## `GET /api/PurchaseOrders/WithReservedInventory`

**Returns internal transfer purchase orders that reserve inventory for a SKU from a source warehouse**

Operation ID: `PurchaseOrdersGetPurchaseOrdersWithReservedInventory`

Internal transfers reserve stock on the source (supplier) warehouse until they are completed. Returns
purchase orders where the supplier warehouse matches the given warehouse (resolved to its physical
warehouse when virtual) and an order line matches the given SKU, excluding purchase orders in status
Completed, Deleted or OrderCanceled.

By default only transfers that actively reserve warehouse stock are returned: purchase orders created
within the last two years (the reserved-quantity calculation window) whose order line for the SKU is not
fully cancelled and not fully delivered. Partially delivered transfers are included, since they still
reserve the undelivered remainder. Set includeAll=true to also return the excluded purchase orders,
mirroring the "Show all" toggle in the reserved-inventory dialog.

Each purchase order is enriched with the properties hasCancelledLines, isDelivered and
isPartiallyDelivered, computed for the given SKU. Sorted by created date, descending.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `skuId` | query | string | No | SKU / variant code |
| `warehouseCode` | query | string | No | Source (supplier) warehouse code (physical or virtual) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |
| `includeAll` | query | boolean | No | Also return purchase orders that no longer reserve warehouse stock (default false) |

**Responses:**

- 200: [`OmniumPurchaseOrderOmniumSearchResult`](../schemas/OmniumPurchaseOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/PurchaseOrders/{purchaseOrderId}/OrderLines/Split`

**Split one or more purchase order lines**

Operation ID: `PurchaseOrdersSplitOrderLines`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes | Purchase order ID (Required) |

**Request body:** List<[`OmniumSplitPurchaseOrderLine`](../schemas/OmniumSplitPurchaseOrderLine.md)> — List of split requests specifying quantities and allocations for each line to split

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Purchase order lines split successfully
- 400: string — Invalid split request
- 404: string — Purchase order or line was not found
- 409: Conflict

---

## `POST /api/PurchaseOrders/{purchaseOrderId}/OrderLines/{lineItemId}/Cancel`

**Cancel purchase order line**

Operation ID: `PurchaseOrdersCancelOrderLine`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes | Purchase order ID (Required) |
| `lineItemId` | path | string | Yes | Purchase order line ID (Required) |

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Purchase order line cancelled successfully
- 400: Purchase order line could not be cancelled
- 404: string — Purchase order line was not found
- 409: Conflict

---

## `POST /api/PurchaseOrders/{purchaseOrderId}/OrderLines/Cancel`

**Cancel multiple purchase order lines**

Operation ID: `PurchaseOrdersCancelOrderLines`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `purchaseOrderId` | path | string | Yes | Purchase order ID (Required) |

**Request body:** [`OmniumCancelPurchaseOrderLinesRequest`](../schemas/OmniumCancelPurchaseOrderLinesRequest.md) — Line item IDs to cancel

**Responses:**

- 200: [`OmniumPurchaseOrder`](../schemas/OmniumPurchaseOrder.md) — Purchase order lines cancelled successfully
- 400: string — No line item IDs were provided
- 404: string — Purchase order was not found
- 409: Conflict
