# Conditional Pricing

Source: https://docs.omnium.no/docs/Prices/Promotions/conditionalPricingApiReference

> API reference for conditional pricing - define custom promotional prices that activate when MultiBuy conditions are met.

# Conditional Pricing API Reference

## Table of Contents

1.  [Overview](conditionalPricingApiReference.md#overview)
2.  [How It Works](conditionalPricingApiReference.md#how-it-works)
3.  [Use Cases](conditionalPricingApiReference.md#use-cases)
4.  [Creating Conditional Pricing Promotions](conditionalPricingApiReference.md#creating-conditional-pricing-promotions)
5.  [Setting Custom Prices via Price API](conditionalPricingApiReference.md#setting-custom-prices-via-price-api)
6.  [Complete Examples](conditionalPricingApiReference.md#complete-examples)
7.  [Best Practices](conditionalPricingApiReference.md#best-practices)
8.  [Troubleshooting](conditionalPricingApiReference.md#troubleshooting)
9.  [Related Features](conditionalPricingApiReference.md#related-features)
10.  [Key Differences: Conditional Pricing vs Standard MultiBuy](conditionalPricingApiReference.md#key-differences-conditional-pricing-vs-standard-multibuy)

* * *

## Overview

Conditional Pricing is a powerful feature that allows you to **manually define custom promotional prices** for individual products that activate when MultiBuy promotion conditions are met. Unlike standard MultiBuy promotions that apply a uniform discount formula (e.g., "30% off all products"), conditional pricing lets you set unique promotional prices for each product.

### Key Difference from Standard MultiBuy

**Standard MultiBuy**:

*   Promotion defines a discount formula (e.g., "30% off when buying 2+")
*   All products get the same discount percentage/amount

**Conditional Pricing**:

*   Promotion defines only the **conditions** (e.g., "must buy 2+ items")
*   You **manually set** custom promotional prices via the Price API
*   Each product can have a **unique promotional price** (12% off, $10.01 off, nice round numbers, etc.)
*   Promotional prices only activate when conditions are met

### Why Use Conditional Pricing?

*   **Flexible Pricing**: Set different discount levels per product (some 10% off, others 15%, etc.)
*   **Nice Round Numbers**: Create prices like $99.00, $49.99 regardless of formula
*   **One Promotion, Many Prices**: Single promotion can trigger hundreds of unique price points
*   **Merchandising Control**: Manually choose exactly what each discounted price should be
*   **Simpler Management**: No need to create separate promotions for each discount level

* * *

## How It Works

### 3-Step Workflow

#### Step 1: Create MultiBuy Promotion (Condition Holder)

Create a MultiBuy promotion with `useConditionalPricing: true`. This promotion acts as a **condition holder** - it defines when prices should activate, not what the prices should be.

```json
{
  "name": "Volume Pricing - Category A",
  "promotionData": {
    "promotionType": 2,
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,           // Condition: Must buy 2+ items
      "numberOfDiscountedItems": 0,     // All items get custom price (0 = all)
      "useConditionalPricing": true,    // Enable conditional pricing
      "conditionalPricing": {
        "showPricesOnlyWhenConditionMet": true
      }
    }
  }
}
```

**Important**: When `useConditionalPricing: true`, the system will **NOT** auto-generate promotional prices. No `percentage`, `promotionAmounts`, or `isFixedPrice` needed.

**How Products Qualify**: Products qualify for conditional pricing if they have a price record with the matching `promotionId`. The system automatically checks which SKUs have conditional prices and only applies the promotion to those products.

#### Step 2: Manually Set Custom Prices via Price API

Use the `/api/prices/addmany` endpoint to create custom promotional prices for each product, tagged with the promotion ID.

```json
{
  "productId": "PRODUCT-001",
  "prices": [
    {
      "marketId": "US",
      "currencyCode": "USD",
      "unitPrice": 47.99,                // Custom price (happens to be 12% off $54.99)
      "originalUnitPrice": 54.99,
      "promotionId": "promo-volume-123", // Link to promotion
      "validFrom": "2025-01-01T00:00:00Z",
      "validUntil": "2025-12-31T23:59:59Z"
    }
  ]
}
```

#### Step 3: System Evaluates Conditions

When customers shop:

**Cart has < 2 items**:

*   Regular prices shown: $54.99
*   Promotional prices not applied (condition not met)

**Cart has 2+ items**:

*   Custom promotional prices activate: $47.99
*   Discounted prices is applied (condition met!)

* * *

## Use Cases

### Use Case 1: Variable Discount Levels

**Scenario**: "Buy 2+ from Summer Collection" with different discounts per product

*   T-Shirt A: $29.99 → $24.99 (16.7% off)
*   T-Shirt B: $34.99 → $29.00 (17.1% off - nice round number!)
*   T-Shirt C: $39.99 → $34.98 ($5.01 off exactly)

**Why Conditional Pricing?** Standard MultiBuy would require same % or $ off all products. Conditional pricing lets you set optimal price points for each item.

### Use Case 2: Strategic Price Points

**Scenario**: "Buy 3+ accessories" with merchandising-optimized prices

*   Belt: $14.99 → $9.99 (psychological pricing)
*   Hat: $24.99 → $19.99 (ends in .99)
*   Wallet: $34.50 → $30.00 (nice round number)

**Why Conditional Pricing?** You choose exact promotional prices for best conversion, not formula-driven prices.

### Use Case 3: Clearance with Minimum Purchase

**Scenario**: "Buy 5+ clearance items for special pricing"

*   Item A: Was $50, Clearance $30, Volume Price $25 (50% total discount)
*   Item B: Was $40, Clearance $28, Volume Price $24 (40% total discount)
*   Item C: Was $30, Clearance $22, Volume Price $20 (33% total discount)

**Why Conditional Pricing?** Mix different discount depths across products while requiring minimum purchase.

### Use Case 4: B2B Wholesale Pricing

**Scenario**: "Business customers: Order 10+ units for wholesale pricing"

*   Product line with hundreds of SKUs
*   Each SKU has custom wholesale price (not formula-based)
*   One promotion triggers all wholesale prices

**Why Conditional Pricing?** Single promotion handles complex wholesale price list without generating thousands of prices automatically.

* * *

## Creating Conditional Pricing Promotions

### MultiBuy Promotion Configuration

```json
{
  "id": "promo-conditional-123",
  "name": "Conditional Volume Pricing",
  "title": "Buy 2+ for Special Pricing",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "promotionData": {
    "promotionType": 2,
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 0,
      "useConditionalPricing": true,
      "conditionalPricing": {
        "showPricesOnlyWhenConditionMet": true,
      }
    }
  }
}
```

### Key Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `useConditionalPricing` | bool | Yes | **MUST be `true`** to enable conditional pricing |
| `requiredBuyAmount` | int | Yes | Number of items customer must buy |
| `numberOfDiscountedItems` | int | Yes | How many items get custom price (0 = all items) |
| `percentage` | decimal | No | **Not used** - leave empty or omit |
| `promotionAmounts` | array | No | **Not used** - leave empty or omit |
| `isFixedPrice` | bool | No | **Not used** - leave empty or omit |

### ConditionalPricing Settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `showPricesOnlyWhenConditionMet` | bool | `true` | Hide promotional prices until cart conditions are met |

* * *

## Setting Custom Prices via Price API

### Price API Endpoint

**PUT** `/api/prices/addmany`

### Request Structure

```json
[
  {
    "productId": "PRODUCT-SKU-001",
    "ignoreDates": false,
    "prices": [
      {
        "marketId": "US",
        "currencyCode": "USD",
        "unitPrice": 47.99,
        "originalUnitPrice": 54.99,
        "promotionId": "promo-conditional-123",
        "promotionName": "Conditional Volume Pricing",
        "validFrom": "2025-01-01T00:00:00Z",
        "validUntil": "2025-12-31T23:59:59Z"
      }
    ]
  }
]
```

### Key Fields

| Field | Required | Description |
| --- | --- | --- |
| `productId` | Yes | Product ID (not variant ID) |
| `unitPrice` | Yes | The custom promotional price you want to set |
| `originalUnitPrice` | Yes | Regular price for comparison |
| `promotionId` | **Yes** | **MUST match** the conditional pricing promotion ID |
| `promotionName` | Recommended | Display name for the promotion |
| `marketId` | Yes | Market the price applies to |
| `currencyCode` | Yes | Currency code (USD, EUR, NOK, etc.) |
| `validFrom` / `validUntil` | Yes | Date range when price is valid |

### Important Notes

*   **PromotionId is Critical**: Must match the conditional pricing promotion ID exactly
*   **Each Product, Each Price**: You must create a price entry for every product you want in the promotion
*   **No Auto-Generation**: System will NOT create these prices automatically
*   **Full Control**: You decide exactly what each promotional price should be
*   **Update Anytime**: Use same API to update promotional prices

* * *

## Complete Examples

### Example 1: Basic Conditional Pricing Setup

**Step 1: Create Promotion**

```
POST /api/promotions
Content-Type: application/json
```

```json
{
  "name": "Buy 2 Summer Tees Get Volume Price",
  "title": "Buy 2+ Summer Tees for Special Pricing",
  "activeFrom": "2025-06-01T00:00:00Z",
  "activeTo": "2025-08-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 0,
      "useConditionalPricing": true,
      "conditionalPricing": {
        "showPricesOnlyWhenConditionMet": true
      }
    }
  }
}
```

**Response**: Promotion created with ID `promo-summer-vol-456`

**Step 2: Set Custom Prices for Each Product**

```
PUT /api/prices/addmany
Content-Type: application/json
```

```json
[
  {
    "productId": "SUMMER-TEE-BLUE",
    "prices": [
      {
        "marketId": "US",
        "currencyCode": "USD",
        "unitPrice": 19.99,
        "originalUnitPrice": 24.99,
        "promotionId": "promo-summer-vol-456",
        "promotionName": "Buy 2 Summer Tees Get Volume Price",
        "validFrom": "2025-06-01T00:00:00Z",
        "validUntil": "2025-08-31T23:59:59Z"
      }
    ]
  },
  {
    "productId": "SUMMER-TEE-RED",
    "prices": [
      {
        "marketId": "US",
        "currencyCode": "USD",
        "unitPrice": 17.99,
        "originalUnitPrice": 24.99,
        "promotionId": "promo-summer-vol-456",
        "promotionName": "Buy 2 Summer Tees Get Volume Price",
        "validFrom": "2025-06-01T00:00:00Z",
        "validUntil": "2025-08-31T23:59:59Z"
      }
    ]
  },
  {
    "productId": "SUMMER-TEE-GREEN",
    "prices": [
      {
        "marketId": "US",
        "currencyCode": "USD",
        "unitPrice": 22.00,
        "originalUnitPrice": 29.99,
        "promotionId": "promo-summer-vol-456",
        "promotionName": "Buy 2 Summer Tees Get Volume Price",
        "validFrom": "2025-06-01T00:00:00Z",
        "validUntil": "2025-08-31T23:59:59Z"
      }
    ]
  }
]
```

**Customer Experience**:

*   Product page: Shows $24.99, $24.99, $29.99 with "Buy 2+ for special pricing"
*   Add 1 item: Cart shows regular price
*   Add 2nd item: Prices change to $19.99, $17.99, $22.00 - "Volume discount applied!"

### Example 2: Multi-Market Conditional Pricing

**Step 1: Create Promotion (Multiple Markets)**

```json
{
  "name": "Global Volume Pricing",
  "markets": ["US", "UK", "EUR"],
  "promotionData": {
    "promotionType": 2,
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 3,
      "numberOfDiscountedItems": 0,
      "useConditionalPricing": true,
      "conditionalPricing": {
        "showPricesOnlyWhenConditionMet": true
      }
    }
  }
}
```

**Step 2: Set Prices for Each Market**

```json
[
  {
    "productId": "PREMIUM-PRODUCT-001",
    "prices": [
      {
        "marketId": "US",
        "currencyCode": "USD",
        "unitPrice": 99.00,
        "originalUnitPrice": 129.99,
        "promotionId": "promo-global-vol-789"
      },
      {
        "marketId": "UK",
        "currencyCode": "GBP",
        "unitPrice": 79.00,
        "originalUnitPrice": 99.99,
        "promotionId": "promo-global-vol-789"
      },
      {
        "marketId": "EUR",
        "currencyCode": "EUR",
        "unitPrice": 89.00,
        "originalUnitPrice": 115.00,
        "promotionId": "promo-global-vol-789"
      }
    ]
  }
]
```

### Example 3: B2B Wholesale Pricing

**Step 1: Create B2B Promotion**

```json
{
  "name": "B2B Wholesale Pricing",
  "title": "Order 10+ Units for Wholesale Pricing",
  "markets": ["US"],
  "customerGroups": [
    {
      "customerGroupId": "b2b-wholesale",
      "customerGroupName": "B2B Wholesale Customers"
    }
  ],
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "all-products",
          "categoryName": "All Products"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 10,
      "numberOfDiscountedItems": 0,
      "useConditionalPricing": true,
      "conditionalPricing": {
        "showPricesOnlyWhenConditionMet": true
      }
    }
  }
}
```

**Step 2: Bulk Load Wholesale Prices**

```json
[
  {
    "productId": "WIDGET-001",
    "prices": [
      {
        "unitPrice": 8.50,
        "originalUnitPrice": 12.99,
        "promotionId": "promo-b2b-wholesale",
        "customerGroup": "b2b-wholesale",
        "marketId": "US",
        "currencyCode": "USD"
      }
    ]
  },
  {
    "productId": "WIDGET-002",
    "prices": [
      {
        "unitPrice": 15.75,
        "originalUnitPrice": 24.99,
        "promotionId": "promo-b2b-wholesale",
        "customerGroup": "b2b-wholesale",
        "marketId": "US",
        "currencyCode": "USD"
      }
    ]
  }
  // ... hundreds more products
]
```

### Example 4: Clearance with Variable Discounts

**Scenario**: Clearance items at different discount levels, all requiring 5+ items purchase

**Step 1: Create Clearance Promotion**

```json
{
  "name": "Clearance Volume Deal",
  "title": "Buy 5+ Clearance Items for Extra Savings",
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "clearance",
          "categoryName": "Clearance"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 5,
      "numberOfDiscountedItems": 0,
      "useConditionalPricing": true,
      "conditionalPricing": {
        "showPricesOnlyWhenConditionMet": true
      }
    }
  }
}
```

**Step 2: Set Variable Clearance Prices**

```json
[
  {
    "productId": "CLEARANCE-ITEM-A",
    "prices": [
      {
        "unitPrice": 10.00,
        "originalUnitPrice": 49.99,
        "promotionId": "promo-clearance-vol",
        "marketId": "US",
        "currencyCode": "USD"
      }
    ]
  },
  {
    "productId": "CLEARANCE-ITEM-B",
    "prices": [
      {
        "unitPrice": 15.00,
        "originalUnitPrice": 39.99,
        "promotionId": "promo-clearance-vol",
        "marketId": "US",
        "currencyCode": "USD"
      }
    ]
  },
  {
    "productId": "CLEARANCE-ITEM-C",
    "prices": [
      {
        "unitPrice": 7.99,
        "originalUnitPrice": 29.99,
        "promotionId": "promo-clearance-vol",
        "marketId": "US",
        "currencyCode": "USD"
      }
    ]
  }
]
```

* * *

## Best Practices

### 1\. Promotion Setup

*   **Always Set `useConditionalPricing: true`** - This prevents auto-generation of promotional prices in cart
*   **Set Clear Conditions** - Define `requiredBuyAmount` and `numberOfDiscountedItems` accurately
*   **Use Descriptive Names** - Internal name should indicate it's conditional pricing: "Conditional-Volume-Summer"
*   **Don't Set Discount Formulas** - Leave `percentage`, `promotionAmounts`, and `isFixedPrice` empty - they're not used

### 2\. Price Management

*   **Consistent PromotionId** - All custom prices MUST use exact same promotion ID
*   **Match Date Ranges** - Price `validFrom/validUntil` should align with promotion active dates
*   **Set OriginalUnitPrice** - Always include original price for proper discount display
*   **Bulk Price Updates** - Use `/api/prices/addmany` with batches of up to 500 products

### 3\. Operational

*   **Price Updates** - Update promotional prices anytime via Price API (promotion doesn't regenerate)
*   **Set Prices Per Market** - Create price entries for each market/currency combination

* * *

## Troubleshooting

### Promotional Prices Being Auto-Generated

**Problem**: System is generating promotional prices automatically even though I want to set them manually.

**Check**:

1.  Verify `useConditionalPricing = true` in promotion
2.  Ensure you're not setting `percentage` or `promotionAmounts`
3.  Check promotion update didn't trigger price regeneration

**Solution**: When `useConditionalPricing: true`, system skips automatic price generation. If prices were generated before adding flag, delete them first.

### Custom Prices Not Activating

**Problem**: Cart meets conditions but promotional prices don't appear.

**Check**:

1.  Verify prices have correct `promotionId` (exact match required)
2.  Check price `validFrom/validUntil` dates
3.  Ensure products are in qualifying category/brand filter (if configured)
4.  Verify market/store/customer group restrictions match
5.  Check cart actually has required quantity (`RequiredBuyAmount`)
6.  Verify cart has `MarketId` set (required for price lookups)

**Solution**: Most common issue is promotionId mismatch. Double-check Price API requests use exact promotion ID.

### Prices Showing Without Conditions Met

**Problem**: Promotional prices visible even when cart is empty.

**Check**:

1.  Verify `showPricesOnlyWhenConditionMet = true`
2.  Check that price retrieval is passing cart context
3.  Ensure using correct API methods with cart parameter

**Solution**: Conditional pricing requires cart context. Product list pages should NOT pass cart to hide prices until conditions met.

### Cannot Update Promotional Prices

**Problem**: Trying to update custom promotional prices via API fails.

**Check**:

1.  Using PUT `/api/prices/addmany` (overwrites existing)
2.  Set `ignoreDates: false` to match existing price dates
3.  All required fields present (productId, marketId, currencyCode, etc.)

**Solution**: Use same request structure as initial price creation. Price is identified by combination of: CustomerId, CustomerGroup, VariantId, MarketId, CurrencyCode, SalesCode, **PromotionId**, StoreId, PriceListId, and dates.

### Wrong Products Getting Promotional Prices

**Problem**: Promotional prices activating for products not intended.

**Check**:

1.  Verify you only created prices with `promotionId` for intended products
2.  Review promotion's `categoryAndBrandFilter` (if configured)
3.  Check products are actually in specified categories/brands
4.  Ensure category/brand filters match your price creation strategy

**Solution**: Conditional pricing qualifies products based on whether they have prices with the matching `promotionId`. Remove prices from unintended products via Price API, or add category/brand filters to the promotion for an additional validation layer.

* * *

## Related Features

### Works With

*   **Category/Brand Filtering** - Define which products can have conditional prices (optional validation layer)
*   **Customer Groups** - Restrict conditional prices to specific customer segments
*   **Multi-Market** - Set different conditional prices per market/currency
*   **Store-Specific** - Apply conditional prices to specific stores only
*   **Date Ranges** - Control when conditional prices are active (via price validFrom/validUntil)
*   **Customer Club** - Combine with customer club membership restrictions

### Does NOT Work With

*   **Mix and Match** - Conditional pricing evaluates same-category/brand products only
*   **Tiered Pricing** - Use standard MultiBuy with tiers for quantity-based discount levels
*   **Coupon Codes** - Conditional pricing is promotion-based, not coupon-activated

### See Also

*   **[MultiBuy Promotions API Reference](multibuyApiReference.md)** - Standard MultiBuy documentation
*   **[Tiered Pricing API Reference](tieredPricingApiReference.md)** - Quantity-based tiered pricing
*   **[Price API Documentation](../../Prices.md)** - Complete Price API reference
*   **[Promotions Overview](https://docs.omnium.no/docs/Prices/Promotions/promotions)** - General promotion concepts

* * *

## Support

For questions or issues:

1.  Review this documentation and troubleshooting section
2.  Check the Price API documentation for price creation details
3.  Verify promotion configuration matches conditional pricing requirements
4.  Contact your Omnium support team

* * *

## Key Differences: Conditional Pricing vs Standard MultiBuy

Understanding these differences helps you choose the right approach:

| Aspect | Standard MultiBuy | Conditional Pricing |
| --- | --- | --- |
| **Price Generation** | Automatic (system-generated) | Manual (via Price API) |
| **Discount Type** | Formula-based (%, fixed amount, fixed price) | Completely custom per product / SKU |
| **Product Qualification** | Filter-based (categories, brands, etc.) | Price-based (has promotionId) + optional filters |
| **Price Consistency** | All products get same discount formula | Each product has unique promotional price |
| **Flexibility** | Limited to formula | Unlimited - set any price you want |
| **Management** | Promotion defines everything | Promotion + separate price management |
| **Best For** | Simple, uniform discounts | Complex, customized pricing strategies |

### When to Use Each

**Use Standard MultiBuy when:**

*   All products should get the same discount percentage/amount
*   You want automatic price generation
*   Discount rules are simple and consistent
*   You prefer less maintenance

**Use Conditional Pricing when:**

*   Products need different discount levels
*   You want nice, round promotional prices ($99.00 vs $97.43)
*   You need fine-grained control over each price point
*   You have hundreds of SKUs with custom wholesale prices
*   You want to change promotional prices without touching the promotion

* * *

**Document Version**: 2.1 **Last Updated**: 2025-12-09
