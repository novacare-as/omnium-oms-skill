# API Reference

Source: https://docs.omnium.no/docs/PurchaseOrders/Deliveries/delivery-api

> Reference for the Delivery API in Omnium - read, search, create, update and delete deliveries, perform goods reception, take in despatch advices and receive their units by SSCC.

The Delivery API lets you read and maintain the [deliveries](../Deliveries.md) of purchase orders and internal transfers, record [goods reception](goods-reception.md), take in [despatch advices](despatch-advice.md) from suppliers, and [receive their units by SSCC](sscc-reception.md). An ERP typically creates deliveries from purchase orders, keeps tracking and invoice data up to date, and reads what was received.

### Base URL and authentication

All delivery endpoints are available at:

```
https://<tenantId>.api.omnium.no/api/Deliveries
```

| Role | Access |
| --- | --- |
| **PurchaseOrderReadGroups** | Read endpoints, `CreateDelivery` and adding comments |
| **PurchaseOrderAdminGroups** | Everything, including taking in despatch advices, receiving goods, updating and deleting deliveries |

* * *

## Endpoints

| Method | Endpoint | Description | Role |
| --- | --- | --- | --- |
| `GET` | `/api/Deliveries/{deliveryId}` | Get a delivery | Read |
| `GET` | `/api/Deliveries/{deliveryId}/PurchaseOrderLines` | Get the purchase order lines of a delivery, or the content of a unit | Read |
| `GET` | `/api/Deliveries/{deliveryId}/ReceivingAdvice` | Get what was received against what was advised | Read |
| `POST` | `/api/Deliveries/Search` | Search deliveries | Read |
| `GET` | `/api/Deliveries/Units/Find?code=` | Find the units of despatch advices with a scanned code | Read |
| `POST` | `/api/Deliveries/CreateDelivery/{purchaseOrderId}` | Create a delivery from purchase order lines, or add lines to a delivery | Read |
| `POST` | `/api/Deliveries/DespatchAdvice` | Take in a despatch advice (ASN) and build its delivery tree | Admin |
| `POST` | `/api/Deliveries/{deliveryId}/Receive` | Receive units of a despatch advice | Admin |
| `PUT` | `/api/Deliveries` | Update a delivery | Admin |
| `PUT` | `/api/Deliveries/UpdateMany` | Update many deliveries | Admin |
| `PATCH` | `/api/Deliveries/{deliveryId}` | Update some fields of a delivery | Admin |
| `POST` | `/api/Deliveries/{deliveryId}/AddPublicDeliveryComment` | Add a public comment | Read |
| `POST` | `/api/Deliveries/{deliveryId}/AddInternalDeliveryComment` | Add an internal comment | Read |
| `POST` | `/api/Deliveries/ProcessGoodsReception` | Goods reception on lines of any delivery | Admin |
| `POST` | `/api/Deliveries/{deliveryId}/ProcessGoodsReception` | Goods reception on the lines of one delivery, or on the content of one unit | Admin |
| `DELETE` | `/api/Deliveries/{deliveryId}` | Delete a delivery, with the units under it | Admin |

* * *

## Delivery model

A delivery is either an ordinary delivery, the top delivery of a despatch advice, or a unit of a despatch advice: a pallet, carton or other package under a top delivery. See [How Omnium models a despatch advice](despatch-advice.md#how-omnium-models-a-despatch-advice).

| Field | Type | Description |
| --- | --- | --- |
| `Id` | string | The delivery ID |
| `Created` | datetime | When the delivery was created |
| `Modified` | datetime | When the delivery was last modified |
| `DeliveryStatus` | string | `New`, `Confirmed`, `InProgress`, `Completed`, `OnHold` or `Cancelled`. See [statuses](../Deliveries.md#statuses). |
| `IsAutoDeliveryStatusDisabled` | bool | `true` turns off the automatic status calculation, so the status is set by you |
| `OrderType` | string | `PurchaseOrder` or `InternalTransfer` |
| `WarehouseCode` | string | The receiving warehouse or store |
| `SupplierWarehouseCode` | string | The warehouse the goods are sent from, for an internal transfer |
| `Suppliers` | array of string | The names of the suppliers |
| `SupplierIds` | array of string | The IDs of the suppliers |
| `EstimatedTimeOfDeparture` | datetime | When the goods leave the supplier |
| `EstimatedTimeOfArrival` | datetime | When the goods are expected at the warehouse. Used by ATP. |
| `DeliveryTrackingNumber` | string | The carrier's tracking number |
| `DeliveryTrackingLink` | string | A link to track the shipment |
| `DeliveryProvider` | string | The carrier |
| `InvoiceNumber` | string | The supplier's invoice number |
| `InvoiceDate` | datetime | The supplier's invoice date |
| `IsCounted` | bool | Whether the quantities were verified before goods reception |
| `Barcode` | string | Any other code for the delivery, such as the carrier's package ID. A scan of it finds the delivery in goods reception. Kept as it is when an update leaves it out. |
| `ExternalIds` | array | The IDs of the delivery in other systems. Kept as they are when an update leaves them out. |
| `Tags` | array of string | Free-text labels for grouping and filtering |
| `Properties` | array | Custom key-value properties |
| `DeliveryNotes` | array | Internal comments |
| `PublicDeliveryNotes` | array | Public comments |

These fields are set by Omnium for a despatch advice and its units. They are read-only: an update ignores them.

| Field | Type | Description |
| --- | --- | --- |
| `DespatchAdviceNumber` | string | The sender's despatch advice number, on the top delivery |
| `DespatchAdviceHash` | string | A hash of the despatch advice message that built the tree, on the top delivery |
| `IsContentCheckRequired` | bool | The sender asks for the content of the units to be checked, on the top delivery |
| `UnitType` | string | `Shipment` on the top delivery. `Pallet`, `Carton`, `Parcel`, `RollCage`, `Container` or `Other` on a unit. |
| `Sscc` | string | The SSCC of a unit, 18 digits. Empty on the top delivery and on ordinary deliveries. |
| `ParentDeliveryId` | string | The delivery a unit stands on or belongs to. Empty on the top delivery. |
| `RootDeliveryId` | string | The top delivery of the despatch advice. On the top delivery, its own ID. |
| `ChildDeliveryCount` | int | The number of units below this delivery, on all levels |
| `ReceivedChildDeliveryCount` | int | The number of units below this delivery that are received |
| `DeviationChildDeliveryCount` | int | The number of units below this delivery with a deviation |
| `ReceptionId` | string | The ID of the booking of a unit's goods, as `GoodsReceptionId` on its inventory transactions |
| `ReceptionDeviation` | string | A deviation for a unit as a whole: `Missing`, `Damaged` or `Refused` |
| `ReceivedDate` | datetime | When a unit was received or marked |
| `ReceivedBy` | string | Who received or marked a unit |
| `ReceptionMode` | string | How a unit was received: `AsAdvised` or `ContentChecked` |
| `UnitLines` | array | The content of a unit. Empty on the top delivery and on ordinary deliveries. |

Each content row in `UnitLines`:

| Field | Type | Description |
| --- | --- | --- |
| `PurchaseOrderId` | string | The purchase order of the order line on the top delivery |
| `LineItemId` | string | The order line on the top delivery that this content belongs to |
| `SkuId` | string | The SKU of the item |
| `Gtin` | string | The barcode of the item as the sender stated it |
| `Quantity` | decimal | The advised quantity in this unit |
| `ReceivedQuantity` | decimal | The quantity received from this unit. Empty until the unit is received or marked. |
| `ReceptionDeviationReasonCode` | string | Why the received quantity differs from the advised, as the store gave it |
| `BatchNumber` | string | The batch or lot number, as advised |
| `BestBeforeDate` | datetime | The best before date, as advised |
| `ExpiryDate` | datetime | The expiry date, as advised |
| `SerialNumbers` | array of string | The serial numbers, as advised |

* * *

## Read deliveries

### Get a delivery

```
GET /api/Deliveries/{deliveryId}
```

Returns the delivery. A unit is returned like any delivery, with its content in `UnitLines`. `400` when the ID is missing, `404` when there is no such delivery.

### Get the purchase order lines of a delivery

```
GET /api/Deliveries/{deliveryId}/PurchaseOrderLines
```

Returns the purchase order lines on the delivery. For a unit, it returns the content of the unit as purchase order lines: each row as its order line on the top delivery, with the advised quantity in the unit as `Quantity`, the received quantity in the unit as `DeliveredQuantity`, the unit's ID as `DeliveryId` and the amounts scaled to the quantity in the unit. `404` when the delivery has no lines.

### Search deliveries

```
POST /api/Deliveries/Search
```

| Field | Type | Description |
| --- | --- | --- |
| `CreatedFrom` | datetime | Created at or after |
| `CreatedTo` | datetime | Created at or before |
| `EstimatedTimeOfArrivalFrom` | datetime | Expected at or after |
| `EstimatedTimeOfArrivalTo` | datetime | Expected at or before |
| `SelectedDeliveries` | array of string | Delivery IDs |
| `SelectedStatuses` | array of string | Delivery statuses |
| `SelectedStores` | array of string | Receiving stores |
| `OrderType` | string | `PurchaseOrder` or `InternalTransfer` |
| `Tags` | array of string | Deliveries with these tags |
| `ExcludedTags` | array of string | Deliveries without these tags |
| `SupplierIds` | array of string | Supplier IDs |
| `SearchText` | string | Free text |
| `SortOrder` | string | The sort order |
| `Page` | int | The page, from 1 |
| `Take` | int | Deliveries per page. 10 when not set. |
| `Sscc` | string | Units with this SSCC. A leading `00`, spaces and brackets are ignored. |
| `ParentDeliveryId` | string | Units directly on this delivery |
| `RootDeliveryId` | string | The deliveries of one despatch advice: the top delivery and every unit under it |
| `IncludeUnits` | bool | Include the units of despatch advices. `false` by default. |

`CustomerName`, `Email` and `PurchaseOrderNumber` are obsolete and have no effect.

The answer has `TotalHits` and `Result`, the deliveries of the page.

A search leaves units out unless it sets `IncludeUnits`, `Sscc`, `ParentDeliveryId` or `RootDeliveryId`. The top delivery of a despatch advice is always included. See [Read the units of a despatch advice](sscc-reception.md#read-the-units-of-a-despatch-advice).

### Find units by a scanned code

```
GET /api/Deliveries/Units/Find?code=395201230000041022
```

Returns the units whose SSCC or barcode is exactly the code, received units included. `404` when no unit has the code. See [Find units by a scanned code](sscc-reception.md#find-units-by-a-scanned-code).

### Get the receiving advice

```
GET /api/Deliveries/{deliveryId}/ReceivingAdvice
```

Returns what was received against what was advised, for the whole despatch advice when you give its top delivery or any of its units, or for the order lines of an ordinary delivery. `400` when the ID is missing, `404` when the delivery, or the top delivery of a unit, is not found. See [Get the receiving advice](sscc-reception.md#get-the-receiving-advice) for the model and an example.

* * *

## Create deliveries

### Create a delivery from purchase order lines

```
POST /api/Deliveries/CreateDelivery/{purchaseOrderId}?existingDeliveryId=&cancelRemainingLineItems=&expectedDeliveryDate=&barcode=&newDeliveryId=&preventDuplicateLineItems=
```

The body is a list of the purchase order lines to put on the delivery:

| Field | Type | Description |
| --- | --- | --- |
| `LineItemId` | string | The order line. When it is left out, `Code` finds the first line with that SKU that is on no delivery. |
| `Code` | string | The SKU of the line |
| `Quantity` | decimal | The quantity to put on the delivery. A smaller quantity than the line has splits the line. A line with no quantity is skipped. |
| `PackageBarcode` | string | The barcode of the package that holds the line |

| Query parameter | Type | Description |
| --- | --- | --- |
| `existingDeliveryId` | string | Add the lines to this delivery instead of creating a new one. A unit of a despatch advice cannot take order lines: the call answers `400 Could not create delivery`. |
| `cancelRemainingLineItems` | bool | Cancel what is left on the purchase order |
| `expectedDeliveryDate` | datetime | The estimated time of arrival |
| `barcode` | string | A barcode for the delivery, used to find it in goods reception |
| `newDeliveryId` | string | The ID of the new delivery. Your own responsibility. |
| `preventDuplicateLineItems` | bool | Answer `400` when the request names a line item ID more than once |

Returns the delivery. `400` when lines are missing, unknown on the purchase order, or already on a delivery; `404` when the purchase order is not found.

### Take in a despatch advice

```
POST /api/Deliveries/DespatchAdvice
```

Creates the top delivery of a shipment with the order lines of the message, one unit delivery per package with a usable SSCC or carrier package ID, and order lines for items that were not ordered. Answers `200` with the result, `400`, `404` or `409` when the message is rejected, and `500` when building failed. See [Despatch advice (ASN)](despatch-advice.md) for the request, the matching rules, the rejections and the warnings.

* * *

## Update deliveries

### Update a delivery

```
PUT /api/Deliveries
```

The body is the whole delivery, with `Id`. The request replaces the stored delivery, so a field it leaves out is cleared, with these exceptions:

*   `Barcode` and `ExternalIds` are kept as stored when the request leaves them out.
*   The read-only fields of a despatch advice and its units are always kept as stored.
*   On a delivery of a despatch advice, the intake warnings are kept.

When the estimated time of arrival changes, Omnium recalculates ATP for the delivery, and on a top delivery it copies the date to every unit. Returns the delivery. `404` when it is not stored.

### Update many deliveries

```
PUT /api/Deliveries/UpdateMany
```

The body is a list of whole deliveries. The same fields are kept as for `PUT /api/Deliveries`, from the stored deliveries. This endpoint does not recalculate ATP or copy the arrival date to units. Returns `200` without a body.

### Update some fields of a delivery

```
PATCH /api/Deliveries/{deliveryId}
```

Changes only the fields you set. The body must have `Id`.

| Field | Type |
| --- | --- |
| `Id` | string |
| `DeliveryTrackingNumber` | string |
| `DeliveryTrackingLink` | string |
| `DeliveryProvider` | string |
| `InvoiceNumber` | string |
| `InvoiceDate` | datetime |
| `EstimatedTimeOfDeparture` | datetime |
| `EstimatedTimeOfArrival` | datetime |
| `Properties` | array |

A changed estimated time of arrival is handled as for `PUT`. Returns the delivery.

### Add comments

```
POST /api/Deliveries/{deliveryId}/AddPublicDeliveryComment
POST /api/Deliveries/{deliveryId}/AddInternalDeliveryComment
```

The body is a comment. The public comment goes in `PublicDeliveryNotes` and the internal comment in `DeliveryNotes`. When the comment has no `Creator`, the name of the API user is used. Returns the comments of the delivery, newest first. `404` when the delivery is not found.

* * *

## Receive goods

### Receive units of a despatch advice

```
POST /api/Deliveries/{deliveryId}/Receive
```

Receives a unit, or the top delivery, with every unit under it that is not received yet, as advised, or with deviations and counted quantities from the request. See [Receive units](sscc-reception.md#receive-units).

### Goods reception on one delivery

```
POST /api/Deliveries/{deliveryId}/ProcessGoodsReception?confirmOverDelivery=false
```

The body is a list of [goods reception lines](goods-reception.md#goods-reception-line). The lines must be on the delivery, and each line must name a physical warehouse. A `GoodsReceptionId` that was used before is answered with `400`.

When `deliveryId` is a unit of a despatch advice, the lines are the counted content of that unit, `ReceptionDeviationReasonCode` on a line says why a quantity differs from the advised, and `confirmOverDelivery` lets a line book more than is open on its order line. The answer is then the reception result of the unit, with `409` when the unit was not received. See [Receive the content of one unit per line](sscc-reception.md#receive-the-content-of-one-unit-per-line).

### Goods reception on any delivery

```
POST /api/Deliveries/ProcessGoodsReception
```

The body is a list of goods reception lines, which can be on different deliveries. Each line must name a physical warehouse. See [Goods reception](goods-reception.md).

* * *

## Delete a delivery

```
DELETE /api/Deliveries/{deliveryId}
```

Takes the order lines off the delivery and deletes it. A delivery of a despatch advice is deleted with every unit below it: the top delivery with all its units, or a pallet with its cartons. The deliveries above a deleted unit lower their unit count by the deleted unit and the units under it.

`404` when the delivery is not found. `409 Conflict`, with the reason as text, when the delivery is a received unit, or has a received unit below it. Nothing is changed then.

* * *

## What changes for an existing integration

Despatch advices add units to the deliveries of a tenant. An integration that does not use them keeps working as before:

*   **Lists.** `POST /api/Deliveries/Search` leaves units out unless you ask for them. The top delivery of a despatch advice is in the list like any delivery, with all its order lines.
*   **Exports.** Units are never exported, neither by the delivery export connectors, the `ExportDeliveries` workflow step nor a manual export. Connected systems get the top delivery with all its lines.
*   **New fields.** The delivery has the new fields in the [delivery model](delivery-api.md#delivery-model). `Barcode` and `ExternalIds` can be written and are kept when an update leaves them out. The despatch advice fields are read-only.
*   **PUT and UpdateMany** keep the despatch advice fields, the unit fields and the content of a unit as stored, whatever the request holds, so an update cannot cut a unit out of its tree. On a delivery of a despatch advice the intake warnings are kept.
*   **PATCH** has no despatch advice fields, so it cannot change them.
*   **Arrival date.** A `PUT` or `PATCH` that changes the estimated time of arrival of a top delivery also changes it on every unit. `UpdateMany` does not.
*   **Delete** takes the units under a delivery with it, and is refused with `409` when goods of them are received.
*   **CreateDelivery** answers `400` when `existingDeliveryId` is a unit. Order lines go on the top delivery.
*   **Goods reception per line** on a top delivery works as before. Receive goods that are in units through their units, see [Receive goods that are in no unit](sscc-reception.md#receive-goods-that-are-in-no-unit).
*   **Events.** Taking in a despatch advice raises delivery events for the top delivery, as creating a delivery and adding lines to it does. Creating units raises no events. `Receive` raises one delivery event for the delivery in the route, which can be a unit; the other units it receives raise none. A unit also raises delivery events when another endpoint acts on it directly, such as `PUT`, `PATCH`, a comment or `DELETE`.

### Purchase orders

A despatch advice can add order lines to a purchase order for items that were not ordered, and it uses the buyer's line number to find lines. The [purchase order line](../purchase-order-api.md#despatch-advice-fields-on-the-line) has four fields for this:

| Field | Type | Description |
| --- | --- | --- |
| `LineNumber` | string | The buyer's own line number on the order, such as `103`. A despatch advice can name the line by it. You can write it with `PUT` and `PATCH`. |
| `Origin` | string | Empty for a line that was ordered. `AddedByDespatchAdvice` for a line a despatch advice added. Read-only. |
| `AddedDate` | datetime | When a line that was not ordered was added. Read-only. |
| `ReceptionDeviationReasonCode` | string | Read-only. Empty on the order line itself; the reason codes of a despatch advice are on the content rows of its units. `GET /api/Deliveries/{deliveryId}/PurchaseOrderLines` on a unit returns the code of each row on its line. |

Your ERP does not know the lines a despatch advice added, so a purchase order update keeps them: `PUT /api/PurchaseOrders`, `UpdateAndRunWorkflow`, `UpdateMany`, and `PATCH` with `KeepExistingOrderLines` set to `false` put back every stored line with `Origin` `AddedByDespatchAdvice` that the request leaves out, with its reservations. The read-only fields always come from the stored line with the same line item ID.

* * *

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
