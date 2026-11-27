# Warehouse Locations

Source: https://docs.omnium.no/docs/Inventory/warehouse-locations

> Track inventory at specific physical locations within warehouses. Assign stock to locations, transfer between locations, set default locations for fulfillment and returns.

## Warehouse Location Management

Warehouse location management allows you to track inventory at specific physical locations within a warehouse — such as racks, bays, shelves, or bins. This enables precise stock placement, faster picking, and location-aware fulfillment.

When enabled, each inventory item (SKU + warehouse) can have a **breakdown** of quantities across multiple locations within the warehouse. The top-level warehouse inventory remains the authoritative total, and locations represent a partial or full breakdown of where that stock physically resides.

### Key Concepts

*   **Location code**: A free-form string identifying a physical position within a warehouse (e.g., `A-01-3`, `Rack-B-Bay-2`, `SHELF-42`). There is no enforced naming convention — use whatever scheme fits your warehouse layout.
*   **Default location**: Each SKU in a warehouse can have one location marked as the default. Returns are automatically routed to the default location, and fulfillment warnings reference it.
*   **Unlocated stock**: The difference between the warehouse total and the sum of all location quantities. Represents stock that hasn't been assigned to a specific location yet.
*   **Location inventory**: A nested entry on the inventory item that tracks quantity at a specific location code.

### The Inventory Invariant

```
Warehouse Total >= Sum of Location Quantities
```

The warehouse-level `Inventory` field is always the **authoritative total** — it represents the true amount of stock at the warehouse regardless of how much has been assigned to locations. Location quantities are a breakdown that may be partial (some stock can remain "unlocated") but can never exceed the warehouse total.

```
Unlocated Stock = Warehouse Total - Sum of Location Quantities
```

Unlocated stock is calculated, not stored. When you first enable location management, all existing stock starts as unlocated and can be gradually assigned to locations.

* * *

## Enabling Warehouse Locations

Enable the feature by setting `IsWarehouseLocationManagementEnabled` to `true` in tenant settings:

```
"InventoryManagement": {
  "IsWarehouseLocationManagementEnabled": true
}
```

This setting can also be toggled in the Omnium admin interface:

**Configuration** → **Settings** → **Products** → **Inventory** → **Enable warehouse location management**

Enabling location management has **no impact on existing inventory data**. All current stock will appear as "unlocated" until you assign it to locations. There is no migration step required — you can gradually assign stock to locations at your own pace.

* * *

## Data Model

Location data is stored as a nested list on the inventory item. No new entities or documents are created.

```
OmniumInventoryItem (ID: SKU + WarehouseCode — unchanged)
├── Sku: "SKU-001"
├── WarehouseCode: "MAIN-WH"
├── Inventory: 100              ← Authoritative warehouse total
├── ReservedInventory: 10       ← Warehouse-level reservations
├── Atp: [...]                  ← Existing ATP data
├── Batches: [...]              ← Existing batch data
└── LocationInventories:        ← Location breakdown
    ├── { LocationCode: "A-01-3", Quantity: 60, IsDefaultLocation: true }
    └── { LocationCode: "B-02-1", Quantity: 40, IsDefaultLocation: false }

Unlocated stock: 100 - (60 + 40) = 0
```

### OmniumLocationInventory Properties

| Property | Type | Description |
| --- | --- | --- |
| LocationCode | string | The location identifier within the warehouse (e.g., `A-01-3`) |
| Quantity | decimal | Amount of stock at this location |
| IsDefaultLocation | bool | Whether this is the default location for the SKU in this warehouse |

**Note:** `OmniumInventoryItem` also has a `Location` property (a single string field) used in inventory counts, reports, and exports. This property is **not related** to the location management feature — the two serve different purposes and coexist independently.

* * *

## Location Operations

### Assign to Location

Moves stock from the "unlocated" pool to a specific location. This does not change the warehouse total — it only creates or increases a location entry.

**Validation:** The sum of all location quantities after assignment must not exceed the warehouse total.

**Use case:** Initial setup when enabling location management, or when new stock arrives and needs to be placed at a location.

### Transfer Between Locations

Moves stock from one location to another within the same warehouse. The warehouse total remains unchanged — only the location breakdown is updated.

**Validation:** The source location must have sufficient quantity for the transfer.

**Use case:** Reorganizing stock within the warehouse, consolidating locations, or moving stock closer to the packing area.

### Set Default Location

Marks a location as the default for a SKU in a warehouse. Only one location can be the default at a time — setting a new default automatically clears the previous one.

**Use case:** Defining the primary picking location for a product. Returns and fulfillment warnings reference the default location.

* * *

## Location Codes

Location codes are free-form strings — there is no enforced naming convention. You can use whatever scheme matches your physical warehouse layout:

*   **Rack-Bay-Shelf:** `A-03-2`, `R01-B02-S03`
*   **Zone-based:** `ZONE-A-SHELF-12`, `PICK-AREA-3`
*   **Simple:** `BIN-42`, `SHELF-7`

### Autocomplete

When assigning or transferring stock in the UI, location codes are populated via autocomplete from all location codes that already exist in the warehouse. This helps prevent typos and ensures consistency.

You can also type a new location code directly — it will be created automatically when used for the first time. There is no need to pre-register or configure locations.

* * *

## UI: Product Inventory View

When warehouse location management is enabled, the product inventory view on the product edit page shows location breakdowns for each warehouse.

### Location Breakdown

Click the expand icon next to a warehouse row to reveal the location breakdown:

| Warehouse | In Stock | Reserved | Available |  |
| --- | --- | --- | --- | --- |
| **Main WH** | 100 | 10 | 90 | \[expand\] |
|    A-01-3 (default) | 60 | — |  | \[context menu\] |
|    B-02-1 | 40 | — |  | \[context menu\] |
|    Unlocated | 0 | — |  |  |

*   The **default** location is indicated with a badge
*   **Unlocated** row appears when there is stock not assigned to any location
*   Each location row has a context menu with **Transfer from location** and **Set as default** options
*   The warehouse row context menu includes **Assign to location** for moving unlocated stock

### Location Transfer Modal

The transfer modal supports both assigning unlocated stock and transferring between locations:

*   **From location**: Dropdown showing all locations with their current quantities, plus "Unlocated" when applicable
*   **To location**: Dropdown with autocomplete from existing location codes, plus free-form text entry for new codes
*   **Quantity**: Amount to transfer
*   **Set as default**: Optional toggle to mark the destination as the default location

* * *

## Returns Integration

When location management is enabled, returned inventory is automatically routed to the **default location** for the SKU at the return warehouse.

**How it works:**

1.  A return order triggers an inventory increase for the returned SKU
2.  The system looks up the default location for (SKU, return warehouse)
3.  If a default location exists, the returned quantity is added to that location's stock (in addition to the warehouse total)
4.  If no default location is set, the return updates only the warehouse total — the returned stock becomes "unlocated"

This ensures returned items are directed to a known physical location for inspection and restocking without requiring manual intervention.

* * *

## Fulfillment Warning

When processing an order (changing order status), the system can check whether the default location has sufficient stock to fulfill each order line.

**How it works:**

1.  Before the status change, the system validates each order line against the default location inventory
2.  If any line cannot be fulfilled from the default location, a warning dialog is shown
3.  The warning lists each problematic SKU with: the required quantity, the default location code, and the available quantity at that location
4.  The operator can choose to **proceed anyway** (soft warning) or **cancel** the status change

The fulfillment check is a **soft warning** — it does not block order processing. This is a V1 design decision to keep the feature simple. The warning helps warehouse operators identify items that may need to be picked from alternative locations.

* * *

## Transaction History

Inventory transactions include location information when applicable:

*   **Location transfers** are logged as `LocationTransfer` transaction type, showing both the source and destination locations
*   **Inventory changes** at specific locations record the location code on the transaction
*   The transaction list includes a **location filter** to view history for a specific location code (only visible when location management is enabled)

* * *

## API Reference

Location data is included in the existing inventory API when location management is enabled.

#### LocationInventories on Inventory Items

The `LocationInventories` property is automatically included on `OmniumInventoryItem` responses from existing endpoints (`Get`, `Search`, `Scroll`) when the data is present. No additional parameters are needed.

```json
{
  "sku": "SKU-001",
  "warehouseCode": "MAIN-WH",
  "inventory": 100,
  "reservedInventory": 10,
  "locationInventories": [
    {
      "locationCode": "A-01-3",
      "quantity": 60,
      "isDefaultLocation": true
    },
    {
      "locationCode": "B-02-1",
      "quantity": 40,
      "isDefaultLocation": false
    }
  ]
}
```

#### Location-Aware Inventory Updates

The `ProcessInventoryTransactions` endpoint (`OmniumInventoryUpdate`) accepts an optional `LocationCode` field. When provided and location management is enabled, the inventory change is applied to both the warehouse total and the specified location.

```json
{
  "skuId": "SKU-001",
  "warehouseCode": "MAIN-WH",
  "inventoryChange": 10,
  "locationCode": "A-01-3"
}
```

When `LocationCode` is omitted, only the warehouse total is updated (existing behavior preserved).

#### Creating/Updating Inventory with Locations

The `Post`, `AddMany`, `Update`, and `UpdateMany` endpoints accept `LocationInventories` on the inventory item. The data is passed through as-is — no server-side validation is performed on these endpoints for location totals or duplicates. It is the caller's responsibility to ensure that `sum(LocationInventories[].Quantity) <= Inventory` and that location codes are unique.

#### Transfer Location

```
POST /api/inventory/TransferLocation
```

Transfers stock between locations or assigns unlocated stock to a location.

```json
{
  "skuId": "SKU-001",
  "warehouseCode": "MAIN-WH",
  "fromLocationCode": "A-01-3",
  "toLocationCode": "B-02-1",
  "quantity": 10,
  "setAsDefault": false
}
```

Set `fromLocationCode` to `null` to assign from unlocated stock.

#### Set Default Location

```
POST /api/inventory/SetDefaultLocation
```

Sets the default location for a SKU in a warehouse.

```json
{
  "skuId": "SKU-001",
  "warehouseCode": "MAIN-WH",
  "locationCode": "A-01-3"
}
```

* * *

## Activation Guide

### Step 1: Enable the Feature

Enable `IsWarehouseLocationManagementEnabled` in tenant settings (UI or API).

### Step 2: Assign Stock to Locations

All existing stock starts as "unlocated". Use the product inventory view to assign stock:

1.  Navigate to a product's inventory tab
2.  Expand a warehouse row to see the "Unlocated" quantity
3.  Use **Assign to location** from the context menu
4.  Select or type a location code, enter the quantity, and optionally set as default
5.  Repeat for each location

Alternatively, use the API endpoints to bulk-assign locations programmatically.

### Step 3: Set Default Locations

For each SKU+warehouse combination, designate one location as the default. This enables:

*   Automatic routing of returns to the correct location
*   Fulfillment warnings that reference the pick location

### Step 4: Verify

*   Check the product inventory view to confirm location breakdowns are correct
*   Verify that unlocated quantities match expectations
*   Test a return to confirm it routes to the default location
*   Test an order status change to see the fulfillment warning in action

* * *

## V1 Limitations

The current implementation makes several simplifying decisions that may be expanded in future versions:

| Area | V1 Behavior | Future Consideration |
| --- | --- | --- |
| Reservations | Warehouse-level only. No `ReservedQuantity` on locations. | Add location-level reservation tracking |
| Fulfillment check | Soft warning only, does not block processing | Hard block or auto-consolidation |
| Concurrency | Last-write-wins (same as all inventory operations) | Optimistic concurrency for high-frequency operations |
| Browse by location | Location breakdown only visible on product pages | Standalone location browse page |
| Inventory counting | Not location-aware | Per-location stocktakes |
| Import/export | Location data not included in CSV import | Add location columns to import format |
| Search filtering | Public API search does not filter by location | Add `LocationCode` filter to search request |
| Location entity | Location codes are free-form strings, no separate entity | CRUD entity with descriptions and validation |

* * *

## Troubleshooting

### Location breakdown not visible on product page

1.  Verify `IsWarehouseLocationManagementEnabled` is enabled in tenant settings
2.  Check that the inventory item has `LocationInventories` data (assign stock to at least one location)
3.  Refresh the page — the expand icon only appears when location data exists

### Transfer fails with validation error

1.  **"Insufficient quantity"**: The source location does not have enough stock for the requested transfer amount
2.  **"Sum exceeds inventory"**: Assigning more stock to locations than the warehouse total allows. Check the unlocated quantity first.

### Returns not going to default location

1.  Verify a default location is set for the SKU at the return warehouse
2.  Check that `IsWarehouseLocationManagementEnabled` is enabled
3.  If no default location is configured, returned stock will increase the warehouse total only (becoming unlocated)

### Fulfillment warning not appearing

1.  The warning only appears during order status changes
2.  Verify the order has items with inventory at warehouses that use location management
3.  The warning only shows when the default location has insufficient stock — if there's enough stock (or no default location), no warning is shown

### Unlocated quantity is negative or unexpected

This indicates that the sum of location quantities exceeds the warehouse total, which violates the inventory invariant. This can happen if:

1.  The warehouse total was reduced externally without updating location quantities
2.  A data inconsistency occurred during concurrent updates

To fix: manually adjust location quantities via the transfer modal or API to ensure `sum(locations) <= warehouse total`.
