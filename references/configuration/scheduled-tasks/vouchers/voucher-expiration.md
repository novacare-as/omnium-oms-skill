# Voucher Expiration

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/vouchers/voucher-expiration

> Automatically mark available vouchers as expired when past their expiry date

## Overview

This task identifies vouchers with status "Available" that have passed their expiry date and updates their status to "Expired". This prevents customers from using promotional codes or gift cards that are no longer valid.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `VoucherExpirationScheduledTask` |
| **Group** | Vouchers |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic expiration of time-limited promotional codes
*   Enforcement of gift card validity periods
*   Compliance with voucher terms and conditions
*   Clean voucher inventory management

* * *

## Configuration Properties

This task has no configurable properties. It processes vouchers based on:

*   Voucher status is "Available"
*   Expiry date has passed (less than or equal to current UTC time)
*   Expiry date is within the delta window (changed since last run)

* * *

## Behavior

### What It Does

1.  Queries for vouchers with "Available" status
2.  Filters for vouchers with expiry dates between the last run and now
3.  Updates each matching voucher's status to "Expired"
4.  Saves the updated vouchers in batch
5.  Reports the number of vouchers expired

### Prerequisites

*   Vouchers must have an expiry date set
*   Voucher search service must be operational

### Side Effects

*   Changes voucher status from "Available" to "Expired"
*   Expired vouchers cannot be applied to carts or orders
*   Status change is logged for audit purposes

* * *

## Example Configuration

```json
{
    "ImplementationType": "VoucherExpirationScheduledTask",
    "Schedule": "0 0 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily at midnight (`0 0 * * *`) to expire vouchers at the start of each day. This aligns with typical business expectations for voucher validity periods.

* * *

## Related Tasks

*   [Voucher Reactivation](voucher-reactivation.md) - Restore vouchers that are no longer in use
