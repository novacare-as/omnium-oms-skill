# Pick Lists

Source: https://docs.omnium.no/docs/Order/order-pick-lists

> How pick lists group order shipments for warehouse and in-store picking in Omnium, including statuses, deviation handling, and the Pick List API.

A pick list groups shipments from one or more orders so they can be picked together at a single warehouse or store. Picking staff work through the list item by item, register what was actually found on the shelf, and complete the list — at which point Omnium pushes the result back onto the underlying orders.

Pick lists are the link between order management and physical fulfillment: an order tells you _what_ was sold, a pick list tells you _what was collected, by whom, and where_. Warehouse picking, in-store picking for click and collect, and store-to-store transfers all run through the same pick list model.

For click and collect specifically, Omnium also has a dedicated, simplified view built around that flow. Pick lists work for click and collect orders too, but the dedicated view is the lighter option — see [Click and Collect](order-click-and-collect.md).

* * *

## How pick lists are created

Pick lists are created by users, not by the order workflow. A user selects the shipments to pick — in the Omnium UI or in the Omnium In-Store App — and Omnium builds a pick list from them:

1.  A new pick list gets an ID from the `PickListNumberOptions` number sequence and is created with status `New`.
2.  The list is assigned to the user who created it, and to a warehouse. When no warehouse is given, the user's selected store is used.
3.  Each selected shipment is added to the list, along with the products, quantities, and warehouse locations of its order lines.

Because creation is user-driven, the public API is a read-and-annotate surface: you can search pick lists, read them, and patch status and properties, but you cannot create a pick list or add shipments to one through the public API.

Shipments that belong to a pick list can be locked against editing, so that a shipment being picked is not changed underneath the picker. See the `IsLockShipmentsOnPickList` order setting in [Order configuration](order-config.md).

* * *

## Pick list statuses

| Status | Meaning |
| --- | --- |
| `New` | The pick list has been created but picking has not started. |
| `InProgress` | Picking has started. The orders on the list have been moved to their in-progress status. |
| `Completed` | Picking is finished and the result has been applied to the orders. |
| `Transferred` | The list was handed over to another warehouse, and its shipments were reallocated or merged there. |
| `Queued` | The list is currently being processed. It is set while orders are being updated, and it blocks a second update from starting at the same time. |

`Queued` is a guard, not a resting state. If a pick list is stuck in `Queued`, an update was started and did not finish — attempting another update on it is rejected rather than applied twice.

* * *

## Completing a pick list

When a pick list is completed, Omnium walks through every picked item and updates the corresponding order line and shipment. Three quantities drive this:

| Quantity | Meaning |
| --- | --- |
| `Ordered` | What the customer ordered on that line. |
| `Picked` | What the picker registered as found. |
| `Rest` | The deviation on the line. A shortfall is recorded as a negative value, and its size is the quantity that could not be picked. |

When everything is picked, the shipment is fulfilled and the orders move on through their workflow. When something is missing, the line needs a **deviation handling** decision before the list can be completed.

### Deviation handling

Each item with a shortfall carries a rest action that tells Omnium what to do with the quantity that was not picked:

| Rest action | Effect on the order |
| --- | --- |
| `CancelOrderLine` | The missing quantity is canceled on the order line. If every line in a shipment is canceled, the shipment is removed; if every line on the order is canceled, the order is set to canceled. |
| `Reallocate` | The missing quantity is released for reallocation, so it can be fulfilled from another warehouse. |
| `CreateSplitShipment` | The missing quantity is split into a separate shipment to be delivered later, while the picked quantity ships now. |
| `AttentionRequired` | No automatic change is made. A warning is registered on the order with the picker's comment, and the order is left for manual handling. |

`AttentionRequired` takes precedence: if any item on the list is flagged for attention, the order is flagged and none of the other rest actions are applied to it.

A default rest action can be configured per tenant, so partially picked lines get a sensible fallback instead of blocking the picker — see [Configuration](order-pick-lists.md#configuration).

### Transferring to another warehouse

A pick list can be handed over to a different warehouse instead of being picked where it is. For each shipment on the list, Omnium either merges it into an existing shipment for the target warehouse, or moves the shipment to that warehouse and detaches it from the pick list. The pick list itself ends up with status `Transferred`.

* * *

## Cannot pick

When a store cannot find an item that Omnium shows as in stock, the picker registers **Cannot pick** on the order line in the orders-to-pick view. The dialog shows the store's in-stock, reserved, and available quantity for the product, and lets the picker enter the **Actual quantity in stock**. The picker then decides what happens to the order line:

| Action | Effect |
| --- | --- |
| **Cancel order line** | Cancels the order line. The tenant's cancellation reasons are offered when they are configured. |
| **Reallocate** | Moves the order line to a new shipment so it can be fulfilled from another warehouse. Shown only when [reallocation from Cannot pick](order-pick-lists.md#reallocate-from-cannot-pick) is set up. |
| **Update inventory** | Sets the store's inventory to the entered quantity and logs the reason for the change. The order line is not changed. |

When the picker changes the quantity, the line actions become **Update & cancel line** and **Update & reallocate line**, which correct the inventory first and then act on the order line.

**Cannot pick** is available when the user has update access to product inventory and inventory writing is enabled (`IsWriteEnabled` in [Inventory configuration](../Inventory/inventory-config.md)). It is not shown on package lines.

Cannot pick on an item in an existing pick list only corrects the store's inventory. To cancel or reallocate the missing quantity there, set the item's [deviation handling](order-pick-lists.md#deviation-handling).

### Reallocate from Cannot pick

Reallocation from **Cannot pick** needs three things:

1.  **Reallocate from Cannot pick** (`ReallocateOnCannotPick`) is turned on in the [pick list configuration](order-pick-lists.md#configuration).
2.  The order's order type has **Split cancelled order lines to status** (`SplitCancelledOrderlinesToStatus`) set. See the order type model in [Order configuration](order-config.md).
3.  That status is one of the order type's own statuses, and it runs [reallocation workflow steps](workflow-steps/allocation.md#reallocation).

When the picker reallocates, the order line is removed from the store's shipment and split into a new shipment with the status from `SplitCancelledOrderlinesToStatus`. The workflow steps on that status decide which warehouse gets the line, and the warehouse that could not pick it is excluded — see [Reallocate on cancel](workflow-steps/allocation.md#example-reallocate-on-cancel). No cancellation reason is asked for, because the line is not canceled.

If `SplitCancelledOrderlinesToStatus` is empty, or names a status that does not exist on the order's order type, the **Reallocate** button is not shown and the picker can only cancel the order line.

* * *

## Pick List API

### Base URL

```
https://api.omnium.no/api/PickList
```

Full Swagger reference: [Omnium Pick List API Documentation](https://api.omnium.no/documentation/index.html).

### Authentication

All endpoints require Bearer token authentication and the **Order Read** role (the **Order Admin** role also grants access). See [Authentication](../GettingStartedWithAPI/getStarted.md) for details on obtaining tokens.

### Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/PickList/Search` | Search pick lists by creation date, with paging and sorting |
| `GET` | `/api/PickList/Get?id={id}` | Get a single pick list by ID |
| `PATCH` | `/api/PickList/PatchPickList` | Update the status and properties of a pick list |

### Pick list model

| Property | Type | Description |
| --- | --- | --- |
| `Id` | string | Unique pick list ID, generated from the `PickListNumberOptions` number sequence |
| `Name` | string | Name of the pick list |
| `Created` | datetime | When the pick list was created (UTC) |
| `Modified` | datetime | When the pick list was last changed (UTC) |
| `WarehouseCode` | string | ID of the warehouse or store the list is picked at |
| `WarehouseName` | string | Name of that warehouse or store |
| `Status` | string | [Pick list status](order-pick-lists.md#pick-list-statuses) |
| `PickListOrderItems` | array | The order and shipment references on the list |
| `Properties` | array | Custom key-value properties |

Each entry in `PickListOrderItems` identifies one shipment:

| Property | Type | Description |
| --- | --- | --- |
| `OrderId` | string | ID of the order the shipment belongs to |
| `ShipmentId` | string | ID of the shipment on that order |

The API exposes the shipments a pick list covers, not the picked line items. To see products, quantities, and picking results, read the referenced orders — the pick list result is written back to their shipments and order lines when the list is completed.

### Search pick lists

**Endpoint:** `POST /api/PickList/Search`

| Property | Type | Description |
| --- | --- | --- |
| `Take` | int | Number of pick lists to return. Defaults to 100 when omitted or `0` |
| `Page` | int | Page number, starting at 1. Defaults to 1 when omitted or `0` |
| `CreatedFrom` | datetime | Only pick lists created on or after this date |
| `CreatedTo` | datetime | Only pick lists created on or before this date |
| `SortOrder` | string | `CreatedAscending`, `CreatedDescending`, `ModifiedAscending`, or `ModifiedDescending`. Defaults to `CreatedDescending` |

**Example request:**

```json
{
  "take": 25,
  "page": 1,
  "createdFrom": "2026-08-01T00:00:00Z",
  "createdTo": "2026-08-31T23:59:59Z",
  "sortOrder": "CreatedDescending"
}
```

**Example response:**

```json
{
  "totalHits": 2,
  "result": [
    {
      "id": "PL100241",
      "name": "Morning pick - Oslo",
      "created": "2026-08-28T06:12:44Z",
      "modified": "2026-08-28T07:41:02Z",
      "warehouseCode": "OSLO-01",
      "warehouseName": "Epic Enterprise Oslo",
      "status": "Completed",
      "pickListOrderItems": [
        {
          "orderId": "ORD-2026-004417",
          "shipmentId": "8f2b91c4-5d0e-42a7-9c31-6b4de2f70a15"
        }
      ],
      "properties": []
    },
    {
      "id": "PL100240",
      "name": "Click and collect - Oslo",
      "created": "2026-08-27T13:55:10Z",
      "modified": "2026-08-27T13:55:10Z",
      "warehouseCode": "OSLO-01",
      "warehouseName": "Epic Enterprise Oslo",
      "status": "New",
      "pickListOrderItems": [],
      "properties": []
    }
  ]
}
```

Results are limited to the warehouses the calling user has access to.

### Get a pick list

**Endpoint:** `GET /api/PickList/Get?id=PL100241`

Returns the pick list, or `404 Not Found` when no pick list has that ID.

### Patch a pick list

**Endpoint:** `PATCH /api/PickList/PatchPickList`

Only the properties present in the request are changed. `Id` is required; sending it without an ID returns `400 Bad Request`.

| Property | Type | Description |
| --- | --- | --- |
| `Id` | string | ID of the pick list to update. Required |
| `Status` | string | New [pick list status](order-pick-lists.md#pick-list-statuses) |
| `Properties` | array | Custom key-value properties. An empty array clears all properties |

**Example request:**

```json
{
  "id": "PL100241",
  "status": "Completed",
  "properties": [
    {
      "key": "ExternalPickTaskId",
      "value": "WMS-88213",
      "valueType": "String"
    }
  ]
}
```

The updated pick list is returned in the response.

Patching `Status` changes the pick list record only. It does not apply the picking result to the underlying orders — no order lines are canceled, reallocated, split, or moved forward. Use this endpoint to record the state of a pick list handled in an external system, not to complete picking in Omnium.

* * *

## Finding the orders on a pick list

Order search accepts a `PicklistIds` filter, so you can retrieve every order that has a shipment on a given pick list:

```json
{
  "picklistIds": ["PL100241"],
  "take": 50
}
```

See the [Order API Reference](api-reference.md) for the full order search request.

* * *

## Tracking pick list activity

Pick list operations are recorded as events, and can be subscribed to like any other Omnium event. Creation, item changes, order updates driven by a pick list, transfers, and deletions each have their own operation ID in the `114x` and `214x` ranges. See [Events](../Integrations/events.md) for the full list and for how to subscribe.

* * *

## Configuration

Pick list behavior is configured per tenant under `PickListSettings`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DefaultRestAction | string | — | Rest action applied automatically to a partially picked line that has no deviation handling set. Shown as **Default deviation handling**. |
| OrdersToPickStatuses | array | — | Order statuses whose orders appear in the orders-to-pick list. |
| AllowedOrderStatuses | array | — | Order statuses a pick list is allowed to move orders to. Shown as **Allowed order statuses for update**. |
| ShowInStockItemsOnPickList | bool | false | Print the in-stock quantity for each item on the pick list. Shown as **Display the quantity of items in stock when printing picklists**. |
| HideCommentsOnPickListOrders | bool | false | Hide order comments in the pick list orders view. Shown as **Hide comments on pick list orders view**. |
| ReallocateOnCannotPick | bool | false | Offer to reallocate the order line instead of canceling it when **Cannot pick** is used on an order in the orders-to-pick view. Requires `SplitCancelledOrderlinesToStatus` on the order type — see [Reallocate from Cannot pick](order-pick-lists.md#reallocate-from-cannot-pick). Shown as **Reallocate from Cannot pick**. |

Pick list IDs come from the `PickListNumberOptions` number sequence — see [Number options](../configuration/numberoptions.md) for how to configure the format and starting number.

* * *

## Related

*   [Order API Reference](api-reference.md) — searching orders and reading shipments
*   [Click and Collect](order-click-and-collect.md) — in-store picking of reserved orders
*   [Order configuration](order-config.md) — order types, statuses, and order settings
*   [Events](../Integrations/events.md) — subscribing to pick list operations
