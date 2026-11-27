# Monthly Report

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/monthly-report

> Generate and email monthly customer club membership statistics report

## Overview

This task generates a comprehensive monthly PDF report with customer club membership statistics, including member counts by store, new member growth trends, and point-of-sale data. The report is emailed to configured recipients.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubMonthlyReportScheduledTask` |
| **Group** | Customer Club |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Monthly membership performance tracking
*   Store-level member statistics
*   Executive reporting on loyalty program
*   Automated report distribution

* * *

## Configuration Properties

### Required Settings

| Setting | Location | Description |
| --- | --- | --- |
| `ReceiveMonthlyStoreReport` | `CustomerClubSettings` | Must be `true` to enable |
| `MonthlyReportReceiveEmailAddress` | `CustomerClubSettings` | Primary email recipient |

### Optional Settings

| Setting | Location | Description |
| --- | --- | --- |
| `MonthlyReportReceiveEmailAddressBcc` | `CustomerClubSettings` | BCC recipient for the report |

* * *

## Behavior

### What It Does

1.  Collects membership statistics for the previous month
2.  Gathers data by store:
    *   Total members per store (last 12 months trend)
    *   New members per store (monthly breakdown)
    *   Members by age group and gender
    *   Point-of-sale statistics
3.  Generates a branded PDF report with tenant logo
4.  Emails the report to configured recipients

### Report Contents

The PDF report includes:

*   **Header**: Tenant branding and report date
*   **Monthly Totals Table**: Member counts by store over 12 months
*   **New Members Table**: New member acquisition by store
*   **Demographics**: Member breakdown by age group
*   **POS Statistics**: Point-of-sale performance data

### Prerequisites

*   Customer Club settings must be configured
*   `ReceiveMonthlyStoreReport` must be `true`
*   Email recipient must be configured
*   Store data must exist in the system

### Side Effects

*   Sends email with PDF attachment
*   No data modifications

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubMonthlyReportScheduledTask",
    "Schedule": "0 7 1 * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run monthly on the 1st day at 7:00 AM (`0 7 1 * *`) to generate the previous month's report.

* * *

## Related Tasks

*   [Add Stats Customers](../analytics/add-stats-customers.md) - Feeds data for reports
