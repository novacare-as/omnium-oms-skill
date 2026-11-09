# Workflow Endpoints

Source: https://docs.omnium.no/docs/Order/api-reference/workflow

> API reference for order workflow endpoints. Update order and shipment statuses, handle partial deliveries, split shipments, and trigger workflow steps like payment capture, notifications, and inventory updates.

The Workflow API allows you to progress orders through their lifecycle by updating statuses and triggering configured workflow steps. Workflow steps can automatically capture payments, send notifications, book shipments, reduce inventory, and more.

For configuring workflows and workflow steps, see [Workflow Steps](../workflow-steps.md).

## Base URL

```
https://api.omnium.no/api/Orders
```

Full Swagger reference: [Omnium Order Workflow API Documentation](https://api.omnium.no/documentation/index.html#/Orders%20%7C%20Workflow)

* * *

## Update order status

Update the status of an order or a specific shipment, and run the associated workflow.

**Endpoint:** `POST /api/Orders/{orderId}/UpdateStatus`

**Authorization:** Order Admin

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Request body:** [UpdateStatusPatch](workflow.md#update-status-patch-model)

### Update order status

Set a new status on the entire order and trigger the workflow.

```json
{
  "status": "InProgress"
}
```

### Update shipment status

Target a specific shipment by setting `shipmentId` on the `shipmentInfo` object. The workflow runs for that shipment only. If all shipments reach the same status, the order status is updated automatically.

```json
{
  "status": "Completed",
  "shipmentInfo": {
    "shipmentId": "1",
    "trackingUrl": "https://tracking.bring.com/12345"
  }
}
```

### Update status without running workflow

Set `skipRunWorkflow` to `true` to update the status without executing any workflow steps. Useful when syncing status from an external system.

```json
{
  "status": "Completed",
  "skipRunWorkflow": true
}
```

**Response:** `200 OK` with [WorkflowExecutionResult](workflow.md#workflow-execution-result-model)

**Error responses:**

| Status | Meaning |
| --- | --- |
| 400 | Missing status, or order is in a queued/read-only state |
| 404 | Order not found |
| 409 | Order is locked by another operation (only when [order locking](../order-locking.md) is enabled for the tenant) |
| 500 | Internal error |

* * *

## Update order lines and shipments

Create or update shipments and order lines, then run the workflow. This is the primary endpoint for handling partial deliveries, split shipments, and line-item-level status updates.

**Endpoint:** `POST /api/Orders/{orderId}/OrderLinesUpdate`

**Authorization:** Order Admin

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `orderId` | string | path | Yes | The order ID |

**Request body:** [UpdateLineItemStatusPatch](workflow.md#update-line-item-status-patch-model)

### Deliver items from an existing shipment

Mark specific line items as delivered on an existing shipment and trigger the workflow.

```json
{
  "status": "Completed",
  "lineItemUpdates": [
    {
      "lineItemId": "4",
      "deliveredQuantity": 4
    },
    {
      "lineItemId": "6",
      "deliveredQuantity": 6
    }
  ],
  "shipmentInfo": {
    "shipmentId": "1"
  }
}
```

### Create a partial delivery (new shipment)

Deliver some items in a new shipment while keeping the remaining items in the original shipment. If the `shipmentId` does not exist, a new shipment is created. Shipping information is copied from the original shipment unless overridden.

```json
{
  "status": "Completed",
  "lineItemUpdates": [
    {
      "lineItemId": "4",
      "deliveredQuantity": 4
    },
    {
      "lineItemId": "6",
      "deliveredQuantity": 6
    }
  ],
  "shipmentInfo": {
    "shipmentId": "2",
    "shipmentMethodName": "Bring"
  }
}
```

### Split shipment without delivering

Move items to a new shipment without marking them as delivered. Use `splitQuantity` instead of `deliveredQuantity`. You can optionally specify a different warehouse or pickup point for the new shipment.

```json
{
  "status": "InProgress",
  "lineItemUpdates": [
    {
      "lineItemId": "4",
      "splitQuantity": 2
    },
    {
      "lineItemId": "6",
      "splitQuantity": 1
    }
  ],
  "shipmentInfo": {
    "shipmentId": "2",
    "shipmentMethodName": "Bring",
    "warehouseCode": "warehouse4",
    "servicePointId": "12345",
    "pickUpPointInformation": {
      "servicePointId": "12345",
      "name": "Pickup Point Name",
      "address": {
        "street": "Main Street 1",
        "postalCode": "12345",
        "city": "City Name",
        "country": "Norway",
        "countryCode": "NO"
      }
    }
  }
}
```

### Deliver and cancel items

Deliver some items and cancel others in the same request.

```json
{
  "status": "Completed",
  "lineItemUpdates": [
    {
      "lineItemId": "4",
      "deliveredQuantity": 4
    },
    {
      "lineItemId": "5",
      "deliveredQuantity": 2,
      "canceledQuantity": 3
    },
    {
      "lineItemId": "6",
      "canceledQuantity": 6
    }
  ],
  "shipmentInfo": {
    "shipmentId": "1"
  }
}
```

### Split a single order line

When an order line has a quantity greater than 1, you can split it into a new partial shipment.

```json
{
  "status": "Completed",
  "lineItemUpdates": [
    {
      "lineItemId": "4",
      "splitQuantity": 1
    }
  ],
  "shipmentInfo": {
    "orderStatus": "Completed"
  }
}
```

Do not combine `deliveredQuantity` and `splitQuantity` on the same line item. If both are provided, `splitQuantity` is ignored.

**Response:** `200 OK` with [WorkflowExecutionResult](workflow.md#workflow-execution-result-model)

**Error responses:**

| Status | Meaning |
| --- | --- |
| 400 | Missing or empty line item updates, or order is queued |
| 404 | Order or line item not found |
| 409 | Order is locked by another operation (only when [order locking](../order-locking.md) is enabled for the tenant) |
| 500 | Internal error |

* * *

## Workflow test (dry run)

Run a workflow in test mode against a cart. No changes are persisted to the order or shipment. Useful for previewing which workflow steps would execute before actually placing the order.

**Endpoint:** `POST /api/Orders/{cartId}/processCartWorkflowTest/{status}`

**Authorization:** Order Admin

**Parameters:**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `cartId` | string | path | Yes | The cart ID to test against |
| `status` | string | path | Yes | The status to simulate (e.g., "New", "InProgress") |

**Response:** `200 OK` with [WorkflowExecutionResult](workflow.md#workflow-execution-result-model)

This is a read-only operation. The cart and any resulting order are not modified. Use this to verify your workflow configuration before going live.

* * *

## Models

### Update status patch model

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| Status | string | Yes | New status to set (e.g., "New", "InProgress", "InTransit", "ReadyForPickup", "Completed", "OrderCanceled", "PartiallyShipped") |
| ShipmentInfo | [UpdateShipmentInfo](workflow.md#update-shipment-info-model) | No | Shipment to target and optional shipment data updates |
| SkipRunWorkflow | bool | No | If true, only updates the status without running workflow steps (default: false) |
| ReturnId | string | No | Return order form ID, for return order workflows |
| UserId | string | No | User identifier to record on the status change |

* * *

### Update line item status patch model

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| Status | string | Yes | New status for the shipment/order |
| LineItemUpdates | List<[LineItemUpdate](workflow.md#line-item-update-model)\> | Yes | Line items to update (max 250) |
| ShipmentInfo | [UpdateShipmentInfo](workflow.md#update-shipment-info-model) | No | Target shipment and optional updates. If the shipment ID doesn't exist, a new shipment is created |
| IsShippingCostKeptForExistingShipment | bool | No | If true, shipping cost stays on the original shipment when splitting. If false, cost transfers to the new shipment when it is completed and the original is not (default: false) |
| UserId | string | No | User identifier |

* * *

### Line item update model

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| LineItemId | string | Yes | The line item ID to update |
| DeliveredQuantity | decimal | No | Quantity to mark as delivered |
| CanceledQuantity | decimal | No | Quantity to cancel |
| SplitQuantity | decimal | No | Quantity to move to a new shipment without delivering |
| ReadyForPickupQuantity | decimal | No | Quantity ready for customer pickup (Click & Collect) |
| ReallocateQuantity | decimal | No | Quantity to reallocate to another warehouse |
| Cost | decimal? | No | Override cost price per unit |

Use `deliveredQuantity` when items are shipped/fulfilled. Use `splitQuantity` when you need to move items to a different shipment without marking them as delivered (e.g., items shipping from a different warehouse later).

* * *

### Update shipment info model

Allows you to target a specific shipment and optionally update shipment metadata in the same request.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| ShipmentId | string | No | Shipment to target. If omitted, the first shipment is used. If the ID doesn't exist, a new shipment is created |
| OrderStatus | string | No | Status to set on the shipment specifically (if different from the order status) |
| ShipmentMethodName | string | No | Update or set the shipping method |
| TrackingUrl | string | No | Carrier tracking URL |
| TrackingNumber | string | No | Carrier tracking number |
| LabelLink | string | No | Link to the shipping label |
| ReturnLabelLink | string | No | Link to the return shipping label |
| ReturnTrackingLink | string | No | Return tracking URL |
| ReturnTrackingNumber | string | No | Return tracking number |
| ShippingMethodProductId | string | No | Shipping method product identifier |
| Comment | string | No | Replaces the comment on the shipment |
| WarehouseCode | string | No | Warehouse the shipment is sent from |
| ServicePointId | string | No | Pickup point / service point ID |
| PickUpPointInformation | [PickUpPoint](workflow.md#pickup-point-model) | No | Full pickup point details |
| Packages | List<[ShipmentPackage](workflow.md#shipment-package-model)\> | No | Package details with dimensions and tracking (max 250) |
| ExternalIds | List<OmniumExternalId> | No | Add/update external IDs on the shipment (max 250) |
| Properties | List<OmniumPropertyItem> | No | Add/update custom properties on the shipment (max 250) |

* * *

### Pickup point model

| Property | Type | Description |
| --- | --- | --- |
| ServicePointId | string | Service point identifier from the shipping provider |
| Name | string | Pickup point display name |
| Address | [PickUpPointAddress](workflow.md#pickup-point-address-model) | Pickup point address |
| OpeningHours | List<OpeningHour> | Opening hours (day, from, to) |

### Pickup point address model

| Property | Type | Description |
| --- | --- | --- |
| Street | string | Full street address |
| StreetName | string | Street name |
| StreetNumber | string | Street number |
| PostalCode | string | Postal code |
| City | string | City |
| Country | string | Country name |
| CountryCode | string | ISO country code |

* * *

### Shipment package model

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Package identifier |
| WeightInKg | double | Package weight in kilograms |
| Volume | double? | Package volume in liters |
| GoodsDescription | string | Description of package contents |
| Barcode | string | Package barcode (e.g., for goods reception) |
| Dimensions | [Dimensions](workflow.md#dimensions-model) | Package dimensions |
| ShipmentTracking | [Tracking](workflow.md#tracking-model) | Per-package tracking information |
| LineItemReferences | List<LineItemReference> | Links packages to specific line items and quantities |

### Dimensions model

| Property | Type | Description |
| --- | --- | --- |
| HeightInCm | int | Height in centimeters |
| WidthInCm | int | Width in centimeters |
| LengthInCm | int | Length in centimeters |

### Tracking model

| Property | Type | Description |
| --- | --- | --- |
| ShipmentTrackingNumber | string | Carrier tracking number |
| ShipmentTrackingLink | string | Carrier tracking URL |
| ShipmentLabelLink | string | Link to the shipping label |

* * *

### Workflow execution result model

Returned by all workflow endpoints. Contains the execution result of each workflow step and the updated order.

| Property | Type | Description |
| --- | --- | --- |
| Order | OmniumOrder | The updated order after workflow execution |
| IsAborted | bool | True if the workflow failed and was aborted |
| OrderActionExecutionResults | List<[ActionResult](workflow.md#action-result-model)\> | Results for each executed workflow step (max 250) |

### Action result model

| Property | Type | Description |
| --- | --- | --- |
| ActionType | string | Workflow step type (e.g., "CapturePayment", "Notification", "ReduceInventory", "BookShipment") |
| ActionStatus | string | "Success", "Warning", or "Error" |
| ErrorReason | string | Error description if the step failed |
| CancelWorkflow | bool | Whether this step caused the workflow to abort |
| IsInvisible | bool | Whether this step result should be hidden from end users |

**Example response:**

```json
{
  "order": {
    "id": "ORD-2024-000001",
    "status": "Completed",
    "orderForm": { }
  },
  "isAborted": false,
  "orderActionExecutionResults": [
    {
      "actionType": "CapturePayment",
      "actionStatus": "Success",
      "cancelWorkflow": false
    },
    {
      "actionType": "Notification",
      "actionStatus": "Success",
      "cancelWorkflow": false
    },
    {
      "actionType": "ReduceInventory",
      "actionStatus": "Success",
      "cancelWorkflow": false
    }
  ]
}
```

When `isAborted` is true, check the `orderActionExecutionResults` to identify which step failed and why. The order may have been partially updated depending on which steps succeeded before the failure.
