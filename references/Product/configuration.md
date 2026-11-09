# Configuration

Source: https://docs.omnium.no/docs/Product/configuration

> Complete guide to product settings and configuration options in Omnium

Product settings control how products are managed, displayed, searched, and priced in Omnium. These settings are configured in the tenant settings under **Configuration → Settings → Products**.

This guide covers all available product configuration options organized by functional area.

* * *

## General Product Settings

These settings control the core product management behavior in Omnium.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| readOnly | bool | false | When enabled, products cannot be modified through the Omnium UI. Use this for tenants where products are managed exclusively through external systems (ERP, PIM). |
| showFilters | bool | true | Controls whether filter options are displayed in the product list view. |
| isProductCreateDisabled | bool | false | When enabled, users cannot create new products through the Omnium UI. Products can still be created via API or imports. |
| filterByActiveAsDefault | bool | false | When enabled, the product list defaults to showing only active products. Users can still toggle this filter to see inactive products. |

### Sample

```
"ProductSettings": {
  "ReadOnly": false,
  "ShowFilters": true,
  "IsProductCreateDisabled": false,
  "FilterByActiveAsDefault": true
}
```

* * *

## Packages and Bundles

Packages (also called bundles) allow you to sell multiple products together as a single unit. These settings control how packages behave.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| hasPackages | bool | false | Enables package/bundle product functionality. When enabled, you can create products that contain other products as components. |
| disablePackageAutoBreakdownOnAddProductFromOrder | bool | false | When enabled, packages remain as single line items when added to orders. When disabled (default), packages are automatically expanded into their component products. |
| allocatePackagePricesToComponents | bool | false | When enabled, the package price is proportionally distributed across component line items, and the package line's extended price is set to zero. This prevents double-counting in order totals. |

### Package Price Allocation

When `allocatePackagePricesToComponents` is enabled, Omnium calculates component prices as follows:

1.  The total package price is determined
2.  Each component receives a proportional share based on its original price relative to the sum of all component prices
3.  The package line item's ExtendedPrice is set to 0

**Example:**

A package priced at 100 contains:

*   Product A (original price: 60)
*   Product B (original price: 40)

With allocation enabled:

*   Product A receives: 100 × (60/100) = 60
*   Product B receives: 100 × (40/100) = 40
*   Package line: 0

This ensures the order total remains 100, not 200.

Changing `allocatePackagePricesToComponents` affects how order totals are calculated. Review existing orders before enabling this setting in production.

### Sample

```
"ProductSettings": {
  "HasPackages": true,
  "DisablePackageAutoBreakdownOnAddProductFromOrder": false,
  "AllocatePackagePricesToComponents": true
}
```

* * *

## Product Features

These settings enable or disable specific product functionality.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isProductStatisticsEnabled | bool | false | Enables collection of product statistics and analytics, such as view counts and sales performance. |
| isIncompleteProductsEnabled | bool | false | When enabled, products can be saved without all required fields populated. Useful during import processes or when building products incrementally. |
| isProductOptionsEnabled | bool | false | Enables product options functionality, allowing configurable products with user-selectable options. |
| isProductLanguagesEnabled | bool | false | Enables multi-language product content. Products can have different names, descriptions, and content for each language. |
| isInheritanceEnabled | bool | false | Enables property inheritance between parent products and variants. See [Inheritance Settings](configuration.md#inheritance-settings) for details. |
| isLocalProductsEnabled | bool | false | Enables store-specific product editing. When enabled, products can be marked as "local" to specific stores, allowing store staff to manage their own product content. |

### Sample

```
"ProductSettings": {
  "IsProductStatisticsEnabled": true,
  "IsIncompleteProductsEnabled": false,
  "IsProductOptionsEnabled": true,
  "IsProductLanguagesEnabled": true,
  "IsInheritanceEnabled": true,
  "IsLocalProductsEnabled": false
}
```

* * *

## Assortment Settings

Assortment settings control how products are organized and filtered by store, market, or assortment codes.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isAssortmentStoreIdRequired | bool | false | When enabled, products must be linked to at least one store through assortment configuration. Products without store assignments will not appear in store-specific views. |
| isAssortmentCodesRequired | bool | false | When enabled, products must have at least one assortment code assigned. Product searches without assortment codes will only return products without assortment codes assigned. |
| isMultipleAssortmentCodesAllowed | bool | false | When enabled, products can be assigned multiple assortment codes. When disabled, only one assortment code per product is allowed. |
| requireProductMarket | bool | false | When enabled, products must be assigned to at least one market to be searchable. |
| requireStoreIdsForAccess | bool | null | When enabled, users can only view and edit products that are assigned to stores they have access to. |

### Assortment Codes

Assortment codes allow you to categorize products for different sales channels, customer segments, or purposes.

| Property | Type | Description |
| --- | --- | --- |
| assortmentCodes | array | Available assortment code definitions |

Each assortment code has:

| Property | Type | Description |
| --- | --- | --- |
| id | string | Unique identifier for the assortment code |
| translationKey | string | Translation key for displaying the assortment code name |

### Sample

```
"ProductSettings": {
  "IsAssortmentStoreIdRequired": true,
  "IsAssortmentCodesRequired": false,
  "IsMultipleAssortmentCodesAllowed": true,
  "RequireProductMarket": true,
  "AssortmentCodes": [
    { "Id": "retail", "TranslationKey": "AssortmentCode_Retail" },
    { "Id": "wholesale", "TranslationKey": "AssortmentCode_Wholesale" },
    { "Id": "online", "TranslationKey": "AssortmentCode_Online" }
  ]
}
```

* * *

## URL Settings

These settings control how product URLs are generated. See the [Omnium URL Provider](configuration/url-provider.md) guide for full configuration details, template placeholders, and behavior notes.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `isOmniumUrlProviderEnabled` | bool | false | Enables the built-in URL provider for generating product URLs. When enabled, Omnium automatically generates URLs based on the template. |
| `omniumUrlProviderTemplate` | string | null | Template string for generating product URLs. Supports placeholders: `{productId}`, `{productName}`, `{productCategory}`, `{productLanguage}`. |

### Sample

```
"ProductSettings": {
  "IsOmniumUrlProviderEnabled": true,
  "OmniumUrlProviderTemplate": "/products/{productCategory}/{productId}"
}
```

* * *

## Price Settings

These settings control how product prices are managed and stored.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| priceManagement | bool | false | Enables price management features in the Omnium UI. When enabled, prices can be viewed and edited directly on products. |
| hasExternalPrices | bool | false | Indicates that prices come from an external system. When enabled, Omnium expects prices to be provided via API or integration rather than managed internally. |
| hasCustomerSpecificPrices | bool | false | Enables customer-specific or customer-group-specific pricing. When enabled, different customers or customer groups can see different prices for the same product. |
| hidePricesInUi | bool | false | When enabled, prices are hidden in the Omnium user interface. Useful when prices are confidential or managed elsewhere. |

### Price Storage Model

Omnium supports different price storage models depending on your business requirements:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| hasSeparatePrices | bool | false | When enabled, prices are stored separately from the product record. This model is required for large price lists, time-based pricing, or when you need to query prices independently. |
| isPricesStoredOnlyOnProduct | bool | false | When enabled, prices are stored directly on the product (the simplest model). |
| maxSeparatePriceSize | int | 150 | Maximum number of prices returned when fetching a product with separate prices. Set to 0 to disable price fetching (useful when prices are only used for filtering). |

**Choosing a Price Storage Model:**

*   **Prices on Product** (default): Best for simple pricing with few price variants.
*   **Separate Prices**: Best for complex pricing scenarios with many price lists, time-based prices, or customer-specific pricing. Required when you have hundreds of prices per product.

Changing the price storage model is a significant decision that should be made during initial setup. Contact Omnium support before changing this on an existing tenant.

### Product Assortment from Prices

These settings automatically update product visibility based on price data:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isProductAssortmentUpdatedByPrices | bool | false | When enabled, product store/market/market group assignments are automatically updated based on the assortment information on the product's prices. |
| isProductAssortmentUpdatedByStoreCategories | bool | false | When enabled, product store/market/market group assignments are automatically updated based on the categories assigned to stores. |

Only one of these options should be enabled at a time. They are mutually exclusive approaches to managing product assortment.

### Price Cleanup

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| deleteExpiredPricesThreshold | int | null | Number of days after expiration before prices are automatically deleted. Only applicable when using separate prices. Leave null to disable automatic cleanup. |

### Advanced Price Settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isDefaultPriceOverridingPrices | bool | false | When enabled, default prices override other prices during import operations. |
| isUpdatePricesAlwaysMarkedAsModified | bool | false | When enabled, any price update triggers a product "Modified" timestamp update, even if the price value hasn't actually changed. |
| isPriceMarketIgnoredOnProductSearch | bool | false | When enabled, product search ignores market filtering when retrieving prices. |
| isVariantPricesJoined | bool | false | When enabled, variant prices are aggregated together in search results. |
| isPriceUpdateOperationDelayed | bool | false | When enabled, price update operations are queued for batch processing rather than processed immediately. Improves performance for bulk price updates. |
| isProductPriceSetToLowestVariantPrice | bool | false | When enabled, the parent product's price is automatically set to the lowest variant price during product enrichment. |

### Sample

```
"ProductSettings": {
  "PriceManagement": true,
  "HasExternalPrices": false,
  "HasCustomerSpecificPrices": true,
  "HasSeparatePrices": true,
  "DeleteExpiredPricesThreshold": 30,
  "IsProductAssortmentUpdatedByPrices": true,
  "IsProductPriceSetToLowestVariantPrice": true
}
```

* * *

## Cost Price Settings

These settings control how product cost prices are managed.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| costPriceManagement | bool | true | Enables cost price management features. When enabled, cost prices can be viewed and edited on products. |
| defaultProductCostCurrency | string | null | Default currency code for cost prices (e.g., "USD", "EUR", "NOK"). |

### Cost Price Storage

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| hasSeparateCostPrices | bool | false | When enabled, cost prices are stored as separate indexed documents (similar to separate prices). Required for multi-supplier scenarios with different cost prices. |
| isUsePriceCostPrice | bool | false | When enabled, cost price is read from price-level data rather than product-level. Use when different price lists have different cost prices. |
| deleteExpiredCostPricesThreshold | int | null | Number of days after expiration before cost prices are automatically deleted. Only applicable with separate cost prices. |

### Sample

```
"ProductSettings": {
  "CostPriceManagement": true,
  "DefaultProductCostCurrency": "NOK",
  "HasSeparateCostPrices": false,
  "IsUsePriceCostPrice": false,
  "DeleteExpiredCostPricesThreshold": 90
}
```

* * *

## Variant Settings

These settings control the relationship between parent products and their variants.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isLocationEqualForAllVariants | bool | false | When enabled, all variants of a product must share the same location/shelf position. |
| syncExistingVariantsAcrossLanguages | bool | false | When enabled and product languages are used, existing variants are synchronized across all language versions of a product. |
| disableIsActiveSyncForVariants | bool | false | Controls how the `isActive` status synchronizes between products and variants. See detailed explanation below. |

### Product and Variant `isActive` Synchronization

The `disableIsActiveSyncForVariants` setting controls how the active/inactive status is synchronized between products and their variants.

#### When Sync Is Disabled (`disableIsActiveSyncForVariants: true`)

*   A product can only be activated if at least one variant is already active
*   If all variants are deactivated, the product is automatically deactivated
*   Activating a variant later does **not** automatically re-activate the product—you must explicitly activate the product again
*   Deactivating a product does **not** change variant status

To activate a product when sync is disabled, you must update the product and at least one variant in the same request:

```
PATCH /api/Products/{productId}

{
  "isActive": true,
  "variants": [
    { "variantId": "{variantId}", "isActive": true }
  ]
}
```

#### When Sync Is Enabled (`disableIsActiveSyncForVariants: false`)

*   Setting a product to `isActive = false` also deactivates all variants
*   Setting a product to `isActive = true`:
    *   If all variants were inactive → they are set to active
    *   If some variants were already active → their states remain unchanged
*   Activating or deactivating individual variants does **not** affect the product status

```
PATCH /api/Products/{productId}

{ "isActive": false }
```

Result: Product and all variants become inactive.

#### Best Practices

**If sync is disabled:**

*   Always activate at least one variant before activating the product
*   Use product activation only after a variant is active

**If sync is enabled:**

*   Use product-level activation/deactivation to manage all variants in bulk

#### Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Product won't stay active | All variants are inactive while sync is disabled | Activate a variant first via the API |
| Product deactivated automatically | All variants were deactivated while sync was disabled | Activate at least one variant |
| Variants didn't update when product was activated | With sync enabled, variants only update if they were all inactive | This is expected behavior; mixed states are preserved |

### Sample

```
"ProductSettings": {
  "IsLocationEqualForAllVariants": false,
  "SyncExistingVariantsAcrossLanguages": true,
  "DisableIsActiveSyncForVariants": true
}
```

* * *

## Image and Asset Settings

These settings control how product images and assets are handled.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isImagesAutoResizedOnUpload | bool | false | When enabled, uploaded images are automatically resized according to the configured maximum size and aspect ratios. |
| assetPurposeKeys | List<string> | null | List of purpose keys for categorizing assets (e.g., "main", "thumbnail", "lifestyle", "technical"). |

### Image File Types

Configure allowed image file types and compression settings:

| Property | Type | Description |
| --- | --- | --- |
| imageFileTypes | array | Allowed image file types with compression options |

Each file type option has:

| Property | Type | Description |
| --- | --- | --- |
| fileType | string | File extension (e.g., "jpg", "png", "webp") |
| compressionOptions | object | Compression settings |
| isDefault | bool | Whether this is the default format |

### Image Aspect Ratios

Configure standard aspect ratios for product images:

| Property | Type | Description |
| --- | --- | --- |
| imageAspectRatios | array | Available aspect ratio configurations |

Each aspect ratio has:

| Property | Type | Description |
| --- | --- | --- |
| name | string | Display name for the aspect ratio |
| translateKey | string | Translation key |
| width | int | Width in pixels |
| height | int | Height in pixels |
| isDefault | bool | Whether this is the default aspect ratio |

### Image Maximum Size

| Property | Type | Description |
| --- | --- | --- |
| imageMaxSize | object | Maximum dimensions for uploaded images |

### Sample

```
"ProductSettings": {
  "IsImagesAutoResizedOnUpload": true,
  "AssetPurposeKeys": ["main", "thumbnail", "lifestyle", "detail"],
  "ImageFileTypes": [
    {
      "FileType": "jpg",
      "CompressionOptions": { "Quality": 85 },
      "IsDefault": true
    },
    {
      "FileType": "webp",
      "CompressionOptions": { "Quality": 80 },
      "IsDefault": false
    }
  ],
  "ImageAspectRatios": [
    { "Name": "Square", "Width": 1000, "Height": 1000, "IsDefault": true },
    { "Name": "Portrait", "Width": 800, "Height": 1200, "IsDefault": false }
  ],
  "ImageMaxSize": { "Width": 2000, "Height": 2000 }
}
```

* * *

## Category Settings

These settings control how products are organized into categories.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| rootCategoryId | string | null | The ID of the root category for the product hierarchy. Products outside this hierarchy will not be displayed in category navigation. |
| seasonCategoryId | string | null | The ID of the category used for seasonal products. |
| separateRootCategoryColors | bool | false | When enabled, each root category can have its own color scheme in the UI. |
| isProductCategoryParentsAdded | bool | false | When enabled, parent categories are automatically added to products when a child category is assigned. |
| isProductCategoryEnriched | bool | false | When enabled, category data (names, paths) is enriched onto the product during save operations. |
| isNonexistentCategoryIdsRemoved | bool | false | When enabled, category IDs that reference non-existent categories are automatically removed from products during save. |

### Sample

```
"ProductSettings": {
  "RootCategoryId": "catalog",
  "SeasonCategoryId": "seasonal",
  "SeparateRootCategoryColors": false,
  "IsProductCategoryParentsAdded": true,
  "IsProductCategoryEnriched": true,
  "IsNonexistentCategoryIdsRemoved": true
}
```

* * *

## Product Content Languages

Configure multiple languages for product content.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| productContentLanguages | array | null | Available languages for product content |
| defaultProductContentLanguageCode | string | null | Default language code for new products |
| isMainLanguageIdWithLanguageSuffix | bool | false | When enabled, the main language product ID includes a language suffix. |

Each language has:

| Property | Type | Description |
| --- | --- | --- |
| languageCode | string | ISO language code (e.g., "en", "no", "sv") |
| displayName | string | Human-readable language name |
| translateKey | string | Translation key for the language name |

### Sample

```
"ProductSettings": {
  "IsProductLanguagesEnabled": true,
  "DefaultProductContentLanguageCode": "en",
  "ProductContentLanguages": [
    { "LanguageCode": "en", "DisplayName": "English", "TranslateKey": "Language_English" },
    { "LanguageCode": "no", "DisplayName": "Norwegian", "TranslateKey": "Language_Norwegian" },
    { "LanguageCode": "sv", "DisplayName": "Swedish", "TranslateKey": "Language_Swedish" }
  ]
}
```

* * *

## Search Settings

These settings control how products are searched and how search results are ranked.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isVariantSearchEnabled | bool | false | When enabled, variants can be searched independently. When disabled, only parent products are searchable. |

### Product Search Settings

The `productSearchSettings` object contains all search-related configuration:

#### Fuzzy Search and Synonyms

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isFuzzinessAuto | bool | false | Enables fuzzy matching, allowing search results even when users make minor spelling mistakes. |
| isSynonymsApplied | bool | false | Enables synonym matching. Configure synonyms separately in the Synonyms section. |

#### Search Boosting

Boosting increases the relevance score of products matching certain criteria. Boost values range from 0 to 4, where 1 is neutral, values below 1 decrease relevance, and values above 1 increase relevance.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isPopularityBoosted | bool | false | Enable popularity-based boosting |
| popularityBoosting | double | 1.0 | Boost multiplier for popular products (0-4) |
| isPromotionBoosted | bool | false | Enable promotion-based boosting |
| promotionBoosting | double | 1.0 | Boost multiplier for promoted products (0-4) |
| isInStockBoosted | bool | false | Enable in-stock boosting |
| inStockBoosting | double | 1.0 | Boost multiplier for in-stock products (0-4) |
| isNewerProductsBoosted | bool | false | Enable boosting for newer products |
| newerProductsBoosting | double | 1.0 | Boost multiplier for newer products (0-4) |
| newerProductsBoostingNumberOfDays | int | 90 | Products published within this many days are considered "newer" |
| prefixBoost | double | 1.0 | Boost for prefix matches (when search term matches beginning of a word) |

#### How Boosting Works

Search scores are calculated by multiplying the base relevance score by each enabled boost factor. For example:

*   Base score: 10
*   In-stock boost enabled (1.5): 10 × 1.5 = 15
*   Promotion boost enabled (1.2): 15 × 1.2 = 18
*   Final score: 18

Higher scores appear higher in search results.

#### Property Boosting

You can boost specific product properties to make them more influential in search:

| Property | Type | Description |
| --- | --- | --- |
| boostedProperties | array | Custom property boost configuration |

Each boosted property has:

| Property | Type | Description |
| --- | --- | --- |
| propertyName | string | Name of the property to boost |
| boostValue | double | Boost multiplier (0-10) |
| isSearchable | bool | Whether this property should be included in search |

#### Advanced Search Settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| aggregationSize | int | 100 | Maximum number of filter options returned for facets |
| isPricesExcludedFromSearch | bool | false | When enabled, prices are excluded from search, improving performance for large catalogs |

### Sample

```
"ProductSettings": {
  "IsVariantSearchEnabled": false,
  "ProductSearchSettings": {
    "IsFuzzinessAuto": true,
    "IsSynonymsApplied": true,
    "IsPopularityBoosted": true,
    "PopularityBoosting": 1.3,
    "IsPromotionBoosted": true,
    "PromotionBoosting": 1.5,
    "IsInStockBoosted": true,
    "InStockBoosting": 1.2,
    "IsNewerProductsBoosted": true,
    "NewerProductsBoosting": 1.4,
    "NewerProductsBoostingNumberOfDays": 60,
    "PrefixBoost": 1.5,
    "AggregationSize": 150,
    "BoostedProperties": [
      { "PropertyName": "name", "BoostValue": 3.0, "IsSearchable": true },
      { "PropertyName": "sku", "BoostValue": 5.0, "IsSearchable": true },
      { "PropertyName": "brand", "BoostValue": 2.0, "IsSearchable": true },
      { "PropertyName": "description", "BoostValue": 1.0, "IsSearchable": true }
    ]
  }
}
```

* * *

## Product Facets

Facets provide filtering options in product search results.

| Property | Type | Description |
| --- | --- | --- |
| productFacets | array | Configured facets for product search |

Each facet has:

| Property | Type | Description |
| --- | --- | --- |
| name | string | Property name to create facet from |
| type | string | Facet type: "term", "range", "nested" |
| isCustomProperty | bool | When true, the facet is created from custom properties rather than built-in fields |

### Facet Types

| Type | Description | Use Case |
| --- | --- | --- |
| term | Exact value matching | Brand, color, category |
| range | Numeric ranges | Price, size |
| nested | Nested document facets | Complex properties |

### Sample

```
"ProductSettings": {
  "ProductFacets": [
    { "Name": "brand", "Type": "term" },
    { "Name": "color", "Type": "term" },
    { "Name": "price", "Type": "range" },
    { "Name": "size", "Type": "term" },
    { "Name": "categoryIds", "Type": "term" }
  ]
}
```

* * *

## Properties Configuration

These settings control default properties, highlighted properties, and property lists.

### Default Properties

| Property | Type | Description |
| --- | --- | --- |
| defaultProperties | array | Default properties added to all products |

Each property can include:

| Property | Type | Description |
| --- | --- | --- |
| name | string | Property name |
| value | string | Default value |
| dataType | string | Data type (string, number, boolean, date) |
| isInheritedByVariants | bool | Whether this property is inherited by variants |
| isInheritedByLanguageVariants | bool | Whether this property is inherited by language variants |
| isInheritedBySiblings | bool | Whether this property is inherited by sibling products |

### Highlighted Properties

| Property | Type | Description |
| --- | --- | --- |
| highlightedProperties | array | Property names to display prominently in the product UI |

### Related Product Keys

| Property | Type | Description |
| --- | --- | --- |
| relatedProductKeys | array | Keys for defining product relationships (e.g., "accessories", "alternatives", "upsells") |

### Tags

| Property | Type | Description |
| --- | --- | --- |
| tagSettings | array | Available tag definitions for products |

Each tag has:

| Property | Type | Description |
| --- | --- | --- |
| name | string | Tag identifier |
| translationKey | string | Translation key for display |

### Brands

| Property | Type | Description |
| --- | --- | --- |
| brands | array | Available brand definitions |

Each brand has:

| Property | Type | Description |
| --- | --- | --- |
| name | string | Brand name |
| description | string | Brand description |
| isActive | bool | Whether the brand is active |
| isPublicVisible | bool | Whether the brand is visible to customers |

### Property Lists

Property lists allow you to define reusable sets of properties:

| Property | Type | Description |
| --- | --- | --- |
| propertyLists | array | Defined property lists |

Each property list has:

| Property | Type | Description |
| --- | --- | --- |
| id | string | Unique identifier |
| name | string | Display name |
| properties | array | Properties in this list |

### Sample

```
"ProductSettings": {
  "DefaultProperties": [
    { "Name": "brand", "Value": "", "DataType": "string", "IsInheritedByVariants": true },
    { "Name": "material", "Value": "", "DataType": "string", "IsInheritedByVariants": true }
  ],
  "HighlightedProperties": ["brand", "material", "countryOfOrigin"],
  "RelatedProductKeys": ["accessories", "alternatives", "upsells", "crossSells"],
  "TagSettings": [
    { "Name": "new", "TranslationKey": "Tag_New" },
    { "Name": "sale", "TranslationKey": "Tag_Sale" },
    { "Name": "bestseller", "TranslationKey": "Tag_Bestseller" }
  ],
  "Brands": [
    { "Name": "Acme", "Description": "Acme Corporation", "IsActive": true, "IsPublicVisible": true }
  ],
  "PropertyLists": [
    {
      "Id": "clothing",
      "Name": "Clothing Properties",
      "Properties": [
        { "Name": "material", "Value": "" },
        { "Name": "careInstructions", "Value": "" }
      ]
    }
  ]
}
```

* * *

## Inheritance Settings

When `isInheritanceEnabled` is true, you can configure which properties are inherited between products.

| Property | Type | Description |
| --- | --- | --- |
| variantsInheritStatus | array | Property names that variants inherit from parent products |
| productLanguagesInheritStatus | array | Property names that language variants inherit from the main language product |
| siblingsInheritStatus | array | Property names that sibling products inherit from each other |

### How Inheritance Works

1.  **Parent to Variant**: When a property is in `variantsInheritStatus`, changes to that property on the parent product automatically propagate to all variants.

2.  **Main Language to Language Variants**: When a property is in `productLanguagesInheritStatus`, changes to that property on the main language product propagate to all language variants.

3.  **Sibling Inheritance**: When a property is in `siblingsInheritStatus`, changes to that property on one sibling product propagate to all related siblings.

### Inheritance Priority

When a property can be inherited from multiple sources, the priority is:

1.  Direct value on the product (highest priority)
2.  Inherited from parent
3.  Inherited from main language
4.  Inherited from sibling

### Sample

```
"ProductSettings": {
  "IsInheritanceEnabled": true,
  "VariantsInheritStatus": ["brand", "material", "countryOfOrigin", "careInstructions"],
  "ProductLanguagesInheritStatus": ["price", "images", "categoryIds"],
  "SiblingsInheritStatus": ["brand"]
}
```

* * *

## Additional Settings

### HTML Editor

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isHtmlEditorRawByDefault | bool | false | When enabled, the HTML editor opens in raw HTML mode by default rather than WYSIWYG mode. |
| isHtmlEditorLinksAbsolute | bool | false | When enabled, links created in the HTML editor use absolute URLs. |

### Lowest Price Tracking

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| lowestPriceHistoryDays | int | 0 | Number of days to track price history for calculating lowest price. Required for EU Omnibus Directive compliance. Set to 30 for standard compliance. |

### Currencies

| Property | Type | Description |
| --- | --- | --- |
| currencies | array | Available currency codes for products (e.g., \["USD", "EUR", "NOK"\]) |

### Cart Display

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| isVariantNameDefaultOnCart | bool | false | When enabled, variant names are displayed on cart line items instead of parent product names. |

### Sort Index

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| omniumSortIndexProviderPromotionBoost | int | 0 | Boost value applied to promoted products in the sort index. |

### Sample

```
"ProductSettings": {
  "IsHtmlEditorRawByDefault": false,
  "IsHtmlEditorLinksAbsolute": false,
  "LowestPriceHistoryDays": 30,
  "Currencies": ["NOK", "SEK", "EUR"],
  "IsVariantNameDefaultOnCart": true
}
```

* * *

## Product Ratings

Configure product rating functionality.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| productRatingSettings.ratingNeedsVerificationThreshold | int | null | Minimum rating count before verification is required |
| productRatingSettings.verifyRatingNotificationDelayInMinutes | int | null | Minutes to wait before sending verification notification |
| productRatingSettings.marketSpecificRatings | bool | false | When enabled, ratings are specific to markets rather than global |

### Sample

```
"ProductSettings": {
  "ProductRatingSettings": {
    "RatingNeedsVerificationThreshold": 5,
    "VerifyRatingNotificationDelayInMinutes": 1440,
    "MarketSpecificRatings": true
  }
}
```

* * *

## Product Alerts

Configure product alert functionality.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| productAlertSettings.isProductAlertEnabled | bool | false | Enable product alerts feature |
| productAlertSettings.alertIsDeactivatedThreshold | int | 0 | Number of days a product must be inactive before generating an alert |

### Sample

```
"ProductSettings": {
  "ProductAlertSettings": {
    "IsProductAlertEnabled": true,
    "AlertIsDeactivatedThreshold": 30
  }
}
```

* * *

## Product Statuses

Configure custom product statuses.

| Property | Type | Description |
| --- | --- | --- |
| productStatuses | array | Available product status definitions |

### Sample

```
"ProductSettings": {
  "ProductStatuses": [
    { "Name": "draft", "TranslationKey": "ProductStatus_Draft" },
    { "Name": "review", "TranslationKey": "ProductStatus_Review" },
    { "Name": "approved", "TranslationKey": "ProductStatus_Approved" },
    { "Name": "published", "TranslationKey": "ProductStatus_Published" }
  ]
}
```

* * *

## Product Types

Product types allow you to define different categories of products with their own specific properties. For detailed configuration options, see [Product Types](configuration/product-types.md).

* * *

## Completion Rates

Completion rates allow you to measure how complete your product data is by assigning points to different properties. For detailed configuration options, see [Completion Rates](configuration/completion-rates.md).

* * *

## Customs and Compliance

Configure customs codes for international shipping compliance.

| Property | Type | Description |
| --- | --- | --- |
| customsCodes | array | Available customs/tariff codes |

### Sample

```
"ProductSettings": {
  "CustomsCodes": [
    { "Code": "6109.10", "Description": "T-shirts, singlets and other vests, of cotton" },
    { "Code": "6403.99", "Description": "Other footwear with outer soles of rubber, plastics, leather" }
  ]
}
```

* * *

## Supplier Settings

Configure supplier-related settings for products.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| supplierSettings.defaultProperties | array | \- | Default properties for suppliers |
| supplierSettings.useLocalSupplier | bool | false | When enabled, supplier assortment is automatically set based on user access rights |
| supplierSettings.prioritizeStoreGroupsOnCreate | bool | false | When enabled and useLocalSupplier is true, store group IDs are added to supplier assortment instead of store IDs |
| supplierSettings.tagSettings | array | \- | Available tags for suppliers |
| supplierSettings.addressTypes | array | \- | Available address types for suppliers |
| defaultSupplierLeadTime | int | null | Default lead time in days for supplier orders |

### Sample

```
"ProductSettings": {
  "DefaultSupplierLeadTime": 14,
  "SupplierSettings": {
    "UseLocalSupplier": true,
    "PrioritizeStoreGroupsOnCreate": false,
    "DefaultProperties": [
      { "Name": "paymentTerms", "Value": "Net 30" }
    ],
    "TagSettings": [
      { "Name": "preferred", "TranslationKey": "SupplierTag_Preferred" }
    ],
    "AddressTypes": ["warehouse", "billing", "returns"]
  }
}
```

* * *

## Complete Configuration Example

Below is a comprehensive example showing all ProductSettings configured:

```json
{
  "ProductSettings": {
    "ReadOnly": false,
    "ShowFilters": true,
    "IsProductCreateDisabled": false,
    "FilterByActiveAsDefault": true,

    "HasPackages": true,
    "DisablePackageAutoBreakdownOnAddProductFromOrder": false,
    "AllocatePackagePricesToComponents": true,

    "IsProductStatisticsEnabled": true,
    "IsIncompleteProductsEnabled": false,
    "IsProductOptionsEnabled": true,
    "IsProductLanguagesEnabled": true,
    "IsInheritanceEnabled": true,
    "IsLocalProductsEnabled": false,

    "IsAssortmentStoreIdRequired": false,
    "IsAssortmentCodesRequired": false,
    "IsMultipleAssortmentCodesAllowed": true,
    "RequireProductMarket": true,

    "IsOmniumUrlProviderEnabled": true,
    "OmniumUrlProviderTemplate": "/products/{productCategory}/{productId}",

    "PriceManagement": true,
    "HasExternalPrices": false,
    "HasCustomerSpecificPrices": true,
    "HasSeparatePrices": true,
    "DeleteExpiredPricesThreshold": 30,
    "IsProductAssortmentUpdatedByPrices": true,
    "IsProductPriceSetToLowestVariantPrice": true,

    "CostPriceManagement": true,
    "DefaultProductCostCurrency": "NOK",
    "HasSeparateCostPrices": false,

    "IsLocationEqualForAllVariants": false,
    "SyncExistingVariantsAcrossLanguages": true,
    "DisableIsActiveSyncForVariants": false,

    "IsImagesAutoResizedOnUpload": true,
    "AssetPurposeKeys": ["main", "thumbnail", "lifestyle"],

    "RootCategoryId": "catalog",
    "IsProductCategoryParentsAdded": true,
    "IsProductCategoryEnriched": true,
    "IsNonexistentCategoryIdsRemoved": true,

    "IsProductLanguagesEnabled": true,
    "DefaultProductContentLanguageCode": "en",
    "ProductContentLanguages": [
      { "LanguageCode": "en", "DisplayName": "English" },
      { "LanguageCode": "no", "DisplayName": "Norwegian" }
    ],

    "IsVariantSearchEnabled": false,
    "ProductSearchSettings": {
      "IsFuzzinessAuto": true,
      "IsSynonymsApplied": true,
      "IsPopularityBoosted": true,
      "PopularityBoosting": 1.3,
      "IsPromotionBoosted": true,
      "PromotionBoosting": 1.5,
      "IsInStockBoosted": true,
      "InStockBoosting": 1.2,
      "PrefixBoost": 1.5
    },

    "ProductFacets": [
      { "Name": "brand", "Type": "term" },
      { "Name": "color", "Type": "term" },
      { "Name": "price", "Type": "range" }
    ],

    "DefaultProperties": [
      { "Name": "brand", "Value": "" }
    ],
    "HighlightedProperties": ["brand", "material"],
    "RelatedProductKeys": ["accessories", "alternatives"],

    "VariantsInheritStatus": ["brand", "material"],
    "ProductLanguagesInheritStatus": ["price", "images"],

    "LowestPriceHistoryDays": 30,
    "Currencies": ["NOK", "SEK", "EUR"],

    "ProductRatingSettings": {
      "MarketSpecificRatings": true
    },

    "ProductAlertSettings": {
      "IsProductAlertEnabled": true,
      "AlertIsDeactivatedThreshold": 30
    }
  }
}
```

* * *

## Troubleshooting

### Common Issues

| Problem | Possible Cause | Solution |
| --- | --- | --- |
| Products not appearing in search | `requireProductMarket` is enabled but product has no market | Assign a market to the product |
| Prices not showing | `hasSeparatePrices` is enabled but prices not configured | Ensure prices are created with the separate prices API |
| Variants not searchable | `isVariantSearchEnabled` is disabled | Enable variant search (may require data refresh) |
| Product won't activate | `disableIsActiveSyncForVariants` is enabled and no variants are active | Activate at least one variant first |
| Category filters empty | `productFacets` doesn't include categoryIds | Add categoryIds to facet configuration |
| Images not resizing | `isImagesAutoResizedOnUpload` is disabled | Enable auto-resize and configure aspect ratios |

### Performance Considerations

*   **Many prices per product**: Use `hasSeparatePrices` and set appropriate `maxSeparatePriceSize`
*   **Slow search**: Review `boostedProperties` and disable unnecessary ones
*   **Bulk imports**: Enable `isPriceUpdateOperationDelayed` for batch processing
*   **Large catalogs**: Contact Omnium support for optimization recommendations
