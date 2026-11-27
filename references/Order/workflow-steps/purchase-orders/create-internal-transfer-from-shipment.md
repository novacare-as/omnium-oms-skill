# Create Internal Transfer From Shipment

Source: https://docs.omnium.no/docs/Order/workflow-steps/purchase-orders/create-internal-transfer-from-shipment

> Create internal transfer orders from shipments for unreserved inventory.

## Overview

The **Create Internal Transfer From Shipment** step creates internal transfer purchase orders from order shipments for line items without inventory reservations. This enables warehouse-to-warehouse transfers for fulfillment.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateInternalTransferFromShipment` |
| **Group** | PurchaseOrder |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ShippingMethodName` | String | No | \- | Comma-separated shipping methods to filter (if empty, processes all) |

## Behavior

### What It Does

1.  Optionally filters shipments by shipping method name
2.  For each shipment, identifies line items that:
    *   Have quantity > 0
    *   Are not cancelled
    *   Are not already reserved
    *   Don't have an existing PO reservation
3.  Gets the store and its available warehouses
4.  Creates a purchase order for internal transfer:
    *   Sets supplier warehouse from shipment
    *   Sets destination warehouse from store's available warehouses
5.  Marks line items as reserved with PO reference
6.  Links the PO to the sales order
7.  Returns count of transfers created

### Prerequisites

*   Store must have available warehouses configured
*   Line items must not already be reserved

### Side Effects

*   Internal transfer purchase orders created
*   Line items marked as reserved with PO IDs
*   External ID `LinkedToPurchaseOrderId` added to order

## Business Cases

### When to Use

*   **Warehouse transfers**: Move inventory between warehouses for fulfillment
*   **Store replenishment**: Transfer stock from DC to store for pickup
*   **Split fulfillment**: Create transfers for items not available locally

### Example Scenarios

**Scenario 1: Internal Transfer Created** Store order needs inventory from distribution center. Internal transfer PO created.

**Scenario 2: Filtered by Shipping Method** `ShippingMethodName=StoreTransfer`. Only shipments with that method create transfers.

**Scenario 3: No Available Warehouse** Store has no available warehouses configured. Warning returned.

**Scenario 4: All Items Reserved** All line items already reserved. No transfers created.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Transfers created | Success | Yes |
| No transfers needed | Success | Yes |
| Missing available warehouse | Warning | Yes |

## Related Steps

*   [Create Purchase Order From Order](create-purchase-order-from-order.md) - Create supplier POs
*   [Create PO Delivery From Shipment](create-po-delivery-from-shipment.md) - Create deliveries from shipments
