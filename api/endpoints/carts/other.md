# Carts | Other

Source: https://api.omnium.no/documentation

> Various endpoints for carts.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Cart/GetAsPdf/{cartId}`

**Get cart as PDF**

Operation ID: `CartGetAsPdf`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart (required) |
| `templateReference` | query | string | No | Template reference including full path and extension (ex "Folder/CustomOffer.json" ) |

**Responses:**

- 200: string (binary) — Success
- 404: string — Order was not found

---

## `POST /api/Cart/{cartId}/PackageBreakdown`

**Break down packages or bundle in cart. All components will be added as separate order lines.**

Operation ID: `CartPackageBreakdown`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart is returned
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `POST /api/Cart/AddComment`

**Add a comment to a cart, with the option to send SMS, email or both**

Operation ID: `CartAddComment`

Sample request for adding a public comment with email notification:

    POST /api/Cart/AddComment
    {
       "CartId": "CART-12345",
       "CommentType": "Public",
       "CommentText": "Hi! This is just a sample text. Fun fact: Bananas are technically berries, but strawberries are not.",
       "SendEmail": true,
       "EmailSubject": "Something cart related",
       "EmailTo": "customer@example.com",
       "EmailFrom": "carts@yourcompany.com",
       "SenderName": "Cartman"
    }

Sample request for adding a public comment with SMS notification:

    POST /api/Cart/AddComment
    {
       "CartId": "CART-12345",
       "CommentType": "Public",
       "CommentText": "Hi there! This is an SMS message for you😎",
       "SendSms": true,
       "SmsPhoneNumber": "+4712345678"
    }

Sample request for adding an internal comment (staff only):

    POST /api/Cart/AddComment
    {
       "CartId": "CART-12345",
       "CommentType": "Internal",
       "CommentText": "Customer called about cart contents.",
       "CreatedBy": "Support Team"
    }

Sample request for adding a public comment with an attachment that is emailed to the customer:

    POST /api/Cart/AddComment
    {
       "CartId": "CART-12345",
       "CommentType": "Public",
       "CommentText": "Here is the offer we discussed.",
       "SendEmail": true,
       "EmailSubject": "Your offer",
       "Attachments": [
         { "ExternalUrl": "https://files.example.com/offers/12345.pdf", "FileName": "offer-12345.pdf" }
       ]
    }

Notes:
- CommentType defaults to "Public" if not specified. CreatedBy defaults to the current API user's username if not specified.
- EmailTo, EmailFrom, SenderName, and SmsPhoneNumber will fall back to the store's (or global) default settings in Omnium if not specified.
- EmailTo falls back to the cart's customer email. SmsPhoneNumber falls back to the cart's customer phone.
- Attachments are copied from ExternalUrl into Omnium's storage, and are not sent by SMS. To send the file content
  instead, use POST /api/Cart/AddCommentWithFiles.

**Request body:** [`OmniumCartCommentRequest`](../../schemas/OmniumCartCommentRequest.md) — The comment request containing cart ID, comment type, text, attachments, and notification settings

**Responses:**

- 200: Comment added successfully
- 400: string — Invalid request, or an attachment could not be copied from its ExternalUrl
- 404: string — Cart not found

---

## `POST /api/Cart/AddCommentWithFiles`

**Add a comment with uploaded files to a cart, with the option to send SMS, email or both**

Operation ID: `CartAddCommentWithFiles`

Takes the same fields as POST /api/Cart/AddComment, sent as multipart/form-data form fields, together with the
files to attach. The files are stored in Omnium, attached to the comment and included in the email notification.

Sample request:

    POST /api/Cart/AddCommentWithFiles
    Content-Type: multipart/form-data

    CartId: CART-12345
    CommentType: Public
    CommentText: Here is the offer we discussed.
    SendEmail: true
    EmailSubject: Your offer
    files: (binary) offer-12345.pdf
    files: (binary) photo.jpg

The notes on POST /api/Cart/AddComment apply here too.

**Request body:** `multipart/form-data`

**Responses:**

- 200: Comment added successfully
- 400: string — Invalid request, or an empty file
- 404: string — Cart not found
