# Process Subscription Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/subscriptions/subscription-order

> Create pending orders for active subscriptions based on their schedules

## Overview

This task processes active subscriptions and creates pending orders based on their configured schedules. Subscriptions use cron expressions to define when orders should be generated, enabling recurring delivery or service schedules for customers.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `SubscriptionOrderScheduledTask` |
| **Group** | Subscriptions |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Processing of recurring subscription orders
*   Automatic order generation based on customer schedules
*   Support for subscription-based business models
*   Scheduled product deliveries

* * *

## Configuration Properties

This task has no directly configurable properties. Subscription schedules are defined on individual subscription records using cron expressions.

* * *

## Behavior

### What It Does

1.  Queries for active subscriptions that are waiting for order creation
2.  For each subscription:
    *   If it's the first run (no next order date), creates the next three pending orders
    *   For subsequent runs, creates one pending order
3.  Updates the subscription with any errors encountered
4.  Sets subscription status to "Failed" if the cron expression is invalid
5.  Reports the number of subscriptions processed and any failures

### Prerequisites

*   Subscriptions must have valid cron expressions in their Schedule field
*   Subscription services must be operational
*   Cart business service must be available for order creation

### Side Effects

*   Creates pending orders in the system
*   Updates subscription next order date
*   Sets subscription status to "Failed" if cron expression is invalid
*   Adds error records to subscriptions with issues

### Error Handling

If a subscription has an invalid cron expression:

*   An error is added to the subscription with details
*   The subscription status is set to "Failed"
*   Processing continues with other subscriptions

* * *

## Example Configuration

```json
{
    "ImplementationType": "SubscriptionOrderScheduledTask",
    "Schedule": "0 * * * *",
    "IsDisabled": false
}
```

* * *

## Subscription Cron Expressions

Subscriptions use standard cron expressions to define their schedules. Examples:

| Expression | Description |
| --- | --- |
| `0 0 * * 1` | Every Monday at midnight |
| `0 0 1 * *` | First day of every month |
| `0 0 1,15 * *` | 1st and 15th of every month |
| `@weekly` | Once per week |
| `@monthly` | Once per month |

* * *

## Recommended Schedule

Run hourly (`0 * * * *`) to ensure subscriptions are processed in a timely manner. More frequent execution may be needed for time-sensitive subscription schedules.

* * *

## Related Tasks

This task is the primary handler for subscription-based order generation.
