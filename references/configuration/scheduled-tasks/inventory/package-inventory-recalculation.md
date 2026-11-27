# Package Inventory Recalculation

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/package-inventory-recalculation

> Recalculate the calculated inventory of packages and bundles whose component stock changed through bulk inventory updates

## Overview

This task keeps the stock of packages and bundles up to date when the stock of their components changes. Package and bundle stock is not counted; it is calculated from the available stock of the components and stored in `CalculatedInventory` on the package's inventory item (see [Component Inventory](../../../Product/product-components/inventory.md)).

Some stock updates save the component stock without recalculating the packages, so that large stock feeds stay fast. The inventory Excel import is among them, and so are the bulk endpoints `PUT /api/Inventory/UpdateMany` and `PUT /api/Inventory/UpdateManyWithMetadata`, unless [inventory rules are applied to API inventory updates](../../../Inventory/virtual-stock-locations.md#applying-rules-to-api-inventory-updates) and the request changes a quantity. This task finds the inventory items that changed since its last run and recalculates, in batches, every package and bundle that contains one of them.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `PackageInventoryRecalculationScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Use packages or bundles (`HasPackages` enabled in the product settings)
*   Update component stock through `UpdateMany`, `UpdateManyWithMetadata`, or the inventory Excel import, for example from an ERP or WMS stock feed
*   See package or bundle stock that does not follow the stock of its components

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Reads the inventory items that changed since the start of the last successful run, minus a 5-minute margin, sorted by SKU
2.  Collects the changed SKUs per warehouse, in batches of about 50,000 changed inventory items. A batch always holds every changed warehouse of each of its SKUs
3.  For each batch, finds every package and bundle that has one of the changed SKUs as a component, including package and bundle variants
4.  Calculates the package stock again in the warehouses where a component changed, and saves the packages whose calculated stock differs from the stored value
5.  Recalculates packages that contain a recalculated package (nested packages), up to 3 levels

Within a batch, warehouses in which the same SKUs changed are handled together, so a stock feed that covers every warehouse costs one package lookup, not one per warehouse. The batches keep the memory use of a run bounded, however many inventory items changed.

### Overlap Between Runs

Each run looks 5 minutes further back than the start of the last successful run. A large stock update is written in several parts and can become searchable after the run that should have seen it, so the margin makes sure every change is covered by more than one run. An inventory item seen twice costs a lookup but no write, because a package whose calculated stock is unchanged is not saved again.

On its first run, the task only covers changes from the last 5 minutes. It does not recalculate packages for older changes.

### Failure Handling

The run fails, and the next run reads the same changes again, when:

*   The search for changed inventory items fails, or is answered by only part of the search index
*   The stock of the components of a package that contains a changed SKU cannot be read

A package is never saved with a stock calculated from a failed read. When a nested package cannot be recalculated, the run continues, and the next run recalculates it, because the package it contains was saved as a change.

### Prerequisites

*   `HasPackages` must be enabled in the product settings (`ProductSettings.HasPackages = true`). Without it, the task ends without doing anything
*   Packages and bundles must have their components defined

### Side Effects

*   Sets `CalculatedInventory` on the inventory item of each recalculated package or bundle, and sets `Inventory` and `ReservedInventory` on that item to `0`
*   Creates the inventory item of a package in a warehouse where it does not exist yet
*   Exports the changed package inventory items like any other inventory change
*   Does not change component stock, products, or orders

* * *

## Example Configuration

```json
{
    "ImplementationType": "PackageInventoryRecalculationScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 5 minutes (`*/5 * * * *`). Package stock then follows a bulk stock feed within a few minutes. A run with no inventory changes ends after one search.

* * *

## Related Tasks

*   [Unallocated Inventory](unallocated-inventory.md) - Recalculates unallocated inventory for products with virtual stock locations
*   [Resolve Over-Reserved Inventory](resolve-over-reserved-inventory.md) - Removes reservations that exceed available stock
