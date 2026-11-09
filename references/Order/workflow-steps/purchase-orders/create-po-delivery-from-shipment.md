# Create PO Delivery From Shipment

Source: https://docs.omnium.no/docs/Order/workflow-steps/purchase-orders/create-po-delivery-from-shipment

> Create purchase order deliveries from order shipments.

## Overview

The **Create PO Delivery From Shipment** step creates purchase order deliveries from order shipments. This is used to record incoming goods when shipments are received against a linked purchase order.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreatePODeliveryFromShipment` |
| **Group** | PurchaseOrder |
| **Applicable Statuses** | Ship, Completed |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `Connector` | String | No | \- | Purchase order exporter connector for external sync |

## Behavior

### What It Does

1.  Validates shipment exists and has line items
2.  Gets linked purchase order from order's external ID
3.  Validates purchase order exists and has line items
4.  Maps shipment line items to purchase order lines:
    *   First matches by `ReservedInventoryPurchaseOrderLineId`
    *   Falls back to matching by SKU code
5.  Sets quantities from shipment and package barcodes
6.  Creates delivery record for the purchase order
7.  Optionally exports to external system if connector configured
8.  Returns success with delivery details

### Prerequisites

*   Order must have a linked purchase order (external ID)
*   Shipment must have line items that match PO lines
*   Purchase order must exist and have line items

### Side Effects

*   Delivery record created for purchase order
*   Purchase order lines updated with delivery reference
*   Optional export to external PO system

## Business Cases

### When to Use

*   **Goods receipt**: Record delivery of goods against purchase order
*   **Internal transfers**: Complete transfer when goods arrive
*   **Inventory reconciliation**: Match shipments to PO expectations

### Example Scenarios

**Scenario 1: Delivery Created** Shipment received. Delivery created matching 5 PO line items. External system notified.

**Scenario 2: No Shipment** Step runs without shipment context. Warning returned.

**Scenario 3: No Linked PO** Order doesn't have linked purchase order. Warning returned.

**Scenario 4: No Matching Lines** Shipment items don't match any PO lines. Warning returned.

**Scenario 5: With Connector** Connector configured. Delivery exported to external system after creation.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Delivery created | Success | Yes |
| No shipment | Warning | Yes |
| Shipment has no items | Warning | Yes |
| No linked PO | Warning | Yes |
| PO not found | Warning | Yes |
| No matching lines | Warning | Yes |
| Delivery creation failed | Warning | Yes |
| Export failed | Warning | Yes |

## Related Steps

*   [Create Internal Transfer From Shipment](create-internal-transfer-from-shipment.md) - Create internal transfers
*   [Create Purchase Order From Order](create-purchase-order-from-order.md) - Create supplier POs
