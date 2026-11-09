# Internal Transfer Inventory Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/internal-transfer-inventory-validator

> Validates that the source warehouse has sufficient available stock to fulfil an internal transfer purchase order.

## Overview

The **Internal Transfer Inventory Validator** is used for purchase orders that represent warehouse-to-warehouse transfers, where one warehouse acts as the supplier. It checks that the source warehouse has enough available inventory to cover the remaining quantity (excluding already delivered and cancelled lines) for each line item.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `internalTransferInventoryValidator` |
| **Validation Type** | Inventory |
| **Validation Scope** | LineItem |

## Behavior

1.  If `SupplierWarehouseCode` is not set on the purchase order, all existing inventory errors are cleared and validation is skipped — the order is not an internal transfer
2.  For each line item with a product code:
    *   Fetches inventory for the SKU from the source warehouse (`SupplierWarehouseCode`) on first encounter; result is cached per SKU for the duration of validation
    *   Available quantity = `Inventory - ReservedInventory`
    *   Remaining quantity to fulfil = `Quantity - DeliveredQuantity - CanceledQuantity`
    *   If remaining quantity exceeds available inventory, adds an **error** to the line item
    *   Subtracts the remaining quantity from the cached available amount so that multiple line items for the same SKU are validated cumulatively
3.  Aggregates line item errors to the purchase order level

## Error messages

| Condition | Severity | Message |
| --- | --- | --- |
| Remaining quantity exceeds available inventory in source warehouse | Error | `Insufficient inventory in source warehouse. Available: {available}, Requested: {remaining}` |

## Configuration

No additional properties required. The source warehouse is determined by `SupplierWarehouseCode` on the purchase order.

```json
{
  "name": "internalTransferInventoryValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```

## Related

For information on setting up internal transfers, see the [Create Internal Transfer from Shipment](../../../Order/workflow-steps/purchase-orders/create-internal-transfer-from-shipment.md) workflow step.
