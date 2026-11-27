# Despatch Advice (ASN)

Source: https://docs.omnium.no/docs/PurchaseOrders/Deliveries/despatch-advice

> Send a despatch advice (ASN, DESADV) to Omnium so a delivery is built with one unit per pallet and carton that the store receives by scanning the SSCC label.

A **despatch advice** tells the buyer what the supplier has shipped: which purchase order the goods belong to, how they are packed, and what is in each pallet and carton. It is also called an ASN (advance shipping notice) or, in EANCOM, a DESADV. Your ERP or integration platform receives the despatch advice from the supplier and sends it to Omnium with one call.

Each pallet and carton carries a logistic label with an **SSCC** (Serial Shipping Container Code): an 18-digit GS1 number that identifies that one package. On the label it follows the GS1 application identifier `(00)`, and its last digit is a check digit. Because the despatch advice tells Omnium what is in each SSCC, the store can receive a whole pallet or carton with one scan of its label, in the In-Store App, instead of counting every item.

This page covers the intake: how Omnium models a despatch advice, the request, how the purchase order and its lines are found, what is rejected, the warnings, and what a resend does. [Receiving by SSCC](sscc-reception.md) covers what your ERP can read and do afterwards.

* * *

## How Omnium models a despatch advice

A despatch advice becomes a tree of [deliveries](../Deliveries.md):

*   **The top delivery** stands for the shipment. It holds the purchase order lines of the despatch advice, whole: an order line is never split over pallets and cartons. It has `UnitType` `Shipment`, the sender's `DespatchAdviceNumber`, its own ID in `RootDeliveryId`, and the number of units under it in `ChildDeliveryCount`. The top delivery is the delivery that connected systems see, export and receive per line, as any other delivery.
*   **A unit** is a delivery for one pallet, carton or other package that has a usable SSCC or a carrier package ID. Its ID is the ID of the top delivery and a running number in the order of the message: `10452-1`, `10452-2`. `ParentDeliveryId` names the unit it stands on or is packed in, or the top delivery, and `RootDeliveryId` names the top delivery. A unit has no order lines of its own.
*   **The content rows** of a unit, in `UnitLines`, say what the unit holds. Each row points at an order line on the top delivery by `PurchaseOrderId` and `LineItemId`, with the advised `Quantity` in this unit, and the batch, dates and serial numbers as advised. Items of the same order line with the same batch and dates in the same unit are one row.

A package without a usable SSCC or carrier package ID gets no delivery of its own. Its items go on the nearest unit above it, or, when there is none, they are goods **in no unit**: they are on the order lines of the top delivery and are received per line, as on any delivery. Packages of type `shipment` never become units, so items placed directly on the shipment are in no unit too. A pallet that holds only cartons has no content rows of its own.

The example on this page builds this tree:

Units are deliveries, but they stay out of the way of an integration that does not know them: delivery lists leave them out unless you ask for them, they are never exported, and a delivery update cannot cut a unit out of its tree. See [What changes for an existing integration](delivery-api.md#what-changes-for-an-existing-integration).

* * *

## Send a despatch advice

```
POST /api/Deliveries/DespatchAdvice
Content-Type: application/json
```

The endpoint requires the **PurchaseOrderAdminGroups** role. The body has the shape of the supplier's message: a header, and the packages in the order of the message, each with its items. The shipment, a pallet and a carton are all packages, and a package names its parent by its hierarchy identity. Send one despatch advice per call.

### Despatch advice

| Field | Type | Description |
| --- | --- | --- |
| `DespatchAdviceNumber` | string | Required. The sender's number of the despatch advice. The same number from the same supplier is the same despatch advice, see [Send a despatch advice again](despatch-advice.md#send-a-despatch-advice-again). |
| `DespatchAdviceDate` | datetime | The date of the despatch advice. Stored as the delivery property `despatchAdviceDate`, as a date without the time, and returned in the receiving advice. |
| `ShippingDate` | datetime | When the goods are shipped. Stored as `EstimatedTimeOfDeparture`. |
| `EstimatedDeliveryDate` | datetime | When the goods are expected in the store. Stored as `EstimatedTimeOfArrival` on the top delivery and on every unit. |
| `PurchaseOrderNumber` | string | The buyer's order number, which is the purchase order number in Omnium. It covers every item that names no purchase order of its own. |
| `PurchaseOrderId` | string | Omnium's purchase order ID, for a sender that knows it. Used when no purchase order number is given or found. |
| `Supplier` | object | The supplier, see [Party](despatch-advice.md#party). Stored as the delivery properties `supplierGln` and `supplierName`. |
| `Consignee` | object | The receiving store, see [Party](despatch-advice.md#party). Stored as the delivery properties `consigneeGln`, `consigneeName` and `consigneeInternalId`. |
| `TrackingNumber` | string | The carrier's tracking number of the shipment. Stored as `DeliveryTrackingNumber`. |
| `TrackingUrl` | string | A link to track the shipment. Stored as `DeliveryTrackingLink`. |
| `Carrier` | string | The carrier. Stored as `DeliveryProvider`. |
| `IsContentCheckRequired` | bool | The sender asks for the content of the units to be checked at reception. A unit of such a despatch advice cannot be received as advised, whatever the tenant setting [Require content check](delivery-config.md#despatch-advice-reception) says. |
| `CancelRemainingQuantities` | bool | The supplier sends no more on the order lines of this despatch advice. What is left on these lines, outside the delivery, is cancelled. Other lines of the order are not touched. |
| `Properties` | object | Other data of the message as key-value pairs of strings, such as weight, volume and total packages. Stored as they come in the `Properties` of the top delivery. A pair without a key or a value is left out. |
| `Packages` | array | The packages of the message, in the order of the message. See [Package](despatch-advice.md#package). |

The dates, tracking fields and carrier are written only when the message has them, so a value the delivery already has is kept when the message leaves it out.

### Party

| Field | Type | Description |
| --- | --- | --- |
| `Gln` | string | The GS1 Global Location Number |
| `Name` | string | The name |
| `InternalId` | string | The buyer's own ID of the party. For the consignee, the store ID in Omnium: when it differs from the store of the purchase order, the intake gives the warning `DespatchAdviceConsigneeStore`. |

### Package

| Field | Type | Description |
| --- | --- | --- |
| `HierarchyIdentity` | string | The ID of the package within the message |
| `ParentHierarchyIdentity` | string | The hierarchy identity of the package this one stands on or is packed in. Empty, or the identity of a `shipment` package, for a package directly on the shipment. |
| `PackageType` | string | `shipment` for the shipment as a whole. `CT` or `BX` give the unit type `Carton`, `PX` or `PE` give `Pallet`. `Pallet`, `Carton`, `Parcel`, `RollCage`, `Container` and `Other` are taken as they are, and any other value gives `Other`. The case does not matter. The unit type is shown to the user and is not used in any rule. |
| `Sscc` | string | The SSCC on the label. See [How the SSCC is read](despatch-advice.md#how-the-sscc-is-read). |
| `CarrierPackageId` | string | Another code on the package, such as the carrier's package ID. Stored as the `Barcode` of the unit, and a scan of it finds the unit. A package with a carrier package ID and no SSCC also becomes a unit. An empty value or one of only zeros counts as none. |
| `TrackingUrl` | string | A link to track the package. Stored as the `DeliveryTrackingLink` of the unit. |
| `Properties` | object | Other data of the package as key-value pairs of strings. Stored in the `Properties` of the unit, together with `packageType` and `hierarchyIdentity`. |
| `Items` | array | The items in the package. See [Item](despatch-advice.md#item). |

### Item

| Field | Type | Description |
| --- | --- | --- |
| `PurchaseOrderNumber` | string | The buyer's order number, when the item is on another purchase order than the one in the header |
| `PurchaseOrderId` | string | Omnium's purchase order ID, when the item is on another purchase order than the one in the header |
| `PurchaseOrderLineNumber` | string | The buyer's line number, matched against `LineNumber` on the order lines |
| `LineItemId` | string | Omnium's order line ID, for a sender that knows it |
| `SkuId` | string | Omnium's SKU ID, for a sender that knows it |
| `Gtins` | array of string | Every barcode the message has for the item, EAN-13, UPC-A and GTIN-14 alike. Leading zeros are ignored when barcodes are compared. The first one is stored as the `Gtin` of the content row. |
| `SupplierItemId` | string | The supplier's item number. Used as `SupplierSkuId` on an order line the intake adds, when the product has none. |
| `Description` | string | The description of the item. Used as `DisplayName` on an order line the intake adds, when the product has none, and named in the warning for an item Omnium cannot find. |
| `Quantity` | decimal | The quantity of the item in the package. An item with 0 or less is not taken in. |
| `UnitOfMeasure` | string | The unit of the quantity, such as `PCE` or `PR`. See the warning `DespatchAdviceUnitOfMeasure`. |
| `Price` | decimal | The price of an item that was not ordered, used on the order line the intake adds, in the currency of the purchase order. Without it, the product's cost price is used. |
| `BatchNumber` | string | The batch or lot number |
| `BestBeforeDate` | datetime | The best before date |
| `ExpiryDate` | datetime | The expiry date |
| `SerialNumbers` | array of string | The serial numbers of the items |
| `Properties` | object | Other data of the item as key-value pairs of strings, such as dimensions, customs number and country of origin. Written into the `Properties` of the order line: a key the line has gets the new value, and other keys are added. |

### How the SSCC is read

Omnium reads an SSCC in the message the same way it reads a scan of the label:

1.  A leading `]C1` or `C1` (the GS1-128 symbology identifier), spaces and brackets are removed, so `(00) 3 9520123 000004101 5` is read.
2.  A value of 20 digits that starts with `00` loses the `00`. A longer value that starts with `00` gives the 18 characters after it.
3.  An empty value, or one of only zeros, is no SSCC, and the package gets no delivery of its own unless it has a carrier package ID.
4.  18 digits is an SSCC. A wrong check digit gives the warning `DespatchAdviceSsccCheckDigit`, and the SSCC is kept as it is, so a scan of the label still finds the unit.
5.  Anything else gives the warning `DespatchAdviceSsccNotReadable`, and the value is not used.

### Example: a pallet with two cartons and a loose carton

Purchase order `PO-1042` (number `4500123`) for store `store-12` has three lines: `line-001` with 12 × `TENT-2P-GRN` (line number 10), `line-002` with 6 × `STOVE-MINI` (20) and `line-003` with 6 × `BAG-SUMMER-M` (30). The supplier ships a pallet with two cartons and one loose carton. The loose carton also holds a gas cartridge that was not ordered, and its SSCC is sent with the application identifier `00` in front.

```json
{
  "despatchAdviceNumber": "DA-20417",
  "despatchAdviceDate": "2026-03-02T00:00:00Z",
  "shippingDate": "2026-03-02T00:00:00Z",
  "estimatedDeliveryDate": "2026-03-04T00:00:00Z",
  "purchaseOrderNumber": "4500123",
  "supplier": { "gln": "9520123000011", "name": "Example Outdoor AS" },
  "consignee": { "gln": "9520123000028", "name": "Example Store Oslo", "internalId": "store-12" },
  "trackingNumber": "EXF123456789",
  "trackingUrl": "https://tracking.example.com/EXF123456789",
  "carrier": "Example Freight",
  "isContentCheckRequired": false,
  "cancelRemainingQuantities": false,
  "properties": { "totalPackages": "4", "grossWeight": "212.5" },
  "packages": [
    { "hierarchyIdentity": "1", "packageType": "shipment" },
    {
      "hierarchyIdentity": "2",
      "parentHierarchyIdentity": "1",
      "packageType": "PX",
      "sscc": "395201230000041015"
    },
    {
      "hierarchyIdentity": "3",
      "parentHierarchyIdentity": "2",
      "packageType": "CT",
      "sscc": "395201230000041022",
      "items": [
        {
          "purchaseOrderLineNumber": "10",
          "gtins": ["9520123010102"],
          "supplierItemId": "EO-T2",
          "description": "Tent 2P green",
          "quantity": 10,
          "unitOfMeasure": "PCE",
          "batchNumber": "L2603"
        }
      ]
    },
    {
      "hierarchyIdentity": "4",
      "parentHierarchyIdentity": "2",
      "packageType": "CT",
      "sscc": "395201230000041039",
      "items": [
        { "purchaseOrderLineNumber": "20", "gtins": ["9520123010201"], "quantity": 6, "unitOfMeasure": "PCE" }
      ]
    },
    {
      "hierarchyIdentity": "5",
      "parentHierarchyIdentity": "1",
      "packageType": "CT",
      "sscc": "00395201230000041046",
      "items": [
        { "purchaseOrderLineNumber": "10", "gtins": ["9520123010102"], "quantity": 2, "unitOfMeasure": "PCE", "batchNumber": "L2603" },
        { "purchaseOrderLineNumber": "30", "gtins": ["9520123010300"], "quantity": 4, "unitOfMeasure": "PCE" },
        { "gtins": ["9520123010409"], "description": "Gas cartridge 230 g", "quantity": 8, "unitOfMeasure": "PCE", "price": 39.0 }
      ]
    }
  ]
}
```

Omnium builds the tree in the diagram above:

*   The top delivery `10452` gets the whole of `line-001` (10 + 2 advised, all that is open) and `line-002`. Of `line-003`, 4 are advised and 6 are open, so the line is split: 4 go on the delivery, and a new line with the remaining 2 stays on the purchase order without a delivery.
*   The gas cartridge is on no line of the order, but a product in Omnium has its barcode, so the intake adds order line `line-004` with 8 × `GAS-230` and the warning `DespatchAdviceLineAdded`.
*   The pallet becomes unit `10452-1` and has no content rows. The cartons become `10452-2` and `10452-3` under it. The loose carton becomes `10452-4` under the top delivery, with the SSCC `395201230000041046`.

**Response** (`200 OK`, the delivery abridged):

```json
{
  "result": "Created",
  "delivery": {
    "id": "10452",
    "deliveryStatus": "New",
    "orderType": "PurchaseOrder",
    "warehouseCode": "store-12",
    "suppliers": ["Example Outdoor AS"],
    "supplierIds": ["SUP-0042"],
    "estimatedTimeOfDeparture": "2026-03-02T00:00:00Z",
    "estimatedTimeOfArrival": "2026-03-04T00:00:00Z",
    "deliveryTrackingNumber": "EXF123456789",
    "deliveryTrackingLink": "https://tracking.example.com/EXF123456789",
    "deliveryProvider": "Example Freight",
    "rootDeliveryId": "10452",
    "unitType": "Shipment",
    "despatchAdviceNumber": "DA-20417",
    "isContentCheckRequired": false,
    "childDeliveryCount": 4,
    "receivedChildDeliveryCount": 0,
    "deviationChildDeliveryCount": 0
  },
  "unitCount": 4,
  "warnings": [
    {
      "code": "DespatchAdviceLineAdded",
      "message": "Item GAS-230 was not ordered, so order line line-004 with quantity 8 was added to purchase order PO-1042",
      "reference": "line-004"
    }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `Result` | string | `Created` for a new despatch advice, `Updated` when it was taken in before with other content and its units were built again, `Unchanged` when the same message was taken in before |
| `Delivery` | object | The top delivery |
| `UnitCount` | int | The number of units under the top delivery, on all levels |
| `Warnings` | array | What Omnium could not take in as sent: `Code`, `Message` and `Reference`. See [Warnings](despatch-advice.md#warnings). |

To read the units, search with `rootDeliveryId` set to the ID of the top delivery. See [Read the units of a despatch advice](sscc-reception.md#read-the-units-of-a-despatch-advice).

* * *

## How the purchase order and the lines are found

### The purchase order

Each item belongs to the purchase order it names in `PurchaseOrderNumber` or `PurchaseOrderId`, or else to the purchase order in the header. One despatch advice can cover several purchase orders. For each purchase order, Omnium looks for:

1.  A purchase order with that purchase order number.
2.  A purchase order whose ID is that value.
3.  A purchase order with the `PurchaseOrderId`.

A cancelled or deleted purchase order counts as not found. When a purchase order the message names is not found, the whole message is rejected with `404` and nothing is stored.

### The order line

Within its purchase order, an item is matched to an order line like this:

1.  `LineItemId`, when the order has that line. When it does not, the intake gives the warning `DespatchAdviceLineItemIdNotFound` and goes on with the other codes.
2.  `SkuId`: the lines with that SKU.
3.  `Gtins`: first the lines whose own `Ean` or `Gtin` is one of the barcodes, then the lines whose product has it as its EAN, as one of its GTINs, or on a product unit with conversion factor 1. The barcode of a pack (a product unit with another conversion factor) is no match, because the quantity would be in packs.
4.  `PurchaseOrderLineNumber` alone, only for an item that has no line item ID, SKU or barcode.

When several lines have the item, the line number decides between them. Among the lines that are left, a line already on the top delivery of this despatch advice comes first, then an open line without a delivery, then an open line on another delivery. When more than one line is still equal, the item goes on the first, with the warning `DespatchAdviceLineAmbiguous`. A line with nothing left to receive comes last; when every line with the item has nothing left to receive, the item is not taken in, with the warning `DespatchAdviceLineClosed`.

### Items that were not ordered

An item that is on no line of its order, but whose SKU or barcode is on a product in Omnium, is added to the purchase order as a new order line:

*   `Origin` is `AddedByDespatchAdvice` and `AddedDate` is when it was added.
*   The quantity is the sum of the items of that product on that order in the message.
*   The price is `Price` from the message, or the product's cost price.
*   The line goes on the top delivery, and the intake gives the warning `DespatchAdviceLineAdded` with the new line item ID as reference.

A purchase order update from your ERP keeps such a line even though the ERP does not know it. See [What changes for an existing integration](delivery-api.md#what-changes-for-an-existing-integration).

### What goes on the top delivery

Omnium sums what the message advises for each order line that is on no delivery yet. When that is what is open on the line or more, the whole line goes on the top delivery, and the surplus is an over-delivery that is confirmed at reception. When it is less, the line is split once: the advised quantity goes on the top delivery, and the rest stays on the purchase order without a delivery, or is cancelled when `CancelRemainingQuantities` is set. A line that is already on the delivery that becomes the top delivery stays as it is, whole.

The top delivery is:

*   The delivery this despatch advice built before, when the same number comes again from the same supplier.
*   Otherwise, when the matched order lines are already on one delivery, that delivery, as long as it is no unit, belongs to no other despatch advice, has no units, is not received, has no received lines, and is not `InProgress`, `Completed` or `Cancelled`. It keeps its ID.
*   Otherwise a new delivery, which gets the store, the order type and the tags of the first purchase order.

The message is rejected with `409 LinesOnOtherDelivery`, and `DeliveryIds` names the deliveries, when the matched lines are on more than one delivery, on a delivery that cannot become the top delivery, or, for a despatch advice taken in before, on any other delivery than its top delivery.

* * *

## Rejections

A rejected despatch advice stores nothing. The body names the reason:

```json
{
  "error": "PurchaseOrderNotFound",
  "message": "No open purchase order 4500123 in Omnium"
}
```

| Status | `error` | When |
| --- | --- | --- |
| `400` | `MissingDespatchAdviceNumber` | The body or `DespatchAdviceNumber` is missing |
| `400` | `TooLarge` | More than 500 packages or 5,000 item rows |
| `400` | `NoItems` | No package has an item |
| `404` | `PurchaseOrderNotFound` | The message names no purchase order, or a purchase order it names is not in Omnium or is cancelled or deleted |
| `409` | `LinesOnOtherDelivery` | The matched order lines are on more than one delivery, or on a delivery that cannot become the top delivery. `DeliveryIds` names them. |
| `409` | `AlreadyReceived` | The despatch advice was taken in before with other content, and goods of it are received. `DeliveryIds` names the top delivery. |
| `409` | `ResourceLocked` | Another call is taking in the same despatch advice, or holds the lock of one of its purchase orders. The body has the shape of the other lock answers of the API (`error`, `message`, `retryAfter`, `lockHolder`, `lockedSince`, `operation`). Try again. |
| `500` | `Failed` | Building the delivery failed. Send the same message again. |

`Failed` is the one answer after which part of the tree can be stored. A top delivery with lines stays, without the mark that its tree is complete, so the same message sent again builds the tree again and answers `Updated`.

* * *

## Warnings

The intake is tolerant: a problem with a package or an item does not stop the rest of the message. Each problem is a warning in the answer, with a code, a message and a reference to the package, barcode or order line it is about. The warnings are also stored on the top delivery and returned in the [receiving advice](sscc-reception.md#get-the-receiving-advice). When a despatch advice is built again, its warnings are replaced.

| Code | Meaning | Reference |
| --- | --- | --- |
| `DespatchAdviceParentIsSelf` | A package names itself as parent. It is placed on the shipment. | Hierarchy identity |
| `DespatchAdviceParentCycle` | A package is part of a circle of parents. Every package of the circle is placed on the shipment. | Hierarchy identity |
| `DespatchAdviceParentUnknown` | A package names a parent that is not in the message. It is placed on the shipment. | Hierarchy identity |
| `DespatchAdviceHierarchyIdentityRepeated` | A package repeats the hierarchy identity of an earlier package. It is placed on the shipment. | Hierarchy identity |
| `DespatchAdviceSsccNotReadable` | The SSCC is not 18 digits, so it is not used | Hierarchy identity |
| `DespatchAdviceSsccCheckDigit` | The SSCC has a wrong check digit. It is kept, so a scan of the label finds the unit. | Hierarchy identity |
| `DespatchAdviceSsccRepeated` | The same SSCC is on more than one package of the message. Each becomes a unit, and a scan finds them all. | SSCC |
| `DespatchAdviceSsccOnOpenDelivery` | The SSCC is also on a unit of another despatch advice that is not received. A scan finds both. | SSCC |
| `DespatchAdviceItemNotIdentified` | An item has no barcode, SKU, line item ID or line number. It is not taken in. | Item |
| `DespatchAdviceItemWithoutQuantity` | An item has the quantity 0 or less. It is not taken in. | Item |
| `DespatchAdviceItemNotFound` | An item is on no line of the order, and no product in Omnium has it. It is not taken in. | Item |
| `DespatchAdvicePackagingUnitBarcode` | An item has the barcode of a pack, so its quantity would be in packs. It is not taken in. | Item |
| `DespatchAdviceLineAmbiguous` | More than one order line has the item, and the line number does not decide. The item goes on the first. | Item |
| `DespatchAdviceLineClosed` | The item's order line has nothing left to receive. The item is not taken in. | Item |
| `DespatchAdviceLineItemIdNotFound` | The order has no line with the item's `LineItemId`. The item is matched by its other codes. | Item |
| `DespatchAdviceLineAdded` | An item that was not ordered got an order line of its own | The new line item ID |
| `DespatchAdviceUnitOfMeasure` | Item rows have a unit of measure that is not a piece or a pair. The quantity is used as it is, in the unit of the order line. One warning per unit of measure. | The unit of measure |
| `DespatchAdviceConsigneeStore` | The consignee's internal ID is another store than the store of the purchase order | The consignee's internal ID |

An item is referred to by its first barcode, or else its SKU, line item ID, supplier item ID or line number.

The units of measure that count as a piece or a pair are `PCE`, `PCS`, `PC`, `EA`, `EACH`, `H87`, `C62`, `PIECE`, `PIECES`, `ST`, `STK`, `STYK`, `PR`, `NPR`, `PAI`, `PAIR`, `PAIRS` and `PAR`, in any case.

* * *

## Send a despatch advice again

Suppliers number their despatch advices on their own, so a despatch advice is known by its number and its supplier: the supplier of the purchase orders, or, when they have none, the supplier GLN of the message.

| What you send | What happens |
| --- | --- |
| The same message again | Nothing changes. The answer is `Unchanged`, with the top delivery and the warnings that are stored. Omnium compares the content: the formatting of the JSON, the order of the fields in an object, and a field sent as `null` or left out make no difference. Any other change, including the order of the packages, the items or the keys of `properties`, counts as other content. |
| The same number with other content, while nothing of it is received | The tree is built again from the new message. The answer is `Updated`. Units are written again by their running number, units the new message no longer has are deleted, order lines are added for items that are new, and the warnings are replaced. Order lines already on the top delivery stay on it. |
| The same number with other content, after goods of it are received | Rejected with `409 AlreadyReceived`. Goods count as received when the top delivery is `InProgress` or `Completed`, when a unit is received, marked Missing, Damaged or Refused, or has a reception started, or when goods are received on an order line of the top delivery. |

* * *

## Limits

*   At most 500 packages and 5,000 item rows per despatch advice.
*   A unit exists only when the despatch advice has it. A pallet or carton that arrives without being in the despatch advice cannot be added as a unit: its goods are received per line on the top delivery.
*   A package without a usable SSCC or carrier package ID is not a unit. Its goods are in the unit above it, or in no unit.
*   The unit type comes from the sender's package type and is not used in any rule.
*   The intake raises delivery events for the top delivery, as creating a delivery and adding lines to it does. It has no event type of its own, and units raise no events when they are created.

* * *

## Map a B24 despatch advice to the request

The request follows the despatch advice of B24 closely. This is how the fields of a B24 despatch advice map to the request and where they end up in Omnium.

| In the B24 despatch advice | Request field | In Omnium |
| --- | --- | --- |
| Document reference `DespatchAdvice` | `despatchAdviceNumber` | `DespatchAdviceNumber` on the top delivery |
| Despatch advice date | `despatchAdviceDate` | The delivery property `despatchAdviceDate` |
| Document reference `BuyerOrder`, in the header or on the item | `purchaseOrderNumber` | Finds the purchase order |
| Line number of the `BuyerOrder` reference on the item | `purchaseOrderLineNumber` | Matched against `LineNumber` on the order lines |
| `shippingDate` | `shippingDate` | `EstimatedTimeOfDeparture` |
| `estimatedDeliveryDate`, or `deliveryDate` | `estimatedDeliveryDate` | `EstimatedTimeOfArrival` |
| Supplier with GLN and name | `supplier` | The delivery properties `supplierGln` and `supplierName` |
| Consignee with GLN and internal ID | `consignee` | Checked against the store of the purchase order, and stored in the delivery properties |
| Package of type `shipment` | An entry in `packages` with `packageType` `shipment` | The top delivery. It never becomes a unit. |
| Package with an SSCC and a parent | An entry in `packages` with `sscc` and `parentHierarchyIdentity` | A unit with `Sscc` and `ParentDeliveryId` |
| Package type `CT`, `BX`, `PX`, `PE` | `packageType` | `UnitType`: `Carton` for `CT` and `BX`, `Pallet` for `PX` and `PE`. See `PackageType` in [Package](despatch-advice.md#package) for the other values. |
| The carrier's package ID | `carrierPackageId` | `Barcode` of the unit |
| `trackingUrl` of a package | `trackingUrl` | `DeliveryTrackingLink` of the unit |
| Item references EAN-13 and UPC-A | `gtins` | Matched against `Ean` and `Gtin` on the order lines and the barcodes of their products |
| Supplier's item ID | `supplierItemId` | `SupplierSkuId` on an order line the intake adds, when the product has none |
| Item description | `description` | `DisplayName` on an order line the intake adds, when the product has none |
| Quantity and unit of measure | `quantity`, `unitOfMeasure` | The advised quantity of the content row |
| Batch, best before date, expiry date, serial numbers | `batchNumber`, `bestBeforeDate`, `expiryDate`, `serialNumbers` | The content row of the unit |
| Dimensions, customs number, country of origin | `properties` of the item | `Properties` on the order line |
| Header and package properties, such as total packages and weight | `properties` | `Properties` on the delivery or the unit |

* * *

## Related

*   [Receiving by SSCC](sscc-reception.md)
*   [Delivery API reference](delivery-api.md)
*   [Delivery configuration](delivery-config.md#despatch-advice-reception)
*   [Goods reception](goods-reception.md)

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
