# Notes & Communication

Source: https://docs.omnium.no/docs/Customer/Cases/cases-notes-and-communication

> Public and internal case notes, sending notes by email and SMS, attachments, @mentions, drafts, reply templates, case notifications, and email threading.

## Case Notes

Case notes are the primary communication mechanism within a case. Switch between the two types with the **Public Notes** and **Internal Notes** tabs above the editor.

### Public Notes

Public notes are the thread with the customer: the agents' replies and the customer's own emails and SMS messages. Use public notes for:

*   Responding to customer inquiries
*   Providing status updates
*   Sharing resolution details

A public note is meant to be sent to the customer by email, SMS or both. The email address is filled in with the case's customer email.

With [Formatted replies and signatures](cases-config.md#formatted-replies-and-signatures) turned on, agents can format public notes and their email replies get the agent's own signature.

### Internal Notes

Internal notes are for staff. Use internal notes for:

*   Recording internal discussions
*   Documenting investigation steps
*   Leaving handover notes for other agents

Internal notes are not part of the customer thread: the [case history](cases-config.md#customer-emails) in customer emails never shows them. An internal note can still be sent by email or SMS, for example to a colleague or a supplier. The email address is then empty, and the SMS number is filled in with the customer's number, so check the recipient before you send. A reply to an emailed internal note comes back as a new internal note.

The `{LAST_COMMENT}` placeholder in a [case notification](cases-notes-and-communication.md#case-notifications) shows the latest public note, or the latest internal note when the case has no public notes. Leave it out of notifications to customers if your internal notes must never reach them.

## Adding Notes

The note editor has these fields:

| Field | Description |
| --- | --- |
| Note text | The content of the note |
| **Email** | Recipient email address. Shown when the note is sent by email |
| **Cc / Bcc** | Additional email recipients |
| **Subject** | Email subject line |
| **Mobile number** | SMS recipient number. Omnium suggests the numbers of the customers linked to the case |
| Attachments | Files added with the paper-clip button |

Choose how the note is delivered with the email and SMS buttons. The submit button tells what happens: **Send e-mail**, **Send SMS**, **Send e-mail and SMS**, or **Add Comment** when the note is only saved on the case. The [note defaults](cases-config.md#note-defaults) in the case settings decide which tab and delivery are selected when a case opens.

Omnium sends case emails from the standard address of the [email client settings](../../configuration/email-client-settings.md), with the tenant name as the sender name. The note editor has no field for the sender.

### Drafts

Omnium keeps what you have written but not sent, with the recipients and attachments, for each case and note type. The draft comes back when you return to the case in the same browser tab session. If you close or reload the tab with text that is not sent, the browser asks you to confirm.

### @Mentions

Type `@` and a name in a note to mention an Omnium user. The mentioned user gets an email with a link to the case. Mentions work in the plain text editor; the formatted editor has none. Mentions can be turned off for the tenant with `CommentSettings.IsMentionsEnabled`.

## File Attachments

Add files to a note with the paper-clip button, up to 30 MB in total per note. Files are uploaded and stored as assets linked to the note, and are sent with the note when it goes out by email. An SMS carries no attachments.

When cases are created from inbound email, any email attachments (including inline images from signatures) are automatically extracted and attached to the first note.

## Email Notifications

When a note is sent by email:

1.  The note content is sent as an email to the recipients
2.  Omnium embeds a tracking reference in the email headers
3.  If the recipient replies to the email, the reply is automatically added to the case: a reply to a public note as a public note, and a reply to an internal note as an internal note (see [Inbound Email](cases-inbound-email.md))

With **Include history in customer emails** turned on, a public note emailed to the customer also carries the case's earlier public notes. See [Customer Emails](cases-config.md#customer-emails).

Email details recorded on the note:

*   **From Name** and **From Address** — the sender identity
*   **Subject** — the email subject line
*   **To / Cc / Bcc** — all recipients
*   **Delivery Method** — `Email`, `Sms` or `EmailAndSms`

## SMS Notifications

When a note is sent by SMS:

*   The note triggers an SMS to the mobile number
*   The SMS carries the note as plain text: formatting is removed, a link becomes "text (url)", and the email signature is left out
*   Delivery is recorded on the note

An SMS can only be sent when an SMS provider is set up for the tenant.

## Reply Templates

Reply templates are pre-written replies for common questions, so agents answer quickly and consistently.

### Managing Templates

Manage templates in **Customers → Cases → Reply templates**. Each template has:

| Field | Description |
| --- | --- |
| **Name** | The name agents pick the template by |
| **Category** | Optional label, for example a language. It is not shown when agents pick a template |
| **Subject** | Email subject that the template fills in |
| **Content** | The text of the reply |
| **Active** | Only active templates are offered to agents |
| **Display order** | The order templates are offered in |

Adding, editing and deleting templates needs update access to cases. **Delete** removes a template without asking for confirmation.

### Using Templates

On the **Public Notes** tab, pick a template from **Templates**. The template text is inserted where the cursor is, so you can combine several templates and edit the text before sending. When the email subject is empty, the template's subject fills it in. Internal notes have no templates.

The [AI assistant](cases-management.md#ai-assistant) can also reply to a case with a template.

## Case Notifications

A **Case Notification** sends an email when a case changes status or is assigned. Set it up in **Configuration → Notifications** with the notification type **Case Notification**.

| Option | Description |
| --- | --- |
| **Case Status Filter** | Sends the notification only when the case has one of these statuses after the change |
| Market filter | Sends the notification only for cases on these markets |

Put `{CUSTOMER_EMAIL}` or `{ASSIGNED_TO_EMAIL}` in the recipient field to write to the customer or to the assigned user. The template can use these placeholders:

| Placeholder | Value |
| --- | --- |
| `{CASE_NUMBER}`, `{CASE_ID}` | Case number and ID |
| `{CASE_SUBJECT}`, `{CASE_DESCRIPTION}` | Subject and description |
| `{CASE_STATUS}`, `{CASE_PRIORITY}`, `{CASE_SOURCE}` | Status, priority and source |
| `{CASE_CREATED}`, `{CASE_CHANGED}` | Created and changed dates |
| `{CUSTOMER_NAME}`, `{CUSTOMER_EMAIL}`, `{CUSTOMER_ID}` | The case's customer |
| `{ASSIGNED_TO_NAME}`, `{ASSIGNED_TO_EMAIL}` | The assigned user |
| `{LAST_COMMENT}` | The latest public note, or the latest internal note when there are no public notes |
| `{CASE_HISTORY}` | The ten most recent public notes, newest first |

A case notification is checked when:

*   The status changes with **Set to**, the AI assistant, the API's change status endpoint, or automatically (the first agent reply and reopening)
*   The case is assigned in the case view, by the AI assistant or with the API's assign endpoint

It is not sent when a case is created, when the status is changed in **Edit Case** or with the API's update endpoints, or when a note is added.

## Email Threading

When someone replies to an email sent from a case, Omnium uses the embedded tracking reference to match the reply to the case. A reply to a public note is added as a public note, and the case status changes like this:

| Case status | What happens |
| --- | --- |
| **Status Closed** | The case moves to **Status Reopen**, or to a status named `Open` when **Status Reopen** is empty |
| A status named exactly `Pending` | The case moves to the status with the next lower level |
| Any other status | The status stays as it is |

A customer's SMS reply works the same way. A reply to an internal note is added as an internal note and never changes the status. Reopening a case does not clear its resolved and closed dates.

This enables email-based conversations without requiring customers to log into any portal. For full setup instructions, see [Inbound Email](cases-inbound-email.md).
