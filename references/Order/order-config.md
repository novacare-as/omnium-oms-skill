# Configuration

Source: https://docs.omnium.no/docs/Order/order-config

> Learn how to configure order types, workflows, order settings, returns, and automation in Omnium. This guide covers all order-related configuration options for administrators and developers.

## Order types

The order workflow is built around order types. An order type will be configured with order statuses, each with a set of workflow steps.

An order type could, for instance, be:

*   Online
*   Click And Collect
*   POS Order
*   Subscription order
*   Edge case order

The purpose of separating orders into different order types is to enable multiple workflows. An online order might have three statuses (New, In progress, Sent). Click and Collect orders could have four statuses (New, In progress, Ready for pickup, Picked up). A POS order might only have one status (Completed). There are no limits in Omnium regarding the number of order types, number of statuses, and number of workflow steps.

### Order type model

| Property | Type | Description |
| --- | --- | --- |
| **Name** \* | string | Order type name (E.g. Online, ClickAndCollect, Pos, etc) |
| **OrderStatuses** \* | [List<OrderStatus>](order-config.md#order-statuses) | List of available order statuses |
| EnableEdit | bool | Is order editable in GUI |
| EnableCreateFromCart | bool | True if it is possible to create order type from cart |
| DisableWorkflow | bool | Temporarily disable workflow for order type |
| DefaultOrderType | bool | True if the order is the default. Autofilter by default types in the order list. |
| DefaultExternalIdProvider | string | External ID provider (Added to list of external IDs) |
| OrderNumberType | string | `Key` of the number option used to generate order numbers for this order type. Falls back to the tenant/market `OrderNumberOptions` when not set. See [order number generation](order-config.md#order-number-generation). |
| DeriveOrderStatusFromShipments | bool | When true, the order status follows the shipment statuses. The order gets the main status (`IsMainFilter`) of the least advanced shipment's sort order level. |
| SplitCancelledOrderlinesToStatus | string | When cancelling order lines the cancelled orderlines will automatically be splitted into a new shipment with the specified status. This is typically used for reallocating logic. |

### Order number generation

Each order type can draw its order numbers from its own number series. Set `OrderNumberType` on the order type to the `Key` of the [number option](../configuration/numberoptions.md) that should be used. Order types without `OrderNumberType` use the number option registered for the `OrderNumberOptions` number type.

In the Omnium UI, the series is selected in the **Number options** field when editing the order type in **Configuration → Order Types**. The list contains the number options configured on the tenant and on its markets.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FnumberOptions.c66cdb02.png&w=3840&q=75)

`OrderNumberType` refers to the `Key` of a number option, not to its `NumberType`. If no number option matches the key, the value is looked up as a number type instead, so existing configurations that reference `OrderNumberOptions` keep working.

The number is generated when an order is created without an order number - through the order API, from a cart, from a workflow step that creates an order, or by an integration that imports orders. Return orders use the number series of the return order type. When `IsOrderNumbersUsedAsCartNumber` is enabled in [cart settings](../Carts/cart-config.md), cart numbers are also drawn from the order type's series.

#### Resolution order

Given the key on the order type and the market of the order, the number option is resolved in this order:

1.  Number option on the order's market with a matching `Key`
2.  Tenant number option with a matching `Key` and a `MarketGroupId` matching the market's market group
3.  Tenant number option with a matching `Key` and no `MarketGroupId`
4.  Any tenant number option with a matching `Key`
5.  Number option matching the value as a `NumberType` (backwards compatibility)

The first match is used.

#### Sample

Two order types, each with its own number series:

```json
{
  "NumberOptions": [
    {
      "NumberType": "OrderNumberOptions",
      "Key": "online-order-counter",
      "Prefix": "WEB-",
      "StartSequence": 10000,
      "Service": "SequentialNumberService"
    },
    {
      "NumberType": "OrderNumberOptions",
      "Key": "pos-order-counter",
      "Prefix": "POS-",
      "StartSequence": 500000,
      "Service": "SequentialMarketNumberService"
    }
  ],
  "OrderTypes": [
    {
      "Name": "Online",
      "OrderNumberType": "online-order-counter",
      "OrderStatuses": []
    },
    {
      "Name": "Pos",
      "OrderNumberType": "pos-order-counter",
      "OrderStatuses": []
    }
  ]
}
```

Online orders get WEB-10000, WEB-10001, and so on, while POS orders get POS-500000, POS-500001 per market.

### Order statuses

In the order processing, the order will go through the configured order statuses. Each status will trigger a workflow of each workflow step for the order status. The workflow execution will result in a list of execution results. Read more about order workflow.

#### Order status model

| Property | Type | Description |
| --- | --- | --- |
| **Name** \* | string | Order status name |
| **Order** \* | int | Status sort order index |
| **WorkflowSteps** \* | [List<WorkflowStep>](order-config.md#workflow-steps) | Workflow steps to run |
| DisplayName | string | Alternative order status name |
| IsMainFilter | bool | Is main filter |
| Condition | string | Condition for showing order status (if more statuses have the same sort order) |
| IsCanceledStatus | bool | True if orders with this status are canceled |
| IsDeliveredStatus | bool | True if orders with this status are delivered to the customer |
| IsExcludedFromReservedInventory | bool | True if orders with this status do not reserve inventory in Omnium, for example because the ERP has already reserved the items. Recalculation of [reserved inventory](workflow-steps/inventory/recalculate-reserved-inventory.md) leaves these orders out, as it does orders in delivered and canceled statuses |
| IsInProgressStatus | bool | True if orders with this status are in progress |
| IsPicked | bool | True if orders with this status are picked. Used by picklist to set the correct status when the order is ready to ship/pick up |
| ShipmentStatusUpdate | string | If set, the shipments on order will get this status |
| AvailableSteps | List<string> | List of available next order statuses |
| TranslateKey | string | Translation key for order status |
| Properties | [List<PropertyItem>](https://docs.omnium.no/api/generic#properties) | Custom properties |

### Workflow steps

| Property | Type | Description |
| --- | --- | --- |
| **Name** \* | string | Workflow step name |
| **Connector** \* | string | Connector to use for workflow step |
| Active | bool | True if step should be run |
| RunAfterOrderIsSaved | bool | True if step should run after order is saved |
| StopOnError | bool | If true, the workflow will not continue if the current step fails to execute |
| TranslateKey | string | Translation key for workflow step name |
| IsInvisible | bool | True if result should not be shown in GUI |
| EnabledForMarkets | List<string> | List of markets where this workflow step should be enabled (all markets available if empty) |
| DisabledForMarkets | List<string> | List of market IDs where the workflow step should be disabled (overrides enabled property) |

### Samples

#### Simple order type: PoS-order

In the example below, a point of sale order can be added from physical stores. The status is completed upon registration, and no action is taken by Omnium.

```
"OrderTypes": [
  {
    "Name": "Pos",
    "EnableEdit": false,
    "EnableCreateFromCart": false,
    "OrderStatuses": [
      {
        "Name": "Completed",
        "DisplayName": "Completed",
        "TranslateKey": "PickedUp",
        "IsMainFilter": true,
        "Order": 1,
        "WorkflowSteps": []
      }
    ]
  }
]
```

#### Online order with workflow steps

In the example below, an order type with the name "Online" is defined. It has two order statuses, "New" and "Completed":

```
"OrderTypes": [
  {
    "Name": "Online",
    "EnableEdit": true,
    "EnableCreateFromCart": true,
    "OrderStatuses": [
      {
        "Name": "New",
        "DisplayName": "New",
        "IsMainFilter": true,
        "Order": 1,
        "WorkflowSteps": [
          {
            "Name": "Notification",
            "Active": true,
            "TranslateKey": "WorkflowStep_Notification"
          },
          {
            "Name": "GetOrCreateCustomerFromOrder",
            "Active": true
          }
        ]
      },
      {
        "Name": "Completed",
        "DisplayName": "Completed",
        "TranslateKey": "PickedUp",
        "IsMainFilter": true,
        "Order": 4,
        "Condition": "Pickup",
        "IsCanceledStatus": false,
        "WorkflowSteps": []
      }
    ]
  }
]
```

* * *

## Order settings

Order settings control the general behavior of order processing, display options, and data synchronization between orders and customers.

### Data enrichment

These settings control how data flows between orders and customer records.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ShouldOrderStoreIdBeSavedOnCustomer | bool | false | When enabled, the store ID from an order will be saved to the customer record. Useful for tracking which store a customer primarily shops at. |
| ShouldOrderMarketIdBeSavedOnCustomer | bool | false | When enabled, the market ID from an order will be saved to the customer record. Helps maintain market association for customers. |
| ShouldOrderExternalIdsBeSavedOnCustomer | bool | false | When enabled, external IDs from the order (e.g., from external systems) will be copied to the customer record. |
| ShouldCustomerExternalIdsBeSavedOnOrder | bool | false | When enabled, external IDs from the customer record will be copied to new orders. Useful when orders need to reference customer identifiers from external systems. |
| ShouldOrderPropertiesBeSavedOnCustomer | bool | false | When enabled, custom properties from orders will be saved to the customer record. |
| ShouldCustomerPropertiesBeSavedOnOrder | bool | false | When enabled, custom properties from the customer record will be copied to new orders. |

#### Sample

```
"OrderSettings": {
  "ShouldOrderStoreIdBeSavedOnCustomer": true,
  "ShouldOrderMarketIdBeSavedOnCustomer": true,
  "ShouldCustomerExternalIdsBeSavedOnOrder": true
}
```

### Display options

These settings control how order information is displayed in the Omnium user interface.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ShowOrderTotalsExTax | bool | false | Display order totals excluding tax in the UI. When enabled, total amounts shown will be net values. |
| ShowOrderLinesExTax | bool | false | Display order line prices excluding tax. Affects how individual line items are shown in the order view. |
| IsInvoiceOriginal | bool | false | Mark printed invoices as "Original". When enabled, invoices will display an "Original" watermark or label. |
| HideShipmentLinesOnOrderList | bool | false | Hide shipment line details in the order list view. Useful for cleaner order lists when shipment details are not needed at a glance. |
| UneditableExternalIDs | bool | false | Make external IDs read-only in the UI. When enabled, users cannot modify external IDs on orders. |
| IsLockShipmentsOnPickList | bool | false | Lock shipments from editing when they are part of a pick list. Prevents modifications to shipments that are being processed. |
| IsAlternativeNameHiddenOnReceipts | bool | false | Hide alternative product names on receipts and printed documents. |
| IsTagsHiddenOnReceipts | bool | false | Hide order tags on receipts and printed documents. |

#### Sample

```
"OrderSettings": {
  "ShowOrderTotalsExTax": true,
  "ShowOrderLinesExTax": true,
  "IsInvoiceOriginal": true,
  "UneditableExternalIDs": true
}
```

### Rounding and discounts

These settings control how amounts are rounded and how discounts are calculated on orders.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsDiscountAmountRoundingDisabled | bool | false | When enabled, discount amounts will not be rounded. Use this when you need precise discount calculations without rounding. |
| IsLineItemAmountRoundingDisabled | bool | false | When enabled, prices on individual line items will not be rounded. Affects how unit prices and extended prices are calculated. |
| IsDiscountPercentageLockedByDefault | bool | false | When enabled, the discount percentage field will be locked by default when editing order lines. Users must explicitly unlock to change discounts. This helps prevent accidental discount modifications. |
| IsCreditAmountSubtractedFromRemainingPayment | bool | false | Controls how remaining payment is calculated. When enabled, remaining payment = (Authorized - Credited) - NetTotal. When disabled, remaining payment = Authorized - Total. Enable this when credit amounts should reduce what's owed. |

#### Sample

```
"OrderSettings": {
  "IsDiscountAmountRoundingDisabled": false,
  "IsLineItemAmountRoundingDisabled": false,
  "IsDiscountPercentageLockedByDefault": true,
  "IsCreditAmountSubtractedFromRemainingPayment": true
}
```

### Default values

These settings define default values used when creating or processing orders.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DefaultCurrencyCode | string | null | The default currency code for orders (e.g., "NOK", "SEK", "EUR"). Used when no currency is specified. |
| DefaultOrigin | string | null | The default origin value set on returns, orders, and carts created in Omnium. Helps track where orders originated. |
| DefaultOmsCartOrigin | string | null | The origin value set specifically on carts created from within Omnium's UI. Distinguishes carts created by staff from those created via API or webshop. |
| DefaultExchangeTerms | string | null | Default exchange/return terms text. Displayed to customers and staff when processing exchanges. |
| DefaultReplacementOrderType | string | null | The order type assigned to replacement orders. If not set, replacement orders inherit the type from the original order. |
| DefaultQuickProcessOrderStatus | string | null | The status to set when using the "Quick Process" feature on orders. Allows one-click advancement to a specific status. |
| DeleteOrdersThreshold | int | null | Number of days after which old orders are deleted (when the cleanup scheduled task is running). Must be 2 years (730 days) or higher for GDPR compliance. |

#### Sample

```
"OrderSettings": {
  "DefaultCurrencyCode": "NOK",
  "DefaultOrigin": "Omnium",
  "DefaultOmsCartOrigin": "OmniumUI",
  "DefaultExchangeTerms": "Items can be exchanged within 30 days with original receipt.",
  "DefaultReplacementOrderType": "Replacement",
  "DefaultQuickProcessOrderStatus": "Completed",
  "DeleteOrdersThreshold": 1095
}
```

### Validation

These settings control order validation behavior.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsOrderValidationEnabled | bool | false | Enable order validation on update events. When enabled, orders are validated against configured rules when they are modified. Requires a webhook order validator to be configured. |
| IsOrderValidationOnOpenEnabled | bool | false | Run order validation when an order is opened in the UI. Only applies when IsOrderValidationEnabled is true. Provides immediate feedback on order issues. |

Order validation requires a webhook validator connector to be configured. See the [Order API documentation](order-api.md#validate-order) for setup instructions.

#### Sample

```
"OrderSettings": {
  "IsOrderValidationEnabled": true,
  "IsOrderValidationOnOpenEnabled": true
}
```

### Statistics and logging

These settings control order statistics collection and logging behavior.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| UseStatsOrderQueues | bool | false | When enabled, orders are copied to dedicated statistics queues for analytics processing. Enable this for advanced reporting and analytics scenarios. |
| ShippingProfitPercent | decimal | null | The profit percentage from shipping subtotals. Used for calculating shipping profit in statistics and reports. For example, set to 15 if your shipping profit margin is 15%. |
| UseVerboseLogging | bool | false | Enable detailed logging for order operations. Use for troubleshooting but disable in production for performance. |
| IncludedOrderTypesForRevenueStats | List<string> | \["Pos", "Online"\] | Order types included in key numbers, average order values, and revenue statistics. If not set, defaults to "Pos" and "Online". |
| IncludedOrderStatusesForRevenueStats | List<string> | null | Order statuses included in revenue statistics. When set, only orders in these statuses are counted in revenue reports. |
| UseOrderStatusLog | bool | false | Enable logging of order status changes on shipments. See [Order Status Log](order-logging/order-status-log.md) for details. |

#### Sample

```
"OrderSettings": {
  "UseStatsOrderQueues": true,
  "ShippingProfitPercent": 15.0,
  "IncludedOrderTypesForRevenueStats": ["Online", "ClickAndCollect"],
  "IncludedOrderStatusesForRevenueStats": ["Completed", "Delivered"],
  "UseOrderStatusLog": true
}
```

### Order Status Log

When `UseOrderStatusLog` is enabled, Omnium automatically tracks all order status transitions on each shipment with timestamps and duration between changes. This data enables fulfillment performance analysis and bottleneck identification.

For full details including the data model, API response format, and use cases, see [Order Logging - Order Status Log](order-logging/order-status-log.md).

### Comments

These settings control order comment behavior.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsNotificationRequirementDisabledForComments | bool | false | When enabled, comments can be saved without selecting a notification method (SMS/email). Disables the requirement to choose how the customer should be notified about comments. |
| IsUseSalespersonAsSender | bool | false | When enabled, public order comments use the order's salesperson as the sender (if available) instead of the system default. |
| CommentTemplates | List<CommentTemplate> | \[\] | Predefined comment templates that can be selected when adding comments to orders. See [Comment templates](order-config.md#comment-templates) section. |

#### Comment templates

Comment templates allow you to define reusable comment texts.

| Property | Type | Description |
| --- | --- | --- |
| TemplateName | string | Display name for the template |
| Properties | List<PropertyItem> | Template content and configuration |

#### Sample

```
"OrderSettings": {
  "IsNotificationRequirementDisabledForComments": true,
  "IsUseSalespersonAsSender": true,
  "CommentTemplates": [
    {
      "TemplateName": "OrderShipped",
      "Properties": [
        { "Name": "Subject", "Value": "Your order has shipped" },
        { "Name": "Body", "Value": "Your order is on its way and will arrive within 2-3 business days." }
      ]
    },
    {
      "TemplateName": "OrderDelayed",
      "Properties": [
        { "Name": "Subject", "Value": "Update on your order" },
        { "Name": "Body", "Value": "We're sorry, but your order has been delayed. We expect it to ship within 5 business days." }
      ]
    }
  ]
}
```

### Cancellations

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| CancelOrderIfAllLineItemsCancelled | bool | false | Automatically cancel the entire order when all line items are cancelled. When enabled, cancelling the last line item will trigger order cancellation. |
| CancellationTypes | List<TranslationKeys> | \[\] | List of available cancellation reasons. Provides a standardized list of reasons for order cancellations. |

#### Sample

```
"OrderSettings": {
  "CancelOrderIfAllLineItemsCancelled": true,
  "CancellationTypes": [
    { "Id": "CustomerRequest", "TranslationKey": "Cancellation_CustomerRequest" },
    { "Id": "OutOfStock", "TranslationKey": "Cancellation_OutOfStock" },
    { "Id": "PaymentFailed", "TranslationKey": "Cancellation_PaymentFailed" },
    { "Id": "FraudSuspected", "TranslationKey": "Cancellation_FraudSuspected" }
  ]
}
```

### Manual workflow steps

You can configure workflow steps that can be manually triggered by users on any order, regardless of the order's current status.

| Property | Type | Description |
| --- | --- | --- |
| AvailableManualWorkflowSteps | List<WorkflowStep> | List of workflow steps that can be manually executed on orders |

#### Sample

```
"OrderSettings": {
  "AvailableManualWorkflowSteps": [
    {
      "Name": "ResendConfirmation",
      "Active": true,
      "TranslateKey": "WorkflowStep_ResendConfirmation"
    },
    {
      "Name": "SyncToERP",
      "Active": true,
      "TranslateKey": "WorkflowStep_SyncToERP"
    }
  ]
}
```

* * *

## Gift cards

These settings configure gift card creation and management within orders.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| GiftCardSku | string | null | The SKU used to identify gift card products in the catalog. Orders containing this SKU will trigger gift card creation. |
| GiftCardCompletedStatus | string | null | The order status at which gift cards are activated. Gift cards are created but not usable until the order reaches this status. |
| GiftCardValidMonths | int | null | Number of months a gift card is valid from the purchase date. After this period, the gift card expires and can no longer be redeemed. |
| GiftCardTemplate | string | null | HTML template for gift card emails/PDFs. Supports placeholders for gift card code, amount, and expiry date. |

#### Sample

```
"OrderSettings": {
  "GiftCardSku": "GIFTCARD",
  "GiftCardCompletedStatus": "Completed",
  "GiftCardValidMonths": 12,
  "GiftCardTemplate": "<html><body><h1>Gift Card</h1><p>Code: {{Code}}</p><p>Amount: {{Amount}}</p><p>Valid until: {{ExpiryDate}}</p></body></html>"
}
```

* * *

## Order line settings

These settings control behavior specific to individual order lines.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DefaultProperties | List<PropertyItem> | \[\] | Default properties automatically added to new order lines. Useful for tracking additional data on each line item. |
| SplitMultibuyPromotionOrderLines | bool | false | When enabled, order lines with multi-buy promotions are split into separate lines. For example, a "Buy 2 Get 1 Free" promotion would create 3 separate lines instead of one line with quantity 3. |
| EnrichDefaultPropertiesFromProduct | bool | false | When enabled, default properties are enriched from the product data. |
| PropertiesToEnrichOrderLineFromProduct | List<string> | \[\] | List of property names to copy from the product to the order line. Useful for capturing product attributes at the time of order. |
| PropertiesToExcludeFromConfigurableProduct | List<string> | \[\] | Properties to exclude when creating a configurable product from an existing product. These properties are nulled out on the new configurable product. |
| PropertiesToEnrichOrderLineFromPriceList | List<string> | \[\] | Properties to copy from the price list entry to the order line. Only used for configurable products. |
| IsCancelCommentRequired | bool | false | When enabled, a comment is required when cancelling order lines. |

### Modified reasons

Define the available reasons for modifying order lines (e.g., changing quantity or price).

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Unique identifier for the reason |
| TranslationKey | string | Translation key for displaying the reason in the UI |

### Order line cancellation types

Define the available reasons for cancelling order lines.

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Unique identifier for the cancellation type |
| TranslationKey | string | Translation key for displaying the type in the UI |

#### Sample

```
"OrderSettings": {
  "OrderLineSettings": {
    "DefaultProperties": [
      { "Name": "WarehouseLocation", "Value": "" }
    ],
    "SplitMultibuyPromotionOrderLines": true,
    "PropertiesToEnrichOrderLineFromProduct": [
      "Brand",
      "SupplierSku",
      "CountryOfOrigin"
    ],
    "ModifiedReasons": [
      { "Id": "PriceMatch", "TranslationKey": "ModifiedReason_PriceMatch" },
      { "Id": "Damaged", "TranslationKey": "ModifiedReason_Damaged" },
      { "Id": "CustomerRequest", "TranslationKey": "ModifiedReason_CustomerRequest" }
    ],
    "CancellationTypes": [
      { "Id": "OutOfStock", "TranslationKey": "LineCancellation_OutOfStock" },
      { "Id": "CustomerCancelled", "TranslationKey": "LineCancellation_CustomerCancelled" },
      { "Id": "DamagedInWarehouse", "TranslationKey": "LineCancellation_Damaged" }
    ]
  }
}
```

* * *

## Return settings

These settings configure how returns are handled in Omnium.

### General settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DefaultUpdateStock | bool | false | Default value for the "Update Stock" checkbox when creating returns. When enabled, returned items are automatically added back to inventory. |
| HideCreateClaim | bool | false | Hide the "Create Claim" option in the return dialog. Use when claims functionality is not needed. |
| HideReturnReason | bool | false | Hide the return reason field in the return dialog. Use when tracking return reasons is not required. |
| HideComment | bool | false | Hide the comment field in the return dialog. |
| HideUpdateStock | bool | false | Hide the "Update Stock" checkbox in the return dialog. When hidden, the default value is always used. |
| CreateReturnLabel | bool | false | Automatically create a return shipping label when a return is created. Requires a shipping provider that supports return labels. |
| DefaultReturnOrderType | string | null | The order type to assign to return orders. If not set, returns inherit the type from the original order. |

### Return charges

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsDisableCreditShippingCost | bool | false | When enabled, shipping costs are never credited on returns. The customer does not receive a refund for the original shipping. |
| IsAllowOneReturnChargePerOrder | bool | false | When enabled, only one return fee can be charged per order, regardless of how many return transactions are created. |
| IsAutoCreditShipmentOnFullReturn | bool | false | Automatically credit the shipping cost when a full return is processed (all items returned). |
| IsAutoCreditLowestShipmentCostOnFullReturn | bool | false | On full returns, automatically credit only the lowest shipping cost if multiple shipments exist. Use this when you want to refund shipping on full returns but minimize the refund amount. |

### Warehouse handling

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsReturnSplitOrdersToMainWarehouse | bool | false | When enabled, returns on split orders (orders with multiple shipments from different warehouses) are directed to the main warehouse instead of the original shipping warehouse. |

### Return types

Return types define categories of returns with different behaviors.

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Unique identifier for the return type |
| TranslationKey | string | Translation key for displaying the type in the UI |
| UpdateInventory | bool | Whether this return type updates inventory (default: true) |
| ReturnTypeCharges | List<ReturnTypeCharge> | Fees associated with this return type, by currency |

#### Return type charges

| Property | Type | Description |
| --- | --- | --- |
| Currency | string | Currency code (e.g., "NOK", "SEK") |
| Amount | string | Fee amount for this return type in the specified currency |

### Return statuses

Return statuses define the workflow for return processing.

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Status name |
| Order | int | Sort order for the status |
| DisplayName | string | Display name shown in UI |
| TranslateKey | string | Translation key |
| WorkflowSteps | List<WorkflowStep> | Workflow steps executed when entering this status |

#### Sample

```
"OrderSettings": {
  "ReturnSettings": {
    "DefaultUpdateStock": true,
    "HideCreateClaim": false,
    "CreateReturnLabel": true,
    "IsDisableCreditShippingCost": false,
    "IsAllowOneReturnChargePerOrder": true,
    "IsAutoCreditShipmentOnFullReturn": true,
    "DefaultReturnOrderType": "Return",
    "ReturnTypes": [
      {
        "Id": "StandardReturn",
        "TranslationKey": "ReturnType_Standard",
        "UpdateInventory": true,
        "ReturnTypeCharges": [
          { "Currency": "NOK", "Amount": "49" },
          { "Currency": "SEK", "Amount": "59" }
        ]
      },
      {
        "Id": "DefectiveItem",
        "TranslationKey": "ReturnType_Defective",
        "UpdateInventory": false,
        "ReturnTypeCharges": []
      },
      {
        "Id": "WrongItem",
        "TranslationKey": "ReturnType_WrongItem",
        "UpdateInventory": true,
        "ReturnTypeCharges": []
      }
    ],
    "ReturnStatuses": [
      {
        "Name": "New",
        "Order": 1,
        "DisplayName": "New Return",
        "TranslateKey": "ReturnStatus_New",
        "WorkflowSteps": [
          { "Name": "NotifyCustomer", "Active": true }
        ]
      },
      {
        "Name": "Received",
        "Order": 2,
        "DisplayName": "Received",
        "TranslateKey": "ReturnStatus_Received",
        "WorkflowSteps": []
      },
      {
        "Name": "Processed",
        "Order": 3,
        "DisplayName": "Processed",
        "TranslateKey": "ReturnStatus_Processed",
        "WorkflowSteps": [
          { "Name": "ProcessRefund", "Active": true }
        ]
      }
    ]
  }
}
```

* * *

## Replacement settings

These settings configure how replacement orders are created and handled.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ReplacementTypes | List<TranslationKeys> | \[\] | Available types/reasons for creating replacement orders. |
| IsMetaDataDeleted | bool | false | When enabled, metadata is cleared from replacement orders. Removes tracking data and other metadata that shouldn't carry over. |
| IsReplacementOrderUnreplaceable | bool | false | When enabled, replacement orders cannot have their own replacements created. Prevents chains of replacement orders. |
| DeletedMetaDataOnOrderLine | List<string> | \[\] | Specific metadata properties to remove from order lines when creating a replacement. |
| DeletedMetaDataOnOrder | List<string> | \[\] | Specific metadata properties to remove from the order when creating a replacement. |

#### Sample

```
"OrderSettings": {
  "DefaultReplacementOrderType": "Replacement",
  "ReplacementSettings": {
    "ReplacementTypes": [
      { "Id": "DamagedInTransit", "TranslationKey": "Replacement_DamagedInTransit" },
      { "Id": "WrongItemSent", "TranslationKey": "Replacement_WrongItemSent" },
      { "Id": "QualityIssue", "TranslationKey": "Replacement_QualityIssue" }
    ],
    "IsMetaDataDeleted": true,
    "IsReplacementOrderUnreplaceable": true,
    "DeletedMetaDataOnOrder": [
      "OriginalPaymentReference",
      "ShippingTrackingNumber"
    ],
    "DeletedMetaDataOnOrderLine": [
      "SerialNumber",
      "BatchNumber"
    ]
  }
}
```

* * *

## Subscription settings

These settings configure subscription order handling.

| Property | Type | Description |
| --- | --- | --- |
| SubscriptionStatuses | List<SubscriptionStatus> | Available statuses for subscription orders |

Subscription statuses follow the same structure as order statuses, allowing you to define a separate workflow for subscription management.

* * *

## Order automation

Order automation allows you to define rules that automatically transition orders between statuses based on conditions. This is useful for automating order processing workflows.

### Automation settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| OrderAutomations | List<OrderStatusAutomation> | \[\] | List of automation rules |
| BackInStockBatchSize | int | 100 | Number of orders to process per batch when checking back-in-stock conditions |
| MaxOrdersToProcessPerRun | int | 1000 | Maximum number of orders to process in a single automation run |
| InventoryChangeThreshold | int | 1 | Minimum inventory change that triggers back-in-stock processing |

### Automation rules

| Property | Type | Description |
| --- | --- | --- |
| OrderType | string | The order type this rule applies to |
| Status | string | The current status that triggers this rule |
| Condition | string | The condition that must be met (see available conditions below) |
| NewStatus | string | The status to transition to when the condition is met |
| RunWorkflow | bool | Whether to run the workflow steps for the new status |

### Available conditions

| Condition | Description |
| --- | --- |
| `BackInStock` | Triggers when all items on the order are back in stock |
| `PartiallyBackInStock` | Triggers when at least one item on the order is back in stock |
| `FullyReservedFullyPaid` | All items reserved and the order is fully paid |
| `FullyReservedFullyPaidDeliveryDateDue` | All items reserved, fully paid, and the requested delivery date is due |
| `FullyReservedNotFullyPaid` | All items reserved but the order is not fully paid |
| `FullyReservedWithPurchaseOrder` | All items reserved, including items reserved via a purchase order |
| `PartiallyReservedFullyPaid` | Some items reserved and the order is fully paid |
| `PartiallyReservedNotFullyPaid` | Some items reserved but the order is not fully paid |
| `PartiallyOrNotReservedFullyPaid` | Not all items reserved but the order is fully paid |
| `PartiallyOrNotReservedNotFullyPaid` | Not all items reserved and the order is not fully paid |
| `FullyAllocatedToPurchaseOrder` | All items allocated to a purchase order |
| `PartiallyAllocatedToPurchaseOrder` | Some items allocated to a purchase order |

Order automation requires a scheduled task to be configured and running. The automation rules are evaluated periodically by the scheduled task, not in real-time.

#### Sample

```
"OrderSettings": {
  "OrderAutomationSettings": {
    "BackInStockBatchSize": 100,
    "MaxOrdersToProcessPerRun": 500,
    "InventoryChangeThreshold": 1,
    "OrderAutomations": [
      {
        "OrderType": "Online",
        "Status": "AwaitingStock",
        "Condition": "BackInStock",
        "NewStatus": "ReadyToShip",
        "RunWorkflow": true
      },
      {
        "OrderType": "Online",
        "Status": "New",
        "Condition": "FullyReservedFullyPaid",
        "NewStatus": "ReadyToShip",
        "RunWorkflow": true
      },
      {
        "OrderType": "ClickAndCollect",
        "Status": "New",
        "Condition": "PartiallyReservedFullyPaid",
        "NewStatus": "ReadyForPickup",
        "RunWorkflow": true
      }
    ]
  }
}
```

* * *

## Properties and tags

### Default properties

Default properties are automatically added to orders when they are created. These are useful for tracking additional information.

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Property name |
| Value | string | Default value |
| DisplayName | string | Display name in UI |
| DataType | string | Data type (String, Number, Boolean, Date) |
| IsRequired | bool | Whether the property is required |
| IsReadOnly | bool | Whether the property is read-only after creation |

### Highlighted properties

Highlighted properties are displayed prominently on the order detail page. Configure a list of property names to highlight.

```
"OrderSettings": {
  "HighlightedProperties": [
    "CustomerSegment",
    "Priority",
    "SalesChannel"
  ]
}
```

### Searchable properties (facets)

Facet properties are indexed for searching and filtering in the order list. Add property names that you want to use as search filters.

```
"OrderSettings": {
  "FacetProperties": [
    "CustomerSegment",
    "Priority",
    "Region"
  ]
}
```

### Tags

Tags provide a way to categorize and filter orders. Configure available tags for your organization.

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Tag identifier |
| TranslationKey | string | Translation key for the tag label |

```
"OrderSettings": {
  "TagSettings": [
    { "Name": "VIP", "TranslationKey": "Tag_VIP" },
    { "Name": "Priority", "TranslationKey": "Tag_Priority" },
    { "Name": "GiftOrder", "TranslationKey": "Tag_GiftOrder" },
    { "Name": "B2B", "TranslationKey": "Tag_B2B" }
  ],
  "IsTagsHiddenOnReceipts": false
}
```

### Highlighted external IDs

Configure which external ID types should be displayed prominently on orders and shipments.

```
"OrderSettings": {
  "HighlightedExternalIds": [
    "WebshopOrderId",
    "ERPOrderId"
  ],
  "HighlightedShipmentExternalIds": [
    "TrackingNumber",
    "CarrierReference"
  ]
}
```

* * *

## Complete configuration example

Below is a comprehensive example showing all order settings configured together:

```json
{
  "OrderSettings": {
    "ShouldOrderStoreIdBeSavedOnCustomer": true,
    "ShouldOrderMarketIdBeSavedOnCustomer": true,
    "ShouldCustomerExternalIdsBeSavedOnOrder": true,

    "ShowOrderTotalsExTax": false,
    "ShowOrderLinesExTax": false,
    "IsInvoiceOriginal": true,
    "UneditableExternalIDs": false,
    "IsLockShipmentsOnPickList": true,

    "IsDiscountAmountRoundingDisabled": false,
    "IsDiscountPercentageLockedByDefault": true,
    "IsCreditAmountSubtractedFromRemainingPayment": true,

    "DefaultCurrencyCode": "NOK",
    "DefaultOrigin": "Omnium",
    "DefaultOmsCartOrigin": "OmniumUI",
    "DefaultReplacementOrderType": "Replacement",
    "DefaultQuickProcessOrderStatus": "Completed",
    "DeleteOrdersThreshold": 1095,

    "IsOrderValidationEnabled": true,
    "IsOrderValidationOnOpenEnabled": false,

    "UseStatsOrderQueues": true,
    "ShippingProfitPercent": 15.0,

    "CancelOrderIfAllLineItemsCancelled": true,
    "CancellationTypes": [
      { "Id": "CustomerRequest", "TranslationKey": "Cancellation_CustomerRequest" },
      { "Id": "OutOfStock", "TranslationKey": "Cancellation_OutOfStock" }
    ],

    "GiftCardSku": "GIFTCARD",
    "GiftCardCompletedStatus": "Completed",
    "GiftCardValidMonths": 12,

    "OrderLineSettings": {
      "SplitMultibuyPromotionOrderLines": false,
      "PropertiesToEnrichOrderLineFromProduct": ["Brand", "SupplierSku"],
      "ModifiedReasons": [
        { "Id": "PriceMatch", "TranslationKey": "ModifiedReason_PriceMatch" }
      ],
      "CancellationTypes": [
        { "Id": "OutOfStock", "TranslationKey": "LineCancellation_OutOfStock" }
      ]
    },

    "ReturnSettings": {
      "DefaultUpdateStock": true,
      "CreateReturnLabel": true,
      "IsAllowOneReturnChargePerOrder": true,
      "IsAutoCreditShipmentOnFullReturn": true,
      "ReturnTypes": [
        {
          "Id": "StandardReturn",
          "TranslationKey": "ReturnType_Standard",
          "UpdateInventory": true,
          "ReturnTypeCharges": [
            { "Currency": "NOK", "Amount": "49" }
          ]
        }
      ]
    },

    "ReplacementSettings": {
      "ReplacementTypes": [
        { "Id": "DamagedInTransit", "TranslationKey": "Replacement_DamagedInTransit" }
      ],
      "IsMetaDataDeleted": true,
      "IsReplacementOrderUnreplaceable": true
    },

    "TagSettings": [
      { "Name": "VIP", "TranslationKey": "Tag_VIP" },
      { "Name": "Priority", "TranslationKey": "Tag_Priority" }
    ],

    "HighlightedProperties": ["CustomerSegment", "Priority"],
    "FacetProperties": ["CustomerSegment"],
    "HighlightedExternalIds": ["WebshopOrderId"],

    "DefaultProperties": [
      {
        "Name": "CustomerSegment",
        "DisplayName": "Customer Segment",
        "DataType": "String"
      }
    ]
  }
}
```
