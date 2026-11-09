# ID Property Reference

Source: https://docs.omnium.no/docs/Product/product-identifiers/id-reference

> Complete property reference for product identifier fields - Id, ProductId, SkuId, ParentId, and VariantParentId

This page provides a detailed reference for each identifier property in the Omnium product model.

* * *

## Property Reference Summary

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Id` | string | Yes | Unique document identifier |
| `ProductId` | string | Yes | Logical product grouping identifier |
| `SkuId` | string | Conditional | Stock-keeping unit identifier |
| `ParentId` | string | No | Parent/family grouping identifier |
| `VariantParentId` | string | Conditional | Reference to parent product (variants only) |

* * *

## Id

The `Id` is the **primary unique identifier** for every product and variant document in Omnium.

### Characteristics

| Aspect | Value |
| --- | --- |
| **Required** | Yes - always required |
| **Unique** | Must be unique across all products |
| **Automatic** | No - must be provided |
| **Mutable** | No - changing Id creates a new document |

### Behavior

*   Products with the **same Id will be overwritten** on import
*   By convention, includes a **language suffix** (e.g., `_en`, `_no`)
*   Used as the internal document key in the search index

### Examples

```
// Product Id
"id": "winter-jacket-blue_en"

// Variant Id
"id": "winter-jacket-blue_m"
```

### Usage by Entity Type

| Entity | In Use | Required | Notes |
| --- | --- | --- | --- |
| Product with variants | Yes | Yes | Include language suffix |
| Product without variants | Yes | Yes | Include language suffix |
| Variant | Yes | Yes | Often uses SKU code |

**Import behavior**: If you import a product with an existing `Id`, the existing product is **completely replaced**. To update specific fields, use the update/patch API instead.

* * *

## ProductId

The `ProductId` groups language versions of the same logical product together.

### Characteristics

| Aspect | Value |
| --- | --- |
| **Required** | Yes - required on products |
| **Unique** | No - shared across language versions |
| **Automatic** | Falls back to `Id` if not provided |
| **Mutable** | Yes - but affects language grouping |

### Behavior

*   Products with the same `ProductId` are treated as **translations** of each other
*   Used for **property inheritance** between language versions
*   Displayed as grouped items in the Omnium UI

### Examples

```
// English version
{
  "id": "jacket_en",
  "productId": "jacket"
}

// Norwegian version
{
  "id": "jacket_no",
  "productId": "jacket"
}
```

### Usage by Entity Type

| Entity | In Use | Required | Notes |
| --- | --- | --- | --- |
| Product with variants | Yes | Yes | Shared across languages |
| Product without variants | Yes | Yes | Shared across languages |
| Variant | Yes | No | Recommended to match parent product |

For variants, set `ProductId` to the same value as the parent product's `ProductId`. This maintains consistency and enables proper grouping.

* * *

## SkuId

The `SkuId` identifies the **purchasable stock-keeping unit**. This is the identifier used in inventory, orders, and integrations with external systems.

### Characteristics

| Aspect | Value |
| --- | --- |
| **Required** | Conditional - depends on product structure |
| **Unique** | Should be unique per purchasable item |
| **Automatic** | No for single-SKU products, Yes for variants |
| **Mutable** | Yes - but affects order/inventory references |

### Behavior

*   Used for **inventory tracking** and **order line items**
*   Typically matches your **ERP or POS system** identifiers
*   For products **with variants**: SkuId is only on variants
*   For products **without variants**: SkuId is on the product itself

### Usage by Entity Type

| Entity | In Use | Required | Notes |
| --- | --- | --- | --- |
| Product with variants | No | No | Product is not purchasable |
| Product without variants | Yes | Yes | Product is the SKU |
| Variant | Yes | Yes | Variant is the SKU |

### Examples

**Single-SKU Product:**

```json
{
  "id": "simple-product_en",
  "productId": "simple-product",
  "skuId": "SKU-12345",
  "isSku": true
}
```

**Product with Variants:**

```json
{
  "id": "shirt_en",
  "productId": "shirt",
  "skuId": null,
  "isSku": false,
  "variants": [
    {
      "id": "shirt_s",
      "skuId": "SHIRT-S",
      "isSku": true
    },
    {
      "id": "shirt_m",
      "skuId": "SHIRT-M",
      "isSku": true
    }
  ]
}
```

The `IsSku` boolean property indicates whether the item is a purchasable SKU. Set this to `true` for single-SKU products and variants, `false` for products that only have variants.

* * *

## ParentId

The `ParentId` groups **sibling products** into a product family or series.

### Characteristics

| Aspect | Value |
| --- | --- |
| **Required** | No - optional |
| **Unique** | No - shared across siblings |
| **Automatic** | No - must be provided |
| **Mutable** | Yes |

### Behavior

*   Products sharing the same `ParentId` are displayed as **siblings** in the UI
*   The referenced parent **does not need to exist** as a product in Omnium
*   Commonly used for **color variations** where each color has size variants
*   Enables **property inheritance** between sibling products

### Use Cases

1.  **Fashion**: T-shirts in different colors (each color is a sibling with size variants)
2.  **Electronics**: Phone models with different storage capacities
3.  **Furniture**: Sofa series in different fabrics

### Examples

```
// Blue jacket - sibling 1
{
  "id": "jacket-blue_en",
  "productId": "jacket-blue",
  "parentId": "jacket-collection"
}

// Red jacket - sibling 2
{
  "id": "jacket-red_en",
  "productId": "jacket-red",
  "parentId": "jacket-collection"
}

// The "jacket-collection" doesn't need to exist as a product
```

### Usage by Entity Type

| Entity | In Use | Required | Notes |
| --- | --- | --- | --- |
| Product with variants | Yes | No | Groups siblings |
| Product without variants | Yes | No | Groups siblings |
| Variant | Yes | No | Typically same as parent product |

Set the `ParentId` on variants to the same value as their parent product. This maintains hierarchy consistency for inheritance and grouping features.

* * *

## VariantParentId

The `VariantParentId` links a **variant to its parent product**. This is essential for Excel imports where variants may be imported separately from their products.

### Characteristics

| Aspect | Value |
| --- | --- |
| **Required** | Conditional - required for variants in Excel import |
| **Unique** | No - variants share the same parent |
| **Automatic** | Yes - when variants are saved with product |
| **Mutable** | Yes - but breaks variant association |

### Behavior

*   Points to the **parent product's `Id`** (not `ProductId`)
*   **Automatically set** when saving a product with inline variants via API
*   **Manually required** when importing variants via Excel separately

### Usage by Entity Type

| Entity | In Use | Required | Notes |
| --- | --- | --- | --- |
| Product with variants | No | No | Not applicable |
| Product without variants | No | No | Not applicable |
| Variant | Yes | Conditional | Required for Excel import |

### Examples

**API - Inline Variants (auto-set):**

```json
{
  "id": "shirt_en",
  "productId": "shirt",
  "variants": [
    {
      "id": "shirt_s",
      "skuId": "SHIRT-S"
      // VariantParentId is automatically set to "shirt_en"
    }
  ]
}
```

**Excel Import - Separate Variants (manual):**

| Id | ProductId | SkuId | VariantParentId |
| --- | --- | --- | --- |
| shirt\_s | shirt | SHIRT-S | shirt\_en |
| shirt\_m | shirt | SHIRT-M | shirt\_en |

**Excel Import**: When importing variants separately from products, `VariantParentId` is **required** to associate the variant with its parent product. The parent product must already exist in Omnium.

* * *

## IsSku Property

While not an identifier itself, the `IsSku` boolean property is closely related to the identification system.

| Value | Meaning |
| --- | --- |
| `true` | This item is a purchasable stock-keeping unit |
| `false` | This item is a container for variants (not directly purchasable) |

### Setting IsSku

| Scenario | IsSku Value |
| --- | --- |
| Single-SKU product | `true` |
| Product with variants | `false` |
| Variant | `true` |

```
// Single-SKU product
{
  "id": "book_en",
  "skuId": "ISBN-123",
  "isSku": true,
  "variants": null
}

// Product with variants
{
  "id": "tshirt_en",
  "skuId": null,
  "isSku": false,
  "variants": [
    { "id": "tshirt_s", "skuId": "TS-S", "isSku": true },
    { "id": "tshirt_m", "skuId": "TS-M", "isSku": true }
  ]
}
```

* * *

## Quick Reference Table

### Products WITH Variants

| Property | Product | Variant |
| --- | --- | --- |
| `Id` | Required, unique with `_lang` suffix | Required, unique |
| `ProductId` | Required, shared across languages | Same as parent |
| `SkuId` | Not used | Required, unique |
| `ParentId` | Optional, for siblings | Same as parent |
| `VariantParentId` | Not used | Points to product `Id` |
| `IsSku` | `false` | `true` |

### Products WITHOUT Variants

| Property | Product |
| --- | --- |
| `Id` | Required, unique with `_lang` suffix |
| `ProductId` | Required, shared across languages |
| `SkuId` | Required, typically same as `ProductId` |
| `ParentId` | Optional, for siblings |
| `VariantParentId` | Not used |
| `IsSku` | `true` |

* * *

## See Also

*   [Product Identifiers Overview](../product-identifiers.md) - Conceptual overview and examples
*   [Excel Import Guide](excel-import.md) - Using identifiers in imports
*   [Product Model](../../Product.md) - Complete product documentation
