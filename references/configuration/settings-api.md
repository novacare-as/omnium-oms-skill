# Settings API

Source: https://docs.omnium.no/docs/configuration/settings-api

> Read your tenant's order types, order statuses, workflow steps, order settings and customer settings through the read-only Omnium Settings API.

The Settings API gives you read-only access to parts of your tenant configuration: the order types with their order statuses and workflow steps, and a subset of the order settings and the customer settings. You configure these settings in the Omnium UI, as described in [order configuration](../Order/order-config.md) and [customer configuration](../Customer/customer-config.md).

Use the order types to interpret the orders your integration receives. Match the `orderType` and `status` of an order against the order statuses to find out, for example, whether Omnium counts orders in that status as delivered (`IsDeliveredStatus`) or canceled (`IsCanceledStatus`), or whether orders in that status are excluded from reserved inventory (`IsExcludedFromReservedInventory`, see the [order status model](../Order/order-config.md#order-status-model)).

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/Settings/OrderTypes` | Get the order types, with their order statuses and workflow steps |
| `GET` | `/api/Settings/OrderSettings` | Get the order settings |
| `GET` | `/api/Settings/CustomerSettings` | Get the customer settings |

All endpoints require Bearer token authentication. The API user needs the `SettingsRead` or `SettingsAdmin` role, or `ApiOwner` (equivalent to `Admin`). See [Roles and Permissions](../GettingStartedWithAPI/api-developer-guide.md#roles-and-permissions) for the role model and [Authentication](../GettingStartedWithAPI/api-developer-guide.md#authentication) for how to get a token.

Responses are JSON with camelCase property names. Properties without a value are left out of the response, so treat a missing property as `null`. Some lists are left out instead of being returned as an empty list when nothing is configured. The field tables mark these as _not returned when empty_.

### Get order types

Returns the order types configured on the tenant. Each order type contains its order statuses, and each order status contains the workflow steps that run in that status.

**Endpoint:** `GET /api/Settings/OrderTypes`

**Example request:**

```
GET /api/Settings/OrderTypes
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK` with an array of [order types](settings-api.md#order-type). If no order types are configured, the response is `204 No Content`.

**Example response:**

The workflow steps in this example leave out the fields that always have default values. See [Workflow step](settings-api.md#workflow-step).

```json
[
  {
    "name": "Online",
    "enableEdit": true,
    "enableCreateFromCart": true,
    "disableWorkflow": false,
    "defaultOrderType": true,
    "defaultExternalIdProvider": "ERP",
    "orderStatuses": [
      {
        "name": "New",
        "displayName": "New",
        "isMainFilter": true,
        "order": 1,
        "isCanceledStatus": false,
        "isDeliveredStatus": false,
        "isExcludedFromReservedInventory": false,
        "isInProgressStatus": false,
        "isPicked": false,
        "enforceAvailableStepsPolicy": true,
        "availableSteps": ["InProgressWarehouse", "OrderCanceled"],
        "workflowSteps": [
          {
            "name": "IncreaseReservedInventory",
            "active": true,
            "runAfterOrderIsSaved": false,
            "stopOnError": false,
            "isInvisible": false
          },
          {
            "name": "GetOrCreateCustomerFromOrder",
            "active": true,
            "runAfterOrderIsSaved": false,
            "stopOnError": false,
            "isInvisible": false,
            "disabledForMarkets": ["SWE"],
            "properties": [
              {
                "key": "UseOrderSearch",
                "value": "true",
                "valueType": "Boolean"
              }
            ]
          },
          {
            "name": "CalculateAtp",
            "active": true,
            "runAfterOrderIsSaved": true,
            "stopOnError": false,
            "isInvisible": false
          }
        ],
        "translateKey": "New",
        "updateStatusButtonIsDisabledInGui": false
      },
      {
        "name": "InProgressWarehouse",
        "displayName": "Sent to warehouse",
        "isMainFilter": true,
        "order": 2,
        "isCanceledStatus": false,
        "isDeliveredStatus": false,
        "isExcludedFromReservedInventory": true,
        "isInProgressStatus": true,
        "isPicked": false,
        "workflowSteps": [
          {
            "name": "ExportOrder",
            "active": true,
            "runAfterOrderIsSaved": false,
            "stopOnError": true,
            "translateKey": "WorkflowStep_ExportOrder",
            "isInvisible": false
          }
        ],
        "translateKey": "InProgressWarehouse",
        "properties": [
          {
            "key": "ErpStatusCode",
            "value": "20",
            "valueType": "String"
          }
        ],
        "updateStatusButtonIsDisabledInGui": true
      },
      {
        "name": "Ship",
        "displayName": "Shipped",
        "isMainFilter": true,
        "order": 3,
        "isCanceledStatus": false,
        "isDeliveredStatus": true,
        "isExcludedFromReservedInventory": false,
        "isInProgressStatus": false,
        "isPicked": false,
        "translateKey": "Ship",
        "updateStatusButtonIsDisabledInGui": false
      },
      {
        "name": "OrderCanceled",
        "displayName": "Canceled",
        "isMainFilter": false,
        "order": 4,
        "isCanceledStatus": true,
        "isDeliveredStatus": false,
        "isExcludedFromReservedInventory": false,
        "isInProgressStatus": false,
        "isPicked": false,
        "workflowSteps": [
          {
            "name": "ReduceReservedInventory",
            "active": true,
            "runAfterOrderIsSaved": false,
            "stopOnError": false,
            "isInvisible": false
          }
        ],
        "translateKey": "OrderCanceled",
        "updateStatusButtonIsDisabledInGui": false
      }
    ],
    "deriveOrderStatusFromShipments": false
  },
  {
    "name": "Pos",
    "enableEdit": false,
    "enableCreateFromCart": false,
    "disableWorkflow": false,
    "defaultOrderType": true,
    "orderStatuses": [
      {
        "name": "Completed",
        "displayName": "Completed",
        "isMainFilter": true,
        "order": 1,
        "isCanceledStatus": false,
        "isDeliveredStatus": true,
        "isExcludedFromReservedInventory": false,
        "isInProgressStatus": false,
        "isPicked": false,
        "translateKey": "Completed",
        "color": "Green",
        "updateStatusButtonIsDisabledInGui": false
      }
    ],
    "deriveOrderStatusFromShipments": false
  }
]
```

### Get order settings

Returns a subset of the tenant's order settings, including the return, replacement and order line settings.

**Endpoint:** `GET /api/Settings/OrderSettings`

**Example request:**

```
GET /api/Settings/OrderSettings
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK` with the [order settings](settings-api.md#order-settings).

**Example response:**

The workflow step in this example leaves out the fields that always have default values. See [Workflow step](settings-api.md#workflow-step).

```json
{
  "shouldOrderStoreIdBeSavedOnCustomer": true,
  "shouldOrderMarketIdBeSavedOnCustomer": true,
  "shouldOrderExternalIdsBeSavedOnCustomer": false,
  "shouldCustomerExternalIdsBeSavedOnOrder": true,
  "shouldOrderPropertiesBeSavedOnCustomer": false,
  "shouldCustomerPropertiesBeSavedOnOrder": false,
  "isOrderCalculatorRunOnImport": false,
  "giftCardSku": "GIFTCARD",
  "giftCardCompletedStatus": "Ship",
  "defaultExchangeTerms": "Unused items in their original packaging can be exchanged within 30 days.",
  "returnSettings": {
    "returnTypes": [
      {
        "id": "Regret",
        "translationKey": "ReturnType_Regret",
        "updateInventory": true
      },
      {
        "id": "Defective",
        "translationKey": "ReturnType_Defective",
        "updateInventory": false
      }
    ],
    "defaultUpdateStock": false
  },
  "replacementSettings": {
    "replacementTypes": [
      {
        "id": "DamagedInTransit",
        "translationKey": "Replacement_DamagedInTransit"
      }
    ],
    "isMetaDataDeleted": false,
    "isReplacementOrderUnreplaceable": true,
    "deletedMetaDataOnOrderLine": ["SerialNumber"],
    "deletedMetaDataOnOrder": ["ErpOrderReference"]
  },
  "showOrderTotalsExTax": false,
  "showOrderLinesExTax": false,
  "uneditableExternalIDs": true,
  "availableManualWorkflowSteps": [
    {
      "name": "ExportOrder",
      "active": true,
      "runAfterOrderIsSaved": false,
      "stopOnError": false,
      "translateKey": "WorkflowStep_ExportOrder",
      "isInvisible": false
    }
  ],
  "defaultReplacementOrderType": "Replacement",
  "tagSettings": [
    {
      "name": "VIP",
      "translationKey": "Tag_VIP"
    }
  ],
  "includedOrderTypesForRevenueStats": ["Online", "Pos"],
  "useStatsOrderQueues": true,
  "orderLineSettings": {
    "defaultProperties": [
      {
        "key": "GiftWrap",
        "value": "No",
        "valueType": "DropDown",
        "valueOptions": ["Yes", "No"],
        "isCustomValueOptionAllowed": false,
        "isMultiSelectEnabled": false,
        "readOnly": false
      }
    ],
    "splitMultibuyPromotionOrderLines": false
  },
  "isInvoiceOriginal": true
}
```

### Get customer settings

Returns a subset of the tenant's customer settings, including the consent types and PunchOut settings.

**Endpoint:** `GET /api/Settings/CustomerSettings`

**Example request:**

```
GET /api/Settings/CustomerSettings
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK` with the [customer settings](settings-api.md#customer-settings).

**Example response:**

```json
{
  "isB2BGetOrCreateFromOrderDisabled": false,
  "isB2CGetOrCreateFromOrderDisabled": false,
  "isB2BGetOrCreateDisabled": false,
  "isB2CGetOrCreateDisabled": false,
  "punchOutSettings": {
    "unitConversionLists": [
      {
        "unitConversionListName": "SAP Standard",
        "unitConversionListId": "sap-standard",
        "unitConversions": [
          {
            "isoCode": "PCE",
            "ociCode": "EA"
          },
          {
            "isoCode": "KGM",
            "ociCode": "KG"
          }
        ]
      }
    ]
  },
  "requiredAddressProperties": ["Line1", "City", "PostalCode", "CountryCode"],
  "defaultProperties": [
    {
      "key": "PreferredContactMethod",
      "value": "Email",
      "valueType": "DropDown",
      "valueOptions": ["Email", "Phone", "SMS"],
      "isCustomValueOptionAllowed": false,
      "isMultiSelectEnabled": false,
      "readOnly": false
    }
  ],
  "useExternalBonusPointsProvider": false,
  "useStatsCustomerQueues": true,
  "tagSettings": [
    {
      "name": "Wholesale",
      "translationKey": "CustomerTag_Wholesale"
    }
  ],
  "b2CConsentTypes": [
    {
      "type": "EmailMarketing",
      "content": "I want to receive offers and news by email.",
      "isRequired": false,
      "isFeatured": true,
      "marketIds": ["NOR", "SWE"]
    }
  ],
  "b2BConsentTypes": [
    {
      "type": "B2BNewsletter",
      "content": "Send the monthly trade newsletter to this company.",
      "isRequired": false,
      "isFeatured": false
    }
  ]
}
```

## Models

The tables list each field by its PascalCase name, as the [order configuration](../Order/order-config.md) page does. In the JSON response the names are camelCase: `IsExcludedFromReservedInventory` is returned as `isExcludedFromReservedInventory`, and `B2CConsentTypes` as `b2CConsentTypes`. Fields that are not listed in the tables, or in the notes below them, are not part of the response.

### Order type

| Field | Type | Description |
| --- | --- | --- |
| `Name` | string | Order type name, for example `Online`, `ClickAndCollect` or `Pos`. |
| `EnableEdit` | bool | Whether orders of this type are editable in the Omnium UI. |
| `EnableCreateFromCart` | bool | `true` if orders of this type can be created from a cart. |
| `DisableWorkflow` | bool | Temporarily disables the workflow for the order type. |
| `DefaultOrderType` | bool | `true` if this is a default order type. The order list is filtered on the default order types by default. |
| `DefaultExternalIdProvider` | string | External ID provider that the [Set Default External ID](../Order/workflow-steps/enrichment/set-default-external-id.md) workflow step adds to the order's list of external IDs. |
| `OrderStatuses` | array | The order statuses of the order type. See [Order status](settings-api.md#order-status). Not returned when empty. |
| `DeriveOrderStatusFromShipments` | bool | When `true`, the order status follows the shipment statuses. The order gets the main status (`IsMainFilter`) of the least advanced shipment's sort order level. |

### Order status

Order statuses appear in `OrderStatuses` on an order type.

| Field | Type | Description |
| --- | --- | --- |
| `Name` | string | Order status name. This is the internal name that is saved on the order, for example `New` or `InProgress`. |
| `DisplayName` | string | Alternative order status name: the readable name shown in the Omnium UI when `TranslateKey` has no translation. |
| `IsMainFilter` | bool | `true` if the status shows as a step in the status bar. Used for the steps of the normal workflow. |
| `Order` | int | Status sort order index: the position of the status in the workflow. When several statuses have the same index, `Condition` decides which status is used. |
| `Condition` | string | Condition for selecting the status when several statuses have the same `Order`: the shipment type that must be selected, for example `Delivery`, `Transit` or `Pickup`. |
| `IsCanceledStatus` | bool | `true` if Omnium counts orders in this status as canceled. |
| `IsDeliveredStatus` | bool | `true` if Omnium counts orders in this status as delivered to the customer. |
| `IsExcludedFromReservedInventory` | bool | `true` if orders with this status do not reserve inventory in Omnium, for example because the ERP has already reserved the items. Recalculation of [reserved inventory](../Order/workflow-steps/inventory/recalculate-reserved-inventory.md) leaves these orders out, as it does orders in delivered and canceled statuses. |
| `IsInProgressStatus` | bool | `true` if Omnium counts orders in this status as in progress. |
| `IsPicked` | bool | `true` if orders with this status are picked. Pick lists set the order to this status when the items are picked. |
| `ShipmentStatusUpdate` | string | If set, the shipments on the order get this status. |
| `MainOrderStatus` | string | On an order with several shipments: when the statuses of all shipments that are not canceled have the same `MainOrderStatus`, the order gets that status. Not used when `DeriveOrderStatusFromShipments` is `true`. |
| `EnforceAvailableStepsPolicy` | bool | When `true`, the Omnium UI only offers the statuses in `AvailableSteps` as the next status. Otherwise the UI suggests the next status, but users can choose any status of the order type. Not returned when not set. |
| `AvailableSteps` | array | List of available next order statuses. Used when `EnforceAvailableStepsPolicy` is `true`. |
| `WorkflowSteps` | array | Workflow steps to run. See [Workflow step](settings-api.md#workflow-step). Not returned when empty. |
| `TranslateKey` | string | Translation key for the order status. |
| `Color` | string | Color of the status badge in the Omnium UI: `Blue`, `Orange`, `Purple`, `Green`, `Red`, `Yellow`, `Teal` or `Grey`. Empty or left out when the status keeps its default color. |
| `Properties` | array | Custom properties. See [Property item](settings-api.md#property-item). |
| `UpdateStatusButtonIsDisabledInGui` | bool | If `true`, the button for updating to the next order status is disabled in the Omnium UI. |

### Workflow step

Workflow steps appear in `WorkflowSteps` on an order status and in `AvailableManualWorkflowSteps` in the order settings. See [workflow steps](../Order/workflow-steps.md) for the available steps.

| Field | Type | Description |
| --- | --- | --- |
| `Name` | string | Workflow step name, for example `ExportOrder`. |
| `Active` | bool | `true` if the step should run. |
| `RunAfterOrderIsSaved` | bool | `true` if the step runs after the order is saved. |
| `StopOnError` | bool | If `true`, the workflow does not continue if this step fails. |
| `TranslateKey` | string | Translation key for the workflow step name. |
| `Connector` | string | Connector to use for the workflow step. |
| `IsInvisible` | bool | `true` if the result is not shown in the Omnium UI. |
| `EnabledForMarkets` | array | Market IDs where the step is enabled. All markets when empty. |
| `DisabledForMarkets` | array | Market IDs where the step is disabled. Overrides `EnabledForMarkets`. |
| `EnabledForStores` | array | Store IDs where the step is enabled. All stores when empty. |
| `DisabledForStores` | array | Store IDs where the step is disabled. Overrides `EnabledForStores`. |
| `EnabledForWarehouses` | array | Warehouses where the step is enabled. All warehouses when empty. |
| `DisabledForWarehouses` | array | Warehouses where the step is disabled. Overrides `EnabledForWarehouses`. |
| `EnabledForShipmentOptions` | array | Shipment option names where the step is enabled. All shipment options when empty. |
| `DisabledForShipmentOptions` | array | Shipment option names where the step is disabled. Overrides `EnabledForShipmentOptions`. |
| `Properties` | array | Workflow step properties. See [Property item](settings-api.md#property-item). |
| `WorkflowStepConditions` | array | Workflow step conditions. See [Workflow step condition](settings-api.md#workflow-step-condition). Not returned when empty. |

Each workflow step in the response also contains `index`, `current`, `hiddenFromCustomer`, `hiddenFromPartner` and `isCommentsDisabled`. The Settings API does not set these fields, so they are always `0` or `false`. Restrictions on order tags, market groups and store groups are not part of the response.

### Workflow step condition

| Field | Type | Description |
| --- | --- | --- |
| `Type` | string | Condition type: `IsActionResultErrors`, `IsActionResultWarnings` or `IsActionResultSuccess`. |

### Property item

Custom properties on order statuses and workflow steps. See [properties](generic.md#properties).

| Field | Type | Description |
| --- | --- | --- |
| `Key` | string | Property key. |
| `Value` | string | Property value. |
| `ValueType` | string | Data type, for example `Number`, `Xhtml`, `String`, `DateTime` or `Boolean`. |
| `KeyGroup` | string | Used to group properties. |

### Default property item

Default properties are custom properties defined in the tenant settings. They appear in the [order line settings](settings-api.md#order-line-settings) and the [customer settings](settings-api.md#customer-settings).

| Field | Type | Description |
| --- | --- | --- |
| `Key` | string | Property key. |
| `Value` | string | Default value for the property. |
| `ValueType` | string | Data type, for example `String`, `Number`, `Boolean` or `DropDown`. |
| `KeyGroup` | string | Used to group properties. |
| `ValueOptions` | array | Predefined options for dropdown selection. |
| `IsCustomValueOptionAllowed` | bool | Allows custom values outside the predefined options. |
| `IsMultiSelectEnabled` | bool | Only relevant for the `DropDown` value type. If `true`, multiple values can be selected. |
| `ReadOnly` | bool | Makes the property read-only. |
| `PropertyOptionGroup` | string | Name of a centrally managed [property option group](property-options.md) whose values populate the dropdown. When set, it takes precedence over `ValueOptions`. |

### Order settings

The response contains the order settings below. See [order settings](../Order/order-config.md#order-settings) for how the order settings are configured.

| Field | Type | Description |
| --- | --- | --- |
| `ShouldOrderStoreIdBeSavedOnCustomer` | bool | When `true`, the store ID from the order is saved on the customer record. |
| `ShouldOrderMarketIdBeSavedOnCustomer` | bool | When `true`, the market ID from the order is saved on the customer record. |
| `ShouldOrderExternalIdsBeSavedOnCustomer` | bool | When `true`, external IDs from the order are copied to the customer record. |
| `ShouldCustomerExternalIdsBeSavedOnOrder` | bool | When `true`, carts, and orders created from carts, are enriched with the customer's external IDs. For other orders, use the [Enrich Order with Customer External IDs](../Order/workflow-steps/enrichment/enrich-order-with-customer-external-ids.md) workflow step. |
| `ShouldOrderPropertiesBeSavedOnCustomer` | bool | When `true`, custom properties from the order are saved on the customer record. |
| `ShouldCustomerPropertiesBeSavedOnOrder` | bool | When `true`, carts, and orders created from carts, are enriched with the customer's custom properties. For other orders, use the [Enrich Order with Customer Properties](../Order/workflow-steps/enrichment/enrich-order-with-customer-properties.md) workflow step. |
| `IsOrderCalculatorRunOnImport` | bool | When `true`, Omnium runs the price calculation on orders imported with [`POST /api/Orders/ImportMany`](../Order/api-reference.md#import-many-orders-batch) before it saves them. Orders marked read-only are always calculated, whatever this setting is. |
| `GiftCardTemplate` | string | HTML template used for the gift card email. |
| `GiftCardSku` | string | The product SKU or product ID used to identify gift card products in orders. |
| `GiftCardCompletedStatus` | string | Status that an order with only gift card lines gets when the obsolete `CreateAndSendGiftCards` workflow step creates its gift cards. If not set, `Ship` is used. The `CreateAndSendGiftCardsV2` step uses its `ChangeToStatus` property instead. |
| `DefaultExchangeTerms` | string | Default terms and conditions text for exchange orders. |
| `ReturnSettings` | object | Return settings. See [Return settings](settings-api.md#return-settings). |
| `ReplacementSettings` | object | Replacement settings. See [Replacement settings](settings-api.md#replacement-settings). |
| `ShowOrderTotalsExTax` | bool | When `true`, revenue is shown excluding tax in charts and gadgets in the Omnium UI. |
| `ShowOrderLinesExTax` | bool | When `true`, order line prices are displayed excluding tax in the Omnium UI. |
| `UneditableExternalIDs` | bool | When `true`, external IDs on orders are read-only in the Omnium UI. |
| `AvailableManualWorkflowSteps` | array | Workflow steps that can be triggered from the order action menu. See [Workflow step](settings-api.md#workflow-step). Not returned when empty. |
| `DefaultReplacementOrderType` | string | If set, replacement orders get this order type. If not set, the type is inherited from the order that was replaced. |
| `TagSettings` | array | Available order tags. See [Tag settings](settings-api.md#tag-settings). Not returned when empty. |
| `IncludedOrderTypesForRevenueStats` | array | Order types included in key numbers, average order values and revenue stats. If not set, the order types `Pos` and `Online` are used. |
| `UseStatsOrderQueues` | bool | When `true`, orders are copied to the stats order index for analytics and reporting. |
| `OrderLineSettings` | object | Order line settings. See [Order line settings](settings-api.md#order-line-settings). Not returned when not configured. |
| `IsInvoiceOriginal` | bool | When `true`, invoices are marked as original. When `false`, invoices are marked as a copy. |

### Return settings

| Field | Type | Description |
| --- | --- | --- |
| `ReturnTypes` | array | Return types. See [Return type](settings-api.md#return-type). Not returned when empty. |
| `DefaultUpdateStock` | bool | When `true`, the **Update stock** option is selected by default when you create a return. See [return settings](../Order/Returns/return-config.md#general-settings). |

### Return type

| Field | Type | Description |
| --- | --- | --- |
| `Id` | string | Unique identifier for the return type. |
| `TranslationKey` | string | Translation key for displaying the type in the UI. |
| `UpdateInventory` | bool | Whether this return type updates inventory (default: `true`). |

### Replacement settings

| Field | Type | Description |
| --- | --- | --- |
| `ReplacementTypes` | array | Available types or reasons for creating replacement orders. See [Replacement type](settings-api.md#replacement-type). Not returned when empty. |
| `IsMetaDataDeleted` | bool | When `true`, metadata is cleared from replacement orders. |
| `IsReplacementOrderUnreplaceable` | bool | When `true`, replacement orders cannot have their own replacements created. |
| `DeletedMetaDataOnOrderLine` | array | Metadata properties to remove from order lines when creating a replacement. |
| `DeletedMetaDataOnOrder` | array | Metadata properties to remove from the order when creating a replacement. |

### Replacement type

| Field | Type | Description |
| --- | --- | --- |
| `Id` | string | Unique identifier for the replacement type. |
| `TranslationKey` | string | Translation key for displaying the type in the UI. |

### Tag settings

Used for `TagSettings` in both the order settings and the customer settings.

| Field | Type | Description |
| --- | --- | --- |
| `Name` | string | Tag identifier. |
| `TranslationKey` | string | Translation key for the tag label. |

### Order line settings

| Field | Type | Description |
| --- | --- | --- |
| `DefaultProperties` | array | Default properties for order lines. See [Default property item](settings-api.md#default-property-item). |
| `SplitMultibuyPromotionOrderLines` | bool | When `true`, order lines are split when multibuy promotions are applied, so the promoted items can be tracked separately. |

### Customer settings

The response contains the customer settings below. See [customer configuration](../Customer/customer-config.md) for how the customer settings are configured.

| Field | Type | Description |
| --- | --- | --- |
| `IsB2BGetOrCreateFromOrderDisabled` | bool | When `true`, business (B2B) customers are not created automatically when orders are processed. |
| `IsB2CGetOrCreateFromOrderDisabled` | bool | When `true`, private (B2C) customers are not created automatically when orders are processed. |
| `IsB2BGetOrCreateDisabled` | bool | When `true`, the automatic get-or-create function for business (B2B) customers is disabled across all API endpoints. |
| `IsB2CGetOrCreateDisabled` | bool | When `true`, the automatic get-or-create function for private (B2C) customers is disabled across all API endpoints. |
| `PunchOutSettings` | object | Configuration for B2B PunchOut/OCI integration. See [PunchOut settings](settings-api.md#punchout-settings). Not returned when not configured. |
| `RequiredAddressProperties` | array | Names of the address properties that are required, for example `Line1` or `PostalCode`. See [address configuration](../Customer/customer-config.md#address-configuration). |
| `DefaultProperties` | array | Default properties for customers. See [Default property item](settings-api.md#default-property-item). |
| `UseExternalBonusPointsProvider` | bool | When `true`, the customer card shows the customer's bonus point balance from the external provider. |
| `UseStatsCustomerQueues` | bool | When `true`, private customers are copied to the statistics index for analytics. |
| `TagSettings` | array | Available customer tags. See [Tag settings](settings-api.md#tag-settings). Not returned when empty. |
| `B2CConsentTypes` | array | Consent types configured for private (B2C) customers: the customer setting `ConsentTypes`. See [Consent type](settings-api.md#consent-type). Not returned when empty. |
| `B2BConsentTypes` | array | Consent types configured for business (B2B) customers: the customer setting `BusinessConsentTypes`. See [Consent type](settings-api.md#consent-type). Not returned when empty. |

### Consent type

See [consent management](../Customer/customer-config.md#consent-management).

| Field | Type | Description |
| --- | --- | --- |
| `Type` | string | The consent type identifier, for example `EmailMarketing`. |
| `Content` | string | The consent content or description text. |
| `IsRequired` | bool | Whether this consent is required. |
| `IsFeatured` | bool | Whether this consent is featured (highlighted). |
| `MarketIds` | array | The markets this consent type applies to. An empty or missing list means the consent type applies to all markets. |

### PunchOut settings

| Field | Type | Description |
| --- | --- | --- |
| `UnitConversionLists` | array | Named lists for converting between ISO unit codes and OCI unit codes. See [Unit conversion list](settings-api.md#unit-conversion-list). Not returned when empty. |

### Unit conversion list

| Field | Type | Description |
| --- | --- | --- |
| `UnitConversionListName` | string | Display name for the conversion list. |
| `UnitConversionListId` | string | Unique identifier for the conversion list. |
| `UnitConversions` | array | Unit code mappings. See [Unit conversion](settings-api.md#unit-conversion). Not returned when empty. |

### Unit conversion

| Field | Type | Description |
| --- | --- | --- |
| `IsoCode` | string | Standard ISO unit code, for example `PCE` or `KGM`. |
| `OciCode` | string | OCI or cXML unit code used by the procurement system, for example `EA` or `KG`. |

## Related documentation

*   [Order configuration](../Order/order-config.md): order types, order statuses, workflow steps and order settings
*   [Workflow steps](../Order/workflow-steps.md): the workflow steps that can appear in `WorkflowSteps`
*   [Customer configuration](../Customer/customer-config.md): customer settings, consent types and PunchOut settings
*   [API Developer Guide](../GettingStartedWithAPI/api-developer-guide.md): authentication, roles and permissions

* * *

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
