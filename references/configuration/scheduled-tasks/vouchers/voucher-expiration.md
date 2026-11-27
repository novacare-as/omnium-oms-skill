# Update Voucher Status

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/vouchers/voucher-expiration

> Release vouchers that a sale no longer holds, and mark available vouchers as expired when their expiry date has passed

## Overview

This task keeps the status of the vouchers up to date. In each run it first releases the vouchers that a sale no longer holds, and then marks the available vouchers whose expiry date has passed as "Expired".

A voucher gets the status "Applied" when it is added to a cart as a payment. If the sale is not completed, the voucher stays "Applied" and the customer cannot use it in another sale. This task releases it again.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `VoucherExpirationScheduledTask` |
| **Group** | Vouchers |
| **Type** | Delta |

* * *

## When to Use

Enable this task when the tenant uses vouchers, for example vouchers imported from Voyado:

*   Release vouchers left on carts that are not completed, such as a parked sale in the In-Store App or an abandoned checkout
*   Release vouchers on cancelled orders
*   Mark vouchers as expired after their expiry date

* * *

## Configuration Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `ReleaseVoucherFromCartAfterHours` | number | `24` | The number of hours a cart can stay unchanged before the task takes its vouchers off. `0` keeps the vouchers on the cart. An empty or invalid value uses the default. |

* * *

## Behavior

### What It Does

1.  Finds the vouchers with status "Applied".
2.  Releases each voucher that a sale no longer holds:
    *   A voucher that is on no cart and no order.
    *   A voucher on an order with a cancelled status.
    *   A voucher on a cart that has not changed for the number of hours in `ReleaseVoucherFromCartAfterHours`. The task takes the voucher payment off the cart, in the same way as when a user removes the voucher.
3.  Sets a released voucher to "Available", or to "Expired" when its expiry date has passed.
4.  Finds the vouchers with status "Available" whose expiry date has passed since the last run, and sets them to "Expired".
5.  Reports the number of released and expired vouchers.

A voucher on an order that is not cancelled stays "Applied". The order redeems it when the payment is captured.

### Prerequisites

*   Order statuses must have the cancelled status flag set, so the task can find cancelled orders.

### Side Effects

*   Changes the status of the vouchers from "Applied" to "Available" or "Expired", and from "Available" to "Expired".
*   Takes a voucher off a cart that has not changed for the configured number of hours. The cart is recalculated, so the amount left to pay goes up. If the customer resumes the sale, the voucher must be added again.
*   Before the task takes a voucher off a cart, it reads the cart again. A cart that changed in the meantime, or that no longer holds the voucher, is not changed.
*   An expired voucher cannot be added to a cart.

* * *

## Example Configuration

```json
{
    "ImplementationType": "VoucherExpirationScheduledTask",
    "Schedule": "0 * * * *",
    "IsDisabled": false,
    "Properties": [
        { "Key": "ReleaseVoucherFromCartAfterHours", "Value": "24" }
    ]
}
```

* * *

## Recommended Schedule

Run every hour (`0 * * * *`). A voucher on an unchanged cart is then released between 24 and 25 hours after the last change of the cart.
