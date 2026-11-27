# Local Products

Source: https://docs.omnium.no/docs/Product/local-products

> Store-specific product assortments with localized editing and access control

Local Products is a feature that enables physical stores to manage their own product assortment independently from the global catalog. Store staff can create and edit products that are only visible and editable by users with access to the stores where the products are sold.

* * *

## Overview

In a multi-store retail environment, individual stores often need to manage products that are unique to their location — such as locally sourced goods, store-exclusive items, or products with store-specific pricing. The Local Products feature provides this capability while maintaining central oversight for administrators.

| Aspect | Global Products | Local Products |
| --- | --- | --- |
| Visibility | All users with product access | Only users with access to assigned stores |
| Editing | Any user with product edit permissions | Only users with access to assigned stores |
| Store assignment | Optional | Required — defines who can see and edit |
| Creation default | Standard for admin users | Automatic for non-admin users (when enabled) |
| Cost prices | Shared across stores | Can be separated per store |

* * *

## How It Works

```
Product Created
      │
      ▼
┌─────────────────────────────────┐
│  IsLocalProduct = true?         │
│  ┌─── No ──→ Standard product   │
│  └─── Yes ──→ Continue ↓        │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  Assign StoreIds                │ ← From user's available stores
│  (expands to include all stores │    or explicitly selected
│   in same store groups)         │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  Access Control Applied         │
│  • User must have access to at  │
│    least one assigned store     │
│  • Admins bypass all checks     │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  Search & UI Filtering          │
│  • Products filtered by user's  │
│    available stores             │
│  • Non-editable products can    │
│    optionally be shown          │
└─────────────────────────────────┘
```

* * *

## Key Product Properties

| Property | Type | Description |
| --- | --- | --- |
| `isLocalProduct` | bool? | Flag marking the product as local. When `true`, store-based access control is enforced |
| `storeIds` | List<string> | Store IDs where this local product is available and editable |

### Example Product

```json
{
  "id": "local-bread-001_no",
  "productId": "local-bread-001",
  "name": "Artisan Sourdough Bread",
  "isLocalProduct": true,
  "storeIds": ["oslo-grunerløkka", "oslo-majorstuen"],
  "marketIds": ["no"]
}
```

* * *

## Store Group Expansion

When a local product is assigned to a store, Omnium automatically expands the assignment to include **all stores in the same store group**. This ensures consistent availability across related locations.

For example, if store `oslo-grunerløkka` belongs to the store group `oslo-stores`, and that group also contains `oslo-majorstuen` and `oslo-sentrum`, all three stores are automatically assigned.

Store group expansion only applies to stores that the current user has access to. Existing assignments to stores outside the user's access are preserved and cannot be accidentally removed.

* * *

## Search Filtering

When searching products with the local products filter enabled, the following parameters are available:

| Parameter | Type | Description |
| --- | --- | --- |
| `isLocalProduct` | bool? | Filter for local products only (`true`) or non-local products only (`false`) |
| `showNonEditableLocalProducts` | bool? | Include local products the user can see (via market access) but cannot edit |

### Example Search

```
POST /api/Products/Search
Content-Type: application/json

{
  "isLocalProduct": true,
  "query": "sourdough"
}
```

When `isLocalProduct` is `true` in a search request, the system automatically restricts results to stores the current user has access to — no additional store filtering is needed.

* * *

## Variant Behavior

Local product settings **cascade to variants**. When a parent product is marked as local and assigned to stores, the same assignments are applied to all its variants. This ensures consistent access control across the entire product family.

* * *

## Feature Overview

| Feature | Documentation |
| --- | --- |
| **Configuration** | [Enabling local products and related settings](local-products/configuration.md) |
| **Access Control** | [User permissions, admin bypass, and UI behavior](local-products/access-control.md) |
| **Cost Prices** | [Store-specific cost price management](local-products/cost-prices.md) |

* * *

## Quick Start

### 1\. Enable the Feature

Navigate to **Configuration → Settings → Products** and enable **Local Products** under the "Assortment and Stores" section.

### 2\. Create a Local Product

Create a new product. If the user is not an administrator, the product is automatically marked as local and assigned to the user's available stores.

Administrators can manually mark any product as local by enabling the **Is Local** checkbox in the product editor.

### 3\. Assign to Stores

Select which stores should carry the product. The store list is limited to stores the user has access to. Store group expansion is applied automatically.

### 4\. Manage Access

Only users with access to at least one of the product's assigned stores can view and edit it. Other users will see the product with editing disabled (if `showNonEditableLocalProducts` is enabled) or not at all.

* * *

## Best Practices

### When to Use Local Products

*   **Locally sourced items** that are unique to certain store locations
*   **Store-exclusive promotions** or products
*   **Franchise models** where each location manages its own catalog
*   **Pop-up or seasonal store items** available only at specific locations

### When NOT to Use Local Products

*   Products that should be available in all stores — use standard global products instead
*   Assortment that is better managed through [Store/Market IDs](product-assortment/store-market-ids.md) or [Assortment Codes](product-assortment/assortment-codes.md)
*   Scenarios where you only need to control visibility, not editing permissions

### Recommendations

1.  **Plan store groups carefully** — store group expansion means assignments can cascade
2.  **Use the search filter** to quickly switch between local and global product views
3.  **Combine with cost prices** for full store-level product management
4.  **Admins retain full access** — use admin accounts for cross-store product management

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| User can't see a local product | User doesn't have access to any of the product's stores | Grant user access to the relevant store, or add the user's store to the product |
| User sees product but can't edit it | Product is in a market the user can access, but not in their stores | Assign product to user's store, or enable `showNonEditableLocalProducts` for read-only access |
| Product was automatically marked as local | Non-admin users automatically create local products when feature is enabled | This is expected behavior — admins can unmark the product if needed |
| Store assignments include unexpected stores | Store group expansion added related stores | Review store group configuration in **Settings → Stores** |
| Local product filter not visible | Feature is not enabled or user is admin | Enable `IsLocalProductsEnabled` in tenant settings — admins see all products and don't need the filter |
