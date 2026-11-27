# Reallocate Entire Order Based on Zip Code

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/reallocate-entire-order-based-on-zip-code

> Move an entire order to the warehouse that serves the delivery zip code, without splitting.

## Overview

The **Reallocate Entire Order Based on Zip Code** step attempts to move an entire order to a warehouse that can fulfill all items and serves the delivery zip code region. Unlike splitting steps, this keeps the order whole and only succeeds if a single warehouse can handle everything.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ReallocateEntireOrderBasedOnZipCode` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `ignoreZipCodeRange` | boolean | No | If true, ignores warehouse zip code range restrictions |
| `storeRoles` | string | No | Filter eligible warehouses by role |

## Behavior

### What It Does

1.  Validates that the order exists and no specific shipment is targeted
2.  Finds warehouses that serve the delivery zip code based on configuration options
3.  Checks if any matching warehouse has all items in stock
4.  If found, reassigns all shipments to that warehouse

### Prerequisites

*   Order must not be running at shipment level (shipment parameter must be null)
*   Warehouses must have zip code ranges configured
*   At least one warehouse must have all items in stock

### Side Effects

*   Changes warehouse assignment on all shipments
*   Adds error to order if reallocation fails and `StopOnError` is enabled
*   Does not split the order under any circumstances

## Business Cases

### When to Use

*   **Regional fulfillment**: Route orders to the nearest regional warehouse
*   **Delivery optimization**: Minimize shipping distance and cost
*   **Avoid order splitting**: When you prefer delayed delivery over multiple shipments

### Example Scenarios

**Scenario 1: Regional Distribution** Customer orders from zip code 90210. The step finds the Los Angeles warehouse serves this zip code and has all items in stock, so the order is allocated there instead of a default eastern warehouse.

**Scenario 2: No Available Warehouse** If no warehouse serving the zip code has all items, the step returns success without changes (unless `StopOnError` is configured).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order not found | Error | Depends on StopOnError |
| Shipment provided (shipment-level workflow) | Success (not applicable) | Yes |
| Successful reallocation | Success | Yes |
| No suitable warehouse found | Success (no change) | Yes |
| No suitable warehouse + StopOnError | Error | No (cancels workflow) |
| Exception during reallocation | Error | Depends on StopOnError |

## Related Steps

*   [Set Warehouse Based on Zip](set-warehouse-based-on-zip.md) - Simpler assignment without full inventory check
*   [Try Reallocate Entire Order](try-reallocate-entire-order.md) - Reallocates to any warehouse with stock, not zip-based
*   [Try Split Unreserved to Closest Zip](try-split-unreserved-order-lines-to-closest-zip.md) - Allows splitting when no single warehouse suffices
