# OmniumSmsMessage

Class for sending sms

**Fields:**

- `text`: string, nullable — Body text (no html)
- `fromName`: string, nullable — Email from/sender name
- `referenceId`: string, nullable — Reference id for external systems like Sendgrid
- `to`: List<string>, nullable, max length 250 — List of recipients email addresses
- `storeId`: string, nullable — Sender Store ID
- `marketId`: string, nullable — If email should only be sendt for a specific market(used for translation)
- `logText`: string, nullable — Text displayed in log for this event

**Used directly by endpoints in:**

- [Notifications](../endpoints/notifications.md)
- [Projects](../endpoints/projects.md)
