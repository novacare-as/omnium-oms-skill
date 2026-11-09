# Create Purchase Order From Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/purchase-orders/create-purchase-order-from-order

> Create a purchase order from a sales order for supplier fulfillment.

## Overview

The **Create Purchase Order From Order** step creates a purchase order from a sales order. This is used for drop-shipping or supplier fulfillment scenarios where orders are fulfilled directly by suppliers.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreatePurchaseOrderFromOrder` |
| **Group** | PurchaseOrder |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Creates a purchase order based on the sales order details
2.  Links the purchase order to the sales order via external ID
3.  Returns success with created purchase order information

### Prerequisites

*   Order must have line items to include in purchase order

### Side Effects

*   Purchase order created in the system
*   External ID `LinkedToPurchaseOrderId` added to sales order

## Business Cases

### When to Use

*   **Drop-shipping**: Send orders directly to suppliers for fulfillment
*   **Supplier orders**: Create POs for items fulfilled by external suppliers
*   **Cross-dock**: Generate POs for items sourced from suppliers

### Example Scenarios

**Scenario 1: Drop-Ship Order** Customer order received. Purchase order created for supplier to fulfill directly.

**Scenario 2: Multi-Supplier Order** Order with products from different suppliers. POs created for each supplier.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Purchase order created | Success | Yes |
| Service error | Exception | No |

## Related Steps

*   [Create Internal Transfer From Shipment](create-internal-transfer-from-shipment.md) - Create internal transfers
*   [Try Reallocate To Purchase Order](../allocation/try-reallocate-to-purchase-order.md) - Allocate to existing POs
