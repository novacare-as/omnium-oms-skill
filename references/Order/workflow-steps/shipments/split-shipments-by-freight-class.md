# Split Shipments by Freight Class

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/split-shipments-by-freight-class

> Split shipments based on freight classification of products.

## Overview

The **Split Shipments by Freight Class** step splits orders based on product freight classification, separating items that require different shipping methods or carriers.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SplitShipmentsByFreightClass` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `SplitOnFreightClass` | String | Yes | \- | The freight class to split on |
| `SplitToStatus` | String | No | \- | Order status for the new shipment |

## Behavior

### What It Does

1.  Gets the `SplitOnFreightClass` value from configuration
2.  Identifies order lines with matching `FreightClass` property
3.  Reallocates accessories to stay with their main items
4.  If all items match, just updates shipment statuses
5.  Otherwise creates new shipment for matching items
6.  New shipment gets `SplitToStatus` if specified

### Prerequisites

*   `SplitOnFreightClass` must be configured
*   Order lines must have `FreightClass` property set

### Side Effects

*   New shipment created for matching freight class
*   Accessories move with main items
*   Shipment status updated if specified

## Business Cases

### When to Use

*   **Heavy freight**: Separate LTL/freight items from parcel
*   **Hazmat**: Separate dangerous goods requiring special handling
*   **White glove**: Items needing special delivery service
*   **Express vs standard**: Different service levels

### Example Scenarios

**Scenario 1: LTL Freight** Configure `SplitOnFreightClass=LTL`. Large furniture items split to separate shipment for freight carrier.

**Scenario 2: All Same Class** All items have same freight class. Shipment statuses updated, no split needed.

**Scenario 3: No Matches** No items have the configured freight class. Step returns warning.

**Scenario 4: With Status** Configure `SplitToStatus=AwaitingFreight`. New shipment gets that status for freight processing.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No freight class configured | Warning | Yes |
| No matching items | Warning | Yes |
| Split successful | Success | Yes |

## Related Steps

*   [Try Split Shipment by Category](try-split-shipment-by-category-id.md) - Category-based split
*   [Split Shipment Cost](split-shipment-cost.md) - Distribute costs
