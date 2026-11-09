# Reactivate Projects on Hold

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/projects/reactivate-projects-on-hold

> Automatically restore projects to active status when their hold period expires

## Overview

This task identifies projects that were placed on hold with an expiration date and reactivates them when that date has passed. This enables temporary project pauses with automatic resumption, useful for seasonal operations or planned project delays.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ReactivateProjectsOnHoldScheduledTask` |
| **Group** | Projects |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic resumption of paused projects
*   Scheduled project hold periods
*   Seasonal business cycle management
*   Temporary project suspensions with defined end dates

* * *

## Configuration Properties

This task has no directly configurable properties. Hold expiration dates are set on individual projects.

* * *

## Behavior

### What It Does

1.  Queries for projects with "on hold" status that have expired hold dates
2.  Updates each project to active status
3.  Reports the number of projects reactivated

### Prerequisites

*   Projects must have hold expiration dates set
*   Project service must be operational

### Side Effects

*   Changes project status from "on hold" to active
*   Reactivated projects become visible and operational again
*   May trigger downstream processes that depend on project status

* * *

## Example Configuration

```json
{
    "ImplementationType": "ReactivateProjectsOnHoldScheduledTask",
    "Schedule": "0 6 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily at the start of business hours (`0 6 * * *` - 6 AM daily). This ensures projects are reactivated at a predictable time when staff is available to work with them.

* * *

## Related Tasks

*   [Anonymize Obsolete Projects](anonymize-obsolete-projects.md) - Clean up old project data
