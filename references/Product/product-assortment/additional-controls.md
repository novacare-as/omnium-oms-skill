# Additional Controls

Source: https://docs.omnium.no/docs/Product/product-assortment/additional-controls

> IsActive, publish dates, inventory, and other product visibility controls

Beyond the main assortment mechanisms, Omnium provides several additional controls for fine-grained product visibility management.

* * *

## IsActive Flag

The most fundamental visibility control is the `isActive` flag.

### Product Property

```json
{
  "id": "product-123",
  "isActive": true
}
```

### Filtering Behavior

| Setting | Behavior |
| --- | --- |
| `filterByActiveAsDefault: true` | Product search defaults to `isActive = true` |
| `filterByActiveAsDefault: false` | All products shown unless filtered |

### API

```
PATCH /api/Products/{productId}
{
  "isActive": false
}
```

The `isActive` property is always indexed, meaning you can filter by `isActive = false` to find inactive products.

* * *

## Publication Dates

Control when products become visible and when they should be hidden.

### Date Properties

| Property | Type | Description |
| --- | --- | --- |
| `published` | DateTime? | When the product becomes visible |
| `stopPublished` | DateTime? | When the product should be hidden |
| `discontinued` | DateTime? | When the product was discontinued |

### Example

```json
{
  "id": "product-123",
  "published": "2025-02-01T00:00:00Z",
  "stopPublished": "2025-03-31T23:59:59Z",
  "discontinued": null
}
```

### Publication Logic

A product is considered "published" when:

*   `isActive = true`
*   `published` is null OR `published <= now`
*   `stopPublished` is null OR `stopPublished >= now`

### Use Cases

**Pre-Launch Products:**

```json
{
  "published": "2025-06-01T00:00:00Z",
  "isActive": true
}
```

Product exists but won't appear until June 1st.

**Time-Limited Products:**

```json
{
  "published": "2025-01-15T00:00:00Z",
  "stopPublished": "2025-01-31T23:59:59Z"
}
```

Product visible only during promotional period.

**Phasing Out:**

```json
{
  "discontinued": "2025-01-01T00:00:00Z",
  "stopPublished": "2025-03-01T00:00:00Z"
}
```

Product marked discontinued, will be hidden after March 1st.

* * *

## Product Status

Beyond IsActive, products can have a status field for workflow management.

### Status Property

```json
{
  "status": "Published"
}
```

### Common Status Values

| Status | Description |
| --- | --- |
| `Draft` | Work in progress, not visible |
| `Review` | Pending approval |
| `Approved` | Approved but not yet published |
| `Published` | Active and visible |
| `Deleted` | Soft-deleted |

### Search Filtering

```
POST /api/Products/SearchProducts
{
  "productStatus": ["Published", "Approved"]
}
```

### Configuration

Define available statuses in tenant settings:

```json
{
  "ProductSettings": {
    "ProductStatuses": [
      { "Name": "draft", "TranslateKey": "ProductStatus_Draft" },
      { "Name": "review", "TranslateKey": "ProductStatus_Review" },
      { "Name": "published", "TranslateKey": "ProductStatus_Published" }
    ]
  }
}
```

* * *

## Inventory-Based Visibility

Control visibility based on stock levels.

### Inventory Properties

| Property | Type | Description |
| --- | --- | --- |
| `isInStock` | bool | Whether product has available inventory |
| `inventoryStatus` | string | Status like "OutOfStock", "LowInStock", "HighInStock" |

### Search Parameters

```
POST /api/Products/SearchProducts
{
  "isInStock": true,
  "inStockWarehouseIds": ["warehouse-oslo", "warehouse-bergen"]
}
```

### Inventory Status Values

| Status | Description |
| --- | --- |
| `OutOfStock` | No inventory available |
| `LowInStock` | Below threshold |
| `HighInStock` | Above threshold |

* * *

## Local Products

Products can be marked as "local" to specific stores.

### Enabling Local Products

```json
{
  "ProductSettings": {
    "IsLocalProductsEnabled": true
  }
}
```

### Product Property

```json
{
  "isLocalProduct": true,
  "storeIds": ["oslo-store"]
}
```

### Access Control

When `isLocalProductsEnabled` is true:

*   Local products are only visible to users with access to the associated stores
*   Non-local products follow normal visibility rules

* * *

## Tags and Exclusions

Products can have tags that affect visibility.

### Tag-Based Filtering

```
POST /api/Products/SearchProducts
{
  "tags": ["new-arrival", "sale"],
  "excludedTags": ["discontinued", "hidden"]
}
```

### Special Flags

| Property | Type | Description |
| --- | --- | --- |
| `isNotRatable` | bool | Exclude from rating systems |
| `excludeFromPromotions` | bool | Exclude from promotional displays |
| `isExcludedFromAnalytics` | bool | Exclude from analytics (e.g., gift cards) |

* * *

## Tenant Settings Summary

All visibility-related settings in tenant configuration:

### ProductSettings

```json
{
  "ProductSettings": {
    "FilterByActiveAsDefault": true,
    "IsAssortmentStoreIdRequired": false,
    "IsAssortmentCodesRequired": false,
    "RequireProductMarket": false,
    "IsLocalProductsEnabled": false,
    "IsProductAssortmentUpdatedByPrices": false,
    "IsProductAssortmentUpdatedByStoreCategories": false
  }
}
```

### Effect Matrix

| Setting | When Enabled |
| --- | --- |
| `filterByActiveAsDefault` | Default search shows only active products |
| `isAssortmentStoreIdRequired` | Products must have matching storeIds |
| `isAssortmentCodesRequired` | Products must have matching assortment codes |
| `requireProductMarket` | Products must have marketIds to be searchable |
| `isLocalProductsEnabled` | Local products restricted by user store access |

* * *

## Search Request Parameters

Complete list of visibility-related search parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `isActive` | bool? | Filter by active status |
| `storeId` | string | Filter by store |
| `marketId` | string | Filter by market |
| `customerId` | string | Apply customer restrictions |
| `assortmentCodes` | List<string> | Filter by assortment codes |
| `isInStock` | bool? | Only show in-stock products |
| `productStatus` | List<string> | Filter by status values |
| `tags` | List<string> | Include products with these tags |
| `excludedTags` | List<string> | Exclude products with these tags |
| `ignoreCustomerAssortment` | bool | Bypass customer restrictions |
| `isAssortmentCodesRequired` | bool? | Override tenant setting |

* * *

## Filter Combination Logic

All visibility filters are combined with AND logic:

```
Final Result =
    StoreId Match
    AND MarketId Match
    AND AssortmentCode Match (if applicable)
    AND Customer Category Match (if applicable)
    AND IsActive = true (if filterByActiveAsDefault)
    AND Published Date Valid
    AND StopPublished Date Valid
    AND Inventory Available (if isInStock)
    AND Status Match (if specified)
    AND Tags Match (if specified)
    AND NOT ExcludedTags
```

* * *

## Best Practices

### Layered Visibility

Use multiple controls for different purposes:

1.  **IsActive**: Master on/off switch
2.  **Published/StopPublished**: Temporal control
3.  **Status**: Workflow management
4.  **Assortment**: Channel/customer control

### Performance Considerations

*   Use `filterByActiveAsDefault: true` to avoid scanning inactive products
*   Index frequently-filtered fields as Keywords
*   Use date ranges sparingly in large catalogs

### Audit Trail

Key fields for tracking visibility changes:

*   `modified` timestamp
*   `modifiedBy` user
*   Product event log (if enabled)

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Product not visible anywhere | `isActive = false` | Set `isActive = true` |
| Product appeared then disappeared | `stopPublished` date passed | Update or remove `stopPublished` |
| Product not visible despite being active | Multiple filters not passing | Check all visibility properties |
| Can't find product in admin | `filterByActiveAsDefault` enabled | Search with `isActive: null` |
| Product visible when it shouldn't be | Date filter not applied | Verify date formats and timezone |
