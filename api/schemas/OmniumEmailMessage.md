# OmniumEmailMessage

Class for sending email

**Fields:**

- `subject`: string, nullable — Email subject
- `bodyText`: string, nullable — Email body text(no html)
- `htmlText`: string, nullable — Email body text with
- `fromAddress`: string, nullable — Email from/sender address
- `fromName`: string, nullable — Email from/sender name
- `referenceId`: string, nullable — Reference id for external systems like Sendgrid
- `storeId`: string, nullable — Omnium store id. If email should be sendt in context of a store
- `to`: List<string>, nullable, max length 250 — List of recipients email addresses
- `cc`: List<string>, nullable, max length 250 — List of cc email addresses
- `bcc`: List<string>, nullable, max length 250 — List of Bcc email addresses
- `market`: string, nullable — If email should only be sent for a specific market(used for translation)
- `attachments`: List<[`OmniumEmailAttachment`](OmniumEmailAttachment.md)>, nullable, max length 250 — Email attachments
- `logText`: string, nullable — Text displayed in log for this event

**Used directly by endpoints in:**

- [Customers | B2B](../endpoints/customers/b2b.md)
- [Notifications](../endpoints/notifications.md)
- [Projects](../endpoints/projects.md)
