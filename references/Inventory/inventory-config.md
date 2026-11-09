# Configuration

Source: https://docs.omnium.no/docs/Inventory/inventory-config

> Learn how to configure inventory management settings in Omnium. This guide covers inventory tracking, reservations, ATP providers, inventory valuation, and warehouse allocation.

## Inventory management

Omnium provides comprehensive inventory management capabilities that can serve as the primary inventory source for smaller operations or integrate with external ERP/WMS systems for larger deployments. The inventory configuration controls how stock is tracked, reserved, valued, and allocated across warehouses and sales channels.

### Core settings

These settings control the fundamental inventory management behavior.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsEnabled | bool | false | Master switch for the inventory management system. When disabled, all inventory-related functionality is turned off. |
| IsWriteEnabled | bool | false | Controls whether inventory modification operations (reduce, increase, update) are allowed. When disabled, inventory becomes read-only and cannot be modified through orders or manual adjustments. |
| IsReservationWriteEnabled | bool | false | Allows inventory reservations to be created independently of the general write setting. Enable this when you want to track reservations but prevent other inventory modifications. |

#### Sample

```
"InventoryManagement": {
  "IsEnabled": true,
  "IsWriteEnabled": true,
  "IsReservationWriteEnabled": true
}
```

### Inventory calculation

These settings control how available inventory is calculated and displayed.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsAvailableInventoryIgnoringReserved | bool | false | When enabled, available inventory equals total inventory (reservations are ignored). When disabled, available inventory equals total minus reserved quantity. Enable this if reservations are managed externally. |
| IsProductInventoryWarehouseSpecific | bool | false | When enabled, inventory is tracked and displayed per warehouse. When disabled, inventory is aggregated across all warehouses for display purposes. |

#### Sample

```
"InventoryManagement": {
  "IsAvailableInventoryIgnoringReserved": false,
  "IsProductInventoryWarehouseSpecific": true
}
```

### Reservation processing

These settings control how inventory reservations are processed when orders are created.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsInventoryReservationTriggeredOnOrderCreation | bool | false | When enabled, inventory reservations are created immediately when a cart is converted to an order. When disabled, reservations are created by the IncreaseReservedInventory workflow step. |

#### UI location

This setting can be configured in the Omnium admin interface:

**Configuration** → **Settings** → **Products** → **Inventory Management** tab → **Reserve inventory on cart conversion**

**Important:** When `IsInventoryReservationTriggeredOnOrderCreation` is enabled, you must remove the [Increase Reserved Inventory](../Order/workflow-steps/inventory/increase-reserved-inventory.md) workflow step from the first order status (typically "New") to avoid double reservations.

#### Sample

```
"InventoryManagement": {
  "IsInventoryReservationTriggeredOnOrderCreation": true
}
```

### Expected delivery

These settings control expected delivery date handling.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsCheckExpectedDeliveryDateEnabled | bool | false | When enabled, expected delivery dates are validated during order processing. This ensures that promised delivery dates can be met based on current inventory and incoming purchase orders. |

#### Sample

```
"InventoryManagement": {
  "IsCheckExpectedDeliveryDateEnabled": true
}
```

### Product lifecycle

These settings control how inventory updates affect product data.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsExpiredProductsAutoDeactivated | bool | false | When enabled, products that have expired and are out of stock are automatically deactivated. Requires the ProductInventoryStatusScheduledTask to be running. |
| IsProductInventoryExportDisabled | bool | false | When enabled, product export is skipped when updating products with new inventory status. Use this to prevent unnecessary exports when inventory changes frequently. |
| SkipModifiedDateOnInventoryUpdate | bool | false | When enabled, the product's Modified timestamp is preserved when inventory status is updated. Use this when you don't want inventory changes to trigger modified-date-based processes. |
| IsInventoryDeletedWhenProductIsDeleted | bool | false | When enabled, inventory records are automatically deleted when their associated product is deleted. When disabled, inventory records are preserved (orphaned). |

#### Sample

```
"InventoryManagement": {
  "IsExpiredProductsAutoDeactivated": true,
  "IsProductInventoryExportDisabled": false,
  "SkipModifiedDateOnInventoryUpdate": true,
  "IsInventoryDeletedWhenProductIsDeleted": true
}
```

### Validation

These settings control inventory validation behavior during order processing.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsInventoryValidationDisabledForNonPromotions | bool | false | When enabled, inventory validation is skipped for items that are not part of a promotion. Use this when non-promotional items should not be blocked by inventory constraints. |
| IgnoredOrderTypesForAssortmentInventoryValidator | List<string> | \[\] | Order types that are exempt from assortment inventory validation. Orders of these types will not be validated against warehouse assortment rules. |
| StockBuffer | decimal | null | Default units subtracted from available stock during cart validation. Overridden by store-level value. See [Stock Buffer](stock-buffer.md) for details. |

#### Sample

```
"InventoryManagement": {
  "IsInventoryValidationDisabledForNonPromotions": false,
  "IgnoredOrderTypesForAssortmentInventoryValidator": ["Pos", "Manual"]
}
```

* * *

## ATP providers

Available-To-Promise (ATP) providers calculate when products will be available for delivery based on current inventory, reservations, and incoming purchase orders. ATP calculations help determine realistic delivery dates for customers.

For comprehensive documentation on ATP concepts, calculation algorithms, and how ATP is used throughout Omnium, see [Inventory ATP](inventory-atp.md).

### ATP provider settings

| Property | Type | Description |
| --- | --- | --- |
| Key | string | Unique identifier for the ATP provider. Must match a registered provider type (e.g., "OmniumAtpProvider"). |
| AtpCalculationType | string | Optional calculation type parameter passed to the provider. Provider-specific. |

### Built-in providers

| Provider | Description |
| --- | --- |
| [OmniumAtpProvider](inventory-atp/omnium-atp-provider.md) | Built-in ATP provider that calculates availability based on Omnium's inventory and purchase order data. Considers current stock, reservations, and expected deliveries from purchase orders. |

### Sample

```
"InventoryManagement": {
  "AtpProviders": [
    {
      "Key": "OmniumAtpProvider",
      "AtpCalculationType": null
    }
  ]
}
```

* * *

## Inventory value providers

Inventory value providers calculate the cost value of inventory using different costing methods. These calculations are used for financial reporting and cost tracking.

For comprehensive documentation on inventory valuation concepts, batch tracking, and detailed provider comparisons, see [Inventory Value](inventory-value.md).

### Inventory value provider settings

| Property | Type | Description |
| --- | --- | --- |
| Key | string | Unique identifier for the inventory value provider. Must match a registered provider type. |

### Built-in providers

| Provider | Description |
| --- | --- |
| [FifoInventoryValueProvider](inventory-value/fifo-provider.md) | Uses First-In-First-Out (FIFO) costing method. The cost of goods sold is based on the cost of the oldest inventory items. This method is useful for perishable goods or items with varying purchase costs over time. |
| [AverageInventoryValueProvider](inventory-value/average-provider.md) | Uses weighted average costing method. The cost is calculated as the average cost of all inventory items. This method smooths out price fluctuations and is simpler to maintain. |
| [DefaultInventoryValueProvider](inventory-value/default-provider.md) | Default provider that uses the product's standard cost price. |

### Sample

```
"InventoryManagement": {
  "InventoryValueProviders": [
    {
      "Key": "FifoInventoryValueProvider"
    }
  ]
}
```

* * *

## Warehouse allocation

These settings control how inventory is allocated across warehouses and how orders are assigned to fulfillment locations.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsOrderReallocationBasedOnOrderStore | bool | false | When enabled, warehouse selection for order fulfillment is based on the order's associated store. This allows orders to be routed to the warehouse linked to the originating store. |
| UseVirtualStockLocations | bool | false | When enabled, virtual stock location (VSL) functionality is activated. VSLs allow you to partition physical warehouse inventory across multiple virtual warehouses for different sales channels. See [Virtual Stock Locations](virtual-stock-locations.md) for details. |
| IsWarehouseLocationManagementEnabled | bool | false | When enabled, inventory can be tracked at specific physical locations within warehouses (e.g., racks, bays, shelves). Adds location breakdown to inventory items, location transfer operations, default location routing for returns, and fulfillment warnings. See [Warehouse Locations](warehouse-locations.md) for details. |
| WarehouseAllocationAvailableForStoreRoles | List<string> | \[\] | List of store roles that are allowed to perform warehouse allocation operations. When set, only stores with these roles can allocate inventory. Leave empty to allow all stores. |

### Sample

```
"InventoryManagement": {
  "IsOrderReallocationBasedOnOrderStore": true,
  "UseVirtualStockLocations": true,
  "IsWarehouseLocationManagementEnabled": false,
  "WarehouseAllocationAvailableForStoreRoles": ["Warehouse", "Distribution"]
}
```

* * *

## Complete configuration example

Below is a comprehensive example showing all inventory management settings configured together:

```json
{
  "InventoryManagement": {
    "IsEnabled": true,
    "IsWriteEnabled": true,
    "IsReservationWriteEnabled": true,

    "IsAvailableInventoryIgnoringReserved": false,
    "IsProductInventoryWarehouseSpecific": true,

    "IsInventoryReservationTriggeredOnOrderCreation": false,
    "IsCheckExpectedDeliveryDateEnabled": true,

    "IsExpiredProductsAutoDeactivated": true,
    "IsProductInventoryExportDisabled": false,
    "SkipModifiedDateOnInventoryUpdate": false,
    "IsInventoryDeletedWhenProductIsDeleted": true,

    "IsInventoryValidationDisabledForNonPromotions": false,
    "IgnoredOrderTypesForAssortmentInventoryValidator": ["Pos"],

    "AtpProviders": [
      {
        "Key": "OmniumAtpProvider",
        "AtpCalculationType": null
      }
    ],

    "InventoryValueProviders": [
      {
        "Key": "FifoInventoryValueProvider"
      }
    ],

    "IsOrderReallocationBasedOnOrderStore": false,
    "UseVirtualStockLocations": false,
    "IsWarehouseLocationManagementEnabled": false,
    "WarehouseAllocationAvailableForStoreRoles": []
  }
}
```
