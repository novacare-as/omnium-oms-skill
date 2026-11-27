# Try Split Shipment by Category ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/try-split-shipment-by-category-id

> Split shipment and reallocate to another warehouse based on product category.

## Overview

The **Try Split Shipment by Category ID** step splits orders based on product category, moving matching products to a different warehouse. This enables category-specific fulfillment from specialized warehouses.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TrySplitShipmentByCategoryId` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `categoryId` | String | Yes | \- | Category ID(s) to split on (can specify multiple) |
| `warehouseCode` | String | No | \- | Target warehouse for split items |
| `ExcludedWarehouses` | String | No | \- | Comma-separated warehouses to exclude |

## Behavior

### What It Does

1.  Gets `categoryId` values from configuration (can have multiple)
2.  Gets optional `warehouseCode` for target warehouse
3.  Gets optional `ExcludedWarehouses` list
4.  Splits the order by product category, moving matching products to a separate shipment
5.  Target warehouse assigned if specified

New shipment will get status `AwaitingInventory`, while orderStatus is derived from shipment, order and orderType - falling back to `InProgress` when the order was New. The order itself also moves New → InProgress.

### Prerequisites

*   At least one `categoryId` must be configured
*   Products must have category information

### Side Effects

*   New shipment created for matching products
*   Products removed from original shipment
*   Warehouse assigned to new shipment

## Business Cases

### When to Use

*   **Specialized warehouses**: Electronics from tech warehouse, apparel from fashion warehouse
*   **Hazmat handling**: Dangerous goods from certified warehouse
*   **Cold chain**: Refrigerated items from cold storage
*   **Heavy items**: Furniture from freight warehouse

### Example Scenarios

**Scenario 1: Electronics Split** Configure `categoryId=ELECTRONICS` and `warehouseCode=TECH-WH`. Electronics products move to tech warehouse shipment.

**Scenario 2: Multiple Categories** Configure multiple `categoryId` properties. Products in any matching category get split.

**Scenario 3: Exclude Warehouses** Configure `ExcludedWarehouses=DROP-SHIP,VIRTUAL`. Products already in those warehouses won't be split.

**Scenario 4: No Matches** No products match configured categories. Step returns success with "not applicable" message.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No categoryId configured | Error | No |
| Split successful | Success | Yes |
| No products match | Success (not applicable) | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Split Shipments by Freight Class](split-shipments-by-freight-class.md) - Split by freight class
*   [Try Reallocate by Category ID](../allocation/try-reallocate-by-category-id.md) - Reallocate without new shipment
