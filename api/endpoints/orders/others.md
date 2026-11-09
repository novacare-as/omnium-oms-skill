# Orders | Others

Source: https://api.omnium.no/documentation

> Various endpoints for order management.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PUT /api/Orders/PosOrders`

**Create a new Pos order in OMS.**

Operation ID: `OrdersCreatePosOrder`

This will be saved as a OmniumOrder. For more information about properties, see OmniumOrder model.

### Notes ###
- **OrderType** will be set to Pos.
- If **Created** is not set, it will be set to utc now.
- **Status** wil be set to Completed

Following properties is required:
- **MarketId**: Should be set to a market in Omnium.
- **OrderNumber**: Must be unique.
- **StoreId**: Must match a store in Omnium

Sample request for a Pos order.

    {
      "customerId": "4712345678",
      "customerName": "Ola Nordmann",
      "customerPhone": "+4712345678",
      "marketId": "No",
      "storeId": "TestStore",
      "orderNumber": "PO-123456",
      "created": "2018-08-01T00:00:00Z",
      "orderForm": {
        "lineItems": [
          {
            "code": "Ab1234",
            "displayName": "Faded glory",
            "placedPrice": 100,
            "placedPriceExclTax": 80,
            "extendedPrice": 200,
            "extendedPriceExclTax": 160,
            "quantity": 2,
            "taxTotal": 40,
            "taxRate": 25
          }
        ]
      }
    }

**Request body:** [`OmniumOrder`](../../schemas/OmniumOrder.md)

**Responses:**

- 201: Order created successfully
- 400: string — Request invalid

---

## `GET /api/Orders/carts/{cartId}`

**Returns a single order which has a matching cartId property.**

Operation ID: `OrdersGetByCartId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of the cart the order originated from |

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 404: string — The order was not found

---

## `GET /api/Orders/secret/{secretKey}`

**Returns a single order which has a matching secretKey property.**

Operation ID: `OrdersGetBySecretKey`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `secretKey` | path | string | Yes | The secret key of the order |

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 404: string — The order was not found

---

## `GET /api/Orders/GetOrders/Count`

**Returns the number of orders for a given status and given store.**

Operation ID: `OrdersGetOrderCount`

Sample request:
    GET /api/orders/GetOrders/Count?storeId=123&status=New&changedSince=2022-01-01T00:00:00Z

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | query | List<string> | No | ID for a store |
| `status` | query | List<string> | No | Filter on order status. Possible values: New, InTransit, InProgress, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped, Returned, PartiallyReturned. |
| `changedSince` | query | string (date-time) | No | Filter on changed date(UTC) |
| `orderTypes` | query | List<string> | No | Filter on order types: Online, Pos, ClickAndCollect etc. |
| `filterOnWarehouse` | query | boolean | No | Filter on shipment warehouse. If false, storefilter will be order.storeId |

**Responses:**

- 200: integer (int32) — The number of orders for a given status and store
- 400: string — Invalid request parameters

---

## `GET /api/Orders/GetAsPdf/{orderId}`

**Get copy of receipt or template specific pdf**

Operation ID: `OrdersGetAsPdf`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes |  |
| `templateFile` | query | string | No | Used if you want template specific design. If template exist in subfolder, specify folder and file. eg: folderName/templateDesign.json |
| `shipmentId` | query | string | No | Used only when templateFile is specified. If no shipmentId, all shipments will be included in print |

**Responses:**

- 200: string (binary) — Success
- 400: string — Bad Request
- 404: string — Order was not found

---

## `POST /api/Orders/ExistMany`

**Check if multiple orders exist in Omnium. Returns the IDs that were found.**

Operation ID: `OrdersExistMany`

**Request body:** List<string> — List of order IDs to check (max 1000)

**Responses:**

- 200: List<string> — Returns a list of IDs that exist in Omnium
- 400: string — The request was invalid

---

## `POST /api/Orders/AddComment`

**Add a comment to an order, with the option to send SMS, email or both**

Operation ID: `OrdersAddComment`

Sample request for adding a public comment with email notification:

    POST /api/Orders/AddComment
    {
       "OrderId": "ORD-12345",
       "CommentType": "Public",
       "CommentText": "Hi! This is just a sample text.",
       "SendEmail": true,
       "EmailSubject": "Something order related",
       "EmailTo": "customer@example.com",
       "EmailFrom": "orders@yourcompany.com",
       "SenderName": "Order Team"
    }

Sample request for adding a public comment with SMS notification:

    POST /api/Orders/AddComment
    {
       "OrderId": "ORD-12345",
       "CommentType": "Public",
       "CommentText": "Hi there! This is an SMS  message for you ❤️",
       "SendSms": true,
       "SmsPhoneNumber": "+4712345678"
    }

Sample request for adding an internal comment (staff only):

    POST /api/Orders/AddComment
    {
       "OrderId": "ORD-12345",
       "CommentType": "Internal",
       "CommentText": "Customer called about delivery delay.",
       "CreatedBy": "Support Team"
    }

Sample request for adding a public comment with an attachment that is emailed to the customer:

    POST /api/Orders/AddComment
    {
       "OrderId": "ORD-12345",
       "CommentType": "Public",
       "CommentText": "Here is the delivery note for your order.",
       "SendEmail": true,
       "EmailSubject": "Delivery note",
       "Attachments": [
         { "ExternalUrl": "https://files.example.com/delivery-notes/12345.pdf", "FileName": "delivery-note-12345.pdf" }
       ]
    }

Notes:
- CommentType defaults to "Public" if not specified. CreatedBy defaults to the current API user's username if not specified.
- EmailTo, EmailFrom, SenderName, and SmsPhoneNumber will fall back to the store's (or global) default settings in Omnium if not specified.
- EmailTo falls back to the order's customer email. SmsPhoneNumber falls back to the order's customer phone.
- Attachments are copied from ExternalUrl into Omnium's storage, and are not sent by SMS. To send the file content
  instead, use POST /api/Orders/AddCommentWithFiles.

**Request body:** [`OmniumOrderCommentRequest`](../../schemas/OmniumOrderCommentRequest.md) — The comment request containing order ID, comment type, text, attachments, and notification settings

**Responses:**

- 200: Comment added successfully
- 400: string — Invalid request, or an attachment could not be copied from its ExternalUrl
- 404: string — Order not found

---

## `POST /api/Orders/AddCommentWithFiles`

**Add a comment with uploaded files to an order, with the option to send SMS, email or both**

Operation ID: `OrdersAddCommentWithFiles`

Takes the same fields as POST /api/Orders/AddComment, sent as multipart/form-data form fields, together with the
files to attach. The files are stored in Omnium, attached to the comment and included in the email notification.

Sample request:

    POST /api/Orders/AddCommentWithFiles
    Content-Type: multipart/form-data

    OrderId: ORD-12345
    CommentType: Public
    CommentText: Here is the delivery note for your order.
    SendEmail: true
    EmailSubject: Delivery note
    files: (binary) delivery-note-12345.pdf
    files: (binary) photo.jpg

With curl:

    curl -X POST "$OMNIUM_API/api/Orders/AddCommentWithFiles" -H "Authorization: Bearer $TOKEN" -F OrderId=ORD-12345 -F CommentText="Here is the delivery note for your order." -F files=@delivery-note-12345.pdf -F files=@photo.jpg

The notes on POST /api/Orders/AddComment apply here too.

**Request body:** `multipart/form-data`

**Responses:**

- 200: Comment added successfully
- 400: string — Invalid request, or an empty file
- 404: string — Order not found

---

## `POST /api/Orders/ExportOrders`

**Export orders to a connector**

Operation ID: `OrdersExportOrders`

Sample request for exporting orders to a connector:

    POST /api/Orders/ExportOrders
    {
       "connectorId": "19527b9b-6ebf-4d34-8e32-28ff618ff168",
       "orderIds": ["ORDER-001", "ORDER-002", "ORDER-003"]
    }

    POST /api/Orders/ExportOrders
    {
       "connectorName": "Shopify",
       "orderIds": ["1213", "1214", "1214"]
    }

If both connectorId and connectorName is provided, we will prioritize connectorId as it is more specific.
///

**Request body:** [`OmniumOrderExportRequest`](../../schemas/OmniumOrderExportRequest.md) — The export request containing connector ID and list of order IDs to export

**Responses:**

- 200: List<[`OmniumExportResult`](../../schemas/OmniumExportResult.md)> — Orders exported successfully
- 400: string — Invalid request
- 404: string — One or more orders not found

---

## `POST /api/Orders/PatchLineItemIds`

**Patch line item IDs across order form, shipments, and return order forms**

Operation ID: `OrdersPatchLineItemIds`

Sample request for updating line item IDs:

    POST /api/Orders/PatchLineItemIds
    {
       "orderId": "ORDER-001",
       "lineItemIdMappings": [
         {
           "oldLineItemId": "old-line-1",
           "newLineItemId": "new-line-1"
         },
         {
           "oldLineItemId": "old-line-2",
           "newLineItemId": "new-line-2"
         }
       ]
    }

This endpoint will update line item IDs in:
- order.OrderForm.LineItems
- order.OrderForm.Shipments[].LineItems
- order.ReturnOrderForms[].LineItems

**Request body:** [`OmniumPatchLineItemIdsRequest`](../../schemas/OmniumPatchLineItemIdsRequest.md) — The request containing order ID and line item ID mappings

**Responses:**

- 200: [`OmniumPatchLineItemIdsResult`](../../schemas/OmniumPatchLineItemIdsResult.md) — Line item IDs updated successfully
- 400: string — Invalid request
- 404: string — Order not found
