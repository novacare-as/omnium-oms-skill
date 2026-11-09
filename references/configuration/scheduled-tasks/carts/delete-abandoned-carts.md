# Delete Abandoned Carts

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/carts/delete-abandoned-carts

> Automatically remove carts that have been inactive for extended periods

## Overview

This task identifies and permanently deletes carts that have not been modified for over 60 days and have no active expiration date. It helps maintain system performance by removing stale cart data from both the search index and repository.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `DeleteAbandonedCartScheduledTask` |
| **Group** | Carts |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic cleanup of abandoned shopping carts
*   Maintenance of search index performance
*   Reduction of storage costs from stale data
*   Compliance with data retention policies

* * *

## Configuration Properties

This task has no configurable properties. Carts are deleted when:

*   Modified date is more than 60 days ago
*   No active expiration date set for the future

* * *

## Behavior

### What It Does

1.  Queries for carts that have not been modified in over 60 days
2.  Excludes carts that have a future expiration date set
3.  Deletes matching carts from the search index
4.  Removes the cart records from the repository
5.  Reports the number of carts deleted

### Prerequisites

*   Cart search service must be operational
*   Cart repository must be accessible

### Side Effects

*   Permanently removes cart data (this is irreversible)
*   Reduces search index size
*   Frees up storage space

* * *

## Example Configuration

```json
{
    "ImplementationType": "DeleteAbandonedCartScheduledTask",
    "Schedule": "0 2 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 2 * * *` - 2 AM daily). This task processes carts in batches of 500 and can handle large volumes efficiently.

* * *

## Related Tasks

*   [Convert Authorized Carts to Orders](convert-authorized-cart-to-order.md) - Convert eligible carts before cleanup
