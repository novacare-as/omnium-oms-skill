# Configuration

Source: https://docs.omnium.no/docs/Customer/Cases/cases-config

> Enable and configure the Cases module — statuses, priorities, tags, case numbering, and support email settings.

Cases are configured in **Configuration → Settings → Customer → Case Settings**.

## Enabling Cases

Toggle the **Enabled** switch to activate the Cases module. When disabled, the Cases section is hidden from the UI and cases cannot be created via any channel.

Users also need the **"cases"** access claim to see and interact with the Cases section.

## CaseSettings Reference

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `IsEnabled` | bool | `false` | Master toggle for the Cases module |
| `Statuses` | list | `[]` | List of available case statuses, each with a Name and Level |
| `StatusNew` | string | — | Status automatically assigned to new cases |
| `StatusClosed` | string | — | Status that represents a closed case (triggers `ClosedDate`, reopen logic) |
| `StatusReopen` | string | — | Status applied when a closed case is reopened (e.g., customer replies to a closed case) |
| `Priorities` | list | `[]` | List of available priorities, each with a Name and Severity |
| `DefaultPriority` | string | — | Priority assigned to new cases when none is specified |
| `TagSettings` | list | `[]` | List of predefined tags, each with a Name and optional TranslationKey |
| `UseSameIdAndNumber` | bool | `false` | When enabled, the Case ID and Case Number will be identical |
| `SupportEmailAddress` | string | — | Support email address displayed in the Case UI |
| `SupportEmailName` | string | — | Display name for support email communications |

## Configuring Statuses

Each status has two properties:

| Property | Type | Description |
| --- | --- | --- |
| `Name` | string | Display name of the status (e.g., "New", "In Progress") |
| `Level` | int | Numeric level that determines workflow progression order. Lower levels come first |

Example configuration:

| Name | Level |
| --- | --- |
| New | 1 |
| In Progress | 2 |
| Resolved | 3 |
| Closed | 4 |

### Status Designations

After defining your statuses, assign the three special designations:

*   **Status New** — The initial status for all newly created cases (including those from inbound email and the API)
*   **Status Closed** — The terminal status. When a case moves to this status, the `ClosedDate` is set. Used to detect when a case should be reopened
*   **Status Reopen** — The status applied when a customer replies to a closed case via email

You must configure at least one status and set **Status New** before cases can be created. Without this, case creation will fail.

## Configuring Priorities

Each priority has two properties:

| Property | Type | Description |
| --- | --- | --- |
| `Name` | string | Display name of the priority (e.g., "Low", "High") |
| `Severity` | int | Numeric severity value. Higher values indicate greater urgency |

Example configuration:

| Name | Severity |
| --- | --- |
| Low | 1 |
| Medium | 2 |
| High | 3 |
| Critical | 4 |

Set the **Default Priority** to the priority name that should be applied to cases when no priority is explicitly specified.

## Case Number Prefix

Case numbers are auto-generated using a sequential counter with an optional prefix. The prefix is configured via market-specific number options.

For example, with prefix `CS-` the generated numbers would be `CS-1001`, `CS-1002`, etc.

### UseSameIdAndNumber

When **Use Same ID and Number** is enabled, the internal case ID and the human-readable case number will be identical. This can simplify integrations where you need a single identifier.

## Tags

Tags are predefined labels that can be attached to cases for categorization and filtering. Each tag has a **Name** and an optional **TranslationKey** for localization. Add tags in the **Tag Settings** list. Users can then select from these tags when creating or editing cases.

Tags are also available as a filter and chart dimension in the [Cases Dashboard](cases-dashboard.md).

## Support Email Settings

| Setting | Description |
| --- | --- |
| **Support Email Address** | Displayed in the Case UI as reference for the support team |
| **Support Email Name** | Display name used in outbound case email communications |

For inbound email configuration (automatically creating cases from incoming emails), see [Inbound Email](cases-inbound-email.md).

## JSON Configuration Example

Case settings are part of the tenant settings object. Here is an example of the case-related section:

```json
{
  "CaseSettings": {
    "IsEnabled": true,
    "UseSameIdAndNumber": false,
    "SupportEmailAddress": "support@yourcompany.com",
    "SupportEmailName": "Customer Support",
    "DefaultPriority": "Medium",
    "StatusNew": "New",
    "StatusClosed": "Closed",
    "StatusReopen": "In Progress",
    "Statuses": [
      { "Name": "New", "Level": 1 },
      { "Name": "In Progress", "Level": 2 },
      { "Name": "Resolved", "Level": 3 },
      { "Name": "Closed", "Level": 4 }
    ],
    "Priorities": [
      { "Name": "Low", "Severity": 1 },
      { "Name": "Medium", "Severity": 2 },
      { "Name": "High", "Severity": 3 },
      { "Name": "Critical", "Severity": 4 }
    ],
    "TagSettings": [
      { "Name": "Billing", "TranslationKey": "" },
      { "Name": "Shipping", "TranslationKey": "" },
      { "Name": "Product Issue", "TranslationKey": "" },
      { "Name": "Returns", "TranslationKey": "" },
      { "Name": "General Inquiry", "TranslationKey": "" }
    ]
  }
}
```
