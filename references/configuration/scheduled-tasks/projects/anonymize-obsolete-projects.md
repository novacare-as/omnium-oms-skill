# Anonymize Obsolete Projects

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/projects/anonymize-obsolete-projects

> Remove personal data from projects that are no longer active

## Overview

This task identifies projects that have become obsolete and anonymizes their personal data. This supports compliance with data protection regulations such as GDPR by ensuring personal information is not retained beyond necessary retention periods.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AnonymizeObsoleteProjectsScheduledTask` |
| **Group** | Projects |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Compliance with GDPR or other data protection regulations
*   Automatic removal of personal data from old projects
*   Data minimization in project records
*   Audit trail of anonymization activities

* * *

## Configuration Properties

This task has no directly configurable properties. Anonymization rules are determined by the project service implementation and tenant-specific data retention policies.

* * *

## Behavior

### What It Does

1.  Identifies projects that meet the obsolescence criteria
2.  Anonymizes personal data within each project
3.  Preserves non-personal project data for historical/reporting purposes
4.  Reports the number of projects anonymized

### Prerequisites

*   Project service must be operational
*   Anonymization rules must be defined in the project service

### Side Effects

*   Personal data in projects is permanently anonymized
*   Project records remain but with redacted personal information
*   Anonymization is irreversible

* * *

## Example Configuration

```json
{
    "ImplementationType": "AnonymizeObsoleteProjectsScheduledTask",
    "Schedule": "0 2 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 2 * * *` - 2 AM daily). Anonymization processes can be resource-intensive, so running during low-traffic periods is recommended.

* * *

## Related Tasks

*   [Reactivate Projects on Hold](reactivate-projects-on-hold.md) - Manage project status transitions
