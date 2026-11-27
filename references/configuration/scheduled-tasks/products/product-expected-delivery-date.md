# Product Expected Delivery Date

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/product-expected-delivery-date

> Update expected delivery dates for products using ATP (Available to Promise) data

## Overview

This task updates expected delivery date information on products using ATP (Available to Promise) calculations. It enables accurate delivery date promises to customers by analyzing inventory availability, incoming shipments, and distribution rules across all products in the catalog.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ProductExpectedDeliveryDateScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Accurate delivery date estimates on product pages
*   ATP (Available to Promise) information for customers
*   Expected availability dates for out-of-stock items
*   Delivery promise calculations based on distribution rules

* * *

## Configuration Properties

This task has no configurable properties. ATP calculation rules are configured separately in the ATP service settings.

* * *

## Behavior

### What It Does

1.  Iterates through all products in the catalog
2.  For each product batch, collects all SKU IDs
3.  Calculates ATP data for each SKU using the distribution service
4.  Updates products with expected delivery information
5.  Exports updated ATP data for downstream systems

### ATP Calculation

ATP (Available to Promise) considers:

*   Current inventory levels
*   Reserved inventory
*   Expected incoming shipments
*   Distribution lead times
*   Warehouse availability

### Batch Processing

Products are processed in batches to optimize performance:

*   SKUs are collected and processed together
*   ATP calculations are performed in bulk where possible
*   Results are applied to products efficiently

### Prerequisites

*   ATP service must be configured
*   Distribution rules must be defined
*   Inventory and shipment data must be available

### Side Effects

*   Updates expected delivery date fields on products
*   Exports ATP data to integrated systems
*   Triggers product reindexing for updated products

* * *

## Example Configuration

```json
{
    "ImplementationType": "ProductExpectedDeliveryDateScheduledTask",
    "Schedule": "0 */6 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run several times daily (e.g., `0 */6 * * *` every 6 hours) to keep delivery date estimates current. More frequent runs may be needed if inventory changes rapidly or shipments are received frequently.

* * *

## Related Tasks

*   [Product Inventory Status](product-inventory-status.md) - Updates inventory levels used in ATP calculations
*   [Product Inventory Full Status](product-inventory-full-status.md) - Complete inventory refresh
