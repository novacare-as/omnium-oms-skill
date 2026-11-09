# OmniumCommentPatch

Object used for patching specific comment values

**Fields:**

- `id`: string, required — Id of comment to patch
- `objectId`: string, nullable — Id of object to which the comment is related (i.e. projectId if a ObjectType is Project)
- `objectType`: string, nullable — The type of object to which the comment is related (Available types: [Project])
- `type`: string, nullable — Specifies type of comment (Available types: [ProjectCustomerComment, ProjectInternalComment, ProjectPartnerComment])
- `customerId`: string, nullable — Comment customer ID
- `detail`: string, nullable — Comment main content
- `title`: string, nullable — Comment header
- `lineItemId`: string, nullable — Optional line item reference
- `creator`: string, nullable — Name of comment creator
- `userId`: string, nullable — ID of comment creator
- `attachments`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — List of attachments
- `parentId`: string, nullable — Parent comment ID
- `tags`: List<string>, nullable, max length 250 — Comment tags (for categories / anchors / threads)
- `mentions`: List<[`OmniumCommentMention`](OmniumCommentMention.md)>, nullable, max length 250 — Omnium users tagged with @ in the comment. Replaces the existing mention list when provided; patching mentions does not trigger notifications

**Used directly by endpoints in:**

- [Comments](../endpoints/comments.md)
