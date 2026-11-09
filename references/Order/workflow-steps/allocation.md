# Allocation Workflow Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation

> Workflow steps for warehouse allocation, order splitting, and reallocation in Omnium OMS.

Allocation workflow steps handle the assignment of orders and order lines to warehouses, splitting orders across multiple fulfillment locations, and reallocating orders when inventory or circumstances change.

## Overview

These steps are critical for distributed order management (DOM), enabling:

*   **Initial allocation** - Assigning orders to warehouses based on inventory and proximity
*   **Order splitting** - Dividing orders across multiple warehouses when no single location has all items
*   **Reallocation** - Moving orders to different warehouses when cancellations occur or inventory becomes available
*   **Package handling** - Breaking down bundled products into components

## Available Steps

### Warehouse Assignment

| Step | Key | Description |
| --- | --- | --- |
| [Allocate to Warehouse](allocation/allocate-to-warehouse.md) | `AllocateToWarehouse` | Assign all shipments to a specific warehouse |
| [Set Warehouse Based on Zip](allocation/set-warehouse-based-on-zip.md) | `SetWarehouseBasedOnZip` | Assign warehouse based on delivery zip code |
| [Try Allocate to Current Warehouses](allocation/try-allocate-order-to-current-warehouses.md) | `TryAllocateOrderToCurrentWarehouses` | Lock shipments where current warehouse has all items |

### Order Splitting

| Step | Key | Description |
| --- | --- | --- |
| [Try Split Order to Warehouse](allocation/try-split-order-to-warehouse.md) | `TrySplitOrderToWarehouse` | Split available items to a specific warehouse |
| [Try Split Unreserved Order Lines](allocation/try-split-unreserved-order-lines.md) | `TrySplitUnreservedOrderLines` | Split unreserved lines using configurable filters |
| [Try Split Unreserved to Closest Zip](allocation/try-split-unreserved-order-lines-to-closest-zip.md) | `TrySplitUnreservedOrderLinesToClosestZip` | Split to nearest warehouse by zip code |
| [Try Split Unreserved to Nearest Coordinates](allocation/try-split-unreserved-order-lines-to-nearest-coordinates.md) | `TrySplitUnreservedOrderLinesToNearestCoordinates` | Split to nearest warehouse by coordinates |
| [Try Split Unreserved to New Shipment](allocation/try-split-unreserved-order-lines-to-new-shipment.md) | `TrySplitUnreservedOrderLinesToNewShipment` | Split unreserved lines to a new shipment |

### Reallocation

| Step | Key | Description |
| --- | --- | --- |
| [Try Reallocate Entire Order](allocation/try-reallocate-entire-order.md) | `TryReallocateEntireOrder` | Move entire order to warehouse with all items in stock |
| [Try Reallocate Entire Order to Specific Warehouse](allocation/try-reallocate-entire-order-to-specific-warehouse.md) | `TryReallocateEntireOrderToSpecificWarehouse` | Move entire order to a named warehouse |
| [Reallocate Entire Order Based on Zip Code](allocation/reallocate-entire-order-based-on-zip-code.md) | `ReallocateEntireOrderBasedOnZipCode` | Reallocate based on delivery zip code |
| [Try Reallocate to Other Warehouse](allocation/try-reallocate-to-other-warehouse.md) | `TryReallocateToOtherWarehouse` | Move out-of-stock items to another warehouse |
| [Try Reallocate on Cancel](allocation/try-reallocate-on-cancel.md) | `TryReallocateOnCancel` | Reallocate to nearest warehouse when cancelled |
| [Try Reallocate on Cancel Using Geo Location](allocation/try-reallocate-on-cancel-using-geo-location.md) | `TryReallocateOnCancelUsingGeoLocation` | Reallocate using coordinates when cancelled |
| [Try Reallocate by Category ID](allocation/try-reallocate-by-category-id.md) | `TryReallocateByCategoryId` | Reallocate orders containing specific product categories |
| [Try Reallocate by Product ID](allocation/try-reallocate-by-product-id.md) | `TryReallocateByProductId` | Reallocate orders containing specific products |
| [Try Reallocate by Store Category ID](allocation/try-reallocate-by-store-category-id.md) | `TryReallocateByStoreCategoryId` | Reallocate based on store product categories |
| [Try Reallocate to Purchase Order](allocation/try-reallocate-to-purchase-order.md) | `TryReallocateToPurchaseOrder` | Allocate to incoming purchase orders |

### Deadline Management

| Step | Key | Description |
| --- | --- | --- |
| [Set Try Reallocate Deadline](allocation/set-try-reallocate-deadline.md) | `SetTryReallocateDeadline` | Set deadline for automatic reallocation |
| [Remove Try Reallocate Deadline](allocation/remove-try-reallocate-deadline.md) | `RemoveTryReallocateDeadline` | Clear reallocation deadline |
| [Add Reallocation Metadata](allocation/add-reallocation-metadata.md) | `AddReallocationMetadata` | Update order metadata after reallocation |

### Package Handling

| Step | Key | Description |
| --- | --- | --- |
| [Product Package Breakdown](allocation/product-package-breakdown.md) | `ProductPackageBreakDown` | Break bundles/packages into component products |
| [Reset All Package Components](allocation/reset-all-package-components.md) | `ResetAllPackageComponents` | Restore original package structure |
| [Split Colli Products to Separate Shipment](allocation/split-colli-products-to-separate-shipment.md) | `SplitAllColliProductsToSeparateShipment` | Move colli products to separate shipment |
| [Split Order Lines with Colli Products](allocation/split-order-lines-with-colli-products.md) | `SplitOrderLinesWithColliProducts` | Split colli lines to quantity 1 |

### Purchase Order Handling

| Step | Key | Description |
| --- | --- | --- |
| [Set All Order Lines Not Reserved to Be Purchased](allocation/set-all-order-lines-not-reserved-to-be-purchased.md) | `SetAllOrderLinesNotReservedToBePurchased` | Mark unreserved lines for purchase order |
| [Remove Order Lines to Be Purchased](allocation/remove-order-lines-to-be-purchased.md) | `RemoveOrderLinesToBePurchased` | Unmark shipped, picked up or canceled lines for purchase order |

## Common Configuration Properties

Many allocation steps share common properties:

| Property | Type | Description |
| --- | --- | --- |
| `warehouseCode` | string | Target warehouse code |
| `storeRoles` | string | Filter warehouses by role (e.g., "central", "store") |
| `ignoreZipCodeRange` | boolean | Skip zip code range validation |
| `SkipForManualOrder` | boolean | Skip step for manually created orders |
| `SkipForShipment` | string | Skip for specific shipping methods (comma-separated) |

## Example: Reallocate on cancel

If the order type has [`SplitCancelledOrderlinesToStatus`](../order-config.md#order-type-model) configured, cancelled order lines will automatically be split into a new shipment with the specified status. This is typically used in combination with reallocation workflow steps to reallocate the cancelled lines to another warehouse. When selecting 'Cancel orderline(s)' the cancel modal will have option to reallocate.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcanceldialog.8cc14d3f.png&w=3840&q=75)

The reallocation logic is determined by the workflow steps configured on the status specified in `SplitCancelledOrderlinesToStatus`. When the reallocation workflow steps run, the previously allocated warehouse is excluded from the allocation candidates.
