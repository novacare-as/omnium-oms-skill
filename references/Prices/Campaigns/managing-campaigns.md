# Managing Campaigns

Source: https://docs.omnium.no/docs/Prices/Campaigns/managing-campaigns

> How to create, edit, copy, and delete campaigns in the Omnium UI — including search, filtering, and status management.

## Creating a Campaign

Campaigns are created from the campaign list page in the Omnium UI, accessible via the main navigation.

To create a new campaign:

1.  Navigate to the campaign list
2.  Click **Create Campaign**
3.  Fill in the required fields:
    *   **Name** (required) — A descriptive name for the campaign
    *   **Description** — Internal description for context
    *   **Start Date** — When the campaign begins
    *   **End Date** — When the campaign ends
4.  Click **Save**

New campaigns are always created with the **Planning** status. You can edit all fields and link promotions before transitioning to Active.

* * *

## Editing a Campaign

While a campaign is in the **Planning** status, all fields can be edited:

*   Name and description
*   Start and end dates
*   Planning notes
*   Markets and stores
*   Tags

Moving a campaign to **Active** does not lock it. When the tenant has a [locked status](campaign-settings.md#lock-the-plan-with-a-locked-campaign-status), the plan freezes while the campaign is in that status: an edit of an item on the campaign's price lists that changes its planned volume, price or costs is refused unless you are an administrator (Omnium staff or a user with the tenant's **Administrators** role). The lock covers those price list items, not the campaign fields listed above.

* * *

## Status Management

Campaign status transitions are managed through the campaign detail page.

### Available Transitions

| From | To | When to use |
| --- | --- | --- |
| Planning | Active | Campaign is ready to go live |
| Active | Planning | Corrections needed before the campaign is underway |
| Active | Completed | Campaign period has ended |
| Completed | Archived | Performance has been reviewed and the campaign is no longer needed in default views |

### Changing Status

1.  Open the campaign detail page
2.  Select the new status from the status dropdown
3.  Confirm the transition

> Status changes are logged in the campaign's event history for audit purposes.

* * *

## Searching and Filtering Campaigns

The campaign list supports multiple ways to find campaigns:

### Text Search

Search by campaign name, description, tags, or ID. The search uses fuzzy matching, so partial matches and minor typos will still return results.

### Filters

| Filter | Description |
| --- | --- |
| **Status** | Filter by one or more statuses (Planning, Active, Completed, Archived) |
| **Start Date Range** | Show campaigns that start within a specific date range |
| **End Date Range** | Show campaigns that end within a specific date range |

By default, archived campaigns are excluded from search results. Toggle the archived filter to include them.

### Sorting

Results can be sorted by:

| Sort Option | Description |
| --- | --- |
| Start Date (newest first) | Default sort order |
| Start Date (oldest first) | Useful for finding past campaigns |
| End Date (newest/oldest) | Sort by campaign end date |
| Name (A-Z / Z-A) | Alphabetical sorting |

* * *

## Copying a Campaign

To reuse a campaign's structure as a starting point for a new one:

1.  Open the campaign list
2.  Click the context menu on the campaign you want to copy
3.  Select **Copy**
4.  Enter a name for the new campaign
5.  Optionally pick a **Start Date** for the copy
6.  Click **Create**

The copy creates a new campaign in the first campaign status (**Planning** unless the tenant has configured its own statuses) with the same settings as the original: description, tags, markets, stores, planning notes, properties and campaign code. Promotion links are not copied — you will need to link promotions to the new campaign separately.

Without a start date, the copy keeps the original's start and end dates. With one, it starts on that date and keeps the original's length. Like any new campaign, the copy gets its own status dates and [milestones](campaign-settings.md#give-every-campaign-milestones-and-deadlines) from its start date.

A copy that starts more than 300 days after the original is taken as the same campaign a year later: it gets the original as its [previous campaign](overview.md#campaign-properties), whose figures serve as last year's on the **Follow-up** tab. A copy that starts sooner, or keeps the original's dates, gets no previous campaign.

* * *

## Deleting a Campaign

To delete a campaign:

1.  Open the campaign list
2.  Click the context menu on the campaign
3.  Select **Delete**
4.  Confirm the deletion

When deleting a campaign, you can choose whether to **unlink promotions** that are currently linked to it. Unlinking removes the campaign reference from the promotions but does not delete the promotions themselves.

> Deletion is permanent and cannot be undone. Campaign performance data is also removed.

* * *

## Version History and Event Log

Each campaign maintains:

*   **Version history** — A record of all changes to the campaign, including who made the change and when
*   **Event log** — Operational events such as creation, updates, status changes, and promotion linking/unlinking

Both are accessible from the campaign detail page and provide a full audit trail of the campaign's lifecycle.
