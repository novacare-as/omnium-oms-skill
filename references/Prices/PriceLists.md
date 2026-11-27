# Price list

Source: https://docs.omnium.no/docs/Prices/PriceLists

> Create price lists in the Omnium UI or with the API, add price list items, activate them to publish prices to products, and lock base prices that an ERP owns

## Introduction

A price list has two parts: the price list itself and its price list items. The price list holds what applies to every item: the markets, stores, customer groups, currency, tax handling, validity dates and the list type. The price list items hold the prices of each product: the unit price, the discount, the cost price and, when the list uses them, the store cost price and the standard cost.

A price list item applies to one SKU (variant level) or to one product (product level). An item with a `SkuId` is a SKU-level item. An item with only a `ProductId` applies to the product.

Price lists are a management tool. Carts and orders always take their prices from the product, never from the price list. A price list item has no effect until the price list is activated: activation publishes the item prices to the products, with the price list's markets, stores, customer groups and validity dates on each price.

Activation does not wait for **Valid from**. It writes the prices at once, and each price carries the price list's validity window, so a price list for next month can be activated today. Which of several valid prices a customer gets is decided by [price prioritization](PricePrioritization.md).

The life cycle of a price list:

1.  Create the price list.
2.  Add the price list items.
3.  **Activate** the price list to publish its prices to the products.
4.  Edit items as needed, then **Update** to publish the changes.
5.  **Deactivate** the price list to remove its prices from the products.

* * *

## Create a New Price List

In the price list overview, select **New price list**, fill in the dialog and select **Create**.

| Setting | Description |
| --- | --- |
| **Type** | **Default** for a price list that sets prices directly. **Price factor** for a price list that prices configurable products: it converts an entered list price to the placed price, like an exchange rate with markup. |
| **List type** | What the price list publishes when it is activated: **Price** (sales prices), **Cost price** (cost prices) or **Price and Cost price** (both). Not shown for a price factor list. |
| **Name** | The name of the price list. |
| **Markets** or **Market group** | The markets the prices apply to. Choose one or more markets, or one market group. **Market group** is only offered when the tenant has market groups. |
| **Currency** and **Cost currency** | The currency of the prices and of the cost prices. They can only be chosen when currencies are configured in the product settings. Otherwise the currency comes from the market. |
| **Exclude tax** | The unit prices in the price list are entered without tax. |

The default list type comes from the setting **List type for new price lists**, and **Use store cost price on new price lists** decides whether a new price list keeps a store cost price. Both are under **Configuration → Settings → Products → Pricing → Price lists**, in the **New price lists** card.

### Edit the price list settings

Open the price list and select **Edit → Edit** to change the rest of the price list settings in the **Metadata** dialog:

*   **Details**: name, markets or market group, tax rate, **Exclude tax**, rounding decimals, type and list type.
*   **Currency**: currency, cost currency and the exchange rate from the cost currency to the price list currency.
*   **Filters**: **Stores** (no stores means every store), **Customer groups**, **Customer club price** (the customer must be a customer club member) and **Unit** (only for prices in another unit than the main sales unit).
*   **Settings**: the rounding policy, **Promotions** (when promotions are allowed, the prices in the price list can be discounted further by promotions) and **Store cost price**.
*   **Timing**: **Valid from** and **Valid until**. A cost price list can have its own validity window for the cost prices, and a list with store cost prices one for the store cost prices; both fall back to the sales window.
*   **Properties** and external IDs.

When currencies are configured, the **Price factor** tab holds the settings that price configurable products: the supplier, the price factor, the purchase discount percentage and the exchange rate settings.

When you save, Omnium recalculates the items. On an active price list, the status then shows _Price list has been edited and needs to be updated._ Select **Update** to publish the change.

* * *

## Add Price List Items to a Price List

Price list items can be added using the user interface (GUI), Excel import, or the API:

*   **Add product** (under **Edit**) opens the product selector. A new item takes the product's current price and cost price. When a **Standard price list** is set in the product settings, the new items take that price list's values for the products on it.
*   **New price list** in the product list creates a price list from the products in the product list's current search, with options to include the existing prices and costs and to create the items on SKU level.
*   **Create a copy** (under **Edit**) copies the whole price list. The copy is not active.
*   **Copy prices from another list** (under **Edit**) copies chosen values from another price list onto the items of this one: price, discount, cost, cost discount, store cost price, store cost discount, standard cost and tax rate. It can also add the products that are not on this list yet.
*   **Import → Import from Excel** imports price list items from a spreadsheet.
*   The [price lists API](PriceLists.md#price-lists-api) adds, updates and patches items.

### Price list item values

| Value | Description |
| --- | --- |
| **Unit price** | The sales price before discount. |
| **Discount** | The discount on the unit price, as an amount or a percentage. The **Discounted price** is the unit price minus the discount. |
| **Cost price** | The cost price in the cost currency. |
| **Cost discount** | A discount on the cost price, as an amount or a percentage. Gives the **Discounted cost price**. |
| **Store cost price** | The price the store pays, in the price list currency. Only on price lists with store cost price. |
| **Store cost discount** | A discount on the store cost price, as an amount or a percentage. |
| **Standard cost** | The standard cost in the cost currency. |
| **Tax rate** | A tax rate for this item only. Empty means the price list's tax rate. |
| **Planning** | Planned sales volume, planned purchase volume and comments, used by campaign planning. |
| **Properties** | Custom properties on the item. |

Profit, profit margin and markup are calculated from the discounted price and the cost price.

* * *

## Edit Prices in a Price List

The items of a price list can be shown in four views:

*   **List**: one read-only row per item, with inline editing of the cost price (and store cost price), unit price, discount and profit margin that you turn on from the column menu.
*   **Form**: editable rows, with a discount row that applies a discount to the selected items or to all items.
*   **Full**: one wide editable row per item with cost price, store cost price, pricing, sales and purchase forecasts, comments and product details.
*   **Budget**: sales history for a chosen period next to the planned volumes, with estimated revenue and totals for the whole list.

Select an item to open the price list item dialog. Its **Calculations** tab has the cost price, store cost price and pricing columns, the cost currency and exchange rate, the tax rate and the planning values. The other tabs show the standard cost, the product's lowest price history, its current prices and cost prices, and the item's properties.

### Change prices in bulk with Calculate

**Edit → Calculate** changes many items at once. On every tab except **Price engine**, choose whether to apply the change to all items or to the items in the current filter.

*   **Price engine**: prices every item from its cost at the profit you enter, so it always writes the unit price. It always applies to the whole price list.
*   **Modify all prices**: moves the price, cost price or store cost price of every item by an amount or a percentage. Discounts are kept.
*   **Set discounts**: sets the discount, cost discount or store cost discount as an amount or a percentage. A field left empty keeps that discount, and 0 removes it.
*   **Rounding policy**: rounds a price type with a rounding policy.

* * *

## Lock the Base Prices on Price List Items

When the base prices come from an upstream system such as an ERP, you can stop users from changing them by hand in the Omnium UI, while they keep setting campaign and promotion prices as discounts on the same price list items. Turn on **Lock base prices** under **Configuration → Settings → Products → Pricing → Price lists**, in the **Base prices** card. The setting is off by default and applies to every price list in the tenant.

With the lock on, these base prices are read-only on every price list item:

*   **Cost price**
*   **Store cost price**
*   **Standard cost**
*   **Unit price**

The discounts (**Discount**, **Cost discount** and **Store cost discount**, as an amount or a percentage) stay editable, and so do the discounted prices and profit figures calculated from them. Other item values, such as the tax rate, are not affected.

### Where the lock applies

*   **Price list item dialog and the List, Form and Full views**: the base price fields are disabled. Hovering a locked field shows _Locked: base prices can only be changed by import or integration._ The profit margin editor in the List view is closed too, because it calculates and writes the unit price.
*   **Calculate**: the **Modify all prices** and **Rounding policy** tabs cannot be used. **Set discounts** stays available. **Price engine** also stays available: it sets each item's unit price from its cost at the profit you enter, so the selling price follows the cost your integration delivers.
*   **Copy prices from another list**: the base prices are left out of the copy. Discounts and tax rates are still copied.

A changed base price sent from the UI is not saved: Omnium keeps the stored value and saves the rest of the item.

The lock only applies to editing in the Omnium UI. Excel import, connectors and the public API still write the base prices, so your integration can keep them up to date. Adding products to a price list still creates the new items with their prices.

* * *

## Activate and Deactivate the Price List

When products are added to the cart, the price is taken from the product—not directly from the price list. This means that prices defined in the price list must be applied to the product in order to take effect. The **Activate** (or **Update**) button performs this function: it copies the price from the price list item to the product and marks the item as active.

As a result, whenever new items are added to a price list, the list must be updated (republished) to apply those prices to the products.

| Action | What it does |
| --- | --- |
| **Activate** | Publishes the prices of every item to the products: sales prices, cost prices or both, depending on the list type. A store cost price is published in place of the cost price for the items that have one. |
| **Update** | Publishes the changes on an active price list. After a change to the price list settings, it publishes every item again and removes the prices that no longer belong to the price list. |
| **Deactivate** | Removes the price list's prices from the products. |
| **Re-run price cleanup** | On a deactivated price list: removes any prices from this price list that are still on products. |
| **Validate** | Runs the price list validators configured for the tenant and stores the warnings and errors on each item. |
| **Remove all prices** | Permanently deletes every price list item and removes their prices from the products. The price list itself is kept. |

Activation, update and deactivation run in the background. The price list shows its status while they run, for example **Activating** or **Deactivating**. Deleting a published item from an active price list removes its prices from the product at once.

In the **List** view, a check mark shows that an item is active, and a warning icon shows that it has validation warnings or errors. Use **Filter by warning** to find them.

* * *

## Keep Base Prices in Step Across Price Lists

An ERP often owns the base prices in one main price list, while campaign price lists discount the same products. To keep the campaign price lists on the current base prices, send the base prices with [Patch price list items](PriceLists.md#patch-price-list-items) and the query parameter `updateAllPriceLists=true`. The price list you patch must not have expired and must not be a price factor list. Omnium then writes the new unit price, cost and store cost price of every created or changed item to the same product on every other price list that:

*   has the same currency,
*   has not expired, and
*   is not a price factor list.

Only items that already exist on the other price lists are updated; no items are added to them. On each of them, the discounted price is kept:

*   An item with a discount keeps its discounted price, and the discount amount and percentage are recalculated against the new base price.
*   An item without a discount follows the new base price.
*   When the new base price is at or below the discounted price, the discount is cleared, so a price list never charges more than the base price.

A price type is only written when both items already have a price above 0 for it and the target price list's own validity window for it is still open. The unit price is only carried between price lists that agree on tax, the cost only between price lists with the same cost currency, and the store cost price only between price lists that keep one. A price list that calculates its unit price from the unit price base keeps doing so and does not take the unit price. A cost or store cost price that is higher than its base price on the target list is kept. Items sent in the same request are left as they are sent.

The update runs in the background after the response. The changed items are saved unpublished; with `activatePriceLists=true`, they are also published on the price lists that are already active.

Together with [Lock base prices](PriceLists.md#lock-the-base-prices-on-price-list-items), users keep setting campaign discounts in the UI while the base prices follow the ERP.

* * *

## Price Lists API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/PriceLists/{id}` | Get a price list |
| `POST` | `/api/PriceLists/SearchPriceLists` | Search price lists |
| `POST` | `/api/PriceLists/AddPriceList` | Add a price list, or update it when a price list with the same ID exists |
| `POST` | `/api/PriceLists/ActivatePriceList/{priceListId}` | Activate a price list: publishes its prices to the products |
| `POST` | `/api/PriceLists/DeactivatePriceList/{priceListId}` | Deactivate a price list: removes its prices from the products |
| `POST` | `/api/PriceLists/ValidatePriceList/{priceListId}` | Start a validation run for the price list |
| `GET` | `/api/PriceLists/{id}/priceListItems` | Get the items of a price list, a page at a time (`page`, default 1, and `take`, default 20) |
| `POST` | `/api/PriceLists/AddPriceListItems` | Add or update price list items |
| `PATCH` | `/api/PriceLists/PatchPriceListItems` | Update only the fields you send on price list items, and create the items that do not exist |
| `DELETE` | `/api/PriceLists/{id}` | Delete a price list and its items |
| `DELETE` | `/api/PriceLists/DeletePriceListItems` | Delete price list items by ID |

Activation, deactivation and validation are queued: the call returns at once and the work runs in the background. `IsActive` and `Published` on the price list show when an activation has finished, and each item's `Errors` show the result of a validation run.

### Price list

| Field | Type | Description |
| --- | --- | --- |
| `Id` | string | Unique ID of the price list. **Required.** |
| `Name` | string | Name of the price list. **Required.** |
| `CurrencyCode` | string | Currency of the prices. **Required.** |
| `PriceListType` | string | `Price`, `CostPrice` or `PriceAndCostPrice`: what the price list publishes. |
| `PriceType` | string | `Default` or `PriceFactor`. |
| `MarketIds` | array | Markets the price list applies to. Cannot be combined with `MarketGroupId`. |
| `MarketGroupId` | string | Market group the price list applies to. Cannot be combined with `MarketIds`. |
| `StoreIds` | array | Stores the price list applies to, at most 1000. Empty means every store. |
| `CustomerIds` | array | Customers the price list applies to, at most 250. |
| `CustomerGroups` | array | Customer groups the price list applies to, at most 250. |
| `CostCurrencyCode` | string | Currency of the cost prices. Defaults to `CurrencyCode`. |
| `CostCurrencyExchangeRate` | decimal | Exchange rate from the cost currency to the price list currency. When it is not given, today's rate is used. |
| `ValidFrom` | datetime | Start of the price list's validity. |
| `ValidTo` | datetime | End of the price list's validity. Empty means the price list does not expire. |
| `CostPriceValidFrom` / `CostPriceValidTo` | datetime | Validity of the cost prices, when it differs from the sales window. |
| `StoreCostPriceValidFrom` / `StoreCostPriceValidTo` | datetime | Validity of the store cost prices, when it differs from the sales window. |
| `TaxRate` | decimal | Tax rate of the price list. When it is not given, the market's default tax rate is used. |
| `IsExcludingTax` | bool | The unit prices are entered without tax. |
| `IsPromotionsAllowed` | bool | Promotions can discount the prices further. |
| `IsCustomerClubSpecificPrice` | bool | The prices only apply to customer club members. |
| `Unit` | string | Unit of measurement, only for prices in another unit than the main sales unit. |
| `RoundingDecimals` | int | Number of decimals when the unit price is calculated. |
| `IsStoreCostPriceEnabled` | bool | The price list keeps a store cost price per item. `true` turns it on. An update never turns it off: `false`, or leaving it out, keeps the stored setting, so turn it off in Omnium. |
| `StoreCostPriceMarketIds` / `StoreCostPriceStoreGroupIds` | array | Markets and store groups of the store cost prices. A list that is sent replaces the stored one; leaving it out keeps it. |
| `IsMetadataOnly` | bool | The price list only holds planning figures and publishes no prices. Set when the price list is created; an update keeps it. |
| `PromotionId` | string | The promotion that owns the price list. See [price list promotions](Promotions/priceListPromotionApiReference.md). |
| `Tags` | array | Labels for the price list, for example `"Clearance"`. |
| `Properties` | array | Custom properties. |
| `ExternalIds` | array | External IDs. |
| `Created` | datetime | When the price list was created. Set on the first save when not given, and kept on an update that gives none. |
| `IsActive` | bool | Read-only. The price list is activated. |
| `Published` | datetime | Read-only. When the price list was activated. |
| `Errors` | array | Read-only. Problems found on the price list. |

### Price list item

| Field | Type | Description |
| --- | --- | --- |
| `PriceListId` | string | The price list of the item. **Required.** |
| `SkuId` | string | The SKU, for an item on variant level. |
| `ProductId` | string | The product, for an item on product level. Required when `SkuId` is not given. |
| `UnitPrice` | decimal | The sales price before discount. |
| `Discount` | decimal | The discount amount. |
| `DiscountPercent` | decimal | The discount as a percentage of `UnitPrice`. Used to work out the discount when `Discount` is 0. |
| `DiscountedPrice` | decimal | The price after discount. Used to work out the discount when `Discount` and `DiscountPercent` are 0. |
| `Cost` | decimal | The cost price in the cost currency. |
| `CostDiscount` | decimal | The cost discount amount. |
| `CostCurrencyCode` | string | A cost currency for this item only. |
| `CostCurrencyExchangeRate` | decimal | An exchange rate for this item only. |
| `StoreCostPrice` | decimal | The store cost price in the price list currency. |
| `StoreCostDiscount` | decimal | The store cost discount amount. |
| `StandardCost` | decimal | The standard cost in the cost currency. |
| `TaxRate` | decimal | A tax rate for this item only. Empty means the price list's tax rate. |
| `Tags` | array | Labels for the item. |
| `PlannedSalesVolume` / `PlannedPurchaseVolume` | decimal | Planned volumes for campaign planning. |
| `Properties` | array | Custom properties. |
| `Id` | string | Read-only. `{PriceListId}_{SkuId}`, or `{PriceListId}_{ProductId}` for a product-level item. |
| `Profit`, `ProfitPercent`, `ProfitMargin` | decimal | Read-only. Calculated from the prices. |
| `IsActive` | bool | Read-only. The price of the item is published. |
| `Errors` | array | Read-only. Validation warnings and errors from the last validation run. |

### Create a price list

```
POST /api/PriceLists/AddPriceList
```

```json
{
  "id": "nor-campaign-week-47",
  "name": "Black Week 2026",
  "priceListType": "Price",
  "marketIds": ["NOR"],
  "currencyCode": "NOK",
  "storeIds": [],
  "validFrom": "2026-11-23T00:00:00Z",
  "validTo": "2026-11-30T23:59:59Z",
  "isPromotionsAllowed": false
}
```

A call with the ID of an existing price list replaces it, and Omnium recalculates its items. The call keeps:

*   the settings that the price list model does not carry: the rounding policy, the price engine settings and the priority of a linked promotion
*   `IsMetadataOnly`, and the active status of a default price list, whatever the call sends
*   `Created`, `PromotionId` and the store cost price markets and store groups, when the call leaves them out
*   store cost prices once they are on: `IsStoreCostPriceEnabled: true` turns them on, but the call never turns them off; do that in Omnium

Any other field that the call leaves out is cleared, for example `ValidTo`, `StoreIds` or `Tags`. To change one field, send the whole price list as `GET /api/PriceLists/{id}` returns it.

### Add price list items

```
POST /api/PriceLists/AddPriceListItems
```

```json
[
  {
    "priceListId": "nor-campaign-week-47",
    "skuId": "12307000",
    "unitPrice": 2299.00,
    "discount": 800.00,
    "cost": 1150.00
  }
]
```

Items for a price list that does not exist are ignored.

### Patch price list items

```
PATCH /api/PriceLists/PatchPriceListItems?activatePriceLists=true&updateAllPriceLists=true
```

```json
[
  {
    "priceListId": "nor-base-prices",
    "skuId": "12307000",
    "unitPrice": 2399.00,
    "cost": 1190.00
  }
]
```

Only the fields you send are changed, and the calculated values are recalculated. Identify each item by `id`, or by `priceListId` with `skuId` or `productId`. An item that does not exist is created, as long as its price list exists.

| Query parameter | Default | Description |
| --- | --- | --- |
| `activatePriceLists` | `false` | Publish the changed items. On an active price list only the changed items are published. A price list that is not active yet, or that needs a full update, is activated in full. |
| `enrichWithProductData` | `false` | Fill in product data, such as the product name, on the items in the background. |
| `updateAllPriceLists` | `false` | Carry the new base prices to the same products on the other price lists. See [Keep base prices in step across price lists](PriceLists.md#keep-base-prices-in-step-across-price-lists). |

The response counts the items:

```json
{
  "totalCount": 1,
  "updatedCount": 1,
  "createdCount": 0,
  "unchangedCount": 0,
  "notFoundCount": 0,
  "notFoundIds": [],
  "errorCount": 0,
  "errorMessage": null,
  "isModified": true
}
```

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).

* * *

## Related

*   [Setting up prices](SettingUpPrices.md)
*   [Price prioritization](PricePrioritization.md)
*   [Price list promotions](Promotions/priceListPromotionApiReference.md)
*   [Campaign planning](Campaigns/campaign-planning.md)
