# Products

Source: https://docs.omnium.no/docs/plugins/POS/Flow/Products

> Product synchronization from Omnium to Flow Retail including variants, product groups, brands, and images.

## Product Export

The Flow integration exports products **one-way** from Omnium to Flow Retail. Products can be exported on a schedule (delta sync) or triggered individually via the product exporter interface (recommended).

#### Event-Driven Export

Products are automatically exported when modified in Omnium, via the `IProductExporter` interface. This provides near real-time synchronization for individual product changes.

### Sync Process Overview

1.  **Product Selection** — Products modified since the last export are identified, filtered by market or market group
2.  **Brand Sync** — Brands referenced by products are created in Flow if they don't already exist
3.  **Product Mapping** — Omnium product data is transformed to Flow format (UIDs sanitized, prices converted to cents, HTML stripped from descriptions)
4.  **Create or Update** — New products are created; existing products are updated
5.  **Variant Handling** — Configurable/variant products are linked as siblings
6.  **Image Export** — Product images are uploaded to Flow
7.  **Property Sync** — Variant properties and text properties are synchronized

* * *

## Product Mapping

### Main Product Fields

| Flow | Omnium | Notes |
| --- | --- | --- |
| `productUid` | `SkuId` or `ProductId` | [UID-sanitized](../Flow.md#uid-sanitization) |
| `name` | `Name` |  |
| `sku` | `SkuId` | Falls back to `"NoSku"` |
| `description` | `Description` | HTML stripped |
| `shortDescription` | `ShortDescription` | HTML stripped |
| `brandUid` | `Brand` | Lowercased, sanitized |
| `productGroupUid` | `MainCategoryId` |  |
| `allowPurchase` | `IsActive` + assortment codes | Also validates against non-purchasable assortment codes |

### Pricing Fields

| Flow | Omnium | Notes |
| --- | --- | --- |
| `purchasePrice` | `Cost` | Converted to cents |
| `recommendedRetailPrice` | Best valid price | Skipped if using price scheduled task |
| `currencyPurchasePrice` | `Cost` + `CostCurrency` | Only set when `CostCurrency` is present |

### Physical Attributes

| Flow | Omnium | Notes |
| --- | --- | --- |
| `weight` | `Weight` or colli weight | Integer, grams |
| `height` | Colli `Height` | Integer, millimeters |
| `width` | Colli `Width` | Integer, millimeters |
| `length` | Colli `Length` | Integer, millimeters |
| `numberOfPieces` | `Colli.Count` | Defaults to 1 |

### Identification

| Flow | Omnium | Notes |
| --- | --- | --- |
| `gtins` | `Gtins` or `Ean` | GTIN/EAN barcodes |
| `manufacturerSku` | External ID "Manufacturer SKU" |  |

### VAT/Tax

| Flow | Omnium | Notes |
| --- | --- | --- |
| `vatCodeUid` | Product type VAT mapping or default | See [VAT Configuration](Products.md#vat-configuration) |

### Other Fields

| Flow | Omnium | Notes |
| --- | --- | --- |
| `serialNoRequired` | `IsSerializableProduct` | `ONSALE` if serializable, otherwise `NO` |
| `discontinuedFrom` | `StopPublished` | Only on updates |
| `limitToStoreUids` | `StoreIds` | Restricts product to specific stores |
| `productType` | Property `FlowProductType` | Defaults to `STOCK` |

* * *

## Product Types

The product type is determined by the `FlowProductType` property on the product. Possible values:

| Type | Description |
| --- | --- |
| `STOCK` | Standard inventory-tracked product (default) |
| `CONFIGURABLE` | Product with variant options |
| `GIFTCARD` | Gift card product |

* * *

## Configurable Products (Variants)

Products with a custom property with the key `variantAttributes` are treated as **configurable products** in Flow. This creates a parent-child structure where the main product defines variant options and child products represent individual SKUs.

### How Variants Work

1.  The main product is created with `productType: CONFIGURABLE`
2.  **Variant properties** (e.g., Color, Size) are defined in Flow via the `FlowVariantProperty` key group
3.  Child products are linked as siblings under the configurable parent
4.  Each child product has values for all configured variant properties

### Configuration

#### Defining Variant Properties

Add variant properties to the list of default properties in product settings with the key group `FlowVariantProperty`:

```json
{
    "key": "Color",
    "keyGroup": "FlowVariantProperty"
}
```

This tells the integration to create single-select properties in Flow for variant selection.

#### Text Properties

For non-variant product properties (displayed as text or multi-select), use the key group `FlowTextProperty`:

```json
{
    "key": "Material",
    "keyGroup": "FlowTextProperty"
}
```

* * *

## Product Groups

When `ProductGroupRootId` is configured, Omnium categories under the specified root are exported as **product groups** in Flow. Each product's `MainCategoryId` maps to a Flow product group. Products in Flow can only be in one product group, while in Omnium products can be in multiple categories.

```json
{
    "key": "ProductGroupRootId",
    "value": "{root-category-id}"
}
```

If not set, the `DefaultProductGroupUid` is used as a fallback for all products.

**Scheduled Task:**

```json
{
    "schedule": "0 2 * * *",
    "implementationType": "FlowCategoryScheduledTask",
    "isDisabled": false
}
```

The product group scheduled task uses change detection — it only syncs when the category tree has been modified since the last run.

* * *

## Brands

Brands are synced automatically as part of the product export. When a product references a brand that doesn't exist in Flow, the integration creates it automatically.

The brand UID is derived from the brand name: lowercased and sanitized (e.g., `"Nike Air"` becomes `nike_air`).

* * *

## Product Images

Product images (media) are exported after product data is synchronized. The integration sends the image URL and thumbnail URL to Flow, and marks the main image as the cover image.

* * *

## VAT Configuration

VAT codes are resolved in the following priority order:

1.  **Product-level property** — `vatCodeUid_{marketGroupId}` or `vatCodeUid` property on the product (recommended)
2.  **Product type VAT** — A `VAT_{marketId}` property in the product's type property group
3.  **Tax rate from price** — If the product has a price with a specific `TaxRate` for the current market group, the matching VAT code from the `VatCodeUids` mapping is used
4.  **Default** — The `DefaultVatCodeUid` from the connector configuration

### VAT Code Mapping

Map product types or tax rates to Flow VAT code UIDs using the `VatCodeUids` key group:

```json
{
    "key": "25",
    "value": "standard-vat-uid",
    "keyGroup": "VatCodeUids"
}
```

* * *

## Configuration Reference

| Setting | Description | Default |
| --- | --- | --- |
| `ProductGroupRootId` | Root category ID for product group sync | Not set |
| `DefaultProductGroupUid` | Fallback product group UID | Not set |
| `DefaultVatCodeUid` | Default VAT code UID | Required |
| `CreatePackageSlots` | Enable package/bundle products | `false` |
| `SendPackageProductOnPurchaseOrder` | Send package product on POs | `false` |
