# Accounting Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/accounting

> Background jobs that generate daily web-fulfillment accounting postings and clean up unfinished draft postings

The Accounting scheduled tasks generate the daily [web-fulfillment postings](../../Order/Ledger/ledger-postings.md) and remove draft postings left behind by an interrupted save. Both tasks do nothing unless **Posting enabled** is on in the [accounting configuration](../../Order/Ledger/ledger-config.md).

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Web Fulfillment Posting](accounting/web-fulfillment-posting.md) | Post the previous day's web and click & collect payment transactions for every store | Delta |
| [Orphaned Posting Cleanup](accounting/orphaned-posting-cleanup.md) | Remove draft postings that were never completed | Delta |

* * *

## Overview

POS postings are built when a register's Z-report is closed and need no scheduled task. Web-fulfillment postings are built by a scheduled task:

1.  **Posting** - Web Fulfillment Posting books the previous accounting day when it runs at or after the cutoff hour
2.  **Cleanup** - Orphaned Posting Cleanup removes drafts left by an interrupted save

* * *

## Configuration Requirements

Both tasks read the tenant's accounting settings:

*   `accountingSettings.postingEnabled` - Must be on for either task to do anything
*   `accountingSettings.webFulfillmentPostingEnabled` - Must also be on for Web Fulfillment Posting
*   `accountingSettings.webFulfillmentPostingCutoffHour` - Hour from which the previous day is posted
*   `accountingSettings.draftOrphanTimeoutMinutes` - Age at which a draft posting is removed

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Posting tasks | `0 * * * *` (every hour) | Posts on the first run at or after the cutoff hour; later runs pick up late transactions |
| Cleanup tasks | `0 * * * *` (every hour) | Drafts are rare and cleanup is lightweight |
