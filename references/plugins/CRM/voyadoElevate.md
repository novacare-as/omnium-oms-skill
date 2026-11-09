# Voyado Elevate (BETA)

Source: https://docs.omnium.no/docs/plugins/CRM/voyadoElevate

> Omnium provides a standardized integration with Voyado Elevate.

## The Voyado Elevate integration supports the following

NB: Not fully tested yet

*   Synchronization of products from Omnium to Elevate
    *   Siblings, products and variants are mapped with the same structure to product groups -> products -> variants
    *   Locale overrides (from product language versions)
    *   Market overrides for prices and stock
    *   Stock per store (StoreStock)
    *   Error messages on products

## Not currently supported:

*   Prices not stored on the product, meaning separate price objects or external prices.
*   Voyado Elevate Notifications (clicks, add-to-cart, payment). This must be done by the web page selling the products.
*   Voyado Elevate Translations. We support locale override but currently not translations that uses ids to translate for more stable filters and product selections.

* * *

## Configuration Steps

1.  **Add a new connector with name `VoyadoElevate`** Add url to Host and api key to Client app secret.
2.  **Add scheduled tasks** VoyadoElevateProductExportFullScheduledTask running once per day and VoyadoElevateProductExportDeltaScheduledTask running once every 5 minutes.
3.  **Add markets in Elevate** Markets must be setup in Elevate under Admin -> Configuration, with IDs matching the ID of the markets in Omnium.
4.  **Ensure markets match** All markets allowed by the connector settings in Omnium must exist in Elevate or the export will most likely fail with "Bad Request".

* * *

## Structure Mapping

Omnium products are mapped to the Voyado Elevate structure as follows:

| Omnium | Voyado Elevate |
| --- | --- |
| Sibling Group | ProductGroup |
| Product | Product |
| Variant | Variant |

### Sibling Groups

In Omnium, products with the same `ParentId` are considered siblings and are grouped together. These sibling groups are mapped to a single ProductGroup in Voyado Elevate. Products without a `ParentId` or with a unique `ParentId` become their own ProductGroup.

### Single-SKU products (no variants)

When an Omnium product is a SKU and has no variants, the product itself is mapped as both the Elevate Product and a single Variant within it. Product-level data goes to the Product defaults, while price and stock data goes to the Variant.

### Multi-variant products

When an Omnium product has variants, the product-level data is mapped to the Elevate Product defaults, and each Omnium variant becomes an Elevate Variant with its own price, stock, and size data.

* * *

## Defaults and Overrides

Voyado Elevate uses a system of **defaults** and **overrides** to handle market and locale-specific variations:

*   **Defaults**: The base values that apply when no override matches the request context
*   **Overrides**: Market or locale-specific values that replace defaults when they match the request context

The integration uses two types of overrides:

*   **Locale overrides** (format: `*|en-GB`): For language-specific product data like titles and descriptions
*   **Market overrides** (format: `SE|*`): For market-specific variant data like prices

* * *

## Field Mapping

### Product Defaults

These fields are mapped from the Omnium Product to the Elevate Product defaults:

| Omnium Field | Elevate Field | Notes |
| --- | --- | --- |
| `Name` | `Title` | Falls back to ProductId if empty |
| `SeoInformation.Uri` | `Url` |  |
| `Brand` | `Brand` |  |
| `Description` | `Description` |  |
| `ProductCategories` | `Category` / `Ontology` |  |
| `Gender` | `Gender` |  |
| `AverageRating` | `Rating` |  |
| `Weight` | `Weight` | Unit is always **kg** |
| `Published` | `ReleaseDate` | Format: `yyyy-MM-dd` |
| `Color` | `ColorInitial` | Needs be a hex value. If not we try to map common colors. |
| `Properties` | `CustomLabels` | Maximum 20 properties |
| `Assets` | `Images` | Must be unique. Images that are already used will not be added |

### Product Overrides (Locale)

When multiple language versions of the same product exist, the non-default languages are mapped to Product Overrides. These contain many of the same fields as Product Defaults except for weight, rating and color.

The integration uses the **default market** in Omnium to determine which product version becomes the default in Elevate. Products are matched by comparing the product's `Language` field with the market's `LanguageCode` and `IsoLanguageCode`.

*   **Default in Elevate**: The product version that matches the default market's language in Omnium
*   **Overrides in Elevate**: Product versions with other languages become locale overrides

### Variant Defaults

These fields are mapped from the Omnium Variant (or Product if single-SKU) to the Elevate Variant defaults:

| Omnium Field | Elevate Field | Notes |
| --- | --- | --- |
| `Prices.UnitPrice` or `DefaultPrice.UnitPrice` | `SellingPrice` |  |
| `Prices.OriginalUnitPrice` or `DefaultPrice.OriginalUnitPrice` | `ListPrice` |  |
| `Prices.Cost` or `Cost` | `Cost` |  |
| `AvailableInventory` | `Stock` |  |
| `Inventory` | `StoreStock` | Dictionary of warehouse code to quantity |
| `Size` | `Size` |  |
| `SeoInformation.Uri` | `Url` |  |
| `AlternativeProductName` or `Name` | `Label` |  |
| `Weight` | `Weight` | Only if all variants have weight set |
| `Properties` | `CustomLabels` | Maximum 20 properties |

### Variant Overrides (Market Prices and Stock)

For each market, a Variant Override is created containing market-specific pricing and stock. Each market override contains the price that matches the market and the stores set on the product (if configured). Stock is calculated by summing inventory from warehouses (stores) that are available on the specific market (based on the store's `AvailableOnMarkets` setting).

| Omnium Field | Elevate Field | Notes |
| --- | --- | --- |
| `Prices.UnitPrice` or `DefaultPrice.UnitPrice` | `SellingPrice` |  |
| `Prices.OriginalUnitPrice` or `DefaultPrice.OriginalUnitPrice` | `ListPrice` |  |
| `Prices.Cost` or `Cost` | `Cost` |  |
| `Inventory` | `Stock` | Sum of quantities from warehouses available on the market |

* * *

## Key Behaviors

### Only active products are synced

Products and variants must have `IsActive = true` to be included in the sync to Elevate.

### Key prefixes

To ensure uniqueness across different entity types, keys are prefixed:

*   Product group keys: `pg_` prefix
*   Product keys: `p_` prefix

### Custom properties limit

A maximum of 20 properties per product or variant are synced to Elevate as custom labels.

* * *

## API Operations

The following table shows the various operations used in syncing data from Omnium to Voyado.

| **Operation** | **Endpoint** | **Condition** | **Use case** |
| --- | --- | --- | --- |
| **PUT** | `/api/admin/v4/import/catalog` | Used by full sync scheduled task | Will overwrite all existing catalogues |
| **POST** | `/api/admin/v4/import/catalog` | Used by delta sync scheduled task | Will replace relevant product groups |
