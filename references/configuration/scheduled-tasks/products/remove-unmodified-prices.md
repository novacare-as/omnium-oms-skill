# Remove Unmodified Prices

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/remove-unmodified-prices

> Clean up customer-specific prices that have not been updated recently

## Overview

This task removes customer-specific prices that have not been modified within the last 3 days. This helps maintain data cleanliness by removing stale pricing data that may no longer be relevant, while protecting stable pricing structures where the majority of prices remain unchanged.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `RemoveUnmodifiedPricesScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you have:

*   Customer-specific pricing that is regularly updated from external systems
*   Price data that should be refreshed periodically
*   A need to clean up orphaned or outdated customer prices

**Note:** This task is designed for scenarios where customer prices are expected to be refreshed regularly. Do not enable this task if your customer-specific prices are meant to be permanent.

* * *

## Configuration Properties

This task has no configurable properties. The threshold is fixed at 3 days.

* * *

## Behavior

### What It Does

1.  Searches for product variants with prices modified in the last 3 days
2.  For each variant with customer-specific prices:
    *   Calculates the percentage of unmodified prices
    *   If less than 75% of prices are unmodified, removes the stale prices
    *   Logs each removed price for audit purposes
3.  Creates event log entries for all removed prices
4.  Updates affected products in batches

### Protection Mechanism

To prevent accidental mass deletion, the task includes a safety threshold:

*   If 75% or more of a variant's customer prices are unmodified, none are removed
*   This protects stable pricing structures from being inadvertently cleaned up
*   Only when the majority of prices have been recently updated does cleanup occur

### What Gets Removed

Only customer-specific prices are evaluated for removal:

*   Prices with a customer ID
*   Prices with a customer group
*   Standard prices (without customer association) are never removed

### Prerequisites

*   Products with customer-specific prices must exist
*   The modification date must be tracked on price records

### Side Effects

*   Permanently removes customer-specific prices from products
*   Creates event log entries documenting removed prices
*   Triggers product reindexing for affected products

* * *

## Example Configuration

```json
{
    "ImplementationType": "RemoveUnmodifiedPricesScheduledTask",
    "Schedule": "0 3 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (e.g., `0 3 * * *` at 3 AM). This should typically run after price import tasks to ensure recently updated prices are not removed.

* * *

## Related Tasks

*   [Product Lowest Price](product-lowest-price.md) - Recalculates lowest prices after price changes
