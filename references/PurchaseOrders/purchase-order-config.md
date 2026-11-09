# Configuration

Source: https://docs.omnium.no/docs/PurchaseOrders/purchase-order-config

> Learn how to configure purchase order statuses, workflows, reorder settings, deliveries, and automation in Omnium. This guide covers all purchase order configuration options for administrators and developers.

## Purchase order statuses

Purchase orders follow a configurable status workflow, similar to order types. Each status defines a step in the purchase order lifecycle, and can be configured with workflow steps that execute automatically when a purchase order enters that status.

Omnium includes a set of built-in status names that are used by default: **New**, **InProgress**, **Completed**, **OnHold**, **OrderCanceled**, and **Deleted**. You can override these or define entirely custom statuses to match your procurement workflow.

### Purchase order status model

| Property | Type | Description |
| --- | --- | --- |
| **Name** \* | string | Unique status name identifier |
| **Order** \* | int | Sort order index defining the workflow sequence |
| DisplayName | string | User-facing display name in the UI |
| TranslateKey | string | Translation key for localized display |
| IsMainFilter | bool | Show this status as a main filter option in the purchase order list |
| IsCanceledStatus | bool | Mark orders with this status as canceled |
| IsConfirmedStatus | bool | Mark orders with this status as confirmed with the supplier |
| IsCompleted | bool | Mark orders with this status as completed |
| IsReadOnly | bool | Prevent editing of purchase orders in this status |
| WorkflowSteps | [List<WorkflowStep>](purchase-order-config.md#workflow-steps) | Workflow steps to execute when entering this status |
| EnabledForTags | List<string> | Only show this status for purchase orders with these tags. If empty, the status is available for all purchase orders. |
| DisabledForTags | List<string> | Hide this status for purchase orders with these tags. Overrides EnabledForTags. |

### Workflow steps

Workflow steps on purchase order statuses follow the same model as order workflow steps.

| Property | Type | Description |
| --- | --- | --- |
| **Name** \* | string | Workflow step name |
| Connector | string | Connector to use for the workflow step. Only required for connector-based actions (e.g. exports and notifications); built-in actions do not need it. |
| Active | bool | Whether the step should run |
| RunAfterOrderIsSaved | bool | Run the step after the purchase order is saved |
| StopOnError | bool | If true, the workflow stops and does not continue when this step fails |
| TranslateKey | string | Translation key for the workflow step name |
| IsInvisible | bool | Hide the result from the UI |

### Available workflow actions

These are the built-in workflow actions available for purchase order statuses:

| Action | Group | Description |
| --- | --- | --- |
| Notification | Notifications | Send notifications when a purchase order enters a status |
| ReleaseSuggestions | Inventory | Release reorder suggestions associated with the purchase order |
| ExportPurchaseOrder | Export | Export the purchase order to all configured purchase order export connectors |
| SetExpectedDeliveryDate | Enrich | Set the expected delivery date based on supplier settings or default values |
| RecalculateAtpValues | Enrich | Recalculate Available-to-Promise (ATP) values for inventories included in the purchase order |
| ExportDeliveries | Export | Export deliveries connected to the purchase order to configured delivery export connectors |
| ValidateOnErrors | Validation | Check the purchase order for errors. If errors are found, the workflow stops and does not proceed further. |
| CreateOrderFromPurchaseOrder | Modify | Create an order from the purchase order, using the supplier as the store. Only works if the supplier is configured as a store in Omnium. Requires `OrderType` and `MarketId` properties. |
| AddSupplierTagsToOrders | Export | Copy all tags from the supplier to the purchase order |
| EnrichLineItemsWithComponents | Enrich | Automatically enrich line items with product components by matching SKUs |

### Sample

```
"PurchaseOrderSettings": {
  "PurchaseOrderStatuses": [
    {
      "Name": "New",
      "DisplayName": "New",
      "Order": 1,
      "IsMainFilter": true,
      "WorkflowSteps": [
        {
          "Name": "ValidateOnErrors",
          "Active": true
        }
      ]
    },
    {
      "Name": "Confirmed",
      "DisplayName": "Confirmed",
      "Order": 2,
      "IsMainFilter": true,
      "IsConfirmedStatus": true,
      "WorkflowSteps": [
        {
          "Name": "ExportPurchaseOrder",
          "Active": true
        },
        {
          "Name": "SetExpectedDeliveryDate",
          "Active": true
        }
      ]
    },
    {
      "Name": "InProgress",
      "DisplayName": "In Progress",
      "Order": 3,
      "IsMainFilter": true,
      "WorkflowSteps": []
    },
    {
      "Name": "Completed",
      "DisplayName": "Completed",
      "Order": 4,
      "IsMainFilter": true,
      "IsCompleted": true,
      "IsReadOnly": true,
      "WorkflowSteps": [
        {
          "Name": "RecalculateAtpValues",
          "Active": true
        }
      ]
    },
    {
      "Name": "OrderCanceled",
      "DisplayName": "Canceled",
      "Order": 5,
      "IsCanceledStatus": true,
      "IsReadOnly": true,
      "WorkflowSteps": []
    }
  ]
}
```

* * *

## General settings

These settings control calculations used for reorder planning and inventory cost analysis.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| StorageCostPercent | decimal | 0 | Storage cost as a percentage of inventory value. Used in inventory carrying cost calculations for reorder planning. |
| AverageDailyUsageDays | int | 0 | Number of historical days to use when calculating average daily usage (ADU) for products. A higher value provides a more stable average but is less responsive to recent demand changes. |
| LeadTimeSafetyMarginDays | int | 0 | Additional safety margin in days added to the supplier lead time. Accounts for variability in delivery times to reduce stockout risk. |
| DefaultAverageLeadTimeDays | int | 0 | Default lead time in days for suppliers that do not have a specific lead time configured. Used when calculating reorder points and expected delivery dates. |

### Sample

```
"PurchaseOrderSettings": {
  "StorageCostPercent": 12.5,
  "AverageDailyUsageDays": 90,
  "LeadTimeSafetyMarginDays": 3,
  "DefaultAverageLeadTimeDays": 14
}
```

* * *

## Reorder suggestions

These settings control how reorder suggestions are generated and filtered.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ReorderSuggestionsMinQuantityRoundUp | bool | false | When enabled, suggested reorder quantities are rounded up to the nearest minimum order quantity defined on the product or supplier. |
| ReorderSuggestionsUseInStockSales | bool | false | When enabled, reorder suggestions are calculated from the sales per day the item was in stock instead of the average over all days of the sales period, so days the item was sold out do not lower the suggestion. Used only for items in stock for at least `ReorderSuggestionsMinDaysInStock` days; others keep the average. When off, the time in stock is shown but does not change the suggestion. See [time in stock](../configuration/scheduled-tasks/analytics/analytics-reorder-suggestions.md#time-in-stock). |
| ReorderSuggestionsMinDaysInStock | int | 0 | Days in stock the sales period must have before the in-stock rate is used. 0 means 14 days. |
| ReorderSuggestionDraftStatus | string | null | The status the reorder suggestion pages keep their draft purchase orders in. Accept adds a suggestion to the supplier's newest order in this status for the store (one that is not read only and not maintained by the draft purchase orders task), or creates one in this status. The quantity on a row changes the order line while the order stays in this status, and Send to supplier moves the order to the next status. Empty means `New`. Tenants running the [draft purchase orders task](../configuration/scheduled-tasks/orders/create-draft-purchase-orders.md) should set the same status here and on the task. See [draft purchase orders](../configuration/scheduled-tasks/analytics/analytics-reorder-suggestions.md#draft-purchase-orders). |
| NonPurchasableAssortmentCodes | List<string> | null | Assortment codes that should be excluded from reorder suggestions. Products with any of these assortment codes will not appear in purchase order suggestions. Assortment codes are defined in product settings. |
| SetEstimatedTimeOfArrivalFromPurchaseOrder | bool | false | When enabled, purchase order lines that have no `EstimatedTimeOfArrival` of their own fall back to the purchase order's `RequestedDeliveryDate` when Available-to-Promise (ATP) is calculated, so lines added after the delivery date was set (for example by a supplier or ERP integration) are still included as incoming stock in ATP. |

### Sample

```
"PurchaseOrderSettings": {
  "ReorderSuggestionsMinQuantityRoundUp": true,
  "ReorderSuggestionsUseInStockSales": true,
  "ReorderSuggestionsMinDaysInStock": 14,
  "ReorderSuggestionDraftStatus": "New",
  "SetEstimatedTimeOfArrivalFromPurchaseOrder": true,
  "NonPurchasableAssortmentCodes": [
    "DISCONTINUED",
    "SEASONAL-ONLY",
    "CONSIGNMENT"
  ]
}
```

* * *

## Internal transfers

These settings control automatic creation of internal transfer orders for pickup warehouses (e.g., stores that receive stock from a central warehouse).

This is intended for pickup-in-store and ship-from-store scenarios where incoming stock is received at a central warehouse, but the customer collects (or has the order shipped) from a different location. It applies to backordered goods that must first arrive centrally and then be transported to the customer's location. Instead of releasing a reservation as soon as goods arrive centrally, Omnium keeps the order reserved while the stock is moved to the pickup location the customer chose.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| CreateInternalTransfersForPickUpWarehouses | bool | false | When enabled, internal transfer orders are automatically created for warehouses configured as pickup locations. This is used when a central warehouse distributes stock to store locations. |
| CreateInternalTransfersForPickUpWarehousesStatus | string | null | The status to assign to automatically created internal transfer orders. If not set, transfers are created with the default initial status. |

### How it works

When goods are received against a purchase order, Omnium normally adds the received stock to the receiving warehouse and immediately releases any sales order reservations that were waiting for that purchase order, making those orders ready to ship from the receiving warehouse.

When `CreateInternalTransfersForPickUpWarehouses` is enabled, this behavior changes for sales orders whose shipment is assigned to a pickup warehouse that differs from the receiving warehouse:

*   **Internal transfers are generated automatically.** For each affected purchase order, Omnium creates one internal transfer per destination pickup warehouse, moving the received quantities from the receiving warehouse to the pickup warehouse where the customer will collect their order. Transfer lines are grouped per product and quantities are summed across the linked sales orders.
*   **Reservations are held in transit instead of released.** Sales order lines tied to a pickup warehouse are kept in their "awaiting purchase order" state rather than being marked ready. The reservation is only resolved once the stock reaches the pickup location, so the order is not flagged as fulfillable while goods are still moving between warehouses.
*   **Other reservations behave normally.** Order lines that do not target a separate pickup warehouse have their reservations released as usual, up to the quantity actually received (allocated on a first-come, first-served basis by order creation date).

### Status of created transfers

By default, the generated internal transfers are created with the standard initial purchase order status. Set `CreateInternalTransfersForPickUpWarehousesStatus` to automatically move each new transfer to a specific status after creation — for example, to confirm them immediately so they enter your fulfillment flow without manual intervention. When a status is configured, the transfer runs through the workflow steps defined for that status, just like a manual status change.

### Sample

```
"PurchaseOrderSettings": {
  "CreateInternalTransfersForPickUpWarehouses": true,
  "CreateInternalTransfersForPickUpWarehousesStatus": "New"
}
```

* * *

## Delivery settings

These settings control how deliveries (goods reception) are handled on purchase orders.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| GoodsReceptionCompletedStatus | string | null | The purchase order status to set when goods reception is completed (all expected items have been received). If not configured, the status is not automatically changed on completion. |
| IncludePackagesInPurchaseOrders | bool | false | When enabled, package information (bundled products and their components) is included in purchase order data. Enable this if your purchase orders need to track product packaging details. |
| OrderTypesWithAutomaticLineSplitting | List<string> | null | List of order types where order lines are automatically split when customer reservations exceed the available quantity on a delivery. For example, if a delivery has 10 units but 15 are reserved across orders, the order line with excess reservations is split so the available units can be allocated. |

### Sample

```
"PurchaseOrderSettings": {
  "GoodsReceptionCompletedStatus": "Completed",
  "IncludePackagesInPurchaseOrders": false,
  "OrderTypesWithAutomaticLineSplitting": ["Online", "ClickAndCollect"]
}
```

* * *

## ETA-based order status updates

When a purchase order's estimated delivery date changes, Omnium can automatically update the status of sales orders that are waiting for stock from that purchase order. This is useful for keeping customers informed about delivery timeline changes.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| UpdateOrderStatusWhenEstimatedDeliveryDateChanged | bool | false | Enable automatic order status updates when the estimated delivery date changes on a purchase order. When enabled, the two properties below become active. |
| UpdateToStatus | string | null | The order status to set on affected sales orders when the estimated delivery date changes. Only applies when `UpdateOrderStatusWhenEstimatedDeliveryDateChanged` is enabled. |
| DisabledForStatuses | List<string> | null | Order statuses that should be excluded from automatic status updates. Orders in any of these statuses will not be updated even if the estimated delivery date changes. Only applies when `UpdateOrderStatusWhenEstimatedDeliveryDateChanged` is enabled. |

The `UpdateToStatus` and `DisabledForStatuses` settings reference order statuses from your order type configuration, not purchase order statuses.

### Sample

```
"PurchaseOrderSettings": {
  "UpdateOrderStatusWhenEstimatedDeliveryDateChanged": true,
  "UpdateToStatus": "AwaitingDeliveryUpdate",
  "DisabledForStatuses": ["Completed", "Shipped", "Canceled"]
}
```

* * *

## Display and printing

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ShowCustomerReservationsOnPurchaseOrderPrint | bool | false | When enabled, customer reservations linked to purchase order line items are included on the printed purchase order document. Useful for suppliers who need to know which customers are waiting for specific items. |

### Sample

```
"PurchaseOrderSettings": {
  "ShowCustomerReservationsOnPurchaseOrderPrint": true
}
```

* * *

## Properties and tags

### Default properties

Default properties are automatically available on purchase orders. They provide structured fields for capturing additional data specific to your procurement process.

| Property | Type | Description |
| --- | --- | --- |
| Key | string | Property identifier |
| Value | string | Default value |
| ValueType | string | Data type (String, Number, Boolean, Date) |
| KeyGroup | string | Grouping category for organizing properties in the UI |
| ValueOptions | List<string> | Available options for dropdown selection |
| IsCustomValueOptionAllowed | bool | Allow free-text values in addition to predefined options |
| IsMultiSelectEnabled | bool | Allow selecting multiple values from options |
| ReadOnly | bool | Make the property read-only after creation |

### Highlighted properties

Configure which property keys should be displayed prominently on the purchase order detail page. Properties listed here are shown in a highlighted section for quick reference.

```
"PurchaseOrderSettings": {
  "HighlightedProperties": [
    "Priority",
    "BuyerName",
    "PaymentTerms"
  ]
}
```

### Tags

Tags allow you to categorize and filter purchase orders. Tags can also be used to control which statuses are available for a purchase order (via `EnabledForTags` and `DisabledForTags` on statuses).

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Tag identifier |
| TranslationKey | string | Translation key for the tag label in the UI |

### Sample

```
"PurchaseOrderSettings": {
  "DefaultProperties": [
    {
      "Key": "Priority",
      "Value": "Normal",
      "ValueType": "String",
      "ValueOptions": ["Low", "Normal", "High", "Urgent"],
      "IsCustomValueOptionAllowed": false
    },
    {
      "Key": "PaymentTerms",
      "Value": "",
      "ValueType": "String",
      "ReadOnly": false
    }
  ],
  "HighlightedProperties": ["Priority", "PaymentTerms"],
  "TagSettings": [
    { "Name": "Domestic", "TranslationKey": "Tag_Domestic" },
    { "Name": "Import", "TranslationKey": "Tag_Import" },
    { "Name": "Urgent", "TranslationKey": "Tag_Urgent" },
    { "Name": "Dropship", "TranslationKey": "Tag_Dropship" }
  ]
}
```

* * *

## Complete configuration example

Below is a comprehensive example showing all purchase order settings configured together:

```json
{
  "PurchaseOrderSettings": {
    "PurchaseOrderStatuses": [
      {
        "Name": "New",
        "DisplayName": "New",
        "Order": 1,
        "IsMainFilter": true,
        "WorkflowSteps": [
          { "Name": "ValidateOnErrors", "Active": true }
        ]
      },
      {
        "Name": "Confirmed",
        "DisplayName": "Confirmed",
        "Order": 2,
        "IsMainFilter": true,
        "IsConfirmedStatus": true,
        "WorkflowSteps": [
          { "Name": "ExportPurchaseOrder", "Active": true },
          { "Name": "SetExpectedDeliveryDate", "Active": true }
        ]
      },
      {
        "Name": "InProgress",
        "DisplayName": "In Progress",
        "Order": 3,
        "IsMainFilter": true,
        "WorkflowSteps": []
      },
      {
        "Name": "Completed",
        "DisplayName": "Completed",
        "Order": 4,
        "IsMainFilter": true,
        "IsCompleted": true,
        "IsReadOnly": true,
        "WorkflowSteps": [
          { "Name": "RecalculateAtpValues", "Active": true }
        ]
      },
      {
        "Name": "OrderCanceled",
        "DisplayName": "Canceled",
        "Order": 5,
        "IsCanceledStatus": true,
        "IsReadOnly": true,
        "WorkflowSteps": []
      }
    ],

    "StorageCostPercent": 12.5,
    "AverageDailyUsageDays": 90,
    "LeadTimeSafetyMarginDays": 3,
    "DefaultAverageLeadTimeDays": 14,

    "ReorderSuggestionsMinQuantityRoundUp": true,
    "ReorderSuggestionsUseInStockSales": true,
    "ReorderSuggestionsMinDaysInStock": 14,
    "ReorderSuggestionDraftStatus": "New",
    "SetEstimatedTimeOfArrivalFromPurchaseOrder": true,
    "NonPurchasableAssortmentCodes": ["DISCONTINUED", "CONSIGNMENT"],

    "CreateInternalTransfersForPickUpWarehouses": true,
    "CreateInternalTransfersForPickUpWarehousesStatus": "New",

    "GoodsReceptionCompletedStatus": "Completed",
    "IncludePackagesInPurchaseOrders": false,
    "OrderTypesWithAutomaticLineSplitting": ["Online", "ClickAndCollect"],

    "UpdateOrderStatusWhenEstimatedDeliveryDateChanged": true,
    "UpdateToStatus": "AwaitingDeliveryUpdate",
    "DisabledForStatuses": ["Completed", "Shipped"],

    "ShowCustomerReservationsOnPurchaseOrderPrint": true,

    "DefaultProperties": [
      {
        "Key": "Priority",
        "Value": "Normal",
        "ValueType": "String",
        "ValueOptions": ["Low", "Normal", "High", "Urgent"]
      }
    ],
    "HighlightedProperties": ["Priority"],

    "TagSettings": [
      { "Name": "Domestic", "TranslationKey": "Tag_Domestic" },
      { "Name": "Import", "TranslationKey": "Tag_Import" },
      { "Name": "Urgent", "TranslationKey": "Tag_Urgent" }
    ]
  }
}
```
