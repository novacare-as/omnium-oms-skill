# Product Identifiers

Source: https://docs.omnium.no/docs/Product/product-identifiers

> Deep dive into the product identification system in Omnium - understanding Id, ProductId, SkuId, ParentId, and VariantParentId

Understanding how products are identified in Omnium is critical for API integration, Excel imports, and proper product modeling. This guide explains the five key identifier properties and how they relate to each other.

* * *

## Overview

Omnium uses a multi-layered identification system to support:

*   **Multi-language products** - Same product in different languages
*   **Product variants** - Size/color variations of a product
*   **Sibling products** - Related products grouped under a common parent
*   **SKU tracking** - Unique stock-keeping unit identification

The five identifier properties are:

| Property | Purpose | Primary Use |
| --- | --- | --- |
| `Id` | Unique document identifier | Required for all products and variants |
| `ProductId` | Logical product grouping | Links language versions together |
| `SkuId` | Stock-keeping unit | Identifies purchasable items |
| `ParentId` | Product family grouping | Links sibling products |
| `VariantParentId` | Variant-to-product link | Links variants to their parent product |

* * *

## The Identification Hierarchy

```
                    ParentId: "jacket-series"
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     Product: Blue    Product: Red    Product: Green
     Id: jacket-blue_en   Id: jacket-red_en    Id: jacket-green_en
     ProductId: jacket-blue    ProductId: jacket-red   ProductId: jacket-green
            │
            ├─── Variant: Small (SkuId: jacket-blue-s)
            ├─── Variant: Medium (SkuId: jacket-blue-m)
            └─── Variant: Large (SkuId: jacket-blue-l)
                    │
                    └── VariantParentId: jacket-blue_en
```

* * *

## Products With Variants vs Without Variants

Omnium supports two product structures, and the ID usage differs between them:

### Products WITH Variants

When a product has variants (e.g., sizes), the **variant is the SKU** (the purchasable item):

| Property | Product | Variant |
| --- | --- | --- |
| `Id` | Required, unique (e.g., `123_en`) | Required, unique (e.g., `123_m`) |
| `ProductId` | Required (e.g., `123`) | Same as product (e.g., `123`) |
| `SkuId` | **Not used** | Required, unique (e.g., `123_m`) |
| `ParentId` | Optional (e.g., `12`) | Same as product (e.g., `12`) |
| `VariantParentId` | **Not used** | Points to product Id (e.g., `123_en`) |

For products with variants, the `SkuId` exists only on the **variant level**. The parent product is not purchasable.

### Products WITHOUT Variants (Single SKU)

When a product has no variants, the **product itself is the SKU**:

| Property | Product |
| --- | --- |
| `Id` | Required, unique (e.g., `123_en`) |
| `ProductId` | Required (e.g., `123`) |
| `SkuId` | Required, unique (e.g., `123`) |
| `ParentId` | Optional (e.g., `12`) |
| `VariantParentId` | **Not used** |

For single-SKU products, the `SkuId` is typically the same as `ProductId` since there are no variations.

* * *

## Complete Example

Here's a real-world example with two sibling products, each with size variants:

### Product Structure

**Parent/Family**: Jacket Series (ParentId: `12`)

**Product 1**: Jacket Blue (English)

*   Product 1 Size Medium
*   Product 1 Size Large

**Product 2**: Jacket Red (English)

*   Product 2 Size Medium
*   Product 2 Size Large

### ID Values

| Entity | Id | ProductId | SkuId | ParentId | VariantParentId |
| --- | --- | --- | --- | --- | --- |
| Product 123 | `123_en` | `123` | \- | `12` | \- |
| Variant 123 Medium | `123_m` | `123` | `123_m` | `12` | `123_en` |
| Variant 123 Large | `123_l` | `123` | `123_l` | `12` | `123_en` |
| Product 456 | `456_en` | `456` | \- | `12` | \- |
| Variant 456 Medium | `456_m` | `456` | `456_m` | `12` | `456_en` |
| Variant 456 Large | `456_l` | `456` | `456_l` | `12` | `456_en` |

### Visual Relationship

```
Product                          Variant
─────────────────────────────────────────────────────
Id: 123_en          ◄────────    Id: 123_m
ProductId: 123      ════════     ProductId: 123
SkuId: ✗                         SkuId: 123_m
ParentId: 12        ════════     ParentId: 12
VariantParentId: ✗  ◄────────    VariantParentId: 123_en
```

**Legend:**

*   `◄────` = Reference relationship (variant points to product)
*   `════` = Same value shared

* * *

## Language Handling

By convention in Omnium, the `Id` property includes a **language suffix**:

| Language | Product Id Example |
| --- | --- |
| English | `jacket-blue_en` |
| Norwegian | `jacket-blue_no` |
| Swedish | `jacket-blue_sv` |

Products that share the same `ProductId` but have different language suffixes are **language versions** of the same logical product:

```
// English version
{
  "id": "jacket-blue_en",
  "productId": "jacket-blue",
  "language": "en",
  "name": "Blue Jacket"
}

// Norwegian version
{
  "id": "jacket-blue_no",
  "productId": "jacket-blue",
  "language": "no",
  "name": "Blå Jakke"
}
```

The `ProductId` is shared across language versions. This allows Omnium to link translations together in the UI and enable property inheritance between languages.

* * *

## Sibling Products with ParentId

The `ParentId` property groups related products as **siblings**. This is commonly used for:

*   Color variations (where each color has its own size variants)
*   Product series or collections
*   Model year variations

```
// Blue jacket - sibling 1
{
  "id": "jacket-blue_en",
  "productId": "jacket-blue",
  "parentId": "jacket-series",
  "variants": [...]
}

// Red jacket - sibling 2
{
  "id": "jacket-red_en",
  "productId": "jacket-red",
  "parentId": "jacket-series",
  "variants": [...]
}
```

The `ParentId` can reference a product that **does not exist** in Omnium. It's simply a grouping identifier.

* * *

## Best Practices

### URL-Safe IDs

All IDs must be **URL-safe** since they are used in API URL paths. Avoid spaces, forward slashes (`/`), `#`, `?`, `&`, and other reserved characters. Stick to alphanumeric characters, hyphens (`-`), and underscores (`_`). See the [API Developer Guide — Working with IDs](../GettingStartedWithAPI/api-developer-guide.md#working-with-ids) for the full list of rules.

### ID Naming Conventions

| Property | Recommendation |
| --- | --- |
| `Id` | Use format: `{productId}_{language}` for products, `{productId}_{variantCode}` for variants |
| `ProductId` | Use a stable, language-agnostic identifier |
| `SkuId` | Match your ERP/inventory system SKU codes |
| `ParentId` | Use a meaningful grouping identifier |

### Common Patterns

**Pattern 1: Simple Product (No Variants)**

```json
{
  "id": "SHOE-001_en",
  "productId": "SHOE-001",
  "skuId": "SHOE-001"
}
```

**Pattern 2: Product with Size Variants**

```json
{
  "id": "SHIRT-001_en",
  "productId": "SHIRT-001",
  "variants": [
    { "id": "SHIRT-001-S", "skuId": "SHIRT-001-S", "variantParentId": "SHIRT-001_en" },
    { "id": "SHIRT-001-M", "skuId": "SHIRT-001-M", "variantParentId": "SHIRT-001_en" },
    { "id": "SHIRT-001-L", "skuId": "SHIRT-001-L", "variantParentId": "SHIRT-001_en" }
  ]
}
```

**Pattern 3: Color Siblings with Size Variants**

```
// Each color is a separate product with shared ParentId
{
  "id": "SHIRT-BLUE_en",
  "productId": "SHIRT-BLUE",
  "parentId": "SHIRT-SERIES",
  "variants": [...]
},
{
  "id": "SHIRT-RED_en",
  "productId": "SHIRT-RED",
  "parentId": "SHIRT-SERIES",
  "variants": [...]
}
```

* * *

## See Also

*   [ID Reference](product-identifiers/id-reference.md) - Complete property reference for all identifier fields
*   [Excel Import](product-identifiers/excel-import.md) - How to use identifiers in Excel imports
*   [Product Overview](../Product.md) - General product modeling concepts
