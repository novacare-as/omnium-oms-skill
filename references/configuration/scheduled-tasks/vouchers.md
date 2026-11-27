# Voucher Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/vouchers

> Background job that keeps the status of the vouchers up to date

The Voucher scheduled task keeps the status of the vouchers up to date. It releases vouchers that a sale no longer holds, and marks vouchers as expired when they pass their expiry date.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Update Voucher Status](vouchers/voucher-expiration.md) | Release vouchers that a sale no longer holds, and mark available vouchers as expired when past their expiry date | Delta |

* * *

## Common Use Cases

### Voucher Recovery

A voucher that is added to a cart is reserved for that sale. When the sale is not completed, or the order is cancelled, the task makes the voucher available again, so the customer can use it in another sale.

A voucher on a cart that has not changed for 24 hours is taken off the cart and released. Set the task property `ReleaseVoucherFromCartAfterHours` to change the number of hours, or to `0` to keep vouchers on carts. See [Configuration Properties](vouchers/voucher-expiration.md#configuration-properties).

### Automated Expiration

The task marks vouchers past their expiry date as expired.

* * *

## Recommended Schedule

| Task | Recommended Schedule | Reason |
| --- | --- | --- |
| Update Voucher Status | `0 * * * *` (every hour) | Release unused vouchers soon after the configured number of hours |
