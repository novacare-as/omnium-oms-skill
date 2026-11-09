# Products

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/Products

> Product synchronization between Omnium and Sitoo including categories, variants, and attributes.

## Product Sync/Export

The Sitoo integration supports multiple ways to synchronize products from Omnium to Sitoo. Products can be exported automatically on a schedule, triggered by product changes, or initiated manually. The integration supports both
incremental (delta) and full synchronization strategies.

### Export Triggers

#### Scheduled Delta Export

The standard synchronization method that runs at configured intervals (e.g., hourly). It identifies products that have been modified since the last export and synchronizes only those products. This approach is efficient for ongoing synchronization since it only processes changed products rather than the entire catalog.

The integration tracks the last successful export timestamp to determine which products need syncing. To avoid exporting products that are still being edited, a 10-minute buffer is applied—products modified within the last 10 minutes are excluded from the current sync and picked up in the next cycle.

**Configuration -> Settings -> Integrations -> Scheduled tasks**

```json
{
    "schedule": "*/45 * * * *",
    "implementationType": "SitooProductExporterScheduledTask",
    "isDisabled": false
}
```

#### Scheduled Full Export

A complete synchronization of all products regardless of when they were last modified. This ensures all products and prices are accurate in Sitoo and is typically scheduled daily as a safeguard against any missed updates.

Full export is more resource-intensive than delta export since it processes the entire catalog. It is particularly useful for recovering from sync issues or after configuration changes when you need to guarantee the two systems are fully aligned.

**Configuration -> Settings -> Integrations -> Scheduled tasks**

```json
{
    "schedule": "0 0 * * *",
    "implementationType": "SitooFullProductExportScheduledTask",
    "isDisabled": true
}
```

#### Event-Driven Export

Products are automatically exported when they are modified in Omnium, providing near real-time synchronization for individual product changes. The export triggers immediately on product save or update, ensuring changes are reflected in Sitoo without waiting for the next scheduled sync.

This is generally not the preferred synchronization method. If products are updated frequently in Omnium—especially through integrations from other systems such as ERP or PIM—event-driven export can cause excessive API calls to Sitoo, leading to rate limiting issues and degraded performance. In such scenarios, scheduled delta export provides better control and efficiency.

### Export Modes

#### Market-Based Export (Default)

All products are exported to a single Sitoo environment per market. Products are grouped by their market assignment in Omnium.

**Use case:** Single-location retailers or businesses with a centralized product catalog where all stores share the same assortment.

#### Store Assortment Export

Products are exported per store, allowing different stores to have different product availability within the same market.

**Use case:** Multi-location retailers where each store carries a different selection of products.

**Configuration:** Enable via the `ExportWithStoreAssortment` setting.

### Sync Process Overview

1.  **Product Selection**

    *   For delta sync: Products modified since the last export are identified
    *   For full sync: All products are selected
    *   Products are filtered by market and optionally by language
2.  **Grouping**

    *   Products are grouped by market (and by store if store assortment is enabled)
3.  **Category Sync**

    *   The category tree is synchronized before products (see Category Synchronization documentation)
    *   Categories are synced once per export batch, not per product
4.  **Product Mapping**

    *   Omnium product data is transformed to Sitoo format
    *   Variants, categories, and custom attributes are mapped
5.  **Upload**

    *   Products are uploaded in batches of 200
    *   New products are created; existing products are updated
    *   Variant relationships are established after products are created
6.  **Image Export**

    *   Product images are resized and uploaded (if enabled)
    *   Images are processed after product data is synchronized
    *   Images should have the correct file extension in Omnium
7.  **ID Storage**

    *   Sitoo product IDs are stored back in Omnium for future reference
    *   Enables the integration to identify existing products on subsequent syncs

### Configuration Options

| Setting | Description | Default |
| --- | --- | --- |
| **SkipProductExport** | Disable all product synchronization | `false` |
| **ExportWithStoreAssortment** | Enable per-store product availability | `false` |
| **DisableCategoryExportForIProductExporter** | Skip category sync during event-driven export | `false` |
| **SitooProductLanguage** | Filter products by language | Not set (all languages) |
| **DefaultProductMarket** | Fallback market for products without explicit market assignment | Not set |
| **EnableCustomAttributes** | Enable custom attribute synchronization | `false` |
| **ProductPropertiesAsCustomAttributes** | Map specific product properties to Sitoo custom fields | Not set |
| **IgnoreImagesInProductExport** | Disable image export entirely | `false` |
| **ExportOnlyMainImageInProductExport** | Export only the primary product image | `true` |
| **ExportFilesInProductExport** | Sync the product's PDF assets to Sitoo Product Files (added and removed to match Omnium). Images are exported regardless of this flag | `false` |
| **MaxImageSize** | Maximum image dimensions and file size | 800×800 px, 1 MB |
| **MapProductVirtualToStockCountEnable** | When enabled, virtual products are exported with `stockcountenable = false`, disabling stock count tracking for those products in Sitoo | `false` |

Example:

```json
{
    "key": "MaxImageSize",
    "value": "2000|2000|4000000"
}
```

### Limitations

#### Batch Size

Products are processed in batches of 200. Very large catalogs will require multiple batches, which increases total sync duration.

#### Rate Limiting

The integration respects Sitoo API rate limits. During high-volume exports, requests may be queued and retried automatically with exponential backoff.

#### One-Way Sync

Product data flows from Omnium to Sitoo only. Changes made directly in Sitoo are not imported back and may be overwritten.

#### Timing Buffer

Delta sync excludes products modified within the last 10 minutes to avoid exporting incomplete changes. This means very recent edits may not appear until the next sync cycle.

#### Image Processing

Large images are resized before upload. If original images exceed the configured maximum size, quality may be reduced to meet size constraints.

* * *

## Product Variants

The Sitoo integration supports product variants (e.g., size and color combinations). Variants are synchronized as a parent-child structure where one main product acts as the parent, and all variant combinations are linked as
children.

### Variant Structure

#### Parent-Child Model

In Sitoo, variants are organized as:

*   **Parent product**: The main product record that represents the product family
*   **Child variants**: Individual SKUs linked to the parent (e.g., "T-Shirt - Red - Medium")

The first variant from Omnium becomes the main product in Sitoo. All other variants are attached to this parent.

#### Variant Groups

Variants are organized by **variant groups** — the attributes that differentiate variants from each other.

**Example:**

*   Variant Group 1: Size (options: S, M, L, XL)
*   Variant Group 2: Color (options: Red, Blue, Black)

This creates a matrix of possible variant combinations (e.g., S-Red, S-Blue, M-Red, etc.).

### Configuration

#### Defining Variant Groups

Variant groups are configured per market using a pipe-delimited list of product property names.

**Setting:** `VaiantGroupProperty`

**Example value:**

```json
{
    "key": "SitooVaiantGroupProperty",
    "value": "Color|Size"
}
```

This tells the integration to extract the `Size` and `Color` properties from each variant and use them as the grouping attributes in Sitoo.

**Requirements:**

*   Property names must match existing properties on the product/variant in Omnium
*   Each variant must have a value for every configured variant group
*   The order of attributes must be consistent across all variants

### Sync Process

#### How Variants Are Exported

1.  **Parent Creation**: The main product is created first in Sitoo, which returns a product ID

2.  **Variant Structure**: The complete variant structure (groups and all variants) is sent in a single API call

3.  **ID Mapping**: Sitoo returns product IDs for each variant, which are stored back in Omnium for future updates

4.  **Matching**: Variants are matched between Omnium and Sitoo using their SKU

#### When Variants Are Updated

The integration detects changes to the variant structure by comparing:

*   Number of variant groups
*   Number of variants
*   Attribute values for each variant
*   Barcodes for each variant

If any of these change, the complete variant structure is re-sent to Sitoo.

### SKU and Barcode Handling

#### SKU Requirements

*   Every variant must have a unique SKU
*   SKUs are used to match variants between Omnium and Sitoo
*   The main product SKU comes from the first variant

#### Barcode Handling

| Field | Description |
| --- | --- |
| **Barcode** | Primary barcode/EAN for the variant |
| **Barcode Aliases** | Additional GTINs for the same variant |

**Configuration:** Barcode synchronization can be disabled per market using the `IgnoreEanBarcode` setting.

### Limitations

#### Structural Requirements

*   The parent product must be created in Sitoo before variants can be attached
*   All variants must have a value for every configured variant group
*   Adding or removing variant groups requires a full variant structure update

#### SKU Constraints

*   Variant SKUs must be unique across the entire Sitoo catalog
*   If a SKU already exists as a standalone product in Sitoo, it cannot be converted to a variant automatically

#### Attribute Consistency

*   Every variant must have exactly the same number of attributes as there are variant groups
*   Missing or extra attributes will cause the variant export to fail with a validation error

#### Update Behavior

*   Changing the variant structure (adding/removing variants or groups) replaces the entire variant setup in Sitoo
*   Simple updates to price or title do not require a variant structure update

* * *

## Categories

The Sitoo integration synchronizes product categories from Omnium to Sitoo as a hierarchical tree structure. Categories are exported one-way from Omnium to Sitoo, maintaining parent-child relationships and ensuring both systems
stay aligned.

### How the Sync Works

#### Sync Trigger

Category synchronization runs automatically as part of the product export process. When products are exported to Sitoo, the integration first ensures the category tree is up to date before assigning products to their categories.

#### Sync Process

1.  **Starting Point**: The sync begins from a configured root category in Omnium. All subcategories under this root are included in the synchronization.

2.  **Comparison**: The integration fetches all existing categories from Sitoo and compares them against the Omnium category tree.

3.  **Create, Update, or Delete**:

    *   **New categories** in Omnium are created in Sitoo
    *   **Changed categories** (e.g., renamed or moved) are updated in Sitoo
    *   **Deleted categories** (exist in Sitoo but no longer in Omnium) are removed from Sitoo
4.  **Hierarchy Preservation**: Parent-child relationships are maintained. A child category is always created after its parent, ensuring the tree structure is valid in Sitoo.

5.  **ID Linking**: After a category is created in Sitoo, the Sitoo category ID is stored back in Omnium. This link is market-specific, allowing the same Omnium category to map to different Sitoo categories across markets.

#### Multi-Market Support

Each market can have its own Sitoo instance. The integration tracks category IDs per market, so a single Omnium category tree can be synchronized to multiple Sitoo environments independently.

#### Language Handling

Categories are synchronized using the language configured for each market's product content. If duplicate categories for different languages are detected in Sitoo, the integration automatically cleans up incorrect language
versions.

### How the Mapping Works

#### Category Fields

| Omnium Field | Sitoo Field | Description |
| --- | --- | --- |
| Category ID | Custom1 | Omnium's unique identifier stored in Sitoo for reference |
| Parent Category ID | Custom2 | Omnium's parent reference stored in Sitoo |
| Name | Title | The display name of the category |

#### Product-to-Category Assignment

Products in Sitoo can belong to multiple categories but must have one default (primary) category:

| Omnium Concept | Sitoo Field | Description |
| --- | --- | --- |
| Main Category | Defaultcategoryid | The product's primary category for navigation and display |
| All Categories | Categories | List of all category IDs the product belongs to |

The main category is determined by the `IsMainCategory` flag on the product-category relationship in Omnium.

### Configuration

#### Root Category

Configure the starting point for category synchronization by setting the **Root Category ID** as a property in the connector. Only categories under this root (and their descendants) will be synchronized to Sitoo.

```json
{
    "Key": "RootCategoryId",
    "Value": "{category-id}"
}
```

If not explicitly configured, the integration uses the tenant's default root category from Product Settings.

#### Disabling Category Sync

Category synchronization can be disabled independently from product export. This is useful when:

*   Categories are managed manually in Sitoo
*   You want to run a one-time category sync separately from ongoing product updates
*   Troubleshooting category-related issues

Set **DisableCategoryExportForIProductExporter** to `true` to prevent automatic category sync during product exports:

```json
{
    "Key": "DisableCategoryExportForIProductExporter",
    "Value": "true"
}
```

* * *

## Related Products

Each product in Sitoo has three sections for linking to other products: `accessories` (accessory products), `related` (cross-selling), and `similar` (up-selling). Omnium fills these from the related-product groups on a product.

In the Sitoo connector settings, under **Related Products Mapping**, map each Omnium related-product group key to one of the three Sitoo sections. During product export, the products in each mapped group are linked in the chosen section.

*   Only regular products and main variants get related products, not child variants.
*   A related product must already exist in Sitoo to be linked; products not yet exported are picked up on a later export.
*   The mapping is per market and one-way: emptying a group in Omnium clears that section in Sitoo, and unmapped sections are left untouched.

* * *

## Product → Sitoo Mapping

### Main Product Fields

| Sitoo | Omnium |
| --- | --- |
| `sku` | `SkuId` |
| `title` | `Name` |
| `descriptionshort` | `ShortDescription` |
| `description` | `Description` |
| `skumanufacturer` | `SupplierSkuId` |
| `unitlabel` | `Unit` |
| `activepos` | `IsActive` |
| `deliveryinfo` | `Properties["SitooDeliveryInfo"]` |
| `barcode` | `Ean` ?? `Gtins[0]` ?? `""` |
| `barcodealiases` | `Gtins` |
| `stockcountenable` | `true`, or `!IsVirtual` when `MapProductVirtualToStockCountEnable` is enabled |

### Pricing

| Sitoo | Omnium |
| --- | --- |
| `moneyprice` | `Price.UnitPrice` |
| `moneypriceorg` | `Price.OriginalUnitPrice` |
| `moneypricein` | `Price.Cost` |

### Categories & Classification

| Sitoo | Omnium |
| --- | --- |
| `defaultcategoryid` | `MainCategoryId` → Sitoo external ID |
| `categories` | `ProductCategories` → Sitoo external IDs |
| `vatid` | Config mapping by `ProductType` |

### Custom Fields

Custom fields are configured in the Sitoo connector via the `properties` array using `keyGroup: "CustomFieldProperty"`:

*   `value` must be `"1"` through `"5"` (as string)
*   `key` must match the product property key exactly
*   If `custom1` is configured (value `"1"`), it overrides the default `ProductId` behavior

Example configuration:

```json
{
  "name": "sitoo",
  "type": "pos",
  "host": "https://api.sitoo.com/v2/accounts/12345/",
  "properties": [
    {
      "key": "MaterialType",
      "value": "2",
      "keyGroup": "CustomFieldProperty"
    },
    {
      "key": "StyleCode",
      "value": "3",
      "keyGroup": "CustomFieldProperty"
    },
    {
      "key": "Collection",
      "value": "4",
      "keyGroup": "CustomFieldProperty"
    }
  ]
}
```

| Sitoo Field | Default (no config) | With Config Above |
| --- | --- | --- |
| `custom1` | `ProductId` | `ProductId` |
| `custom2` | `null` | `Product.Properties["MaterialType"]` |
| `custom3` | `null` | `Product.Properties["StyleCode"]` |
| `custom4` | `null` | `Product.Properties["Collection"]` |
| `custom5` | `null` | `null` |

### Custom Attributes

Custom attributes are dynamic product attributes synced to Sitoo. They differ from custom fields (custom1-5) in that they are defined in Sitoo and fetched via
API.

Enable Custom Attributes

```json
{
  "name": "sitoo",
  "type": "pos",
  "properties": [
    {
      "key": "EnableCustomAttributes",
      "value": "true"
    }
  ]
}
```

Some attributes are mapped automatically if they exist in Sitoo. They are used for filtering products promotions should apply to.

| Sitoo Attribute ID | Omnium Source |
| --- | --- |
| `oms-promotion-brand` | `Product.Brand` |
| `oms-promotion-season` | `Product.Season` |
| `oms-promotion-productId` | Sitoo external ID |

Other attributes are mapped from `Product.Properties` where the property key matches the Sitoo attribute ID. For example, if Sitoo has a custom attribute with ID `MaterialType`, it will be populated from `Product.Properties["MaterialType"]`.

#### How It Works

1.  Custom attributes are defined in Sitoo (not in Omnium config)
2.  During product export, Omnium fetches attributes from Sitoo
3.  For each attribute, Omnium looks up the value from the product:
    *   Built-in IDs (`oms-promotion-*`) → mapped to `Brand`, `Season`, or external ID
    *   Other IDs → mapped from `Product.Properties[attributeId]`
4.  Values are typed (`string` or `integer`) based on attribute definition in Sitoo

#### Notes

*   Attributes must exist in Sitoo before they can be populated
*   Set `EnableCustomAttributes: true` per market or globally

### Variant-specific

| Sitoo | Omnium |
| --- | --- |
| `attributes` | Variant properties (Color, Size, etc. - configurable) |

To set up the variant attributes, see the [Variant Mapping](Products.md#variant-structure) section.

### Not Mapped

`manufacturerid`, `seo_*`, `allowdecimals`

`similar`, `related`, and `accessories` are mapped when configured — see [Related Products](Products.md#related-products).

* * *

## Product Export Errors and Troubleshooting

### Validation Errors

These errors occur before the product is sent to Sitoo.

| Error | Cause | Resolution |
| --- | --- | --- |
| **Invalid product, skuId is missing** | Product or main variant has no SKU | Ensure all products have a valid SKU before export |
| **Cannot export product with IsSku=false and empty list of variants** | Product is marked as having variants but the variants list is empty | Either set `IsSku=true` for single products, or add variants to the product |
| **Wrong number of variant attributes** | A variant has fewer or more attribute values than the configured variant groups | Ensure every variant has a value for each variant group (e.g., if groups are Size and Color, every variant must have both) |

### Product Creation Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Could not add sitoo product** | Sitoo API rejected the product creation request | Check the API response for details; common causes include invalid data format or missing required fields |
| **SKU already exists** | A product with this SKU already exists in Sitoo | The integration will automatically attempt to update instead; if this fails, check for duplicate SKUs or manually resolve in Sitoo |

### Variant Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Could not set productVariants in Sitoo** | Sitoo rejected the variant structure | Verify all variants have valid SKUs and matching attribute counts |
| **Variant already exists** | A variant SKU exists as a standalone product in Sitoo | Remove the standalone product in Sitoo, or use a different SKU for the variant |
| **Cannot create Sitoo variants before main product variant is created** | Attempted to export variants before the parent product exists | Ensure the main product is successfully created first; this is usually handled automatically |

### External ID Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Could not find sitooProductId on Omnium product** | Product doesn't have a Sitoo external ID but update was attempted | Re-export the product to create it in Sitoo first |
| **Invalid SitooProductId** | The stored external ID is not a valid number | Clear the external ID and re-export the product |
| **Found dangling sitoo id** | Product has a Sitoo ID but the product no longer exists in Sitoo | The integration will automatically remove the invalid external ID |

### Image Export Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Could not add image for product** | Image upload failed | Check image URL accessibility and format |
| **Could not get base64 image** | Image could not be downloaded or converted | Verify the image URL is valid and the image is accessible |
| **Could not add image to Sitoo** | Sitoo rejected the image | Check image size limits; ensure image meets Sitoo's requirements |
| **Could not delete image in Sitoo** | Failed to remove old image during update | May require manual cleanup in Sitoo |

### Category Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Category silently skipped** | Category doesn't have a Sitoo category ID stored | Run category sync before product export |
| **No categories exported** | Product has no valid categories with Sitoo IDs | Ensure product categories exist and have been synced to Sitoo |

### API and Connection Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Unauthorized (401)** | API key is invalid or expired | Verify API credentials in connector configuration |
| **Too Many Requests (429)** | Rate limit exceeded | The integration will automatically retry with backoff; no action needed |
| **Failed with status code** | Generic API failure | Check the error details for specific cause; may be temporary Sitoo issue |

### Configuration Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Could not find market** | Product's market doesn't have Sitoo connector configured | Add Sitoo connector to the market configuration |
| **Main variant has to exist in Sitoo already** | Variant export attempted but parent product failed | Resolve parent product errors first |

### Batch Operation Errors

| Error | Cause | Resolution |
| --- | --- | --- |
| **Errors occurred during batch delete** | Some products in a batch delete operation failed | Check individual product errors; successfully deleted products are processed |
| **Could not update products** | Batch update operation had failures | Review individual product status codes in the response |

### Common Resolution Steps

1.  **Check product data completeness**

    *   Ensure SKU is present on all products and variants
    *   Verify variant attributes match configured variant groups
2.  **Verify configuration**

    *   Confirm API credentials are valid
    *   Check market has Sitoo connector enabled
3.  **Check Sitoo directly**

    *   Look for duplicate SKUs in Sitoo
    *   Verify products exist if update fails
4.  **Review image requirements**

    *   Check image URLs are accessible
    *   Verify images meet size limits
