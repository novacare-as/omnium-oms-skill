# Inventory

Source: https://docs.omnium.no/docs/Inventory

> Inventory management in Omnium — stock levels, ATP calculations, inventory valuation, and virtual stock locations.

Omnium can be main source of inventory for smaller customers. Monitoring and controlling the stock of products to ensure availability and avoid stockouts. For larger customers, ERP or WMS is usually managing inventory.

* * *

## In this section

*   [API Reference](Inventory/inventory-api.md) — Update, search, and manage inventory via the API
*   [Configuration](Inventory/inventory-config.md) — Inventory tracking, reservations, ATP providers, and warehouse allocation
*   [Available-To-Promise (ATP)](Inventory/inventory-atp.md) — Forward-looking availability calculations and delivery date promises
*   [Inventory Valuation](Inventory/inventory-value.md) — Default, average cost, and FIFO valuation methods
*   [OmniStock](Inventory/omnistock.md) — Aggregate inventory across warehouses and stores for online product availability
*   [Virtual Stock Locations](Inventory/virtual-stock-locations.md) — Partition physical warehouse inventory across virtual locations for different sales channels
*   [Warehouse Locations](Inventory/warehouse-locations.md) — Track inventory at physical locations within warehouses for precise stock placement and picking
*   [Priority Stock](Inventory/priority-stock.md) — Mark units allocation sells first, such as a return a store took in for a product it does not carry

* * *

## Available-To-Promise (ATP)

ATP calculations determine when products will be available for delivery by considering current inventory, reservations, and incoming purchase orders. This enables realistic delivery date promises to customers and optimized inventory allocation.

Key capabilities:

*   **Forward-looking availability**: Consider future purchase order deliveries, not just current stock
*   **Reservation tracking**: Track reservations against future inventory
*   **Automatic delivery dates**: Update product expected delivery dates based on ATP calculations
*   **Order validation**: Validate orders against realistic availability including future stock

For comprehensive documentation on ATP concepts and providers, see [Inventory ATP](Inventory/inventory-atp.md).

## Inventory Valuation

Omnium supports multiple inventory valuation methods to calculate the cost value of your stock. These methods determine how costs are assigned when inventory is received and consumed.

Available valuation methods:

*   **Default**: Simple single-cost valuation without batch tracking
*   **Average Cost**: Weighted average method that smooths price fluctuations
*   **FIFO (First-In-First-Out)**: Precise batch tracking where oldest inventory is consumed first

For detailed documentation on each method, including examples and configuration, see [Inventory Value](Inventory/inventory-value.md).

## OmniStock

OmniStock aggregates inventory from multiple warehouses and stores to determine which products are available for online purchase. It evaluates business rules, assortment configuration, and inventory levels to produce per-store availability and stock level indicators on each product.

For comprehensive documentation on OmniStock, including setup, rules configuration, and integration scenarios, see [OmniStock](Inventory/omnistock.md).

## Virtual Stock Locations (VSLs)

Virtual stock locations allow you to partition physical warehouse inventory across multiple virtual warehouses, enabling control over how much inventory different sales channels can access and sell from the same physical warehouse.

For comprehensive documentation on VSLs, including setup, inventory rules, and configuration, see [Virtual Stock Locations](Inventory/virtual-stock-locations.md).

## Warehouse Locations

Warehouse location management allows you to track inventory at specific physical locations within a warehouse — such as racks, bays, shelves, or bins. This enables precise stock placement, faster picking, and location-aware fulfillment including automatic routing of returns to default locations.

For comprehensive documentation on warehouse locations, including setup, operations, and API reference, see [Warehouse Locations](Inventory/warehouse-locations.md).
