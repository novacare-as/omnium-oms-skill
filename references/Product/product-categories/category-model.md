# Category Model Reference

Source: https://docs.omnium.no/docs/Product/product-categories/category-model

> Complete property reference for the ProductCategory model in Omnium, including all fields, data types, and usage notes.

This page provides a complete reference for the `ProductCategory` model used throughout Omnium.

* * *

## Property Reference

| Property | Type | Description |
| --- | --- | --- |
| `id` | string | **Computed.** Unique identifier combining `categoryId` and `language` (e.g., `electronics_en`). Used as the document ID in storage. |
| `categoryId` | string | **Required.** The category identifier without language suffix. Shared across all language versions of the same category. |
| `name` | string | Display name of the category. Searchable field. |
| `description` | string | Short description of the category. |
| `parentId` | string | Reference to the parent category's `categoryId`. Null for root categories. |
| `language` | string | Language code (e.g., `en`, `no`, `sv`). Each language has a separate category document. |
| `sortIndex` | int | Display order within the parent category. Lower values appear first. |
| `isHidden` | bool | When true, the category is hidden from end users but still accessible via API. |
| `isMainCategory` | bool | Marks the category as a primary/root category. |
| `imageUrl` | string | URL for the category thumbnail or banner image. |
| `assets` | List<Asset> | Additional media assets associated with the category. |
| `properties` | List<PropertyItem> | Custom metadata as key-value pairs. |
| `metaTitle` | string | SEO page title for the category. |
| `metaDescription` | string | SEO meta description. |
| `metaKeywords` | string | SEO keywords (comma-separated). |
| `googleProductCategoryId` | string | Google Merchant Center category ID for product feeds. |
| `productSearchId` | string | Links the category to a saved search for [dynamic categories](dynamic-categories.md). |

* * *

## ID Structure

Categories use a composite ID structure that combines the category identifier with the language:

```json
{categoryId}_{language}
```

**Examples:**

*   `electronics_en` - Electronics category in English
*   `electronics_no` - Electronics category in Norwegian
*   `clothing-mens-shirts_sv` - Men's shirts category in Swedish

This structure allows:

*   The same logical category to exist with different content per language
*   Querying all languages of a category by `categoryId`
*   Unique document identification in storage

When assigning categories to products, use the `categoryId` (without language suffix). The system handles language-specific lookups based on the product's language.

* * *

## Example Category Document

```json
{
  "id": "mens-shirts_en",
  "categoryId": "mens-shirts",
  "name": "Men's Shirts",
  "description": "Dress shirts, casual shirts, and t-shirts for men",
  "parentId": "mens-clothing",
  "language": "en",
  "sortIndex": 100,
  "isHidden": false,
  "isMainCategory": false,
  "imageUrl": "https://cdn.example.com/categories/mens-shirts.jpg",
  "assets": [
    {
      "url": "https://cdn.example.com/categories/mens-shirts-banner.jpg",
      "purposeKey": "banner"
    }
  ],
  "properties": [
    {
      "name": "seasonalHighlight",
      "value": "Summer Collection"
    }
  ],
  "metaTitle": "Men's Shirts | Shop Dress & Casual Shirts",
  "metaDescription": "Browse our collection of men's shirts including dress shirts, casual button-downs, and t-shirts.",
  "metaKeywords": "mens shirts, dress shirts, casual shirts, t-shirts",
  "googleProductCategoryId": "212",
  "productSearchId": null
}
```

* * *

## Properties Field

The `properties` field allows storing custom metadata on categories. Each property is a key-value pair:

```
"properties": [
  {
    "name": "bannerColor",
    "value": "#3498db"
  },
  {
    "name": "promotionText",
    "value": "20% off this week"
  },
  {
    "name": "displayStyle",
    "value": "grid"
  }
]
```

Common use cases:

*   UI configuration (colors, layouts)
*   Promotional content
*   Integration metadata
*   Custom filtering attributes

* * *

## Assets Field

The `assets` field stores additional media beyond the main `imageUrl`:

```
"assets": [
  {
    "url": "https://cdn.example.com/banner.jpg",
    "purposeKey": "banner",
    "altText": "Summer collection banner"
  },
  {
    "url": "https://cdn.example.com/icon.svg",
    "purposeKey": "icon"
  },
  {
    "url": "https://cdn.example.com/mobile-banner.jpg",
    "purposeKey": "mobile-banner"
  }
]
```

Use `purposeKey` to identify asset types in your frontend application.

* * *

## Multi-Tenant Considerations

In Omnium's multi-tenant architecture, each tenant has completely separated data at the index level. There is no need to filter by tenant when querying categories - you automatically receive only your tenant's data.

Tenant data isolation is handled automatically at the index level, so no tenant identifier needs to be specified in API requests.
