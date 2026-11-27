# Web Fulfillment Posting

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/accounting/web-fulfillment-posting

> Generate the daily web-fulfillment accounting postings for every store from the configured cutoff hour

## Overview

This task generates [web-fulfillment postings](../../../Order/Ledger/ledger-postings.md#posting-sources): balanced accounting vouchers for the payment transactions of web and click & collect orders. Each run posts, for every store, the days that have settled since its last run, booking only the transactions that are not already on a posting. A day is settled when the clock in the accounting time zone has passed the cutoff hour on the next day. So a run at or after the cutoff hour posts the **previous day**, and a run before it posts the day before that when no earlier run did.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `WebFulfillmentPostingScheduledTask` |
| **Group** | Accounting |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Daily accounting postings for web and click & collect orders
*   Postings ready for export to your ERP or accounting system each morning
*   Late payment transactions for the previous day picked up automatically

POS sales do not need this task: their postings are built when a register's Z-report is closed.

* * *

## Configuration Properties

This task has no properties of its own. It is controlled by the tenant's [accounting settings](../../../Order/Ledger/ledger-config.md):

| Setting | Location | Description |
| --- | --- | --- |
| `postingEnabled` | `accountingSettings.postingEnabled` | Master switch. When off, the task does nothing. |
| `webFulfillmentPostingEnabled` | `accountingSettings.webFulfillmentPostingEnabled` | Must be on for the task to post. |
| `webFulfillmentPostingCutoffHour` | `accountingSettings.webFulfillmentPostingCutoffHour` | Hour (0–23, default `2`) in the accounting time zone. Before this hour, the task does not post the previous day. |
| `timeZone` | `accountingSettings.timeZone` | IANA time zone used for the cutoff check and the day boundaries. Falls back to the tenant's time zone. |
| `webFulfillmentPostingPerOrderType` | `accountingSettings.webFulfillmentPostingPerOrderType` | When on, one posting per order type per store and day. |
| `postingExclusions` | `accountingSettings.postingExclusions` | [Rules](../../../Order/Ledger/ledger-posting-exclusions.md) that keep matching orders out of the postings. |

* * *

## Behavior

### What It Does

1.  Completes without doing anything unless both `postingEnabled` and `webFulfillmentPostingEnabled` are on
2.  Selects the days to post in the accounting time zone: every day that has settled since the last successful run, at most 7, and the previous day again on every run at or after the cutoff hour
3.  Completes without doing anything when there is no such day: a run before the cutoff hour, when an earlier run already posted the day before yesterday
4.  For each store (and order type, when per-order-type posting is on), books the day's captures and refunds that are not already on a posting, applying the posting exclusions
5.  Skips a store and day with nothing new to book
6.  Logs a store and day whose posting fails, and continues with the next one
7.  Writes the posted days and the number of postings generated, skipped and failed to the run log of the task

### Prerequisites

*   `accountingSettings.postingEnabled` and `accountingSettings.webFulfillmentPostingEnabled` must be on
*   A chart of accounts, including a `Receivable` account for auto-balancing — see [Chart of Accounts](../../../Order/Ledger/ledger-chart-of-accounts.md)

### Side Effects

*   Creates accounting postings with source `WebFulfillment`
*   A run after a day was already posted books any transactions that arrived since, on an additional posting for that store and day
*   Posts at most the last 7 days. When the last successful run is further back, for example after the task was disabled, it posts the last 7 days and completes with a warning. To post older days, use **Generate web fulfillment postings** under **Reports → Accounting** — see [Postings in the UI](../../../Order/Ledger/ledger-reports.md#re-running-web-fulfillment)

* * *

## Example Configuration

First, ensure tenant settings enable posting:

```json
{
    "accountingSettings": {
        "postingEnabled": true,
        "webFulfillmentPostingEnabled": true,
        "webFulfillmentPostingCutoffHour": 2,
        "timeZone": "Europe/Oslo"
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "WebFulfillmentPostingScheduledTask",
    "Schedule": "0 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every hour (`0 * * * *`). The first run after the cutoff hour posts the previous day; later runs that day only book transactions that arrived since, and complete without changes otherwise.

A daily schedule also works. The schedule is in UTC and the cutoff hour is in the accounting time zone, so pick a UTC hour that is after the cutoff all year. With `Europe/Oslo` and cutoff `2`, `0 3 * * *` runs at 04:00 in winter and 05:00 in summer. A daily run at `0 0 * * *` runs at 01:00 in winter, before the cutoff, and then posts the day before yesterday, one day later than in summer.

* * *

## Related Tasks

*   [Orphaned Posting Cleanup](orphaned-posting-cleanup.md) - Remove draft postings left by an interrupted save
