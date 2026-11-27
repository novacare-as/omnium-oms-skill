# Inventory ATP Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/inventory-atp-validator

> Validates inventory availability using Available-to-Promise (ATP) data, including future delivery dates.

## Overview

The **Inventory ATP Validator** checks product availability using Available-to-Promise (ATP) data, which accounts for projected future inventory changes. This validator is particularly useful when orders have a requested delivery date, as it can validate availability at that future point in time.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `inventoryAtpValidator` |
| **Validation Type** | General |

## Behavior

1.  If the cart's order type is `PreOrder`, validation is skipped (always passes)
2.  If the cart has no line items, returns a "Cart is empty" error
3.  Resolves the relevant warehouses:
    *   Uses the warehouse from the first shipment's `WarehouseCode` or `PickUpWarehouseCode` if set
    *   Falls back to the cart's store and its available warehouses
    *   Falls back to all warehouses if no store is set
4.  Fetches product data and inventory data
5.  For each line item:
    *   Skips virtual products and products in the "service" catalog
    *   Calculates current availability: `Quantity - ReservedQuantity + CalculatedQuantity`
    *   If a `RequestedDeliveryDate` is set on the cart, also calculates ATP availability by summing ATP entries with dates before the requested delivery date
    *   If the requested quantity exceeds current availability, checks against ATP availability
    *   Returns a validation error if both current and ATP availability are insufficient
6.  Returns one validation error per SKU that fails the check
7.  Without a `requestedDeliveryDate` on the order, ATP is never consulted — not even for a line item already reserved against an incoming purchase order (`isAwaitingPurchaseOrder: true`) — so such lines need current physical stock or a covering `requestedDeliveryDate` to pass

## Data validated

| Data | Source | Field(s) |
| --- | --- | --- |
| Requested quantity | The line item | `quantity` |
| Current availability | The inventory item for the SKU in each resolved warehouse | `inventory`, `reservedInventory`, `calculatedInventory` |
| Incoming stock (only when `requestedDeliveryDate` is set) | The ATP entries on the same inventory item | `atp[].date`, `atp[].availableQuantity` |
| Requested delivery date | The order | `requestedDeliveryDate` |
| Warehouse(s) to check | The first shipment, else the store's available warehouses, else all warehouses | `warehouseCode`, `pickUpWarehouseCode` |

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Cart has no line items | `CartIsEmpty` | `CartIsEmpty` |
| Insufficient stock for SKU | `InventoryValidatorErrorMessage` | `InsufficientInventory` |

## Configuration

No additional properties required.

```json
{
  "name": "inventoryAtpValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
