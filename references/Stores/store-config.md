# Configuration

Source: https://docs.omnium.no/docs/Stores/store-config

> Learn how to configure store settings, store groups, store roles, and default properties in Omnium. This guide covers all store-related configuration options for administrators and developers.

## Store settings

Store settings control the general behavior of store search, map display, and data maintenance across your tenant.

### Search and display

These settings control how stores are searched and displayed in the store locator and other interfaces.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsStoreSearchByZipDefault | bool | false | When enabled, the store locator defaults to ZIP code-based search instead of location-based search. Users can still switch between search modes, but ZIP code search will be the initial option. |
| RenderStoreMapWithStandardStyle | bool | false | Controls the visual styling of the store locator map. When enabled, uses standard map styling. When disabled, custom map styling can be applied to match your brand. |

#### Sample

```
"StoreSettings": {
  "IsStoreSearchByZipDefault": true,
  "RenderStoreMapWithStandardStyle": true
}
```

### Data maintenance

These settings control automatic cleanup and maintenance of store data.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DeleteAdditionalOpeningHoursThreshold | int | null | Number of days after which historical special opening hours are automatically deleted. When configured with the cleanup scheduled task, opening hours entries (such as holiday hours or temporary schedule changes) older than this threshold are removed to prevent data bloat. |

The `DeleteAdditionalOpeningHoursThreshold` setting requires the `DeleteHistoricalAdditionalOpeningHoursScheduledTask` scheduled task to be configured and running. See [Historical opening hours cleanup](store-config.md#historical-opening-hours-cleanup) for configuration details.

#### Sample

```
"StoreSettings": {
  "DeleteAdditionalOpeningHoursThreshold": 90
}
```

* * *

## Store groups

Store groups allow you to organize stores into logical groupings such as regions, brands, franchise networks, or business units. Groups are defined at the tenant level and individual stores reference them via the `StoreGroupId` property.

### Use cases

*   **Regional organization**: Group stores by geographic region (e.g., "Northern Region", "Southern Region", "Western Region")
*   **Brand divisions**: Separate stores by brand identity (e.g., "Premium Stores", "Outlet Stores", "Express Locations")
*   **Franchise networks**: Organize stores by franchise owner or operator
*   **Business units**: Group by internal business divisions or cost centers

### Store group model

| Property | Type | Description |
| --- | --- | --- |
| **StoreGroupId** \* | string | Unique identifier for the store group. This value is referenced by `Store.StoreGroupId` to assign stores to groups. Use consistent naming conventions (e.g., lowercase with hyphens). |
| **StoreGroupName** \* | string | Display name for the store group shown in the user interface. Use clear, descriptive names that users will recognize. |

### Sample

```
"StoreSettings": {
  "StoreGroups": [
    {
      "StoreGroupId": "region-north",
      "StoreGroupName": "Northern Region"
    },
    {
      "StoreGroupId": "region-south",
      "StoreGroupName": "Southern Region"
    },
    {
      "StoreGroupId": "region-east",
      "StoreGroupName": "Eastern Region"
    },
    {
      "StoreGroupId": "outlet",
      "StoreGroupName": "Outlet Stores"
    }
  ]
}
```

### Assigning stores to groups

After defining store groups in tenant settings, assign individual stores to groups by setting the `StoreGroupId` property on each store. A store can belong to one group at a time.

```json
{
  "StoreId": "store-001",
  "Name": "Oslo City Center",
  "StoreGroupId": "region-north"
}
```

* * *

## Store roles

Store roles classify stores and warehouses for fulfillment and operational purposes. Unlike store groups (which organize stores), roles define what a store can do. A store can have multiple roles, allowing flexible fulfillment configurations.

### Use cases

*   **Fulfillment capabilities**: Define which stores can handle specific order types (e.g., "Ship From Store", "Click and Collect", "Returns Processing")
*   **Warehouse classification**: Distinguish between regional hubs, distribution centers, and local pickup points
*   **Special handling**: Mark stores certified for specific operations (e.g., "Hazmat Certified", "Cold Chain", "Oversized Items")
*   **Order routing**: Control which warehouses are eligible for specific order allocations

### Store role model

| Property | Type | Description |
| --- | --- | --- |
| **StoreRoleId** \* | string | Unique identifier for the store role. This value is referenced by `Store.StoreRoleIds` to assign roles to stores. |
| **StoreRoleName** \* | string | Display name for the store role shown in the user interface. |

### Sample

```
"StoreSettings": {
  "StoreRoles": [
    {
      "StoreRoleId": "ship-from-store",
      "StoreRoleName": "Ship From Store"
    },
    {
      "StoreRoleId": "click-and-collect",
      "StoreRoleName": "Click and Collect"
    },
    {
      "StoreRoleId": "web-warehouse",
      "StoreRoleName": "Web Warehouse"
    },
    {
      "StoreRoleId": "returns-center",
      "StoreRoleName": "Returns Processing Center"
    }
  ]
}
```

### Assigning roles to stores

After defining store roles in tenant settings, assign roles to individual stores by setting the `StoreRoleIds` array on each store. A store can have multiple roles.

```json
{
  "StoreId": "warehouse-central",
  "Name": "Central Distribution Center",
  "StoreRoleIds": ["web-warehouse", "returns-center"]
}
```

### Role-based warehouse allocation

Store roles integrate with inventory management settings to control which warehouses can fulfill specific orders. Configure `WarehouseAllocationAvailableForStoreRoles` in your inventory settings to restrict order allocation to warehouses with specific roles.

See the [Inventory Management documentation](../Inventory/inventory-config.md) for details on configuring warehouse allocation rules based on store roles.

* * *

## Default properties

Default properties define a template of custom attributes that can be set on stores. This provides a standardized way to extend store data with tenant-specific information without modifying the core data model. Properties defined here appear in the store editor and can be used for filtering and reporting.

### Use cases

*   **Store classification**: Define store types (e.g., "Flagship", "Standard", "Express", "Outlet")
*   **Operational metadata**: Track operational details (e.g., square footage, parking capacity, fitting rooms count)
*   **Contact information**: Store additional contacts (e.g., regional manager email, maintenance contact)
*   **Business attributes**: Track business-specific data (e.g., franchise code, cost center, opening year)

### Default property model

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| **Key** \* | string | \- | Property identifier used as the key when storing and retrieving the value. Use consistent naming conventions (e.g., PascalCase or camelCase). |
| Value | string | null | Default value for the property. Pre-populates the field when creating new stores. |
| ValueType | string | null | Data type hint for the property (e.g., "String", "Number", "Boolean"). Used for UI rendering and validation. |
| KeyGroup | string | null | Optional grouping key to organize related properties together in the UI. |
| ValueOptions | List<string> | null | Predefined list of selectable values. When set, the property appears as a dropdown in the UI instead of a free-text field. |
| IsCustomValueOptionAllowed | bool | false | When enabled with `ValueOptions`, allows users to enter custom values in addition to selecting from the predefined list. |
| IsMultiSelectEnabled | bool | false | When enabled with `ValueOptions`, allows selecting multiple values from the list. Values are stored as a comma-separated string. |
| ReadOnly | bool | false | When enabled, the property value cannot be modified in the UI after initial creation. Useful for system-assigned or imported values. |

### Sample

```
"StoreSettings": {
  "DefaultProperties": [
    {
      "Key": "StoreType",
      "Value": "Standard",
      "ValueOptions": ["Flagship", "Standard", "Express", "Outlet"],
      "IsCustomValueOptionAllowed": false,
      "IsMultiSelectEnabled": false,
      "ReadOnly": false
    },
    {
      "Key": "StoreFormat",
      "ValueOptions": ["Full Service", "Self Service", "Hybrid"],
      "IsMultiSelectEnabled": true
    },
    {
      "Key": "SquareMeters",
      "ValueType": "Number"
    },
    {
      "Key": "RegionalManager",
      "KeyGroup": "Contacts"
    },
    {
      "Key": "LegacyStoreCode",
      "ReadOnly": true
    }
  ]
}
```

### Properties on stores

When a store is created or edited, the default properties appear in the store editor. The values are stored in the `Properties` array on the store object.

```json
{
  "StoreId": "store-001",
  "Name": "Oslo Flagship Store",
  "Properties": [
    { "Key": "StoreType", "Value": "Flagship" },
    { "Key": "StoreFormat", "Value": "Full Service,Self Service" },
    { "Key": "SquareMeters", "Value": "2500" },
    { "Key": "RegionalManager", "Value": "manager@company.com" },
    { "Key": "LegacyStoreCode", "Value": "OSL-001" }
  ]
}
```

### Filtering stores by properties

Store properties are indexed and can be used to filter stores via the API. This enables building custom reports or searches based on your tenant-specific attributes.

* * *

## Historical opening hours cleanup

Stores in Omnium can have special opening hours defined for specific dates (such as holidays, extended hours, or temporary closures). Over time, these historical entries accumulate and can increase document size. The cleanup feature automatically removes old entries to maintain optimal performance.

### Configuration

To enable automatic cleanup of historical opening hours:

1.  Set `DeleteAdditionalOpeningHoursThreshold` to the number of days to retain
2.  Configure and enable the `DeleteHistoricalAdditionalOpeningHoursScheduledTask` scheduled task

### How it works

When the scheduled task runs:

1.  It retrieves the configured threshold value (e.g., 30 days)
2.  For each store with special opening hours, it removes entries where the date is older than the threshold
3.  Example: With a threshold of 30 days, special opening hours from December 1st would be deleted when the task runs on January 1st or later

### Sample configuration

```json
{
  "StoreSettings": {
    "DeleteAdditionalOpeningHoursThreshold": 30
  },
  "ScheduledTaskSettings": [
    {
      "ImplementationType": "DeleteHistoricalAdditionalOpeningHoursScheduledTask",
      "Schedule": "0 2 * * *",
      "IsDisabled": false
    }
  ]
}
```

Setting a very low threshold (e.g., less than 7 days) may remove opening hours that are still relevant for customer communication. Consider your business needs when configuring this value.

* * *

## Complete configuration example

Below is a comprehensive example showing all store settings configured together:

```json
{
  "StoreSettings": {
    "IsStoreSearchByZipDefault": true,
    "RenderStoreMapWithStandardStyle": false,
    "DeleteAdditionalOpeningHoursThreshold": 60,

    "StoreGroups": [
      {
        "StoreGroupId": "region-north",
        "StoreGroupName": "Northern Region"
      },
      {
        "StoreGroupId": "region-south",
        "StoreGroupName": "Southern Region"
      },
      {
        "StoreGroupId": "region-east",
        "StoreGroupName": "Eastern Region"
      },
      {
        "StoreGroupId": "region-west",
        "StoreGroupName": "Western Region"
      }
    ],

    "StoreRoles": [
      {
        "StoreRoleId": "ship-from-store",
        "StoreRoleName": "Ship From Store"
      },
      {
        "StoreRoleId": "click-and-collect",
        "StoreRoleName": "Click and Collect"
      },
      {
        "StoreRoleId": "web-warehouse",
        "StoreRoleName": "Web Warehouse"
      },
      {
        "StoreRoleId": "returns-center",
        "StoreRoleName": "Returns Processing Center"
      },
      {
        "StoreRoleId": "express-delivery",
        "StoreRoleName": "Express Delivery Hub"
      }
    ],

    "DefaultProperties": [
      {
        "Key": "StoreType",
        "Value": "Standard",
        "ValueOptions": ["Flagship", "Standard", "Express", "Outlet"],
        "IsCustomValueOptionAllowed": false,
        "IsMultiSelectEnabled": false,
        "ReadOnly": false
      },
      {
        "Key": "StoreFormat",
        "ValueOptions": ["Full Service", "Self Service", "Hybrid"],
        "IsMultiSelectEnabled": true
      },
      {
        "Key": "SquareMeters",
        "ValueType": "Number"
      },
      {
        "Key": "ParkingSpaces",
        "ValueType": "Number"
      },
      {
        "Key": "RegionalManager",
        "KeyGroup": "Contacts"
      },
      {
        "Key": "MaintenanceContact",
        "KeyGroup": "Contacts"
      },
      {
        "Key": "OpeningYear",
        "ValueType": "Number",
        "ReadOnly": true
      },
      {
        "Key": "LegacyStoreCode",
        "ReadOnly": true
      }
    ]
  }
}
```
