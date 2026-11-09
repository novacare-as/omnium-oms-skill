# Variant Location From Product

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/variant-location-from-product

> Copy location data from products to their variants for warehouse placement

## Overview

This task copies the location field from products to all their variants. This is useful when warehouse location data is maintained at the product level but needs to be accessible on individual variants for picking, packing, and inventory management purposes.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `VariantLocationFromProductScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Variant-level location data derived from product location
*   Warehouse location information on variants for fulfillment
*   Consistent location data across all variants of a product
*   Location inheritance from parent product to variants

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Iterates through all products in the catalog
2.  For each product with a location value:
    *   Retrieves all variants of the product
    *   Copies the product's location to each variant
3.  Updates products in batches for efficiency
4.  Skips products without location data or without variants

### Location Inheritance

This task implements a simple inheritance model:

*   The product's location is treated as the master value
*   All variants receive the same location as their parent product
*   Variant-specific locations are overwritten by the product location

### Prerequisites

*   Products with location data must exist
*   Products must have variants defined

### Side Effects

*   Overwrites location data on all variants
*   Any variant-specific locations are replaced with the product location
*   Triggers product reindexing for updated products

* * *

## Example Configuration

```json
{
    "ImplementationType": "VariantLocationFromProductScheduledTask",
    "Schedule": "0 5 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (e.g., `0 5 * * *` at 5 AM), or after product imports that update location data.

* * *

## Related Tasks

None specific. This task is typically used independently for location data maintenance.
