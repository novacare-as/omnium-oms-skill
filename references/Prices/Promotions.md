# Promotions

Source: https://docs.omnium.no/docs/Prices/Promotions

> Technical overview of Omnium's promotion system, including API endpoints, application logic, priorities, and combination rules.

# Promotions

This page provides an overview of Omnium’s promotion system and how it works. It covers the main concepts, API endpoints, automatic application logic, priority handling, combination rules, and store/market filtering. Promotions are usually managed through the Omnium UI, but can also be created and maintained via API when needed (for instance, for automation or integration purposes).

## Overview

The promotion system in Omnium is a flexible, multi-layered discount engine that supports several types of discounts — including order-level, product-level, and shipping promotions. Promotions are automatically applied to carts and orders based on configured criteria.

### Key Components

The Omnium promotion system consists of:

*   **Omnium UI** – The primary interface for creating and managing promotions
*   **Promotion API** – For advanced management, automation, or integrations
*   **Promotion Engine** – Automatic application of discounts to orders and carts
*   **Promotion Types** – Various discount models for different business scenarios

## Promotion Types

The system supports eight promotion types:

### Product-Level Promotions (Order Line)

*   **Category/Brand Promotions** (`promotionType: 1`) – Discounts on specific categories or brands. Configure using `categoryAndBrandFilter` with the `reward` object.
*   **Multi-Buy Promotions** (`promotionType: 2`) – Quantity-based promotions such as "Buy 2 get 1 free", "3 for 2", or tiered discounts when purchasing multiple items.
    *   **Conditional Pricing** – Advanced MultiBuy feature that controls when promotional prices are displayed based on cart conditions
    *   **Tiered Pricing** – Progressive pricing based on quantity thresholds
*   **Kit Promotions** (`promotionType: 4`) – Bundle product discounts where customers must buy items from multiple component groups
*   **Product Search Promotions** (`promotionType: 5`) – Dynamic discounts based on product search criteria (tags, price range, stock status, etc.)
*   **Price List Promotions** (`promotionType: 6`) – Apply discounts from a predefined price list. Configure using `priceListId`. See [Price List Promotions](https://docs.omnium.no/docs/Prices/priceListPromotionApiReference) for detailed documentation.
*   **Cost Price Promotions** (`promotionType: "CostPricePromotion"`) – Dynamically calculate selling prices from product cost prices with a configurable markup percentage. Links to a price list containing cost prices and applies the formula: `CostPrice x (1 + Markup%) x (1 + Tax%)`. See [Cost Price API Reference](https://docs.omnium.no/docs/Prices/costPriceApiReference) for detailed documentation.

### Order-Level Promotions

*   **Order Amount Promotions** (`promotionType: 3`) – Discounts based on order total and/or quantity (e.g. "$10 off orders over $100", "10% off when you buy 5+ items"). See [Order Amount API Reference](https://docs.omnium.no/docs/Prices/orderAmountApiReference) for detailed documentation including minimum quantity and condition operator features.

### Shipping Promotions

*   **Shipping Promotions** (`promotionType: 0`) – Free or discounted shipping based on order amount conditions. Configure using `shippingMethods` and `amountCondition`.

## API Documentation

For detailed API documentation, including request/response schemas and examples:

*   [Promotions API Swagger Documentation](https://apitest.omnium.no/documentation/index.html#/Promotions) - Interactive API explorer
*   [MultiBuy & Mix and Match API Reference](https://docs.omnium.no/docs/Prices/multibuyApiReference) - Comprehensive guide for MultiBuy promotions
*   [Kit Promotions API Reference](https://docs.omnium.no/docs/Prices/kitPromotionApiReference) - Complete guide for bundle/kit promotions
*   [Conditional Pricing API Reference](https://docs.omnium.no/docs/Prices/conditionalPricingApiReference) - Control when promotional prices are displayed based on cart conditions
*   [Tiered Pricing API Reference](https://docs.omnium.no/docs/Prices/tieredPricingApiReference) - Guide for quantity-based tiered pricing
*   [Product Search API Reference](https://docs.omnium.no/docs/Prices/productSearchApiReference) - Documentation for product search promotions
*   [Order Amount API Reference](https://docs.omnium.no/docs/Prices/orderAmountApiReference) - Complete guide including minimum quantity and AND/OR conditions
*   [Price List Promotions](https://docs.omnium.no/docs/Prices/priceListPromotionApiReference) - How price list promotions combine price lists with promotion features
*   [Cost Price API Reference](https://docs.omnium.no/docs/Prices/costPriceApiReference) - Documentation for cost-plus pricing promotions
*   [Price Filters API Reference](https://docs.omnium.no/docs/Prices/priceFilterApiReference) - Control which products are eligible based on their price type (discounted, member prices)

## Automatic Promotion Application

Promotions are automatically applied to carts and orders when processed by Omnium. The system evaluates all active promotions that match the current market, store, and order context, and applies the relevant discounts before recalculating totals.

### Cart Promotion Control

Carts can be excluded from promotion evaluation by setting `IgnorePromotions = true`.

## Promotion Priority System

Promotions use a two-level priority system:

### 1\. Service Type Priority (Primary)

Promotions are processed in order by promotion service type:

1.  Order line promotions (product-level discounts)
2.  Shipping promotions
3.  Order-level promotions

### 2\. Promotion Priority (Secondary)

Within each service type, promotions are sorted by:

1.  **Priority value** (ascending — lower numbers = higher priority)
2.  **Reward percentage** (descending — higher discounts first)

**Tip:** Don’t use priorities like 1, 2, 3. Use 100, 200, 300. It makes it easier to insert new campaigns later without editing existing ones.

## Promotion Combination Logic

### Combination Rules

Promotions can be combined based on the `CanBeCombinedWithOtherPromotions` property:

*   **`true`** – Can combine with other promotions
*   **`false`** – Cannot combine (mutually exclusive)

### Additional Combination Controls

*   **`AlwaysApply`** – Forces promotion application regardless of combination rules
*   **`DisallowCombinationWithCouponDiscounts`** – Prevents combination with coupon-based discounts. Engine/UI-only — configured through the Omnium UI and is not a field on the public promotion endpoints.
*   **`CanNotBeCombinedWithTags`** – List of promotion tags that prevent combination (see [Tags](Promotions.md#tags) below). Engine/UI-only — configured through the Omnium UI and is not a field on the public promotion endpoints.

### Combination Evaluation

The system evaluates combination rules during promotion processing, filtering out conflicting promotions before final application.

## Market and Store Filtering

### Market Filtering

Promotions must specify target markets in the `markets` property. They will only apply to orders from those markets.

### Store Filtering

Store filtering has two modes, controlled by `filterOnWarehouseStores`:

#### Standard Store Filtering (`filterOnWarehouseStores = false`)

*   Promotion applies if the order’s store ID is in the promotion’s `stores` list
*   `storeGroups` targets the stores that belong to the listed store groups
*   `excludedStores` and `excludedStoreGroups` keep the promotion out of specific stores or store groups
*   Used for store-specific promotions

#### Warehouse Store Filtering (`filterOnWarehouseStores = true`)

*   Filters order lines by matching warehouse codes in shipments
*   Used for promotions targeting specific fulfillment locations

**Store Filtering Logic:**

*   If no stores are specified, the promotion applies to all stores
*   Exclusions are checked first: a store listed in `excludedStores`, or belonging to a group in `excludedStoreGroups`, never gets the promotion, even if it is also included
*   If `filterOnWarehouseStores` is false, checks the order’s store ID against the promotion’s store list
*   If `filterOnWarehouseStores` is true, filtering happens at shipment level

## Order Type Filtering

Promotions can be restricted to specific order types using the `orderTypes` property.

**Order Type Filtering:**

*   If no order types are specified, the promotion applies to all order types (the most common setup)
*   If order types are specified, it only applies to matching orders

**Important:** Promotions with `orderTypes` specified do **not** generate product prices automatically, as they depend on order context. These prices won’t appear in PLPs or product pages but will be applied once items are added to the cart.

## Price Generation

### Automatic Price Generation

Some promotion types automatically generate product prices so they can be displayed in product list pages (PLP) or product detail pages (PDP).
These prices are stored on the products themselves, or in the separate price index if _separate prices_ is enabled, allowing them to be fetched and displayed like regular prices.

Other promotion types, such as multi-buy or order-level promotions, are only evaluated when items are added to a cart. Their value depends on the full order context, for example, a "3 for 2" offer can’t produce a single discounted price until all three items are in the cart.

A promotion will generate product prices when:

1.  The promotion type supports price generation
2.  `isBonusPointsReward` is false
3.  `orderTypes` is not set
4.  No coupon code is required

### Promotion Types and Price Generation

| Promotion Type | Generates Prices |
| --- | --- |
| Shipping Promotions (0) | No |
| Category/Brand Promotions (1) | Yes |
| Multi-Buy Promotions (2) | No |
| Order Amount Promotions (3) | No |
| Kit Promotions (4) | No |
| Product Search Promotions (5) | Yes |
| Price List Promotions (6) | Yes |
| Cost Price Promotions | Yes |

### Generated Prices and Store Filters

For category/brand and product search promotions, the store filters decide how the generated prices are scoped:

*   With `stores` or `storeGroups` set, one price is generated per targeted store (excluded stores are left out), each with `storeId` set to that store.
*   With only `excludedStores` or `excludedStoreGroups` set, a single price without `storeId` is generated. The exclusion is not encoded in the price. Omnium applies it when the cart is calculated, so an excluded store falls back to the regular price.

**Important:** If you read generated prices directly, for example to render list prices in a storefront, a price without `storeId` does not tell you which stores it applies to. Use the price’s `promotionId` to fetch the promotion and apply its `excludedStores` and `excludedStoreGroups` before showing the price for a store.

## Price Filters

Price filters allow you to control which products are eligible for a promotion based on their price type. This is useful when you want to prevent promotions from stacking on top of already-discounted or member-specific prices, or conversely, when you want a promotion to apply only to products that are already on sale or have member pricing.

### How It Works

Price filtering is controlled by three properties on the promotion:

| Property | Type | Description |
| --- | --- | --- |
| `priceFilterMode` | string | Controls the filtering behavior: `None` (default), `Exclude`, or `Include` |
| `priceTypeFilter` | string | Which price types to filter on: `Discounted`, `MemberPrice`, or both (`Discounted, MemberPrice`) |
| `useDiscountedPriceAsBase` | bool | When `true`, calculates the discount from the already-discounted price instead of the original price |

### Price Filter Mode

*   **`None`** (default) — No filtering. All products are eligible regardless of their price type.
*   **`Exclude`** — Products matching the selected price types are removed from the promotion.
*   **`Include`** — Only products matching the selected price types are eligible for the promotion.

### Price Types

The `priceTypeFilter` property uses a flags-based system:

*   **`Discounted`** — Regular sale/discounted prices where the product has a discount amount and is not a customer club specific price.
*   **`MemberPrice`** — Customer club specific prices (member prices).
*   **`Discounted, MemberPrice`** — Both types (combined).

**Classification priority:** Member prices always take priority. A price marked as a customer club specific price is always classified as `MemberPrice`, regardless of whether it also has a discount amount.

### Use Discounted Price as Base

When `useDiscountedPriceAsBase` is set to `true`, the promotion calculates its discount from the already-discounted price instead of the original price. This is only relevant when the promotion allows discounted products (i.e., when discounted prices are not excluded).

**Example:** A product has an original price of $100 and a sale price of $80. With a 10% promotion:

*   **`useDiscountedPriceAsBase: false`** (default) — 10% off $100 = $10 discount
*   **`useDiscountedPriceAsBase: true`** — 10% off $80 = $8 discount

### Where Price Filters Apply

Price filters apply in two contexts:

1.  **Price generation** — When the promotion generates product prices for display in product listings and detail pages, the filter determines which existing prices are eligible for promotional pricing.
2.  **Cart/order evaluation** — When the promotion is evaluated at checkout, the filter determines which order lines are eligible for the discount based on the product's prices.

### Common Use Cases

| Scenario | Configuration |
| --- | --- |
| Never discount already-discounted products | `priceFilterMode: "Exclude"`, `priceTypeFilter: "Discounted"` |
| Never discount member prices | `priceFilterMode: "Exclude"`, `priceTypeFilter: "MemberPrice"` |
| Only discount products that are already on sale | `priceFilterMode: "Include"`, `priceTypeFilter: "Discounted"` |
| Exclude both discounted and member prices | `priceFilterMode: "Exclude"`, `priceTypeFilter: "Discounted, MemberPrice"` |
| Apply discount on top of sale price (stacking) | `priceFilterMode: "None"`, `useDiscountedPriceAsBase: true` |

For full API documentation including request/response examples, see the [Price Filters API Reference](https://docs.omnium.no/docs/Prices/priceFilterApiReference).

## Coupon Management

### Coupon Types

1.  **Primary Coupon** – Single coupon code for the promotion
2.  **Additional Coupons** – Multiple coupon codes for the same promotion
3.  **Personal Coupons** – Customer-specific coupons assigned to individual customers

### Coupon Usage Tracking

Coupon usage is tracked, and single-use coupons cannot be redeemed more than once. Attempts to reuse a redeemed coupon will result in an error.

### External Coupon Providers

The system supports integration with external coupon validation systems for loyalty programs and third-party discount providers.

## Tags

Tags are string labels you attach to promotions for two purposes: **filtering/organization** and **combination control**.

### What tags are

Each promotion has a `tags` field — a list of free-text strings (e.g. `"BlackFriday"`, `"Summer2026"`). When a promotion fires and generates a discount, those tags are automatically copied onto the resulting discount. This means tags travel with the discount through the rest of the promotion evaluation pipeline and can be inspected by subsequent promotions.

### Configuring available tags

The tags UI is only visible when `promotionManagement.tagSettings` is configured in the tenant settings. Each entry has:

| Field | Description |
| --- | --- |
| `name` | The tag value stored on the promotion |
| `translationKey` | The display label shown in the UI |
| `color` | Optional color used when rendering the tag chip in the UI |

Without this configuration, the tag fields do not appear in the promotion editor.

### Using tags

#### Filtering promotions

Tag-based filtering of promotions is available through the Omnium UI and internal tooling. The public promotion search endpoint (`POST /api/Promotions/Search`) does not currently accept a `tags` parameter — its filters are limited to date ranges, market IDs, and promotion types.

#### Preventing combination with other promotions

Each promotion also has a `canNotBeCombinedWithTags` field, configured through the Omnium UI (it is not a field on the public promotion endpoints). Before a promotion is applied to an order line, the engine checks whether any discount already applied to that order line has a tag that intersects with `canNotBeCombinedWithTags`. If there is a match, the promotion is skipped.

This decouples stacking rules from direct promotion-to-promotion references. Promotions only need to declare which tag groups they conflict with, not which specific promotions.

**Example:**

*   Promotion A has `tags: ["VIP"]`
*   Promotion B has `canNotBeCombinedWithTags: ["VIP"]`

If Promotion A fires first, Promotion B will not apply to the same order line — even if `canBeCombinedWithOtherPromotions` would otherwise allow it.

### API fields

| Field | Type | Max items | Description |
| --- | --- | --- | --- |
| `tags` | `string[]` | 250 | Tags applied to this promotion |

The `tags` field is available on the `GET`, `POST`, and `PATCH` promotion endpoints. The `canNotBeCombinedWithTags` field is engine/UI-only and is configured through the Omnium UI — it is not exposed on the public promotion endpoints.

* * *

## Campaigns

A promotion can belong to one [campaign](Campaigns.md), which groups promotions for planning and follow-up. Set the campaign with `campaignId` on the `POST` and `PATCH` promotion endpoints; `GET` returns it.

| Field | Type | Description |
| --- | --- | --- |
| `campaignId` | `string` | Id of an existing campaign. Left out (`null`), the promotion stays in the campaign it is in; an empty string takes it out of its campaign. |

Linking a promotion recalculates the dates of the campaign it joins and of the campaign it leaves, as linking it on the campaign page does. An unknown campaign answers `400 Bad Request` and the promotion is not saved. A `PATCH` that changes nothing but `campaignId` moves the promotion without saving it again, so its prices are not rebuilt. See [Campaign Promotions](Campaigns/campaign-promotions.md#linking-through-the-api).

* * *

## Best Practices

### 1\. Promotion Design

*   Use clear and consistent priority values
*   Consider combination rules when creating campaigns
*   Test with different order types if you use order-type restrictions
*   Validate market and store targeting before deployment

### 2\. Testing

*   Test combinations well before major campaigns like Black Friday
*   Verify market and store filtering with realistic order data
*   Use realistic data volumes during testing
*   Validate price generation for promotion types that support it
