# Voucher Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/vouchers

> Background jobs for voucher lifecycle management, expiration, and reactivation

The Voucher scheduled tasks manage voucher status transitions, including marking vouchers as expired when they pass their expiry date and reactivating vouchers that are no longer in use.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Voucher Expiration](vouchers/voucher-expiration.md) | Mark available vouchers as expired when past their expiry date | Delta |
| [Voucher Reactivation](vouchers/voucher-reactivation.md) | Reactivate applied vouchers that are no longer on active carts or orders | Delta |

* * *

## Overview

Voucher tasks work together to manage voucher availability:

1.  **Expiration** - Automatically expire vouchers that are past their valid date
2.  **Reactivation** - Restore vouchers to available status when orders are cancelled or carts abandoned

* * *

## Common Use Cases

### Automated Expiration

Use Voucher Expiration to automatically invalidate vouchers past their expiry date, preventing customers from using outdated promotional codes.

### Voucher Recovery

Enable Voucher Reactivation to automatically make vouchers available again when the associated order is cancelled or the cart is abandoned, ensuring customers can reuse their vouchers.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Expiration tasks | `0 0 * * *` (daily at midnight) | Expire vouchers at the start of each day |
| Reactivation tasks | `*/30 * * * *` (every 30 minutes) | Timely recovery of unused vouchers |
