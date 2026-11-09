# OmniumCommentSearchRequest

**Fields:**

- `take`: integer (int32)
- `page`: integer (int32)
- `objectIds`: List<string>, nullable, max length 250
- `objectTypes`: List<string>, nullable, max length 250
- `commentTypes`: List<string>, nullable, max length 250
- `mentionedUserIds`: List<string>, nullable, max length 250 — Filter on comments mentioning any of these Omnium user ids (lowercased emails)

**Used directly by endpoints in:**

- [Comments](../endpoints/comments.md)
