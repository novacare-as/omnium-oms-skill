# Create Default Shipment

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/create-default-shipment

> Create an initial shipment for orders that have no shipments.

## Overview

The **Create Default Shipment** step creates a default shipment for orders that don't have any shipments yet. This ensures all orders have at least one shipment for fulfillment processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateDefaultShipment` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `UseBillingAddress` | Boolean | No | `false` | Use billing address instead of shipping address |
| `SkipWarehouseAssignment` | Boolean | No | `false` | Skip automatic warehouse assignment |

## Behavior

### What It Does

1.  Checks if order already has shipments (returns warning if so)
2.  Determines shipment address:
    *   Uses billing address if `UseBillingAddress` is true
    *   Otherwise uses default shipping address
3.  Creates a default shipment on the order with all line items
4.  Optionally assigns warehouse based on configuration

### Prerequisites

*   Order must not have any existing shipments
*   Shipping service must be configured

### Side Effects

*   Creates new shipment on the order
*   Assigns warehouse (unless skipped)
*   Sets up line items on shipment

## Business Cases

### When to Use

*   **POS orders**: Orders from POS systems often arrive without shipments
*   **API imports**: External order imports without shipment data
*   **Manual orders**: Manually created orders needing shipment setup

### Example Scenarios

**Scenario 1: Standard Order** New order imported without shipment. Step creates default shipment with shipping address and assigns warehouse.

**Scenario 2: Billing Address Shipping** B2B order where goods ship to billing address. Configure `UseBillingAddress=true`.

**Scenario 3: Manual Warehouse** Warehouse will be assigned later by allocation. Configure `SkipWarehouseAssignment=true`.

**Scenario 4: Already Has Shipment** Order already has shipment (from e-commerce platform). Step returns warning and skips.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order has shipments | Warning | Yes |
| Shipment created | Success | Yes |

## Related Steps

*   [Allocate to Warehouse](../allocation/allocate-to-warehouse.md) - Assigns warehouse to shipment
*   [Select Default Shipping Method](select-default-shipping-method.md) - Sets shipping method
