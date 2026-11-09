# Purchase Orders

Source: https://docs.omnium.no/docs/plugins/POS/Flow/PurchaseOrders

> Purchase order and delivery synchronization from Omnium to Flow Retail, including reservation handling.

## Overview

The Flow integration exports purchase orders **one-way** from Omnium to Flow Retail. It supports two export modes and includes order reservation handling to link customer orders to purchase order lines.

Two separate exporters handle purchase order data:

| Exporter | Interface | Trigger |
| --- | --- | --- |
| **Purchase Order Exporter** | `IPurchaseOrderSynchronousExporter` | When a purchase order is saved or updated |
| **Delivery Exporter** | `IDeliveryExporter` | When a delivery is saved or updated |

## Export Modes

The purchase order exporter supports two modes, controlled by the `ExportDeliveryAsPo` configuration setting.

### Mode 1: Purchase Order as Purchase Order (default)

When `ExportDeliveryAsPo` is `false` (default), each Omnium purchase order maps directly to a single Flow purchase order.

*   The Flow PO UID matches the Omnium purchase order ID
*   All line items are included regardless of delivery assignment
*   The PO status in Flow is calculated dynamically based on delivery progress
*   Line items that exist in Flow but no longer exist in Omnium are automatically deleted

#### Status Mapping

| Condition | Flow Status |
| --- | --- |
| No items delivered | `SENTTOSUPPLIER` |
| Some items partially delivered | `PARTIALLYRECEIVED` |
| All items fully delivered | `RECEIVED` |
| Purchase order cancelled | `CLOSED` |

#### Change Detection

When updating an existing Flow PO, only line items that have actually changed are included in the update. The exporter compares the current state against the previous state across the following fields: quantity, delivered quantity, discounted price, supplier SKU, warehouse code, and estimated time of arrival.

### Mode 2: Delivery as Purchase Order

When `ExportDeliveryAsPo` is `true`, each delivery within a purchase order is exported as a **separate** Flow purchase order.

*   The Flow PO UID is `{PurchaseOrderId}-delivery-{DeliveryId}`
*   Only line items belonging to the specific delivery are included
*   Line items are created or updated individually (not as part of the PO create/update)
*   Status is always `SENTTOSUPPLIER`

## Purchase Order Mapping

### Header Fields

| Flow | Omnium | Notes |
| --- | --- | --- |
| `purchaseOrderUid` | `Id` | Or `{Id}-delivery-{DeliveryId}` in delivery mode |
| `supplierUid` | `SupplierId` | Required |
| `status` | Calculated | See [Status Mapping](PurchaseOrders.md#status-mapping) |
| `currency` | `BillingCurrency` | Only in PO-as-PO mode |
| `externalId` | `Id` |  |
| `supplierReferenceNumber` | `ReferenceNumber` | Only in PO-as-PO mode |
| `note` | `PurchaseOrderNotes` | Comma-joined |

### Line Item Fields

| Flow | Omnium | Notes |
| --- | --- | --- |
| `purchaseOrderItemUid` | `LineItemId` |  |
| `productUid` | `Code` | [UID-sanitized](../Flow.md#uid-sanitization) |
| `quantityOrdered` | `Quantity` | Converted to cents (x100) |
| `quantityReceived` | `DeliveredQuantity` | Converted to cents (x100) |
| `supplierSku` | `SupplierSkuId` |  |
| `unitPrice` | `DiscountedPrice / Quantity` | Per-unit price in cents |
| `expectedDeliveryDate` | ETA or `RequestedDeliveryDate` | Falls back to delivery ETA, then PO requested date |

## Order Reservations

The purchase order exporter can notify Flow about customer orders that are reserved against purchase order lines. This allows Flow to track which customer orders are waiting for incoming goods.

### Reservation Types

| Type | When Used |
| --- | --- |
| `PURCHASEORDER` | Items with a confirmed delivery |
| `PURCHASEORDER_CONFIRMED` | Items in "Ordered" status without a delivery assigned |
| `WAREHOUSE` | Warehouse-based reservations (standalone export) |

### How Reservations Work

1.  For each purchase order line, Omnium searches for customer orders reserved against that line
2.  A reservation request is built containing the order ID and line item ID for each match
3.  The request is posted to the Flow Orders API
4.  If a line item is part of a package, the package line item ID is used instead

Reservations are exported:

*   After creating/updating a delivery-based PO (for items with deliveries)
*   For "Ordered" PO items that have no delivery assigned yet
*   In PO-as-PO mode, for items where ordered quantity exceeds delivered quantity

## Package Product Support

When `SendPackageProductOnPurchaseOrder` is enabled, the exporter consolidates component line items into their parent package product before sending to Flow.

For example, if a package "Starter Kit" contains 2x Product A and 1x Product B, and the PO has 4x Product A and 2x Product B, the exporter sends 2x "Starter Kit" instead.

The consolidation:

*   Groups line items by their `PackageSkuId`
*   Looks up the package product to determine component quantities
*   Divides the ordered quantity by the component quantity to calculate package quantity
*   Uses the package product's cost as the unit price

## Configuration Reference

| Setting | Description | Default |
| --- | --- | --- |
| `ExportDeliveryAsPo` | Export each delivery as a separate Flow PO | `false` |
| `SendPackageProductOnPurchaseOrder` | Consolidate components into package products | `false` |
| `PurchaseNumberSeriesUid` | Flow number series for purchase orders | Required |

## Error Handling

The purchase order exporter tracks errors at both the PO level and individual line item level. If any line item fails to export, the error is recorded on the line item and a summary error is added to the purchase order. When a previously failed item exports successfully, its error is automatically cleared.

Errors are stored with the key `flow {marketId}` and persisted back to Omnium so they are visible in the UI.
