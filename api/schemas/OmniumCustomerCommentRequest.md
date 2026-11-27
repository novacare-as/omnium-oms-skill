# OmniumCustomerCommentRequest

Request model for adding a comment to a customer

**Fields:**

- `customerId`: string, nullable — Customer ID (e.g., email address or customer number)
- `commentText`: string, nullable — The comment text/message content
- `createdBy`: string, nullable — The sender/creator of the comment (e.g., "API", "System", external service name). Defaults to "API" if not specified.
- `tags`: List<string>, nullable — Tags for categorizing/filtering comments
- `marketId`: string, nullable — Market ID (optional, uses customer's market if not specified)
- `sendEmail`: boolean — Send email notification to customer
- `emailSubject`: string, nullable — Email subject line
- `emailTo`: string, nullable — Email recipient address. Falls back to customer's email if not specified.
- `emailCc`: string, nullable — Email CC recipients (semicolon separated)
- `emailBcc`: string, nullable — Email BCC recipients (semicolon separated)
- `emailFrom`: string, nullable — Email from address. Falls back to store's default email if not specified.
- `senderName`: string, nullable — Sender display name for email and SMS notifications. Falls back to store's default sender name if not specified.
- `sendSms`: boolean — Send SMS notification to customer
- `smsPhoneNumber`: string, nullable — Phone number for SMS. Falls back to customer's phone if not specified.

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
