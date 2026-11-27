# Setting Up Prices

Source: https://docs.omnium.no/docs/Prices/SettingUpPrices

> How to set up and manage prices in Omnium - choosing the right approach for your integration, using price lists for manual management, and keeping your price model efficient.

## Where Do Prices Come From?

Products in Omnium need prices. But where should those prices come from, and how do you keep them up to date?

If you're integrating with an ERP or pricing system, you'll typically sync prices via API. If product managers or store managers need to manage prices manually (or override ERP prices for specific stores), you can use price lists in the Omnium UI.

## Choosing Your Approach

There are three ways to get prices into Omnium:

| Approach | Best For |
| --- | --- |
| **Price API** | Automated sync from ERP or pricing systems. Prices update immediately. |
| **Price Lists** | User-managed prices in the Omnium UI, with an activation workflow. Great for store-specific overrides. |
| **Product API** | Including prices when you create or update products. Useful if prices are part of your product feed. |

These approaches can be combined. For example, you might sync base prices from an ERP via the Price API, and use Price Lists for store-specific overrides. You can also edit prices directly on products in the Omnium UI.

* * *

## Managing Prices via API

If your prices come from an ERP, PIM, or other external system, use the price API to sync them to Omnium. Prices take effect immediately after the API call, no activation step required.

### Endpoint

```
PUT /api/prices/AddMany
```

### Request Structure

The API expects a list of price update requests. Each request targets a specific product:

```json
[
  {
    "productId": "PROD-001",
    "prices": [
      {
        "code": "SKU-001",
        "unitPrice": 299.00,
        "currencyCode": "NOK",
        "marketId": "NOR",
        "validFrom": "2025-01-01T00:00:00Z"
      }
    ],
    "ignoreDates": true
  }
]
```

### What the API Handles

The `ignoreDates` and `ignoreValidUntilDate` parameters control how existing prices are matched when updating:

| Parameter | Default | What It Does |
| --- | --- | --- |
| `ignoreDates` | `false` | When `true`, replaces existing prices regardless of their validity dates |
| `ignoreValidUntilDate` | `false` | When `true`, matches on `validFrom` only (ignores `validUntil`) |

**Typical usage:**

*   Use `ignoreDates: true` for full price syncs where you want to replace all existing prices
*   Use `ignoreDates: false` when updating prices for specific date ranges

### Price Fields

For a complete list of price fields, see the [Prices overview](https://docs.omnium.no/docs/Prices/index). The most commonly used fields are:

| Field | Description |
| --- | --- |
| `code` | SKU identifier. Omit this for product-level prices (applies to all variants). |
| `unitPrice` | The selling price |
| `currencyCode` | Currency (e.g., `NOK`, `SEK`, `EUR`) |
| `marketId` | Target market |
| `storeId` | Target store (for store-specific prices) |
| `validFrom` / `validUntil` | Validity period |
| `customerId` / `customerGroup` | For customer-specific pricing |

### Discounts and the Promotion Engine

If you're sending discounted prices from an external system, you should typically set `isExternalPromotion: true`. This tells Omnium that the discount comes from an external source, so the Omnium promotion engine won't apply additional discounts on top.

```json
{
  "code": "SKU-001",
  "unitPrice": 499.00,
  "originalUnitPrice": 599.00,
  "discountAmount": 100.00,
  "currencyCode": "NOK",
  "marketId": "NOR",
  "isExternalPromotion": true
}
```

* * *

## Including Prices in Product Updates

If your product feed already includes prices, you can include them when creating or updating products via the Product API. The prices go in the `prices` array on the product. See the [Prices overview](https://docs.omnium.no/docs/Prices/index) for the recommended structure.

This is convenient when prices and product data come from the same source. For dedicated price syncs, use the Price API instead.

* * *

## Managing Prices via Price Lists

Price lists let users manage prices through the Omnium UI without needing API access. They're useful for:

*   Store managers adjusting prices for their location
*   Regional pricing that differs from the base price
*   Controlled price changes with activation/deactivation workflow

### How Price Lists Work

1.  Create a price list with target market, stores, and validity dates
2.  Add products with their prices
3.  **Activate** the price list. Prices are transferred to the products.
4.  **Deactivate** when done. Prices are removed from the products.

Price lists are a **management tool**. When you activate a price list, the prices are transferred to the products themselves.

> **Important:** The actual prices used in carts and orders always come from the product, not from the price list directly.

### When to Use Price Lists

Price lists work well when:

*   Users need to manage prices without API access
*   You want controlled activation/deactivation of price changes
*   You need an audit trail for price changes

Price lists are **not** the best fit when:

*   Prices are fully managed by an external system
*   You need prices to update immediately without an activation step
*   Prices change multiple times per day

### Creating a Price List

```
POST /api/pricelists/AddPriceList
```

**Required fields:** `id`, `name`, `currencyCode`

```json
{
  "id": "oslo-flagship-2025",
  "name": "Oslo Flagship Store Prices",
  "currencyCode": "NOK",
  "marketId": "NOR",
  "storeIds": ["STORE-OSLO-01"],
  "priceListType": "Price",
  "validFrom": "2025-01-01T00:00:00Z",
  "validTo": "2025-12-31T23:59:59Z"
}
```

### Adding Items

```
POST /api/pricelists/AddPriceListItems
```

```json
[
  {
    "priceListId": "oslo-flagship-2025",
    "skuId": "SKU-001",
    "unitPrice": 449.00
  }
]
```

Each item needs `priceListId` plus either `skuId` (variant-level) or `productId` (product-level).

### Activating and Deactivating

```
POST /api/pricelists/ActivatePriceList/{priceListId}
POST /api/pricelists/DeactivatePriceList/{priceListId}
```

### Price List Types

| PriceListType | What It Creates |
| --- | --- |
| `Price` | Sales prices only |
| `CostPrice` | Cost prices only |
| `PriceAndCostPrice` | Both |

* * *

## Common Pattern: RRP with Store Overrides

A typical setup combines both approaches:

1.  **Base prices (RRP)** synced from ERP via the price API
2.  **Store-specific overrides** managed through price lists in the UI

### Example

**Step 1:** ERP syncs the base price

```
PUT /api/prices/AddMany
```

```json
[
  {
    "productId": "PROD-001",
    "prices": [
      {
        "code": "SKU-001",
        "unitPrice": 499.00,
        "currencyCode": "NOK",
        "marketId": "NOR",
        "validFrom": "2025-01-01T00:00:00Z"
      }
    ],
    "ignoreDates": true
  }
]
```

This price applies to all stores in the NOR market.

**Step 2:** Store manager creates a price list for their store with a lower price (449.00)

**Step 3:** When activated, the store-specific price takes precedence for that store (see [Price Prioritization](PricePrioritization.md))

**Step 4:** When deactivated, the base RRP applies again

This pattern gives your ERP control over base pricing while letting store managers adjust prices locally.

* * *

## Separate Price Storage

By default, prices are stored directly on the product. For products with many prices (150+ per product), this can make product documents large and slow to update.

Omnium supports storing prices separately from the product. When enabled:

*   Product searches still return the relevant price for the current context
*   You get dedicated price search endpoints for bulk operations
*   Price updates don't touch the product itself

**Trade-off:** Product searches will be slower with separate prices enabled. Only use this if you have very large price sets that would otherwise bloat your product documents.

This is primarily useful for **B2B scenarios with extensive customer-specific pricing**, for example when a single product might have hundreds or thousands of different prices for different customers.

> The API works the same way regardless of how prices are stored internally. Contact support if you think you need this enabled.

* * *

## Cost Price Options

Cost prices can be stored in several ways:

| Option | Description | Considerations |
| --- | --- | --- |
| **Product.Cost** | Single cost value on the product | Simple, but only one cost per product |
| **Price.Cost** | Cost field on each price | Tied to the number of prices you have |
| **Separate Cost Prices** | Dedicated cost price documents | Most flexible, supports additional dimensions |

Separate cost prices support fields not available on regular prices:

| Field | Description |
| --- | --- |
| `supplier` | Supplier identifier |
| `type` | Cost price type |

### Cost Price API

```
PUT /api/costprices/AddMany
POST /api/costprices/Search
DELETE /api/costprices
```

* * *

## Price Dimensions

Prices can be targeted using these dimensions:

| Dimension | Description |
| --- | --- |
| `marketId` | Specific market |
| `marketGroupId` | Group of markets |
| `storeId` | Specific store |
| `customerId` | Specific customer |
| `customerGroup` | Customer group (B2B) |
| `storeGroupId` | Group of stores |
| `validFrom` / `validUntil` | Validity period |
| `unit` | Unit-specific (e.g., "box", "pallet") |

Note: `storeGroupId` is available on regular prices, cost prices, and price lists.

* * *

## Best Practices

### Keep Your Price Model Slim

Products with hundreds of prices are slower to fetch and update. A few tricks help:

**Use market groups instead of duplicating prices.**

If you have multiple markets that share the same price (e.g., regional franchises or sales channels), group them:

```json
[
  { "unitPrice": 100, "marketGroupId": "RETAIL", "currencyCode": "NOK" }
]
```

One price covers all markets in the group.

**Use product-level prices when variants share the same price.**

If all your size variants cost the same, skip the `code` field entirely:

```json
[
  { "unitPrice": 100, "currencyCode": "NOK", "marketId": "NOR" }
]
```

This single price applies to all variants on the product.

**Define a base price and only add overrides where needed:**

The [price prioritization rules](PricePrioritization.md) ensure the most specific price is selected. You don't need to define every combination, just the base price and any exceptions.

* * *

## Related

*   [Prices Overview](https://docs.omnium.no/docs/Prices/index) - Price structure, ID generation, external price services
*   [Price Prioritization](PricePrioritization.md) - How prices are selected when multiple valid prices exist
*   [Price Lists](PriceLists.md) - Detailed price list functionality
*   [Prices and Tax](PricesAndTax.md) - Tax handling
*   [Promotions](https://docs.omnium.no/docs/Prices/Promotions/promotions) - Campaign discounts and promotion engine
