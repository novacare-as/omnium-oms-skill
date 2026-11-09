# Identifiers in API Import

Source: https://docs.omnium.no/docs/Product/product-identifiers/api-import

> How to correctly set product identifiers when creating and updating products via the Omnium API

This guide explains how to use product identifiers correctly when creating and updating products through the Omnium API.

* * *

## API Overview

The Omnium API provides endpoints for creating and updating products. Understanding how identifiers work is essential for:

*   Creating new products and variants
*   Updating existing products without data loss
*   Properly linking variants to their parent products
*   Managing multi-language product catalogs

* * *

## Creating Products

### Single-SKU Product (No Variants)

For products without size/color variations:

```
POST /api/products

{
  "id": "BOOK-001_en",
  "productId": "BOOK-001",
  "skuId": "BOOK-001",
  "isSku": true,
  "language": "en",
  "name": "Introduction to Programming",
  "isActive": true
}
```

**Key points:**

*   `id` must be unique (convention: `{productId}_{language}`)
*   `skuId` is required for purchasable items
*   `isSku: true` marks this as a stock-keeping unit
*   No `variants` array needed

* * *

### Product With Variants

For products with size, color, or other variations:

```
POST /api/products

{
  "id": "TSHIRT-BLUE_en",
  "productId": "TSHIRT-BLUE",
  "isSku": false,
  "language": "en",
  "name": "Blue T-Shirt",
  "isActive": true,
  "variants": [
    {
      "id": "TSHIRT-BLUE-S",
      "productId": "TSHIRT-BLUE",
      "skuId": "TSHIRT-BLUE-S",
      "isSku": true,
      "size": "S",
      "isActive": true
    },
    {
      "id": "TSHIRT-BLUE-M",
      "productId": "TSHIRT-BLUE",
      "skuId": "TSHIRT-BLUE-M",
      "isSku": true,
      "size": "M",
      "isActive": true
    },
    {
      "id": "TSHIRT-BLUE-L",
      "productId": "TSHIRT-BLUE",
      "skuId": "TSHIRT-BLUE-L",
      "isSku": true,
      "size": "L",
      "isActive": true
    }
  ]
}
```

**Key points:**

*   Parent product has `isSku: false` (not directly purchasable)
*   Each variant has unique `id` and `skuId`
*   Variants have `isSku: true`
*   `variantParentId` is **automatically set** when saving via API

When you save a product with inline variants via the API, Omnium automatically sets the `variantParentId` on each variant to the parent product's `id`. You don't need to set it manually.

* * *

### Sibling Products (Color Variations)

For products that share a parent but are separate entities (common in fashion):

```
// First sibling - Blue T-Shirt
POST /api/products

{
  "id": "TSHIRT-BLUE_en",
  "productId": "TSHIRT-BLUE",
  "parentId": "TSHIRT-SERIES",
  "isSku": false,
  "language": "en",
  "name": "Blue T-Shirt",
  "color": "Blue",
  "variants": [
    {
      "id": "TSHIRT-BLUE-S",
      "skuId": "TSHIRT-BLUE-S",
      "parentId": "TSHIRT-SERIES",
      "size": "S"
    },
    {
      "id": "TSHIRT-BLUE-M",
      "skuId": "TSHIRT-BLUE-M",
      "parentId": "TSHIRT-SERIES",
      "size": "M"
    }
  ]
}

// Second sibling - Red T-Shirt
POST /api/products

{
  "id": "TSHIRT-RED_en",
  "productId": "TSHIRT-RED",
  "parentId": "TSHIRT-SERIES",
  "isSku": false,
  "language": "en",
  "name": "Red T-Shirt",
  "color": "Red",
  "variants": [
    {
      "id": "TSHIRT-RED-S",
      "skuId": "TSHIRT-RED-S",
      "parentId": "TSHIRT-SERIES",
      "size": "S"
    },
    {
      "id": "TSHIRT-RED-M",
      "skuId": "TSHIRT-RED-M",
      "parentId": "TSHIRT-SERIES",
      "size": "M"
    }
  ]
}
```

**Key points:**

*   Both products share the same `parentId`
*   Each product has a unique `productId`
*   Variants inherit the `parentId` for consistency
*   The parent (`TSHIRT-SERIES`) doesn't need to exist as a product

* * *

### Multi-Language Products

Creating the same product in multiple languages:

```
// English version
POST /api/products

{
  "id": "JACKET_en",
  "productId": "JACKET",
  "language": "en",
  "name": "Winter Jacket",
  "description": "Warm jacket for cold weather"
}

// Norwegian version
POST /api/products

{
  "id": "JACKET_no",
  "productId": "JACKET",
  "language": "no",
  "name": "Vinterjakke",
  "description": "Varm jakke for kaldt vær"
}
```

**Key points:**

*   Same `productId` links the translations
*   Different `id` with language suffix for uniqueness
*   `language` field specifies the content language
*   Products are grouped in UI by shared `productId`

* * *

## Updating Products

### Full Update (PUT)

Replaces the entire product document:

```
PUT /api/products/{id}

{
  "id": "TSHIRT-BLUE_en",
  "productId": "TSHIRT-BLUE",
  "isSku": false,
  "name": "Blue T-Shirt - Updated",
  "isActive": true,
  "variants": [
    // Must include ALL variants, or they will be removed
    {
      "id": "TSHIRT-BLUE-S",
      "skuId": "TSHIRT-BLUE-S",
      "isSku": true,
      "size": "S"
    },
    {
      "id": "TSHIRT-BLUE-M",
      "skuId": "TSHIRT-BLUE-M",
      "isSku": true,
      "size": "M"
    },
    // Adding new variant
    {
      "id": "TSHIRT-BLUE-XL",
      "skuId": "TSHIRT-BLUE-XL",
      "isSku": true,
      "size": "XL"
    }
  ]
}
```

**Full updates replace the entire document.** If you omit variants in a PUT request, they will be removed. Always include all variants when doing full updates.

* * *

### Partial Update (PATCH)

Updates only specified fields:

```
PATCH /api/products/{id}

{
  "name": "Blue T-Shirt - Sale Edition",
  "isActive": true
}
```

**Key points:**

*   Only specified fields are updated
*   Variants are not affected if not included
*   Cannot change `id` field (immutable)

* * *

## Adding Variants to Existing Products

### Option 1: Full Product Update

Fetch the product, add the variant, save the entire product:

```
// 1. Get existing product
const product = await fetch('/api/products/TSHIRT-BLUE_en').then(r => r.json());

// 2. Add new variant
product.variants.push({
  id: 'TSHIRT-BLUE-XXL',
  skuId: 'TSHIRT-BLUE-XXL',
  isSku: true,
  size: 'XXL',
  isActive: true
});

// 3. Save product
await fetch('/api/products/TSHIRT-BLUE_en', {
  method: 'PUT',
  body: JSON.stringify(product)
});
```

### Option 2: Variant-Specific Endpoint

Some implementations provide direct variant management:

```
POST /api/products/{productId}/variants

{
  "id": "TSHIRT-BLUE-XXL",
  "skuId": "TSHIRT-BLUE-XXL",
  "isSku": true,
  "size": "XXL"
}
```

* * *

## Identifier Validation

### Automatic Behaviors

When saving products via API, Omnium performs these automatic operations:

| Field | Behavior |
| --- | --- |
| `productId` | If empty, falls back to `id` |
| `language` | If empty, uses default market's language |
| `variantParentId` | Automatically set on inline variants |
| `created` | Set to current UTC time if not provided |
| `modified` | Always updated to current UTC time |

### Validation Rules

| Rule | Description |
| --- | --- |
| `id` required | Every product/variant must have a unique `id` |
| `id` uniqueness | Duplicate `id` overwrites existing document |
| `skuId` for SKUs | Required when `isSku: true` |
| Variant association | Variants must be included in product's `variants` array |

* * *

## Common Patterns

### Pattern 1: ERP Integration

When syncing products from an ERP system:

```json
{
  "id": "ERP-12345_en",
  "productId": "ERP-12345",
  "skuId": "ERP-12345",
  "externalIds": [
    {
      "source": "ERP",
      "externalId": "12345"
    }
  ]
}
```

**Use `externalIds`** to maintain references to source systems without affecting the Omnium identifiers.

* * *

### Pattern 2: E-commerce Platform Sync

When syncing from Shopify, Magento, etc.:

```json
{
  "id": "shopify-7654321_en",
  "productId": "shopify-7654321",
  "skuId": "SKU-FROM-SHOPIFY",
  "externalIds": [
    {
      "source": "Shopify",
      "externalId": "7654321"
    }
  ]
}
```

* * *

### Pattern 3: Bulk Import

When importing many products, use batch endpoints:

```
POST /api/products/batch

[
  {
    "id": "PROD-001_en",
    "productId": "PROD-001",
    "skuId": "PROD-001",
    "isSku": true,
    "name": "Product 1"
  },
  {
    "id": "PROD-002_en",
    "productId": "PROD-002",
    "skuId": "PROD-002",
    "isSku": true,
    "name": "Product 2"
  }
]
```

* * *

## Error Handling

### Common Errors

| Error | Cause | Solution |
| --- | --- | --- |
| `Id is required` | Missing `id` field | Provide unique `id` |
| `Product not found` | Invalid `id` in update | Verify product exists |
| `Duplicate SkuId` | `skuId` already exists | Use unique `skuId` values |
| `Invalid variant` | Variant missing required fields | Ensure variant has `id` and `skuId` |

### Handling Overwrites

To prevent accidental overwrites, check if product exists first:

```
// Check before create
const existing = await fetch(`/api/products/${id}`);
if (existing.ok) {
  // Product exists - use update instead
  await fetch(`/api/products/${id}`, { method: 'PUT', body: data });
} else {
  // Product doesn't exist - create new
  await fetch('/api/products', { method: 'POST', body: data });
}
```

* * *

## Best Practices

1.  **Use consistent ID patterns** - Establish a naming convention and stick to it

2.  **Include language suffix in `id`** - Makes multi-language management easier

3.  **Set `productId` explicitly** - Don't rely on fallback behavior

4.  **Keep variants with products** - Save products with their variants array intact

5.  **Use `externalIds` for integration** - Maintain source system references separately

6.  **Validate before import** - Check for duplicate IDs before bulk operations

7.  **Handle updates atomically** - Fetch, modify, save as a single operation

* * *

## See Also

*   [Product Identifiers Overview](../product-identifiers.md) - Conceptual overview
*   [ID Property Reference](id-reference.md) - Detailed property documentation
*   [Identifiers in Excel Import](excel-import.md) - Excel import guidance
