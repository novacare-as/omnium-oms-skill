# Convert Authorized Carts to Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/carts/convert-authorized-cart-to-order

> Automatically create orders from carts with authorized payments

## Overview

This task identifies carts that have completed payment authorization and automatically converts them to orders. It looks for carts containing an authorized payment, shipment information, customer details, and a store association, then creates orders through the standard order creation workflow.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ConvertAuthorizedCartToOrderScheduledTask` |
| **Group** | Carts |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic order creation after payment authorization
*   Reduced manual intervention in the checkout flow
*   Handling of asynchronous payment authorization flows
*   Support for payment methods that authorize before order creation

* * *

## Configuration Properties

| Property | Type | Description |
| --- | --- | --- |
| `OrderTypes` | string | Comma-separated list of order types to process. If empty, all order types are processed. |
| `MarginDays` | int | Number of days to extend the delta window backwards |
| `MarginHours` | int | Number of hours to extend the delta window backwards |
| `MarginSeconds` | int | Number of seconds to extend the delta window backwards |

The margin properties allow you to catch carts that may have been modified slightly before the last run time, ensuring no eligible carts are missed.

* * *

## Behavior

### What It Does

1.  Queries for carts modified since the last run (with optional margin)
2.  Filters for carts that have:
    *   A customer ID assigned
    *   A store ID assigned
    *   At least one shipment configured
    *   An authorized payment with status Approved, Paid, or Processed
    *   A payment amount greater than zero
3.  For each matching cart, creates an order through the cart business service
4.  Reports success/failure counts for converted carts

### Prerequisites

*   Cart must have complete customer information
*   Cart must have a store association
*   Cart must have at least one shipment configured
*   Payment must be in Approved, Paid, or Processed status
*   Payment must have a positive amount

### Side Effects

*   Creates new orders in the system
*   Triggers order creation workflows
*   May send order confirmation notifications (depending on workflow configuration)

* * *

## Example Configuration

```json
{
    "ImplementationType": "ConvertAuthorizedCartToOrderScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false,
    "Properties": [
        {
            "Key": "OrderTypes",
            "Value": "WebOrder,ClickAndCollect"
        },
        {
            "Key": "MarginSeconds",
            "Value": "30"
        }
    ]
}
```

* * *

## Recommended Schedule

Run frequently (`*/5 * * * *` - every 5 minutes) to ensure quick order creation after payment authorization. For high-volume scenarios, consider running more frequently.

* * *

## Related Tasks

*   [Delete Abandoned Carts](delete-abandoned-carts.md) - Clean up unconverted carts
