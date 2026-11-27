# Configuration

Source: https://docs.omnium.no/docs/Customer/Cases/cases-config

> Enable and configure the Cases module — statuses, priorities, priority rules, tags, case numbering, customer emails, note and case list defaults, and formatted replies with signatures.

Cases are configured in **Configuration → Settings → Customer → Case Settings**.

## Enabling Cases

Toggle the **Enabled** switch to activate the Cases module. While it is on:

*   An inbound email or SMS without a reference to an existing Omnium object creates a case. While it is off, Omnium adds the email to the sender's customer card and the SMS to the customer's notes instead.
*   Orders and private and business customers get a **Cases** tab, each order line gets **Create case** in its menu, and **My page** shows a **My cases** panel.

The switch does not control the **Cases** menu or the [API](cases-api.md): users with access to cases can still open the case list and create cases there, and integrations can still create cases through the API.

Users also need the **"cases"** access claim to see and interact with the Cases section.

## CaseSettings Reference

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `IsEnabled` | bool | `false` | Creates cases from inbound email and SMS, and shows cases on orders, customers and My page. See [Enabling Cases](cases-config.md#enabling-cases) |
| `Statuses` | list | `[]` | List of available case statuses, each with a Name, Level and optional Color |
| `StatusNew` | string | — | Status automatically assigned to new cases |
| `StatusInProgress` | string | — | Status a case moves to the first time an agent writes a public note on it. Empty turns this off. See [Status Designations](cases-config.md#status-designations) |
| `StatusClosed` | string | — | Status that represents a closed case (triggers `ClosedDate`, reopen logic) |
| `StatusReopen` | string | — | Status applied when a closed case is reopened (e.g., customer replies to a closed case) |
| `Priorities` | list | `[]` | List of available priorities, each with a Name and Severity |
| `DefaultPriority` | string | — | Priority assigned to new cases when none is specified, and to cases from inbound email that no priority rule matches |
| `PriorityRules` | list | `[]` | Rules that set the priority of a case created from inbound email from words in the subject or message. See [Priority Rules](cases-config.md#priority-rules) |
| `TagSettings` | list | `[]` | List of predefined tags, each with a Name and optional TranslationKey |
| `UseSameIdAndNumber` | bool | `false` | When enabled, the Case ID and Case Number will be identical |
| `SupportEmailAddress` | string | — | Not used when Omnium sends case emails. See [Support Email Settings](cases-config.md#support-email-settings) |
| `SupportEmailName` | string | — | Not used when Omnium sends case emails. See [Support Email Settings](cases-config.md#support-email-settings) |
| `IsRichTextEnabled` | bool | `false` | Lets agents format public notes and adds each agent's own signature to email replies. See [Formatted Replies and Signatures](cases-config.md#formatted-replies-and-signatures) |
| `IncludeHistoryInCustomerEmails` | bool | `false` | Adds the case's earlier public notes below every note emailed to the customer. See [Customer Emails](cases-config.md#customer-emails) |
| `IsCustomerReplyForwardingDisabled` | bool | `false` | Stops Omnium from sending a customer's email reply on to the agent's mailbox. See [Customer Emails](cases-config.md#customer-emails) |
| `DefaultToPublicNotes` | bool | `false` | Opens a case with the public note tab selected instead of internal notes. See [Note Defaults](cases-config.md#note-defaults) |
| `DefaultPublicNoteDeliveryMethod` | string | — | How a new public note is sent unless the agent changes it: `Email`, `Sms` or `EmailAndSms`. Empty saves the note only. See [Note Defaults](cases-config.md#note-defaults) |
| `DefaultListStatus` | string | — | Status the case list is filtered on when it opens. See [Case List Defaults](cases-config.md#case-list-defaults) |
| `DefaultListSortOrder` | string | — | Sort order the case list opens with. See [Case List Defaults](cases-config.md#case-list-defaults) |

## Configuring Statuses

Each status has two properties:

| Property | Type | Description |
| --- | --- | --- |
| `Name` | string | Display name of the status (e.g., "New", "In Progress") |
| `Level` | int | Numeric level that determines workflow progression order. Lower levels come first |
| `Color` | string | Colour of the status badge in the case list and the case view: `Blue`, `Orange`, `Purple`, `Green`, `Red`, `Yellow`, `Teal` or `Grey`. Empty keeps the default badge colour |

Example configuration:

| Name | Level | Color |
| --- | --- | --- |
| New | 1 | Blue |
| In Progress | 2 | Orange |
| Resolved | 3 | Green |
| Closed | 4 | Grey |

The first time a case moves to a status in one of the two highest levels, Omnium records the date as the case's resolved date. The **Status In Progress** never counts as resolved, also in a short list where it is one of the two highest levels.

### Status Designations

After defining your statuses, assign the special designations:

*   **Status New** — The initial status for all newly created cases (including those from inbound email and the API)
*   **Status for Cases in Progress** (`StatusInProgress`, optional) — The status a case moves to the first time an agent replies to the customer, so the case list separates untouched cases from cases someone has started on. See below
*   **Status Closed** — The terminal status. When a case moves to this status, the `ClosedDate` is set. Used to detect when a case should be reopened
*   **Status Reopen** — The status applied when a customer replies to a closed case via email

The case moves to **Status for Cases in Progress** when a signed-in Omnium user adds a public note, whether or not the note is sent to the customer. It only moves while the case still has the **Status New**, so it happens on the first reply only, and a status that an agent set by hand is never overwritten. Internal notes, the customer's own emails and SMS replies, and changes made through the public API do not move the case. Leave the field empty to keep cases in **Status New** until an agent changes the status.

Configure at least one status and set **Status New** before you take cases into use. A case created without a status gets **Status New**. When **Status New** is empty, the case gets the status with the lowest level, and when no statuses are configured, it is saved without a status.

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

## Priority Rules

Priority rules give a case created from an [inbound email](cases-inbound-email.md) a priority from words in the email's subject or message. Add them on the **Statuses & Priorities** tab of the case settings, in the **Priority rules** card. Add the priorities first: a rule can only point to a priority in the **Priorities** list.

Each rule has three properties:

| Property | Shown as | Type | Description |
| --- | --- | --- | --- |
| `Field` | **Look in** | string | Where Omnium looks for the value: `Subject` (**Subject**), `Body` (**Message**) or `SubjectOrBody` (**Subject or message**). Empty means `Subject` |
| `Value` | **Contains** | string | The text the subject or message must contain |
| `Priority` | **Priority** | string | Name of the priority the case gets when the rule matches |

### How the Rules Are Applied

*   Omnium checks the rules from the top of the list down, and the **first rule that matches** sets the priority. Drag the rules in the list to change the order, and put the rule that should win at the top.
*   A rule matches when the subject or message **contains** the value anywhere, also inside a longer word. Upper and lower case are ignored, and spaces before and after the value are removed.
*   When no rule matches, the case gets the **Default Priority**.
*   A rule without a value is skipped. So is a rule whose priority is no longer in the **Priorities** list: renaming or removing a priority turns off the rules that point to it.
*   **Message** is the text of the email without the quoted or forwarded earlier messages that Omnium removes from it. A word that only appears in a quoted or forwarded message does not match.

The rules only apply when Omnium creates a **new** case from an inbound email. A customer's reply to an existing case does not change the case's priority, and a case created in Omnium or through the [API](cases-api.md) gets the priority it is created with, or the **Default Priority**. An agent can change the priority of any case afterwards.

### Example

A store that gets support email in Swedish wants cancellations handled first and questions about work experience placements ("prao") handled last:

| Look in | Contains | Priority |
| --- | --- | --- |
| Subject | avbokning | High |
| Subject | Prao | Low |

With **Default Priority** set to `Medium`:

| Email subject | Priority | Why |
| --- | --- | --- |
| `Avbokning av order 1234` | High | The first rule matches; case is ignored |
| `Fråga om praoplats` | Low | The second rule matches inside the word "praoplats" |
| `Avbokning av prao` | High | Both rules match, and the first one wins |
| `Var är mitt paket?` | Medium | No rule matches |

## Case Numbers

Omnium gives every new case an ID and a case number from two [number series](../../configuration/numberoptions.md) in the tenant settings:

| Number type | Used for |
| --- | --- |
| `CaseIdNumberOptions` | The case ID |
| `CaseNumberOptions` | The case number shown to agents and customers |

A series that is not configured gives GUIDs. Cases have no market when they are numbered, so a number option on a market is not used: Omnium takes the tenant's number option for the type without a market group, or else any of the tenant's number options for the type.

For case numbers like `CS-1001`, `CS-1002`, add a sequential series with a prefix:

```json
{
  "NumberOptions": [
    {
      "NumberType": "CaseNumberOptions",
      "Key": "CaseNumber",
      "Service": "SequentialNumberService",
      "Prefix": "CS-",
      "StartSequence": 1001
    }
  ]
}
```

Omnium always generates the ID and the case number, also for a case created through the API.

### UseSameIdAndNumber

When **Use Same ID and Number** is enabled, the case gets one value from the `CaseIdNumberOptions` series and uses it as both the ID and the case number. This can simplify integrations where you need a single identifier.

## Tags

Tags are predefined labels that can be attached to cases for categorization and filtering. Each tag has a **Name** and an optional **TranslationKey** for localization. Add tags in the **Tag Settings** list. Users can then select from these tags when creating or editing cases.

Tags are also available as a filter and chart dimension in the [Cases Dashboard](cases-dashboard.md).

## Support Email Settings

The case settings have the fields **Support Email Address** and **Support Email Name**, but Omnium does not use them when it sends case emails. A note emailed from a case is sent from the standard email address of the email client settings (`StandardEmailAddress`, the market's own when the case has a market that sets one), with the tenant name as the sender name. Customer replies go to the **Reply address for comments** (see [Inbound Email](cases-inbound-email.md)). Set the sender in [Email client settings](../../configuration/email-client-settings.md).

For inbound email configuration (automatically creating cases from incoming emails), see [Inbound Email](cases-inbound-email.md).

## Customer Emails

Two settings on the **Settings** tab of the case settings control the email dialogue with the customer:

| Setting | Property | Description |
| --- | --- | --- |
| **Include history in customer emails** | `IncludeHistoryInCustomerEmails` | Adds the case's earlier public notes below every public note that is emailed to the customer, so the customer can follow the whole dialogue. The block shows the ten most recent public notes, newest first, in the language of the tenant's email settings. Internal notes are never included, and SMS messages get no history |
| **Don't forward customer replies to the agent** | `IsCustomerReplyForwardingDisabled` | When a customer replies by email to a public note, Omnium adds the reply to the case and by default also sends it on to the mailbox of the agent who wrote the note, so the agent can answer from there. Turn this on when the team works its cases in Omnium, to stop that copy. Replies to internal notes still reach the agent, and an agent's answer from their own mailbox still reaches the customer |

## Note Defaults

These settings decide how the note editor on a case starts, so replies reach the customer unless the agent chooses otherwise. The agent can change both in the editor.

| Setting | Property | Description |
| --- | --- | --- |
| **Default to public notes** | `DefaultToPublicNotes` | Opens the case with the public note tab selected. Off by default, which selects internal notes |
| **Default delivery of public notes** | `DefaultPublicNoteDeliveryMethod` | How a new public note is sent: `Email` (**E-mail**), `Sms` (**SMS**) or `EmailAndSms` (**E-mail and SMS**). Empty (**Comment only**) saves the note without sending it. SMS is only preselected when an SMS provider is enabled for the tenant |

## Case List Defaults

These settings decide what the case list shows when it opens, so it works as a queue. They apply when the list opens fresh: when an agent goes back to the list from a case, the list keeps the filter and sort order the agent chose.

| Setting | Property | Description |
| --- | --- | --- |
| **Default status filter in the case list** | `DefaultListStatus` | The status the list is filtered on, for example `New`. Agents can still choose **All**. Ignored when the value is not one of the configured statuses |
| **Default sort order in the case list** | `DefaultListSortOrder` | One of the sort orders below |

| Value | Shown as |
| --- | --- |
| `ChangedDescending` | Last modified first |
| `CreatedAscending` | Oldest first |
| `CreatedDescending` | Newest first |
| `PriorityDescending` | Priority, highest severity first |
| `PriorityAscending` | Priority, lowest severity first |
| `FollowUpDateAscending` | Follow-up date, earliest first |

Sorting on priority follows each priority's **Severity**, so pick the direction that puts your most urgent priority first. With the example priorities above, where Critical has the highest severity, use `PriorityDescending`. Cases with the same priority are listed oldest first.

## Formatted Replies and Signatures

Turn on **Formatted replies and signatures** on the **Settings** tab of the case settings (`IsRichTextEnabled`, off by default) to let agents format their replies to customers and sign their email replies.

When the setting is on:

*   The editor for **public notes** on a case becomes a formatted-text editor. Its toolbar has bold, italic, bulleted list, numbered list, **Insert/edit link**, and remove formatting. The link dialog asks for the web address and the text to display, and the link opens in a new tab. Web addresses that the agent types or pastes also become links. The editor for **internal notes** stays plain text.
*   When the agent sends a public note as an email, Omnium adds the agent's **E-mail signature** at the bottom of the text, where the agent can change or remove it before sending. If the agent turns email off again before changing the signature, the signature is removed.
*   Each agent sets their own signature on **My page**, in the **E-mail signature** field. The field is shown only while the setting is on. A signature can have formatting and a logo: paste the logo's web address (https) into the image dialog. It can hold at most 8,000 characters of formatted text.
*   Users can change only their own signature. Saving another user's profile in Omnium, updating a user through the public API, or a SCIM update keeps the signature that is stored.

How formatted notes are sent:

*   Omnium cleans the HTML of every case note on the server before it stores and sends it. Basic formatting, lists, tables, links and images are kept. Scripts, styles, style attributes, and `javascript:` and `data:` links are removed, and links open in a new tab.
*   An SMS gets plain text: line breaks and list items become new lines, a link becomes "text (url)", and the signature is left out.

When the setting is off, both note editors are plain text boxes, no signature is added, and the signature field is hidden on My page. Signatures that agents saved earlier are kept.

Both the plain text box and the formatted editor use the browser's own spell checker, in the agent's Omnium language (Norwegian is checked as Bokmål). Right-click a marked word to see suggestions. Spell check works whether this setting is on or off.

## JSON Configuration Example

Case settings are part of the tenant settings object. Here is an example of the case-related section:

```json
{
  "CaseSettings": {
    "IsEnabled": true,
    "UseSameIdAndNumber": false,
    "SupportEmailAddress": "support@yourcompany.com",
    "SupportEmailName": "Customer Support",
    "IsRichTextEnabled": true,
    "IncludeHistoryInCustomerEmails": true,
    "IsCustomerReplyForwardingDisabled": false,
    "DefaultToPublicNotes": true,
    "DefaultPublicNoteDeliveryMethod": "Email",
    "DefaultListStatus": "New",
    "DefaultListSortOrder": "PriorityDescending",
    "DefaultPriority": "Medium",
    "StatusNew": "New",
    "StatusInProgress": "In Progress",
    "StatusClosed": "Closed",
    "StatusReopen": "In Progress",
    "Statuses": [
      { "Name": "New", "Level": 1, "Color": "Blue" },
      { "Name": "In Progress", "Level": 2, "Color": "Orange" },
      { "Name": "Resolved", "Level": 3, "Color": "Green" },
      { "Name": "Closed", "Level": 4, "Color": "Grey" }
    ],
    "Priorities": [
      { "Name": "Low", "Severity": 1 },
      { "Name": "Medium", "Severity": 2 },
      { "Name": "High", "Severity": 3 },
      { "Name": "Critical", "Severity": 4 }
    ],
    "PriorityRules": [
      { "Field": "Subject", "Value": "avbokning", "Priority": "High" },
      { "Field": "Subject", "Value": "Prao", "Priority": "Low" }
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
