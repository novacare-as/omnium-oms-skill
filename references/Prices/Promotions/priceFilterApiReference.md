# Price Filters

Source: https://docs.omnium.no/docs/Prices/Promotions/priceFilterApiReference

> API reference for configuring price filters on promotions to control which products are eligible based on their price type.

# Price Filters API Reference

## Table of Contents

1.  [Overview](priceFilterApiReference.md#overview)
2.  [API Properties](priceFilterApiReference.md#api-properties)
3.  [Price Filter Mode](priceFilterApiReference.md#price-filter-mode)
4.  [Price Type Filter](priceFilterApiReference.md#price-type-filter)
5.  [Use Discounted Price as Base](priceFilterApiReference.md#use-discounted-price-as-base)
6.  [API Examples](priceFilterApiReference.md#api-examples)
7.  [Best Practices](priceFilterApiReference.md#best-practices)
8.  [Troubleshooting](priceFilterApiReference.md#troubleshooting)

* * *

## Overview

Price filters let you control which products are eligible for a promotion based on their price type. By default, promotions apply to all products regardless of whether they already have a discounted or member-specific price. Price filters allow you to:

*   **Exclude** products that already have discounted or member prices from the promotion
*   **Include only** products that have discounted or member prices
*   **Calculate discounts from the sale price** instead of the original price when stacking promotions

Price filter properties are available on all promotion types. They are set at the promotion level (not inside `promotionData`).

* * *

## API Properties

Price filters are configured using three properties on the promotion request:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `priceFilterMode` | string | `"None"` | Controls the filtering behavior: `"None"`, `"Exclude"`, or `"Include"` |
| `priceTypeFilter` | string | `"None"` | Which price types to filter: `"None"`, `"Discounted"`, `"MemberPrice"`, or `"Discounted, MemberPrice"` |
| `useDiscountedPriceAsBase` | bool | `false` | When `true`, calculates the discount from the discounted price instead of the original price |

These properties are available on:

*   **`OmniumPromotionRequest`** (POST) — for creating promotions
*   **`OmniumPromotionPatch`** (PATCH) — for updating promotions (`useDiscountedPriceAsBase` is nullable `bool?` for patch semantics)
*   **`OmniumPromotion`** (GET response) — returned when reading promotions

* * *

## Price Filter Mode

The `priceFilterMode` property controls how the promotion filters products based on their price type.

| Value | Description |
| --- | --- |
| `"None"` | No filtering. All products are eligible regardless of price type. This is the default. |
| `"Exclude"` | Products with prices matching the selected `priceTypeFilter` are excluded from the promotion. |
| `"Include"` | Only products with prices matching the selected `priceTypeFilter` are eligible for the promotion. |

**Note:** `priceFilterMode` has no effect if `priceTypeFilter` is `"None"`, and vice versa. Both must be set for filtering to take effect.

* * *

## Price Type Filter

The `priceTypeFilter` property specifies which price types to filter on. It is a flags-based value, meaning multiple types can be combined.

| Value | Description |
| --- | --- |
| `"None"` | No price types selected. No filtering is applied. |
| `"Discounted"` | Regular discounted prices — products where the price has a discount amount greater than zero and is not a customer club specific price. |
| `"MemberPrice"` | Customer club / member-specific prices — products where the price is marked as a customer club specific price. |
| `"Discounted, MemberPrice"` | Both discounted and member prices. |

### Price Classification Priority

When classifying a product's price, the **member price flag always takes priority**:

*   If a price is marked as a customer club specific price (`IsCustomerClubSpecificPrice = true`), it is always classified as `MemberPrice`, even if it also has a discount amount.
*   A price is classified as `Discounted` only when it has a discount amount greater than zero AND is not a customer club specific price.

* * *

## Use Discounted Price as Base

The `useDiscountedPriceAsBase` property controls which price is used as the base for calculating the promotion discount.

| Value | Behavior |
| --- | --- |
| `false` (default) | The discount is calculated from the product's **original price**. |
| `true` | The discount is calculated from the product's **already-discounted price** (sale price). |

This property is only meaningful when the promotion allows discounted products — it has no effect if discounted prices are excluded via `priceFilterMode: "Exclude"` with `priceTypeFilter: "Discounted"`. In the Omnium UI, the toggle is hidden in this case.

### Calculation Example

A product has an original price of **$200** and a sale price of **$150** (discount amount of $50). The promotion offers a **20% discount**.

| Setting | Base Price | Discount | Final Price |
| --- | --- | --- | --- |
| `useDiscountedPriceAsBase: false` | $200 | 20% of $200 = $40 | $160 |
| `useDiscountedPriceAsBase: true` | $150 | 20% of $150 = $30 | $120 |

* * *

## API Examples

### Example 1: Exclude Already-Discounted Products

Prevent a promotion from applying to products that are already on sale.

```json
{
  "name": "Spring Collection - 15% Off",
  "title": "15% Off Spring Collection",
  "activeFrom": "2026-03-01T00:00:00Z",
  "activeTo": "2026-05-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 100,
  "priceFilterMode": "Exclude",
  "priceTypeFilter": "Discounted",
  "promotionData": {
    "promotionType": 1,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "spring-collection",
          "categoryName": "Spring Collection"
        }
      ]
    },
    "reward": {
      "percentage": 15.0,
      "usePercentage": true
    }
  }
}
```

### Example 2: Exclude Both Discounted and Member Prices

Ensure a promotion only applies to products at their full original price.

```json
{
  "name": "Full Price Only - 10% Off",
  "title": "10% Off Full Price Items",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 200,
  "priceFilterMode": "Exclude",
  "priceTypeFilter": "Discounted, MemberPrice",
  "promotionData": {
    "promotionType": 5,
    "productSearchFilter": {
      "tags": ["new-arrival"]
    },
    "reward": {
      "percentage": 10.0,
      "usePercentage": true
    }
  }
}
```

### Example 3: Only Apply to Sale Items

Create a promotion that only applies to products already on sale — for example, an additional discount during a clearance event.

```json
{
  "name": "Extra 20% Off Sale Items",
  "title": "Extra 20% Off All Sale Items",
  "activeFrom": "2026-06-01T00:00:00Z",
  "activeTo": "2026-06-15T23:59:59Z",
  "markets": ["NOR"],
  "priority": 100,
  "priceFilterMode": "Include",
  "priceTypeFilter": "Discounted",
  "useDiscountedPriceAsBase": true,
  "promotionData": {
    "promotionType": 1,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "all",
          "categoryName": "All Products"
        }
      ]
    },
    "reward": {
      "percentage": 20.0,
      "usePercentage": true
    }
  }
}
```

**Note:** `useDiscountedPriceAsBase` is set to `true` so the 20% discount is calculated from the sale price, not the original price.

### Example 4: Member-Only Promotion Excluding Member Prices

Apply a promotion for customer club members, but exclude products that already have a member-specific price.

```json
{
  "name": "Member Exclusive - 10% Off",
  "title": "Club Member Exclusive: 10% Off",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 150,
  "customerClubMembersOnly": true,
  "priceFilterMode": "Exclude",
  "priceTypeFilter": "MemberPrice",
  "promotionData": {
    "promotionType": 1,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "clothing",
          "categoryName": "Clothing"
        }
      ]
    },
    "reward": {
      "percentage": 10.0,
      "usePercentage": true
    }
  }
}
```

### Example 5: MultiBuy with Price Filters

Prevent a "Buy 2, Get 1 Free" promotion from applying to products that are already discounted.

```json
{
  "name": "Buy 2 Get 1 Free - Full Price Only",
  "title": "Buy 2, Get 1 Free!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 100,
  "priceFilterMode": "Exclude",
  "priceTypeFilter": "Discounted",
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "shoes",
          "categoryName": "Shoes"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 100.0,
      "usePercentage": true
    }
  }
}
```

### Example 6: Updating Price Filters via PATCH

Update an existing promotion to add price filters:

```
PATCH /api/promotions

{
  "id": "6b104835-c95c-4562-9b42-fba2e438eeec",
  "priceFilterMode": "Exclude",
  "priceTypeFilter": "Discounted",
  "useDiscountedPriceAsBase": false
}
```

To remove price filters from an existing promotion:

```
PATCH /api/promotions

{
  "id": "6b104835-c95c-4562-9b42-fba2e438eeec",
  "priceFilterMode": "None",
  "priceTypeFilter": "None"
}
```

* * *

## Best Practices

### 1\. Match Filter Mode and Type Filter

Both `priceFilterMode` and `priceTypeFilter` must be set to non-`None` values for filtering to take effect. Setting one without the other has no effect.

### 2\. Use Exclude for Preventing Double Discounts

The most common use case is excluding already-discounted products to prevent "double discounting":

```json
{
  "priceFilterMode": "Exclude",
  "priceTypeFilter": "Discounted"
}
```

### 3\. Set UseDiscountedPriceAsBase Intentionally

When allowing a promotion to apply to discounted products, decide explicitly whether the discount should be calculated from the original or sale price. Not setting `useDiscountedPriceAsBase` defaults to calculating from the original price, which may give a larger discount than intended.

### 4\. Test with Representative Product Data

Price filters depend on correct price classification. Ensure your test products have:

*   Products with regular prices (no discount)
*   Products with discounted prices (sale prices)
*   Products with member/customer club specific prices
*   Products with both discount amount and member flag (to verify classification priority)

### 5\. Consider Impact on Price Generation

Price filters affect which product prices are generated and displayed. When using `Exclude` mode, products with excluded price types will not receive promotional prices, meaning the sale or member price will still be displayed but without the additional promotion discount.

* * *

## Troubleshooting

### Price Filters Not Taking Effect

**Check:**

1.  Both `priceFilterMode` and `priceTypeFilter` are set to non-`None` values — both are required.
2.  The product actually has the price type you're filtering on (e.g., the product must have a discounted price for `Discounted` filtering to have an effect).
3.  The string values are correctly cased: `"Exclude"`, `"Include"`, `"Discounted"`, `"MemberPrice"`.

### Products Unexpectedly Excluded

**Check:**

1.  Verify the price classification of the product's prices. A price with `IsCustomerClubSpecificPrice = true` is always classified as `MemberPrice`, even if it also has a discount amount.
2.  When using `priceTypeFilter: "Discounted, MemberPrice"` with `Exclude` mode, both discounted and member prices are excluded — the product must have a non-discounted, non-member price to be eligible.

### UseDiscountedPriceAsBase Not Working

**Check:**

1.  Verify the product actually has a discounted price (a price where the sale price differs from the original price).
2.  Ensure `priceFilterMode` is not set to `Exclude` with `priceTypeFilter: "Discounted"` — if discounted prices are excluded, `useDiscountedPriceAsBase` has no products to apply to.
3.  For MultiBuy promotions, verify the discount type (percentage vs. fixed amount) — `useDiscountedPriceAsBase` affects the base price used in the calculation for both types.

### Discount Amount Is Larger Than Expected

If a promotion applies a larger discount than expected on sale items, check whether `useDiscountedPriceAsBase` should be set to `true`. By default (`false`), percentage discounts are calculated from the original price, which can result in a discount larger than the current sale price.

* * *

**Document Version**: 1.0 **Last Updated**: 2026 **API Version**: Compatible with Omnium OMS .NET 10.0+
