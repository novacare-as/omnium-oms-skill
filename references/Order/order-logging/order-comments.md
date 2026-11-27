# Order Comments

Source: https://docs.omnium.no/docs/Order/order-logging/order-comments

> Add manual audit trail notes and customer communication to orders via the UI or API, with email and SMS notification support.

## Order Comments

Comments provide a manual audit trail and customer communication channel on orders. There are two types of comments, stored separately:

| Type | Internal Name | Visibility | Use Case |
| --- | --- | --- | --- |
| **Public** | `PublicOrderNotes` | Staff + Customer | Customer-facing communication (can send email/SMS notifications) |
| **Internal** | `OrderNotes` | Staff only | Internal notes, handoff information, issue tracking |

### API: Adding Comments

**Endpoint**: `POST /api/Orders/AddComment`

**Request model** (`OmniumOrderCommentRequest`):

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `orderId` | string | Yes | The order to add the comment to |
| `commentText` | string | Yes | The comment content |
| `commentType` | enum | No | `Public` (default) or `Internal` |
| `createdBy` | string | No | Comment author. Defaults to the API user's username |
| `tags` | list | No | Tags for categorizing/filtering comments |
| `marketId` | string | No | Market ID. Falls back to order's market |
| `sendEmail` | bool | No | Send email notification to customer |
| `emailSubject` | string | No | Email subject line |
| `emailTo` | string | No | Recipient email. Falls back to order's customer email |
| `emailCc` | string | No | CC recipients (semicolon separated) |
| `emailBcc` | string | No | BCC recipients (semicolon separated) |
| `emailFrom` | string | No | Sender email. Falls back to store's default |
| `senderName` | string | No | Display name for email/SMS sender. Falls back to store's default |
| `sendSms` | bool | No | Send SMS notification to customer |
| `smsPhoneNumber` | string | No | SMS recipient. Falls back to order's customer phone |

**Public comment with email notification:**

```
POST /api/Orders/AddComment
{
  "orderId": "ORD-12345",
  "commentType": "Public",
  "commentText": "Your order has been shipped and is on its way!",
  "sendEmail": true,
  "emailSubject": "Your order has shipped",
  "emailTo": "customer@example.com",
  "emailFrom": "orders@yourcompany.com",
  "senderName": "Order Team"
}
```

**Internal comment (staff only):**

```
POST /api/Orders/AddComment
{
  "orderId": "ORD-12345",
  "commentType": "Internal",
  "commentText": "Customer called about delivery delay. Offered 10% discount on next order.",
  "createdBy": "Support Team"
}
```

### Comment Templates

You can configure predefined comment templates to standardize communication. Templates are configured in `OrderSettings.CommentTemplates`. See [Order Configuration](../order-config.md#comment-templates) for setup details.
