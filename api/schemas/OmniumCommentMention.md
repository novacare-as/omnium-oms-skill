# OmniumCommentMention

An Omnium user tagged with @ in a comment

**Fields:**

- `userId`: string, nullable — Omnium user id of the mentioned user (lowercased email)
- `displayName`: string, nullable — The display text inserted after @ in the comment detail (typically "FirstName LastName")
- `status`: string, nullable — The mentioned user's own workflow status (New, Open or Closed). Read-only - managed by the mentioned user in the Omnium GUI
