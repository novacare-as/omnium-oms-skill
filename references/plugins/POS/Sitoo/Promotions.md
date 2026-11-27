# Promotions

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/Promotions

> Configure promotions once for use in both Sitoo and Omnium, reducing the need to manage settings in two places.

## Introduction

Syncing campaigns between two systems with different campaign models can be challenging, especially when expecting identical behavior in both systems. To ensure consistency and reliability, certain limitations must be applied to the types of campaigns that can be synchronized.

This guide explains how to configure promotions in **Omnium** for seamless use in both Omnium and **Sitoo**, with **Omnium acting as the master system**.

Sitoo uses **predefined campaign types** with strict rules and fixed value options, whereas Omnium supports a **more flexible and open-ended campaign structure**. Because of these differences, the integration uses Sitoo’s campaign types as a baseline. This documentation outlines how promotions set up in Omnium are interpreted in Sitoo, along with the mappings and limitations required to ensure compatibility.

In Omnium, a single promotion can be linked to multiple markets. Since each market corresponds to a Sitoo environment, the promotion will be exported to all relevant Sitoo environments based on the market configuration in Omnium.

## Controlling Which Products a Promotion Applies To

In many cases, promotions should only apply to a specific selection of products — for example, a particular category, brand, or set of individual items. While both Omnium and Sitoo support filtering, they handle it differently, and their models don’t align perfectly. This section explains how filtering works across both systems and what’s required to enable proper syncing.

### Filtering in Omnium

In Omnium, you can restrict a promotion by:

1.  **Product** – Specific product IDs
2.  **Category** – Including match in the products category tree
3.  **Brand**
4.  **Season**

### Filtering in Sitoo

Sitoo has two main ways of restricting campaigns:

1.  **Product IDs** – Simple filtering for including exact product matches.
2.  **Custom Attributes** – Advanced filtering using predefined fields (e.g., category, brand), where each product must have a specific attribute value assigned. A custom attribute can only be a single text or number, not a list.

### Valid filtering across the systems

The available filtering in the integration will be determined by the intersection of what is supported in both Omnium and Sitoo.

| **Feature** | **Supported in Omnium** | **Supported in Sitoo** | **Supported in integration** | **Comments** |
| --- | --- | --- | --- | --- |
| Product ID filtering | Yes | Yes | Yes | Works out of the box in both systems. |
| Category filtering | Yes, category tree match | Yes, single category match | No | Since the category match works differently, it can not be used across the systems. Sitoo only matches exact attribute values, while Omnium matches element i tree structure. |
| Brand and Season filtering | Yes | Only via custom attribute | Yes | Requires attribute setup and full product data mapping. |
| Filtering by other properties | No | Yes | No | Sitoo can set up match on any property, if added as custom attribute to the product. |

This means that to support season or brand-based filtering, the integration must map these values into Sitoo as product-level **custom attributes**.

## Configuration

To enable promotion synchronization, add the **IPromotionExporter** to the connector configuration. Include it in the global connector if it should apply to all markets, or add it to a market-specific connector if it should only apply to a particular market.

```
"connectors": [
        {
            ...,
            "implementations": [
                "IOrderExporter",
                "IPromotionExporter"
            ],
            ...
```

Important: Omnium generates prices for some promotion types. To avoid the discount to be applied twice in Sitoo, we have to ignore promotion prices when updating prices in Sitoo.

```json
        {
            "key": "IgnorePromotionPricesInProductSync",
            "value": "true"
        }
```

### Enabling Custom Attribute Sync from Omnium

To filter promotions in Sitoo based on brand, season or excluded products, you must enable the use of custom attributes in the product export from Omnium.

#### Step 1: Enable Sitoo Custom Attribute Mapping in Omnium

Update the `tenantSettings` in the Sitoo connector configuration to enable custom attribute export:

```json
    {
      "key": "EnableCustomAttributes",
      "value": "true"
    }
```

#### Step 2: Define Attributes in Sitoo

The custom attributes needed for the promotion filtering has to have a specific key:

| **Filter type** | **Custom attribute Key** |
| --- | --- |
| Brand | `oms-promotion-brand` |
| Season | `oms-promotion-season` |
| Exclude products | `oms-promotion-productId` |

1.  Navigate to **Settings > Attributes** in Sitoo.
2.  Create a new attribute with Key equal to one of the given keys above, and type equal `text`.

#### Step 3: Ensure Products in Sitoo Have Attribute Values

After the attribute definitions are added in Sitoo, make sure all products are exported again. The attribute field has to be populated with data from Omnium.

#### Step 4: Setup Promotion Filtering in Omnium

Once custom attribute mapping is enabled and in place, you can create promotions in Omnium with filters on `product`, `season` or `brand`. These will then be translated into Sitoo’s attribute-based filtering during sync.

* * *

## Promotion combination rules

In Sitoo, Order promotion types can always be combined, both with each other and with other promotion types. Therefore, Order promotions in Omnium has to have `AlwaysApply = true`. In both systems, order promotions will be applied after all other promotions.

Product campaigns can never be combined in Sitoo.

* * *

## General Field Mapping: Omnium → Sitoo

The following table lists general promotion properties and how they are translated between Omnium and Sitoo. Some fields map directly, while others require additional context or have limited support due to differences in system behavior.

| **Sitoo Property** | **Omnium Property / Notes** |
| --- | --- |
| `ActivePos` | Always set to `true` during export. |
| `VoucherName` | `promotion.Name` |
| `DateStart` | `promotion.ActiveFrom` |
| `DateEnd` | `promotion.ActiveTo` |
| `Priority` (range 1–5) | `promotion.Priority` No limit in Omnium, but must be restricted to Sitoo's 1–5 scale. |
| `MaxUses` | Only supported for MultiBuy type in Omnium. |
| `Tags` | `promotion.Stores` (used to determine applicable Sitoo sites) |
| `VoucherPassword` | `promotion.CouponCode` |
| `use_discounted_price` (boolean) – if `true`, calculation applies on top of existing price list discounts (only for vouchers with group type `Product`). | Partially mapped to `CanBeCombined` in Omnium – not an exact one-to-one match. |
| `InternalNode` | Not supported in Omnium |

## Mapping of the different promotion types

### Order Amount Discounts - Cart Campaigns

_These discounts apply to the entire order total, regardless of individual products._

Mapping restrictions:

| Features | Sitoo | Omnium |
| --- | --- | --- |
| Voucher Password (Discount Code) | Required for cart campaigns | CouponCode must be set |
| Combination | Always combinable | Have to set AlwaysApply to TRUE |
| Validity Filter | Can exclude products by attribute value | Validity filtering is not supported for Order discounts. |
| Customer groups | Not supported | Supported |
| Tags | No field | Supported |
| Priority | This promotion type is always applied after product campaigns | Calculated after Category&Brand and Mix&Match |

#### OrderDiscountM

_Fixed money discount proportionally distributed across all items._

Used when you want to subtract a specific amount from the order total, with the discount shared among all items in the cart.

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Reward | M | reward.PromotionAmounts (one for each market) |

#### Not Supported

OrderDiscountX

_Percentage discount applied to the entire order._

Reduces the order total by a given percentage, affecting all items equally.

OrderBuyForMGetDiscountN

_Spend a minimum amount (M), get a fixed discount (N)._

Common for “Spend $100, get $10 off” type promotions.

* * *

### Category/Brand Discounts

_Discounts targeting specific products based on filters_

The product type promotions in Sitoo is split between two types in Omnium, Category/Brand promotions and Mix&Match/MultiBuy promotions.

Mapping for this type:

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Voucher Password | Not required | CouponCode optional |
| Combination | Can not be combined with other product promotions, but always combines with order promotions | Have to set CanBeCombined = FALSE, and AlwaysApply = FALSE |
| Filter | Product or custom attributes | Product, category, brand, season (via custom attributes) |
| Customer groups | Not supported | Supported |
| Tags | Not available | Supported |
| Max Uses | Yes | No |

#### ProductDiscountM

**Fixed amount off per product in the target category/brand.**
Use when you want to reduce the price of selected products by a fixed sum, such as "$5 off each T-shirt".

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Type | 200 ProductDiscountM | CategoryOrBrand promotion |
| Discount | Fixed amount M | promotionData.Reward.PromotionAmounts.SingleOrDefault(...) |

#### ProductDiscountX

**Percentage discount on each product in the category or brand.**
Common for “20% off all shoes” or similar.

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Type | 210 ProductDiscountX | CategoryOrBrand promotion |
| Reward | Percentage X | promotionData.Reward.Percentage.Round() |

* * *

### Multibuy and Mix&Match Discounts

_Promotions based on buying multiple items with special pricing or discounts._

Product promotions involving combination of products is mapped to the type Multibuy/Mix&Match in Omnium. This type uses the same type of filtering, and prioritation. The difference is the extended functionality involving combination of products.

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Voucher Password | Not required | CouponCode optional |
| Combination | Can not be combined with other product promotions, but always combines with order promotions | Have to set CanBeCombined = FALSE, and AlwaysApply = FALSE |
| Filter | Product or custom attributes | Product, category, brand, season (via custom attributes) |
| Customer groups | Not supported | Supported |
| Tags | Not available | Supported |
| Max Uses | Yes | Yes, can be found under Advanced |

#### ProductBuyXForPriceM

**Buy X units for a fixed price M.**
For example, “3 socks for $10”, where you buy a specific quantity for a fixed price.

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Type | 210 ProductDiscountX | Multi-buy/Mix&Match, Fixed price |
| X | Required buy amount | promotionData.PromotionMultiBuyReward.RequiredBuyAmount |
| M | Fixed price M | promotionData.PromotionMultiBuyReward.Reward.Amount |

#### ProductBuyXPayForY

**Buy X items, pay only for Y items.**
For example, “Buy 3, pay for 2” deals where the cheapest item is free.

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Type | 220 ProductBuyXPayForY | Multi-buy/Mix&Match |
| X | Required buy amount | promotionData.PromotionMultiBuyReward.RequiredBuyAmount |
| Y | Pay amount | promotionData.PromotionMultiBuyReward.Reward.Amount |

#### ProductBuyXPayForYDiscountZRest

**Buy X, pay for Y, get remaining items at Z% discount.**
An extension of “Buy X pay for Y” with a discount on the leftover items, e.g., “Buy 3, pay for 2, get the 3rd at 50% off.”

The input fields for this discount is a little bit different in Omnium and Sitoo:

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Type | 240 ProductBuyXPayForYDiscountZRest | Multi-buy/Mix&Match |
| X | Total number of items | RequiredBuyAmount + NumberOfDiscountedItems |
| Y | Number paid full price | RequiredBuyAmount |
| Z | % discount on remaining items | Reward.percentage |

#### ProductBuyMinXDiscountY

**Buy a minimum quantity X, get Y% discount on all items.**
Use when you want to reward bulk purchases, e.g., “Buy 5 or more, get 10% off all.”

Note: To be able to discount all items in Omnium, the key is to set NumberOfDiscountedItems to 0.

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Type | 250 ProductBuyMinXDiscountY | Multi-buy/Mix&Match |
| X | Min number of items | RequiredBuyAmount |
| Number discounted items | Set to 0 to discount all | NumberOfDiscountedItems = 0 |
| Y | % discount on all items | Reward.percentage |

#### ProductBuyXGetDiscountList

**Buy X items, get discounts on a list of target products.**
Useful for cross-sell offers like “Buy any 2 shirts, get 20% off on belts.”

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Type | 260 ProductBuyXGetDiscountList | Multi-buy/Mix&Match |
| X | Min number of items | RequiredBuyAmount |
| Number discounted items | Set to 0 to discount all | NumberOfDiscountedItems = 0 |

#### Not supported

ProductBuyForMGetDiscountList

_Spend M, get discounts on target products._

Spend a certain amount, get discounts on specific products.

ProductBuy3For2Or2For1AndAHalf

_Buy 3 pay for 2, or buy 2 pay 1.5 times price._

No dedicated Omnium campaign; can be configured as multiple Buy X Pay for Y promotions.

* * *

### Price List Activation

A **PriceList promotion** in Omnium links a promotion to a price list. When synced to Sitoo, it creates a voucher that activates the linked Sitoo price list at the POS — either alongside other promotions, or exclusively.

| Feature | Sitoo | Omnium |
| --- | --- | --- |
| Voucher Password | Optional | `CouponCode` on the promotion |
| Combination | Controlled by voucher type | Controlled by **Allow Promotions** on the price list |
| Date range | `DateStart` / `DateEnd` | `ActiveFrom` / `ActiveTo` on the promotion |
| Tags | `Tags` | `Stores` on the promotion |

The voucher type sent to Sitoo depends on the **Allow Promotions** setting on the linked price list:

| Allow Promotions | Sitoo type | Behavior at POS |
| --- | --- | --- |
| On | `PricelistActivate` (400) | Price list activates; other promotions can still apply |
| Off | `PricelistActivateFinal` (410) | Price list activates exclusively; other vouchers are blocked |

#### Setup

1.  Create a price list in Omnium with the desired prices.
2.  Create a **PriceList promotion** in Omnium and link it to the price list.
3.  Set `ActiveFrom`, `ActiveTo`, and optionally a `CouponCode` on the promotion.
4.  The promotion will be exported to Sitoo as a voucher. If the price list was already synced to Sitoo before the promotion was created, the existing Sitoo voucher is reused.

> **Note:** A PriceList promotion is not exported to Sitoo until it is linked to a price list. Creating the promotion without a price list link has no effect in Sitoo.

See the [Prices page](Prices.md#promotion-linked-price-lists) for details on how the price list side is configured.
