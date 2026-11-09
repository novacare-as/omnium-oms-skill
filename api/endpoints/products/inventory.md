# Products | Inventory

Source: https://api.omnium.no/documentation

> Fetch and update inventory.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Inventory/{id}`

**Returns inventory items for a single sku**

Operation ID: `InventoryGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the sku to return |
| `warehouseIds` | query | List<string> | No | Warehouse ids for inventory |

**Responses:**

- 200: [`OmniumInventoryItemOmniumResult`](../../schemas/OmniumInventoryItemOmniumResult.md) — Success

---

## `DELETE /api/Inventory/{id}`

**Deletes inventory for a single sku, for selected warehouses**

Operation ID: `InventoryDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the sku to delete |
| `warehouseIds` | query | List<string> | Yes | Warehouse ids for inventory to delete |

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `POST /api/Inventory`

**Add a new inventory item to the OMS**

Operation ID: `InventoryPost`

**Request body:** [`OmniumInventoryItem`](../../schemas/OmniumInventoryItem.md) — Inventory object that needs to be added to the OMS

**Responses:**

- 201: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `PATCH /api/Inventory`

**Patch an inventory item - update only the values present in the request. Only updates items that already exist - does not create new inventory entries. The item is identified by SkuId and WarehouseCode (and optionally VirtualWarehouseCode). Quantities (Inventory / ReservedInventory) are not patchable here - use ProcessInventoryTransactions (delta) or UpdateMany (total) for those.**

Operation ID: `InventoryPatchInventoryItem`

**Request body:** [`OmniumInventoryItemPatch`](../../schemas/OmniumInventoryItemPatch.md) — Patch request containing the identifiers and fields to update

**Responses:**

- 200: [`OmniumInventoryItemUpdateResult`](../../schemas/OmniumInventoryItemUpdateResult.md) — Inventory item patch processed (see result for details)
- 400: string — Patch request is invalid
- 404: string — Inventory item not found

---

## `DELETE /api/Inventory`

**Deletes inventory for multiple skus, for selected warehouses**

Operation ID: `InventoryDeleteMany`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `warehouseIds` | query | List<string> | Yes | Warehouse ids for inventory to delete |

**Request body:** List<string> — SkuIds to delete inventory for

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `POST /api/Inventory/AddMany`

**Add a range of inventory items to the OMS. This will override existing items even if the values are identical, and also create inventory transactions. Please note: It is strongly recommended that you only use this endpoint for one-time imports. For everything else (such as continuous updates, new import, nightly full imports, etc.), please use UpdateMany instead.**

Operation ID: `InventoryAddMany`

**Request body:** List<[`OmniumInventoryItem`](../../schemas/OmniumInventoryItem.md)> — A list of inventory items objects that needs to be added to the OMS

**Responses:**

- 201: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `PUT /api/Inventory/Update`

**Update inventory**

Operation ID: `InventoryUpdate`

**Request body:** [`OmniumInventoryItem`](../../schemas/OmniumInventoryItem.md) — The inventory object to be updated in the OMS

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `PUT /api/Inventory/UpdateMany`

**Update a range of inventory items to the OMS.**

Operation ID: `InventoryUpdateMany`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `isReservedInventoryOverwritten` | query | boolean | No | Set to 'true' if reserved inventory should be overwritten with the values in the request. Defaults to 'false'. |

**Request body:** List<[`OmniumInventoryItem`](../../schemas/OmniumInventoryItem.md)> — A list of inventory items objects that needs to be added to the OMS

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `PUT /api/Inventory/UpdateManyWithMetadata`

**Update a range of inventory items to the OMS, optionally giving a reason for the change. Works like UpdateMany, and stores the optional reason text and reason code on the inventory transactions the update creates.**

Operation ID: `InventoryUpdateManyWithMetadata`

The reason text and the reason code are both optional. The reason code is stored as given. The transaction type is optional. When omitted, null or empty it defaults to Manual. Otherwise it must be one of PurchaseOrder, SalesOrder, InventoryCount, Manual, API, AtpCreated, LocationTransfer, Transfer or Cancellation (case-insensitive), and any other value is rejected with 400.

Example:
{
    "inventoryItems": [ { "sku": "1234", "warehouseCode": "WH1", "inventory": 10 } ],
    "reasonCode": "Damaged",
    "reason": "Water damage in storage",
    "transactionType": "Manual",
    "isReservedInventoryOverwritten": false
}

**Request body:** [`OmniumInventoryUpdateManyRequest`](../../schemas/OmniumInventoryUpdateManyRequest.md) — Inventory items, optional reason text, optional reason code and optional transaction type

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `POST /api/Inventory/ProcessInventoryTransactions`

**Perform inventory updates by specifying delta instead of total. Supports multiple updates to the same inventory item in the same request. Concurrent requests for the same inventory item are applied one after the other. If an item keeps changing under concurrent writers the request returns 409 Conflict listing the updates that were not applied; every other update in the request is persisted.**

Operation ID: `InventoryProcessInventoryTransactions`

**Request body:** List<[`OmniumInventoryUpdate`](../../schemas/OmniumInventoryUpdate.md)> — List of Inventory updates object

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Inventory/IncreaseReservedInventory`

**Increase reserved inventory for one or more inventory items. Only the reserved inventory level is changed - physical inventory is left untouched.**

Operation ID: `InventoryIncreaseReservedInventory`

**Request body:** List<[`OmniumIncreaseReservedInventoryRequest`](../../schemas/OmniumIncreaseReservedInventoryRequest.md)> — List of reservation increase requests

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `POST /api/Inventory/DecreaseReservedInventory`

**Decrease reserved inventory for one or more inventory items. Only the reserved inventory level is changed - physical inventory is left untouched. Reserved inventory will not go below zero.**

Operation ID: `InventoryDecreaseReservedInventory`

**Request body:** List<[`OmniumDecreaseReservedInventoryRequest`](../../schemas/OmniumDecreaseReservedInventoryRequest.md)> — List of reservation decrease requests

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `GET /api/Inventory/RecalculateReservedInventory`

**Recalculates all inventory items with reservations**

Operation ID: `InventoryRecalculateReservedInventory`

**Responses:**

- 200: Success

---

## `POST /api/Inventory/RecalculateReservedInventory`

**Recalculates reserved inventory for the supplied SKUs only. The recalculation runs in the background and the request returns immediately.**

Operation ID: `InventoryRecalculateReservedInventoryForSkus`

**Request body:** List<string> — SKUs to recalculate reserved inventory for. At least one is required.

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `GET /api/Inventory/Scroll/{id}`

**Scroll inventory is used to get a large amount of inventory items.**

Operation ID: `InventoryScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumInventoryItemOmniumResult`](../../schemas/OmniumInventoryItemOmniumResult.md) — Success
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `POST /api/Inventory/Search`

**Search inventory items using available parameters in OmniumInventorySearchRequest.**

Operation ID: `InventorySearch`

Sample request for a delta query:

    POST /api/inventory/search
    {
       "LastModified": "2019-11-21T17:32:28Z"
    }

Sample request for inventory for a specific market

    POST /api/inventory/search
    {
       "MarketId:" "NOR"
    }

Samples response if the number of inventory items exceeds 1000 (totalHits).

Notice that the 'scrollId' property has been populated as totalHits exceeds 1000, meaning that you should use the scroll endpoint to fetch remaining inventory items

    {
      "totalHits": 41244,
      "result": [
        {
            "sku": "102103",
            "warehouseCode": "40",
            "inventory": 33,
            "reservedInventory": 7,
            "location": "32D-A2"
        },
        {
          "sku": "102104",
          ...
        }
      ],
      "scrollId": "2f842421e06e4c60bb2c4f0d8b3ef60b"
    }

Please note that if the total amount is larger than 2000, the response will contain a Scroll ID which can be used with the Scroll endpoint to fetch all remaining items.

**Request body:** [`OmniumInventorySearchRequest`](../../schemas/OmniumInventorySearchRequest.md) — The InventorySearchRequest contains properties for filtering inventory

**Responses:**

- 200: [`OmniumInventoryItemOmniumResult`](../../schemas/OmniumInventoryItemOmniumResult.md) — Search successful, returning inventory items
- 400: Search request invalid

---

## `GET /api/Inventory/ScrollTransactions/{id}`

**Scroll inventory transactions is used to get a large amount of inventory transactions.**

Operation ID: `InventoryScrollTransactions`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumInventoryTransactionOmniumResult`](../../schemas/OmniumInventoryTransactionOmniumResult.md) — Success
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `POST /api/Inventory/SearchTransactions`

**Search inventory transactions using available parameters in OmniumInventoryTransactionSearchRequest.**

Operation ID: `InventorySearchInventoryTransactions`

Sample request for a transaction search by SKU:

    POST /api/inventory/searchtransactions
    {
       "skuId": "ABC123",
       "take": 50,
       "page": 1
    }

Sample request for transactions within a date range:

    POST /api/inventory/searchtransactions
    {
       "from": "2024-01-01T00:00:00Z",
       "to": "2024-01-31T23:59:59Z",
       "take": 100,
       "page": 1
    }

Sample request for all transactions within a date range. Page is left out, so the transactions are fetched by scrolling:

    POST /api/inventory/searchtransactions
    {
       "from": "2024-01-01T00:00:00Z",
       "to": "2024-01-31T23:59:59Z"
    }

Sample response to a request without page if the number of inventory transactions exceeds 2000 (totalHits).

Notice that the 'scrollId' property has been populated as totalHits exceeds 2000, meaning that you should use the ScrollTransactions endpoint to fetch remaining inventory transactions

    {
      "totalHits": 15000,
      "result": [
        {
            "variant": "ABC123",
            "warehouseCode": "WH001",
            "inventoryChange": 5,
            "transactionDate": "2024-01-15T10:30:00Z",
            "transactionType": "PurchaseOrder"
        },
        {
          "variant": "ABC124",
          ...
        }
      ],
      "scrollId": "2f842421e06e4c60bb2c4f0d8b3ef60b"
    }

Please note that take and page return that page only, with at most 2000 transactions, and that page multiplied by take can be at most 20000. To fetch all transactions, leave out page: the response then contains the first 2000, and if the total amount is larger than 2000, a Scroll ID which can be used with the ScrollTransactions endpoint to fetch all remaining transactions.

**Request body:** [`OmniumInventoryTransactionSearchRequest`](../../schemas/OmniumInventoryTransactionSearchRequest.md) — The search request contains properties for filtering inventory transactions

**Responses:**

- 200: [`OmniumInventoryTransactionOmniumResult`](../../schemas/OmniumInventoryTransactionOmniumResult.md) — Search successful, returning inventory transactions
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Search request invalid

---

## `POST /api/Inventory/TransferLocation`

**Transfer inventory between locations within a warehouse, or assign unlocated stock to a location**

Operation ID: `InventoryTransferLocation`

**Request body:** [`OmniumLocationTransferRequest`](../../schemas/OmniumLocationTransferRequest.md)

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `POST /api/Inventory/SetDefaultLocation`

**Set the default location for a SKU in a warehouse**

Operation ID: `InventorySetDefaultLocation`

**Request body:** [`OmniumSetDefaultLocationRequest`](../../schemas/OmniumSetDefaultLocationRequest.md)

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `PUT /api/Inventory/UpdateAtp`

**Update ATP (Available-to-Promise) values on existing inventory items. Only updates items that already exist — does not create new inventory entries.**

Operation ID: `InventoryUpdateAtp`

**Request body:** List<[`OmniumInventoryAtpUpdate`](../../schemas/OmniumInventoryAtpUpdate.md)> — List of ATP updates, each targeting a specific SKU and warehouse

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `PATCH /api/Inventory/PatchMany`

**Patch many inventory items - update only the values present in each request. Only updates items that already exist - does not create new inventory entries. Each item is identified by SkuId and WarehouseCode (and optionally VirtualWarehouseCode). Quantities (Inventory / ReservedInventory) are not patchable here.**

Operation ID: `InventoryPatchMany`

**Request body:** List<[`OmniumInventoryItemPatch`](../../schemas/OmniumInventoryItemPatch.md)> — List of patch requests

**Responses:**

- 200: [`OmniumInventoryItemUpdateResult`](../../schemas/OmniumInventoryItemUpdateResult.md) — Inventory item patches processed (see result for details)
- 400: string — Patch request is invalid
