# Voucher Reactivation

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/vouchers/voucher-reactivation

> Automatically reactivate applied vouchers that are no longer on active carts or orders

## Overview

This task identifies vouchers with status "Applied" that are no longer associated with an active cart or valid order, and restores them to "Available" status. This ensures customers can reuse their vouchers when orders are cancelled or carts are abandoned.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `VoucherReactivationScheduledTask` |
| **Group** | Vouchers |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic recovery of vouchers from cancelled orders
*   Voucher reuse when carts are abandoned
*   Fair customer treatment when orders fail
*   Proper voucher inventory management

* * *

## Configuration Properties

This task has no configurable properties. It processes vouchers based on:

*   Voucher status is "Applied"
*   Voucher is not currently on any active cart
*   Voucher is either not on any order, or is on a cancelled order

* * *

## Behavior

### What It Does

1.  Queries for all vouchers with "Applied" status
2.  Checks if each voucher is currently applied to an active cart (by transaction ID)
3.  For vouchers not on carts, checks if they are on any order
4.  Identifies vouchers that are either:
    *   Not on any cart or order
    *   On an order with a cancelled status
5.  Updates these vouchers' status to "Available"
6.  Reports the number of vouchers reactivated

### Prerequisites

*   Voucher search service must be operational
*   Cart search service must be operational
*   Order search service must be operational
*   Order statuses must be properly configured with the cancelled status flag

### Side Effects

*   Changes voucher status from "Applied" to "Available"
*   Reactivated vouchers can be used again by customers
*   Does not affect vouchers still on active carts or valid orders

* * *

## Example Configuration

```json
{
    "ImplementationType": "VoucherReactivationScheduledTask",
    "Schedule": "*/30 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 30 minutes (`*/30 * * * *`) to ensure timely recovery of vouchers. More frequent execution may be appropriate for high-volume environments.

* * *

## Related Tasks

*   [Voucher Expiration](voucher-expiration.md) - Expire vouchers past their validity date
