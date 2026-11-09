# Goods Reception

Source: https://docs.omnium.no/docs/PurchaseOrders/Deliveries/goods-reception

> How goods reception works in Omnium — receiving delivered goods into warehouse inventory, releasing order reservations, and handling partial deliveries.

## Overview

**Goods reception** is the process of recording that goods from a delivery have physically arrived at the warehouse. It is the final step that connects the procurement workflow to warehouse inventory and order fulfillment.

When goods reception is performed, Omnium:

1.  Increases warehouse inventory for the received products
2.  Releases customer order reservations from the purchase order to warehouse stock
3.  Updates the delivery status
4.  Recalculates Available-to-Promise (ATP) values
5.  Optionally updates product cost prices
6.  Optionally creates internal transfers for pickup warehouse orders

Goods reception is performed by submitting a list of **goods reception lines**, each identifying a purchase order line item and the quantity received.

* * *

## Goods Reception Line

Each goods reception line represents a single product received at a warehouse.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `LineItemId` | `string` | Yes | The ID of the purchase order line item being received |
| `DeliveredQuantity` | `decimal` | Yes | The quantity received. Must be zero or greater |
| `WarehouseCode` | `string` | Yes | The warehouse code where goods are being received |
| `CostPrice` | `decimal` | No | Reserved for future use. The cost recorded on the inventory transaction is derived from the purchase order line |
| `UpdateProductCostPrice` | `bool` | No | If `true`, the product variant's cost price and currency are updated with the values from the purchase order line |
| `GoodsReceptionId` | `string` | No | Idempotency key to prevent duplicate processing. Recommended for API integrations |
| `ReceiveAsUnallocated` | `bool` | No | VSL only. If `true`, inventory is added to the physical warehouse without distributing to virtual stock locations |
| `AllocateBasedOnRules` | `bool?` | No | VSL only. Overrides the purchase order line setting. If `true`, uses inventory rules to distribute across virtual warehouses |

* * *

## API Endpoints

Omnium provides two endpoints for performing goods reception.

### Endpoint 1: Delivery-Scoped

```
POST /api/Deliveries/{deliveryId}/ProcessGoodsReception
```

Processes goods reception for line items belonging to a specific delivery. The system validates that the provided line items belong to the specified delivery.

This endpoint performs an **idempotency check** using `GoodsReceptionId` values before processing.

### Endpoint 2: Generic

```
POST /api/Deliveries/ProcessGoodsReception
```

Processes goods reception for line items across any delivery. The line items are resolved to their deliveries automatically based on the purchase order data.

Both endpoints accept the same request body: an array of goods reception lines.

### Validation

Both endpoints validate the request before processing:

*   At least one goods reception line must be provided
*   Each line must reference a valid warehouse code
*   The warehouse must be a warehouse (not a regular store)
*   Virtual warehouses cannot be targeted directly — use the physical warehouse and let Omnium handle VSL allocation internally

* * *

## How Goods Reception Works

When goods reception is submitted, Omnium performs the following steps in sequence:

### Step 1: Resolve Purchase Orders and Deliveries

The system looks up the purchase orders and deliveries associated with the submitted line item IDs.

### Step 2: Update Purchase Order Line Quantities

For each goods reception line, the corresponding purchase order line is updated:

*   `DeliveredQuantity` is increased by the received quantity
*   `DeliveredDate` is set to the current time (on the first reception)

### Step 3: Update Purchase Order Status

If **all** line items on a purchase order have been fully delivered or canceled (i.e., `DeliveredQuantity + CanceledQuantity = Quantity` for every line), and a `GoodsReceptionCompletedStatus` is [configured](delivery-config.md), the purchase order status is automatically updated to the configured value.

### Step 4: Update Product Cost Prices

If `UpdateProductCostPrice` is set to `true` on a goods reception line, the product variant's `Cost` and `CostCurrency` are updated with the values from the purchase order line. This is useful when the actual purchase cost should be reflected on the product.

### Step 5: Release Order Reservations

Customer orders that were reserved against the received purchase order lines are updated:

*   `IsAwaitingPurchaseOrder` is cleared
*   `ExpectedDeliveryDate` is cleared
*   The order line is now reserved against warehouse stock instead of the purchase order

This means the order can proceed to fulfillment. See [Reservations](../purchase-order-reservations.md) for the full reservation lifecycle.

If [internal transfers for pickup warehouses](delivery-config.md) are enabled, orders destined for a pickup warehouse keep the `IsAwaitingPurchaseOrder` flag until the internal transfer is completed.

### Step 6: Increase Warehouse Inventory

Inventory is increased in the receiving warehouse for each goods reception line. The inventory update includes:

*   The SKU and warehouse code
*   The delivered quantity
*   The unit cost (calculated from the purchase order line's discounted price excluding tax)
*   The cost currency from the purchase order line, and the invoice date from the delivery

If inventory conflicts occur due to concurrent updates, Omnium retries the update automatically.

### Step 7: Create Internal Transfers (if configured)

If `CreateInternalTransfersForPickUpWarehouses` is enabled and there are orders reserved to this delivery with a pickup warehouse different from the delivery warehouse, Omnium automatically creates **internal transfer purchase orders** to move the goods to the pickup warehouses.

For each target warehouse, the system:

1.  Creates a new internal transfer purchase order from the delivery warehouse to the pickup warehouse
2.  Copies the relevant line items with the required quantities
3.  Reallocates the customer order reservations to the new internal transfer

### Step 8: Update Delivery Status

The delivery status is recalculated based on the updated quantities across all its line items:

*   If all line items are fully delivered or canceled → **Completed**
*   If some line items have been delivered but others are still pending → **InProgress**

When a purchase order line is fully delivered (`DeliveredQuantity + CanceledQuantity = Quantity`), any remaining order reservations against that line are released to warehouse stock.

If `IsAutoDeliveryStatusDisabled` is set on the delivery, automatic status calculation is skipped.

### Step 9: Recalculate Reserved Inventory and ATP

After inventory is updated:

1.  **Reserved inventory** is recalculated for all affected SKUs
2.  If **ATP providers** are configured, ATP values are recalculated and exported

### Step 10: Update Shipment Status

If `GoodsReceptionShipmentOrderStatusUpdate` is [configured](delivery-config.md), the shipment order status for affected orders is updated to the configured value. This runs as a background task after goods reception completes.

* * *

## Partial Goods Reception

Goods reception can be performed partially — you do not need to receive all expected quantities at once. Each time goods reception is performed:

*   The `DeliveredQuantity` on the purchase order line is **incremented** by the received amount
*   The delivery status transitions to **InProgress** once any quantity has been received
*   When all line items reach their full quantity (delivered + canceled), the delivery moves to **Completed**

This allows you to receive goods in multiple batches as they arrive.

* * *

## Idempotency

To prevent duplicate processing when integrating via the API, use the `GoodsReceptionId` field on each goods reception line.

Before processing, the delivery-scoped endpoint checks whether any inventory transaction already exists with the submitted `GoodsReceptionId` values. If a match is found, the request is rejected with a `400 Bad Request` response listing the duplicate IDs.

The `GoodsReceptionId` is stored on the resulting inventory transaction for audit and traceability.

It is strongly recommended to always provide a `GoodsReceptionId` when performing goods reception via the API. Without it, there is no built-in protection against accidental duplicate submissions, which would result in double inventory increases.

* * *

## Cost Price Updates

When `UpdateProductCostPrice` is set to `true` on a goods reception line, the product variant's cost information is updated:

*   `Cost` is set to the purchase order line's placed price (excluding tax)
*   `CostCurrency` is set to the purchase order line's currency

This is useful when the actual purchase price from the supplier should be reflected on the product record for reporting or margin calculations.

The unit cost recorded on the inventory transaction is always calculated as the purchase order line's discounted price excluding tax divided by the line quantity, regardless of the `UpdateProductCostPrice` flag.

* * *

## Virtual Stock Locations (VSL)

When the receiving warehouse uses **Virtual Stock Locations**, goods reception includes additional allocation logic.

By default, received inventory is distributed across the warehouse's virtual stock locations according to the allocations defined on the purchase order line. This behavior can be modified per goods reception line:

*   **`ReceiveAsUnallocated = true`** — Inventory is added to the physical warehouse without distributing to virtual locations. The inventory remains unallocated until manually or automatically assigned.
*   **`AllocateBasedOnRules = true`** — Instead of using the explicit allocations from the purchase order line, the inventory rule engine distributes the received quantity across virtual locations based on configured rules.

Virtual warehouses cannot be targeted directly in the API. Always specify the physical warehouse code and let Omnium handle the virtual allocation internally.

* * *

## Processing Flow Diagram

```
Goods Reception Request
│
├─ Validate warehouse codes
├─ Check GoodsReceptionId for duplicates (idempotency)
│
├─ For each goods reception line:
│  ├─ Find matching purchase order line
│  ├─ Increase DeliveredQuantity on PO line
│  └─ Build inventory update (quantity, cost, warehouse)
│
├─ Update purchase order status (if all lines complete)
├─ Update product cost prices (if requested)
│
├─ Release order reservations
│  └─ Clear IsAwaitingPurchaseOrder on reserved order lines
│
├─ Apply inventory updates to warehouse
│  └─ Retry on conflict (up to 2 retries)
│
├─ Create internal transfers for pickup warehouses (if configured)
│
├─ Recalculate delivery status
│  ├─ InProgress (partial) or Completed (all done)
│  └─ Release remaining order reservations for completed lines
│
├─ Recalculate reserved inventory for affected SKUs
├─ Update shipment order status (background task, if configured)
└─ Recalculate ATP (if ATP providers configured)
```
