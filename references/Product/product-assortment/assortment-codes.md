# Assortment Codes

Source: https://docs.omnium.no/docs/Product/product-assortment/assortment-codes

> Time-based product groupings for seasonal and customer-specific assortments

Assortment codes provide a flexible way to group products for different sales channels, customer segments, or time periods. Unlike static store assignments, assortment codes support validity dates for temporal control.

* * *

## What Are Assortment Codes?

Assortment codes are identifiers that can be assigned to both **products** and **customers**. When a customer has assortment codes, they only see products matching those codes.

### Model Structure

```json
{
  "assortmentCodeId": "retail",
  "validFrom": "2025-01-01T00:00:00Z",
  "validTo": "2025-12-31T23:59:59Z"
}
```

| Property | Type | Description |
| --- | --- | --- |
| `assortmentCodeId` | string | Unique identifier for the assortment |
| `validFrom` | DateTime? | When this assortment assignment becomes active |
| `validTo` | DateTime? | When this assortment assignment expires |

* * *

## Use Cases

### Seasonal Assortments

Products can transition between assortments over time:

```json
{
  "assortmentCodes": [
    {
      "assortmentCodeId": "winter-2025",
      "validFrom": "2025-01-01T00:00:00Z",
      "validTo": "2025-03-31T23:59:59Z"
    },
    {
      "assortmentCodeId": "spring-2025",
      "validFrom": "2025-04-01T00:00:00Z",
      "validTo": "2025-06-30T23:59:59Z"
    }
  ]
}
```

### Customer Segments

Different customers can see different product catalogs:

*   **Retail customers**: See products with "retail" assortment code
*   **Wholesale customers**: See products with "wholesale" assortment code
*   **VIP customers**: See products with "vip" or "exclusive" assortment codes

### Sales Channels

*   **Online**: Products with "online" assortment code
*   **In-store**: Products with "instore" assortment code
*   **Marketplace**: Products with "marketplace" assortment code

* * *

## Product Configuration

### Assigning Assortment Codes

```
PATCH /api/Products/{productId}
Content-Type: application/json

{
  "assortmentCodes": [
    {
      "assortmentCodeId": "retail",
      "validFrom": "2025-01-01T00:00:00Z",
      "validTo": null
    }
  ]
}
```

### Multiple Assortment Codes

When `isMultipleAssortmentCodesAllowed` is **enabled**, products can have multiple codes:

```json
{
  "assortmentCodes": [
    { "assortmentCodeId": "retail", "validFrom": null, "validTo": null },
    { "assortmentCodeId": "online", "validFrom": null, "validTo": null }
  ]
}
```

When **disabled**, Omnium automatically chains codes by time:

```json
{
  "assortmentCodes": [
    {
      "assortmentCodeId": "pre-release",
      "validFrom": "2025-01-01T00:00:00Z",
      "validTo": "2025-02-01T00:00:00Z"  // Auto-calculated
    },
    {
      "assortmentCodeId": "retail",
      "validFrom": "2025-02-01T00:00:00Z",
      "validTo": null
    }
  ]
}
```

* * *

## Customer Configuration

### Business Customer Assortment

Business customers can have assortment codes that restrict their product visibility:

```json
{
  "customerId": "business-123",
  "assortmentCodes": [
    { "assortmentCodeId": "wholesale", "validFrom": null, "validTo": null }
  ],
  "isAssortmentRestricted": true
}
```

When `isAssortmentRestricted` is true:

*   Customer only sees products matching their assortment codes
*   Products without any assortment codes are **excluded**

* * *

## Search Filtering

### How Filtering Works

```
Search Request
    │
    ├── Has AssortmentCodes in request?
    │   ├── Yes → Filter products with matching codes AND valid dates
    │   └── No → Check configuration
    │           ├── isAssortmentCodesRequired = true?
    │           │   └── Yes → Return products WITHOUT assortment codes
    │           └── No → Return all products (no assortment filter)
```

### Search Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `assortmentCodes` | List<string> | Filter by these assortment code IDs |
| `isAssortmentCodesRequired` | bool? | Override tenant setting for this request |
| `ignoreCustomerAssortment` | bool | When true, ignore customer's assortment codes |

### Example Search

```
POST /api/Products/SearchProducts
Content-Type: application/json

{
  "assortmentCodes": ["retail", "online"],
  "query": "headphones"
}
```

* * *

## Configuration Settings

### Tenant Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `isAssortmentCodesRequired` | bool | false | Products must have matching codes |
| `isMultipleAssortmentCodesAllowed` | bool | false | Products can have multiple simultaneous codes |
| `assortmentCodes` | List | null | Available assortment code definitions |

### Defining Available Codes

Configure available assortment codes in tenant settings:

```json
{
  "ProductSettings": {
    "AssortmentCodes": [
      { "Id": "retail", "TranslationKey": "AssortmentCode_Retail" },
      { "Id": "wholesale", "TranslationKey": "AssortmentCode_Wholesale" },
      { "Id": "online", "TranslationKey": "AssortmentCode_Online" },
      { "Id": "vip", "TranslationKey": "AssortmentCode_VIP" }
    ]
  }
}
```

* * *

## Purchase Order Restrictions

Certain assortment codes can prevent products from being purchased (e.g., display-only products):

```json
{
  "PurchaseOrderSettings": {
    "NonPurchasableAssortmentCodes": ["display-only", "discontinued"]
  }
}
```

Products with these codes will fail validation when added to purchase orders.

* * *

## Data Import

Assortment codes can be bulk-imported via Excel. The import handler:

1.  Validates that the assortment code doesn't already exist on the product
2.  Adds the new assortment code with specified dates
3.  Triggers product enrichment and event logging

### Excel Format

| ProductId | AssortmentCodeId | ValidFrom | ValidTo |
| --- | --- | --- | --- |
| product-123 | retail | 2025-01-01 |  |
| product-456 | wholesale | 2025-01-01 | 2025-12-31 |

* * *

## Time-Based Behavior

### Automatic ValidTo Calculation

When `isMultipleAssortmentCodesAllowed` is **false**, Omnium automatically calculates `ValidTo` dates:

1.  Codes are sorted by `ValidFrom`
2.  Each code's `ValidTo` is set to the next code's `ValidFrom`
3.  The last code has no `ValidTo` (never expires)

This ensures seamless transitions between assortments without gaps.

### Current Time Filtering

During search, only assortment codes where:

*   `ValidFrom` is null OR `ValidFrom <= now`
*   `ValidTo` is null OR `ValidTo >= now`

are considered active and matched against.

* * *

## Best Practices

### Naming Conventions

Use clear, descriptive assortment code IDs:

*   **By channel**: `online`, `instore`, `marketplace`
*   **By segment**: `retail`, `wholesale`, `b2b`, `vip`
*   **By season**: `spring-2025`, `winter-collection`
*   **By purpose**: `clearance`, `pre-release`, `exclusive`

### Transition Planning

When changing assortments:

1.  Add the new assortment code with a future `ValidFrom`
2.  The old code automatically expires (if `isMultipleAssortmentCodesAllowed` is false)
3.  Products smoothly transition without manual intervention

### Combining with Other Controls

Assortment codes work alongside other assortment mechanisms:

*   Products can have assortment codes AND store IDs
*   All filters are applied (AND logic)
*   Use assortment codes for customer segmentation, store IDs for location

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Customer can't see any products | `isAssortmentCodesRequired` true but customer has no matching codes | Verify customer assortment codes |
| Product visible despite expired code | `ValidTo` not being checked | Verify date format and timezone |
| Multiple codes not allowed | `isMultipleAssortmentCodesAllowed` is false | Enable setting or use time-based transitions |
| Purchase order fails | Product has non-purchasable assortment code | Check `NonPurchasableAssortmentCodes` setting |
| Codes not appearing in UI | Missing from tenant settings | Add to `AssortmentCodes` configuration |
