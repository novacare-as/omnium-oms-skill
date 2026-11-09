# Cart Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/carts

> Background jobs for cart lifecycle management, cleanup, and order conversion

The Cart scheduled tasks handle cart lifecycle management, including cleanup of abandoned carts and automatic conversion of authorized carts to orders.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Delete Abandoned Carts](carts/delete-abandoned-carts.md) | Remove carts that have been inactive for extended periods | Delta |
| [Convert Authorized Carts to Orders](carts/convert-authorized-cart-to-order.md) | Automatically create orders from carts with authorized payments | Delta |

* * *

## Overview

Cart tasks work together to manage cart data throughout its lifecycle:

1.  **Cleanup** - Remove stale carts to maintain database performance
2.  **Order Conversion** - Automatically convert eligible carts to orders when payment is authorized

* * *

## Common Use Cases

### Abandoned Cart Cleanup

Use Delete Abandoned Carts to remove carts that have not been modified in over 60 days, helping maintain system performance and data hygiene.

### Automatic Order Creation

Enable Convert Authorized Carts to Orders to automatically create orders from carts that have completed payment authorization, reducing manual intervention in the order flow.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Cleanup tasks | `0 2 * * *` (daily at 2 AM) | Run off-peak to avoid impact |
| Conversion tasks | `*/5 * * * *` (every 5 minutes) | Quick response to payment authorizations |
