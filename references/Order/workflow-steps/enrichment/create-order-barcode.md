# Create Order Barcode

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/create-order-barcode

> Generate a barcode identifier for the order.

## Overview

The **Create Order Barcode** step generates a barcode value for the order and stores it in order properties. This enables barcode scanning for order lookup and processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateOrderBarcode` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `Prefix` | String | No | \- | Prefix to add before the barcode |
| `Character` | String | No | `0` | Character used for padding |
| `MinLength` | String | No | \- | Minimum length (pads with Character) |

## Behavior

### What It Does

1.  Determines barcode base value (OrderNumber, or Id if no OrderNumber)
2.  If `MinLength` is set, pads the value with `Character` on the left
3.  Prepends `Prefix` if configured
4.  Stores result in order property "barcode"

### Prerequisites

*   Order must have OrderNumber or Id

### Side Effects

*   "barcode" property added to order
*   Barcode available for labels and scanning

## Business Cases

### When to Use

*   **Packing slips**: Include scannable barcode
*   **Warehouse operations**: Scan orders for processing
*   **Notification templates**: Include barcode for pickup

### Example Scenarios

**Scenario 1: Simple Barcode** OrderNumber is "12345". Barcode becomes "12345".

**Scenario 2: With Padding** OrderNumber "123", `MinLength=8`, `Character=0`. Barcode becomes "00000123".

**Scenario 3: With Prefix** OrderNumber "12345", `Prefix=ORD`. Barcode becomes "ORD12345".

**Scenario 4: Combined** OrderNumber "99", `Prefix=O`, `MinLength=6`, `Character=0`. Barcode becomes "O000099".

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Barcode created | Success | Yes |

## Related Steps

*   [Generate External ID](generate-external-id.md) - Generate unique IDs
