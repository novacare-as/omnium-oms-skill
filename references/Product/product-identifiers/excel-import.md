# Identifiers in Excel Import

Source: https://docs.omnium.no/docs/Product/product-identifiers/excel-import

> How to correctly set product identifiers when importing products and variants via Excel

This guide explains how to use product identifiers correctly when importing products and variants through Excel files in Omnium.

* * *

## Import Overview

Omnium supports importing products and variants via Excel files. The identifier fields determine:

1.  Whether a record is a **new product** or **updates an existing one**
2.  Whether a record is a **product** or a **variant**
3.  How **variants are associated** with their parent products

* * *

## Required Columns

### For Products

| Column | Required | Description |
| --- | --- | --- |
| `Id` | Yes | Unique identifier for the product |
| `ProductId` | Yes | Logical product grouping |
| `SkuId` | Conditional | Required for single-SKU products |
| `IsSku` | Recommended | Set to `true` for single-SKU, `false` for products with variants |
| `ParentId` | No | For sibling grouping |

### For Variants

| Column | Required | Description |
| --- | --- | --- |
| `Id` | Yes | Unique identifier for the variant |
| `SkuId` | Yes | Stock-keeping unit identifier |
| `VariantParentId` | Yes | Must match the `Id` of the parent product |
| `ProductId` | Recommended | Should match parent product's `ProductId` |
| `ParentId` | Recommended | Should match parent product's `ParentId` |

When importing variants via Excel, the **parent product must already exist** in Omnium. The `VariantParentId` column links the variant to its parent.

* * *

## Import Scenarios

### Scenario 1: Single-SKU Products

For products that have no size/color variants:

| Id | ProductId | SkuId | IsSku |
| --- | --- | --- | --- |
| BOOK-001\_en | BOOK-001 | BOOK-001 | TRUE |
| BOOK-002\_en | BOOK-002 | BOOK-002 | TRUE |
| BOOK-003\_en | BOOK-003 | BOOK-003 | TRUE |

**Notes:**

*   `SkuId` is required and typically matches `ProductId`
*   `IsSku` should be `TRUE`
*   `VariantParentId` is not needed

* * *

### Scenario 2: Products With Variants (Single Import)

When importing products and variants together using the "Product Export File" format:

**Products Sheet:**

| Id | ProductId | IsSku | ParentId |
| --- | --- | --- | --- |
| SHIRT-BLUE\_en | SHIRT-BLUE | FALSE | SHIRT-SERIES |
| SHIRT-RED\_en | SHIRT-RED | FALSE | SHIRT-SERIES |

**Same File - Variant Rows:**

| Id | ProductId | SkuId | IsSku | VariantParentId | ParentId |
| --- | --- | --- | --- | --- | --- |
| SHIRT-BLUE-S | SHIRT-BLUE | SHIRT-BLUE-S | TRUE | SHIRT-BLUE\_en | SHIRT-SERIES |
| SHIRT-BLUE-M | SHIRT-BLUE | SHIRT-BLUE-M | TRUE | SHIRT-BLUE\_en | SHIRT-SERIES |
| SHIRT-RED-S | SHIRT-RED | SHIRT-RED-S | TRUE | SHIRT-RED\_en | SHIRT-SERIES |
| SHIRT-RED-M | SHIRT-RED | SHIRT-RED-M | TRUE | SHIRT-RED\_en | SHIRT-SERIES |

**Notes:**

*   Products have `IsSku = FALSE` (they contain variants)
*   Variants have `IsSku = TRUE` (they are purchasable)
*   `VariantParentId` links each variant to its product

* * *

### Scenario 3: Updating Existing Variants

When you need to update variant properties (price, inventory, etc.) for existing products:

| Id | SkuId | VariantParentId | Price | IsActive |
| --- | --- | --- | --- | --- |
| SHIRT-BLUE-S | SHIRT-BLUE-S | SHIRT-BLUE\_en | 299 | TRUE |
| SHIRT-BLUE-M | SHIRT-BLUE-M | SHIRT-BLUE\_en | 299 | TRUE |

**Notes:**

*   `VariantParentId` is essential to locate the parent product
*   The system finds the variant by `SkuId` within the parent product
*   Other fields are updated on the found variant

* * *

### Scenario 4: Multi-Language Products

Importing the same product in multiple languages:

| Id | ProductId | Language | Name |
| --- | --- | --- | --- |
| JACKET\_en | JACKET | en | Winter Jacket |
| JACKET\_no | JACKET | no | Vinterjakke |
| JACKET\_sv | JACKET | sv | Vinterjacka |

**Notes:**

*   `Id` includes language suffix for uniqueness
*   `ProductId` is shared across all languages
*   Products are grouped as translations in the UI

* * *

## Common Mistakes

### 1\. Missing VariantParentId on Variants

**Wrong:**

| Id | SkuId |
| --- | --- |
| SHIRT-S | SHIRT-S |

**Correct:**

| Id | SkuId | VariantParentId |
| --- | --- | --- |
| SHIRT-S | SHIRT-S | SHIRT\_en |

Without `VariantParentId`, the system cannot associate the variant with its parent product. The import will fail or create orphaned data.

* * *

### 2\. VariantParentId Pointing to ProductId Instead of Id

**Wrong:**

| Id | SkuId | VariantParentId |
| --- | --- | --- |
| SHIRT-S | SHIRT-S | SHIRT |

**Correct:**

| Id | SkuId | VariantParentId |
| --- | --- | --- |
| SHIRT-S | SHIRT-S | SHIRT\_en |

`VariantParentId` must reference the **`Id`** field (with language suffix), not the `ProductId`.

* * *

### 3\. Inconsistent ParentId Between Product and Variants

**Problematic:**

| Entity | Id | ParentId |
| --- | --- | --- |
| Product | SHIRT\_en | SHIRT-SERIES |
| Variant | SHIRT-S | (empty) |

**Better:**

| Entity | Id | ParentId |
| --- | --- | --- |
| Product | SHIRT\_en | SHIRT-SERIES |
| Variant | SHIRT-S | SHIRT-SERIES |

While not strictly required, keeping `ParentId` consistent between product and variants ensures proper inheritance behavior.

* * *

### 4\. Using Same Id for Product and Variant

**Wrong:**

| Id | IsSku | SkuId |
| --- | --- | --- |
| SHIRT | FALSE |  |
| SHIRT | TRUE | SHIRT-S |

**Correct:**

| Id | IsSku | SkuId | VariantParentId |
| --- | --- | --- | --- |
| SHIRT\_en | FALSE |  |  |
| SHIRT-S | TRUE | SHIRT-S | SHIRT\_en |

Every `Id` must be unique. Products and variants cannot share the same `Id`.

* * *

## Import File Formats

Omnium supports several Excel import formats for products:

### 1\. Product Import (Basic)

*   Creates or updates products
*   Required columns: `Id`
*   Optional: all other product fields

### 2\. Variant Import (ExcelImportModelVariant)

*   Creates or updates variants on existing products
*   Required columns: `Id`, `Variant.SkuId`, `Variant.Id`

### 3\. Product Export File Format

*   Full product structure with inline variants
*   Required columns: `Id`, `SkuId`, `IsSku`, `VariantParentId`
*   Most flexible for importing products with variants

* * *

## Best Practices

1.  **Always test with a small batch first** - Import 5-10 products to verify your column mappings

2.  **Export existing products as template** - Use the product export feature to see the correct format

3.  **Keep identifiers consistent** - Use the same ID patterns throughout your imports

4.  **Set VariantParentId explicitly** - Don't rely on automatic association for Excel imports

5.  **Include IsSku column** - Explicitly mark which rows are purchasable SKUs

6.  **Validate parent products exist** - Before importing variants, ensure parent products are already in the system

* * *

## Troubleshooting

| Issue | Likely Cause | Solution |
| --- | --- | --- |
| Variant not appearing | Missing/wrong `VariantParentId` | Verify it matches parent product's `Id` exactly |
| Product overwritten | Duplicate `Id` in import | Ensure each `Id` is unique |
| Languages not grouped | Different `ProductId` values | Use same `ProductId` for translations |
| Siblings not grouped | Missing/different `ParentId` | Use same `ParentId` for all siblings |
| SKU not trackable | Missing `SkuId` or `IsSku = false` | Set both `SkuId` and `IsSku = true` |

* * *

## See Also

*   [Product Identifiers Overview](../product-identifiers.md) - Conceptual overview
*   [ID Property Reference](id-reference.md) - Detailed property documentation
