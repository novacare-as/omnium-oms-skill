# OmniumComment

Object used for adding and getting comments on all models

**Fields:**

- `id`: string, nullable — Comment ID
- `objectId`: string, nullable — Id of object to which the comment is related (i.e. projectId if a ObjectType is Project)
- `objectType`: string, nullable — The type of object to which the comment is related (Available types: [Project])
- `type`: string, nullable — Specifies type of comment (Available types: [ProjectCustomerComment, ProjectInternalComment, ProjectPartnerComment])
- `created`: string (date-time) — Comment created date
- `customerId`: string, nullable — Comment customer ID
- `detail`: string, nullable — Comment main content
- `title`: string, nullable — Comment header
- `lineItemId`: string, nullable — Optional line item reference
- `creator`: string, nullable — Name of comment creator
- `userId`: string, nullable — ID of comment creator
- `attachments`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — List of attachments
- `parentId`: string, nullable — Parent comment ID
- `tags`: List<string>, nullable, max length 250 — Comment tags (for categories / anchors / threads)
- `mentions`: List<[`OmniumCommentMention`](OmniumCommentMention.md)>, nullable, max length 250 — Omnium users tagged with @ in the comment. Mentioned users that exist in the tenant are notified by email when the comment is created
- `sendNotification`: boolean, nullable — Send out notification. Requires delivery method and recipient(-s)
- `deliveryMethod`: string, nullable — Type of notification (Available types: [Email, Sms, EmailAndSms])
- `emailRecipient`: string, nullable — Recipient of email notification (must be valid email address)
- `smsRecipient`: string, nullable — Recipient of sms notification (must be valid phone number)
- `emailFromName`: string, nullable — Name displayed as sender of the email
- `emailFromAddress`: string, nullable — Email address displayed as sender of the email
- `emailSubject`: string, nullable — Email subject
- `smsFrom`: string, nullable — Name displayed as sender of the sms (if empty - set to StandardSmsSender from settings)

**Used directly by endpoints in:**

- [Comments](../endpoints/comments.md)
- [Obsolete](../endpoints/obsolete.md)
- [Purchase Orders](../endpoints/purchase-orders.md)
- [Purchase Orders | Deliveries](../endpoints/purchase-orders/deliveries.md)
