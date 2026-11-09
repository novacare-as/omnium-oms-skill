# Pricing and Promotions Overview

Source: https://docs.omnium.no/docs/Prices/pricing-and-promotions

> How pricing works in Omnium — the relationship between price creation, price storage, promotions, and how the right price reaches your customer.

## The Big Picture

Understanding pricing in Omnium starts with one key concept: **price creation and price storage are separate concerns**.

Prices in Omnium are always **stored on products** (or in a dedicated price index for large catalogs). But prices can be **created** by many different mechanisms — an API call, a price list, a promotion, or an external system. Once a price is created, it lives on the product like any other price, regardless of where it came from.

This separation means you can mix and match pricing strategies without changing how prices are consumed. Your e-commerce frontend, cart engine, and API integrations all read prices from the same place — the product — no matter how those prices got there.

```
                        PRICE CREATION
  ┌───────────────────────────────────────────────┐
  │                                               │
  │  Price API    Price Lists    Promotions        │
  │  (ERP sync)   (UI mgmt)     (campaigns)       │
  │     │             │             │              │
  │  Product API  External      Future             │
  │  (in feed)    Price Svc     features           │
  │     │             │             │              │
  └─────┼─────────────┼─────────────┼──────────────┘
        │             │             │
        ▼             ▼             ▼

                     PRICE STORAGE
  ┌───────────────────────────────────────────────┐
  │     Products  (or separate price index)       │
  └───────────────────────────────────────────────┘
                        │
                        ▼

                   PRICE CONSUMPTION
  ┌───────────────────────────────────────────────┐
  │  Product pages · Cart / Checkout · API        │
  └───────────────────────────────────────────────┘
```

* * *

## How Prices Are Created

Omnium offers several ways to create prices, each suited to different scenarios:

| Mechanism | How it works | Best for |
| --- | --- | --- |
| **[Price API](SettingUpPrices.md#managing-prices-via-api)** | Send prices directly via `PUT /api/prices/AddMany`. Prices take effect immediately. | Automated sync from ERP or pricing systems |
| **[Price Lists](SettingUpPrices.md#managing-prices-via-price-lists)** | Create a price list in the UI, add products and prices, then activate. Prices are transferred to products on activation. | Store managers, controlled overrides, manual management |
| **[Product API](SettingUpPrices.md#including-prices-in-product-updates)** | Include prices in the `prices` array when creating or updating products. | Product feeds that include pricing |
| **[Promotions](Promotions.md)** | Define campaign rules. Promotion types that support price generation automatically create prices on matching products. | Campaigns, seasonal sales, category discounts |
| **[External Price Service](../Prices.md)** | A connector fetches prices from your own pricing system at query time. | Edge cases where prices can't be synced to Omnium |

These approaches can be combined freely. For example, you might sync base prices from an ERP via the Price API, use price lists for store-specific overrides, and use promotions for seasonal campaigns — all at the same time. The [price prioritization rules](PricePrioritization.md) determine which price wins when multiple apply.

* * *

## How Prices Are Stored

All prices end up in one of two places:

*   **On the product** — The default. Prices are part of the product document and returned with every product query.
*   **In a separate price index** — For products with very large price sets (150+ prices per product, common in B2B with customer-specific pricing). Prices are stored separately but still returned with product searches.

The storage mechanism is transparent to consumers. Whether a price came from the API, a price list, or a promotion, it looks the same once stored.

For details on price structure, levels, and ID generation, see the [Prices reference](../Prices.md).

* * *

## How Prices Are Selected

When a product has multiple valid prices (different markets, stores, customers, date ranges), Omnium uses a prioritization strategy to select the most relevant one:

1.  **Unit-specific** prices take highest priority
2.  Then **store-specific** prices
3.  Then **store group** prices
4.  Then **customer-specific** prices
5.  Then **market-level** prices

Within each level, the lowest price wins. For the complete rules and examples, see [Price Prioritization](PricePrioritization.md).

* * *

## How Promotions Fit In

Promotions serve a dual purpose in the pricing system:

### 1\. Price generation (pre-cart)

Some promotion types automatically generate prices on products when the promotion is active. These prices appear in product listings and search results, so customers see the promotional price before adding anything to their cart.

| Promotion Type | Generates prices on products |
| --- | --- |
| Category / Brand | Yes |
| Product Search | Yes |
| Price List | Yes |
| Multi-Buy | No (depends on cart context) |
| Order Amount | No (depends on cart context) |
| Kit | No (depends on cart context) |
| Shipping | No (applies to shipping, not products) |

When a price-generating promotion is activated, Omnium calculates the promotional price for every matching product and stores it alongside the product's other prices. When the promotion ends or is deactivated, those prices are removed.

### 2\. Cart-time discounts (at checkout)

All promotion types are evaluated when items are in a cart. The promotion engine checks active promotions against the cart contents, customer, market, and store, and applies matching discounts. This is where context-dependent promotions like multi-buy ("3 for 2") and order-amount discounts ("10% off orders over 1,000 NOK") take effect.

* * *

## Promotion Types at a Glance

| Type | Scope | Example |
| --- | --- | --- |
| **[Category / Brand](Promotions.md)** | Order line | "20% off all Nike products" |
| **[Multi-Buy](Promotions/multibuyApiReference.md)** | Order line | "Buy 2, get 1 free" or "3 for 499 NOK" |
| **[Tiered Pricing](Promotions/tieredPricingApiReference.md)** | Order line | "1 for 199, 2 for 349, 3 for 449" |
| **[Conditional Pricing](Promotions/conditionalPricingApiReference.md)** | Order line | Custom prices that activate when multi-buy conditions are met |
| **[Kit / Bundle](Promotions/kitPromotionApiReference.md)** | Order line | "Complete outfit — 20% off when buying shirt + pants + shoes" |
| **[Product Search](Promotions/productSearchApiReference.md)** | Order line | "15% off all items tagged 'clearance'" |
| **Price List** | Order line | Apply prices from a specific price list as a promotion |
| **[Order Amount](Promotions/orderAmountApiReference.md)** | Order | "100 NOK off orders over 1,000 NOK" |
| **Shipping** | Shipping | "Free shipping on orders over 500 NOK" |

* * *

## Promotion Conditions and Targeting

Every promotion can be targeted using a combination of conditions:

### Who sees it

| Condition | Description |
| --- | --- |
| **Markets** | Apply only in specific markets |
| **Stores** | Apply only in specific stores (or exclude specific stores) |
| **Customer groups** | Apply only to customers in specific groups |
| **Customer club members** | Restrict to loyalty program members |
| **Order types** | Apply only to certain order types (e.g., B2C only) |

### What it applies to (product-level promotions)

| Filter | Description |
| --- | --- |
| **Categories** | Include or exclude product categories |
| **Brands** | Include or exclude brands |
| **Products / SKUs** | Target or exclude specific products |
| **Seasons** | Include or exclude seasonal collections |
| **Properties** | Filter by custom product properties (e.g., color, material) |

### When it's active

| Condition | Description |
| --- | --- |
| **Active from / to** | Date range for the promotion |
| **Coupon code** | Require a code to activate |
| **Minimum order amount** | Require a minimum cart value |
| **Minimum quantity** | Require a minimum number of items |

* * *

## Coupon Codes

Promotions can optionally require a coupon code. Three types are supported:

| Type | Description |
| --- | --- |
| **Primary coupon** | A single code for the promotion (e.g., `SUMMER25`) |
| **Additional coupons** | Multiple codes for the same promotion, optionally single-use |
| **Personal coupons** | Codes assigned to individual customers (via their customer profile or the loyalty program) |

When a coupon code is required, the promotion does not generate prices on products — it only applies at cart time when the customer enters the code.

* * *

## Promotion Priority and Stacking

### Priority

Promotions are evaluated in order:

1.  **By type** — Order-line promotions first, then shipping, then order-level
2.  **By priority value** — Lower numbers are evaluated first (use increments like 100, 200, 300 to leave room for future campaigns)
3.  **By discount value** — Higher discounts are preferred when priorities are equal

### Stacking rules

| Setting | Effect |
| --- | --- |
| `CanBeCombinedWithOtherPromotions` | When `false`, this promotion is mutually exclusive — only the best single promotion applies |
| `AlwaysApply` | Forces the promotion to apply regardless of other stacking rules |
| `DisallowCombinationWithCouponDiscounts` | Prevents combining with any coupon-activated promotion |
| `CanNotBeCombinedWithTags` | Prevents combining with promotions that have specific tags |

Test your promotion combinations before major campaigns. Unexpected stacking can lead to larger discounts than intended. Use the priority system and combination rules to control the outcome.

* * *

## Common Pricing Patterns

### Base prices with store overrides

1.  Sync base prices (RRP) from your ERP via the Price API
2.  Store managers create price lists in the UI for local adjustments
3.  Price prioritization ensures the store-specific price wins when available

### B2B customer-specific pricing

1.  Sync customer-specific prices via the Price API with the `customerId` or `customerGroup` field
2.  Enable separate price storage if you have large price sets
3.  Customer group promotions give additional discounts on top

### Seasonal campaigns

1.  Create a promotion with date range, category/brand filters, and discount
2.  Omnium generates promotional prices on matching products
3.  Customers see the campaign price in search results and product pages
4.  When the campaign ends, promotional prices are automatically removed

### Coupon-only campaigns

1.  Create a promotion with a coupon code and no date-based price generation
2.  The promotion only applies when the customer enters the code at checkout
3.  Useful for influencer codes, loyalty rewards, or targeted offers

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| Price structure and storage | [Prices Reference](../Prices.md) |
| Getting prices into Omnium | [Setting Up Prices](SettingUpPrices.md) |
| Which price wins | [Price Prioritization](PricePrioritization.md) |
| Price list management | [Price Lists](PriceLists.md) |
| Tax handling | [Prices and Tax](PricesAndTax.md) |
| Lowest price display | [Lowest Price](lowest-price.md) |
| Promotion engine details | [Promotions](Promotions.md) |
| Multi-buy promotions | [MultiBuy API Reference](Promotions/multibuyApiReference.md) |
| Kit / bundle promotions | [Kit Promotions API Reference](Promotions/kitPromotionApiReference.md) |
| Tiered pricing | [Tiered Pricing API Reference](Promotions/tieredPricingApiReference.md) |
| Conditional pricing | [Conditional Pricing API Reference](Promotions/conditionalPricingApiReference.md) |
| Order amount discounts | [Order Amount API Reference](Promotions/orderAmountApiReference.md) |
| Product search promotions | [Product Search API Reference](Promotions/productSearchApiReference.md) |
