# API Reference

Source: https://docs.omnium.no/docs/Order/Returns/return-api

> Comprehensive guide to the Omnium Returns API. Learn how to create returns, process exchanges, create replacement orders, and manage return workflows programmatically.

The Returns API enables programmatic management of the entire return lifecycle in Omnium. This includes creating returns from orders, processing exchanges, generating replacement orders, and managing return workflows.

Returns are normally created against an existing order. When the original order is not in Omnium, see [Create an order-less return](return-api.md#create-an-order-less-return).

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Return API Flow                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐     ┌──────────────┐     ┌─────────────────────┐  │
│  │  Order  │────►│ Create Return│────►│  Return Processing  │  │
│  └─────────┘     └──────────────┘     └─────────────────────┘  │
│                         │                       │               │
│                         ▼                       ▼               │
│              ┌──────────────────┐    ┌─────────────────────┐   │
│              │ Exchange Order   │    │ Workflow Execution  │   │
│              │ (optional)       │    │ • Credit payment    │   │
│              └──────────────────┘    │ • Update inventory  │   │
│                                      │ • Notifications     │   │
│              ┌──────────────────┐    │ • Export to ERP     │   │
│              │ Replacement Order│    └─────────────────────┘   │
│              │ (optional)       │                               │
│              └──────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication

All Return API endpoints require authentication via API key. Include the API key in the request header:

```
Authorization: Bearer {your-api-key}
```

Endpoints are divided by permission level:

*   **Read operations**: Require `OrderReadGroups` access
*   **Write operations**: Require `OrderAdminGroups` access

## Base URL

```
https://api.omnium.no/api/returns
```

For test environments:

```
https://apitest.omnium.no/api/returns
```

* * *

## Create Return

Creates a return for line items from an existing order. Optionally creates an exchange order in the same transaction.

```
POST /api/returns/{orderId}/Return
```

### When to Use

*   Customer wants to return purchased items for refund
*   Customer wants to exchange items for different products
*   Processing in-store returns
*   Automated return processing from external systems

### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| orderId | string | Yes | Order ID or order number to create return from |

### Request Body

```json
{
  "returns": [
    {
      "lineItemId": "line-001",
      "returnQuantity": 2,
      "returnReason": "Wrong size",
      "returnType": "StandardReturn",
      "isStockUpdated": true,
      "creditAmount": null
    }
  ],
  "storeId": "warehouse-main",
  "comment": "Customer requested size exchange",
  "creditPayment": true,
  "creditShipment": false,
  "rmaNumber": "RMA-2024-001",
  "status": "New",
  "returnType": "StandardReturn"
}
```

### Request Properties

| Property | Type | Description |
| --- | --- | --- |
| **returns** | array | Items being returned (required) |
| returns\[\].lineItemId | string | ID of the order line item to return |
| returns\[\].returnQuantity | decimal | Quantity being returned |
| returns\[\].returnReason | string | Free-text reason for return |
| returns\[\].returnType | string | Return type ID from configuration |
| returns\[\].isStockUpdated | boolean | Whether to add items back to inventory |
| returns\[\].creditAmount | decimal | Per-item credit amount (null = full refund) |
| storeId | string | Warehouse receiving the return |
| comment | string | Return description/notes |
| creditPayment | boolean | Whether to credit the payment |
| creditShipment | boolean | Whether to refund shipping costs |
| creditShipmentAmount | decimal | Custom shipping refund amount |
| chargeShipmentCost | boolean | Charge customer for return shipping |
| chargeShipmentCostAmount | decimal | Return shipping cost (0 = use market default) |
| rmaNumber | string | Return Merchandise Authorization number |
| handlingTotal | decimal | Handling fees to deduct from refund |
| status | string | Initial return status |
| returnType | string | Overall return type classification |
| properties | array | Custom key-value properties |

### Response

```json
{
  "returnId": "ret-12345",
  "rmaNumber": "RMA-2024-001",
  "returnComment": "Customer requested size exchange",
  "returnType": "StandardReturn",
  "status": "New",
  "storeId": "warehouse-main",
  "created": "2024-01-15T10:30:00Z",
  "modified": "2024-01-15T10:30:00Z",
  "creditAmount": 149.00,
  "creditPayment": true,
  "lineItems": [
    {
      "lineItemId": "ret-line-001",
      "code": "SKU-12345",
      "displayName": "Blue T-Shirt Medium",
      "quantity": 2,
      "placedPrice": 74.50,
      "extendedPrice": 149.00
    }
  ],
  "shipments": [...],
  "subTotal": 149.00,
  "total": -149.00,
  "externalIds": [],
  "replacementOrderIds": []
}
```

### Creating an Exchange Order

To create an exchange in the same request, include the `omniumExchangeOrderOptions` property:

```json
{
  "returns": [
    {
      "lineItemId": "line-001",
      "returnQuantity": 1,
      "returnType": "Exchange",
      "isStockUpdated": true
    }
  ],
  "creditPayment": true,
  "omniumExchangeOrderOptions": {
    "exchangeOrderLines": [
      {
        "code": "SKU-54321",
        "displayName": "Blue T-Shirt Large",
        "quantity": 1,
        "placedPrice": 74.50
      }
    ],
    "orderType": "Online",
    "orderStatus": "New",
    "shippingMethodName": "Standard"
  }
}
```

### Exchange Order Properties

| Property | Type | Description |
| --- | --- | --- |
| exchangeOrderId | string | Custom ID for exchange order (auto-generated if omitted) |
| exchangeOrderLines | array | Items customer is receiving in exchange |
| additionalPayments | array | Payments if exchange costs more than return |
| orderType | string | Order type for exchange order |
| orderStatus | string | Initial status for exchange order |
| shippingMethodName | string | Shipping method (e.g., "PickUpInStore") |

### Price Difference Handling

When exchange items cost more than returned items:

```json
{
  "returns": [...],
  "omniumExchangeOrderOptions": {
    "exchangeOrderLines": [
      {
        "code": "PREMIUM-SKU",
        "quantity": 1,
        "placedPrice": 199.00
      }
    ],
    "additionalPayments": [
      {
        "paymentMethodName": "CreditCard",
        "amount": 50.00,
        "transactionId": "TXN-123456"
      }
    ]
  }
}
```

* * *

## Create an Order-less Return

Registers a return when there is no original order in Omnium — goods brought back without a receipt, a receipt that predates the integration, or a sale made in a system that never pushed its orders.

```
POST /api/Orders/AddMany
```

Do **not** create an empty order first and then add a return to it as a separate call. The supported pattern — the same one Omnium's own POS integrations use — is a single order that _carries_ the return: an order with no order lines, and a `returnOrderForms` entry holding the returned items and the refund.

### When to Use

*   In-store returns with no matching order in Omnium
*   Returns of sales made before an integration went live
*   Goodwill returns registered at the counter

### Two Calls

Registering the return and processing it are separate steps. Create the order with the return form in a placeholder status, then complete it so the return workflow runs.

**1\. Create the order carrying the return:**

```
POST /api/Orders/AddMany

[
  {
    "id": "POSRET-001",
    "orderNumber": "POSRET-001",
    "orderType": "Pos",
    "storeId": "oslo-downtown",
    "marketId": "nor",
    "billingCurrency": "NOK",
    "returnOrderForms": [
      {
        "returnId": "8f14e45f-ceea-467a-9575-9a1f6b1c2d3e",
        "status": "New",
        "storeId": "oslo-downtown",
        "returnType": "StandardReturn",
        "creditPayment": false,
        "total": 199.00,
        "lineItems": [
          {
            "lineItemId": "1",
            "code": "yellow-tshirt-medium",
            "displayName": "Yellow T-Shirt - Medium",
            "quantity": 1,
            "returnQuantity": 1,
            "placedPrice": 199.00,
            "extendedPrice": 199.00,
            "taxRate": 25,
            "returnType": "StandardReturn",
            "returnReason": "Changed mind",
            "updateStock": true
          }
        ],
        "payments": [
          {
            "amount": 199.00,
            "paymentMethodName": "PaidInStore",
            "transactionType": "Credit",
            "status": "Processed"
          }
        ]
      }
    ]
  }
]
```

**2\. Complete the return so the workflow runs:**

```
POST /api/Returns/POSRET-001/UpdateStatus

{
  "returnId": "8f14e45f-ceea-467a-9575-9a1f6b1c2d3e",
  "status": "Completed"
}
```

### Required Properties

| Property | Level | Description |
| --- | --- | --- |
| **id** | Order | Unique order ID |
| **orderNumber** | Order | Unique order number |
| **orderType** | Order | Must match a configured [order type](../order-config.md#order-types) |
| **storeId** | Order | The selling store |
| **returnId** | Return form | An ID you generate, typically a GUID. This is what you reference in the `UpdateStatus` call |
| **status** | Return form | Placeholder status to create the return in, before completing it |
| **storeId** | Return form | The store receiving the goods back. Inventory is increased here |
| **returnType** | Return line | A return type ID from [return settings](../order-config.md#return-types) |
| **quantity** and **returnQuantity** | Return line | Set both. The inventory adjustment is based on `quantity` |
| **updateStock** | Return line | `true` to have Omnium add the item back to inventory |

Omit `rmaNumber` to have one generated for you.

Missing required properties return `400` with a message identifying the problem.

`orderNumber` must be unique. If an order with the same number already exists, `AddMany` responds `200` with a "not added" message rather than an error — inspect the response body rather than relying on the status code alone.

### What the Return Workflow Does

`UpdateStatus` runs the workflow configured for that return status under [return settings](../order-config.md#return-statuses). A typical configuration will:

*   Generate an RMA number — [`EnsureRma`](return-workflow-steps/enrichment/ensure-rma.md)
*   Increase inventory at the return form's `storeId` for each line where `updateStock` is `true` — [`UpdateInventory`](return-workflow-steps/inventory/update-inventory.md)
*   Attempt to credit the payment — [`CreditReturn`](return-workflow-steps/payment/credit-return.md)
*   Create a credit note for the return — [`CreateCreditNote`](return-workflow-steps/payment/create-credit-note.md)
*   Update the order status — [`UpdateOrderStatus`](return-workflow-steps/status/update-order-status.md)
*   Send return notifications — [`Notification`](return-workflow-steps/notifications/notification.md)

### Stock and Payment on Order-less Returns

**Stock is only adjusted for return types configured to update inventory.** `updateStock: true` on the line is necessary but not sufficient — the return type must also have `UpdateInventory` enabled in [return settings](../order-config.md#return-types). Use return types with `UpdateInventory: false` for goods that must not go back on the shelf.

**There is no payment on the order to credit.** The refund already happened wherever the customer was served, so set `creditPayment: false` on the return form and record what was refunded as a `Credit` payment transaction on the return form, as in the payload above. The credit step logs a warning that there is nothing to credit — this is expected and harmless.

To suppress the return notifications on a back-office registration, set `"isNotificationsDisabled": true` on the order.

### Alternative: an Already-completed POS Order

When the POS pushes the till transaction as an order that is _already_ completed — a mixed receipt with both sold and returned items, for example — the return can be restocked by the order workflow instead of the return workflow, using the [`CheckPosOrderForReturnAndIncreaseInventory`](../workflow-steps/inventory/check-pos-order-for-return-and-increase-inventory.md) step on the completed status. That step requires the order to be in a completed status and is idempotent, so re-running the workflow does not double-count.

* * *

## Update Return Status

Updates the status of a return and executes the associated workflow steps.

```
POST /api/returns/{orderId}/UpdateStatus
```

### When to Use

*   Moving return through processing stages
*   Triggering workflow actions (refund, inventory update, notifications)
*   Completing or cancelling returns

### Request Body

```json
{
  "status": "Completed",
  "returnId": "ret-12345",
  "userId": "user-001",
  "skipRunWorkflow": false
}
```

### Request Properties

| Property | Type | Description |
| --- | --- | --- |
| **status** | string | New status (required). Values: New, InProgress, InTransit, ReadyForPickup, Completed, OrderCanceled, PartiallyShipped |
| **returnId** | string | Return ID to update (required) |
| userId | string | User performing the update |
| skipRunWorkflow | boolean | If true, updates status without running workflow steps |
| shipmentInfo | object | Shipment tracking information to update |

### Shipment Info Properties

```json
{
  "status": "Completed",
  "returnId": "ret-12345",
  "shipmentInfo": {
    "shipmentId": "ship-001",
    "trackingNumber": "1Z999AA10123456784",
    "trackingUrl": "https://tracking.example.com/1Z999AA10123456784",
    "returnTrackingNumber": "1Z999AA10123456785",
    "returnTrackingLink": "https://tracking.example.com/1Z999AA10123456785"
  }
}
```

### Response

Returns workflow execution results:

```json
{
  "orderActionExecutionResults": [
    {
      "actionType": "UpdateInventory",
      "actionStatus": "Success",
      "translateKey": "WorkflowStep_UpdateInventory",
      "isInvisible": false
    },
    {
      "actionType": "CreditReturn",
      "actionStatus": "Success",
      "translateKey": "WorkflowStep_CreditReturn",
      "isInvisible": false
    },
    {
      "actionType": "Notification",
      "actionStatus": "Success",
      "translateKey": "WorkflowStep_Notification",
      "isInvisible": false
    }
  ],
  "isAborted": false,
  "order": {...}
}
```

### Workflow Status Meanings

| Status | Typical Workflow Actions |
| --- | --- |
| New | EnsureRma, Notification, UpdateOrderStatus |
| InProgress | \- |
| InTransit | CreateReturnShipmentBooking |
| ReadyForPickup | \- |
| Completed | UpdateInventory, CreditReturn, ExportOrder |
| OrderCanceled | CancelReturn |

* * *

## Search Returns

Search and filter return orders with pagination.

```
POST /api/returns/SearchReturnOrders
```

### Request Body

```json
{
  "orderNumber": "ORD-2024-001",
  "rmaNumber": null,
  "customerId": null,
  "email": "customer@example.com",
  "searchText": null,
  "selectedStores": ["warehouse-main"],
  "createdFrom": "2024-01-01T00:00:00Z",
  "createdTo": "2024-01-31T23:59:59Z",
  "take": 20,
  "page": 1
}
```

### Search Properties

| Property | Type | Description |
| --- | --- | --- |
| id | string | Return ID (exact match) |
| orderNumber | string | Original order number |
| rmaNumber | string | RMA number |
| customerId | string | Customer ID |
| projectId | string | Associated project/claim ID |
| email | string | Customer email |
| phone | string | Customer phone |
| customerName | string | Customer name |
| searchText | string | Free-text search across multiple fields |
| selectedStores | array | Filter by return store IDs |
| createdFrom | datetime | Returns created after this date |
| createdTo | datetime | Returns created before this date |
| modifiedFrom | datetime | Returns modified after this date |
| modifiedTo | datetime | Returns modified before this date |
| take | integer | Results per page (default: 20) |
| page | integer | Page number (default: 1) |

### Response

```json
{
  "totalHits": 47,
  "result": [
    {
      "orderId": "order-12345",
      "orderNumber": "ORD-2024-001",
      "customerId": "cust-001",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "returnStoreName": "Main Warehouse",
      "returnStoreId": "warehouse-main",
      "returnOrderForm": {
        "returnId": "ret-12345",
        "rmaNumber": "RMA-2024-001",
        "status": "Completed",
        "created": "2024-01-15T10:30:00Z",
        "creditAmount": 149.00,
        "lineItems": [...]
      }
    }
  ],
  "facets": []
}
```

* * *

## Patch Return

Partially update a return. Only properties included in the request are modified.

```
PATCH /api/returns/{orderId}/{returnId}
```

### When to Use

*   Updating return metadata (RMA, comment, type)
*   Modifying line items on an existing return
*   Adding external IDs for integrations
*   Adjusting credit amounts

### Request Body

```json
{
  "rmaNumber": "RMA-2024-001-UPDATED",
  "returnComment": "Updated comment after inspection",
  "creditAmount": 125.00,
  "externalIds": [
    {
      "providerName": "ERP",
      "id": "ERP-RET-12345"
    }
  ]
}
```

### Patch Properties

| Property | Type | Description |
| --- | --- | --- |
| rmaNumber | string | Update RMA number |
| returnComment | string | Update return comment |
| returnType | string | Update return type |
| status | string | Update status |
| storeId | string | Update receiving store |
| creditAmount | decimal | Update credit amount |
| creditPayment | boolean | Update credit flag |
| externalIds | array | Add/update external system IDs |
| lineItems | array | Update line items |
| shipments | array | Update shipment information |
| shouldAddMissingLineItems | boolean | Add items not in existing return |
| replaceLineItemsArray | boolean | Replace all line items (not merge) |

### Response

```json
{
  "totalCount": 1,
  "updatedCount": 1,
  "unchangedCount": 0,
  "notFoundCount": 0,
  "errorCount": 0,
  "isModified": true
}
```

* * *

## Create Replacement Order

Creates a replacement order for items from an existing order. The customer receives new items without additional payment.

```
POST /api/returns/CreateReplacementOrder
```

### When to Use

*   Item arrived damaged
*   Wrong item was shipped
*   Item defective/faulty
*   Lost shipment replacement

### Request Body

```json
{
  "orderId": "order-12345",
  "orderLineReplacements": [
    {
      "lineItemId": "line-001",
      "quantity": 1,
      "replacementType": "DefectiveItem",
      "replacementReason": "Product arrived damaged"
    }
  ],
  "comment": "Replacement for damaged item - approved by support"
}
```

### Request Properties

| Property | Type | Description |
| --- | --- | --- |
| **orderId** | string | Original order ID (required) |
| **orderLineReplacements** | array | Items to replace (required) |
| orderLineReplacements\[\].lineItemId | string | Order line to replace |
| orderLineReplacements\[\].quantity | integer | Quantity to replace |
| orderLineReplacements\[\].replacementType | string | Type of replacement |
| orderLineReplacements\[\].replacementReason | string | Reason for replacement |
| orderLineReplacements\[\].skuId | string | Different SKU to send (optional) |
| comment | string | Comment added to replacement order |
| amountToCredit | decimal | Partial credit amount on original order |

### Replace with Different Product

To ship a different product:

```json
{
  "orderId": "order-12345",
  "orderLineReplacements": [
    {
      "lineItemId": "line-001",
      "quantity": 1,
      "skuId": "NEW-SKU-456",
      "replacementReason": "Original product discontinued"
    }
  ]
}
```

### Response

Returns a list of return order forms created:

```json
[
  {
    "returnId": "ret-replacement-001",
    "status": "New",
    "lineItems": [...],
    "replacementOrderIds": ["replacement-order-001"]
  }
]
```

* * *

## Get Claim Types

Retrieves available claim/project types for returns.

```
GET /api/returns/Claims/ClaimTypes
```

### When to Use

*   Populating claim type dropdown in UI
*   Validating claim types before creating return with claim

### Response

```json
[
  {
    "projectTypeId": "warranty-claim",
    "projectTypeName": "Warranty Claim",
    "projectTypeDescription": "Product defect covered by warranty"
  },
  {
    "projectTypeId": "damage-claim",
    "projectTypeName": "Damage Claim",
    "projectTypeDescription": "Item damaged during shipping"
  },
  {
    "projectTypeId": "missing-item",
    "projectTypeName": "Missing Item",
    "projectTypeDescription": "Item not included in shipment"
  }
]
```

* * *

## Common Scenarios

### Scenario 1: Simple Refund Return

Customer returns items for full refund:

```
POST /api/returns/{orderId}/Return

{
  "returns": [
    {
      "lineItemId": "line-001",
      "returnQuantity": 1,
      "returnType": "StandardReturn",
      "isStockUpdated": true
    }
  ],
  "creditPayment": true,
  "creditShipment": false,
  "status": "New"
}
```

Then complete the return:

```
POST /api/returns/{orderId}/UpdateStatus

{
  "status": "Completed",
  "returnId": "ret-12345"
}
```

### Scenario 2: Exchange - Same Price

Customer exchanges medium for large (same price):

```
POST /api/returns/{orderId}/Return

{
  "returns": [
    {
      "lineItemId": "line-001",
      "returnQuantity": 1,
      "returnType": "Exchange",
      "isStockUpdated": true
    }
  ],
  "creditPayment": false,
  "omniumExchangeOrderOptions": {
    "exchangeOrderLines": [
      {
        "code": "SHIRT-BLUE-L",
        "displayName": "Blue T-Shirt Large",
        "quantity": 1,
        "placedPrice": 74.50
      }
    ],
    "orderType": "Online",
    "orderStatus": "New"
  }
}
```

### Scenario 3: Exchange with Price Difference

Customer exchanges for more expensive item:

```
POST /api/returns/{orderId}/Return

{
  "returns": [
    {
      "lineItemId": "line-001",
      "returnQuantity": 1,
      "returnType": "Exchange"
    }
  ],
  "omniumExchangeOrderOptions": {
    "exchangeOrderLines": [
      {
        "code": "PREMIUM-SHIRT",
        "quantity": 1,
        "placedPrice": 149.00
      }
    ],
    "additionalPayments": [
      {
        "paymentMethodName": "CreditCard",
        "amount": 74.50
      }
    ]
  }
}
```

### Scenario 4: Partial Credit

Customer returns item but only receives partial credit (restocking fee):

```
POST /api/returns/{orderId}/Return

{
  "returns": [
    {
      "lineItemId": "line-001",
      "returnQuantity": 1,
      "returnType": "StandardReturn",
      "creditAmount": 60.00
    }
  ],
  "creditPayment": true,
  "handlingTotal": 14.50,
  "comment": "Restocking fee applied per policy"
}
```

### Scenario 5: Defective Item Replacement

Item defective, send replacement without affecting inventory:

```
POST /api/returns/CreateReplacementOrder

{
  "orderId": "order-12345",
  "orderLineReplacements": [
    {
      "lineItemId": "line-001",
      "quantity": 1,
      "replacementType": "DefectiveItem",
      "replacementReason": "Manufacturing defect"
    }
  ]
}
```

* * *

## Error Handling

### HTTP Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Order or return not found |
| 500 | Server Error - Processing failed |

### Error Response Format

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "Return quantity exceeds available quantity for line item",
  "instance": "/api/returns/order-12345/Return"
}
```

### Common Errors

| Error | Cause | Solution |
| --- | --- | --- |
| "Order not found" | Invalid orderId | Verify order exists and ID is correct |
| "Return quantity exceeds available" | Trying to return more than ordered | Check remaining returnable quantity |
| "Return type not configured" | Invalid returnType | Use configured return type from settings |
| "Cannot credit - no captured payment" | No payment to refund | Verify order has captured payments |

* * *

## Integration Best Practices

### 1\. Always Check Returnable Quantities

Before creating a return, verify the line item has sufficient quantity available for return:

*   Original quantity minus already returned quantity equals returnable quantity

### 2\. Use Appropriate Return Types

Configure return types that match your business processes:

*   **StandardReturn**: Normal customer returns with restocking fee
*   **DefectiveItem**: Product defects (no fee, don't restock)
*   **WrongItem**: Warehouse error (no fee, restock)
*   **Exchange**: Customer wants different item

### 3\. Handle Workflow Results

Always check the workflow execution results when updating status:

```json
{
  "orderActionExecutionResults": [...],
  "isAborted": false
}
```

If `isAborted` is `true`, some workflow step failed. Check individual step results for details.

### 4\. Use External IDs for Tracking

Add external IDs to link returns with your systems:

```json
{
  "externalIds": [
    { "providerName": "ERP", "id": "ERP-RET-001" },
    { "providerName": "CRM", "id": "CASE-12345" }
  ]
}
```

### 5\. Configure Webhooks for Real-Time Updates

Set up webhooks to receive notifications when returns change status, rather than polling the search API.
