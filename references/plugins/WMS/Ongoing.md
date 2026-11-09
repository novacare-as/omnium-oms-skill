# Ongoing WMS

Source: https://docs.omnium.no/docs/plugins/WMS/Ongoing

> Comprehensive technical documentation for the Omnium Ongoing Warehouse Management System integration. Learn how to configure, sync orders, inventory, products, and deliveries with Ongoing WMS.

The Omnium Ongoing integration provides a bidirectional synchronization between Omnium OMS and [Ongoing Warehouse](https://www.ongoingwarehouse.com/) (WMS). This integration enables automated warehouse fulfillment workflows including order export, inventory synchronization, product management, delivery tracking, and return processing.

## Overview

The integration supports:

*   **Order Export**: Exports orders to Ongoing for warehouse fulfillment
*   **Order Sync**: Receives order status updates (shipped, picked, canceled) from Ongoing
*   **Inventory Sync**: Synchronizes stock levels from Ongoing warehouses
*   **Product Export**: Exports product/article data to Ongoing
*   **Delivery Export**: Exports purchase orders (inbound deliveries) to Ongoing
*   **Purchase Order Sync**: Receives goods reception updates from Ongoing
*   **Return Sync**: Processes returns registered in Ongoing

## Architecture

```
┌─────────────┐                    ┌─────────────────┐
│   Omnium    │◄──────────────────►│  Ongoing WMS    │
│     OMS     │   REST API         │                 │
└─────────────┘                    └─────────────────┘
      │                                    │
      │ ┌─────────────────────────────────┐│
      │ │  Data Flows:                    ││
      │ │  → Orders (export)              ││
      │ │  ← Order status (sync)          ││
      │ │  → Products/Articles (export)   ││
      │ │  ← Inventory levels (sync)      ││
      │ │  → Deliveries/POs (export)      ││
      │ │  ← PO status & reception (sync) ││
      │ │  ← Returns (sync)               ││
      │ └─────────────────────────────────┘│
      ▼                                    ▼
```

## Configuration

### Connector Options

The Ongoing integration is configured via connector options in the tenant settings. Add a connector with the name `Ongoing`.

| Property | Type | Description |
| --- | --- | --- |
| **Host** | string | Base URL of your Ongoing WMS instance, without `/api/v1`, for example `https://api.ongoingsystems.se/YourWarehouse`. Omnium adds the API path itself. |
| **Username** | string | The API user for the goods owner, created in Ongoing under **Administration → API for goods owners**. It usually starts with `WSI_`. A personal Ongoing login does not work. |
| **Password** | string | Password of the API user |
| **SyncOrders** | bool | Enable order status synchronization from Ongoing |
| **SyncPurchaseOrders** | bool | Enable purchase order/delivery synchronization |
| **SyncInventory** | bool | Enable inventory level synchronization |
| **SyncReturns** | bool | Enable return synchronization |
| **ExportedOrderStatus** | string | Omnium status a shipment gets when it is exported to Ongoing, and the status the order sync waits on. Defaults to `InProgressWarehouse`. Set this when your workflow uses a different status name for orders at the warehouse. |
| **ShippedOrderStatus** | string | Omnium status a shipped order is set to when Ongoing reports it as shipped. Defaults to `ShippedFromWarehouse`. Set this when your workflow uses a different status name for shipped orders (for example `Ship`). See [Shipped Order Status](Ongoing.md#shipped-order-status). |
| **UseWayOfDeliveryMapping** | bool | When `true`, the shipment's shipping method name is sent as the Ongoing way of delivery, and Ongoing maps it to a transporter on their side. When `false`, the transporter is sent as described in [Transporter Mapping](Ongoing.md#transporter-mapping). |
| **KeepShortPickedRemainderOpen** | bool | When `true`, the remainder of a partly picked order line stays open on the shipment, so it is delivered when the warehouse ships the rest order. When `false` (default), the remainder is canceled. Turn it on only when your warehouse creates rest orders. |

#### Example Configuration

```json
{
  "Connectors": [
    {
      "Name": "Ongoing",
      "Host": "https://api.ongoingsystems.se/YourWarehouse",
      "Username": "WSI_YourApiUser",
      "Password": "your-password",
      "Properties": [
        { "Key": "SyncOrders", "Value": "true" },
        { "Key": "SyncPurchaseOrders", "Value": "true" },
        { "Key": "SyncInventory", "Value": "true" },
        { "Key": "SyncReturns", "Value": "true" }
      ]
    }
  ]
}
```

### Store/Warehouse Configuration

For each warehouse that should integrate with Ongoing, configure the following properties on the Store entity:

| Property | Type | Description |
| --- | --- | --- |
| **IsOngoingStore** | bool | Set to `true` to mark the store as an Ongoing warehouse |
| **OngoingGoodsOwnerId** | ExternalId | The Goods Owner ID in Ongoing (numeric) |
| **OngoingWarehouseId** | ExternalId | The Warehouse ID in Ongoing (numeric) |

#### Example Store Configuration

```json
{
  "Id": "warehouse-01",
  "Name": "Main Warehouse",
  "IsWarehouse": true,
  "Properties": [
    { "Key": "IsOngoingStore", "Value": "true" }
  ],
  "ExternalIds": [
    { "Provider": "OngoingGoodsOwnerId", "ExternalId": "123" },
    { "Provider": "OngoingWarehouseId", "ExternalId": "456" }
  ]
}
```

## Order Export

Orders are exported to Ongoing by the `ExportOrder` workflow step. Adding the Ongoing connector alone does not export anything — the step is the trigger.

### Workflow Step

Add an `ExportOrder` step to the order workflow, on the status where the order should be sent to the warehouse (typically `New`). Set `RunAfterOrderIsSaved` to `true` so the step runs after the order has been saved — once the earlier workflow steps have enriched and allocated it — and the order is exported in its final, persisted state:

```json
{
  "Name": "ExportOrder",
  "Connector": "Ongoing",
  "Active": true,
  "RunAfterOrderIsSaved": true
}
```

### Export Flow

1.  The order reaches a status where the `ExportOrder` step runs
2.  The system checks if the shipment's warehouse is marked as an Ongoing warehouse (`IsOngoingStore is true`)
3.  Each shipment is exported as a separate order to Ongoing (format: `{OrderNumber}-{ShipmentId}`)
4.  The Ongoing Order ID is stored as an external ID on the shipment
5.  Shipment status is updated to `InProgressWarehouse`, or to the value of `ExportedOrderStatus` when it is set

### Order Mapping

| Omnium Field | Ongoing Field | Description |
| --- | --- | --- |
| OrderNumber + ShipmentId | OrderNumber | Combined as `{OrderNumber}-{ShipmentId}` |
| OrderType | OrderType.Code | Order type code |
| CustomerEmail | EmailNotification.Value | Customer email for notifications |
| CustomerPhone | SmsNotification.Value | Customer phone for notifications |
| ShippingAddress | Consignee | Delivery address details |
| OrderNotes | OrderRemark | Combined order notes |
| ShippingTotal | FreightPrice | Shipping cost |

### Transporter Mapping

The integration supports multiple transporter integrations:

*   **Unifaun**: Maps `transporterCode`, `transporterServiceCode`, and `servicePointCode`
*   **Porterbuddy**: Special handling with `ONGOING_PORTERBUDDY` transporter code
*   **Ingrid**: Maps TOS ID to `PreparedTransportDocumentId`

### Order Cancellation

When an order or shipment is canceled in Omnium, the integration updates the Ongoing order status to `1000` (Canceled).

## Order Synchronization

The `OngoingSyncScheduledTask` periodically fetches order updates from Ongoing and synchronizes them back to Omnium.

### Sync Flow

1.  Scheduled task queries Ongoing for orders changed since last sync
2.  Each changed Ongoing order is matched to an Omnium order and shipment. Only shipments currently at `InProgressWarehouse`, or the value of `ExportedOrderStatus` (the status set when the order was exported), are considered
3.  The Ongoing status is mapped to an Omnium status via the `OngoingStatus` property on the order status configuration
4.  If the mapped status is a shipped, picked-up, or canceled status, the shipment is advanced and its workflow runs
5.  Tracking information (waybill, tracking URL) is updated on shipments
6.  Shipping labels are downloaded and stored in blob storage
7.  For partial deliveries, new shipments are created in Omnium

### Status Mapping

Configure status mapping via the `OngoingStatus` property on your order status configuration:

```json
{
  "OrderStatuses": [
    {
      "Name": "ShippedFromWarehouse",
      "Properties": [
        { "Key": "OngoingStatus", "Value": "Skickat" }
      ]
    }
  ]
}
```

The mapped Omnium status must be one of the recognized target statuses: `Ship`, `PickedUp`, `OrderCanceled`, or `ShippedFromWarehouse`. If the `OngoingStatus` property points to any other status, the sync does not advance the order.

### Shipped Order Status

By default, an order reported as shipped by Ongoing is set to `ShippedFromWarehouse`. If your workflow's shipped status uses a different name (for example `Ship`), set the `ShippedOrderStatus` connector option to that name so the order lands on the correct status:

```json
{ "Key": "ShippedOrderStatus", "Value": "Ship" }
```

If the shipped order is set to a status name that does not exist in your workflow, no workflow steps run for it (payment capture, inventory reduction, notifications), and the order appears to stall. Make sure the target status — either `ShippedFromWarehouse` or the value of `ShippedOrderStatus` — exists in your order workflow.

### Tracking Information

The following tracking data is synchronized from Ongoing:

| Field | Source | Description |
| --- | --- | --- |
| ShipmentTrackingNumber | Waybill or ParcelNumber | Tracking number |
| ShipmentTrackingLink | TrackingUrl | Link to carrier tracking page |
| LabelLink | Order files (label\*.pdf) | Shipping label PDF (stored in blob) |
| ReturnLabelLink | Order files (return\*.pdf) | Return label PDF (stored in blob) |

## Return Synchronization

Returns registered in Ongoing are automatically synchronized to Omnium and create return records.

### Return Flow

1.  The scheduled task queries Ongoing for orders that have returned items not yet reported back. The trigger is at line level: a line whose returned quantity in Ongoing exceeds the quantity already reported to Ongoing.
2.  For each such line, a return is created in Omnium with:
    *   The returned quantity (the difference between Ongoing's returned and already-reported quantities)
    *   A return type derived from Ongoing's return cause (see [Return Reason Mapping](Ongoing.md#return-reason-mapping))
    *   A credit for the returned lines, and stock marked as updated
3.  After processing, Ongoing's `ReportedReturnedNumberOfItems` is set equal to its `ReturnedNumberOfItems`, so the same return is not processed again.

### Return Reason Mapping

The return cause registered in Ongoing is carried onto the Omnium return as its return type. Ongoing's return cause code is matched against the `Id` of a configured Return Type in the return settings (**Configuration → Settings → Return settings → Return Types**). For the cause to resolve to a named type, Ongoing must send a cause code equal to a Return Type `Id`; otherwise the code is stored on the return line as-is without matching a configured type.

### Order Status After a Return

Creating a return does not by itself change the order or shipment status to `Returned` or `PartiallyReturned`. The status only changes if the return workflow includes an `UpdateOrderStatus` step. Without that step, the return is recorded (return lines, credit, stock) but the order keeps its current status.

### Return Properties

| Property | Description |
| --- | --- |
| **ReturnedByOngoing** | Set to `true` on returns created by sync |
| **OngoingReturnError** | Contains error details if return sync fails |

## Inventory Synchronization

Inventory levels are synchronized from Ongoing to Omnium.

### Sync Methods

1.  **Delta Sync**: Fetches inventory changes since last sync (limited to 24 hours lookback)
2.  **Full Sync**: Scrolls through all articles for a specific warehouse

### Inventory Flow

1.  Query Ongoing for inventory per warehouse
2.  Match Ongoing warehouse ID to Omnium warehouse via `OngoingWarehouseId` external ID
3.  Calculate inventory change (delta between Ongoing sellable quantity and current Omnium inventory)
4.  Apply inventory updates to Omnium

### Configuration Note

The inventory sync uses `SellableNumberOfItems` from Ongoing, which represents the available-to-sell quantity.

## Product Export

Products are exported to Ongoing as "Articles"

### Export Flow

1.  For products with variants, each variant is exported as a separate article
2.  The Ongoing Article System ID is stored as an external ID

### Product Mapping

| Omnium Field | Ongoing Field | Description |
| --- | --- | --- |
| SkuId | ArticleNumber | SKU identifier |
| SkuId | ProductCode | Product code |
| Weight | Weight | Weight in kilograms |
| Ean | BarCodeInfo.BarCode | EAN barcode |
| Description | Description | Product description |
| Name + Color | ArticleName | Combined article name |
| Color | ArticleColor | Color attribute |
| Size | ArticleSize | Size attribute |
| Brand | SupplierInfo.SupplierName | Brand/supplier name |
| SupplierSkuId | SupplierInfo.SupplierArticleNumber | Supplier article number |
| MainImageUrl | LinkToPicture | Product image URL |

### Deleted Products

When a product is deleted in Omnium:

*   `IsActive` is set to `false`
*   Barcode is cleared (to avoid duplicate barcode conflicts in Ongoing)

## Delivery/Purchase Order Export

Deliveries (inbound goods) are exported to Ongoing as Purchase Orders by the `ExportDeliveries` workflow step.

### Workflow Step

Add an `ExportDeliveries` step to the purchase order workflow (not a separate delivery workflow), on the status where deliveries should be sent to Ongoing (for example `Confirmed`):

```json
{
  "Name": "ExportDeliveries",
  "Connector": "Ongoing",
  "Active": true
}
```

`ExportDeliveries` only exports deliveries that already exist on the purchase order. Create the delivery on the purchase order first — otherwise the step finds nothing to export.

### Export Flow

1.  The purchase order reaches a status where the `ExportDeliveries` workflow step runs
2.  The step collects the deliveries linked to the purchase order lines
3.  Each delivery is mapped to an Ongoing Purchase Order
4.  The Ongoing Purchase Order ID is stored as a property on the delivery

### Delivery Mapping

| Omnium Field | Ongoing Field | Description |
| --- | --- | --- |
| Delivery.Id | PurchaseOrderNumber | Delivery ID |
| Supplier.Name | SupplierInfo.SupplierName | Supplier name |
| Supplier.Id | SupplierInfo.SupplierNumber | Supplier ID |
| InvoiceNumber | ReferenceNumber | Invoice reference |

## Purchase Order Status Sync

Purchase order status updates and goods receptions are synchronized from Ongoing to the deliveries in Omnium.

### Sync Flow

1.  The scheduled task fetches the Ongoing purchase orders that changed status or received goods since the last sync
2.  Each purchase order is matched to an open Omnium delivery by its purchase order number (the delivery ID)
3.  A purchase order with status `900` or `1000` in Ongoing sets the delivery to `Cancelled`
4.  Otherwise, the received goods are booked as a goods reception (see [Goods Reception](Ongoing.md#goods-reception))
5.  The Ongoing status text is stored in the `OngoingPurchaseOrderStatus` property on the delivery

### Goods Reception

Every receipt in Ongoing is booked in Omnium, also a later partial receipt that does not change the status of the purchase order. For each line, only the quantity received since the last sync is booked, so a purchase order that is synced again is not booked twice.

When items are received in Ongoing, the integration:

1.  Calculates newly delivered quantities
2.  Creates goods reception lines on the purchase order that each line belongs to
3.  Updates delivery line item quantities
4.  Processes inventory transactions

## Scheduled Tasks

### OngoingSyncScheduledTask

Main synchronization task that runs all enabled sync operations.

| Configuration | Description |
| --- | --- |
| Task Name | `OngoingSyncScheduledTask` |
| Group | Plugins |
| Type | Delta (time-based) |

Runs the following operations based on connector settings:

*   `SyncPurchaseOrders`: Sync purchase order statuses
*   `SyncOrders`: Sync order statuses and shipping info
*   `SyncReturns`: Process returns from Ongoing
*   `SyncInventory`: Sync inventory levels

### OngoingProductSyncScheduledTask

Scheduled task for bulk product export to Ongoing.

| Configuration | Description |
| --- | --- |
| Task Name | `OngoingProductSyncScheduledTask` |
| Group | Plugins |
| Type | Delta (time-based) |

Exports products with available inventory that have been modified since the last sync.

## External IDs and Properties

### External ID Providers

| Provider | Entity | Description |
| --- | --- | --- |
| `OngoingOrderId` | Order, Shipment | Ongoing order system ID |
| `OngoingArticleId` | Product, Variant | Format: `{ArticleSystemId}_{GoodsOwnerId}` |
| `OngoingPurchaseOrderId` | Delivery | Ongoing purchase order ID |
| `OngoingGoodsOwnerId` | Store | Goods owner ID in Ongoing |
| `OngoingWarehouseId` | Store | Warehouse ID in Ongoing |

### Properties

| Property Key | Entity | Description |
| --- | --- | --- |
| `IsOngoingStore` | Store | Marks store as Ongoing warehouse |
| `IsDeliveredShipment` | Shipment | Marks shipment as delivered from Ongoing |
| `IsOrderLineDelivered` | OrderLine | Marks line as delivered |
| `OngoingPurchaseOrderStatus` | Delivery | Current Ongoing PO status |
| `ReturnedByOngoing` | Order | Return created by Ongoing sync |
| `OngoingReturnError` | Order | Error details for return sync |

## Error Handling

The integration implements comprehensive error handling:

*   **Export Failures**: Errors are logged and stored on the entity
*   **Sync Failures**: Individual sync operations continue even if one fails
*   **Return Sync Errors**: Errors are stored in `OngoingReturnError` property and `ReportedReturnedNumberOfItems` is updated to prevent repeated failures

## Troubleshooting

### Common Issues

| Issue | Possible Cause | Solution |
| --- | --- | --- |
| Connection fails with "not allowed to make SOAP calls" | `Username` is a personal Ongoing login | Use the API user from **Administration → API for goods owners** in Ongoing |
| Orders not exporting | Warehouse not configured | Verify `IsOngoingStore` property |
| No Goods Owner ID | Missing external ID | Add `OngoingGoodsOwnerId` to store |
| Inventory not syncing | Warehouse ID mismatch | Verify `OngoingWarehouseId` mapping |
| Return sync fails | Line item mismatch | Check `OngoingReturnError` property |
| Orders stuck at `InProgressWarehouse` | Shipped status name not present in the workflow | Set `ShippedOrderStatus` to a status that exists in your workflow, or name the shipped status `ShippedFromWarehouse` |
| Return created but order status unchanged | Return workflow has no `UpdateOrderStatus` step | Add an `UpdateOrderStatus` step to the return workflow |

### Debugging Tips

1.  Verify connector options are correctly configured
2.  Ensure store has both `OngoingGoodsOwnerId` and `OngoingWarehouseId`
3.  Check scheduled task execution logs for sync errors
