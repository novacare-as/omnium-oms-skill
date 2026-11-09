# Update Reservable Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/update-reservable-orders

> Update the reservable status flag on orders for distribution processing

## Overview

This task updates the reservable status on orders to indicate whether they can be processed by the distribution system. The reservable flag is used by distribution logic to determine which orders are eligible for inventory reservation and fulfillment processing.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `UpdateReservableOrdersScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic updating of order reservability status
*   Integration with distribution and warehouse management
*   Control over which orders are processed for fulfillment
*   Support for distribution processing workflows

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Queries for orders that need their reservable status updated
2.  Evaluates each order against distribution rules to determine reservability
3.  Updates the reservable flag on qualifying orders
4.  Reports the number of orders updated

### Reservability Evaluation

The task delegates to the distribution service to evaluate:

*   Order status and type eligibility
*   Inventory availability conditions
*   Warehouse assignment status
*   Any distribution-specific business rules

### Prerequisites

*   Distribution service must be configured
*   Order types must be set up with distribution rules
*   Warehouse configuration must be in place

### Side Effects

*   Updates the reservable status flag on orders
*   May affect which orders are picked up by distribution processing
*   Creates log entries for updated orders

* * *

## Example Configuration

```json
{
    "ImplementationType": "UpdateReservableOrdersScheduledTask",
    "Schedule": "*/10 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 10 minutes (`*/10 * * * *`) to keep reservable status current with order and inventory changes.

* * *

## Related Tasks

*   [Try Reserve Order Lines](try-reserve-order-lines.md) - Reserve inventory for orders
*   [Order Automation](order-automation.md) - Automate status based on conditions
*   [Allocate Order to Purchase Order](allocate-order-to-purchase-order.md) - Allocate to incoming stock
