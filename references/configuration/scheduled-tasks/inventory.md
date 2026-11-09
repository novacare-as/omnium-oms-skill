# Inventory Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory

> Background jobs for stock levels, allocation tracking, valuation, and reorder suggestions

The Inventory scheduled tasks are responsible for managing stock levels, tracking inventory allocation across virtual stock locations, calculating inventory valuations, and generating reorder suggestions.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Inventory Value](inventory/inventory-value.md) | Create daily snapshots of inventory valuation by warehouse and currency | Delta |
| [Unallocated Inventory](inventory/unallocated-inventory.md) | Recalculate unallocated inventory for all products with virtual stock locations | Delta |
| [Product Unallocated Inventory](inventory/product-unallocated-inventory.md) | Sync unallocated inventory data to product records | Delta |
| [Overallocated Inventory](inventory/overallocated-inventory.md) | Detect and correct overallocated virtual stock to prevent overselling | Delta |
| [Add Cost and Currency to Inventory](inventory/add-cost-currency-to-inventory.md) | Propagate cost and currency from products to inventory items | Delta |
| [Product Cost in Default Currency](inventory/product-cost-default-currency.md) | Calculate and update product cost in the default currency | Delta |
| [Supplier Reorder Suggestions](inventory/supplier-reorder-suggestions.md) | Update supplier records with reorder recommendations | Delta |
| [Resolve Over-Reserved Inventory](inventory/resolve-over-reserved-inventory.md) | Detect and remove inventory reservations that exceed available stock using FIFO order priority | Delta |

* * *

## Overview

Inventory tasks work together to maintain accurate stock data and support inventory planning:

1.  **Inventory Valuation** - Creates point-in-time snapshots of total inventory value across warehouses
2.  **Virtual Stock Location Management** - Tracks allocation of physical inventory to virtual stock locations
3.  **Cost Data Consistency** - Ensures inventory items have up-to-date cost and currency information
4.  **Reorder Planning** - Aggregates reorder suggestions by supplier for procurement workflows

* * *

## Virtual Stock Locations

Several tasks in this group support Virtual Stock Locations (VSL), a feature that allows multiple sales channels to share inventory from a single physical warehouse while maintaining separate stock allocations.

### Key Concepts

*   **Physical Warehouse**: The actual location where products are stored
*   **Virtual Stock Location**: A logical partition of the physical warehouse's inventory assigned to a specific sales channel
*   **Unallocated Inventory**: Stock in the physical warehouse that has not been assigned to any virtual location
*   **Overallocated Inventory**: When the sum of virtual allocations exceeds available physical stock

### Related Tasks

The following tasks work together to manage VSL:

1.  **Unallocated Inventory** - Recalculates the unallocated amount for each SKU/warehouse
2.  **Product Unallocated Inventory** - Syncs the calculated values to product records
3.  **Overallocated Inventory** - Corrects situations where virtual allocations exceed physical stock

* * *

## Common Use Cases

### Daily Inventory Valuation Reporting

Enable the Inventory Value task to create historical records of inventory worth. This data is used for financial reporting and trend analysis.

### Multi-Channel Inventory Management

Enable the unallocated inventory tasks when using virtual stock locations to ensure accurate available-to-sell quantities across sales channels.

### Automated Overselling Prevention

Enable the Overallocated Inventory task to automatically reduce virtual stock levels when allocations exceed physical inventory, preventing overselling scenarios.

### Cost-Based Inventory Reporting

Enable the cost synchronization tasks to ensure inventory items have accurate cost data for gross margin calculations and inventory value reports.

### Supplier Purchase Planning

Enable the Supplier Reorder Suggestions task to aggregate reorder recommendations by supplier, streamlining the procurement process.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Inventory Value | `0 1 * * *` (daily at 1 AM) | Daily snapshot sufficient for reporting |
| Unallocated Inventory | `0 2 * * *` (daily at 2 AM) | Full recalculation, run off-peak |
| Product Unallocated Inventory | `*/15 * * * *` (every 15 minutes) | Keep product data current |
| Overallocated Inventory | `*/5 * * * *` (every 5 minutes) | Frequent checks to prevent overselling |
| Cost sync tasks | `0 3 * * *` (daily at 3 AM) | Cost changes are typically infrequent |
| Supplier Reorder Suggestions | `0 4 * * *` (daily at 4 AM) | Procurement planning typically done daily |

* * *

## Dependencies

Some inventory tasks have dependencies on other tasks or features:

| Task | Dependencies |
| --- | --- |
| Inventory Value | Products with cost data, configured currencies |
| Unallocated Inventory | Virtual Stock Locations enabled, warehouse configuration |
| Product Unallocated Inventory | Unallocated Inventory task must run first |
| Overallocated Inventory | Unallocated Inventory task must run first |
| Product Cost in Default Currency | Default cost currency configured in tenant settings |
| Supplier Reorder Suggestions | Analytics reorder suggestions data |
