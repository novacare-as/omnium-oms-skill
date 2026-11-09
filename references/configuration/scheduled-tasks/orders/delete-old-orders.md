# Delete Old Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/delete-old-orders

> Permanently remove orders older than the configured retention period

## Overview

This task permanently deletes orders that are older than a specified threshold. It is designed for data retention compliance and database maintenance, removing both the search index entries and the underlying storage records for orders beyond their retention period.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `DeleteOldOrdersScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Compliance with data retention policies (GDPR, etc.)
*   Database size management for long-running installations
*   Removal of historical orders beyond legal retention requirements
*   Storage cost optimization

* * *

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `DeleteOrdersThreshold` | int | Yes | Number of years after which orders are deleted. Must be 2 or higher. Configured in Order Settings, not task properties. |

* * *

## Behavior

### What It Does

1.  Reads the deletion threshold from Order Settings (in years)
2.  Validates that the threshold is at least 2 years (safety check)
3.  Calculates the cutoff date based on current date minus threshold years
4.  Queries for all orders created before the cutoff date
5.  Processes orders in batches for efficiency
6.  Deletes orders from both the search index and permanent storage
7.  Reports the total number of orders deleted

### Safety Measures

*   Minimum threshold of 2 years prevents accidental deletion of recent orders
*   Orders with a creation date of minimum value (system default) are excluded
*   Task fails if threshold is not configured or is below 2 years

### Prerequisites

*   `DeleteOrdersThreshold` must be configured in Order Settings
*   Threshold value must be 2 or greater

### Side Effects

*   **Permanent deletion** of order data from all storage locations
*   Frees up storage space in both search index and database
*   Associated order history and event logs may be affected
*   **This operation cannot be undone**

* * *

## Example Configuration

First, ensure the Order Settings include the threshold:

```json
{
    "OrderSettings": {
        "DeleteOrdersThreshold": 5
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "DeleteOldOrdersScheduledTask",
    "Schedule": "0 3 * * 0",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run weekly during off-peak hours (`0 3 * * 0` - Sundays at 3 AM) to minimize impact on system performance. This is a heavy operation that should not run during business hours.

* * *

## Related Tasks

*   [Cancel Expired Orders](cancel-expired-orders.md) - Cancel orders before deletion
*   [Cancel Expired Click and Collect](cancel-expired-click-collect.md) - Handle pickup order expirations
