# Order API Reference

Source: https://docs.omnium.no/docs/Order/api-reference

> Complete endpoint reference for the Omnium Order API. Covers creating, retrieving, updating, searching, and deleting orders, as well as managing order lines, payments, and documents.

This is the full endpoint reference for the Omnium Order API. For conceptual guides on order models, pricing, discounts, and workflows, see [Order API Guide](order-api.md).

## Base URL

All Order API endpoints are available at:

```
https://api.omnium.no/api/Orders
```

Full Swagger reference: [Omnium Orders API Documentation](https://api.omnium.no/documentation/index.html#/Orders)

* * *

## Authentication

All endpoints require Bearer token authentication. Order endpoints use role-based access control:

| Role | Access |
| --- | --- |
| Order Read | Read-only operations (GET, search, scroll) |
| Order Admin | All operations including create, update, and delete |

See [Authentication](../GettingStartedWithAPI/getStarted.md) for details on obtaining tokens.

* * *

## Create orders

### Create order

Create a new order. The order ID must be unique across all markets.

**Endpoint:** `POST /api/Orders`

**Authorization:** Order Admin

**Request body:** [OmniumOrder](api-reference.md#order-model)

**Example request:**

```json
{
  "id": "ORD-2024-000001",
  "customerId": "customer@example.com",
  "billingCurrency": "NOK",
  "customerName": "Ola Nordmann",
  "customerPhone": "+4740000000",
  "customerEmail": "customer@example.com",
  "marketId": "NOR",
  "storeId": "WebShop",
  "status": "New",
  "orderType": "Online",
  "billingAddress": {
    "name": "Ola Nordmann",
    "line1": "Storgata 1",
    "city": "Oslo",
    "countryCode": "NO",
    "postalCode": "0159"
  },
  "orderForm": {
    "lineItems": [
      {
        "lineItemId": "1",
        "code": "SKU-001",
        "displayName": "Product A",
        "placedPrice": 499.00,
        "quantity": 2,
        "taxRate": 25
      }
    ],
    "shipments": [
      {
        "shipmentId": "1",
        "shippingMethodName": "Bring_SERVICEPAKKE",
        "warehouseCode": "MainWarehouse",
        "lineItems": [
          {
            "lineItemId": "1",
            "code": "SKU-001",
            "placedPrice": 499.00,
            "quantity": 2,
            "taxRate": 25
          }
        ],
        "address": {
          "name": "Ola Nordmann",
          "line1": "Storgata 1",
          "city": "Oslo",
          "countryCode": "NO",
          "postalCode": "0159"
        }
      }
    ],
    "payments": [
      {
        "amount": 998.00,
        "paymentMethodName": "Klarna",
        "transactionId": "klarna-tx-12345",
        "transactionType": "Authorization",
        "status": "Processed"
      }
    ]
  }
}
```

**Response:** `201 Created` with the created [OmniumOrder](api-reference.md#order-model)

* * *

### Create order with auto-generated order number

Create a new order and let Omnium generate the order number automatically based on the configured number sequence.

**Endpoint:** `PUT /api/Orders`

**Authorization:** Order Admin

**Request body:** [OmniumOrder](api-reference.md#order-model) (OrderNumber can be omitted)

**Response:** `201 Created` with the created [OmniumOrder](api-reference.md#order-model)

The auto-generated order number follows the number sequence pattern configured in your tenant settings. See [Number Options](../configuration/numberoptions.md) for configuration details.

* * *

### Create POS order

Create a point-of-sale order. The order type is automatically set to "Pos" and status to "Completed".

**Endpoint:** `PUT /api/Orders/PosOrders`

**Authorization:** Order Admin

**Required properties:** `MarketId`, `OrderNumber`, `StoreId`

**Request body:** [OmniumOrder](api-reference.md#order-model)

**Response:** `201 Created` with the created [OmniumOrder](api-reference.md#order-model)

* * *

### Add many orders (batch)

Add multiple new orders in a single request.

**Endpoint:** `POST /api/Orders/AddMany`

**Authorization:** Order Admin

**Request body:** `List<OmniumOrder>`

**Response:** `204 No Content`

* * *

### Import many orders (batch)

Import multiple orders, typically used for migrating orders from external systems.

**Endpoint:** `POST /api/Orders/ImportMany`

**Authorization:** Order Admin

**Request body:** `List<OmniumOrder>`

**Response:** `204 No Content`

* * *

## Retrieve orders

### Get order by ID

Retrieve a single order by its ID.

**Endpoint:** `GET /api/Orders/{id}`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | string | path | Yes | The order ID |

**Response:** `200 OK` with [OmniumOrder](api-reference.md#order-model), or `404 Not Found`

**Example request:**

```
GET /api/Orders/ORD-2024-000001
```

* * *

### List order versions

List the stored versions of an order, newest first, to follow its change history or find the version ID of a specific change. Omnium stores a new version every time the order is saved. Each item shows when the version was created and which user, API user or system process created it. To get the full order data of a version, use [Get order version](api-reference.md#get-order-version).

**Endpoint:** `GET /api/Orders/Versions/{id}`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `id` | string | path | Yes | \- | The order ID |
| `take` | int | query | No | 20 | Maximum number of versions on the page (1-100). Values outside this range are clamped to 1 or 100 |
| `continuationToken` | string | query | No | \- | The `continuationToken` from the previous page. Leave it out for the first page |

**Response:** `200 OK` with one page of versions, `400 Bad Request` when `continuationToken` is malformed, or `404 Not Found` when the order does not exist, has no versions, or is not available to your API user.

| Field | Type | Description |
| --- | --- | --- |
| `versions` | array | The versions on this page, newest first |
| `versions[].versionId` | string | The version ID. Use it with [Get order version](api-reference.md#get-order-version) |
| `versions[].id` | string | The order ID |
| `versions[].created` | datetime | When the version was created (UTC) |
| `versions[].createdBy` | string | Name of the user or API user that saved the order, or `System` for changes made by Omnium itself |
| `continuationToken` | string | Pass this value to get the next page. Left out of the response when there are no more versions |

**Example request:**

```
GET /api/Orders/Versions/ORD-2024-000001?take=100
```

**Example response:**

```json
{
  "versions": [
    {
      "versionId": "2516086862699999999",
      "id": "ORD-2024-000001",
      "created": "2026-11-02T10:15:30Z",
      "createdBy": "ERP Integration"
    },
    {
      "versionId": "2516086896479999999",
      "id": "ORD-2024-000001",
      "created": "2026-11-02T09:19:12Z",
      "createdBy": "System"
    }
  ],
  "continuationToken": "abc123..."
}
```

**Get all versions:** call the endpoint again with the `continuationToken` from the previous response, and repeat until the response has no `continuationToken`. Treat the token as an opaque value and URL-encode it when you add it to the query string.

```
GET /api/Orders/Versions/ORD-2024-000001?take=100&continuationToken=abc123...
```

A page can contain fewer versions than `take` and still return a `continuationToken`. Use a missing token, not a short page, to detect the last page.

* * *

### Get order version

Retrieve a specific historical version of an order. Find the version ID with [List order versions](api-reference.md#list-order-versions).

**Endpoint:** `GET /api/Orders/{id}/{versionId}`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | string | path | Yes | The order ID |
| `versionId` | string | path | Yes | The version ID |

**Response:** `200 OK` with a versioned object containing `versionId`, `createdBy`, and `created` metadata, with the order data under `value`. `404 Not Found` when the version does not exist or the order in that version belongs to a store your API user has no access to. Versions of a permanently deleted order can still be read.

* * *

### Get order by cart ID

Retrieve an order that was created from a specific cart.

**Endpoint:** `GET /api/Orders/carts/{cartId}`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `cartId` | string | path | Yes | The cart ID used to create the order |

**Response:** `200 OK` with [OmniumOrder](api-reference.md#order-model)

* * *

### Get order by secret key

Retrieve an order using a secure, randomly generated secret key. Useful for guest order tracking without requiring authentication.

**Endpoint:** `GET /api/Orders/secret/{secretKey}`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `secretKey` | string | path | Yes | The secret key associated with the order |

**Response:** `200 OK` with [OmniumOrder](api-reference.md#order-model), or `404 Not Found`

See [Order API Guide - Secret Key](order-api.md#get-order-by-secret-key) for detailed usage and security considerations.

* * *

### Check if order exists

Check whether an order exists without retrieving the full order data.

**Endpoint:** `HEAD /api/Orders/{id}/Exists`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | string | path | Yes | The order ID |

**Response:** `200 OK` if the order exists, `404 Not Found` otherwise

* * *

### Get multiple orders by IDs

Retrieve multiple orders in a single request. The response includes a list of found orders and a separate list of IDs that were not found.

**Endpoint:** `GET /api/Orders/GetOrders/ByIds`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `ids` | List<string> | query | Yes | List of order IDs to retrieve |

**Example request:**

```
GET /api/Orders/GetOrders/ByIds?ids=ORD-001&ids=ORD-002&ids=ORD-003
```

**Example response:**

```json
{
  "orders": [
    { "id": "ORD-001", "status": "New" },
    { "id": "ORD-002", "status": "Completed" }
  ],
  "missingIds": ["ORD-003"]
}
```

* * *

### Get orders (paginated list)

Get a paginated list of orders filtered by store and status.

**Endpoint:** `GET /api/Orders/GetOrders`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `storeId` | List<string> | query | Yes | \- | Store ID(s) to filter by |
| `status` | List<string> | query | No | \- | Status(es) to filter by |
| `changedSince` | DateTime | query | No | \- | Only return orders modified after this date |
| `page` | int | query | No | 1 | Page number |
| `pageSize` | int | query | No | 20 | Results per page (max 100) |

**Example request:**

```
GET /api/Orders/GetOrders?storeId=WebShop&status=New&status=InProgress&page=1&pageSize=50
```

**Response:** `200 OK` with paginated search result:

```json
{
  "result": [ /* array of OmniumOrder */ ],
  "totalHits": 142
}
```

* * *

### Get orders by order type

Get orders filtered by store, status, and order type.

**Endpoint:** `GET /api/Orders/GetOrders/ByOrderType`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `storeId` | List<string> | query | No | \- | Store ID(s) |
| `status` | List<string> | query | No | \- | Status filter |
| `orderTypes` | List<string> | query | No | \- | Order type filter (e.g., "Online", "Pos") |
| `changedSince` | DateTime | query | No | \- | Modified since filter |
| `page` | int | query | No | 1 | Page number |
| `pageSize` | int | query | No | 20 | Results per page (max 100) |

**Example request:**

```
GET /api/Orders/GetOrders/ByOrderType?storeId=WebShop&orderTypes=Online&orderTypes=ClickAndCollect&page=1
```

* * *

### Count orders

Get the count of orders matching the given filters.

**Endpoint:** `GET /api/Orders/GetOrders/Count`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `storeId` | List<string> | query | No | Store ID(s) |
| `status` | List<string> | query | No | Status filter |
| `changedSince` | DateTime | query | No | Modified since filter |

**Response:** `200 OK` with integer count

* * *

### Get orders for customer

Retrieve orders belonging to a specific customer.

**Endpoint:** `GET /api/Orders/Customers/{customerId}/Orders`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `customerId` | string | path | Yes | \- | Customer identifier |
| `page` | int | query | No | 1 | Page number |
| `pageSize` | int | query | No | 20 | Results per page |

**Example request:**

```
GET /api/Orders/Customers/CUST-001/Orders?page=1&pageSize=10
```

* * *

### Get orders with reserved inventory

Get the orders that reserve inventory for a SKU in a warehouse, for example to see which orders make up the reserved quantity on an inventory item.

**Endpoint:** `GET /api/Orders/WithReservedInventory`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `skuId` | string | query | Yes | \- | SKU (variant code) |
| `warehouseCode` | string | query | Yes | \- | Warehouse code. For a virtual warehouse, orders are matched on the virtual warehouse and its first physical warehouse |
| `page` | int | query | No | 1 | Page number |
| `pageSize` | int | query | No | 20 | Results per page (max 100) |
| `includeAll` | bool | query | No | false | Also return orders that no longer reserve warehouse stock |

By default, only orders that currently reserve stock are returned: orders created within the last two years whose order line for the SKU is not fully canceled, not fully delivered, not reserved against a purchase order, and not awaiting a purchase order. Partially delivered orders are included, as they still reserve the undelivered remainder. This filtering covers at most the 1,000 newest matching orders, so `totalHits` is at most 1,000 unless `includeAll` is `true`. Orders in a delivered status, or in a status excluded from reserved inventory (`IsExcludedFromReservedInventory` on the [order status](order-config.md#order-status-model)), are never returned.

Each returned order gets these entries in its `properties` list, with the value `true`, when they apply to its order line for the SKU: `hasCancelledLines`, `isDelivered`, `isPartiallyDelivered`, `hasReservationsOnPurchaseOrder`, and `isAwaitingPurchaseOrder`. Orders are sorted by creation date, newest first.

**Example request:**

```
GET /api/Orders/WithReservedInventory?skuId=10042-BLK-M&warehouseCode=WH-OSLO&pageSize=50
```

**Response:** `200 OK` with a paginated search result, in the same shape as [Get orders](api-reference.md#get-orders-paginated-list). `400 Bad Request` when `skuId` or `warehouseCode` is missing, `page` or `pageSize` is below 1, `pageSize` is above 100, or `page` × `pageSize` reaches 20,000.

* * *

## Search orders

### Search

Perform an advanced search with filtering, sorting, and faceted results.

**Endpoint:** `POST /api/Orders/Search`

**Request body:** [OmniumOrderSearchRequest](api-reference.md#search-request-model)

**Example request:**

```json
{
  "selectedStores": ["WebShop"],
  "selectedStatuses": ["New", "InProgress"],
  "createdFrom": "2024-01-01T00:00:00Z",
  "createdTo": "2024-12-31T23:59:59Z",
  "searchText": "Nordmann",
  "sortOrder": "CreatedDescending",
  "take": 20,
  "page": 1
}
```

**Response:** `200 OK` with paginated results and facets:

```json
{
  "result": [ /* array of OmniumOrder */ ],
  "totalHits": 85,
  "facets": [ /* array of facet results */ ]
}
```

The Search endpoint has a maximum result window of 10,000 documents (`take * page <= 10000`). For larger result sets, use the [Scroll](api-reference.md#scroll-search) endpoint.

* * *

### Search orders for customer

Search within a specific customer's orders.

**Endpoint:** `POST /api/Orders/Customers/{customerId}/Orders/Search`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `customerId` | string | path | Yes | Customer identifier |

**Request body:** [OmniumOrderSearchRequest](api-reference.md#search-request-model)

* * *

### Search by custom properties

Search for orders that have specific custom property values.

**Endpoint:** `POST /api/Orders/SearchByCustomProperties`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `key` | string | query | Yes | Property key to search |
| `value` | string | query | Yes | Property value to match |

**Example request:**

```
POST /api/Orders/SearchByCustomProperties?key=ErpReference&value=SAP-12345
```

* * *

### Scroll search

For retrieving large result sets beyond the 10,000 document limit, use scroll search. This creates a point-in-time snapshot and allows paging through all results.

**Endpoint:** `POST /api/Orders/Scroll`

**Request body:** [OmniumOrderSearchRequest](api-reference.md#search-request-model)

**Response:** `200 OK` with a scroll result containing a `scrollId` for subsequent pages:

```json
{
  "result": [ /* array of OmniumOrder */ ],
  "scrollId": "abc123..."
}
```

**Get next scroll page:**

**Endpoint:** `GET /api/Orders/Scroll/{scrollId}`

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `scrollId` | string | path | Yes | Scroll ID from previous response |

Continue calling the scroll endpoint until the response returns an empty result array.

For more details on scroll search patterns, see [Scrolling](../Integrations/scrolling.md).

* * *

## Update orders

### Update order (with workflow)

Update an order and optionally execute the workflow associated with the order's current status transition.

**Endpoint:** `POST /api/Orders/Update`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `runWorkflow` | bool | query | No | false | Whether to execute the workflow after update |

**Request body:** [OmniumOrder](api-reference.md#order-model)

**Response:** `200 OK` with workflow execution result:

```json
{
  "order": { /* updated OmniumOrder */ },
  "isAborted": false,
  "orderActionExecutionResults": [
    { "actionType": "CapturePayment", "actionStatus": "Success", "cancelWorkflow": false },
    { "actionType": "Notification", "actionStatus": "Success", "cancelWorkflow": false }
  ]
}
```

When `runWorkflow=true`, the workflow steps configured for the order's status transition will execute automatically. This is the recommended way to progress orders through their lifecycle (e.g., from "New" to "InProgress" to "Shipped").

* * *

### Overwrite order

Replace an existing order entirely. The full order object must be provided.

**Endpoint:** `PUT /api/Orders/Update`

**Authorization:** Order Admin

**Request body:** [OmniumOrder](api-reference.md#order-model)

**Response:** `200 OK` with workflow execution result

This replaces the entire order. Use [Patch Order](api-reference.md#patch-order) for partial updates to avoid overwriting data.

* * *

### Update many orders (batch)

Update multiple orders in a single request, optionally running workflows.

**Endpoint:** `POST /api/Orders/UpdateMany`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `runWorkflow` | bool | query | No | false | Whether to execute workflows |

**Request body:** `List<OmniumOrder>`

**Response:** `204 No Content`

* * *

### Patch order

Perform a partial update to an order. Only the properties included in the request body are updated; all other properties remain unchanged.

**Endpoint:** `PATCH /api/Orders/{orderId}/PatchOrder`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Request body:** [OmniumOrderPatch](api-reference.md#patch-model)

**Example request - update status and add a property:**

```json
{
  "id": "ORD-2024-000001",
  "status": "InProgress",
  "properties": [
    { "key": "ErpReference", "value": "SAP-12345" }
  ],
  "keepExistingCustomProperties": true
}
```

**Response:** `200 OK` with patch result:

```json
{
  "totalCount": 1,
  "updatedCount": 1,
  "unchangedCount": 0,
  "notFoundCount": 0,
  "errorCount": 0,
  "isModified": true
}
```

* * *

### Patch order lines

Perform partial updates to one or more order lines.

**Endpoint:** `PATCH /api/Orders/{orderId}/PatchUpdateOrderLines`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Request body:** List of order line patches. Each item must include `lineItemId` to identify the line.

**Example request:**

```json
[
  {
    "lineItemId": "1",
    "deliveredQuantity": 2,
    "serialNumber": "SN-12345"
  },
  {
    "lineItemId": "2",
    "canceledQuantity": 1,
    "cancelReason": "Out of stock"
  }
]
```

**Response:** `200 OK` with update result

* * *

### Patch line item IDs

Update the line item IDs on an order. Useful when mapping line items between systems.

**Endpoint:** `POST /api/Orders/PatchLineItemIds`

**Request body:** Object containing the order ID and a mapping of old to new line item IDs.

* * *

## Order line operations

### Add order line

Add a new order line to an existing order.

**Endpoint:** `POST /api/Orders/{orderId}/OrderLines`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |
| `shipmentId` | string | query | No | Shipment to add the line to |

**Request body:** [OmniumOrderLine](api-reference.md#order-line-model)

**Example request:**

```json
{
  "lineItemId": "3",
  "code": "SKU-NEW",
  "displayName": "Additional Product",
  "placedPrice": 299.00,
  "quantity": 1,
  "taxRate": 25
}
```

**Response:** `200 OK` with updated [OmniumOrder](api-reference.md#order-model)

* * *

### Add multiple order lines

Add multiple order lines in a single request.

**Endpoint:** `POST /api/Orders/{orderId}/AddManyOrderLines`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |
| `shipmentId` | string | query | No | Shipment to add lines to |

**Request body:** `List<OmniumOrderLine>`

**Response:** `200 OK` with updated [OmniumOrder](api-reference.md#order-model)

* * *

### Cancel order line

Cancel a single order line on an order.

**Endpoint:** `POST /api/Orders/{orderId}/OrderLines/{lineItemId}/Cancel`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | \- | The order ID |
| `lineItemId` | string | path | Yes | \- | The line item ID to cancel |
| `sendNotifications` | bool | query | No | false | Whether to send cancellation notifications |

**Response:** `200 OK` with updated [OmniumOrder](api-reference.md#order-model)

* * *

### Cancel order lines (batch)

Cancel order lines across multiple orders in a single request.

**Endpoint:** `POST /api/Orders/OrderLines/Cancel`

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `sendNotifications` | bool | query | No | false | Whether to send notifications |

**Request body:** List of order line references (max 100 orders):

```json
[
  { "orderId": "ORD-001", "lineItemId": "1" },
  { "orderId": "ORD-001", "lineItemId": "2" },
  { "orderId": "ORD-002", "lineItemId": "1" }
]
```

**Response:** `200 OK` with count of cancelled lines

* * *

### Add/update order line properties

Add or update custom properties on specific order lines.

**Endpoint:** `PUT /api/Orders/{orderId}/AddOrderLineProperties`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Request body:** List of line item property patches:

```json
[
  {
    "lineItemId": "1",
    "properties": [
      { "key": "CustomField", "value": "CustomValue" }
    ]
  }
]
```

**Response:** `200 OK` with updated [OmniumOrder](api-reference.md#order-model)

* * *

## Payment operations

### Add payments

Add one or more payment transactions to an existing order.

**Endpoint:** `POST /api/Orders/{orderId}/AddPayments`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Request body:** `List<OmniumPayment>`

**Example request:**

```json
[
  {
    "amount": 998.00,
    "paymentMethodName": "Klarna",
    "transactionId": "klarna-tx-67890",
    "transactionType": "Authorization",
    "status": "Processed"
  }
]
```

**Response:** `200 OK` with updated [OmniumOrder](api-reference.md#order-model)

* * *

### Replace all payments

Replace the entire payment list on an order.

**Endpoint:** `PUT /api/Orders/{orderId}/PutPayments`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Request body:** `List<OmniumPayment>`

**Response:** `200 OK` with updated [OmniumOrder](api-reference.md#order-model)

This replaces ALL payments on the order. Use `POST AddPayments` to add new payments without removing existing ones.

* * *

### Get payment options

Get available payment methods for an order based on market configuration.

**Endpoint:** `GET /api/Orders/{orderId}/GetPaymentOptions`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Response:** `200 OK` with list of available payment options:

```json
[
  {
    "paymentMethodName": "Klarna",
    "displayName": "Klarna - Pay later"
  },
  {
    "paymentMethodName": "Vipps",
    "displayName": "Vipps"
  }
]
```

* * *

## Comments

### Add comment

Add a comment to an order, optionally sending it as an SMS and/or email notification.

**Endpoint:** `POST /api/Orders/AddComment`

**Request body:**

```json
{
  "orderId": "ORD-2024-000001",
  "commentText": "Your order has been prepared for shipping.",
  "sendSms": false,
  "sendEmail": true
}
```

**Response:** `200 OK`

* * *

## Documents

### Get order as PDF

Generate a PDF document for an order using a configured template.

**Endpoint:** `GET /api/Orders/GetOrderAsPdf/{orderId}`

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |
| `templateFile` | string | query | Yes | Name of the PDF template file |
| `shipmentId` | string | query | No | Generate PDF for a specific shipment only |

**Response:** `200 OK` with `application/pdf` content, or `429 Too Many Requests` if rate limited

* * *

### Export orders

Export orders to a file based on search criteria.

**Endpoint:** `POST /api/Orders/ExportOrders`

**Request body:** Export request containing search filters and export format configuration.

* * *

## Delete order

Delete an order. By default, orders are soft-deleted (marked as deleted but retained). Use the `deletePermanently` flag for permanent removal.

**Endpoint:** `DELETE /api/Orders/{orderId}`

**Authorization:** Order Admin

**Parameters:**

| Parameter | Type | Location | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | \- | The order ID |
| `deletePermanently` | bool | query | No | false | If true, permanently removes the order |

**Response:** `200 OK`

Permanently deleted orders cannot be recovered. Soft-deleted orders can be restored.

* * *

## Models

### Order model

The main order object used for creating, updating, and retrieving orders.

#### Core properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| Id | string | Yes | Unique order identifier across all markets |
| OrderNumber | string | No | User-friendly order number (auto-generated if omitted on PUT) |
| CustomerId | string | No | Customer identifier |
| CustomerNumber | string | No | User-friendly customer number |
| CustomerName | string | No | Customer full name |
| CustomerPhone | string | No | Customer phone with prefix (e.g., "+4740000000") |
| CustomerEmail | string | No | Customer email address |
| CustomerType | string | No | "B2B" or "B2C" |
| MarketId | string | No (Yes for POS orders) | Market identifier (e.g., "NOR", "SWE", "US"). If omitted on non-POS create, the default market is used and a warning is logged |
| StoreId | string | Yes | Store identifier for the selling store |
| BillingCurrency | string | No | Currency code (e.g., "NOK", "SEK", "EUR") |
| Status | string | Yes | Order status (e.g., "New", "InProgress", "Shipped", "Completed", "Cancelled") |
| OrderType | string | Yes | Order type matching a configured workflow (e.g., "Online", "Pos", "ClickAndCollect") |
| OrderOrigin | string | No | Source of the order: "OMS", "ERP", "WEB", or "POS" |
| SalesChannel | string | No | Sales channel identifier |

#### Address and contact

| Property | Type | Description |
| --- | --- | --- |
| BillingAddress | [OmniumOrderAddress](api-reference.md#address-model) | Billing address |
| ContactPerson | OmniumContactPerson | Contact person details |

#### Order content

| Property | Type | Description |
| --- | --- | --- |
| OrderForm | [OmniumOrderForm](api-reference.md#order-form-model) | Contains line items, shipments, payments, and discounts |
| ReturnOrderForms | List<OmniumReturnOrderForm> | Return order forms (max 250) |
| Groups | List<OmniumOrderGroup> | Order line groups |

#### Dates

| Property | Type | Description |
| --- | --- | --- |
| Created | DateTime | Order creation date |
| Modified | DateTime | Last modified date (calculated) |
| Received | DateTime? | Date order was received |
| Completed | DateTime? | Completion date (calculated) |
| FollowUpDate | DateTime? | Follow-up reminder date |
| RequestedDeliveryDate | DateTime? | Customer's requested delivery date |
| ReadyForPickup | DateTime? | Date order became ready for pickup (calculated) |
| CustomerPickupDeadline | DateTime? | Pickup deadline (calculated) |

#### Totals (calculated)

| Property | Type | Description |
| --- | --- | --- |
| RemainingPayment | decimal | Outstanding payment amount |
| LineItemsCost | decimal | Total cost of all line items |
| NetTotal | decimal | OrderForm total minus return totals |
| NetTotalExclTax | decimal | Net total excluding tax |

#### Sales

| Property | Type | Description |
| --- | --- | --- |
| SalesPersonId | string | Sales person identifier |
| SalesPersonName | string | Sales person name |
| CustomerClubMemberId | string | Loyalty club membership ID |
| CustomerReference | string | Customer's reference number |
| CustomerRequisition | string | Customer's requisition number |
| PaymentTermsNet | int? | Invoice due date in days |
| InvoiceComment | string | Comment to appear on invoice |

#### Metadata

| Property | Type | Description |
| --- | --- | --- |
| OrderNotes | List<OmniumComment> | Internal notes (max 250) |
| PublicOrderNotes | List<OmniumComment> | Customer-visible notes (max 250) |
| Properties | List<OmniumPropertyItem> | Custom key-value properties (max 250) |
| ExternalIds | List<OmniumExternalId> | External system references (max 250) |
| Tags | List<string> | Tags for categorization (max 250) |
| Assets | List<OmniumAsset> | Attached documents, media, files (max 250) |
| Errors | List<OmniumEntityError> | Processing errors (max 250) |
| RelatedOrders | List<string> | Related order IDs (max 250) |
| ReplacementOrderIds | List<string> | Replacement order IDs (max 250) |
| ProjectIds | List<string> | Associated project IDs (max 250) |
| SubscriptionId | string | Subscription identifier |
| Session | string | Web session reference |
| SecretKey | string | Secure key for guest order lookup |

#### Flags

| Property | Type | Description |
| --- | --- | --- |
| IsReadOnly | bool | If true, order cannot be modified |
| IsNotificationsDisabled | bool | If true, notifications are suppressed |
| IsNewCustomer | bool? | Whether the customer is new (calculated) |

#### Read-only

| Property | Type | Description |
| --- | --- | --- |
| VersionId | string | Current version identifier |
| ModifiedBy | string | User/system that last modified the order |

* * *

### Order form model

The order form contains the commercial content of the order.

| Property | Type | Description |
| --- | --- | --- |
| LineItems | List<[OmniumOrderLine](api-reference.md#order-line-model)\> | Products in the order (max 1000) |
| Shipments | List<OmniumShipment> | Shipping selections (max 250) |
| Payments | List<[OmniumPayment](api-reference.md#payment-model)\> | Payment transactions (max 250) |
| Discounts | List<OmniumDiscount> | Applied discounts (max 250) |
| CartId | string | Source cart ID if created from cart |
| CartName | string | Cart/offer name |
| PurchaseOrderId | string | Purchase order reference |
| CouponCodes | List<string> | Applied coupon codes (max 250) |
| Properties | List<OmniumPropertyItem> | Custom properties (max 250) |
| IsPriority | bool? | Whether the order is marked as priority |
| FullRefund | bool | Whether the order is fully refunded |

#### Calculated totals

| Property | Type | Description |
| --- | --- | --- |
| SubTotal | decimal | Sum of line item extended prices |
| SubTotalExclTax | decimal | Subtotal excluding tax |
| Total | decimal | Final order total |
| TotalExclTax | decimal | Total excluding tax |
| TaxTotal | decimal | Total tax amount |
| DiscountAmount | decimal | Total discount amount |
| ShippingSubTotal | decimal | Shipping cost before discounts |
| ShippingDiscountTotal | decimal | Total shipping discounts |
| ShippingTotal | decimal | Net shipping cost |
| HandlingTotal | decimal | Handling fees |
| AuthorizedPaymentTotal | decimal | Total authorized payment amount |
| CapturedPaymentTotal | decimal | Total captured payment amount |
| CreditPaymentTotal | decimal | Total credited/refunded amount |

* * *

### Order line model

Represents a product line item in the order.

#### Identification

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| LineItemId | string | Yes | Unique line item identifier |
| Code | string | No | Product SKU / article number |
| ProductId | string | No | Product identifier |
| Gtins | List<string> | No | GTIN/barcode numbers |
| ExternalIds | List<OmniumExternalId> | No | External system references (max 250) |

#### Product details

| Property | Type | Description |
| --- | --- | --- |
| DisplayName | string | Product name |
| AlternativeProductName | string | Alternative display name |
| Brand | string | Product brand |
| Size | string | Size variant |
| Color | string | Color variant |
| ProductType | string | Product type/category |
| ImageUrl | string | Product image URL |
| WebSiteProductUrl | string | URL to product on website |
| SerialNumber | string | Product serial number |

#### Pricing

| Property | Type | Description |
| --- | --- | --- |
| PlacedPrice | decimal | Unit price (before discounts, not multiplied by quantity) |
| PlacedPriceExclTax | decimal | Unit price excluding tax (calculated) |
| DiscountedPrice | decimal | Total after line-level discounts (calculated) |
| DiscountedPriceExclTax | decimal | Discounted price excluding tax (calculated) |
| ExtendedPrice | decimal | Final line total including all discounts (calculated) |
| ExtendedPriceExclTax | decimal | Extended price excluding tax (calculated) |
| SuggestedRetailPrice | decimal | Recommended retail price (informational) |
| OrderDiscountAmount | decimal | Order-level discount apportioned to this line (calculated) |
| CreditedAmount | decimal | Amount credited/refunded (calculated) |
| TaxRate | decimal? | Tax rate percentage (e.g., 25.00) |
| TaxTotal | decimal | Tax amount (calculated) |
| Cost | decimal | Product cost per unit |
| CostTotal | decimal | Total cost (calculated) |

#### Quantities

| Property | Type | Description |
| --- | --- | --- |
| Quantity | decimal | Ordered quantity |
| DeliveredQuantity | decimal | Quantity delivered |
| ReturnQuantity | decimal | Quantity returned |
| CanceledQuantity | decimal | Quantity cancelled |
| ReadyForPickupQuantity | decimal? | Quantity ready for pickup |
| ReservedInventoryQuantity | decimal | Quantity reserved in inventory (calculated) |

#### Units of measure

| Property | Type | Description |
| --- | --- | --- |
| Unit | string | Base unit (e.g., "Pcs", "Meter", "Litre") |
| SelectedUnit | string | Customer-selected unit |
| SelectedUnitConversionFactor | decimal? | Conversion factor to base unit |
| SelectedUnitQuantity | decimal? | Quantity in selected unit |

#### Cancellation

| Property | Type | Description |
| --- | --- | --- |
| CanceledQuantity | decimal | Quantity cancelled |
| CanceledDate | DateTime? | Cancellation date |
| CancelReason | string | Reason for cancellation |
| CancelComment | string | Additional cancellation details |

#### Return

| Property | Type | Description |
| --- | --- | --- |
| ReturnQuantity | decimal | Quantity returned |
| ReturnReason | string | Reason for return |
| ReturnDate | DateTime? | Return date |
| ReturnType | string | Type of return |

#### Replacement

| Property | Type | Description |
| --- | --- | --- |
| ReplacedQuantity | decimal? | Quantity replaced |
| ReplacedDate | DateTime? | Replacement date |
| ReplacementType | string | Type of replacement |
| ReplacementReason | string | Reason for replacement |

#### Supplier

| Property | Type | Description |
| --- | --- | --- |
| SupplierId | string | Supplier identifier |
| SupplierSkuId | string | Supplier's SKU |
| SupplierName | string | Supplier name |

#### Dates

| Property | Type | Description |
| --- | --- | --- |
| ExpectedDeliveryDate | DateTime? | Expected delivery date |
| RequestedDeliveryDate | DateTime? | Requested delivery date |
| ReadyForPickupDate | DateTime? | Ready for pickup date |
| DeliveredDate | DateTime? | Actual delivery date |
| CustomerPickupDeadline | DateTime? | Pickup deadline |

#### Flags

| Property | Type | Description |
| --- | --- | --- |
| IsGift | bool | Line is a gift |
| IsBackorder | bool | Line is on backorder |
| IsBundle | bool | Line is a bundle product |
| IsPackageProduct | bool | Line is a package product |
| IsVirtualProduct | bool | Line is a virtual/digital product |
| IsConfigurableProduct | bool | Line is configurable |
| IsReadOnly | bool | Line cannot be modified |
| UpdateStock | bool | Whether to update inventory |
| CreatePurchaseOrder | bool? | Whether to create a purchase order |

#### Discounts and promotions

| Property | Type | Description |
| --- | --- | --- |
| Discounted | decimal | Line-level discount amount |
| DiscountedExclTax | decimal | Line-level discount excluding tax |
| OrderLineDiscounts | List<OmniumOrderLineDiscount> | Detailed discount breakdown (max 250) |
| OrderLineBonusPoints | OmniumOrderLineBonusPoints? | Bonus points for this line |
| CampaignId | string | Associated campaign |
| IsExcludedFromPromotions | bool? | Whether excluded from automatic promotions |
| DiscountReasonCode | string? | Reason code for manual discounts |

#### Other

| Property | Type | Description |
| --- | --- | --- |
| Comment | string | Line item comment |
| Properties | List<OmniumPropertyItem> | Custom properties (max 250) |
| Components | List<OmniumProductComponent> | Bundle/package components (max 250) |
| GroupId | string | Group identifier for grouping lines |
| ModifiedReason | string | Reason for last modification |
| InternalWarehouseLocation | string? | Warehouse location reference |

* * *

### Payment model

Represents a payment transaction on the order.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| Amount | decimal | Yes | Transaction amount |
| PaymentMethodName | string | Yes | Payment provider name (e.g., "Klarna", "Vipps", "Stripe") |
| TransactionId | string | Yes | Payment provider's transaction reference |
| TransactionType | string | Yes | See [Transaction Types](order-api.md#transaction-types) |
| Status | string | Yes | "Processed", "Failed", "Pending", "Paid", "Approved" |
| Id | string | No | Omnium-assigned payment ID |
| PaymentType | string | No | Payment category (e.g., "Invoice", "Card", "Swish") |
| AuthorizationCode | string | No | Provider authorization reference |
| PaidDate | DateTime? | No | Date payment was completed |
| Created | DateTime? | No | Transaction creation date |
| AuthorizationExpires | DateTime? | No | When the authorization expires |
| Comment | string | No | Payment comment |
| Reason | string | No | Reason for the transaction (e.g., "Return of damaged item") |
| InternalReference | string | No | Internal reference number |
| InvoiceId | string | No | Associated invoice ID |
| StoreId | string | No | Store where payment was made |
| ShipmentId | string | No | Associated shipment |
| IsManuallyAdded | bool | No | Whether payment was added manually |
| Properties | List<OmniumPropertyItem> | No | Custom properties (max 250) |
| ExternalIds | List<OmniumExternalId> | No | External system references (max 250) |
| OrderLineReferences | List<OmniumPaymentOrderLineReference> | No | Order lines this payment applies to (for returns) |

#### Transaction types

| Type | Usage | Description |
| --- | --- | --- |
| `Authorization` | E-commerce | Payment reserved but not yet charged |
| `Capture` | Fulfillment | Payment charged from customer |
| `Sale` | POS | Immediate capture (no separate authorization) |
| `Credit` | Returns | Refund back to customer |
| `Invoiced` | Invoice | Invoice-based payment |
| `Void` | Cancellation | Authorization cancelled |

For a full explanation of the payment lifecycle, see [Order API Guide - Payments](order-api.md#payments).

* * *

### Address model

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Full name |
| FirstName | string | First name |
| LastName | string | Last name |
| Organization | string | Company/organization name |
| OrganizationalNumber | string | VAT/company registration number |
| Line1 | string | Address line 1 |
| Line2 | string | Address line 2 |
| StreetNumber | string | Street number |
| ApartmentNumber | string | Apartment/unit number |
| City | string | City |
| State | string | State/province |
| PostalCode | string | Postal/ZIP code |
| CountryCode | string | ISO country code (e.g., "NO", "SE", "DK") |
| CountryName | string | Country name |
| RegionCode | string | Region code |
| RegionName | string | Region name |
| DaytimePhoneNumber | string | Phone number |
| EveningPhoneNumber | string | Alternative phone number |
| Email | string | Email address |

* * *

### Patch model

Used with the [Patch Order](api-reference.md#patch-order) endpoint for partial updates. Includes the same properties as the order model, plus these control properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| KeepExistingCustomProperties | bool? | true | If true, existing custom properties not in the patch are preserved |
| KeepExistingListItems | bool? | true | If true, existing list items (e.g., ExternalIds) are preserved |
| ForceUpdate | List<string> | \- | Property names to force-update even when the patch value is null |
| PropertiesRemovalConditions | List<OmniumPropertyItem> | \- | Properties matching these conditions will be removed |

When `keepExistingCustomProperties` is true (default), any properties you include in the patch are merged with existing properties. Set it to false to replace the entire properties list.

* * *

### Search request model

Used with the [Search](api-reference.md#search) and [Scroll](api-reference.md#scroll-search) endpoints.

#### Pagination and sorting

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| Take | int | 20 | Number of results per page (max 100) |
| Page | int | 1 | Page number |
| SortOrder | string | \- | Sort order (see values below) |
| DisableFacets | bool? | false | Disable facet calculation for faster queries |

**Sort order values:** `CreatedAscending`, `CreatedDescending`, `ModifiedAscending`, `ModifiedDescending`, `CustomerNameAscending`, `CustomerNameDescending`, `StatusAscending`, `StatusDescending`, `OrderIdAscending`, `OrderIdDescending`, `StoreAscending`, `StoreDescending`, `TotalAscending`, `TotalDescending`

#### Filters

| Property | Type | Description |
| --- | --- | --- |
| SearchText | string | Free-text search across order fields |
| OrderNumber | string | Exact order number match |
| SelectedStores | List<string> | Filter by store IDs |
| SelectedStatuses | List<string> | Include only these statuses |
| ExcludedStatuses | List<string> | Exclude these statuses |
| SelectedMarkets | List<string> | Filter by market IDs |
| OrderType | string | Filter by order type |
| SalesChannels | List<string> | Filter by sales channels |
| Tags | List<string> | Filter by tags |
| ExcludedTags | List<string> | Exclude orders with these tags |

#### Customer filters

| Property | Type | Description |
| --- | --- | --- |
| Email | string | Customer email |
| Phone | string | Customer phone |
| CustomerName | string | Customer name (partial match) |
| CustomerNumber | string | Customer number |
| CustomerId | string | Exact customer ID |
| CustomerIds | List<string> | Multiple customer IDs |
| ContactPersonPhone | string | Contact person phone |
| ContactPersonEmail | string | Contact person email |
| SalesPersonId | string | Sales person ID |

#### Date filters

| Property | Type | Description |
| --- | --- | --- |
| CreatedFrom | DateTime? | Orders created on or after |
| CreatedTo | DateTime? | Orders created on or before |
| ModifiedFrom | DateTime? | Orders modified on or after |
| ModifiedTo | DateTime? | Orders modified on or before |
| ReadyForPickupFrom | DateTime? | Ready for pickup on or after |
| ReadyForPickupTo | DateTime? | Ready for pickup on or before |
| CompletedFrom | DateTime? | Completed on or after |
| CompletedTo | DateTime? | Completed on or before |
| FollowUpDateFrom | DateTime? | Follow-up date on or after |
| FollowUpDateTo | DateTime? | Follow-up date on or before |

#### Product filters

| Property | Type | Description |
| --- | --- | --- |
| ProductNumbers | List<string> | Filter by product SKUs |
| ProductSerialNumbers | List<string> | Filter by serial numbers |
| ProductTypes | List<string> | Filter by product types |

#### Payment filters

| Property | Type | Description |
| --- | --- | --- |
| PaymentStatuses | List<string> | "OverPaid", "Paid", "NotPaid", "PartiallyPaid" |
| PaymentTransactionTypes | List<string> | "Authorization", "Capture", etc. |
| PaymentTransactionStatus | string | "Failed" |
| PaymentTransactionDateFrom | DateTime? | Payment date range start |
| PaymentTransactionDateTo | DateTime? | Payment date range end |
| ShowOrdersWithAuthExpires | bool | Show orders with expiring authorizations |

#### Other filters

| Property | Type | Description |
| --- | --- | --- |
| InventoryStatus | string | "InStock", "PartiallyInStock", "NotInStock" |
| ShippingMethodNames | List<string> | Filter by shipping methods |
| SelectedDiscounts | List<string> | Filter by applied discounts |
| ExternalIds | List<string> | Filter by external IDs |
| ShipmentExternalIds | List<string> | Filter by shipment external IDs |
| Urgent | bool | Only urgent orders |
| FutureDeliveries | bool | Orders with future delivery dates |
| HasErrors | bool | Orders with errors |
| Property | OmniumPropertyItem | Filter by single custom property |
| Properties | List<OmniumPropertyItem> | Filter by multiple custom properties |
| ProjectId | string | Filter by project |
| SubscriptionId | string | Filter by subscription |
| PicklistIds | List<string> | Filter by picklist |
| SecretKey | string | Filter by secret key |

* * *

## Error handling

The Order API uses standard HTTP status codes:

| Status | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created (new order) |
| 204 | No Content (batch operations) |
| 400 | Bad Request (invalid parameters or validation failure) |
| 404 | Order not found |
| 409 | Conflict (concurrent modification) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

### Concurrency control

Order writes are whole-order saves: the last request to save wins, and overlapping requests can overwrite each other's changes. Omnium offers an optional per-order lock, enabled per tenant, that prevents this. When the lock is enabled for your tenant and another operation is currently modifying the same order, you receive a `409 Conflict` response with `"error": "ResourceLocked"`. Retry the operation after a short delay.

See [Order Locking](order-locking.md) for how the lock works, which endpoints use it, the response body, and how to handle it.

* * *

## Pagination limits

| Constraint | Value |
| --- | --- |
| Default page size | 20 |
| Maximum page size | 100 |
| Maximum search window | 10,000 results (`take * page`) |
| Scroll API | Unlimited (use for large exports) |
| Batch cancel limit | 100 orders per request |
| Max line items per order | 1,000 |
| Max list items (payments, shipments, etc.) | 250 |
