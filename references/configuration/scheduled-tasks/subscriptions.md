# Subscription Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/subscriptions

> Background jobs for subscription order processing and management

The Subscription scheduled tasks handle the processing of recurring subscription orders, creating pending orders based on subscription schedules.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Process Subscription Orders](subscriptions/subscription-order.md) | Create pending orders for active subscriptions based on their schedules | Delta |

* * *

## Overview

Subscription tasks manage the recurring order creation workflow:

1.  **Order Generation** - Create pending orders based on subscription cron schedules

* * *

## Common Use Cases

### Recurring Orders

Use Process Subscription Orders to automatically generate orders for customers with active subscriptions, based on their configured delivery schedules.

* * *

## How Subscriptions Work

Subscriptions use cron expressions to define order schedules. When the scheduled task runs:

1.  Active subscriptions that are due for their next order are identified
2.  Pending orders are created according to the subscription configuration
3.  The subscription's next order date is updated

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Order processing | `0 * * * *` (hourly) | Regular processing of due subscriptions |
