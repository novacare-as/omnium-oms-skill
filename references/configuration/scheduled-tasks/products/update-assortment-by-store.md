# Update Assortment By Store

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/update-assortment-by-store

> Update product assortment based on store assignment configuration

## Overview

This task updates product assortment flags based on store assignments. Products can be assigned to specific stores, and this task ensures the assortment data reflects those assignments, controlling product visibility across different store locations.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `UpdateAssortmentByStoreScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Store-specific product catalogs
*   Different product assortments for different locations
*   Store-based product visibility control
*   Multi-store retail operations with varying inventory

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Iterates through all products in the catalog
2.  For each product, evaluates store assignment configuration
3.  Updates the product's assortment flags based on assigned stores
4.  Products are made visible only in their assigned stores

### Assortment Logic

A product is included in a store's assortment if:

*   The product is explicitly assigned to that store
*   Or the product has no store restrictions (available everywhere)

### Prerequisites

*   Products must exist in the system
*   Stores must be configured
*   Store assignments must be defined on products

### Side Effects

*   Updates assortment flags on products
*   May change product visibility across stores
*   Triggers product reindexing for affected products

* * *

## Example Configuration

```json
{
    "ImplementationType": "UpdateAssortmentByStoreScheduledTask",
    "Schedule": "0 3 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (e.g., `0 3 * * *` at 3 AM). Run more frequently if store assignments change often and immediate visibility changes are required.

* * *

## Related Tasks

*   [Update Assortment By Price](update-assortment-by-price.md) - Updates assortment based on price availability
