# MultiBuy

Source: https://docs.omnium.no/docs/Prices/Promotions/multibuyApiReference

> API reference for creating and managing MultiBuy and Mix and Match promotions in Omnium OMS.

# MultiBuy API Reference

## Table of Contents

1.  [Overview](multibuyApiReference.md#overview)
2.  [Promotion Types](multibuyApiReference.md#promotion-types)
3.  [API Endpoints](multibuyApiReference.md#api-endpoints)
4.  [Data Models](multibuyApiReference.md#data-models)
5.  [Creating Promotions](multibuyApiReference.md#creating-promotions)
6.  [Examples](multibuyApiReference.md#examples)
7.  [Advanced Features](multibuyApiReference.md#advanced-features)
8.  [Best Practices](multibuyApiReference.md#best-practices)

* * *

## Overview

MultiBuy promotions allow you to create "Buy X, Get Y at discount" type offers. The system supports two main variations:

*   **Standard MultiBuy**: Apply discounts to the same products (e.g., "Buy 2, get the 3rd at 100% off", "Buy 2 get 30% off each")
*   **Mix and Match**: Apply discounts to different products/categories (e.g., "Buy 2 shirts, get 1 pair of pants at 50% off")

### Supported discount types

*   Percentage-based discount (e.g., 50% off)
*   Fixed amount discounts (e.g., $5 off)
*   Fixed price (e.g., 3 for $99)

### Looking for Tiered Pricing?

If you need **quantity-based progressive pricing** with multiple tiers (e.g., "2 for 499, 3 for 649, 4 for 799"), see the **[Tiered Pricing Promotions API Reference](tieredPricingApiReference.md)**. Tiered pricing uses the same MultiBuy promotion type but with the `UseTieredPricing` flag enabled and `QuantityTiers` configured.

### Looking for Conditional Pricing?

If you want to **control when promotional prices are displayed** based on cart conditions (e.g., show "Buy 2 for $59.99" only when customer has 2+ items in cart), see the **[Conditional Pricing API Reference](conditionalPricingApiReference.md)**. Conditional pricing is an advanced feature that creates a better customer experience by revealing promotional prices progressively as cart conditions are met.

* * *

## Promotion Types

### Standard MultiBuy Promotion

Applies discount to the same products that qualify for the promotion.

**Example**: "Buy 2 t-shirts, get the 3rd t-shirt at 50% off"

### Mix and Match Promotion

Allows customers to buy products from one set (qualifying products) and get discounts on products from another set (discounted products).

**Example**: "Buy 2 items from Category A, get 1 item from Category B at 50% off"

### Fixed Price MultiBuy

Set a fixed total price for a specific quantity of items.

**Example**: "Any 3 items for $99"

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

The main request model for creating a promotion.

```json
{
  "id": "string (Unique Id of the promotion, GUID will be generated if not provided)",
  "name": "Multibuy Q2",
  "title": "Buy 2 get 1 free",
  "activeFrom": "2024-04-01T00:00:00Z",
  "activeTo": "2024-06-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "stores": ["store1", "store2"],
  "filterOnWarehouseStores": false,
  "customerGroups": [],
  "priority": 0,
  "couponCode": "string (optional)",
  "additionalCoupons": [],
  "canBeCombinedWithOtherPromotions": false,
  "alwaysApply": false,
  "customerClubMembersOnly": false,
  "isBonusPointsReward": false,
  "orderTypes": ["online", "pos"],
  "tags": ["BlackFriday"],
  "properties": [],
  "priceFilterMode": "None",
  "priceTypeFilter": "None",
  "useDiscountedPriceAsBase": false,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {},
    "promotionMultiBuyReward": {},
    "discountedCategories": [],
    "discountedProducts": []
  }
}
```

### OmniumPromotionMultiBuyReward

The reward configuration for MultiBuy promotions (Buy 2, get the 3rd at 50% off).

```json
{
  "requiredBuyAmount": 2,
  "numberOfDiscountedItems": 1,
  "percentage": 50.0,
  "promotionAmounts": null,
  "usePercentage": true,
  "promotionAdvancedReward": null
}
```

The reward configuration for MultiBuy promotions (Buy 2, get 50 NOK / SEK off).

```json
{
  "requiredBuyAmount": 2,
  "numberOfDiscountedItems": 0,
  "percentage": 0,
  "promotionAmounts": [
      {
        "amount": 50.00,
        "currency": "NOK",
        "marketId": "NOR"
      },
      {
        "amount": 50.00,
        "currency": "SEK",
        "marketId": "SWE"
      }
  ],
  "usePercentage": false,
  "promotionAdvancedReward": null
}
```

The reward configuration for Fixed price promotion (3 for 99 NOK).

```json
{
  "RequiredBuyAmount": 3,
  "NumberOfDiscountedItems": 0,
  "PromotionAmounts": [
      {
        "amount": 99.00,
        "currency": "NOK",
        "marketId": "NOR"
      }
  ],
  "UsePercentage": false,
  "IsFixedPrice": true
}
```

#### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `RequiredBuyAmount` | int | Yes | Number of items customer must buy to qualify |
| `NumberOfDiscountedItems` | int | Yes | Number of items that receive the discount. Set to 0 for "discount on all remaining items" |
| `Percentage` | decimal | Conditional | Percentage discount (0-100). Required if `UsePercentage = true` |
| `PromotionAmounts` | array | Conditional | Fixed amount discounts per currency/market. Required if `UsePercentage = false` (for fixed amount or fixed price promotions) |
| `UsePercentage` | bool | Yes | `true` for percentage discount, `false` for fixed amount discount |
| `IsFixedPrice` | bool | No | Set to `true` for fixed price promotions (e.g., "3 for $99"). When true, use `PromotionAmounts` to specify the fixed price |
| `PromotionAdvancedReward` | object | No | Advanced reward settings |

### OmniumCategoryAndBrandFilter

Defines which products qualify for the promotion.

```json
{
  "categories": [
    {
      "categoryId": "cat123",
      "categoryName": "T-Shirts"
    }
  ],
  "requiredCategories": [],
  "excludedCategories": [],
  "brands": ["Nike", "Adidas"],
  "excludedBrands": ["Competitor"],
  "products": [
    {
      "productId": "prod123",
      "productName": "Classic T-Shirt",
      "isSku": true
    }
  ],
  "excludedProducts": [],
  "seasons": ["Spring", "Summer"],
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

#### Property Filtering Logic

**Included Properties** (`properties`):

*   Uses **AND logic** - products must have **ALL** specified properties with matching values
*   Case-insensitive matching on both key and value
*   Products without properties are filtered out when property filters are specified
*   Example: `[{key: "Color", value: "Red"}, {key: "Size", value: "Large"}]` requires products to have BOTH Color=Red AND Size=Large

**Excluded Properties** (`excludedProperties`):

*   Uses **OR logic** - products are excluded if they have **ANY** of the specified properties
*   Case-insensitive matching on both key and value
*   Products without properties are NOT excluded
*   Example: `[{key: "Color", value: "Red"}, {key: "Size", value: "Small"}]` excludes products with Color=Red OR Size=Small

### OmniumPromotionAdvancedReward

Advanced reward configuration options.

```json
{
  "isAdvancedRewardEnabled": true,
  "isDiscountMostExpensive": true,
  "discountUsageLimit": 1
}
```

| Property | Type | Description |
| --- | --- | --- |
| `isAdvancedRewardEnabled` | bool | Enable advanced reward features |
| `isDiscountMostExpensive` | bool | Apply discount to the most expensive qualifying item instead of cheapest |
| `discountUsageLimit` | int | Maximum times this discount can be applied per cart (0 = unlimited) |

* * *

## Creating Promotions

### Basic MultiBuy Promotion (Percentage)

**Scenario**: "Buy 2, get 1 at 50% off" on all t-shirts

```json
{
  "name": "Buy 2 Get 1 Half Off - T-Shirts",
  "title": "Buy 2, Get 1 at 50% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "tshirts",
          "categoryName": "T-Shirts"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 50.0,
      "usePercentage": true
    }
  }
}
```

### MultiBuy with Fixed Amount Discount

**Scenario**: "Buy 2, get $5 off the 3rd item"

```json
{
  "name": "Buy 2 Get $5 Off",
  "title": "Buy 2, Get $5 Off the 3rd!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
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
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "promotionAmounts": [
        {
          "amount": 5.00,
          "currency": "USD",
          "marketId": "US"
        }
      ],
      "usePercentage": false
    }
  }
}
```

### Mix and Match Promotion

**Scenario**: "Buy 2 shirts, get 1 pair of pants at 50% off"

```json
{
  "name": "Buy 2 Shirts Get Pants Half Off",
  "title": "Buy 2 Shirts, Get 50% Off Pants!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
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
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 50.0,
      "usePercentage": true
    },
    "discountedCategories": [
      {
        "categoryId": "pants",
        "categoryName": "Pants"
      }
    ]
  }
}
```

**Key Difference**:

*   `categoryAndBrandFilter.categories` = Products customer must buy to qualify
*   `discountedCategories` = Products that receive the discount

### Fixed Price MultiBuy

**Scenario**: "Any 3 items for $99"

```json
{
  "name": "3 for $99",
  "title": "Any 3 Items for $99!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "sale-items",
          "categoryName": "Sale Items"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 3,
      "numberOfDiscountedItems": 0,
      "usePercentage": false,
      "isFixedPrice": true,
      "promotionAmounts": [
        {
          "amount": 99.00,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    }
  }
}
```

**Note**: For fixed price promotions, set `IsFixedPrice: true`, `UsePercentage: false`, and provide the fixed price in the `PromotionAmounts` array.

* * *

## Examples

### Example 1: Buy 3 Get 1 Free (100% Discount)

```json
{
  "name": "Buy 3 Get 1 Free",
  "title": "Buy 3, Get 1 Free!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US", "UK"],
  "priority": 5,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "brands": ["Nike"]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 3,
      "numberOfDiscountedItems": 1,
      "percentage": 100.0,
      "usePercentage": true
    }
  }
}
```

### Example 2: Buy 1 Get 1 at 50% Off (Most Expensive Item Discounted)

```json
{
  "name": "BOGO 50% Off - Most Expensive Free",
  "title": "Buy One, Get One 50% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
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
      "requiredBuyAmount": 1,
      "numberOfDiscountedItems": 1,
      "percentage": 50.0,
      "usePercentage": true,
      "promotionAdvancedReward": {
        "isAdvancedRewardEnabled": true,
        "isDiscountMostExpensive": true,
        "discountUsageLimit": 0
      }
    }
  }
}
```

### Example 3: Multi-Currency Amount Discount

**Scenario**: "$5 off in US, £4 off in UK"

```json
{
  "name": "Multi-Currency Discount",
  "title": "Buy 2, Get Discount!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US", "UK"],
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
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "promotionAmounts": [
        {
          "amount": 5.00,
          "currency": "USD",
          "marketId": "US"
        },
        {
          "amount": 4.00,
          "currency": "GBP",
          "marketId": "UK"
        }
      ],
      "usePercentage": false
    }
  }
}
```

### Example 4: Mix and Match with Specific Products

**Scenario**: "Buy any 2 main products, get 1 accessory at 75% off"

```json
{
  "name": "Buy 2 Mains Get Accessory Discount",
  "title": "Buy 2, Get Accessory at 75% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "jackets",
          "categoryName": "Jackets"
        },
        {
          "categoryId": "pants",
          "categoryName": "Pants"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 75.0,
      "usePercentage": true
    },
    "discountedProducts": [
      {
        "productId": "belt-001",
        "productName": "Leather Belt",
        "isSku": true
      },
      {
        "productId": "hat-001",
        "productName": "Baseball Cap",
        "isSku": true
      }
    ]
  }
}
```

### Example 5: Coupon Code Required

**Scenario**: "Use code SAVE20 for Buy 2 Get 1 at 20% off"

```json
{
  "name": "Coupon Code Promo",
  "title": "Use Code SAVE20!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "couponCode": "SAVE20",
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "all",
          "categoryName": "All Products"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 20.0,
      "usePercentage": true
    }
  }
}
```

### Example 6: Limited Usage Per Cart

**Scenario**: "Buy 2 Get 1 Half Off (applies only once per cart)"

```json
{
  "name": "BOGO 50% - One Time Only",
  "title": "Buy 2, Get 1 at 50% Off (Once Per Order)!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
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
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 50.0,
      "usePercentage": true,
      "promotionAdvancedReward": {
        "isAdvancedRewardEnabled": true,
        "isDiscountMostExpensive": false,
        "discountUsageLimit": 1
      }
    }
  }
}
```

### Example 7: Store-Specific Promotion

**Scenario**: "In-store only: Buy 3 Get 1 Free"

```json
{
  "name": "In-Store BOGO",
  "title": "Buy 3, Get 1 Free (In-Store Only)!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "stores": ["store-nyc", "store-la"],
  "orderTypes": ["pos"],
  "priority": 10,
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
      "requiredBuyAmount": 3,
      "numberOfDiscountedItems": 1,
      "percentage": 100.0,
      "usePercentage": true
    }
  }
}
```

### Example 8: Customer Group Exclusive

**Scenario**: "VIP Members: Buy 2 Get $10 Off"

```json
{
  "name": "VIP Member Exclusive",
  "title": "VIP Only: Buy 2, Get $10 Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "customerGroups": [
    {
      "customerGroupId": "vip-members",
      "customerGroupName": "VIP Members"
    }
  ],
  "priority": 5,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "premium",
          "categoryName": "Premium Items"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "promotionAmounts": [
        {
          "amount": 10.00,
          "currency": "USD",
          "marketId": "US"
        }
      ],
      "usePercentage": false
    }
  }
}
```

### Example 9: Property-Based Filtering

**Scenario**: "Buy 2 Red items, get 1 at 50% off (excluding Small sizes)"

```json
{
  "name": "Red Items Promo - No Small",
  "title": "Buy 2 Red Items, Get 1 at 50% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
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
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 50.0,
      "usePercentage": true
    }
  }
}
```

**How it works**:

*   Only applies to products in the "Clothing" category
*   Products must have property `Color=Red` (case-insensitive)
*   Products with property `Size=Small` are excluded
*   Customer must buy 2 qualifying items to get 1 at 50% off

### Example 10: Multiple Property Requirements

**Scenario**: "Buy 2 Large Red Cotton items, get 1 free"

```json
{
  "name": "Large Red Cotton - Buy 2 Get 1 Free",
  "title": "Large Red Cotton: Buy 2, Get 1 Free!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "properties": [
        {
          "key": "Color",
          "value": "Red"
        },
        {
          "key": "Size",
          "value": "Large"
        },
        {
          "key": "Material",
          "value": "Cotton"
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

**How it works**:

*   Products must have **ALL** three properties: `Color=Red` AND `Size=Large` AND `Material=Cotton`
*   No category restriction (applies across all categories)
*   All property matching is case-insensitive
*   Customer must buy 2 qualifying items to get 1 free

* * *

## Advanced Features

### 1\. Discount on Most Expensive Item

By default, discounts apply to the cheapest qualifying items. Enable `isDiscountMostExpensive` to apply discounts to the most expensive items instead.

**Use Case**: Premium products where you want to incentivize customers to buy more expensive items.

```
"promotionAdvancedReward": {
  "isAdvancedRewardEnabled": true,
  "isDiscountMostExpensive": true,
  "discountUsageLimit": 0
}
```

### 2\. Discount Usage Limits

Control how many times a discount can be applied within a single cart.

**Examples**:

*   `discountUsageLimit: 0` - Unlimited (e.g., "Buy 2 Get 1 Free" applies to sets of 3)
*   `discountUsageLimit: 1` - Only applies once (e.g., first set of 3 only)
*   `discountUsageLimit: 2` - Applies maximum twice per cart

```
"promotionAdvancedReward": {
  "isAdvancedRewardEnabled": true,
  "discountUsageLimit": 1
}
```

### 3\. Combining Promotions

Control whether promotions can be stacked with other promotions.

```json
{
  "canBeCombinedWithOtherPromotions": true,
  "alwaysApply": false
}
```

| Property | Description |
| --- | --- |
| `canBeCombinedWithOtherPromotions` | Allow this promotion to combine with other combinable promotions |
| `alwaysApply` | Apply even if other promotions have `canBeCombinedWithOtherPromotions = false` |

### 4\. Priority System

Promotions with **lower priority numbers** are evaluated first (0 = highest priority).

**Example**:

```json
{
  "priority": 0  // Evaluated first
}
```

### 5\. Excluded Products/Categories

Filter out specific products or categories from qualifying for the promotion.

```
"categoryAndBrandFilter": {
  "categories": [
    {
      "categoryId": "all-clothing",
      "categoryName": "All Clothing"
    }
  ],
  "excludedCategories": [
    {
      "categoryId": "luxury",
      "categoryName": "Luxury Items"
    }
  ],
  "excludedProducts": [
    {
      "productId": "limited-edition-001",
      "productName": "Limited Edition Item",
      "isSku": true
    }
  ]
}
```

### 6\. Seasonal Promotions

Target specific seasons or exclude products from certain seasons.

```
"categoryAndBrandFilter": {
  "seasons": ["Spring", "Summer"],
  "excludedSeasons": ["Winter"]
}
```

### 7\. Product Property Filtering

Filter promotions based on product properties (custom attributes/metadata). This is useful for targeting products with specific characteristics like color, size, material, style, etc.

**Key Features**:

*   Filter by exact key-value property pairs
*   Case-insensitive matching
*   Support for both inclusion and exclusion
*   AND/OR logic depending on filter type

**Use Cases**:

*   Color-specific promotions (e.g., "All Red items")
*   Size-based discounts (e.g., "Extra 10% off Large and XL")
*   Material restrictions (e.g., "Cotton products only")
*   Style targeting (e.g., "Casual collection discount")
*   Combining multiple attributes (e.g., "Red, Large, Cotton items")

**Included Properties** (`properties`):

```
"categoryAndBrandFilter": {
  "properties": [
    {
      "key": "Color",
      "value": "Red"
    },
    {
      "key": "Size",
      "value": "Large"
    }
  ]
}
```

*   **AND Logic**: Products must have ALL specified properties
*   Products without properties are excluded
*   Example above requires: Color=Red AND Size=Large

**Excluded Properties** (`excludedProperties`):

```
"categoryAndBrandFilter": {
  "excludedProperties": [
    {
      "key": "Color",
      "value": "Pink"
    },
    {
      "key": "Size",
      "value": "Small"
    }
  ]
}
```

*   **OR Logic**: Products with ANY specified property are excluded
*   Products without properties are NOT excluded
*   Example above excludes: Color=Pink OR Size=Small

**Combining with Other Filters**:

```
"categoryAndBrandFilter": {
  "categories": [
    {
      "categoryId": "shirts",
      "categoryName": "Shirts"
    }
  ],
  "brands": ["Nike"],
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
}
```

This filter applies to: Nike Shirts that are Red but not Small

**Important Notes**:

*   Property matching is case-insensitive for both keys and values
*   Both the property key AND value must match exactly (after case normalization)
*   Empty property lists have no effect (no filtering applied)
*   Property filters apply AFTER category/brand filters and BEFORE product inclusion

### 8\. Price Filters

Control which products are eligible for the MultiBuy promotion based on their price type. This prevents promotions from stacking on already-discounted or member-priced products, or restricts promotions to only those product types.

Price filter properties are set at the promotion level (not inside `promotionData`):

```json
{
  "priceFilterMode": "Exclude",
  "priceTypeFilter": "Discounted",
  "useDiscountedPriceAsBase": false,
  "promotionData": {
    "promotionType": 2,
    ...
  }
}
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `priceFilterMode` | string | `"None"` | `"None"`, `"Exclude"`, or `"Include"` |
| `priceTypeFilter` | string | `"None"` | `"Discounted"`, `"MemberPrice"`, or `"Discounted, MemberPrice"` |
| `useDiscountedPriceAsBase` | bool | `false` | Calculate discount from discounted price instead of original |

**Example**: "Buy 2, Get 1 Free" but only for full-price items:

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

For full documentation on price filters, see the [Price Filters API Reference](priceFilterApiReference.md).

### 9\. Translations

Provide localized titles and descriptions for different markets.

```json
{
  "promotionTranslations": [
    {
      "marketId": "US",
      "title": "Buy 2, Get 1 Half Off!",
      "description": "Amazing deal on all t-shirts"
    },
    {
      "marketId": "FR",
      "title": "Achetez 2, Obtenez 1 à Moitié Prix!",
      "description": "Offre incroyable sur tous les t-shirts"
    }
  ]
}
```

* * *

## Best Practices

### 1\. Set Appropriate Priorities

*   High-value promotions (e.g., flash sales): Priority 0-5
*   Standard promotions: Priority 10-20
*   Fallback/default promotions: Priority 50+

### 2\. Test Multi-Currency Scenarios

Always provide `promotionAmounts` for all markets/currencies where the promotion is active when using fixed amount discounts.

### 3\. Use Descriptive Names

Internal names should clearly indicate the promotion mechanics:

*   Good: "Buy2Get1\_50Percent\_TShirts"
*   Bad: "Promo123"

### 4\. Set Realistic Date Ranges

*   Always set `activeTo` dates to avoid promotions running indefinitely
*   For time-sensitive promotions (e.g., Black Friday), set precise times

### 5\. Consider Combination Rules

Be explicit about promotion stacking:

*   Exclusive promotions: `canBeCombinedWithOtherPromotions = false`
*   Stackable promotions: `canBeCombinedWithOtherPromotions = true`
*   Force-apply promotions: `alwaysApply = true`

### 6\. Mix and Match Clarity

When creating mix-and-match promotions:

*   Clearly define qualifying products in `categoryAndBrandFilter`
*   Clearly define discounted products in `discountedCategories` or `discountedProducts`
*   Document the behavior in the promotion's `description` field

### 7\. Monitor Usage Limits

For high-traffic promotions, consider setting `discountUsageLimit` to prevent excessive discounting on large carts.

### 8\. Use Tags for Organization

Tag promotions for easier filtering and reporting:

```json
{
  "tags": ["BlackFriday", "2024", "Clearance", "VIP"]
}
```

### 9\. Testing

Before activating promotions please test the promotions in your test environment:

1.  Test with various cart configurations
2.  Verify discount calculations
3.  Test multi-currency scenarios
4.  Validate exclusion rules
5.  Test with different customer groups

* * *

## Common Scenarios & Solutions

### Scenario 1: "Buy 2 From Category A, Get 1 From Category A OR B at 50% Off"

This requires creating a mix-and-match where discounted categories include both the qualifying category and additional categories.

```json
{
  "promotionData": {
    "promotionType": 2,
    "categoryAndBrandFilter": {
      "categories": [
        {
          "categoryId": "category-a",
          "categoryName": "Category A"
        }
      ]
    },
    "promotionMultiBuyReward": {
      "requiredBuyAmount": 2,
      "numberOfDiscountedItems": 1,
      "percentage": 50.0,
      "usePercentage": true
    },
    "discountedCategories": [
      {
        "categoryId": "category-a",
        "categoryName": "Category A"
      },
      {
        "categoryId": "category-b",
        "categoryName": "Category B"
      }
    ]
  }
}
```

### Scenario 2: "Discount All Items After Buying Required Amount"

Set `numberOfDiscountedItems: 0` to discount all remaining items in the cart.

```json
{
  "promotionMultiBuyReward": {
    "requiredBuyAmount": 3,
    "numberOfDiscountedItems": 0,
    "percentage": 10.0,
    "usePercentage": true
  }
}
```

### Scenario 3: "Tiered Discounts"

For quantity-based tiered pricing (e.g., "2 for 499, 3 for 649, 4 for 799"), use the **Tiered Pricing Promotions** feature. See the **[Tiered Pricing API Reference](https://docs.omnium.no/docs/Prices/Promotions/tieredPricingApiReference.mdx)** for complete documentation.

Alternatively, you can create multiple separate promotions with different priorities:

```
// Promotion 1: Buy 5+ items, get 30% off
{
  "name": "Buy 5 Get 30% Off",
  "priority": 1,
  "promotionMultiBuyReward": {
    "requiredBuyAmount": 5,
    "numberOfDiscountedItems": 0,
    "percentage": 30.0,
    "usePercentage": true
  }
}

// Promotion 2: Buy 3+ items, get 20% off
{
  "name": "Buy 3 Get 20% Off",
  "priority": 2,
  "promotionMultiBuyReward": {
    "requiredBuyAmount": 3,
    "numberOfDiscountedItems": 0,
    "percentage": 20.0,
    "usePercentage": true
  }
}
```

The higher priority (lower number) promotion will be evaluated first.

**Note**: The separate promotions approach is less flexible than tiered pricing, as only one promotion will apply per cart based on priority.

### Scenario 4: "Brand-Specific Exclusions"

Exclude specific brands from a category-wide promotion:

```json
{
  "categoryAndBrandFilter": {
    "categories": [
      {
        "categoryId": "shoes",
        "categoryName": "All Shoes"
      }
    ],
    "excludedBrands": ["Premium Brand", "Designer Brand"]
  }
}
```

* * *

## Troubleshooting

### Promotion Not Applying

**Check**:

1.  Is the promotion within its `activeFrom` and `activeTo` dates?
2.  Does the cart contain enough qualifying items (`requiredBuyAmount`)?
3.  Do the cart's market/store match the promotion's `markets`/`stores`?
4.  If using a coupon code, has it been applied to the cart?
5.  Are products being excluded by `excludedCategories`, `excludedBrands`, or `excludedProducts`?
6.  For customer group restrictions, does the customer belong to the required group?

### Discount Amount Incorrect

**Check**:

1.  For fixed amount discounts, verify `promotionAmounts` includes the correct currency
2.  For percentage discounts, verify `usePercentage = true` and `percentage` is set correctly
3.  Check if `isDiscountMostExpensive` is affecting which items are discounted
4.  Verify `discountUsageLimit` isn't preventing additional discount applications

### Mix and Match Not Working

**Check**:

1.  Verify `discountedCategories` or `discountedProducts` is populated
2.  Ensure cart contains products from both the qualifying AND discounted sets
3.  Check that qualifying products are correctly defined in `categoryAndBrandFilter`

### Price Filter Not Working

**Check**:

1.  Both `priceFilterMode` and `priceTypeFilter` are set to non-`None` values — both are required for filtering to take effect
2.  The product actually has the price type you're filtering on (e.g., the product must have a discounted price for `Discounted` filtering to have an effect)
3.  Values are correctly spelled: `"Exclude"`, `"Include"`, `"Discounted"`, `"MemberPrice"`
4.  Member prices take priority in classification — a price marked as customer club specific is always `MemberPrice`, even if it also has a discount amount

### Property Filtering Not Working

**Check**:

1.  Verify products have the properties defined (check product data in Omnium)
2.  Ensure property keys and values match exactly (case-insensitive but must be exact matches)
3.  For included properties, remember ALL properties must match (AND logic)
4.  For excluded properties, ANY matching property will exclude the product (OR logic)
5.  Check that products without properties are expected to be filtered out (when using included properties)
6.  Verify property key-value pairs in the promotion match the product's property structure

**Common Issues**:

*   Property key mismatch: `"Color"` vs `"color"` (both work, but must exist on product)
*   Property value mismatch: `"Red"` vs `"red"` (both work due to case-insensitive matching)
*   Missing properties: Products without ANY properties are excluded when property filters are used
*   Typos: `"Colour"` vs `"Color"` - ensure spelling matches your product data

* * *

## API Response Models

### Success Response (Create)

```json
{
  "message": "Promotion 6b104835-c95c-4562-9b42-fba2e438eeec added, prices updated: 0",
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

*   **Promotion Types Overview**: See `PromotionType` enum (0=Shipping, 1=CategoryOrBrand, 2=MultiBuy, 3=OrderAmount, 4=Kit, 5=ProductSearch, 6=PriceList)
*   **Model Validation**: All `MaxLength` attributes indicate array size limits (typically 250 items)
*   **Date Formats**: Use ISO 8601 format (e.g., `2024-01-01T00:00:00Z`)

* * *

## Support

For questions or issues:

1.  Check this documentation
2.  Review the troubleshooting section
3.  Examine API error messages for validation details
4.  Contact your Omnium support team

* * *

**Document Version**: 1.3 **Last Updated**: 2026 **API Version**: Compatible with Omnium OMS .NET 10.0+

**Changelog**:

*   **v1.3** (2026): Added price filter support (`priceFilterMode`, `priceTypeFilter`, `useDiscountedPriceAsBase`)
*   **v1.2** (2025): Added product property filtering support (`properties` and `excludedProperties` fields)
