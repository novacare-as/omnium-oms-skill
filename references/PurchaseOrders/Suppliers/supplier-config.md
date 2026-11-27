# Configuration

Source: https://docs.omnium.no/docs/PurchaseOrders/Suppliers/supplier-config

> Configure supplier settings in Omnium, including local access control, tags, default properties, address types, and lead time defaults. This guide covers all supplier configuration options for administrators and developers.

## Supplier settings overview

Supplier settings control how suppliers are created, accessed, and categorized in Omnium. These settings are managed through **Configuration > Settings > Products > Supplier Settings** in the Omnium UI.

The available configuration options include:

*   **Local supplier access control** — Restrict supplier visibility based on user store assignments
*   **Tags** — Predefined categories for classifying suppliers
*   **Default properties** — Custom fields displayed on supplier forms
*   **Address types** — Allowed address purpose labels for supplier addresses
*   **Lead time defaults** — Tenant-wide fallback values for supplier lead times

* * *

## Local supplier access control

When enabled, local supplier access control restricts which suppliers non-admin users can see and work with, based on their assigned stores.

### UseLocalSupplier

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| UseLocalSupplier | bool | false | When enabled, non-admin users only see suppliers linked to their assigned stores. Supplier assortment (StoreIds/StoreGroupIds) is automatically set on creation based on the creating user's store assignments. |

Users with **Admin** or **ApiOwner** roles are exempt from local supplier filtering. They can always see and manage all suppliers regardless of this setting.

### Access management mode

When `UseLocalSupplier` is enabled, you can further control how store assignments are applied to new suppliers.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| PrioritizeStoreGroupsOnCreate | bool | false | Only relevant when `UseLocalSupplier` is enabled. When enabled, the creating user's store group IDs are assigned to the supplier instead of individual store IDs. If a store does not have a `StoreGroupId`, the individual `StoreId` is used as a fallback. |

The two modes work as follows:

```
PrioritizeStoreGroupsOnCreate = false (default)
┌─────────────────────────────────────┐
│ User creates supplier               │
│ → User's assigned StoreIds are      │
│   added to supplier.StoreIds        │
└─────────────────────────────────────┘

PrioritizeStoreGroupsOnCreate = true
┌─────────────────────────────────────┐
│ User creates supplier               │
│ → For each user store:              │
│   ├─ Has StoreGroupId?              │
│   │  → Add StoreGroupId to          │
│   │    supplier.StoreGroupIds       │
│   └─ No StoreGroupId?              │
│      → Add StoreId to              │
│        supplier.StoreIds            │
└─────────────────────────────────────┘
```

### How local filtering works

When `UseLocalSupplier` is enabled and a non-admin user searches for suppliers, Omnium filters results to only include suppliers where:

1.  The supplier's `StoreIds` contain any of the user's assigned store IDs, **or**
2.  The supplier's `StoreGroupIds` contain any of the user's assigned store group IDs

### Sample

```
"ProductSettings": {
  "SupplierSettings": {
    "UseLocalSupplier": true,
    "PrioritizeStoreGroupsOnCreate": true
  }
}
```

* * *

## Tags

Tags provide predefined categories for classifying and filtering suppliers. Each tag has a name and an optional translation key for localized display.

### Tag settings model

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Tag identifier used as the tag value |
| TranslationKey | string | Translation key for displaying a localized tag label in the UI |

Tags can be reordered using drag-and-drop in the administration UI. The display order in the UI matches the order in the configuration.

### Sample

```
"ProductSettings": {
  "SupplierSettings": {
    "TagSettings": [
      { "Name": "Domestic", "TranslationKey": "Tag_Domestic" },
      { "Name": "Import", "TranslationKey": "Tag_Import" },
      { "Name": "Dropship", "TranslationKey": "Tag_Dropship" },
      { "Name": "Consignment", "TranslationKey": "Tag_Consignment" }
    ]
  }
}
```

* * *

## Default properties

Default properties define custom fields that are automatically available on all supplier forms. They allow you to capture structured data specific to your procurement process.

### Default property model

| Property | Type | Description |
| --- | --- | --- |
| **Key** \* | string | Property identifier (unique name) |
| Value | string | Default value for the property |
| ValueType | string | Data type for the property. See [supported value types](supplier-config.md#supported-value-types) below. |
| KeyGroup | string | Grouping category for organizing properties in the UI |
| ValueOptions | List<string> | Predefined options for dropdown selection |
| IsCustomValueOptionAllowed | bool | Allow free-text values in addition to predefined options |
| IsMultiSelectEnabled | bool | Allow selecting multiple values from the options list |
| ReadOnly | bool | Make the property read-only in the UI |

### Supported value types

| Value type | Description |
| --- | --- |
| String | Plain text input |
| Number | Numeric input |
| Boolean | True/false toggle |
| DateTime | Date and time picker |
| Date | Date-only picker |
| Textarea | Multi-line text input |
| Xhtml | Rich text editor |
| File | File upload |
| JSON | JSON editor |
| Store | Store selector |
| DropDown | Dropdown selector (uses ValueOptions) |

### Sample

```
"ProductSettings": {
  "SupplierSettings": {
    "DefaultProperties": [
      {
        "Key": "CertificationType",
        "Value": "",
        "ValueType": "String",
        "KeyGroup": "Compliance",
        "ValueOptions": ["ISO 9001", "ISO 14001", "GOTS", "Fair Trade"],
        "IsMultiSelectEnabled": true,
        "IsCustomValueOptionAllowed": false
      },
      {
        "Key": "SupplierRating",
        "Value": "Unrated",
        "ValueType": "DropDown",
        "KeyGroup": "Compliance",
        "ValueOptions": ["Unrated", "Bronze", "Silver", "Gold", "Platinum"],
        "ReadOnly": false
      },
      {
        "Key": "ContractExpiry",
        "ValueType": "Date",
        "KeyGroup": "Contract"
      },
      {
        "Key": "Notes",
        "ValueType": "Textarea",
        "KeyGroup": "General"
      }
    ]
  }
}
```

* * *

## Address types

Address types define the allowed purpose labels for supplier addresses. When configured, users select from these predefined types when adding addresses to a supplier.

### Sample

```
"ProductSettings": {
  "SupplierSettings": {
    "AddressTypes": [
      "Headquarters",
      "Billing",
      "Delivery",
      "Warehouse",
      "Returns"
    ]
  }
}
```

* * *

## Lead time defaults

Lead time values are central to Omnium's reorder suggestion calculations. While lead time is primarily configured at the supplier or product level, two tenant-wide settings provide fallback values when no specific lead time is defined.

These settings are not part of `SupplierSettings` — they are configured under `ProductSettings` and `PurchaseOrderSettings` respectively. They are documented here because they directly affect supplier-related calculations.

### Lead time resolution order

When calculating lead time for reorder suggestions, Omnium checks the following sources in order and uses the first value greater than zero:

```
1. Variant.LeadTime           (product variant)
       ↓ (if not set)
2. Product.LeadTime           (parent product)
       ↓ (if not set)
3. Supplier.DefaultLeadTime   (supplier)
       ↓ (if not set)
4. ProductSettings.DefaultSupplierLeadTime  (tenant setting)
       ↓ (if not set)
5. 10 days                    (hardcoded default)
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DefaultSupplierLeadTime | int? | null | Tenant-wide fallback lead time in days. Used when no lead time is defined on the variant, product, or supplier. Falls back to 10 days if not set. Configured under **Configuration > Settings > Products**. |

### Safety margin resolution

A safety margin is added on top of the lead time to account for delivery variability. The resolution order is:

```
1. Supplier.DefaultLeadTimeSafetyMarginDays  (supplier)
       ↓ (if not set)
2. PurchaseOrderSettings.LeadTimeSafetyMarginDays  (tenant setting)
       ↓ (if not set)
3. 7 days                    (hardcoded default)
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| LeadTimeSafetyMarginDays | int | 0 | Fallback safety margin in days when a supplier does not have a specific safety margin configured. Falls back to 7 days if no value is set anywhere. Configured under **Configuration > Settings > Products > Purchase Order Settings**. |

For more details on how lead time affects reorder planning, see the [Suppliers overview](../Suppliers.md) and [Purchase Order configuration](../purchase-order-config.md).

* * *

## Complete configuration example

Below is a comprehensive example showing all supplier settings configured together:

```json
{
  "ProductSettings": {
    "DefaultSupplierLeadTime": 14,
    "SupplierSettings": {
      "UseLocalSupplier": true,
      "PrioritizeStoreGroupsOnCreate": false,
      "DefaultProperties": [
        {
          "Key": "CertificationType",
          "Value": "",
          "ValueType": "String",
          "KeyGroup": "Compliance",
          "ValueOptions": ["ISO 9001", "ISO 14001", "GOTS", "Fair Trade"],
          "IsMultiSelectEnabled": true,
          "IsCustomValueOptionAllowed": false
        },
        {
          "Key": "SupplierRating",
          "Value": "Unrated",
          "ValueType": "DropDown",
          "KeyGroup": "Compliance",
          "ValueOptions": ["Unrated", "Bronze", "Silver", "Gold", "Platinum"]
        },
        {
          "Key": "ContractExpiry",
          "ValueType": "Date",
          "KeyGroup": "Contract"
        }
      ],
      "TagSettings": [
        { "Name": "Domestic", "TranslationKey": "Tag_Domestic" },
        { "Name": "Import", "TranslationKey": "Tag_Import" },
        { "Name": "Dropship", "TranslationKey": "Tag_Dropship" },
        { "Name": "Consignment", "TranslationKey": "Tag_Consignment" }
      ],
      "AddressTypes": [
        "Headquarters",
        "Billing",
        "Delivery",
        "Warehouse",
        "Returns"
      ]
    }
  },
  "PurchaseOrderSettings": {
    "LeadTimeSafetyMarginDays": 3
  }
}
```
