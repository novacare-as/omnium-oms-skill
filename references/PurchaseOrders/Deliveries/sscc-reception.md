# Receiving by SSCC

Source: https://docs.omnium.no/docs/PurchaseOrders/Deliveries/sscc-reception

> Read the units of a despatch advice, receive pallets and cartons by SSCC through the API, and get the receiving advice with received, short, oversupplied and rejected quantities for a RECADV.

When a [despatch advice](despatch-advice.md) is taken in, its goods arrive as units: pallets and cartons with an SSCC label, each a delivery under the top delivery of the shipment. The store usually receives them by scanning the labels in the In-Store App. This page covers what your ERP or integration can read and do through the API: find and read the units, receive units, receive goods per line, and get the receiving advice that tells what was received against what was advised.

All examples continue the example on the [despatch advice](despatch-advice.md#example-a-pallet-with-two-cartons-and-a-loose-carton) page: top delivery `10452` with pallet `10452-1`, cartons `10452-2` and `10452-3` on it, and the loose carton `10452-4`.

* * *

## Read the units of a despatch advice

### Search with the unit filters

```
POST /api/Deliveries/Search
```

Units are deliveries, but a delivery search leaves them out unless you ask for them, so a list has the same deliveries as before despatch advices existed. The top delivery is always in the list. These fields of the search request select units:

| Field | Type | Description |
| --- | --- | --- |
| `RootDeliveryId` | string | The deliveries of one despatch advice: the top delivery with every unit under it, on all levels |
| `ParentDeliveryId` | string | The units directly on one delivery: the units on the shipment when you give the top delivery, or the cartons on a pallet |
| `Sscc` | string | The units with this SSCC. The value is read as a scan is: a leading `00`, spaces and brackets are ignored. A value that is no SSCC is matched as it is. |
| `IncludeUnits` | bool | Include units in any other search. `false` by default. A search with `RootDeliveryId`, `ParentDeliveryId` or `Sscc` returns units without it. |

To read a whole despatch advice in one call, search with `RootDeliveryId` and a `Take` that holds every unit. A despatch advice has at most 500 packages.

```json
{
  "rootDeliveryId": "10452",
  "page": 1,
  "take": 1000
}
```

Each unit in the result has its content in `UnitLines`. The fields of a unit are listed under the [delivery model](delivery-api.md#delivery-model).

### Read one unit

`GET /api/Deliveries/{deliveryId}` returns a unit like any delivery, with its content rows in `UnitLines`.

`GET /api/Deliveries/{deliveryId}/PurchaseOrderLines` on a unit returns its content as purchase order lines: each row as its order line on the top delivery, with the advised quantity in the unit as `Quantity`, the received quantity in the unit as `DeliveredQuantity`, the ID of the unit as `DeliveryId`, and the amounts of the line scaled to the quantity in the unit. On the top delivery it returns the order lines of the whole despatch advice, as on any delivery.

### Find units by a scanned code

```
GET /api/Deliveries/Units/Find?code=(00)395201230000041022
```

Returns the units whose SSCC or barcode is exactly the scanned code, received units included, as a list of deliveries. `404` when no unit has the code.

*   The code is read as an SSCC where it is one: a GS1-128 prefix (`]C1`), a leading `00`, spaces and brackets do not stop a match.
*   A code that is no SSCC is matched against the `Barcode` of a unit (the carrier package ID) as it is.
*   Two units with the same SSCC are both returned. Each unit has the store it is for in `WarehouseCode` and its top delivery in `RootDeliveryId`, so you can tell them apart.
*   An empty code, or a code of only zeros, finds nothing.

* * *

## Receive units

```
POST /api/Deliveries/{deliveryId}/Receive
```

Requires the **PurchaseOrderAdminGroups** role. The body is optional.

The delivery in the route is received with every unit under it that is not received yet, **as advised**: a pallet with its cartons, a carton alone, or the top delivery with all its units. Each unit books the quantities its content rows advise. The request can name more units of the same despatch advice, so a row of scans is one call and one booking. When the route names the top delivery and the request names units, only the named units and the units under them are received.

The goods are booked once, on the order lines of the top delivery, in the store of the purchase order, as a [goods reception](goods-reception.md) does. Inventory, order reservations, the delivery status and ATP are updated in the same way.

### Request

| Field | Type | Description |
| --- | --- | --- |
| `Units` | array | More units of the same despatch advice, each received with the units under it. An entry for the delivery in the route, or for a unit under a named one, gives that unit a deviation or counted quantities. |
| `ConfirmOverDelivery` | bool | Book a row also when it is more than is open on its order line. Without it, a unit with such a row is left open, and the answer names the rows. |

Each entry in `Units`:

| Field | Type | Description |
| --- | --- | --- |
| `DeliveryId` | string | Required. The ID of the unit |
| `ReceptionDeviation` | string | `Missing`, `Damaged` or `Refused`, for the unit as a whole and the units under it that have no entry of their own. Nothing is booked for such a unit, and every content row is received with 0. |
| `Note` | string | A note on the deviation, written in the delivery notes of the unit |
| `Lines` | array | The quantities that were counted in the unit. A content row that is left out is received with 0, and a count for an order line that is no row of the unit becomes a row of its own with advised quantity 0. Leave it out to receive the unit as advised. |

Each counted line:

| Field | Type | Description |
| --- | --- | --- |
| `PurchaseOrderId` | string | The purchase order of the line. Optional when the line item ID is unique on the top delivery. |
| `LineItemId` | string | Required. The order line on the top delivery |
| `ReceivedQuantity` | decimal | The counted quantity, 0 or more |
| `ReceptionDeviationReasonCode` | string | Why the counted quantity differs from the advised. Stored on the content row as it is sent; it is not checked against the tenant's [deviation reason codes](delivery-config.md#despatch-advice-reception). |

A request is invalid (`400`) when an entry has no `DeliveryId`, names the same unit twice, has a `ReceptionDeviation` other than `Missing`, `Damaged` or `Refused`, has both a deviation and counted lines, has a counted line without `LineItemId` or with a quantity below 0, or gives the top delivery a deviation or counted lines.

### Example: receive the pallet, mark a carton and count the loose carton

The store receives pallet `10452-1` with its two cartons, finds carton `10452-3` damaged, and counts the loose carton `10452-4`, which holds one sleeping bag less than advised. One call does it all:

```
POST /api/Deliveries/10452/Receive
```

```json
{
  "units": [
    { "deliveryId": "10452-1" },
    { "deliveryId": "10452-3", "receptionDeviation": "Damaged", "note": "Crushed corner, wet content" },
    {
      "deliveryId": "10452-4",
      "lines": [
        { "lineItemId": "line-001", "receivedQuantity": 2 },
        { "lineItemId": "line-003", "receivedQuantity": 3, "receptionDeviationReasonCode": "Short" },
        { "lineItemId": "line-004", "receivedQuantity": 8 }
      ]
    }
  ],
  "confirmOverDelivery": false
}
```

**Response** (`200 OK`):

```json
{
  "outcome": "Received",
  "topDeliveryId": "10452",
  "warehouseCode": "store-12",
  "childDeliveryCount": 4,
  "receivedChildDeliveryCount": 3,
  "deviationChildDeliveryCount": 2,
  "units": [
    {
      "deliveryId": "10452-1",
      "parentDeliveryId": "10452",
      "sscc": "395201230000041015",
      "unitType": "Pallet",
      "warehouseCode": "store-12",
      "result": "Received",
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com"
    },
    {
      "deliveryId": "10452-2",
      "parentDeliveryId": "10452-1",
      "sscc": "395201230000041022",
      "unitType": "Carton",
      "warehouseCode": "store-12",
      "result": "Received",
      "receptionId": "6f0c2b8e4d1a4e7f9b3c5a2d8e1f0a47",
      "receptionMode": "AsAdvised",
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com"
    },
    {
      "deliveryId": "10452-3",
      "parentDeliveryId": "10452-1",
      "sscc": "395201230000041039",
      "unitType": "Carton",
      "warehouseCode": "store-12",
      "result": "Deviation",
      "receptionDeviation": "Damaged",
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com"
    },
    {
      "deliveryId": "10452-4",
      "parentDeliveryId": "10452",
      "sscc": "395201230000041046",
      "unitType": "Carton",
      "warehouseCode": "store-12",
      "result": "Received",
      "receptionId": "b41d7e2a9c0f4b6a8e5d3c1f2a7b9e60",
      "receptionMode": "ContentChecked",
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com"
    }
  ]
}
```

### The answer

`Outcome` is the result of the call as a whole:

| `Outcome` | Status | Meaning |
| --- | --- | --- |
| `Received` | `200` | No unit is left open: each unit of the call is handled now or was handled before |
| `PartlyReceived` | `200` | The call received or marked some units and left some open. Each unit says why. |
| `NotReceived` | `200` | The call left units open and received or marked none. Each unit says why. |
| `NotFound` | `404` | The delivery in the route does not exist |
| `NotInTree` | `400` | The delivery in the route is no delivery of a despatch advice, or a despatch advice without units. Receive its lines with `ProcessGoodsReception`. |
| `Invalid` | `400` | The request cannot be carried out as sent. `Message` says why. |

The counts of the top delivery after the call are in `ChildDeliveryCount`, `ReceivedChildDeliveryCount` and `DeviationChildDeliveryCount`. `Units` has one entry per unit the call handled or left open, the units under a named unit included. `Result` says what happened to each:

| `Result` | The unit is | What happened |
| --- | --- | --- |
| `Received` | Completed | The goods are booked. `ReceptionMode` is `AsAdvised` or `ContentChecked`, and `ReceptionId` is the ID of the booking. |
| `Deviation` | Completed | The unit is marked `Missing`, `Damaged` or `Refused`. Nothing is booked. |
| `AlreadyReceived` | Unchanged | The unit was handled before. Nothing is booked again; `ReceivedBy` and `ReceivedDate` say who handled it and when. |
| `OverDelivery` | Open | A row is more than is open on its order line, and the request did not set `ConfirmOverDelivery`. `RowIssues` names the rows. |
| `OrderLineMissing` | Open | The order line of a row is no longer on the top delivery. `RowIssues` names the rows. |
| `ContentCheckRequired` | Open | The unit was to be received as advised, but its content must be checked. Send it again with counted `Lines`, or mark it with a deviation. |
| `NotInTree` | — | The request names a delivery that is no unit of this despatch advice |

Each row issue has `PurchaseOrderId`, `LineItemId`, `SkuId`, `Quantity` (what the row would book) and `OpenQuantity` (what is still open on the order line, counting the units before this one in the call).

### Rules of a reception

*   **A unit is booked once.** It gets a reception ID before anything is booked, and the ID is the `GoodsReceptionId` of its inventory transactions. A unit that is already received is answered with `AlreadyReceived`, and a call that stopped after the booking is completed by the next call without a second booking. A call that timed out can be sent again.
*   **Over-delivery is measured against the order line**, not against the advised quantity: a unit can book more than it advises as long as the order line has that much open. Units earlier in the same call count.
*   **A pallet** that holds only cartons is completed when its last carton is handled, and only then gets a result of its own.
*   **A deviation on a pallet** goes to its cartons that have no entry of their own.
*   **Content check.** When the content of the units must be checked, by the tenant setting [Require content check](delivery-config.md#despatch-advice-reception) or because the despatch advice has `IsContentCheckRequired`, a unit without counted `Lines` is left open with `ContentCheckRequired`. Counted units, deviations, and units whose booking an earlier call made are taken as always. The status code stays `200`.
*   **One reception at a time per despatch advice.** A reception waits up to 20 seconds for another reception of the same despatch advice to finish, and answers `409 Conflict` with the usual `ResourceLocked` body when it does not. Nothing is booked then; try again.
*   **No store check.** The call does not check which store the user works in. `WarehouseCode` on each unit says which store it is for.

### Status and counts

A unit is `New` until it is handled, and `Completed` when it is received or marked. A pallet is `InProgress` while some of its cartons are handled. On the top delivery and on each pallet:

*   `ReceivedChildDeliveryCount` counts the units below that are completed without a deviation for the unit as a whole.
*   `DeviationChildDeliveryCount` counts the units below that are marked `Missing`, `Damaged` or `Refused`, or have a content row received with another quantity than advised. A counted unit with such a row counts in both.

The status of the top delivery follows its order lines, as for any delivery.

* * *

## Receive the content of one unit per line

```
POST /api/Deliveries/{deliveryId}/ProcessGoodsReception?confirmOverDelivery=false
```

When the route names a unit, the [goods reception lines](goods-reception.md#goods-reception-line) are the counted content of that unit only, not of the units under it:

*   `DeliveredQuantity` is the counted quantity, and `ReceptionDeviationReasonCode` on a line says why it differs from the advised.
*   A content row the lines leave out is received with 0. A line with a negative quantity is ignored.
*   The goods are booked on the order lines of the top delivery, at most what is open on them unless `confirmOverDelivery=true`.
*   The booking uses the reception ID of the unit as `GoodsReceptionId`. A `GoodsReceptionId` on a line is still checked against earlier receptions.

The answer is then the [reception answer](sscc-reception.md#the-answer) of the unit: `200` when the unit is received, `409 Conflict` with the answer when it is left open, for example with `OverDelivery`.

## Receive goods that are in no unit

Goods that came without a usable SSCC, and goods on the shipment itself, are in no unit. They are on the order lines of the top delivery and are received per line with `POST /api/Deliveries/{topDeliveryId}/ProcessGoodsReception`, as on any delivery. The receiving advice shows them in `InNoUnitQuantity` of the order line.

The public `ProcessGoodsReception` on a top delivery does not stop you from receiving per line goods that are still in units. Goods received that way are booked twice when the unit is received later, or the unit stops with `OverDelivery` because nothing is open on its order line. Receive the goods in units through their units, and only the `InNoUnitQuantity` per line.

* * *

## Get the receiving advice

```
GET /api/Deliveries/{deliveryId}/ReceivingAdvice
```

Requires the **PurchaseOrderReadGroups** role. Read only.

The receiving advice says what was received against what was advised, per unit, per content row and per order line. Use it to build a receiving advice message for the supplier, such as an EANCOM RECADV or a Peppol Receipt Advice, when the supplier wants one. Omnium sends no such message itself.

*   Asked for the top delivery, or for any unit of it, the answer covers the whole despatch advice, with `Scope` `DespatchAdvice` and the top delivery in `TopDeliveryId`.
*   Asked for a delivery in no despatch advice, it covers the order lines of that delivery, with `Scope` `Delivery` and no units.
*   `404` when the delivery, or the top delivery of a unit, is not found. The counts are computed from the units as they are stored, at the moment of the call.

### How the quantities are derived

The differences of a content row are measured against its advised quantity, and only once its unit is handled. A unit that is not received yet is never short: its rows have no received quantity and no differences.

| The unit is | `ShortQuantity` | `OversuppliedQuantity` | `RejectedQuantity` |
| --- | --- | --- | --- |
| Received | Advised − received, not below 0 | Received − advised, not below 0 | 0 |
| Marked `Missing` | The advised quantity | 0 | 0 |
| Marked `Damaged` or `Refused` | 0 | 0 | The advised quantity |
| Not handled | Empty | Empty | Empty |

Inside a received unit Omnium cannot tell goods that were missing from goods the store took out and refused, so both are short. The `ReceptionDeviationReasonCode` of the row says why, as the store gave it.

Each order line sums its rows over the handled units into `ShortQuantity`, `OversuppliedQuantity` and `RejectedQuantity`, and adds:

| Field | How it is derived |
| --- | --- |
| `Quantity` | The quantity of the order line on this delivery. For a line the despatch advice split, the part it sent. For a line that was not ordered, the quantity it was added with. |
| `OrderedQuantity` | `Quantity`, or 0 for a line that was not ordered |
| `AdvisedInUnitsQuantity` | The advised quantities of its rows in all units |
| `InOpenUnitsQuantity` | The part of `AdvisedInUnitsQuantity` in units that are not handled |
| `InNoUnitQuantity` | `Quantity` − `CanceledQuantity` − `AdvisedInUnitsQuantity`, not below 0: what the line holds outside the units |
| `ReceivedQuantity` | The received quantity of the order line, from units and from receptions per line |
| `ReceivedInUnitsQuantity` | The received quantities of its rows in handled units. `ReceivedQuantity` − `ReceivedInUnitsQuantity` is what was received per line. |
| `OpenQuantity` | `Quantity` − `CanceledQuantity` − `ReceivedQuantity`, not below 0 |
| `OverOrderedQuantity` | What was received above `Quantity` − `CanceledQuantity`. For a line that was not ordered, all that was received. |

`IsReceptionComplete` is `true` when there is something to receive, every unit is received or marked, and every order line has nothing open or has received per line at least its `InNoUnitQuantity`. A unit marked `Damaged` therefore leaves its quantity open on the order line, and the reception can still be complete.

### Example

After the reception in the [example above](sscc-reception.md#example-receive-the-pallet-mark-a-carton-and-count-the-loose-carton):

```
GET /api/Deliveries/10452/ReceivingAdvice
```

```json
{
  "requestedDeliveryId": "10452",
  "topDeliveryId": "10452",
  "scope": "DespatchAdvice",
  "despatchAdviceNumber": "DA-20417",
  "despatchAdviceDate": "2026-03-02T00:00:00Z",
  "deliveryStatus": "InProgress",
  "warehouseCode": "store-12",
  "consigneeGln": "9520123000028",
  "supplierId": "SUP-0042",
  "supplierName": "Example Outdoor AS",
  "supplierGln": "9520123000011",
  "purchaseOrders": [
    {
      "purchaseOrderId": "PO-1042",
      "purchaseOrderNumber": "4500123",
      "supplierId": "SUP-0042",
      "supplierName": "Example Outdoor AS"
    }
  ],
  "created": "2026-03-02T06:15:03Z",
  "estimatedTimeOfDeparture": "2026-03-02T00:00:00Z",
  "estimatedTimeOfArrival": "2026-03-04T00:00:00Z",
  "firstReceivedDate": "2026-03-04T08:41:12Z",
  "lastReceivedDate": "2026-03-04T08:41:12Z",
  "childDeliveryCount": 4,
  "receivedChildDeliveryCount": 3,
  "deviationChildDeliveryCount": 2,
  "openChildDeliveryCount": 0,
  "isReceptionComplete": true,
  "units": [
    {
      "deliveryId": "10452-1",
      "parentDeliveryId": "10452",
      "unitType": "Pallet",
      "sscc": "395201230000041015",
      "deliveryStatus": "Completed",
      "isHandled": true,
      "isReceived": true,
      "hasDeviation": false,
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com",
      "rows": []
    },
    {
      "deliveryId": "10452-2",
      "parentDeliveryId": "10452-1",
      "unitType": "Carton",
      "sscc": "395201230000041022",
      "deliveryStatus": "Completed",
      "isHandled": true,
      "isReceived": true,
      "hasDeviation": false,
      "receptionMode": "AsAdvised",
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com",
      "receptionId": "6f0c2b8e4d1a4e7f9b3c5a2d8e1f0a47",
      "rows": [
        {
          "purchaseOrderId": "PO-1042",
          "lineItemId": "line-001",
          "lineNumber": "10",
          "skuId": "TENT-2P-GRN",
          "gtin": "9520123010102",
          "advisedQuantity": 10,
          "receivedQuantity": 10,
          "difference": 0,
          "shortQuantity": 0,
          "oversuppliedQuantity": 0,
          "rejectedQuantity": 0,
          "batchNumber": "L2603"
        }
      ]
    },
    {
      "deliveryId": "10452-3",
      "parentDeliveryId": "10452-1",
      "unitType": "Carton",
      "sscc": "395201230000041039",
      "deliveryStatus": "Completed",
      "isHandled": true,
      "isReceived": false,
      "hasDeviation": true,
      "receptionDeviation": "Damaged",
      "receptionDeviationNote": "Crushed corner, wet content",
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com",
      "rows": [
        {
          "purchaseOrderId": "PO-1042",
          "lineItemId": "line-002",
          "lineNumber": "20",
          "skuId": "STOVE-MINI",
          "gtin": "9520123010201",
          "advisedQuantity": 6,
          "receivedQuantity": 0,
          "difference": -6,
          "shortQuantity": 0,
          "oversuppliedQuantity": 0,
          "rejectedQuantity": 6
        }
      ]
    },
    {
      "deliveryId": "10452-4",
      "parentDeliveryId": "10452",
      "unitType": "Carton",
      "sscc": "395201230000041046",
      "deliveryStatus": "Completed",
      "isHandled": true,
      "isReceived": true,
      "hasDeviation": true,
      "receptionMode": "ContentChecked",
      "receivedDate": "2026-03-04T08:41:12Z",
      "receivedBy": "anna.berg@example.com",
      "receptionId": "b41d7e2a9c0f4b6a8e5d3c1f2a7b9e60",
      "rows": [
        {
          "purchaseOrderId": "PO-1042",
          "lineItemId": "line-001",
          "lineNumber": "10",
          "skuId": "TENT-2P-GRN",
          "gtin": "9520123010102",
          "advisedQuantity": 2,
          "receivedQuantity": 2,
          "difference": 0,
          "shortQuantity": 0,
          "oversuppliedQuantity": 0,
          "rejectedQuantity": 0,
          "batchNumber": "L2603"
        },
        {
          "purchaseOrderId": "PO-1042",
          "lineItemId": "line-003",
          "lineNumber": "30",
          "skuId": "BAG-SUMMER-M",
          "gtin": "9520123010300",
          "advisedQuantity": 4,
          "receivedQuantity": 3,
          "difference": -1,
          "shortQuantity": 1,
          "oversuppliedQuantity": 0,
          "rejectedQuantity": 0,
          "receptionDeviationReasonCode": "Short"
        },
        {
          "purchaseOrderId": "PO-1042",
          "lineItemId": "line-004",
          "skuId": "GAS-230",
          "gtin": "9520123010409",
          "advisedQuantity": 8,
          "receivedQuantity": 8,
          "difference": 0,
          "shortQuantity": 0,
          "oversuppliedQuantity": 0,
          "rejectedQuantity": 0
        }
      ]
    }
  ],
  "lines": [
    {
      "purchaseOrderId": "PO-1042",
      "lineItemId": "line-001",
      "lineNumber": "10",
      "skuId": "TENT-2P-GRN",
      "gtin": "9520123010102",
      "supplierSkuId": "EO-T2",
      "isNotOrdered": false,
      "quantity": 12,
      "orderedQuantity": 12,
      "canceledQuantity": 0,
      "advisedInUnitsQuantity": 12,
      "inOpenUnitsQuantity": 0,
      "inNoUnitQuantity": 0,
      "receivedQuantity": 12,
      "receivedInUnitsQuantity": 12,
      "openQuantity": 0,
      "overOrderedQuantity": 0,
      "shortQuantity": 0,
      "oversuppliedQuantity": 0,
      "rejectedQuantity": 0
    },
    {
      "purchaseOrderId": "PO-1042",
      "lineItemId": "line-002",
      "lineNumber": "20",
      "skuId": "STOVE-MINI",
      "gtin": "9520123010201",
      "isNotOrdered": false,
      "quantity": 6,
      "orderedQuantity": 6,
      "canceledQuantity": 0,
      "advisedInUnitsQuantity": 6,
      "inOpenUnitsQuantity": 0,
      "inNoUnitQuantity": 0,
      "receivedQuantity": 0,
      "receivedInUnitsQuantity": 0,
      "openQuantity": 6,
      "overOrderedQuantity": 0,
      "shortQuantity": 0,
      "oversuppliedQuantity": 0,
      "rejectedQuantity": 6
    },
    {
      "purchaseOrderId": "PO-1042",
      "lineItemId": "line-003",
      "lineNumber": "30",
      "skuId": "BAG-SUMMER-M",
      "gtin": "9520123010300",
      "isNotOrdered": false,
      "quantity": 4,
      "orderedQuantity": 4,
      "canceledQuantity": 0,
      "advisedInUnitsQuantity": 4,
      "inOpenUnitsQuantity": 0,
      "inNoUnitQuantity": 0,
      "receivedQuantity": 3,
      "receivedInUnitsQuantity": 3,
      "openQuantity": 1,
      "overOrderedQuantity": 0,
      "shortQuantity": 1,
      "oversuppliedQuantity": 0,
      "rejectedQuantity": 0
    },
    {
      "purchaseOrderId": "PO-1042",
      "lineItemId": "line-004",
      "skuId": "GAS-230",
      "gtin": "9520123010409",
      "origin": "AddedByDespatchAdvice",
      "isNotOrdered": true,
      "quantity": 8,
      "orderedQuantity": 0,
      "canceledQuantity": 0,
      "advisedInUnitsQuantity": 8,
      "inOpenUnitsQuantity": 0,
      "inNoUnitQuantity": 0,
      "receivedQuantity": 8,
      "receivedInUnitsQuantity": 8,
      "openQuantity": 0,
      "overOrderedQuantity": 8,
      "shortQuantity": 0,
      "oversuppliedQuantity": 0,
      "rejectedQuantity": 0
    }
  ],
  "warnings": [
    {
      "code": "DespatchAdviceLineAdded",
      "message": "Item GAS-230 was not ordered, so order line line-004 with quantity 8 was added to purchase order PO-1042",
      "reference": "line-004"
    }
  ]
}
```

### Receiving advice fields

| Field | Type | Description |
| --- | --- | --- |
| `RequestedDeliveryId` | string | The delivery the advice was asked for |
| `TopDeliveryId` | string | The top delivery of the despatch advice, also when a unit was asked for, or the delivery itself for `Scope` `Delivery` |
| `Scope` | string | `DespatchAdvice` or `Delivery` |
| `DespatchAdviceNumber` | string | The sender's despatch advice number |
| `DespatchAdviceDate` | datetime | The date of the despatch advice, as the sender stated it, without the time |
| `DeliveryStatus` | string | The status of the top delivery |
| `WarehouseCode` | string | The store the goods are for |
| `ConsigneeGln` | string | The GLN of the receiver, as the despatch advice stated it |
| `SupplierId` | string | The supplier in Omnium |
| `SupplierName` | string | The name of the supplier, as the despatch advice stated it, or as the purchase order has it |
| `SupplierGln` | string | The GLN of the supplier, as the despatch advice stated it |
| `PurchaseOrders` | array | The purchase orders the goods were ordered on: `PurchaseOrderId`, `PurchaseOrderNumber`, `SupplierId`, `SupplierName` |
| `Created` | datetime | When the top delivery was created. For a delivery that became the top delivery of a despatch advice, that is before the despatch advice was taken in. |
| `EstimatedTimeOfDeparture` | datetime | When the goods left the supplier |
| `EstimatedTimeOfArrival` | datetime | When the goods are expected in the store |
| `FirstReceivedDate` | datetime | The first time goods were received: the earliest received date of a unit or first received date of an order line |
| `LastReceivedDate` | datetime | The latest received date of a unit or first received date of an order line |
| `ChildDeliveryCount` | int | The number of units |
| `ReceivedChildDeliveryCount` | int | The units completed without a deviation for the unit as a whole |
| `DeviationChildDeliveryCount` | int | The units marked `Missing`, `Damaged` or `Refused`, or with a row received with another quantity than advised |
| `OpenChildDeliveryCount` | int | The units that are neither received nor marked |
| `IsReceptionComplete` | bool | See [How the quantities are derived](sscc-reception.md#how-the-quantities-are-derived) |
| `Units` | array | The units in tree order: each unit followed by the units under it |
| `Lines` | array | The order lines of the top delivery |
| `Warnings` | array | The warnings of the despatch advice intake: `Code`, `Message`, `Reference` |

Each unit:

| Field | Type | Description |
| --- | --- | --- |
| `DeliveryId` | string | The unit |
| `ParentDeliveryId` | string | The pallet or the top delivery it is on |
| `UnitType` | string | `Pallet`, `Carton`, `Parcel`, `RollCage`, `Container` or `Other` |
| `Sscc` | string | The SSCC |
| `Barcode` | string | Another barcode of the unit, such as a carrier package ID |
| `DeliveryStatus` | string | The status of the unit |
| `IsHandled` | bool | Received, or marked `Missing`, `Damaged` or `Refused` |
| `IsReceived` | bool | Received without a deviation for the unit as a whole |
| `HasDeviation` | bool | Marked, or a row received with another quantity than advised |
| `ReceptionDeviation` | string | `Missing` (did not arrive), `Damaged` (arrived damaged and was not taken into stock) or `Refused` (the store did not accept it) |
| `ReceptionDeviationNote` | string | The note the store gave with the deviation |
| `ReceptionMode` | string | `AsAdvised` or `ContentChecked` |
| `ReceivedDate` | datetime | When the unit was received or marked |
| `ReceivedBy` | string | Who received or marked it |
| `ReceptionId` | string | The ID of the stock booking, as `GoodsReceptionId` on its inventory transactions |
| `Rows` | array | The content rows. A pallet that holds only cartons has none. |

Each row has `PurchaseOrderId`, `LineItemId`, `LineNumber`, `SkuId`, `Gtin`, `AdvisedQuantity`, `ReceivedQuantity`, `Difference` (received − advised), `ShortQuantity`, `OversuppliedQuantity`, `RejectedQuantity`, `ReceptionDeviationReasonCode`, and the advised `BatchNumber`, `BestBeforeDate`, `ExpiryDate` and `SerialNumbers`. `AdvisedQuantity` is 0 for a row the store counted that was not advised in the unit.

Each order line has `PurchaseOrderId`, `LineItemId`, `LineNumber`, `SkuId`, `Gtin`, `SupplierSkuId`, `Origin`, `IsNotOrdered`, `CanceledQuantity` and the quantities in [How the quantities are derived](sscc-reception.md#how-the-quantities-are-derived). Its `ReceptionDeviationReasonCode` is empty: a reception per line does not store a reason code.

### Build a receiving advice message

A receiving advice message reports per logistic unit and per item:

*   Report each unit by its `Sscc`, with its condition from `ReceptionDeviation`, and its rows with the received quantity and the short, oversupplied and rejected quantities. The reason code of a row says why a quantity differs.
*   Report goods that were received per line, outside the units, from the order lines: `ReceivedQuantity` − `ReceivedInUnitsQuantity`.
*   Report items that were not ordered from the lines with `IsNotOrdered`.
*   Send the message when `IsReceptionComplete` is `true`, or when your supplier agreement says so.

How each quantity maps to a qualifier of the message format is for your integration to decide.

* * *

## Related

*   [Despatch advice (ASN)](despatch-advice.md)
*   [Delivery API reference](delivery-api.md)
*   [Goods reception](goods-reception.md)
*   [Delivery configuration](delivery-config.md#despatch-advice-reception)

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
