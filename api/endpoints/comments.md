# Comments

Source: https://api.omnium.no/documentation

> Endpoints for managing comments. Only used for Project comments at the moment. For comments related to other objects comments should be added on the objects themselves or through dedicated endpoints.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Comments/{commentId}`

**Get comment.**

Operation ID: `CommentsGet`

Only used for Project comments at the moment. For comments related to other objects comments should be managed on the objects themselves or through dedicated endpoints.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `commentId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumComment`](../schemas/OmniumComment.md) — Success
- 404: Not Found

---

## `DELETE /api/Comments/{commentId}`

**Delete comment.**

Operation ID: `CommentsDelete`

Only used for Project comments at the moment. For comments related to other objects comments should be managed on the objects themselves or through dedicated endpoints.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `commentId` | path | string | Yes |  |

**Responses:**

- 200: Comment deleted
- 404: Comment not found

---

## `POST /api/Comments/Search`

**Search comments.**

Operation ID: `CommentsSearch`

Only used for Project comments at the moment. For comments related to other objects comments should be managed on the objects themselves or through dedicated endpoints.

**Request body:** [`OmniumCommentSearchRequest`](../schemas/OmniumCommentSearchRequest.md) — Search request object for comments

**Responses:**

- 200: List<[`OmniumComment`](../schemas/OmniumComment.md)> — Success
- 400: Bad Request
- 404: Not Found

---

## `PUT /api/Comments/Add`

**Add/update comment. Can send out notification in the process.**

Operation ID: `CommentsAdd`

Only used for Project comments at the moment. For comments related to other objects comments should be managed on the objects themselves or through dedicated endpoints.

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md) — Omnium Comment object

**Responses:**

- 200: [`OmniumComment`](../schemas/OmniumComment.md) — Success
- 400: Bad Request

---

## `PATCH /api/Comments/Update`

**Update selected fields in a comment - no support for sending notification in this endpoint.**

Operation ID: `CommentsUpdate`

Only used for Project comments at the moment. For comments related to other objects comments should be managed on the objects themselves or through dedicated endpoints.

**Request body:** [`OmniumCommentPatch`](../schemas/OmniumCommentPatch.md) — Customer comment to patch

**Responses:**

- 200: [`OmniumComment`](../schemas/OmniumComment.md) — Comment patched
- 400: Bad request
- 404: Comment not found
