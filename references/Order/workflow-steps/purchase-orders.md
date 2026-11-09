# Purchase Order Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/purchase-orders

> Workflow steps for creating and managing purchase orders from sales orders.

## Overview

Purchase order steps handle the creation of purchase orders and deliveries from sales orders. They support drop-shipping, internal transfers, and goods receipt scenarios.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Create Purchase Order From Order](purchase-orders/create-purchase-order-from-order.md) | `CreatePurchaseOrderFromOrder` | Create supplier PO from sales order |
| [Create Order From Purchase Order](purchase-orders/create-order-from-purchase-order.md) | `CreateOrderFromPurchaseOrder` | Create sales order from purchase order for inter-store transfers |
| [Create Internal Transfer From Shipment](purchase-orders/create-internal-transfer-from-shipment.md) | `CreateInternalTransferFromShipment` | Create internal transfer POs |
| [Create PO Delivery From Shipment](purchase-orders/create-po-delivery-from-shipment.md) | `CreatePODeliveryFromShipment` | Create deliveries from shipments |

## Common Use Cases

### Drop-Shipping

Create purchase orders for supplier fulfillment:

```
New Order → CreatePurchaseOrderFromOrder → Export to Supplier
```

### Internal Transfers

Move inventory between warehouses:

```
New Order (store pickup) → CreateInternalTransferFromShipment → Transfer Created
```

### Inter-Store Orders

Create sales orders from purchase orders when supplier is another store:

```
Store A creates PO → PO Confirmed → CreateOrderFromPurchaseOrder → Order created on Store B
```

### Goods Receipt

Record deliveries when shipments arrive:

```
Shipment Received → CreatePODeliveryFromShipment → Inventory Updated
```

## Purchase Order Linking

Sales orders and purchase orders are linked via external IDs:

*   `LinkedToPurchaseOrderId`: Links sales order to its purchase order
*   `CreatedFromSalesOrderId`: Links purchase order back to originating sales order
*   `PurchaseOrderId` (on OrderForm): Links sales order created from a purchase order

This enables:

*   Tracking which POs belong to which orders
*   Matching deliveries to original orders
*   Inter-store transfer traceability
*   Reservation management across documents

## Integration with Allocation

Purchase order steps work with allocation steps:

1.  **TryReallocateToPurchaseOrder**: Allocates order lines to existing POs
2.  **CreateInternalTransferFromShipment**: Creates new POs for unreserved items
3.  **CreatePODeliveryFromShipment**: Records goods receipt

This provides a complete flow from order to fulfillment for complex sourcing scenarios.
