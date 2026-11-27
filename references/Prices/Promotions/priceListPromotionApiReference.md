# Price List Promotions

Source: https://docs.omnium.no/docs/Prices/Promotions/priceListPromotionApiReference

> How price list promotions combine the price management capabilities of price lists with the targeting, scheduling, and combination features of promotions.

## What Is a Price List Promotion?

A price list promotion wraps a [price list](../PriceLists.md) inside a [promotion](../Promotions.md), combining two capabilities:

*   **Price list** — The ability to define and manage prices at the SKU level
*   **Promotion** — Scheduling, market/store targeting, customer group filtering, combination rules, priority handling, and campaign tracking

Without a promotion, a price list is a standalone collection of prices that you activate and deactivate manually. By linking a price list to a promotion, you gain time-based control, targeting, stacking logic, and integration with campaigns and performance tracking — while still managing the actual prices through the familiar price list interface.

* * *

## Why Use a Price List Promotion Instead of a Standalone Price List?

A common question is: _"Why not just use a price list directly?"_

The short answer is that price lists and promotions serve different purposes, and a price list promotion brings them together.

### Price list = what the prices are

A price list is where you define the actual prices: which SKUs are included, what the discounted price is, and what the margin looks like. This is the **price management** context — you are working with products and numbers.

### Promotion = when, where, and how the prices apply

A promotion controls the rules around those prices: when they are active, which markets and stores they apply to, whether they can stack with other promotions, and what priority they have. This is the **promotion management** context — you are working with business rules.

### Price list promotion = both together

A price list promotion links these two contexts with a one-to-one relationship. You manage the prices in the price list, and you manage the rules in the promotion. Each side has its own UI and its own set of features.

### Feature Comparison

| Feature | Standalone Price List | Price List Promotion |
| --- | --- | --- |
| Define SKU-level prices | Yes | Yes (via linked price list) |
| Manual activate / deactivate | Yes | Yes |
| **Scheduled activation (date range)** | No | Yes — `ActiveFrom` / `ActiveTo` |
| **Market and store targeting** | Basic (market ID, store IDs) | Advanced (markets, market groups, stores, excluded stores, store groups, warehouse filtering) |
| **Customer group targeting** | Basic (customer IDs, groups) | Advanced (customer groups, club members only, personal coupons) |
| **Combination rules** | None | Full (can combine, always apply, disallow coupon combination, tag-based exclusion) |
| **Priority handling** | None | Priority value for ordering against other promotions |
| **Coupon code support** | No | Yes (primary, additional, and personal coupons) |
| **Campaign integration** | Basic (campaign ID) | Full (planned revenue, planning notes, performance tracking) |
| **Automatic expiration handling** | No | Yes — "Last Chance" conversion |
| **Price applicability control** | No | Yes — apply to all, original price only, or discounted price only |
| **Tags for downstream systems** | Yes | Yes (plus promotion-specific tags for combination rules) |

* * *

## How It Works

### 1\. Create the promotion

Create a new promotion with type **Price List** (type 6). Configure the promotion-level settings:

*   **Name** and description
*   **Active From / Active To** — the date range
*   **Markets** — which markets the promotion applies to
*   **Stores** — which stores (or excluded stores)
*   **Customer groups** — optional targeting
*   **Priority** — ordering relative to other promotions
*   **Combination rules** — whether it can stack with other promotions
*   **Coupon code** — optional requirement

### 2\. Link a price list

From the promotion, either:

*   **Select an existing price list** to link to the promotion
*   **Create a new price list** directly from the promotion UI

This creates a one-to-one link: the promotion references the price list via `PriceListId`, and the price list references the promotion via `PromotionId`.

> Markets must be set on the promotion before linking a price list. The price list's currency is derived from the market's default currency.

### 3\. Manage prices in the price list

Switch to the price list context to manage the actual prices:

*   **Add products** by searching for them (by name, category, brand, etc.)
*   **Set discounted prices** for each SKU
*   **View cost and margin** data to make informed pricing decisions
*   **Set planning targets** (planned sales volume) if the promotion is linked to a campaign

This is the same price list interface used for standalone price lists.

### 4\. Activate

When the price list is activated, the prices are transferred to the products — just like a standalone price list. Products will then display the promotional prices in search results and product pages.

The promotion's date range controls when the prices are valid. When the promotion expires, the prices are removed from products.

* * *

## Price Generation

Price list promotions generate prices on products when activated. The prices are stored on the products (or in the separate price index) just like any other price, making them visible in product listings and search results.

Unlike category/brand or product search promotions — which dynamically calculate discounts based on a percentage — price list promotions use **pre-defined prices** from the price list items. Each SKU has an explicit discounted price set by the user.

A price list promotion will generate prices when:

1.  The price list is activated
2.  `IsBonusPointsReward` is `false`
3.  `OrderTypes` is not set on the promotion
4.  No coupon code is required (prices must be visible without a code)

If a coupon code is required, prices are not displayed on products — the discount only applies when the customer enters the code at checkout.

* * *

## Expiration and "Last Chance" Conversion

Price list promotions support automatic conversion when they expire. Instead of simply removing the promotional prices, the system can:

1.  **Create a copy** of the price list tagged as "Last Chance" (or a custom tag)
2.  **Convert the copy** to a regular (non-promotional) price list
3.  **Activate the copy** so products retain the discounted prices beyond the promotion period
4.  **Deactivate the original** promotional price list

This is configured via the `ConvertToRegularPriceAt` field on the promotion. It allows you to transition from a time-limited campaign price to an ongoing clearance price without manual intervention.

* * *

## Working in Two Contexts

When managing a price list promotion, you switch between two contexts:

### Promotion context

This is where you manage the **business rules**:

*   When the promotion is active
*   Who it targets (markets, stores, customer groups)
*   How it interacts with other promotions (priority, combination rules)
*   Whether a coupon code is required
*   Campaign linkage and planning metadata

### Price list context

This is where you manage the **prices**:

*   Which SKUs are included
*   What each SKU's discounted price is
*   Cost and margin analysis
*   Planned sales volume (for campaign planning)
*   Activating and updating the price list

Both contexts are accessible from the promotion detail page, but they represent different aspects of the same price list promotion.

* * *

## Campaign Integration

Price list promotions provide the deepest level of campaign integration:

*   **Campaign linkage** — Link the promotion to a [campaign](../Campaigns.md) for grouped tracking. Through the API, set `campaignId` on the promotion
*   **SKU-level planning** — Each price list item can have a planned sales volume, and planned revenue is calculated automatically
*   **Performance tracking** — Actual revenue and volume are tracked per SKU and rolled up to the promotion and campaign level

The campaign's **Planning** tab lists the items of the price lists whose `promotionId` is one of the campaign's promotions. When you create the price list with `POST /api/PriceLists/AddPriceList`, set `promotionId` to the promotion's id; you can also set `campaignId` to record the campaign on the price list itself. On `AddPriceList`, a `campaignId` left out keeps the price list's stored campaign and an empty string removes it. See the [Campaign API](../Campaigns/campaign-api.md#build-a-campaign-with-promotions-and-price-lists) for a full example.

For more on campaign planning, see [Campaign Planning](../Campaigns/campaign-planning.md).

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| Price list basics | [Price Lists](../PriceLists.md) |
| All promotion types | [Promotions](../Promotions.md) |
| Campaign planning with price lists | [Campaign Planning](../Campaigns/campaign-planning.md) |
| Campaign performance tracking | [Campaign Performance](../Campaigns/campaign-performance.md) |
| How prices are selected | [Price Prioritization](../PricePrioritization.md) |
| Pricing overview | [Pricing & Promotions Overview](../pricing-and-promotions.md) |
