# Orphaned Posting Cleanup

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/accounting/orphaned-posting-cleanup

> Remove accounting postings left in Draft status by an interrupted save

## Overview

This task removes accounting postings that are still in `Draft` status after a configured number of minutes, together with their ledger lines. A posting is saved as a draft first and becomes final when all its lines are written; a draft only remains when that save is interrupted. Draft postings are never returned by the [Accounting API](../../../Order/Ledger/api-reference.md), and removing them keeps the posting store free of incomplete vouchers.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `OrphanedPostingCleanupScheduledTask` |
| **Group** | Accounting |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Removal of incomplete postings after an interrupted save
*   A clean set of postings for exports and reconciliation

* * *

## Configuration Properties

This task has no properties of its own. It is controlled by the tenant's [accounting settings](../../../Order/Ledger/ledger-config.md):

| Setting | Location | Description |
| --- | --- | --- |
| `postingEnabled` | `accountingSettings.postingEnabled` | Master switch. When off, the task does nothing. |
| `draftOrphanTimeoutMinutes` | `accountingSettings.draftOrphanTimeoutMinutes` | Minutes (default `10`) a posting must have been in `Draft` before it is removed. |

* * *

## Behavior

### What It Does

1.  Completes without doing anything unless `postingEnabled` is on
2.  Finds postings in `Draft` status older than `draftOrphanTimeoutMinutes`
3.  Checks each one again, and skips it if it has meanwhile moved past `Draft`
4.  Deletes each remaining draft posting and its ledger lines
5.  Logs a draft that cannot be deleted and retries it on the next run

### Prerequisites

*   `accountingSettings.postingEnabled` must be on

### Side Effects

*   Permanently deletes draft postings and their ledger lines
*   Does not affect postings in any other status

* * *

## Example Configuration

```json
{
    "ImplementationType": "OrphanedPostingCleanupScheduledTask",
    "Schedule": "0 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every hour (`0 * * * *`). Draft postings are rare, and the task does no work when there are none.

* * *

## Related Tasks

*   [Web Fulfillment Posting](web-fulfillment-posting.md) - Generate the daily web-fulfillment postings
