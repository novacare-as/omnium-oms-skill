# Notes & Communication

Source: https://docs.omnium.no/docs/Customer/Cases/cases-notes-and-communication

> Public and internal case notes, email and SMS notifications, file attachments, and reply templates.

## Case Notes

Case notes are the primary communication mechanism within a case. There are two types:

### Public Notes

Public notes are visible to the customer and can trigger outbound notifications. Use public notes for:

*   Responding to customer inquiries
*   Providing status updates
*   Sharing resolution details

When adding a public note, you can optionally send an **email notification** or **SMS notification** to the customer or participants.

### Internal Notes

Internal notes are visible only to staff members. Use internal notes for:

*   Recording internal discussions
*   Documenting investigation steps
*   Leaving handover notes for other agents

Internal notes are never included in customer-facing communications.

## Adding Notes

When adding a note to a case, the following fields are available:

| Field | Description |
| --- | --- |
| **Comment** | The note text content |
| **Is Public** | Toggle between public (customer-visible) and internal (staff-only) |
| **Send Email Notification** | Send the note content via email to the specified recipient |
| **Send SMS Notification** | Send a notification via SMS |
| **To** | Email recipient address |
| **Cc / Bcc** | Additional email recipients |
| **From** | Sender email address (defaults to configured support email) |
| **Subject** | Email subject line |
| **Phone Number** | SMS recipient number |

## File Attachments

Notes support file attachments. Files are uploaded and stored as assets linked to the note. When cases are created from inbound email, any email attachments (including inline images from signatures) are automatically extracted and attached to the first note.

## Email Notifications

When **Send Email Notification** is enabled on a public note:

1.  The note content is sent as an email to the specified recipient
2.  Omnium embeds a tracking reference in the email headers
3.  If the customer replies to the email, the reply is automatically added as a new comment on the case (see [Inbound Email](cases-inbound-email.md))

Email details recorded on the note:

*   **From Name** and **From Address** — the sender identity
*   **Subject** — the email subject line
*   **To / Cc / Bcc** — all recipients
*   **Delivery Method** — set to "Email"

## SMS Notifications

When **Send SMS Notification** is enabled:

*   The note triggers an SMS to the specified phone number
*   The SMS sender name is configurable
*   Delivery is recorded on the note

## Reply Templates

Reply templates allow you to create pre-written responses for common scenarios, saving time and ensuring consistent communication.

### Managing Templates

Templates are managed via **Cases → Reply Templates** and support:

*   **Create** — add a new template with a title, content, and optional category
*   **Edit** — modify existing templates
*   **Delete** — remove templates
*   **Organize by Category** — group templates for easier browsing

### Using Templates

When adding a note to a case, select a reply template to pre-fill the note content. You can edit the content before submitting.

Reply templates are shared across all users in the tenant. Any user with case access can create, edit, and use templates.

## Email Threading

When a customer replies to a case notification email, Omnium uses the embedded tracking reference to match the reply to the original case. The reply behavior depends on the case status:

*   **Open case** — the reply is added as a new comment
*   **Closed case** — the case is automatically reopened to the configured **Status Reopen** status, and the reply is added as a comment
*   **Pending/lower status case** — the case status may be downgraded to a lower level status

This enables seamless email-based conversations without requiring customers to log into any portal. For full setup instructions, see [Inbound Email](cases-inbound-email.md).
