# Customer Categories

Source: https://docs.omnium.no/docs/Product/product-assortment/customer-categories

> Customer-specific product visibility through category restrictions

Customer categories allow you to control which products specific customers can see. This is particularly useful for B2B scenarios where different customers or customer segments should have access to different product catalogs.

* * *

## Overview

Customers can have two types of category restrictions:

| Property | Type | Description |
| --- | --- | --- |
| `assortmentIncludeCategoryIds` | List<string> | Categories the customer **can** see |
| `assortmentExcludeCategoryIds` | List<string> | Categories the customer **cannot** see |

When a customer searches for products:

*   If they have **include** categories, only products in those categories are shown
*   **Exclude** categories are always filtered out, regardless of include settings

* * *

## How It Works

```
Product Search with CustomerId
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│  Load Customer                                                 │
│  ├── AssortmentIncludeCategoryIds: ["electronics"]     │
│  └── AssortmentExcludeCategoryIds: ["restricted"]      │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│  Apply Category Filter                                         │
│  ├── Include: Only show products in "electronics" category    │
│  └── Exclude: Hide products in "restricted" category          │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
    Filtered Results
```

* * *

## Customer Configuration

### Business Customer

```json
{
  "customerId": "acme-corp",
  "customerType": "business",
  "name": "ACME Corporation",
  "assortmentIncludeCategoryIds": [
    "industrial-equipment",
    "safety-gear"
  ],
  "assortmentExcludeCategoryIds": [
    "consumer-products"
  ]
}
```

### Private Customer

```json
{
  "customerId": "john-doe",
  "customerType": "private",
  "name": "John Doe",
  "assortmentIncludeCategoryIds": ["vip-products"],
  "assortmentExcludeCategoryIds": []
}
```

* * *

## API Operations

### Set Customer Categories

The assortment category fields are part of the full customer object, so they are set through the customer update endpoint rather than the patch endpoint:

```
POST /api/BusinessCustomers/Update
Content-Type: application/json

{
  "customerId": "acme-corp",
  "assortmentIncludeCategoryIds": ["industrial-equipment", "safety-gear"],
  "assortmentExcludeCategoryIds": ["consumer-products"]
}
```

Or for private customers:

```
POST /api/PrivateCustomers/Update
Content-Type: application/json

{
  "customerId": "john-doe",
  "assortmentIncludeCategoryIds": ["vip-products"],
  "assortmentExcludeCategoryIds": []
}
```

The `customerId` must be included in the request body, not as a URL parameter.

The customer patch endpoints (`PATCH /api/BusinessCustomers/PatchBusinessCustomer` and `PATCH /api/PrivateCustomers/PatchPrivateCustomer`) do **not** support the assortment category fields. Use the `Update` endpoints above to set them.

### Remove Category Restrictions

Send an empty array to remove restrictions:

```
POST /api/BusinessCustomers/Update
Content-Type: application/json

{
  "customerId": "acme-corp",
  "assortmentIncludeCategoryIds": [],
  "assortmentExcludeCategoryIds": []
}
```

Sending `null` does **not** update the property. To remove categories, you must send an empty array `[]`.

* * *

## Search Behavior

Customer category filtering is **not** automatically applied by the public API. When using the public API (`/api/Products/SearchProducts`), the client is responsible for fetching the customer's category restrictions and including them in the search request. See [Public API Usage](customer-categories.md#public-api-usage) below.

Automatic filtering only applies when searching products through the Omnium UI (e.g., in the cart).

### Omnium UI (Automatic Filtering)

When searching products through the Omnium UI (e.g., adding products to a cart), category restrictions are applied automatically based on the customer linked to the cart. No additional steps are needed.

### Public API Usage

When using the public API, you must apply category restrictions yourself. The recommended flow is:

**1\. Fetch the customer to get their category restrictions:**

```
GET /api/BusinessCustomers/{customerId}
```

From the response, read `assortmentIncludeCategoryIds` and `assortmentExcludeCategoryIds`.

**2\. Pass the categories in the product search request:**

```
POST /api/Products/SearchProducts
{
  "customerId": "acme-corp",
  "productCategoryIds": ["industrial-equipment", "safety-gear"],
  "excludedProductCategoryIds": ["consumer-products"],
  "searchText": "equipment"
}
```

| Search Parameter | Maps to Customer Property |
| --- | --- |
| `productCategoryIds` | `assortmentIncludeCategoryIds` |
| `excludedProductCategoryIds` | `assortmentExcludeCategoryIds` |

The same applies to `GetCategoryTreeBySearch` — pass `productCategoryIds` and `excludedProductCategoryIds` in the search request body to filter the category tree.

### User-Specified Categories

If the user specifies their own categories in the search request:

| Scenario | Behavior |
| --- | --- |
| User provides `productCategoryIds` | Only products in those categories are returned |
| User provides `excludedProductCategoryIds` | Products in those categories are excluded |
| Both provided | Include filter applied first, then exclude filter removes matches |

* * *

## How Filtering Works

### Omnium UI (Automatic)

When a product search is performed through the Omnium UI with a `customerId`:

1.  The customer is loaded from the database
2.  If the search request has no category filter AND the customer has include categories:
    *   The customer's include categories become the search filter
3.  If the customer has exclude categories:
    *   These are always applied (cannot be overridden by the search request)

### Public API (Manual)

When using the public API, filtering is based only on the parameters you pass in the search request. The API does **not** automatically look up the customer's category restrictions. Your integration must:

1.  Fetch the customer's `assortmentIncludeCategoryIds` and `assortmentExcludeCategoryIds`
2.  Pass them as `productCategoryIds` and `excludedProductCategoryIds` in the search request

* * *

## Use Cases

### B2B Customer Tiers

Different customers see different product ranges:

**Bronze Tier Customer:**

```json
{
  "assortmentIncludeCategoryIds": ["basic-products"]
}
```

**Gold Tier Customer:**

```json
{
  "assortmentIncludeCategoryIds": [
    "basic-products",
    "premium-products",
    "exclusive-products"
  ]
}
```

### Industry-Specific Catalogs

Customers in different industries see relevant products:

**Healthcare Customer:**

```json
{
  "assortmentIncludeCategoryIds": [
    "medical-equipment",
    "sanitization",
    "safety-gear"
  ]
}
```

**Manufacturing Customer:**

```json
{
  "assortmentIncludeCategoryIds": [
    "industrial-machinery",
    "raw-materials",
    "safety-gear"
  ]
}
```

### Restricted Products

Hide certain products from specific customers:

**Standard Customer:**

```json
{
  "assortmentExcludeCategoryIds": [
    "restricted",
    "hazardous",
    "licensed-only"
  ]
}
```

* * *

## Combining with Other Assortment Controls

Customer categories work alongside other assortment mechanisms:

| Control | Relationship |
| --- | --- |
| Store/Market IDs | Applied first (AND logic) |
| Assortment Codes | Applied separately (AND logic) |
| Customer Categories | Applied on search (AND logic) |
| IsActive/Dates | Applied on search (AND logic) |

**Example:** A product must:

1.  Be in the customer's allowed categories
2.  AND be in the current store's assortment
3.  AND have matching assortment codes (if customer is restricted)
4.  AND be active with valid dates

* * *

## Best Practices

### Category Granularity

Design categories with customer restrictions in mind:

*   Create clear separation between restricted and unrestricted categories
*   Use parent categories for broad restrictions
*   Use child categories for fine-grained control

### Testing Customer Views

To test what a customer sees:

1.  Create a test search request with the customer's ID
2.  Compare results with and without `ignoreCustomerAssortment`
3.  Verify expected products are visible/hidden

### Bulk Customer Updates

When updating many customers with the same restrictions, consider:

*   Creating a customer group with default category settings
*   Using API bulk operations
*   Importing category assignments via data integration

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Public API returns all products despite customer having categories set | The public API does not auto-apply customer category restrictions | Fetch the customer's categories and pass them as `productCategoryIds` / `excludedProductCategoryIds` in the search request |
| Customer sees no products | Include categories don't match any products | Verify category IDs exist and products have them |
| Customer sees restricted products | Exclude categories not set | Add categories to `assortmentExcludeCategoryIds` |
| Categories not applying in Omnium UI | `ignoreCustomerAssortment` is true | Remove flag from search request |
| Wrong customer type | Looking up business vs private | Verify customer type and use correct service |
| Categories not updating | Sent null instead of empty array | Use `[]` to clear, `null` preserves existing |
