# Front Systems

Source: https://docs.omnium.no/docs/plugins/POS/FrontSystems

> Omnium integrates with Front Systems to sync products, orders, customers, inventory and live cart calculations from 'carts' in POS

## Stores

Stores are **not synchronized automatically** between Omnium and Front Systems.
To ensure inventory synchronization works correctly, each store in Omnium must be manually configured with external IDs that map to the corresponding identifiers in Front Systems:

*   **FrontSystemStockId** → Maps to the StockId in Front Systems
*   **FrontSystemStoreId** → Maps to the StoreId in Front Systems
*   **FrontSystemInventoryStockId** → Optional. Allows a single Omnium store to fetch inventory from multiple Front Systems stock IDs. Add one external ID per stock ID. When set (and `IsStockIdExternalId` is `true`), inventory sync uses these IDs instead of the store's own ID. Also used during order import to resolve which Omnium store a Front Systems stock ID belongs to.
*   **FrontSystemSaleStockId** → Optional. When set, overrides the StockId used on websale order lines (both regular and return orders). This controls which warehouse stock is automatically moved from when a sale is registered. If not set, falls back to **FrontSystemStockId**.

Both IDs should normally be added as external IDs on the warehouse (store) in Omnium.

In some cases, you do not need to map **StockId** if the store in Omnium has been created with the same ID as in Front Systems (by convention). However, in most cases explicit mapping is required. When using explicit mapping, ensure that connector property **IsStockIdExternalId** is set to **true**.

## Orders

### Overview

'Click And Collect' and 'Ship From Store' orders can be created in Front Systems as 'Omnichannel orders'.

*   Enable 'Omnichannel order' creation in Front System by setting connector custom property **IsOmnichannelOrderEnabled** to **true**
*   Orders are exported to Front Systems using the "Export Order" workflow step
*   Also, if 'Ship from store' orders are also needed to be posted as sales when they are completed, set `IsOmnichannelOrderSalesEnabled` to true and ensure that the workflow for completed orders has an "Export Order" workflow step. For Click&Collect, this automatically happens in Front when the item is bought in POS.

### Click & Collect

Orders with order type "ClickAndCollect" in Omnium are sent to Front Systems as "reserved orders" in Front Systems. When updated in Front Systems, and event will trigger and update the order in Omnium. The changes that are reflected in Omnium includes:

*   Order completion (order picked up)
*   Order cancellations
*   Partial cancellations (order line cancelled/quantity changed)
*   Order line updates

### Ship from Store

*   If not type 'ClickAndCollect', it will be sent as 'Ship from store' order - regardless of order type. The main difference is that is contains both payment and shipment information.
*   Otherwise it will listen to events from Front Systems just as the click and collect orders do

### Sales posting Orders

*   Completed online orders that are exported to Front will be posted as sales, which triggers inventory updates in Front Systems and records the order for financial reporting.

#### Gift Card Purchases

Purchased gift cards are not exported as sales lines. Instead they are added as a negative payment line, so the sale nets to zero. By default this line uses the net paid amount.

For Front Systems stores configured with named payment types, the export can instead send the full gift card amount with any discount balanced by a separate bonus points line:

| Connector Property | Description |
| --- | --- |
| `UseGiftCardFullAmountPaymentLines` | Set to `true` to export the full gift card amount (from the order line's `GiftCardAmount` property) on the gift card payment line, using the named payment type `GiftCard`. A discount on the gift card (e.g. paid with bonus points) is added as a separate `BonusPoints` payment line so the sale still nets to zero. Front Systems then creates the gift card with its full balance instead of the net paid amount. |
| `BonusPointsPaymentTypeName` | Overrides the named payment type used on the balancing discount line. Defaults to `BonusPoints`. |

**Example** — a 1500 gift card where 570 was paid with bonus points:

```
"PaymentLines": [
  { "ExtRef": "520310", "PaymentType": 117, "Amount": 930.0 },
  { "ExtRef": "<gift card token>", "PaymentType": "GiftCard", "Amount": -1500.0 },
  { "ExtRef": "520310", "PaymentType": "BonusPoints", "Amount": 570.0 }
]
```

### In-store Purchases

*   POS orders (in-store purchases) are continuously retrieved by Omnium from Front via Scheduled Task **FrontSystemsOrderScheduledTask** in Omnium.
*   Supports both regular sales and return transactions from POS.

### Sales Order Mapping

FrontSystems sales transactions are mapped to Omnium orders based on quantity values and transaction types.

#### Sale vs Return Detection

*   **Regular Sales**: Items with `quantity > 0`
*   **Returns**: Items with `quantity < 0` (includes return reasons)

#### Order Structure Mapping

**Sales Items** → `Order.OrderForm.LineItems`

*   Items with positive quantities
*   Standard order processing

**Return Items** → `Order.ReturnOrderForms[0].LineItems`

*   Items with negative quantities
*   Creates ReturnOrderForm when returns present

**Transaction Types:**

*   **Sales Only**: Items in OrderForm.LineItems, no ReturnOrderForms
*   **Returns Only**: Empty OrderForm.LineItems, items in ReturnOrderForms
*   **Mixed**: Items in both OrderForm.LineItems and ReturnOrderForms

#### Product Fields

| FrontSystems Field | OrderLine Property | Example |
| --- | --- | --- |
| `brand` | `Brand` | "Umara" |
| `season` | `Season` | "AW25" |
| `colour` | `Color` | "Mango" |
| `sizeText` | `Size` | "ONESIZE" |
| `reasons[0].name` | `ReturnReason` | "Ej som förväntat/Ikke som forventet" |

#### Additional Properties (on OrderLine)

| FrontSystems Field | Property Key | Example |
| --- | --- | --- |
| `number` | "Number" | "umara.26238.no" |
| `group` | "Group" | "1194425" |
| `variant` | "Variant" | "umara.26238.no" |
| `externalSKU` | "ExternalSKU" | "7350080892556" |
| `reasons[0].code` | "ReturnReasonCode" | "3" |
| `reasons[0].type` | "ReturnReasonType" | "Return" |

#### POS Properties (on OrderForm / ReturnOrderForm)

These properties are added to `OrderForm.Properties` and `ReturnOrderForm.Properties` when the value is provided (non-zero):

| FrontSystems Field | Property Key | Description |
| --- | --- | --- |
| `store.posId` | "FrontSystemsPosId" | The POS terminal ID where the sale was made |
| `store.salesPersonId` | "FrontSystemsSalesPersonId" | The salesperson ID who processed the sale |

#### Payment Processing

| FrontSystems Payment | Omnium Mapping |
| --- | --- |
| `amount > 0` | `TransactionType: "Sale", Amount: [positive]` |
| `amount < 0` | `TransactionType: "Credit", Amount: [absolute]` |

**Example:**

```
// FrontSystems: { "type": "Card", "amount": -30 }
// Omnium: { "TransactionType": "Credit", "Amount": 30, "PaymentMethodName": "Card" }
```

#### Market Assignment

The order's market defaults to the resolved store's first `AvailableOnMarkets` entry (falling back to the tenant default). Set the connector property **`StandardMarketId`** to force all imported Front Systems sales onto a specific market instead.

### Workflow Configuration

*   Use **Export Order** workflow step with property `Connector/FrontSystems`.
*   If the order has a **Completed** status, it will be exported as a **Sale** (not as an **Omnichannel Order**).
*   For returns, add **Export Order** workflow step to statuses **Partially Returned** and **Returned**.
    *   This exports the return to Front Systems for sales posting and inventory adjustments.

### Store-Level Order Settings

The following properties can be configured per store to customize order export behavior:

| Store Property | Description |
| --- | --- |
| `ExcludeFrontShippingCost` | Set to `true` to exclude shipping costs from the Front Systems export. When enabled, shipping cost lines are not included in the web sale, and payment lines are adjusted accordingly. Applies to both regular orders and returns. |
| `FreightSku` | Override the connector-level `FreightSku` for this specific store. When set, shipping cost lines exported to Front Systems will use this SKU instead of the global one. If not set, falls back to the connector-level `FreightSku`. Applies to both regular orders and returns. |

* * *

## Promotions

*   Omnium is the master system for promotions.
*   If activated in Front, all POS lookups are directed to Omnium, which calculates the correct prices.
    *   Basically what happens is that every time an item is scanned in POS, it is treated as a cart in Omnium and recalculated and returned to Front Systems with the correct prices and discounts
*   Supports all Omnium promotion types, such as:
    *   "3 for 2" campaigns
    *   Loyalty club pricing
    *   Percentage discounts
*   Ensures seamless promotion handling in Front POS.

* * *

## Products

### Front as Master

*   Omnium syncs product base data from Front.
*   Product enrichment can be performed in Omnium or in a third-party system.

### Omnium as Master

*   Omnium continuously updates product data in Front Systems.
*   Minimum required properties: **ProductId**, **SkuId**, **EAN/GTIN**, **Name**.
*   You can exclude certain products from syncing to Front by adding a custom property with key: `IsExcludedFromFront` and value: `true`.
*   By default, products are exported with variants created as _Product Sizes_ in Front Systems.
*   If the connector property `IsVariantSplitToSingleProduct` is set to `true`, each variant will be created as a separate product in Front Systems. This allows:
    *   Different prices per variant
    *   Simpler and more reliable product syncing if products are frequently split or merged (e.g., merging multiple products into a single product with multiple variants)
*   Note: Enabling this setting('IsVariantSplitToSingleProduct') may result in a less optimal in-store experience, since different sizes of the same product will appear as separate items in the POS.
*   When a variant has no **Size** value, the size label defaults to `Stk`. To override this default, set the connector property **`StandardSizeLabel`** to the desired value (e.g., `OneSize`, `EA`, `PCS`).

**Field Mapping (Omnium → Front Systems)**
The following table shows how Omnium product/variant data is mapped when exported to Front Systems:

| Front Systems Field | Omnium Source |
| --- | --- |
| **Description** | Description (max 2000 chars - limit in Front Systems.) |
| **ExtId** | SkuId, or configurable via connector property `ExtIdExternalIdProvider` (see below) |
| **Name** | Name |
| **Color** | Color |
| **Gender** | Gender |
| **Variant** _(Color Code)_ | SupplierSkuId, or configurable via connector property `VariantPropertyName`. This can point to a custom property key on the product. (fallback: ProductId) |
| **Number** | SkuId, or configurable via connector property `NumberPropertyName`. This can point to a custom property key on the product, or a built-in product field such as `ParentId`. |
| **Price** | Lowest available price on the variant/product |
| **Season** | Season (fallback: connector option `DefaultSeason`, fallback: `All`) |
| **IsDiscontinued** | Inverse of IsActive |
| **Upt** | Modified (last modified timestamp) |
| **SubgroupName** | Outermost product category under `GroupNameCategoryRoot` (fallback: connector option `DefaultGroupName`, fallback: `Assortert`) |
| **GroupName** | First child category under `GroupNameCategoryRoot` (fallback: `Assortert`) |
| **IsWebAvailable** | Always `true` |
| **IsStockProduct** | Always `true` |
| **Images** | Assets URLs (fallback: MainImageUrl) |
| **Cost** | Cost |
| **Brand** | Brand (fallback: connector option `DefaultBrand`, fallback: `Annet`) |
| **Tags** | SupplierName (if `IsSupplierNameAddedAsTag = true`), tax rate tags (if `AddTaxRatesAsTags = true`), external ID values (if `ExternalIdTagProviders` is set) |

> **Note:** The "Variant" field in Omnium maps to what Front Systems calls "Color Code" in their UI.

### Product Group / Category Mapping

Front Systems uses two fields for product categorization: **GroupName** and **SubgroupName**. Omnium maps these from the product's category hierarchy based on a configured root category.

#### Configuration

Set the connector property **`GroupNameCategoryRoot`** to the category ID that should serve as the root of the hierarchy. This is the starting point for determining both GroupName and SubgroupName.

#### How the Mapping Works

Given a product's category hierarchy and the configured root category, Omnium determines:

*   **GroupName**: The **first direct child** of the root category (first level below root)
*   **SubgroupName**: The **deepest/outermost category** in the hierarchy (leaf category)

#### Example

Consider this category structure in Omnium:

```
Clothing (CategoryId: "root-123")
├── Tops (CategoryId: "tops-1", ParentId: "root-123")
│   └── T-Shirts (CategoryId: "tshirts-1", ParentId: "tops-1")
│       └── Short Sleeve (CategoryId: "short-1", ParentId: "tshirts-1")
└── Bottoms (CategoryId: "bottoms-1", ParentId: "root-123")
    └── Jeans (CategoryId: "jeans-1", ParentId: "bottoms-1")
```

If `GroupNameCategoryRoot = "root-123"` and a product belongs to the "Short Sleeve" category:

| Front Systems Field | Value | Explanation |
| --- | --- | --- |
| **GroupName** | `Tops` | First child directly under root |
| **SubgroupName** | `Short Sleeve` | Deepest category in hierarchy |

For a product in "Jeans":

| Front Systems Field | Value | Explanation |
| --- | --- | --- |
| **GroupName** | `Bottoms` | First child directly under root |
| **SubgroupName** | `Jeans` | Deepest category in hierarchy |

#### Fallback Behavior

If no matching category is found in the hierarchy:

1.  **GroupName** falls back to `Assortert`
2.  **SubgroupName** falls back to connector property `DefaultGroupName`, then to `Assortert`

#### Connector Properties

| Property | Description |
| --- | --- |
| `GroupNameCategoryRoot` | Category ID used as the root for hierarchy traversal |
| `DefaultGroupName` | Fallback value when no category mapping is found |

### Tax Rate Tags

When the connector property **`AddTaxRatesAsTags`** is set to `true`, Omnium automatically adds tax rate information as tags on products exported to Front Systems.

For each market configured in Omnium, the system looks up valid prices for the product and adds a tag in the format `tax_{countryCode}_{taxRate}` — for example `tax_NO_25` or `tax_SE_12`. Only one tag is added per unique country code (based on the market's two-letter country code), using the tax rate from the lowest valid price for that market. Prices with a tax rate of zero are excluded.

These tags are appended to any existing tags (such as SupplierName) as a comma-separated string.

### Custom ExtId Mapping

By default, the **ExtId** sent to Front Systems is the product's `SkuId` (or `ProductId` as fallback). If you need to use a different identifier, you can configure the connector property **`ExtIdExternalIdProvider`**.

When set, Omnium will look up the product's `ExternalIds` collection for an entry matching the specified provider name, and use its value as the `ExtId`.

#### Configuration

Set the connector property:

*   **Key**: `ExtIdExternalIdProvider`
*   **Value**: The ExternalId provider name to use (e.g. `FrontSystemExternalId`)

#### Example

If `ExtIdExternalIdProvider` is set to `FrontSystemExternalId`, and a product has the following ExternalId:

```
ProviderName: "FrontSystemExternalId"
Id: "ABC-123"
```

Then `ABC-123` will be used as the `ExtId` when exporting to Front Systems.

#### Important

Products that do **not** have a matching ExternalId will be **excluded from export**. There is no fallback to SkuId when this setting is configured. This ensures only products with an explicitly mapped identifier are sent to Front Systems.

### External ID Tags

You can add product external ID values as tags on exported Front Systems products by setting the connector property **`ExternalIdTagProviders`** to a comma-separated list of ExternalId provider names.

For each product, Omnium checks the `ExternalIds` collection (preferring variant-level IDs, falling back to product-level) and adds the `Id` value of any entry whose `ProviderName` matches one of the configured providers.

#### Configuration

Set the connector property:

*   **Key**: `ExternalIdTagProviders`
*   **Value**: Comma-separated list of provider names (e.g. `PIM,ERP`)

#### Example

If `ExternalIdTagProviders` is set to `PIM,ERP` and a product has the following external IDs:

| ProviderName | Id |
| --- | --- |
| PIM | `pim-456` |
| ERP | `erp-789` |
| FrontProductId | `12345` |

Then `pim-456` and `erp-789` will be added as tags. The `FrontProductId` entry is excluded because it is not in the configured provider list.

These tags are appended to any existing tags (such as SupplierName or tax rate tags) as a comma-separated string.

* * *

## Prices and price lists

### Front as Master

*   Product prices are synced from Front to Omnium as part of the product synchronization process.

### Omnium as Master

Omnium can export product prices as price lists to Front Systems using the scheduled task 'FrontPriceListScheduledTask'. The export builds or updates a Front price list per configured market or market group, using GTIN as the unique key for each price entry and skipping unchanged prices to minimize writes.

### Naming

Price list name format depends on whether you're exporting by market or market group:

*   **By Market**: `{PriceListPrefix} {Market.Currency} RRP {Market.MarketName}`
*   **By Market Group**: `{PriceListPrefix} {Currency} RRP {MarketGroupId}`

If `PriceListPrefix` is empty, only currency, "RRP", and the market name or group ID are used. PriceListPrefix can be defined as a property on the connector level.

### Market Scope

Price list exports can be configured at two levels:

*   **By Market ID**: Controlled by connector property `EnabledPriceListMarketIds` (comma-separated list of market IDs).
*   **By Market Group ID**: Controlled by connector property `EnabledPriceListMarketGroupIds` (comma-separated list of market group IDs).

Both can be configured simultaneously - the task will export price lists for all configured markets and market groups.

For market-based exports, Omnium loads market data and uses the market's `ProductContentLanguage` to select products for pricing. For market group exports, Omnium uses the first market in the group to determine currency and product content language.

### Data Source and Mapping

*   Each price entry is keyed by `Gtin`; duplicates are removed per export run.
*   Only one price per GTIN is posted.

### Create/Update Behavior

*   If a price list with the computed name exists in Front, Omnium fetches its current prices.
*   For each GTIN:
    *   If the new price equals the existing price, it is skipped (counted as “unchanged”).
    *   If different or not present, it is included in the update batch.

### Deletions

*   Existing prices in the Front price list that are not present in the current Omnium export set are considered for deletion.
*   Deletions are controlled by connector setting `IsFrontPriceDeletionEnabled`.

### Scheduling

*   Implemented as a scheduled task: `FrontPriceListScheduledTask`.

### Connector Settings

*   `EnabledPriceListMarketIds`: Comma-separated list of market IDs to export.
*   `EnabledPriceListMarketGroupIds`: Comma-separated list of market group IDs to export.
*   `PriceListPrefix`: Optional text prefix added to the generated price list name.
*   `IsFrontPriceDeletionEnabled`: Boolean flag that enables deletion of prices no longer present in Omnium's export set.
*   `IsPriceListMarketFiltered`: Boolean flag that filters products by market during export. When enabled, only products belonging to the specified market are included in the export.
*   `IsPriceListMarketGroupFiltered`: Boolean flag that filters products by market group during export. When enabled, only products belonging to the specified market group are included in the export.
*   `IsCreditShipmentDisabled`: Boolean flag that disables credit payment of shipping cost when orders are returned in store.

**Note:** At least one of `EnabledPriceListMarketIds` or `EnabledPriceListMarketGroupIds` must be configured for the price list export to run.

### Notes

*   GTIN is the unique identifier for price entries.
*   The export uses per-market language filtering to ensure correct product-price selection.
*   When exporting by market, prices are matched by `MarketId` on the price. When exporting by market group, prices are matched by `MarketGroupId` on the price.
*   Posting is idempotent for unchanged prices; unchanged items are skipped to reduce load.

* * *

## Inventory

### Overview

Omnium synchronizes store inventory from Front Systems using the scheduled tasks FrontSystemsInventoryScheduledTask and FrontSystemsInventoryFullImportScheduledTask. Front Systems is the master system for store stock, and Omnium updates its records continuously to ensure that online and in-store stock levels remain aligned.

### Scope

*   All configured stores in Omnium are included in the synchronization.
*   (Edge case) If multiple Front Systems companies are connected, each group of stores uses the correct credentials (based on the `FrontSystemsCompany` property).

### Behavior

*   Inventory items are retrieved from Front Systems and updated in Omnium at regular intervals.
*   Only items with valid warehouse codes are processed.
    *   Remember: The **StockId** in Front Systems must match ExternalId **FrontSystemStockId** on the warehouses (stores) in Omnium. If a store needs to pull inventory from multiple stock IDs, use **FrontSystemInventoryStockId** external IDs instead (one per stock ID).
*   If an item has been removed or is no longer present in Front:
    *   It may be deleted from Omnium, or
    *   Its inventory count may be set to **0**, depending on configuration.
*   Gift card SKUs are ignored
*   By default, Omnium should fetch stock items and match by GTIN. Please ensure that property **IsStockFetchedByGtin** is set to 'true' in the connector properties
    *   If not, all products in Omnium must have a corresponding FrontSystemsId configured in their external Id. NOTE! This will be depracted
    *   If your products do _not_ have the same value for SkuId and EAN/GTIN, please make sure that you property **IsSkuIdLookup** is set to true. Omnium will then map the inventory to the right sku based on the gtins returned by Front.

### Available Quantity vs Reservations

The inventory value Omnium receives from Front Systems is a **single net "available" quantity per SKU per stock**. Front Systems computes this value internally by subtracting any in-store reservations from physical stock _before_ sending it to Omnium.

As a result:

*   Omnium **does not** receive separate values for physical stock and reservations from Front Systems.
*   Reservations placed in Front Systems (for example, items set aside for a customer in-store) are **not visible as reservations in Omnium** — they are already reflected in the lower available quantity that Omnium stores.
*   When the available quantity in Omnium differs from the physical stock count visible in Front Systems' own UI, the difference is normally the reservations that Front Systems has already deducted.

This applies to both `FrontSystemsInventoryScheduledTask` and `FrontSystemsInventoryFullImportScheduledTask`.

### Deletions

*   Deletions are controlled by connector settings:
    *   If **removed items should be updated**, the stock level is set to `0`.
    *   If not, the items are fully deleted from Omnium.
*   Reserved inventory is always preserved (items with reserved quantities are not deleted without first being adjusted).

### Notes

*   Inventory synchronization runs as a scheduled task: **FrontSystemsInventoryScheduledTask** which fetches changes since last run. **FrontSystemsInventoryFullImportScheduledTask** fetches all inventory from Front, and should be run once per day to pickup inventory items in Front that has changed but not neccessary been marked as modified in Front Systems.

### Outbound Inventory Updates (Omnium → Front Systems)

Omnium can also push inventory updates back to Front Systems when stock levels change in Omnium. Because Front Systems is usually the master for store stock, outbound updates are restricted by default to avoid overwriting trusted Front data.

*   **Stores listed in `AllowAllInventoryUpdatesForStoreIds`** — receive inventory updates from any source in Omnium. Updates triggered by the Front inventory scheduled tasks are still skipped to avoid sending Front's own data back to Front.
*   **Stores not in the list** — only receive inventory updates that come from manual inventory changes (from the Omnium UI or the public inventory API). Updates from order flows, imports, or other integrations are ignored.

#### Connector Settings

| Property | Description |
| --- | --- |
| `AllowAllInventoryUpdatesForStoreIds` | Comma-separated list of store IDs that should receive inventory updates from any source in Omnium. Stores not in the list only receive updates from manual inventory changes. Typically only one or two stores are configured here. |
| `FrontInventoryExportStoreIds` | Optional comma-separated list of store IDs to limit which stores outbound inventory updates are posted to. When set, only these stores receive updates. |

* * *

## Gift Cards

If you are going to use gift cards that will work in both Front Systems and for online purchases using Omnium, please [follow the guidelines](../../Product/giftcards.md) on how to setup gift cards in Omnium. After that is done, please do the following:

*   Change the 'ProviderName' for the gift card payment method to "FrontSystems".
*   For the 'VirtualShip' status, please add an "ExportOrder" workflow step, to register the sale in Front Systems:

```json
    {
      "name": "ExportOrder",
      "active": true,
      "connector": "frontsystems"
    }
```

*   Modifiy the Front Systems connector setting and add 'IGiftCardProvider':

```
      "implementations": [
                "IGiftCardProvider",
```

Please note that are some restrictions:

*   It is not possible to use the "Import" feature for gift cards in Omnium.
*   The gift card search in Omnium's UI is very restricted as gift cards are not stored in Omnium. You are only able to search for exact gift card codes.

* * *

## Purchase Orders

*   Omnium sends purchase orders directly from Omnium to Front.

* * *

## Multi-company Setup

Omnium supports integration with multiple Front Systems companies, even when they do not share the same Front instance.

*   Enable by setting `EnableMultiCompany` to `true` in the Front Systems connector properties.
*   For Front Systems company-specific users, add properties where the **key** is the company name and the **value** is that company’s API key. Example: key `SomeCompany` with value `this_is_an_api_key`.
*   For each store in Omnium, add a property to link it to the correct Front Systems company:
    *   Store property key `FrontSystemsCompany`
    *   Store property value equal to the company key you added above (for example `SomeCompany`)

This ensures each store is associated with the correct Front Systems company and API key.
