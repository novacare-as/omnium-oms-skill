# Omnium ATP Provider

Source: https://docs.omnium.no/docs/Inventory/inventory-atp/omnium-atp-provider

> Built-in ATP provider that calculates availability based on Omnium's inventory and purchase order data

The Omnium ATP Provider is the built-in ATP implementation that calculates product availability using Omnium's own inventory and purchase order data. It considers current stock levels, existing reservations, and future deliveries from purchase orders.

**Provider Key:** `OmniumAtpProvider`

* * *

## Overview

The Omnium ATP Provider performs two main functions:

1.  **Recalculate ATP Index** - Updates ATP data stored on inventory items based on active purchase orders and their reservations
2.  **Calculate ATP** - Determines when a specific quantity of a product will be available

This provider is ideal for businesses that manage their purchase orders and inventory entirely within Omnium.

* * *

## How It Works

### Recalculating the ATP Index

When ATP recalculation is triggered, the provider:

1.  **Recalculates reserved inventory** across all relevant SKUs
2.  **Fetches active purchase order lines** with available quantities (not yet fully delivered or canceled)
3.  **Builds ATP entries** for each inventory item with future availability data
4.  **Gets current inventory** for the affected SKUs and warehouses
5.  **Creates missing inventory records** if needed (for SKU/warehouse combinations that don't exist yet)
6.  **Updates order delivery dates** on orders reserved against these purchase orders
7.  **Saves inventory** with updated ATP data

### Purchase Order Line Selection

Only purchase order lines that meet these criteria are included in ATP:

*   Part of an active (not completed) purchase order
*   Has available quantity (quantity minus canceled and delivered quantities is greater than zero)
*   Not disabled for allocation
*   Has either an estimated arrival date or delivered date set

### Building ATP Entries

For each qualifying purchase order line, an ATP entry is created with:

| Field | Source |
| --- | --- |
| Date | Estimated arrival date or delivered date from the purchase order line |
| Quantity | Available quantity on the purchase order line |
| ReservedQuantity | Sum of reservations from orders waiting for this purchase order line |
| PurchaseOrderId | Parent purchase order ID |
| PurchaseOrderLineId | Line item ID |
| DeliveryId | Delivery ID (for partial deliveries) |

### Handling Reservations

The provider considers order reservations when calculating available ATP:

*   Gets all orders with line items reserved against the purchase order lines
*   Excludes orders that are on hold
*   Excludes line items that are canceled
*   Calculates reserved quantity as the minimum of:
    *   The reserved quantity on the order line
    *   The remaining quantity to deliver (quantity minus canceled and delivered)

This prevents over-counting when orders have been partially delivered or canceled.

* * *

## ATP Calculation

When ATP is calculated for a request, the provider:

1.  **Gets inventory** for the requested SKU across specified warehouses (or all if not specified)
2.  **Calculates current availability** as on-hand inventory minus reserved inventory
3.  **If no ATP entries exist** - Returns immediately with only current availability
4.  **Sorts ATP entries** by date (ascending)
5.  **Accumulates availability** through time:
    *   For each ATP entry, adds available quantity (quantity minus reserved)
    *   Checks if accumulated quantity meets the requested amount
    *   Checks if the date meets the requested delivery date (if specified)

### Calculation Example

**Inventory state:**

*   Current inventory: 10 units
*   Reserved inventory: 5 units
*   Available now: 5 units

**ATP entries:**

| Date | Quantity | Reserved | Available |
| --- | --- | --- | --- |
| Jan 15 | 50 | 20 | 30 |
| Jan 25 | 100 | 50 | 50 |

**Request:** 60 units, requested by Jan 20

**Calculation:**

1.  Available now = 5 units
2.  After Jan 15 delivery: 5 + 30 = 35 units
3.  35 < 60, continue to next entry
4.  After Jan 25 delivery: 35 + 50 = 85 units
5.  85 >= 60, quantity available on Jan 25
6.  Jan 25 > Jan 20 (requested date)

**Result:**

```json
{
  "AvailableNow": 5,
  "AvailableAt": "2025-01-25",
  "Quantity": 60,
  "CanBeDelivered": false
}
```

`CanBeDelivered` is false because the quantity won't be available until after the requested date.

* * *

## Virtual Stock Locations

The provider fully supports Virtual Stock Locations (VSL):

*   ATP is calculated separately for physical and virtual warehouses
*   Virtual warehouse ATP uses the allocated quantities from purchase order lines
*   Physical warehouse ATP comes directly from the purchase order line quantities
*   Each virtual warehouse gets its own inventory record with its own ATP entries

This allows different sales channels to have visibility into their allocated future inventory.

* * *

## Conflict Handling

The provider includes robust conflict handling for concurrent updates:

1.  **Initial save attempt** - Tries to save all updated inventory items
2.  **On conflict** - Version conflict detected due to concurrent modification
3.  **Retry mechanism:**
    *   Waits briefly
    *   Fetches fresh data for conflicted items only
    *   Reapplies ATP calculations to fresh data
    *   Retries save (max 5 retries)
4.  **On failure** - Reports error with details about which items could not be updated

This prevents data loss when multiple processes update inventory simultaneously.

* * *

## Order Delivery Date Updates

When recalculating ATP, the provider also updates order line delivery dates:

1.  Finds orders with line items reserved against the processed purchase orders
2.  Updates the expected delivery date on each reserved line item to match the purchase order line's estimated arrival
3.  Saves updated orders

This keeps orders synchronized with the latest purchase order delivery estimates.

* * *

## Configuration

```json
{
  "InventoryManagement": {
    "AtpProviders": [
      {
        "Key": "OmniumAtpProvider",
        "AtpCalculationType": null
      }
    ]
  }
}
```

The `AtpCalculationType` property is optional and can be used to label calculations for reporting or debugging purposes.

* * *

## When to Use

The Omnium ATP Provider is appropriate when:

*   Purchase orders are managed within Omnium
*   You need automatic ATP calculation based on expected deliveries
*   Order reservations should be tracked against purchase order lines
*   Products need automatic expected delivery date updates
*   Virtual stock locations require separate ATP tracking

**Not recommended when:**

*   ATP is calculated by an external ERP system
*   You don't use purchase orders in Omnium
*   Simple stock availability is sufficient (no forward-looking availability needed)

* * *

## Performance Considerations

*   ATP recalculation queries purchase orders and orders, which can be resource-intensive for large datasets
*   Consider using asynchronous processing for bulk ATP updates
*   Order updates can be skipped when not needed to reduce processing time
*   Conflict retries add latency but prevent data inconsistency

* * *

## Related Topics

*   [Inventory ATP Overview](../inventory-atp.md)
*   [Virtual Stock Locations](../virtual-stock-locations.md)
*   [Inventory Configuration](../inventory-config.md)
