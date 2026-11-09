# Tiered Pricing

Source: https://docs.omnium.no/docs/Prices/Promotions/tieredPricingApiReference

> API reference for creating and managing Tiered Pricing promotions in Omnium OMS.

# Tiered Pricing API Reference

## Table of Contents

1.  [Overview](tieredPricingApiReference.md#overview)
2.  [How It Works](tieredPricingApiReference.md#how-it-works)
3.  [API Endpoints](tieredPricingApiReference.md#api-endpoints)
4.  [Data Models](tieredPricingApiReference.md#data-models)
5.  [Creating Tiered Pricing Promotions](tieredPricingApiReference.md#creating-tiered-pricing-promotions)
6.  [Examples](tieredPricingApiReference.md#examples)
7.  [Advanced Features](tieredPricingApiReference.md#advanced-features)
8.  [Best Practices](tieredPricingApiReference.md#best-practices)
9.  [Troubleshooting](tieredPricingApiReference.md#troubleshooting)

* * *

## Overview

Tiered Pricing promotions allow you to create quantity-based pricing tiers where customers get better deals as they purchase more items. This is different from standard MultiBuy promotions as it offers multiple progressive discount tiers.

### Common Use Cases

*   **Progressive pricing**: "2 for 499 NOK, 3 for 649 NOK, 4 for 799 NOK"
*   **Volume discounts**: "Buy 2 get 10% off, buy 4 get 20% off, buy 6 get 30% off"
*   **Bundle pricing**: "2 items for $50 each, 3 items for $45 each, 5 items for $40 each"

### Key Differences from Standard MultiBuy

| Feature | Standard MultiBuy | Tiered Pricing |
| --- | --- | --- |
| Discount Structure | Single tier (e.g., "Buy 2, get 1 at 50% off") | Multiple tiers (e.g., "2 for 499, 3 for 649, 4 for 799") |
| Discount Application | Fixed discount on specific items | Progressive pricing based on quantity thresholds |
| Tier Selection | N/A | Automatically applies highest qualifying tier using greedy algorithm |
| Use Case | Simple BOGO offers | Volume-based pricing strategies |

### Supported Discount Types

*   **Fixed Price** - Set a fixed total price for each tier (e.g., "2 for 499", "3 for 649")
*   **Percentage** - Apply percentage discounts per tier (e.g., "2 items: 10% off", "4 items: 20% off")
*   **Fixed Amount** - Discount by fixed amount per tier (e.g., "2 items: $5 off each", "4 items: $10 off each")

* * *

## How It Works

### Tier Selection Algorithm

Tiered pricing uses a **greedy algorithm** to maximize customer savings:

1.  Calculates total quantity of qualifying products in cart
2.  Sorts available tiers by quantity (descending)
3.  Applies the highest qualifying tier first
4.  Repeats with remaining items until no more tiers qualify

#### Example

**Promotion**: "2 for 499 NOK, 3 for 649 NOK, 4 for 799 NOK" **Cart**: 7 qualifying items

**Algorithm Steps**:

1.  7 items qualify for "4 for 799" tier → Applied (3 items remaining)
2.  3 items qualify for "3 for 649" tier → Applied (0 items remaining)
3.  Result: Customer pays 799 + 649 = 1,448 NOK for 7 items

### Discount Distribution

*   **Fixed Price Mode**: Discount is distributed proportionally across all items in the tier based on their original prices
*   **Percentage Mode**: Each tier's percentage is applied to items within that tier group
*   **Amount Mode**: Fixed discount amount per item is applied within each tier group

* * *

## API Endpoints

Tiered Pricing promotions use the same endpoints as MultiBuy promotions:

### Base URL

```
/api/promotions
```

### Create Promotion

```
POST /api/promotions
Content-Type: application/json
```

**Request Body**: `OmniumPromotionRequest` (with `UseTieredPricing: true`)

### Update Promotion (Patch)

```
PATCH /api/promotions
Content-Type: application/json
```

**Request Body**: `OmniumPromotionPatch`

### Get Promotion (by ID)

```
GET /api/promotions/{id}
```

### Search Promotions

```
POST /api/promotions/Search
Content-Type: application/json
```

**Request Body**: `OmniumPromotionSearchRequest`

### Delete Promotion

```
DELETE /api/promotions/{id}
```

* * *

## Data Models

### OmniumPromotionMultiBuyReward (Enhanced)

For tiered pricing, set `UseTieredPricing: true` and populate `QuantityTiers`.

```json
{
  "requiredBuyAmount": 0,
  "numberOfDiscountedItems": 0,
  "percentage": 0,
  "promotionAmounts": null,
  "usePercentage": false,
  "isFixedPrice": false,
  "useTieredPricing": true,
  "quantityTiers": [
    {
      "quantity": 2,
      "fixedPrice": 499.00,
      "percentage": 0,
      "discountAmount": 0,
      "marketId": "NOR",
      "currency": "NOK"
    },
    {
      "quantity": 3,
      "fixedPrice": 649.00,
      "percentage": 0,
      "discountAmount": 0,
      "marketId": "NOR",
      "currency": "NOK"
    }
  ],
  "promotionAdvancedReward": null
}
```

### OmniumPromotionQuantityTier

Defines a single tier in the tiered pricing structure.

```json
{
  "quantity": 2,
  "fixedPrice": 499.00,
  "percentage": 0,
  "discountAmount": 0,
  "marketId": "NOR",
  "currency": "NOK"
}
```

#### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `quantity` | int | Yes | Minimum number of items required to qualify for this tier |
| `fixedPrice` | decimal | Conditional | Total fixed price for this tier. Used when `IsFixedPrice = true` |
| `percentage` | decimal | Conditional | Percentage discount (0-100) for this tier. Used when `UsePercentage = true` |
| `discountAmount` | decimal | Conditional | Discount amount per item. Used when both `IsFixedPrice` and `UsePercentage` are false |
| `marketId` | string | Yes | Market ID (e.g., "NOR", "SWE", "US") |
| `currency` | string | Yes | Currency code (e.g., "NOK", "SEK", "USD") |

### Important Notes

*   **Required Fields**: When `UseTieredPricing` is true:

    *   `RequiredBuyAmount` and `NumberOfDiscountedItems` are **ignored**
    *   `QuantityTiers` array **must** be populated
    *   Each tier must have unique `Quantity` values per market/currency combination
*   **Discount Mode Selection**:

    *   Set **only one** of: `IsFixedPrice`, `UsePercentage`, or neither (for amount mode)
    *   All tiers must use the same discount mode
*   **Multi-Currency Support**:

    *   Create separate tiers for each market/currency combination
    *   Tiers are filtered by billing currency at calculation time

* * *

## Creating Tiered Pricing Promotions

### Step 1: Base Promotion Structure

Start with a standard MultiBuy promotion structure:

```json
{
  "name": "Tiered Pricing Example",
  "title": "Buy More, Save More!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "shirts",
          "categoryName": "Shirts"
        }
      ]
    },
    "promotionMultiBuyReward": {
      // Tiered pricing configuration goes here
    }
  }
}
```

### Step 2: Enable Tiered Pricing

Set `useTieredPricing: true` and configure tiers:

```
"promotionMultiBuyReward": {
  "requiredBuyAmount": 0,
  "numberOfDiscountedItems": 0,
  "usePercentage": false,
  "isFixedPrice": true,
  "useTieredPricing": true,
  "quantityTiers": [
    // Tier definitions
  ]
}
```

### Step 3: Define Tiers

Add tier definitions for each quantity threshold:

```
"quantityTiers": [
  {
    "quantity": 2,
    "fixedPrice": 499.00,
    "marketId": "NOR",
    "currency": "NOK"
  },
  {
    "quantity": 3,
    "fixedPrice": 649.00,
    "marketId": "NOR",
    "currency": "NOK"
  },
  {
    "quantity": 4,
    "fixedPrice": 799.00,
    "marketId": "NOR",
    "currency": "NOK"
  }
]
```

* * *

## Examples

### Example 1: Fixed Price Tiered Promotion (Single Market)

**Scenario**: "2 for 499 NOK, 3 for 649 NOK, 4 for 799 NOK"

```json
{
  "name": "Volume Pricing - Shirts",
  "title": "Buy More Shirts, Save More!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "shirts",
          "categoryName": "Shirts"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 0,
      "numberOfDiscountedItems": 0,
      "usePercentage": false,
      "isFixedPrice": true,
      "useTieredPricing": true,
      "quantityTiers": [
        {
          "quantity": 2,
          "fixedPrice": 499.00,
          "percentage": 0,
          "discountAmount": 0,
          "marketId": "NOR",
          "currency": "NOK"
        },
        {
          "quantity": 3,
          "fixedPrice": 649.00,
          "percentage": 0,
          "discountAmount": 0,
          "marketId": "NOR",
          "currency": "NOK"
        },
        {
          "quantity": 4,
          "fixedPrice": 799.00,
          "percentage": 0,
          "discountAmount": 0,
          "marketId": "NOR",
          "currency": "NOK"
        }
      ]
    }
  }
}
```

**Cart Example**:

*   5 items in cart (each normally 300 NOK = 1,500 NOK total)
*   Algorithm applies: 4 for 799 NOK + 1 at full price (300 NOK)
*   **Customer pays**: 1,099 NOK (saves 401 NOK)

### Example 2: Percentage-Based Tiered Promotion

**Scenario**: "Buy 2: 10% off, Buy 4: 20% off, Buy 6: 30% off"

```json
{
  "name": "Volume Discount - Electronics",
  "title": "Buy More, Save More - Up to 30% Off!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "electronics",
          "categoryName": "Electronics"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 0,
      "numberOfDiscountedItems": 0,
      "usePercentage": true,
      "isFixedPrice": false,
      "useTieredPricing": true,
      "quantityTiers": [
        {
          "quantity": 2,
          "fixedPrice": 0,
          "percentage": 10.0,
          "discountAmount": 0,
          "marketId": "US",
          "currency": "USD"
        },
        {
          "quantity": 4,
          "fixedPrice": 0,
          "percentage": 20.0,
          "discountAmount": 0,
          "marketId": "US",
          "currency": "USD"
        },
        {
          "quantity": 6,
          "fixedPrice": 0,
          "percentage": 30.0,
          "discountAmount": 0,
          "marketId": "US",
          "currency": "USD"
        }
      ]
    }
  }
}
```

**Cart Example**:

*   7 items in cart (each $50 = $350 total)
*   Algorithm applies: 6 items at 30% off ($210) + 1 at full price ($50)
*   **Customer pays**: $260 (saves $90)

### Example 3: Amount-Based Tiered Promotion

**Scenario**: "Buy 2: $5 off each, Buy 4: $10 off each, Buy 6: $15 off each"

```json
{
  "name": "Bulk Discount - Accessories",
  "title": "Volume Savings on Accessories!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "accessories",
          "categoryName": "Accessories"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 0,
      "numberOfDiscountedItems": 0,
      "usePercentage": false,
      "isFixedPrice": false,
      "useTieredPricing": true,
      "quantityTiers": [
        {
          "quantity": 2,
          "fixedPrice": 0,
          "percentage": 0,
          "discountAmount": 5.00,
          "marketId": "US",
          "currency": "USD"
        },
        {
          "quantity": 4,
          "fixedPrice": 0,
          "percentage": 0,
          "discountAmount": 10.00,
          "marketId": "US",
          "currency": "USD"
        },
        {
          "quantity": 6,
          "fixedPrice": 0,
          "percentage": 0,
          "discountAmount": 15.00,
          "marketId": "US",
          "currency": "USD"
        }
      ]
    }
  }
}
```

**Cart Example**:

*   9 items in cart (each $30 = $270 total)
*   Algorithm applies: 6 items with $15 off each ($90 discount) + 2 items with $5 off each ($10 discount) + 1 at full price
*   **Customer pays**: $170 (saves $100)

### Example 4: Multi-Market Tiered Promotion

**Scenario**: Different pricing tiers for Norwegian and Swedish markets

```json
{
  "name": "Nordic Volume Pricing",
  "title": "Kjøp flere, spar mer! / Köp fler, spara mer!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "jeans",
          "categoryName": "Jeans"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 0,
      "numberOfDiscountedItems": 0,
      "usePercentage": false,
      "isFixedPrice": true,
      "useTieredPricing": true,
      "quantityTiers": [
        {
          "quantity": 2,
          "fixedPrice": 999.00,
          "percentage": 0,
          "discountAmount": 0,
          "marketId": "NOR",
          "currency": "NOK"
        },
        {
          "quantity": 3,
          "fixedPrice": 1399.00,
          "percentage": 0,
          "discountAmount": 0,
          "marketId": "NOR",
          "currency": "NOK"
        },
        {
          "quantity": 2,
          "fixedPrice": 949.00,
          "percentage": 0,
          "discountAmount": 0,
          "marketId": "SWE",
          "currency": "SEK"
        },
        {
          "quantity": 3,
          "fixedPrice": 1349.00,
          "percentage": 0,
          "discountAmount": 0,
          "marketId": "SWE",
          "currency": "SEK"
        }
      ]
    }
  }
}
```

## Advanced Features

### 1\. Discount on Most Expensive Items

By default, tiered pricing applies to the cheapest items. Use `isDiscountMostExpensive: true` to prioritize expensive items:

```
"promotionMultiBuyReward": {
  "useTieredPricing": true,
  "quantityTiers": [ /* ... */ ],
  "promotionAdvancedReward": {
    "isAdvancedRewardEnabled": true,
    "isDiscountMostExpensive": true,
    "discountUsageLimit": 0
  }
}
```

**Use Case**: Premium product promotions where you want to incentivize purchases of higher-priced items.

### 2\. Discount Usage Limits

Limit how many times tiered pricing can be applied per cart:

```
"promotionAdvancedReward": {
  "isAdvancedRewardEnabled": true,
  "discountUsageLimit": 2
}
```

**Examples**:

*   `discountUsageLimit: 0` - Unlimited (default behavior)
*   `discountUsageLimit: 1` - Only applies highest qualifying tier once
*   `discountUsageLimit: 2` - Applies tiers maximum twice per cart

**Cart Example** with `discountUsageLimit: 1`:

*   Promotion: "2 for 499, 3 for 649, 4 for 799"
*   Cart: 7 items
*   Result: Only applies "4 for 799" tier once, remaining 3 items at full price
*   Without limit: Would apply "4 for 799" + "3 for 649"

### 3\. Combining with Other Promotions

Control promotion stacking behavior:

```json
{
  "canBeCombinedWithOtherPromotions": true,
  "alwaysApply": false
}
```

| Property | Description |
| --- | --- |
| `canBeCombinedWithOtherPromotions` | Allow this promotion to stack with other combinable promotions |
| `alwaysApply` | Apply even if other promotions have `canBeCombinedWithOtherPromotions = false` |

### 4\. Priority System

Promotions with **lower priority numbers** are evaluated first (0 = highest priority):

```json
{
  "priority": 0  // Evaluated before priority 10, 20, etc.
}
```

**Best Practice**: Set tiered pricing promotions to higher priority (lower number) than standard promotions to ensure they're evaluated first.

### 5\. Coupon Code Requirements

Require a coupon code to activate tiered pricing:

```json
{
  "name": "VIP Tiered Pricing",
  "couponCode": "VIP2025",
  "promotionData": {
    "promotionMultiBuyReward": {
      "useTieredPricing": true,
      "quantityTiers": [ /* ... */ ]
    }
  }
}
```

* * *

## Best Practices

### 1\. Tier Quantity Ordering

**Always define tiers in ascending quantity order** for clarity, even though the system will sort them automatically:

**Good**:

```
"quantityTiers": [
  { "quantity": 2, "fixedPrice": 499 },
  { "quantity": 3, "fixedPrice": 649 },
  { "quantity": 4, "fixedPrice": 799 }
]
```

**Avoid**:

```
"quantityTiers": [
  { "quantity": 4, "fixedPrice": 799 },
  { "quantity": 2, "fixedPrice": 499 },
  { "quantity": 3, "fixedPrice": 649 }
]
```

### 2\. Ensure Progressive Value

Each tier should offer better value than the previous tier to incentivize larger purchases:

**Good** (Progressive value):

*   2 items for 499 (249.50 per item)
*   3 items for 649 (216.33 per item)
*   4 items for 799 (199.75 per item)

**Avoid** (Inconsistent value):

*   2 items for 499 (249.50 per item)
*   3 items for 750 (250.00 per item) - Worse value!
*   4 items for 799 (199.75 per item)

### 3\. Multi-Currency Tiers

When supporting multiple markets, **provide tiers for all active markets**:

```
"markets": ["NOR", "SWE", "DK"],
"quantityTiers": [
  { "quantity": 2, "fixedPrice": 499, "marketId": "NOR", "currency": "NOK" },
  { "quantity": 2, "fixedPrice": 449, "marketId": "SWE", "currency": "SEK" },
  { "quantity": 2, "fixedPrice": 399, "marketId": "DK", "currency": "DKK" },
  // ... more tiers
]
```

### 4\. Descriptive Naming

Use clear, descriptive names that indicate the promotion structure:

*   Good: "Tiered\_2for499\_3for649\_4for799\_Shirts\_NOR"
*   Good: "VolumePricing\_10-20-30pct\_Electronics\_US"
*   Bad: "Promo123"
*   Bad: "Q1Sale"

### 5\. Set Date Ranges

Always set `activeFrom` and `activeTo` dates. Promotions without `activeFrom` and `activeTo` dates will be set to inactive:

```json
{
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-03-31T23:59:59Z"
}
```

### 6\. Test Complex Scenarios

Before activating in production, test with various cart quantities in the test environment:

*   Exact tier quantities (2, 3, 4 items)
*   Between tiers (5, 7 items)
*   Above highest tier (10+ items)
*   With and without usage limits
*   Multi-currency scenarios

### 7\. Clear Customer Communication

Ensure your promotion title/description clearly communicates the tiers:

**Good**:

```json
{
  "title": "Buy 2 for 499 NOK | 3 for 649 NOK | 4 for 799 NOK",
  "description": "The more you buy, the more you save! Prices automatically adjust based on quantity."
}
```

**Unclear**:

```json
{
  "title": "Special Offer",
  "description": "Save now!"
}
```

### 8\. Maximum 50 Tiers

The system supports up to 50 quantity tiers per promotion. For most use cases, 3-5 tiers are sufficient.

* * *

## Troubleshooting

### Promotion Not Applying

**Check**:

1.  Is `useTieredPricing: true` set?
2.  Is `quantityTiers` array populated with at least one tier?
3.  Does the cart contain enough items to meet the lowest tier quantity?
4.  Do tier currencies match the cart's billing currency?
5.  Are the products in the cart included in `categoryAndBrandFilter`?
6.  Is the promotion within its `activeFrom` and `activeTo` dates?
7.  If using a coupon code, has it been applied to the cart?

### Incorrect Discount Amount

**Check**:

1.  Are tiers defined for the correct market/currency combination?
2.  Is the correct discount mode set (`isFixedPrice`, `usePercentage`, or neither for amount mode)?
3.  Are tier values (fixedPrice, percentage, discountAmount) correctly set?
4.  Is `discountUsageLimit` restricting tier applications?
5.  Is `isDiscountMostExpensive` affecting which items are discounted?

### Only Some Items Discounted

**Expected Behavior**: The greedy algorithm applies the highest qualifying tier first, then works down. Items that don't fit into any tier remain at full price.

**Example**:

*   Promotion: "2 for 499, 4 for 799"
*   Cart: 5 items
*   Result: 4 for 799 (tier applied) + 1 at full price (no tier qualifies for 1 item)

**Solution**: If you want all items discounted, ensure you have tiers for all expected quantities, including quantity 1.

### Tier Not Selected as Expected

The greedy algorithm **always selects the highest quantity tier first**:

**Example**:

*   Promotion: "2 for 500, 3 for 700, 4 for 850"
*   Cart: 6 items
*   Customer might expect: 3 for 700 + 3 for 700 = 1,400
*   **Actual result**: 4 for 850 + 2 for 500 = 1,350 (Better deal!)

This is **intentional behavior** to maximize customer savings.

* * *

## Common Scenarios & Solutions

### Scenario 1: "All Items Same Price"

**Problem**: Customer wants all items in a tier to show the same discounted price (e.g., "All items $10 each when you buy 4").

**Solution**: Use **Fixed Price** mode with total price = (quantity × desired per-item price):

```json
{
  "quantity": 4,
  "fixedPrice": 40.00,  // 4 × $10 = $40
  "isFixedPrice": true
}
```

### Scenario 2: "Leftover Items"

**Problem**: Cart has 5 items, but highest tier is 3. What happens to the other 2 items?

**Solution**: The algorithm will attempt to apply lower tiers. If no tier qualifies for remaining items, they stay at full price. To handle this, add a tier for smaller quantities:

```
"quantityTiers": [
  { "quantity": 1, "percentage": 5 },   // 5% off single items
  { "quantity": 3, "percentage": 15 },  // 15% off 3 items
  { "quantity": 5, "percentage": 25 }   // 25% off 5 items
]
```

### Scenario 3: "One Tier Per Cart"

**Problem**: Customer should only benefit from tiered pricing once per order.

**Solution**: Set `discountUsageLimit: 1`:

```
"promotionAdvancedReward": {
  "isAdvancedRewardEnabled": true,
  "discountUsageLimit": 1
}
```

### Scenario 4: "Tiered Pricing + Other Discounts"

**Problem**: You want tiered pricing to combine with category discounts.

**Solution**: Set `canBeCombinedWithOtherPromotions: true` on both promotions:

```json
{
  "canBeCombinedWithOtherPromotions": true,
  "alwaysApply": false
}
```

**Important**: Ensure items aren't double-counted by checking promotion priorities and combination rules.

* * *

## API Response Models

### Success Response (Create)

```json
{
  "message": "Promotion 6b104835-c95c-4562-9b42-fba2e438eeec added, prices updated: 0",
  "statusCode": 200
}
```

### Error Response (Validation)

```json
{
  "error": "QuantityTiers must have unique quantity values per market",
  "statusCode": 400
}
```

### Common Validation Errors

| Error Message | Cause | Solution |
| --- | --- | --- |
| "QuantityTiers cannot be empty when UseTieredPricing is true" | No tiers defined | Add at least one tier to `quantityTiers` array |
| "Tier quantity must be greater than 0" | Tier has quantity ≤ 0 | Set all tier quantities to positive integers |
| "QuantityTiers must have unique quantity values per market" | Duplicate quantities for same market | Ensure each market/currency has unique quantity values |
| "All tiers must use the same discount mode" | Mixed fixed price, percentage, and amount tiers | Choose one mode for all tiers |

* * *

## Performance Considerations

### 1\. Limit Tier Count

While the system supports up to 50 tiers, **3-5 tiers are optimal** for:

*   Performance (faster calculation)
*   Customer understanding (simpler offers)
*   Maintenance (easier to manage)

### 2\. Currency Filtering

The system automatically filters tiers by billing currency before calculation, so defining tiers for multiple currencies **does not** impact performance.

* * *

## Additional Resources

*   **MultiBuy Promotions**: See [MultiBuy API Reference](multibuyApiReference.md) for standard MultiBuy features
*   **Promotion Types Overview**: See `PromotionType` enum (0=Shipping, 1=CategoryOrBrand, 2=MultiBuy, 3=OrderAmount, 4=Kit, 5=ProductSearch, 6=PriceList)
*   **Date Formats**: Use ISO 8601 format (e.g., `2025-01-01T00:00:00Z`)

* * *

## Support

For questions or issues:

1.  Check this documentation
2.  Review the [troubleshooting section](tieredPricingApiReference.md#troubleshooting)
3.  Examine API error messages for validation details
4.  Contact your Omnium support team

* * *

**Document Version**: 1.0 **Last Updated**: 2025 **API Version**: Compatible with Omnium OMS .NET 9.0+
