# Create Shipment Packages Based on Product Colli

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/create-shipment-packages-based-on-product-colli

> Create shipment packages based on the colli (package) information defined on products.

## Overview

The **Create Shipment Packages Based on Product Colli** step creates shipment package records based on the colli (package count/dimensions) information stored on products. This enables accurate package-level tracking and carrier integration.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateShipmentPackagesBasedOnProductColli` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship, Completed |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `OnlyIsSentSeparatelyTrue` | Boolean | No | `false` | Only process products marked as sent separately |

## Behavior

### What It Does

1.  Identifies shipments to process:
    *   Uses current shipment if at shipment level
    *   Uses all shipments if at order level
2.  For each shipment:
    *   Creates package records based on product colli data
3.  Can optionally filter to only products with `IsSentSeparately` flag

### Prerequisites

*   Products must have colli information defined
*   Shipments must exist

### Side Effects

*   Shipment package records created
*   Package dimensions and weights recorded
*   Enables multi-package shipment tracking

## Business Cases

### When to Use

*   **Multi-package orders**: Products ship in multiple boxes
*   **Furniture/appliances**: Large items with defined package counts
*   **Accurate shipping**: Carrier needs package-level details
*   **Tracking granularity**: Track each package separately

### Example Scenarios

**Scenario 1: Furniture Order** Sofa has 3 colli (boxes). Step creates 3 package records on the shipment.

**Scenario 2: Only Sent Separately** Configure `OnlyIsSentSeparatelyTrue=true`. Only processes products flagged for separate shipping.

**Scenario 3: Mixed Order** Order has standard products (no colli) and furniture (3 colli). Step creates packages for furniture only.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments | Warning | Yes |
| Packages created | Success | Yes |
| Exception | Warning | Yes |

## Related Steps

*   [Split All Colli Products to Separate Shipment](../allocation/split-colli-products-to-separate-shipment.md) - Separate colli products first
*   [Complete Shipment](complete-shipment.md) - Finalize with package data
