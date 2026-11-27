# OmniStock

Source: https://docs.omnium.no/docs/Inventory/omnistock

> Aggregate inventory across multiple warehouses and stores to determine online product availability.

## What is OmniStock?

OmniStock is Omnium's inventory aggregation engine that determines which products should be shown as available for online purchase. It combines inventory from multiple physical warehouses and stores into a unified view of online availability per sales channel.

At its core, OmniStock answers: **"Can this product be ordered online, and which warehouses can fulfill it?"**

For each product, OmniStock evaluates:

*   Which warehouses have stock for the product
*   Whether the product is in the warehouse's assortment
*   Whether the warehouse is allowed to ship the product (based on business rules)
*   The aggregate stock level across all eligible warehouses

The result is stored on the product as two fields:

*   **`OmniStock`** — a list of store IDs where the product is available for online purchase
*   **`OmniStockLevels`** — a stock level indicator (High/Low/Out of Stock) per store, plus the exact quantity available online when the store has [exact quantities](omnistock.md#exact-omnistock-quantities) turned on

* * *

## Key Concepts

### Store Roles

OmniStock uses two store roles to define the relationship between online sales channels and fulfillment locations:

| Role | Purpose |
| --- | --- |
| **OmniStock** | An online store (sales channel) that aggregates inventory from multiple warehouses. This is typically a webshop — not a physical location. |
| **ShipFromStore** | A warehouse or physical store that can fulfill online orders. Must have `IsWarehouse = true`. |

An **OmniStock store** defines _where_ products are sold online. A **ShipFromStore** defines _where_ products are shipped from.

OmniStock recognises the role ids `OmniStock` and `ShipFromStore` spelled exactly like that. Store roles are defined in tenant settings (see [Store roles](../Stores/store-config.md#store-roles)), so make sure the roles you assign for OmniStock use these ids. A role with another id, such as `ship-from-store`, is not picked up.

### Warehouse Linking

Each OmniStock store has an `AvailableWarehouses` list that links it to one or more ShipFromStore locations. Each linked warehouse has a priority value used during order allocation to determine fulfillment preference.

```
┌─────────────────────────────────┐
│  OmniStock Store ("Webshop-NO") │
│  Role: OmniStock                │
│  AvailableWarehouses:           │
│    ├─ CentralWarehouse (pri: 1) │
│    ├─ Store-Oslo (pri: 2)       │
│    └─ Store-Bergen (pri: 3)     │
└─────────────────────────────────┘
         │          │          │
         ▼          ▼          ▼
   ┌──────────┐ ┌─────────┐ ┌──────────┐
   │ Central  │ │  Oslo   │ │  Bergen  │
   │Warehouse │ │  Store  │ │  Store   │
   │ Role:    │ │ Role:   │ │ Role:    │
   │ ShipFrom │ │ ShipFrom│ │ ShipFrom │
   │ Store    │ │ Store   │ │ Store    │
   └──────────┘ └─────────┘ └──────────┘
```

A product is considered available on the OmniStock store if **at least one** of the linked warehouses has stock and passes all business rules.

### Stock Levels

OmniStock calculates a quantity and a stock level per store per SKU (variant). The quantity is the aggregate available inventory across the eligible warehouses, less the store's [OmniStock buffer](omnistock.md#omnistock-buffer). The levels are determined by comparing the quantity against a configurable threshold:

| Stock Level | Condition |
| --- | --- |
| **HighInStock** | Quantity > threshold |
| **LowInStock** | Quantity > 0 but ≤ threshold |
| **OutOfStock** | Quantity = 0 |

The threshold is configured tenant-wide via the `OmniStockLowInStockThreshold` setting (default: 10 units). Available inventory is the sum across all eligible warehouses for that store.

### OmniStock buffer

You can hold back a few units of each SKU on an OmniStock store, so that the last units in the physical stores, the stock most likely to be miscounted, are not sold online. Set `omniStockBuffer` in the OmniStock store's rules. The buffer comes off the summed stock of the warehouses linked to that store.

Set `isExcludedFromOmniStockBuffer` on a warehouse whose stock must always count in full, typically the central warehouse. Its stock is added to the quantity untouched, and the buffer is only taken from the other warehouses. The buffer never holds back more than those warehouses have, so the excluded warehouse can be sold out. The flag is set on its own: marking a store as a central warehouse for allocation does not exclude it from the buffer.

Examples for an OmniStock store with a buffer of 3, a central warehouse excluded from the buffer and two stores:

| Central warehouse | Store A | Store B | Quantity | Stock level |
| --- | --- | --- | --- | --- |
| 5 | 2 | 1 | 5 | LowInStock |
| 0 | 4 | 2 | 3 | LowInStock |
| 0 | 2 | 1 | 0 | OutOfStock |
| 12 | 4 | 2 | 15 | HighInStock |

Without a buffer, the quantity is the sum of the available inventory.

The OmniStock buffer is different from the [stock buffer](stock-buffer.md). The stock buffer is set per store, with a product and a tenant-wide fallback, and holds back units in each warehouse during cart validation and allocation. The OmniStock buffer is set on the OmniStock store and holds back units from that sales channel's total. The OmniStock calculation does not apply the stock buffer.

### Exact OmniStock quantities

By default, products carry only the stock level per OmniStock store. If you need the exact number, for example to sync it to another system as stock, turn on `isOmniStockQuantityEnabled` in the OmniStock store's rules. Each of that store's stock levels then also carries a `quantity`: the available inventory of the eligible warehouses less the store's OmniStock buffer.

Turning the setting on or off starts a [full recalculation](omnistock.md#delta-vs-full-recalculation), which fills in or clears the quantities on every active product. The buffer applies to the stock level whether or not exact quantities are on.

A stock level changes only now and then, but the quantity changes with almost every stock change. With exact quantities on, OmniStock updates the products far more often, which adds load, especially in peak season. Turn it on only for the OmniStock stores whose quantities you actually use. The first full recalculation after turning it on updates every active product that has stock levels for the store.

* * *

## How OmniStock Works

OmniStock runs as a **scheduled background task** that periodically evaluates all products and updates their online availability. The process follows these steps:

### 1\. Identify Eligible Stores and Warehouses

The system loads all stores with the **OmniStock** role that have at least one linked warehouse, and builds a lookup map:

```json
{
  "Webshop-NO": ["CentralWarehouse", "Store-Oslo", "Store-Bergen"],
  "Webshop-SE": ["CentralWarehouse", "Store-Stockholm"]
}
```

### 2\. Evaluate Each Product

For each active product, the system evaluates every OmniStock store by checking its linked warehouses against a series of conditions:

1.  **Warehouse has ShipFromStore role** — only warehouses with this role can fulfill orders
2.  **Product is in warehouse assortment** — checked via the product's `StoreIds` list or category-based assortment rules on the warehouse
3.  **OmniStock rules are satisfied** — business rules configured on the warehouse (see [OmniStock Rules](omnistock.md#omnistock-rules))
4.  **Inventory exists** — at least one linked warehouse must have stock for the product (or one of its variants)

### 3\. Update Product Availability

The product's `OmniStock` field is set to the list of OmniStock store IDs where the product passed all checks. The `OmniStockLevels` field is populated with per-store stock level indicators for each variant, and with the quantity for stores that have exact quantities turned on.

### Delta vs Full Recalculation

The scheduled task uses two processing modes:

| Mode | Trigger | Scope |
| --- | --- | --- |
| **Delta** | Default on every run | Only processes products modified since the last run and products affected by recent inventory changes |
| **Full recalculation** | Store configuration changes detected | Re-evaluates every active product from scratch |

**Store change detection**: The system takes a snapshot of relevant store properties (roles, markets, linked warehouses, and OmniStock rules) and caches it. If the snapshot differs from the cached version on the next run, a full recalculation is triggered. This ensures that changes like adding a new warehouse or modifying exclusion rules are reflected across all products.

* * *

## OmniStock Rules

OmniStock rules are business rules configured per warehouse (ShipFromStore) that control which products are eligible for online fulfillment from that location. Rules are optional — if no rules are configured on a warehouse, all products in its assortment with available inventory will be eligible.

Rules are configured on the store's `OmniStockRules` property.

### Rule Properties

| Property | Type | Description |
| --- | --- | --- |
| ExcludedBrands | List<string> | Products with these brands will not be available from this warehouse |
| ExcludedSeasons | List<string> | Products with these seasons will not be available from this warehouse |
| ExcludedPromotionIds | List<string> | Products on these promotions will not be available. Only currently active promotions are checked — future or expired promotions are ignored. |
| IncludedCategoryIds | List<string> | Only products in these categories will be available. If both included and excluded categories are set, the included list is applied first, then exclusions are removed. |
| ExcludedCategoryIds | List<string> | Products in these categories will not be available |
| ExcludedProductIds | List<string> | Specific products that will never be available from this warehouse. Matched against the product id of the main product, so the whole product with all its variants is excluded. |
| ProfitabilityThreshold | decimal? | Minimum profit margin (unit price minus cost) required for the product to be available. Requires `CurrencyCode` to be set. The check is skipped when the warehouse has no market in that currency, when the product has no valid price for that market, or when neither the price nor the product carries a cost. |
| CurrencyCode | string? | Currency used for profitability calculation. The system picks the first of the warehouse's `AvailableOnMarkets` whose currency matches and evaluates the product's best valid price for that market. |
| OmniStockBuffer | decimal? | Set on an OmniStock store. Units held back from the store's OmniStock quantity, taken from the warehouses that are not excluded from the buffer. Empty or `0` means no buffer. See [OmniStock buffer](omnistock.md#omnistock-buffer). |
| IsOmniStockQuantityEnabled | bool? | Set on an OmniStock store. Products carry the store's exact quantity next to the stock level. Off by default. See [Exact OmniStock quantities](omnistock.md#exact-omnistock-quantities). |
| IsExcludedFromOmniStockBuffer | bool? | Set on a warehouse. Its stock always counts in full, and an OmniStock store's buffer is never taken from it, so it can be sold out online. |

### Rule Evaluation Order

Rules are evaluated in the following order. If any rule fails, the product is excluded from that warehouse:

1.  **Brand exclusion** — Is the product's brand in the excluded list?
2.  **Season exclusion** — Is the product's season in the excluded list?
3.  **Promotion exclusion** — Is the product on an excluded active promotion?
4.  **Category inclusion/exclusion** — Does the product satisfy category rules?
5.  **Product exclusion** — Is the product explicitly excluded?
6.  **Profitability threshold** — Does the product meet the minimum margin?

### Configuring rules in the Omnium UI

Open the warehouse under **Stores**, then select the **Online assortment rules** tab. The tab requires administer access to stores. It edits the store's `omniStockRules` and saves them together with the rest of the store when you click **Save store**.

| Field in the tab | Rule property | Options offered |
| --- | --- | --- |
| Profitability threshold | `ProfitabilityThreshold` | Free number. Leave empty for no threshold. |
| Currency | `CurrencyCode` | The currencies of the markets you have access to. |
| Excluded promotions | `ExcludedPromotionIds` | Promotions that have not ended yet. Only promotions that are active at calculation time exclude products. |
| Included categories | `IncludedCategoryIds` | The product category tree. Dynamic categories cannot be selected. |
| Excluded categories | `ExcludedCategoryIds` | The product category tree. Dynamic categories cannot be selected. |
| Excluded brands | `ExcludedBrands` | Brand values that exist on products in the catalogue. |
| Excluded seasons | `ExcludedSeasons` | Season values that exist on products in the catalogue. |
| Excluded products | `ExcludedProductIds` | Product search, or a product list of type _SKU only_ or _Product id only_. |
| OmniStock buffer | `OmniStockBuffer` | Free number. Leave empty for no buffer. Shown only on a store with the OmniStock role. |
| Calculate exact OmniStock quantity | `IsOmniStockQuantityEnabled` | Switch. Shown only on a store with the OmniStock role. |
| Excluded from the OmniStock buffer | `IsExcludedFromOmniStockBuffer` | Switch. Shown only on a warehouse (**Is warehouse** checked), and takes effect when the warehouse is linked to an OmniStock store. |

The header of each section shows the number of selected values. Rules that are left empty are ignored.

The **Online assortment rules** tab is different from the **Assortment → Categories** tab on the same store. Assortment categories decide which products belong to the store and update the products' `StoreIds` (see [Store Categories](../Product/product-assortment/store-categories.md)). Online assortment rules never change product data; they only decide which of the products in the assortment are exposed online and eligible for ship-from-store fulfillment.

**Excluded products** is evaluated per product, not per variant. Selecting a single variant stores the variant's SKU id, which only matches products that are themselves SKU-level products. To exclude a product with variants, select the main product.

Saving new rules changes the store snapshot described in [Delta vs Full Recalculation](omnistock.md#delta-vs-full-recalculation), so the next scheduled run re-evaluates every active product.

### Example: Store API Configuration

When creating or updating a store via the API, OmniStock rules are set on the `omniStockRules` property:

```json
{
  "id": "Store-Oslo",
  "name": "Oslo Store",
  "isWarehouse": true,
  "storeRoleIds": ["ShipFromStore"],
  "availableOnMarkets": ["NO"],
  "omniStockRules": {
    "excludedBrands": ["BrandX", "BrandY"],
    "excludedSeasons": ["SS2023"],
    "excludedPromotionIds": ["promo-clearance-2024"],
    "includedCategoryIds": ["clothing", "accessories"],
    "excludedCategoryIds": ["clothing-outlet"],
    "excludedProductIds": ["PROD-123", "PROD-456"],
    "profitabilityThreshold": 50.00,
    "currencyCode": "NOK"
  }
}
```

In this example, Store-Oslo will only ship products that:

*   Are not from BrandX or BrandY
*   Are not from the SS2023 season
*   Are not on the clearance promotion
*   Belong to clothing or accessories categories (but not clothing-outlet)
*   Are not PROD-123 or PROD-456
*   Have at least 50 NOK margin

On store PUT and PATCH, a missing or `null` `omniStockRules` leaves the existing rules unchanged. A value replaces the whole rule set. Send an empty object (`"omniStockRules": {}`) to remove all rules.

The buffer is set on the OmniStock store, and the exclusion on the warehouse. Send them with `PATCH /api/Stores/PatchStore`, which leaves the fields you do not send unchanged (see [Store API](../Stores/store-api.md)). Because a value replaces the whole rule set, include each store's other rules when you set these:

```json
{
  "id": "Webshop-NO",
  "omniStockRules": {
    "omniStockBuffer": 3
  }
}
```

```json
{
  "id": "CentralWarehouse",
  "omniStockRules": {
    "isExcludedFromOmniStockBuffer": true
  }
}
```

* * *

## Where OmniStock Is Used

### Product search

The `SearchProducts` endpoint and the product query endpoints accept `isAvailableOnline`. The store is taken from `storeId` on the search request, or from the first entry of `storeIds` on a query request:

| Value | Result |
| --- | --- |
| `true` | Only products whose `omniStock` list (or one of their variants' lists) contains the store. Without a store, products available on any OmniStock store. |
| `false` | Only products that are not available online for that store (or on any store when no store is given). |
| `null` | No filtering (default). |

```
POST /api/Products/SearchProducts
Content-Type: application/json

{
  "storeId": "Webshop-NO",
  "isAvailableOnline": true,
  "take": 50,
  "page": 1
}
```

### Ship-from-store allocation

When an order is placed on a store with the **OmniStock** role and the shipment is a delivery, the same warehouse assortment and OmniStock rules gate reallocation of order lines to a ship-from-store warehouse. A line is only moved to a warehouse whose rules the product passes; inventory is checked separately by the allocation itself. Products that are not found in the catalogue are not restricted.

### Cart validation

The [Inventory Validator](../Carts/validation/cart-validators/inventory-validator.md) can validate carts against the same warehouses and buffer as OmniStock, on live stock. Set the validator's `UseOmniStock` property to `true`. A delivered line on an OmniStock store then counts only the warehouses OmniStock sells the product from, and the store's OmniStock buffer is held back. See [Validate against OmniStock](../Carts/validation/cart-validators/inventory-validator.md#validate-against-omnistock).

* * *

## Configuration

### Tenant Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| InventoryManagement.OmniStockLowInStockThreshold | decimal | 10 | The inventory threshold for determining stock levels. Products with an OmniStock quantity above this value are `HighInStock`; at or below are `LowInStock`. |

### Store Configuration

For OmniStock to work, stores must be configured with the correct roles and relationships:

#### OmniStock Store (Online Sales Channel)

| Property | Required Value | Description |
| --- | --- | --- |
| StoreRoleIds | Must include `"OmniStock"` | Marks this store as an online sales channel |
| AvailableWarehouses | At least one entry | Links to warehouses that can fulfill orders for this channel |
| AvailableOnMarkets | At least one market | Defines which markets this store serves |
| OmniStockRules.OmniStockBuffer | Optional | Units held back from this channel's OmniStock quantity. See [OmniStock buffer](omnistock.md#omnistock-buffer). |
| OmniStockRules.IsOmniStockQuantityEnabled | Optional | Keeps this channel's exact quantity on the products. See [Exact OmniStock quantities](omnistock.md#exact-omnistock-quantities). |

#### ShipFromStore (Fulfillment Location)

| Property | Required Value | Description |
| --- | --- | --- |
| StoreRoleIds | Must include `"ShipFromStore"` | Marks this store/warehouse as a fulfillment source |
| IsWarehouse | `true` | Identifies the store as a warehouse |
| AvailableOnMarkets | At least one market | Used for profitability threshold calculations |
| OmniStockRules | Optional | Business rules controlling product eligibility |
| OmniStockRules.IsExcludedFromOmniStockBuffer | Optional | Counts this warehouse's stock in full, outside the OmniStock buffer |

### Assortment Configuration

Products are matched to warehouses using assortment rules. Two approaches are supported:

1.  **Direct assignment**: The product's `StoreIds` list explicitly includes the warehouse ID
2.  **Category-based rules**: The warehouse's `AssortmentIncludeProductCategoryIds` and `AssortmentExcludeProductCategoryIds` control which product categories are in its assortment

If the product has a `StoreIds` list, only stores in that list are considered. Otherwise, the category-based rules on the warehouse are evaluated.

The category-based assortment is edited on the store's **Assortment → Categories** tab and is described in [Store Categories](../Product/product-assortment/store-categories.md). OmniStock rules on the **Online assortment rules** tab are applied on top of the assortment and never modify the products.

* * *

## Product Data Model

OmniStock writes the following fields on each product:

### Product.OmniStock

**Type**: `List<string>` (nullable)

A list of OmniStock store IDs where the product is available for online purchase. Set to `null` if the product is not available at any store.

### Product.OmniStockLevels

**Type**: `List<OmniStockLevel>`

Per-store stock level indicator, plus the quantity for stores with exact quantities turned on, set on each variant (or on the product itself if it has no variants). In the example below, both stores have exact quantities turned on.

| Field | Type | Description |
| --- | --- | --- |
| `StoreId` | string | The OmniStock store |
| `StockLevel` | string | `HighInStock`, `LowInStock` or `OutOfStock` |
| `Quantity` | decimal? | The quantity the store offers online: the available inventory of the eligible warehouses less the store's [OmniStock buffer](omnistock.md#omnistock-buffer). `0` when the product is out of stock. Only set when the store has [exact quantities](omnistock.md#exact-omnistock-quantities) turned on; otherwise left out. |

```json
{
  "omniStockLevels": [
    { "storeId": "Webshop-NO", "stockLevel": "HighInStock", "quantity": 24 },
    { "storeId": "Webshop-SE", "stockLevel": "LowInStock", "quantity": 3 }
  ]
}
```

Stock levels are set for **all** OmniStock stores, including those where the product is out of stock. This allows frontends to reliably check availability without needing to interpret a missing entry.

* * *

## Setup Guide

### Step 1: Configure Warehouses as ShipFromStore

For each warehouse or store that should fulfill online orders, ensure:

1.  Set `IsWarehouse` to `true`
2.  Add `"ShipFromStore"` to `StoreRoleIds`
3.  Set `AvailableOnMarkets` to the relevant markets
4.  Optionally configure `OmniStockRules` to control product eligibility

### Step 2: Create OmniStock Stores

For each online sales channel, create a store with:

1.  Add `"OmniStock"` to `StoreRoleIds`
2.  Set `AvailableWarehouses` linking to the ShipFromStore locations, with priority values
3.  Set `AvailableOnMarkets` to the markets this channel serves

### Step 3: Configure Threshold

Set the `OmniStockLowInStockThreshold` in tenant settings to control the boundary between High and Low stock level indicators.

### Step 4: Ensure Products Have Inventory

Products must have inventory records at the linked warehouses. Inventory is typically imported via the [Inventory API](inventory-api.md).

### Step 5: Verify

After the scheduled task runs, products should have `OmniStock` and `OmniStockLevels` populated. You can verify by querying products via the API and checking these fields.

* * *

## Integration Scenarios

### Scenario 1: Single Webshop with Multiple Warehouses

A retailer has one online store serving Norway, with a central warehouse and two stores that also fulfill online orders.

**Configuration:**

*   Create warehouse stores: `CentralWarehouse`, `Store-Oslo`, `Store-Bergen` — all with ShipFromStore role
*   Create OmniStock store: `Webshop-NO` with OmniStock role, linked to all three warehouses
*   Set warehouse priorities: Central=1, Oslo=2, Bergen=3

**Result:** Products with stock at any of the three locations appear as available on the webshop. Order allocation uses priority to prefer the central warehouse.

### Scenario 2: Multi-Market with Separate Channels

A retailer operates online stores in Norway and Sweden, each served by different warehouses.

**Configuration:**

*   `CentralWarehouse` (ShipFromStore, markets: NO, SE)
*   `Store-Stockholm` (ShipFromStore, market: SE)
*   `Webshop-NO` (OmniStock, linked to: CentralWarehouse)
*   `Webshop-SE` (OmniStock, linked to: CentralWarehouse, Store-Stockholm)

**Result:** Norwegian customers see availability based on central warehouse stock. Swedish customers see combined availability from both the central warehouse and Stockholm store.

### Scenario 3: Selective Ship-from-Store with Rules

A retailer wants physical stores to fulfill online orders, but only for certain product categories and only when profitable.

**Configuration:**

*   Physical stores have ShipFromStore role with OmniStockRules:
    *   `includedCategoryIds`: \["clothing", "accessories"\]
    *   `excludedBrands`: \["PremiumBrand"\] (only sold in-store)
    *   `profitabilityThreshold`: 100
    *   `currencyCode`: "NOK"

**Result:** Only clothing and accessories with at least 100 NOK margin (excluding PremiumBrand) will be available for ship-from-store fulfillment.

### Scenario 4: Sell Out the Central Warehouse, Keep a Buffer in the Stores

A retailer wants every unit in the central warehouse sold online, but does not want to sell the last few units in its physical stores, where counts are often wrong.

**Configuration:**

*   `Webshop-NO` (OmniStock, linked to: CentralWarehouse, Store-Oslo, Store-Bergen) with `omniStockRules.omniStockBuffer`: 3
*   `CentralWarehouse` (ShipFromStore) with `omniStockRules.isExcludedFromOmniStockBuffer`: true
*   Optionally, the [Inventory Validator](../Carts/validation/cart-validators/inventory-validator.md#validate-against-omnistock) with `UseOmniStock` set to `true`, so carts follow the same quantity
*   Optionally, `omniStockRules.isOmniStockQuantityEnabled`: true on `Webshop-NO`, if another system needs the exact quantity

**Result:** A product with 5 units in the central warehouse and 2 + 1 in the stores offers 5 online. With no central stock and 4 + 2 in the stores, it offers 3. With only 2 + 1 in the stores, it is out of stock online.

* * *

## Troubleshooting

### Product Not Showing as Available Online

1.  **Check store roles**: Verify the OmniStock store has `"OmniStock"` in `StoreRoleIds` and linked warehouses have `"ShipFromStore"`
2.  **Check warehouse linking**: Confirm the OmniStock store's `AvailableWarehouses` includes the correct warehouse codes
3.  **Check inventory**: Verify the product has inventory records at the linked warehouses with quantity > 0
4.  **Check assortment**: Confirm the product is in the warehouse's assortment (via `StoreIds` or category rules)
5.  **Check OmniStock rules**: Review the warehouse's `OmniStockRules` — the product may be excluded by brand, season, category, promotion, or profitability threshold
6.  **Wait for scheduled task**: OmniStock updates are processed by a background task. Changes may take a few minutes to reflect.

### Product Available at Wrong Stores

1.  Review the `AvailableWarehouses` configuration on each OmniStock store
2.  Check that warehouse `AvailableOnMarkets` matches the intended markets
3.  Verify assortment category rules are correctly configured on the warehouses

### Stock Level Incorrect

1.  Verify the `OmniStockLowInStockThreshold` tenant setting
2.  Check that inventory is correctly reported at all linked warehouses
3.  Remember that stock levels are aggregated across all eligible warehouses for each store
4.  Check the OmniStock store's `OmniStockBuffer`, and which linked warehouses have `IsExcludedFromOmniStockBuffer` set

### Full Recalculation Triggered Unexpectedly

A full recalculation runs when the system detects changes to any of the following on stores with ShipFromStore or OmniStock roles:

*   Store role assignments
*   Available markets
*   Linked warehouses (codes or priorities)
*   OmniStock rules (any field)

Review recent store configuration changes to identify the trigger.
