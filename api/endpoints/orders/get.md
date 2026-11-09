# Orders | Get

Source: https://api.omnium.no/documentation

> Endpoints for order getters.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Orders/{orderId}`

**Returns a single order**

Operation ID: `OrdersGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | ID of the order to return |

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 404: string — The order was not found

---

## `GET /api/Orders/{orderId}/{versionId}`

**Get specific order version**

Operation ID: `OrderGetVersion`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID |
| `versionId` | path | string | Yes | Version ID to fetch |

**Responses:**

- 200: [`OmniumOrderOmniumVersion`](../../schemas/OmniumOrderOmniumVersion.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `GET /api/Orders/GetOrders`

**Returns a list of orders, support paging**

Operation ID: `OrdersGetOrders`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | query | List<string> | No | ID for a store |
| `status` | query | List<string> | No | Filter on status: New, InTransit, InProgress, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped,Returned, PartiallyReturned |
| `changedSince` | query | string (date-time) | No | Filter on changed date(UTC) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/Orders/GetOrders/ByOrderType`

**Returns a list of orders filtered by order type, with support for paging.**

Operation ID: `OrdersGetOrdersByOrderType`

Sample request for getting orders with order type "Online" and status "New" from store "123" that has changed since 2022-01-01T00:00:00Z

           GET /api/orders/GetOrders/ByOrderType?storeId=123&status=New&orderTypes=Online&changedSince=2022-01-01T00:00:00Z&page=1&pageSize=20

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | query | List<string> | No | ID for a store |
| `status` | query | List<string> | No | Filter on order status. Possible values: New, InTransit, InProgress, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped, Returned, PartiallyReturned. |
| `orderTypes` | query | List<string> | No | Filter on order type. Possible values: Online, POS, etc. |
| `changedSince` | query | string (date-time) | No | Filter on changed date(UTC) |
| `pageSize` | query | integer (int32) | No | Maximum number of results per page. Minimum 1, maximum 100 (default is 20). |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/Orders/GetOrdersForPickUpPoint`

**Returns a list of orders, filtered by shipment pick-up point**

Operation ID: `OrdersGetOrdersForPickUpPoint`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | query | List<string> | No | ID for a store |
| `status` | query | List<string> | No | Filter on status: New, InTransit, InProgress, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped,Returned, PartiallyReturned |
| `changedSince` | query | string (date-time) | No | Filter on changed date(UTC) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/Orders/WithReservedInventory`

**Returns orders that currently reserve inventory for a SKU in a warehouse**

Operation ID: `OrdersGetOrdersWithReservedInventory`

Returns non-delivered orders (based on the delivered-status configuration per order type) that have an
order line with the given SKU shipping from the given warehouse. Orders in a status that is excluded from
reserved inventory in the order type are left out, as they hold no reservation. If the warehouse is a
virtual warehouse, orders are matched on the virtual warehouse and its first physical warehouse.

By default only orders that actively reserve warehouse stock are returned: orders created within the last
two years (the reserved-quantity calculation window) whose order line for the SKU is not fully cancelled,
not fully delivered, not reserved against a purchase order and not awaiting a purchase order. Partially
delivered orders are included, since they still reserve the undelivered remainder. Set includeAll=true to
also return the excluded orders, mirroring the "Show all" toggle in the reserved-inventory dialog.

Each order is enriched with the properties hasCancelledLines, isDelivered, isPartiallyDelivered,
hasReservationsOnPurchaseOrder and isAwaitingPurchaseOrder, computed for the given SKU. Sorted by created
date, descending.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `skuId` | query | string | No | SKU / variant code |
| `warehouseCode` | query | string | No | Warehouse code (physical or virtual) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |
| `includeAll` | query | boolean | No | Also return orders that no longer reserve warehouse stock (default false) |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/Orders/GetOrdersForCustomer`

**Returns a list of orders for a given customer. Search by id, phone or e-mail. Supports paging.**

Operation ID: `OrdersGetOrdersForCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | No | ID of the customer |
| `phone` | query | string | No |  |
| `email` | query | string | No |  |
| `storeId` | query | List<string> | No |  |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request
- 404: string — Orders were not found

---

## `GET /api/Orders/Customers/{customerId}/Orders`

**Returns a list of orders for a given customer. Supports paging.**

Operation ID: `OrdersGetOrdersByCustomerId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | path | string | Yes | ID of the customer |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request
- 404: string — Orders were not found

---

## `GET /api/Orders/GetOrderForCustomer`

**Get order for a single customer**

Operation ID: `OrdersGetOrderForCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | No | The id of the customer |
| `orderId` | query | string | No | The id of the order |

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 400: string — Bad Request
- 404: string — Order was not found
