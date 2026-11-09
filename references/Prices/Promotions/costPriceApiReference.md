# Cost Price Promotion

Source: https://docs.omnium.no/docs/Prices/Promotions/costPriceApiReference

> API reference for creating and managing Cost Price promotions in Omnium OMS. Calculate selling prices dynamically from cost prices with configurable markup.

# Cost Price Promotion API Reference

## Table of Contents

1.  [Overview](costPriceApiReference.md#overview)
2.  [How It Works](costPriceApiReference.md#how-it-works)
3.  [API Endpoints](costPriceApiReference.md#api-endpoints)
4.  [Data Models](costPriceApiReference.md#data-models)
5.  [Creating Promotions](costPriceApiReference.md#creating-promotions)
6.  [Examples](costPriceApiReference.md#examples)
7.  [Price Calculation Formula](costPriceApiReference.md#price-calculation-formula)
8.  [Best Practices](costPriceApiReference.md#best-practices)
9.  [Troubleshooting](costPriceApiReference.md#troubleshooting)

* * *

## Overview

Cost Price promotions allow you to dynamically calculate selling prices based on product cost prices from a linked price list, with a configurable markup percentage. This is ideal for cost-plus pricing strategies where the final price is derived from a product's cost rather than a fixed retail price.

### Key Features

*   **Cost-plus pricing**: Automatically calculate selling prices from cost prices with a percentage markup
*   **Price list integration**: Link to a price list containing product cost prices
*   **Tax-inclusive calculation**: Tax rate from the price list is applied automatically
*   **Automatic price generation**: Product prices are updated in the catalog, visible on PLPs and PDPs
*   **Product filtering**: Target specific products using category, brand, season, and property filters

### Common Use Cases

*   Outlet/clearance pricing where products are sold at cost + fixed margin
*   Wholesale pricing based on cost with standard markup
*   Dynamic pricing that automatically adjusts when cost prices change
*   Seasonal markdowns where you want to maintain a minimum margin above cost

### Key Differences from Other Promotions

| Feature | Cost Price Promotion | Category/Brand Promotion | Price List Promotion |
| --- | --- | --- | --- |
| Price source | Calculated from cost price + markup | Fixed discount on catalog price | Direct price from price list |
| Generates prices | Yes | Yes | Yes |
| Combinable | No (exclusive) | Configurable | Configurable |
| Requires price list | Yes (with cost prices) | No | Yes (with selling prices) |

* * *

## How It Works

### Price Calculation Workflow

1.  **Link a price list** containing cost prices for your products
2.  **Set a markup percentage** (e.g., 25% margin above cost)
3.  **Configure product filters** to target specific products (optional)
4.  **Omnium calculates** the selling price using the formula: `CostPrice x (1 + Markup%) x (1 + Tax%)`
5.  **Prices are generated** on matching products and displayed in the catalog
6.  **At checkout**, the promotion discount is applied as the difference between the original catalog price and the calculated cost-based price

### Example Calculation

Given:

*   Cost price: 100 NOK
*   Markup: 25%
*   Tax rate: 25%

Calculation:

```
CalculatedPrice = 100 x (1 + 25/100) x (1 + 25/100)
CalculatedPrice = 100 x 1.25 x 1.25
CalculatedPrice = 156.25 NOK
```

If the original catalog price was 299 NOK, the customer sees:

*   ~299 NOK~ **156.25 NOK** (47.7% off)

* * *

## API Endpoints

### Base URL

```
/api/promotions
```

### Create Promotion

```
POST /api/promotions
Content-Type: application/json
```

**Request Body**: `OmniumPromotionRequest`

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

### OmniumPromotionRequest

The main request model for creating a Cost Price promotion.

```json
{
  "id": "string (Unique Id of the promotion, GUID will be generated if not provided)",
  "name": "Cost Price Outlet Sale",
  "title": "Outlet Prices - Cost + 25%",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "stores": [],
  "filterOnWarehouseStores": false,
  "customerGroups": [],
  "priority": 10,
  "couponCode": null,
  "canBeCombinedWithOtherPromotions": false,
  "alwaysApply": false,
  "customerClubMembersOnly": false,
  "isBonusPointsReward": false,
  "orderTypes": [],
  "tags": ["Outlet"],
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {},
    "priceListId": "your-price-list-id",
    "markupPercentage": 25.0
  }
}
```

### CostPricePromotion Data

The promotion-specific configuration within `promotionData`.

```json
{
  "promotionType": "CostPricePromotion",
  "categoryAndBrandFilter": {
    "categories": [],
    "brands": [],
    "products": []
  },
  "priceListId": "your-price-list-id",
  "markupPercentage": 25.0
}
```

#### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `promotionType` | string | int | Yes | The promotion type for Cost Price promotions. Accepts either the enum name `"CostPricePromotion"` or its numeric value `7`. All promotion types may be given as the string name or the numeric enum value |
| `priceListId` | string | Yes | The ID of the price list containing cost prices for products |
| `markupPercentage` | decimal | Yes | Percentage markup to add on top of cost price. E.g., `25` means 25% markup. Minimum value: 0 |
| `categoryAndBrandFilter` | object | No | Filter to target specific products by category, brand, season, or properties. If omitted, applies to all products with cost prices in the linked price list |
| `reward` | object | No | Optional reward configuration (inherited from order line promotion interface) |

### OmniumCategoryAndBrandFilter

Defines which products qualify for the promotion.

```json
{
  "categories": [
    {
      "categoryId": "cat123",
      "categoryName": "Outlet"
    }
  ],
  "requiredCategories": [],
  "excludedCategories": [],
  "brands": ["Nike", "Adidas"],
  "excludedBrands": ["Premium Brand"],
  "products": [
    {
      "productId": "prod123",
      "productName": "Classic T-Shirt",
      "isSku": true
    }
  ],
  "excludedProducts": [],
  "seasons": ["SS24"],
  "excludedSeasons": [],
  "properties": [
    {
      "key": "Color",
      "value": "Red"
    }
  ],
  "excludedProperties": []
}
```

#### Filter Properties

| Property | Type | Description |
| --- | --- | --- |
| `categories` | array | Include products in these categories |
| `requiredCategories` | array | Products must be in these categories (AND logic) |
| `excludedCategories` | array | Exclude products in these categories |
| `brands` | array | Include products from these brands (case-insensitive) |
| `excludedBrands` | array | Exclude products from these brands (case-insensitive) |
| `products` | array | Include specific products/SKUs |
| `excludedProducts` | array | Exclude specific products/SKUs |
| `seasons` | array | Include products with these season values (case-insensitive) |
| `excludedSeasons` | array | Exclude products with these season values (case-insensitive) |
| `properties` | array | Include products with these property key-value pairs (case-insensitive, AND logic) |
| `excludedProperties` | array | Exclude products with any of these property key-value pairs (case-insensitive, OR logic) |

### Price List Requirements

The linked price list must contain cost prices for the products you want to apply the promotion to. Key fields on the price list:

| Property | Type | Description |
| --- | --- | --- |
| `currencyCode` | string | Currency of the price list (used for the calculated selling price) |
| `taxRate` | decimal | Tax percentage applied in the calculation formula |
| `isExcludingTax` | bool | Whether prices in the list exclude tax |
| `costCurrencyCode` | string | Currency of the cost prices (if different from selling currency) |
| `costCurrencyExchangeRate` | decimal | Exchange rate for currency conversion |

Each **PriceListItem** must have:

| Property | Type | Description |
| --- | --- | --- |
| `skuId` | string | SKU identifier for the product variant (preferred lookup key) |
| `productId` | string | Product identifier (fallback if no SKU match) |
| `cost` | decimal | Cost price in default currency |
| `costInPriceListCurrency` | decimal | Cost price in the price list currency (used if > 0, otherwise falls back to `cost`) |

* * *

## Creating Promotions

### Basic Cost Price Promotion

**Scenario**: Apply cost + 25% markup to all products in the "Outlet" category

```json
{
  "name": "Outlet Cost Plus 25%",
  "title": "Outlet Prices",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 10,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "outlet",
          "categoryName": "Outlet"
        }
      ]
    },
    "priceListId": "cost-price-list-001",
    "markupPercentage": 25.0
  }
}
```

### Brand-Specific Cost Pricing

**Scenario**: Apply cost + 15% markup to Nike products only

```json
{
  "name": "Nike Cost Plus 15%",
  "title": "Nike Special Pricing",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-06-30T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 10,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {
      "brands": ["Nike"]
    },
    "priceListId": "nike-cost-prices",
    "markupPercentage": 15.0
  }
}
```

### Zero Markup (Sell at Cost)

**Scenario**: Sell specific clearance products at cost price (no markup)

```json
{
  "name": "Clearance - At Cost",
  "title": "Final Clearance - At Cost!",
  "activeFrom": "2026-06-01T00:00:00Z",
  "activeTo": "2026-06-30T23:59:59Z",
  "markets": ["NOR"],
  "priority": 5,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "clearance",
          "categoryName": "Clearance"
        }
      ]
    },
    "priceListId": "main-cost-prices",
    "markupPercentage": 0
  }
}
```

**Note**: Setting `markupPercentage` to 0 means products are sold at cost price plus tax only.

* * *

## Examples

### Example 1: Multi-Market Cost Pricing

**Scenario**: Apply cost + 30% markup across Norwegian and Swedish markets

```json
{
  "name": "Cost Plus 30% - NOR/SWE",
  "title": "Special Outlet Pricing",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 10,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "outlet",
          "categoryName": "Outlet"
        }
      ]
    },
    "priceListId": "multi-market-cost-prices",
    "markupPercentage": 30.0
  }
}
```

**Note**: The price list's `currencyCode` and `taxRate` are used for the calculation. Ensure your price list has correct values for the target markets.

### Example 2: Season-Based Cost Pricing

**Scenario**: Mark down last season's products to cost + 10%

```json
{
  "name": "Last Season Clearance",
  "title": "Last Season - Cost + 10%",
  "activeFrom": "2026-03-01T00:00:00Z",
  "activeTo": "2026-05-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 5,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {
      "seasons": ["AW25"],
      "excludedBrands": ["Premium Brand"]
    },
    "priceListId": "aw25-cost-prices",
    "markupPercentage": 10.0
  }
}
```

### Example 3: Customer Group Exclusive

**Scenario**: VIP members get cost + 20% on all products

```json
{
  "name": "VIP Cost Pricing",
  "title": "VIP Member Exclusive Pricing",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "customerGroups": [
    {
      "customerGroupId": "vip-members",
      "customerGroupName": "VIP Members"
    }
  ],
  "priority": 5,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "priceListId": "main-cost-prices",
    "markupPercentage": 20.0
  }
}
```

### Example 4: Specific Products Only

**Scenario**: Apply cost + 5% to specific SKUs

```json
{
  "name": "Selected SKU Cost Pricing",
  "title": "Special Deal",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-03-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 10,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {
      "products": [
        {
          "productId": "SKU-001",
          "productName": "Product A",
          "isSku": true
        },
        {
          "productId": "SKU-002",
          "productName": "Product B",
          "isSku": true
        }
      ]
    },
    "priceListId": "main-cost-prices",
    "markupPercentage": 5.0
  }
}
```

### Example 5: Category with Property Filtering

**Scenario**: Apply cost + 20% to red clothing items, excluding small sizes

```json
{
  "name": "Red Clothing Cost Pricing",
  "title": "Red Collection - Special Price",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-06-30T23:59:59Z",
  "markets": ["NOR"],
  "priority": 10,
  "promotionData": {
    "promotionType": "CostPricePromotion",
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "clothing",
          "categoryName": "Clothing"
        }
      ],
      "properties": [
        {
          "key": "Color",
          "value": "Red"
        }
      ],
      "excludedProperties": [
        {
          "key": "Size",
          "value": "Small"
        }
      ]
    },
    "priceListId": "main-cost-prices",
    "markupPercentage": 20.0
  }
}
```

* * *

## Price Calculation Formula

### Formula

```
CalculatedPrice = CostPrice x MarkupMultiplier x TaxMultiplier
```

Where:

```
MarkupMultiplier = 1 + (MarkupPercentage / 100)
TaxMultiplier = 1 + (TaxRate / 100)
```

### Calculation Examples

| Cost Price | Markup % | Tax Rate % | Markup Multiplier | Tax Multiplier | Calculated Price |
| --- | --- | --- | --- | --- | --- |
| 100 | 25 | 25 | 1.25 | 1.25 | 156.25 |
| 200 | 50 | 25 | 1.50 | 1.25 | 375.00 |
| 150 | 0 | 25 | 1.00 | 1.25 | 187.50 |
| 80 | 10 | 12 | 1.10 | 1.12 | 98.56 |

### Cost Price Selection

When looking up cost prices from the price list, the system uses this priority:

1.  **`costInPriceListCurrency`** - Used if greater than 0 (preferred, avoids currency conversion)
2.  **`cost`** - Fallback if `costInPriceListCurrency` is 0 or not set

### SKU Lookup Priority

When matching products to cost prices in the price list:

1.  **By SKU ID** - Exact match on variant SKU (preferred)
2.  **By Product ID** - Fallback if no SKU match found

### Discount Calculation

The discount shown to the customer is calculated as:

```
DiscountAmount = OriginalCatalogPrice - CalculatedPrice
DiscountPercent = (DiscountAmount / OriginalCatalogPrice) x 100
```

**Note**: A discount is only applied if the calculated price is lower than the original catalog price. If the cost-based price would be higher than the existing price, no discount is created.

**Rounding**: If a rounding policy is configured on the promotion, the final calculated price is rounded accordingly (e.g., to nearest whole number or nearest .90). The discount amount and percentage are recalculated after rounding.

* * *

## Best Practices

### 1\. Ensure Cost Prices Exist

Before creating the promotion, verify that the linked price list contains cost prices for all target products. Products without matching cost prices in the price list will not be affected by the promotion.

### 2\. Set Appropriate Priorities

Cost Price promotions **cannot be combined** with other promotions (`canBeCombinedWithOtherPromotions` is always `false`). Use priority values to control which promotion takes precedence:

*   Cost price promotions for clearance: Priority 0-5
*   Standard cost pricing: Priority 10-20
*   Use `alwaysApply: true` only if this promotion should override all others

### 3\. Verify Tax Rate Configuration

The tax rate comes from the linked price list, not the promotion itself. Ensure the price list has the correct `taxRate` configured for your market.

### 4\. Use Descriptive Names

Internal names should clearly indicate the pricing strategy:

*   Good: "CostPlus25\_Outlet\_NOR"
*   Bad: "Promo1"

### 5\. Test Calculations Before Activation

Verify the formula produces expected prices:

*   Check a sample of products with known cost prices
*   Verify the tax rate is applied correctly
*   Ensure the calculated price is lower than the original catalog price

### 6\. Consider Multi-Currency Scenarios

If your price list uses `costInPriceListCurrency`, ensure values are populated for the correct currency. The system prefers `costInPriceListCurrency` over `cost` when available.

### 7\. Monitor Price Updates

After creating or modifying a Cost Price promotion, the system asynchronously updates product prices in the catalog. The `totalHits` and `lastPriceUpdate` fields on the promotion track the progress of this update.

### 8\. Set Realistic Date Ranges

Always set `activeTo` dates to avoid promotions running indefinitely. For seasonal clearance, use precise date ranges.

* * *

## Troubleshooting

### Promotion Not Generating Prices

**Check**:

1.  Is the promotion within its `activeFrom` and `activeTo` dates?
2.  Is `priceListId` set and pointing to a valid price list?
3.  Does the price list contain cost prices for the target products?
4.  Do the cost prices have values greater than 0?
5.  Are `markets` specified on the promotion?
6.  If using `orderTypes`, note that promotions with order types do **not** generate product prices automatically

**Solution**: Verify the price list contains PriceListItems with matching `skuId` or `productId` values. Check that `cost` or `costInPriceListCurrency` is greater than 0.

### Calculated Price Higher Than Original

**Problem**: No discount appears because the cost-based price exceeds the catalog price.

**Check**:

1.  Is the markup percentage too high for the product's cost-to-retail ratio?
2.  Is the tax rate in the price list correct?
3.  Is the cost price in the correct currency?

**Solution**: The promotion only applies a discount when the calculated price is **lower** than the original catalog price. Adjust the markup percentage or verify cost prices.

### Discount Not Applied at Checkout

**Check**:

1.  Does the order line have `isExcludedFromPromotions` set to `true`?
2.  Is another non-combinable promotion already applied to the same product?
3.  Does the product's SKU match a `skuId` in the price list?
4.  Is the order's market included in the promotion's `markets` list?

**Solution**: Cost Price promotions cannot be combined with other promotions. If another promotion has already been applied, the Cost Price promotion will not stack. Use `alwaysApply: true` if this promotion should override combination rules.

### Products Not Matching Filters

**Check**:

1.  Verify products are in the specified categories
2.  Ensure brand names match (case-insensitive)
3.  For property filters, confirm products have the expected property key-value pairs
4.  Check that products are not excluded by `excludedCategories`, `excludedBrands`, `excludedProducts`, or `excludedProperties`
5.  Verify products have `excludeFromPromotions` set to `false`

### Price List Currency Mismatch

**Problem**: Calculated prices seem incorrect or unexpected.

**Check**:

1.  Verify the price list's `currencyCode` matches the market currency
2.  If using `costCurrencyCode`, check the `costCurrencyExchangeRate` is correct
3.  Verify whether `costInPriceListCurrency` or `cost` is being used (system prefers `costInPriceListCurrency` when > 0)

* * *

## API Response Models

### Success Response (Create)

```json
{
  "message": "Promotion 7f8d9e1a-3b4c-5d6e-8f0a-1b2c3d4e5f6a added, prices updated: 150",
  "statusCode": 200
}
```

### Error Response

```json
{
  "error": "Validation error message",
  "statusCode": 400
}
```

* * *

## Additional Resources

*   **Promotion Types Overview**: See the [Promotions Overview](https://docs.omnium.no/docs/Prices/Promotions/index) for a summary of all promotion types
*   **Price Lists**: Cost Price promotions require a price list with cost prices. Ensure your price list is configured before creating the promotion
*   **Category/Brand Filters**: The same filter model is used across all order line promotion types. See [MultiBuy API Reference](multibuyApiReference.md) for detailed filter documentation
*   **Date Formats**: Use ISO 8601 format (e.g., `2026-01-01T00:00:00Z`)

* * *

## Support

For questions or issues:

1.  Check this documentation
2.  Review the troubleshooting section
3.  Examine API error messages for validation details
4.  Contact your Omnium support team

* * *

**Document Version**: 1.0 **Last Updated**: 2026 **API Version**: Compatible with Omnium OMS .NET 10.0+
