# Project Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/projects

> Background jobs for project lifecycle management, anonymization, and reactivation

The Project scheduled tasks manage project lifecycle operations, including anonymizing obsolete projects for data privacy compliance and reactivating projects that were temporarily on hold.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Anonymize Obsolete Projects](projects/anonymize-obsolete-projects.md) | Remove personal data from projects that are no longer active | Delta |
| [Reactivate Projects on Hold](projects/reactivate-projects-on-hold.md) | Restore projects to active status when their hold period expires | Delta |

* * *

## Overview

Project tasks handle project status transitions and data privacy:

1.  **Data Privacy** - Anonymize project data after retention periods expire
2.  **Status Management** - Automatically reactivate projects when hold periods end

* * *

## Common Use Cases

### GDPR Compliance

Use Anonymize Obsolete Projects to automatically remove personal data from old projects, helping maintain compliance with data protection regulations.

### Temporary Project Holds

Enable Reactivate Projects on Hold to automatically restore projects to active status when their scheduled hold period ends, useful for seasonal businesses or planned pauses.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Anonymization tasks | `0 2 * * *` (daily at 2 AM) | Run during off-peak hours |
| Reactivation tasks | `0 6 * * *` (daily at 6 AM) | Reactivate at start of business day |
