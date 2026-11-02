# Configuration

Source: https://docs.omnium.no/docs/Order/Returns/return-config

> Learn how to configure return types, return statuses, return workflows, charges, and automation in Omnium. This guide covers all return-related configuration options for administrators and developers.

Returns in Omnium are processed as separate order forms linked to the original order. Each return has its own status workflow, allowing for independent tracking and processing. Returns can update inventory, trigger refunds, and optionally charge return fees.

* * *

## Return settings

Return settings control the general behavior of return processing, UI visibility, and financial handling.

### General settings

These settings control the default behavior and UI options when creating returns.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DefaultUpdateStock | bool | false | When enabled, the "Update Stock" checkbox is checked by default when creating returns. Returned items will automatically be added back to inventory unless the return type overrides this behavior. |
| HideCreateClaim | bool | false | When enabled, hides the "Create Claim/Project" option in the return dialog. Use this when project/claim functionality is not needed for returns. |
| HideReturnReason | bool | false | When enabled, hides the return reason field in the return dialog. Use this when tracking return reasons is not required. |
| HideComment | bool | false | When enabled, hides the comment field in the return dialog. |
| HideUpdateStock | bool | false | When enabled, hides the "Update Stock" checkbox in the return dialog. When hidden, the `DefaultUpdateStock` value is always applied. |
| CreateReturnLabel | bool | false | When enabled, shows the return label creation option in the return dialog. Requires a shipping provider that supports return label generation. |
| DefaultReturnOrderType | string | null | The order type assigned to standalone return orders created from the returns list in the Omnium UI. If not set, creating an empty return from the returns list fails with an error. This setting is not required when adding a return to an existing order via the create-return endpoint. |

#### Sample

```
"ReturnSettings": {
  "DefaultUpdateStock": true,
  "HideCreateClaim": false,
  "HideReturnReason": false,
  "HideComment": false,
  "HideUpdateStock": false,
  "CreateReturnLabel": true,
  "DefaultReturnOrderType": "Return"
}
```

### Return charges and credits

These settings control how shipping costs and return fees are handled during return processing.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsDisableCreditShippingCost | bool | false | When enabled, disables the option to credit shipping costs when creating returns in the Omnium UI. The customer will not receive a refund for the original shipping charges. |
| IsAllowOneReturnChargePerOrder | bool | false | When enabled, limits return charges to one per order. If a customer has already paid a return fee on a previous return from the same order, the option to charge them again is disabled. |
| IsAutoCreditShipmentOnFullReturn | bool | false | When enabled, automatically credits shipping costs when all items in the order are returned or cancelled. The full shipping amount is refunded without manual intervention. |
| IsAutoCreditLowestShipmentCostOnFullReturn | bool | false | When enabled (together with `IsAutoCreditShipmentOnFullReturn`), credits only the lowest shipping cost if the order has multiple shipments. Use this to minimize shipping refunds on multi-shipment orders. |

The `IsAutoCreditLowestShipmentCostOnFullReturn` setting only takes effect when `IsAutoCreditShipmentOnFullReturn` is also enabled. If an order has two shipments costing $10 and $5, only $5 will be credited on a full return.

#### Sample

```
"ReturnSettings": {
  "IsDisableCreditShippingCost": false,
  "IsAllowOneReturnChargePerOrder": true,
  "IsAutoCreditShipmentOnFullReturn": true,
  "IsAutoCreditLowestShipmentCostOnFullReturn": false
}
```

### Warehouse handling

These settings control how returns are routed to warehouses.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsReturnSplitOrdersToMainWarehouse | bool | false | When enabled, returns for orders that were split across multiple warehouses are routed to the main warehouse for the market instead of the original shipping warehouse. Complete (non-split) orders are returned to the warehouse specified on the order. |

#### Sample

```
"ReturnSettings": {
  "IsReturnSplitOrdersToMainWarehouse": true
}
```

* * *

## Return types

Return types categorize returns and control inventory behavior and return charges. Each return type can have different settings for whether inventory should be updated and what fees (if any) should be charged.

### Return type model

| Property | Type | Description |
| --- | --- | --- |
| **Id** \* | string | Unique identifier for the return type. Used as the key when selecting a return type. |
| **TranslationKey** \* | string | Translation key for the display name. The actual text is defined in the translation files. |
| UpdateInventory | bool? | Whether to update inventory when this return type is used. Defaults to `true` if not specified. Set to `false` for return types where items should not be restocked (e.g., defective items sent to supplier). |
| IsPriorityInventory | bool? | When `true`, units restocked with this return type are marked as [priority stock](../../Inventory/priority-stock.md), so allocation sells them first. Applied by the `UpdateInventory` return workflow step. Has no effect when `UpdateInventory` is `false`, since nothing is restocked; the **Priority stock** switch on the return type is disabled then. |
| ReturnTypeCharges | [List<ReturnTypeCharge>](return-config.md#return-type-charges) | Currency-specific fees charged when this return type is used. |

### Return type charges

Return type charges define fees that are deducted from the refund amount when a specific return type is used. Charges are specified per currency.

| Property | Type | Description |
| --- | --- | --- |
| Currency | string | Currency code (e.g., "NOK", "SEK", "EUR", "USD") |
| Amount | string | Fee amount in the specified currency. Deducted from the refund. |

#### Sample

```
"ReturnSettings": {
  "ReturnTypes": [
    {
      "Id": "StandardReturn",
      "TranslationKey": "ReturnType_Standard",
      "UpdateInventory": true,
      "ReturnTypeCharges": [
        { "Currency": "NOK", "Amount": "49" },
        { "Currency": "SEK", "Amount": "59" },
        { "Currency": "EUR", "Amount": "5" }
      ]
    },
    {
      "Id": "DefectiveItem",
      "TranslationKey": "ReturnType_Defective",
      "UpdateInventory": false,
      "ReturnTypeCharges": []
    },
    {
      "Id": "WrongItemSent",
      "TranslationKey": "ReturnType_WrongItem",
      "UpdateInventory": true,
      "ReturnTypeCharges": []
    },
    {
      "Id": "Exchange",
      "TranslationKey": "ReturnType_Exchange",
      "UpdateInventory": true,
      "ReturnTypeCharges": []
    }
  ]
}
```

* * *

## Return statuses

Return statuses define the workflow for return processing. Each status can trigger workflow steps that perform actions such as sending notifications, processing refunds, or updating inventory.

### Return status model

| Property | Type | Description |
| --- | --- | --- |
| **Name** \* | string | Status name (internal identifier). Used in API calls and workflow configuration. |
| **Order** \* | int | Sort order index. Statuses are displayed in this order in the UI. |
| DisplayName | string | Human-readable display name shown in the UI. |
| TranslateKey | string | Translation key for multi-language support. |
| IsDefaultStatus | bool | When `true`, new returns are automatically assigned this status. Only one status should have this set. |
| IsReturnedStatus | bool | When `true`, marks the return as completed/returned. When project return sync is enabled (`IsProjectReturnSyncEnabled` in the project settings), product edits made in the Omnium UI to the return's project are rejected while the return is in this status, because the return can no longer be updated from the project. |
| IsCancelledStatus | bool | When `true`, marks the return as cancelled. The return is considered void. |
| WorkflowSteps | [List<WorkflowStep>](return-workflow-steps.md) | Workflow steps executed when the return enters this status. |
| Properties | [List<PropertyItem>](https://docs.omnium.no/api/generic#properties) | Custom properties for this status. |

### Workflow status progression

Returns typically progress through statuses in order of their `Order` value. Common patterns include:

1.  **New** (Default) - Return created, awaiting processing
2.  **Received** - Items received at warehouse
3.  **Inspected** - Items inspected for condition
4.  **Completed** - Refund processed, return closed

Each status transition triggers the workflow steps configured for the target status.

#### Sample

```
"ReturnSettings": {
  "ReturnStatuses": [
    {
      "Name": "New",
      "DisplayName": "New Return",
      "TranslateKey": "ReturnStatus_New",
      "Order": 1,
      "IsDefaultStatus": true,
      "WorkflowSteps": [
        {
          "Name": "EnsureRma",
          "Active": true,
          "TranslateKey": "WorkflowStep_EnsureRma"
        },
        {
          "Name": "Notification",
          "Active": true,
          "TranslateKey": "WorkflowStep_Notification"
        },
        {
          "Name": "UpdateOrderStatus",
          "Active": true,
          "TranslateKey": "WorkflowStep_UpdateOrderStatus"
        }
      ]
    },
    {
      "Name": "Received",
      "DisplayName": "Items Received",
      "TranslateKey": "ReturnStatus_Received",
      "Order": 2,
      "WorkflowSteps": []
    },
    {
      "Name": "Completed",
      "DisplayName": "Completed",
      "TranslateKey": "ReturnStatus_Completed",
      "Order": 3,
      "IsReturnedStatus": true,
      "WorkflowSteps": [
        {
          "Name": "UpdateInventory",
          "Active": true,
          "TranslateKey": "WorkflowStep_UpdateInventory"
        },
        {
          "Name": "CreditReturn",
          "Active": true,
          "TranslateKey": "WorkflowStep_CreditReturn"
        },
        {
          "Name": "ExportOrder",
          "Active": true,
          "Connector": "DynamicsConnector",
          "TranslateKey": "WorkflowStep_ExportOrder"
        }
      ]
    },
    {
      "Name": "Cancelled",
      "DisplayName": "Cancelled",
      "TranslateKey": "ReturnStatus_Cancelled",
      "Order": 4,
      "IsCancelledStatus": true,
      "WorkflowSteps": [
        {
          "Name": "CancelReturn",
          "Active": true,
          "IsInvisible": true,
          "TranslateKey": "WorkflowStep_CancelReturn"
        }
      ]
    }
  ]
}
```

* * *

## Workflow steps

Return workflow steps execute automatically as returns move through statuses. Each step performs a specific action such as sending notifications, processing refunds, or exporting data.

See [Return Workflow Steps](return-workflow-steps.md) for complete documentation of all available steps.

### Common workflow step properties

| Property | Type | Description |
| --- | --- | --- |
| **Name** \* | string | Workflow step key (e.g., "CreditReturn", "UpdateInventory"). See the workflow steps reference for all available keys. |
| Active | bool | Whether the step is enabled. Set to `false` to disable without removing from configuration. |
| Connector | string | External system connector to use (required for export, notification, and some enrichment steps). |
| RunAfterOrderIsSaved | bool | When `true`, the step executes after the return is persisted to the database. |
| StopOnError | bool | When `true`, the workflow halts if this step fails. Subsequent steps are not executed. |
| TranslateKey | string | Translation key for the step name displayed in the UI. |
| IsInvisible | bool | When `true`, the step result is not displayed in the workflow execution log in the UI. |
| EnabledForMarkets | List<string> | List of market IDs where this step is enabled. If empty, the step runs for all markets. |
| DisabledForMarkets | List<string> | List of market IDs where this step is disabled. Overrides `EnabledForMarkets`. |

### Available return workflow steps

| Category | Steps |
| --- | --- |
| [Payment](return-workflow-steps/payment.md) | CreditReturn, CreateCreditNote, ExportPayments |
| [Inventory](return-workflow-steps/inventory.md) | UpdateInventory |
| [Notifications](return-workflow-steps/notifications.md) | Notification |
| [Customers](return-workflow-steps/customers.md) | UpdateCustomerClub |
| [Enrichment](return-workflow-steps/enrichment.md) | EnsureRma, GenerateExternalId, SetCustomOrderData |
| [Status](return-workflow-steps/status.md) | UpdateOrderStatus, UpdateProjectStatus, CancelReturn |
| [Export](return-workflow-steps/export.md) | ExportOrder |
| [Replacement](return-workflow-steps/replacement.md) | CreateExchangeOrder, CreateReplacementOrder, CreateReplacementOrderKeepingPrices |
| [Shipments](return-workflow-steps/shipments.md) | CreateReturnShipmentBooking, CompleteShipment |

* * *

## How return creation affects the order

When a return is created (via API or UI), multiple things happen in sequence. Understanding this flow is important for configuring your return and order workflows correctly.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      Return Creation Flow                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Return is created                                                    │
│     ├─ Return order form is added to the order                           │
│     └─ ReturnQuantity is updated on the order's line items               │
│                                                                          │
│  2. Return workflow runs (for the return's initial status)               │
│     └─ All active workflow steps for the return status execute           │
│        e.g. EnsureRma → Notification → UpdateOrderStatus                 │
│                                                                          │
│  3. If UpdateOrderStatus changed the order status:                       │
│     └─ Order workflow runs for the NEW order status                      │
│        (e.g. "PartiallyReturned" or "Returned")                         │
│        ├─ Success → order is saved with new status                       │
│        └─ Error/abort → order status reverts, order is saved             │
│                                                                          │
│  4. If order status was NOT changed:                                     │
│     └─ Order is saved without running the order workflow                 │
│                                                                          │
│  5. "Run after order is saved" return workflow steps execute             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

The order workflow in step 3 is the **regular order workflow** — the same one that runs when you change an order status manually. Make sure the target status (e.g. "PartiallyReturned") exists in your order type configuration and that any workflow steps on it are working correctly. If a step fails and the workflow aborts, the order status will revert to the previous value.

The order workflow for the **previous** status (e.g. "Sent") is never re-triggered by this process. Only the workflow for the new target status runs.

* * *

## Complete configuration example

Below is a comprehensive example showing all return settings configured together:

```json
{
  "OrderSettings": {
    "ReturnSettings": {
      "DefaultUpdateStock": true,
      "HideCreateClaim": false,
      "HideReturnReason": false,
      "HideComment": false,
      "HideUpdateStock": false,
      "CreateReturnLabel": true,
      "DefaultReturnOrderType": "Return",

      "IsDisableCreditShippingCost": false,
      "IsAllowOneReturnChargePerOrder": true,
      "IsAutoCreditShipmentOnFullReturn": true,
      "IsAutoCreditLowestShipmentCostOnFullReturn": false,

      "IsReturnSplitOrdersToMainWarehouse": true,

      "ReturnTypes": [
        {
          "Id": "StandardReturn",
          "TranslationKey": "ReturnType_Standard",
          "UpdateInventory": true,
          "ReturnTypeCharges": [
            { "Currency": "NOK", "Amount": "49" },
            { "Currency": "SEK", "Amount": "59" },
            { "Currency": "EUR", "Amount": "5" }
          ]
        },
        {
          "Id": "DefectiveItem",
          "TranslationKey": "ReturnType_Defective",
          "UpdateInventory": false,
          "ReturnTypeCharges": []
        },
        {
          "Id": "WrongItemSent",
          "TranslationKey": "ReturnType_WrongItem",
          "UpdateInventory": true,
          "ReturnTypeCharges": []
        }
      ],

      "ReturnStatuses": [
        {
          "Name": "New",
          "DisplayName": "New Return",
          "TranslateKey": "ReturnStatus_New",
          "Order": 1,
          "IsDefaultStatus": true,
          "WorkflowSteps": [
            {
              "Name": "EnsureRma",
              "Active": true,
              "TranslateKey": "WorkflowStep_EnsureRma"
            },
            {
              "Name": "Notification",
              "Active": true,
              "TranslateKey": "WorkflowStep_Notification"
            },
            {
              "Name": "UpdateOrderStatus",
              "Active": true,
              "TranslateKey": "WorkflowStep_UpdateOrderStatus"
            }
          ]
        },
        {
          "Name": "Received",
          "DisplayName": "Items Received",
          "TranslateKey": "ReturnStatus_Received",
          "Order": 2,
          "WorkflowSteps": []
        },
        {
          "Name": "Completed",
          "DisplayName": "Completed",
          "TranslateKey": "ReturnStatus_Completed",
          "Order": 3,
          "IsReturnedStatus": true,
          "WorkflowSteps": [
            {
              "Name": "UpdateInventory",
              "Active": true,
              "TranslateKey": "WorkflowStep_UpdateInventory"
            },
            {
              "Name": "CreditReturn",
              "Active": true,
              "TranslateKey": "WorkflowStep_CreditReturn"
            },
            {
              "Name": "ExportOrder",
              "Active": true,
              "Connector": "DynamicsConnector",
              "TranslateKey": "WorkflowStep_ExportOrder"
            }
          ]
        },
        {
          "Name": "Cancelled",
          "DisplayName": "Cancelled",
          "TranslateKey": "ReturnStatus_Cancelled",
          "Order": 4,
          "IsCancelledStatus": true,
          "WorkflowSteps": [
            {
              "Name": "CancelReturn",
              "Active": true,
              "IsInvisible": true,
              "TranslateKey": "WorkflowStep_CancelReturn"
            }
          ]
        }
      ]
    }
  }
}
```
