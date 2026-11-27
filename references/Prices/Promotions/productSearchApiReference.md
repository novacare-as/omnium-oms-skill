# Product Search

Source: https://docs.omnium.no/docs/Prices/Promotions/productSearchApiReference

> API reference for creating and managing Product Search promotions in Omnium OMS. Target products dynamically using flexible search criteria like tags, price ranges, stock status, and more.

# Product Search API Reference

## Table of Contents

1.  [Overview](productSearchApiReference.md#overview)
2.  [How It Works](productSearchApiReference.md#how-it-works)
3.  [API Endpoints](productSearchApiReference.md#api-endpoints)
4.  [Data Models](productSearchApiReference.md#data-models)
5.  [Creating Promotions](productSearchApiReference.md#creating-promotions)
6.  [Examples](productSearchApiReference.md#examples)
7.  [Advanced Features](productSearchApiReference.md#advanced-features)
8.  [Best Practices](productSearchApiReference.md#best-practices)
9.  [Troubleshooting](productSearchApiReference.md#troubleshooting)

* * *

## Overview

Product Search promotions use Omnium's product search engine to dynamically determine which products qualify for a discount. Instead of selecting products by category or brand, you define search criteria — tags, price ranges, stock levels, suppliers, properties, and more — and Omnium matches products at evaluation time.

### Key Features

*   **Dynamic product selection**: Products are matched at evaluation time based on search criteria, so newly added products that meet the criteria are automatically included
*   **Flexible filtering**: Combine tags, price ranges, stock status, suppliers, categories, properties, facets, and date-based filters
*   **Automatic price generation**: Matching products get promotion prices visible on PLPs and PDPs
*   **Percentage or fixed amount discounts**: Simple percentage, tiered percentage steps, or market-specific fixed amounts

### Common Use Cases

*   Tag-based campaigns: "20% off all products tagged 'Summer2026'"
*   Supplier promotions: "15% off all products from supplier X"
*   Stock clearance: "Discount on products in stock at warehouse Y"
*   Price-range targeting: "10% off all products between 100-500 NOK"
*   New arrivals: "25% off products published in the last 30 days"
*   Property-based: "Discount on products with a specific attribute"

### Key Differences from Other Promotions

| Feature | Product Search | Category/Brand (Type 1) | MultiBuy (Type 2) |
| --- | --- | --- | --- |
| Product selection | Dynamic search criteria | Predefined categories/brands | Predefined categories/brands |
| Generates prices | Yes | Yes | No |
| Discount model | Flat percentage or fixed amount | Flat percentage or fixed amount | Buy X get Y at discount |
| Supports stock filtering | Yes | No | No |
| Supports price range filtering | Yes | No | No |
| Supports tag filtering | Yes | No | No |
| Supports facet filtering | Yes | No | No |
| Supports date-based filtering | Yes | No | No |
| Re-evaluates on product changes | Yes (at next evaluation) | Needs manual update | Needs manual update |

* * *

## How It Works

### Promotion Workflow

1.  **Create the promotion** with a `productSearchRequest` defining which products qualify and a `reward` defining the discount
2.  **Omnium searches** for all matching products using the search criteria
3.  **Prices are generated** on matching products — customers see the discounted price on PLPs and PDPs
4.  **At checkout**, when a cart is evaluated, the promotion searches the cart's products against the criteria and applies the discount to matching order lines
5.  **Products are re-evaluated** periodically — if products are added, removed, or modified, the matching set updates automatically

### Price Generation

Product Search promotions **generate prices automatically** on matching products, so the discounted price is visible before items are added to the cart. The system:

1.  Runs the search criteria against the full product catalog
2.  Creates promotion prices on each matching product
3.  Tracks the number of matched products in `totalHits`
4.  Records the timestamp in `lastPriceUpdate`

Price generation does **not** happen when:

*   `isBonusPointsReward` is `true`
*   `orderTypes` is set (these depend on order context)
*   A coupon code is required

### Cart Evaluation

When an order or cart is processed:

1.  The system collects SKU IDs from the cart's line items
2.  It clones the promotion's `productSearchRequest` and adds the cart's SKU IDs to narrow the search
3.  Products matching both the search criteria AND present in the cart receive the discount
4.  Discounts are applied as order line discounts

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

The main request model for creating a Product Search promotion.

```json
{
  "id": "string (Unique Id of the promotion, GUID will be generated if not provided)",
  "name": "Summer Sale - Tag Based",
  "title": "20% off Summer Collection",
  "activeFrom": "2026-06-01T00:00:00Z",
  "activeTo": "2026-08-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "stores": [],
  "filterOnWarehouseStores": false,
  "customerGroups": [],
  "priority": 100,
  "couponCode": null,
  "additionalCoupons": [],
  "canBeCombinedWithOtherPromotions": false,
  "alwaysApply": false,
  "customerClubMembersOnly": false,
  "isBonusPointsReward": false,
  "orderTypes": [],
  "tags": ["Summer2026"],
  "properties": [],
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 20.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "tags": ["Summer2026"],
      "isActive": true
    }
  }
}
```

### OmniumPromotionTypeRequest

The promotion-specific configuration within `promotionData`.

```json
{
  "promotionType": 5,
  "reward": {
    "percentage": 20.0,
    "usePercentage": true
  },
  "productSearchRequest": {
    "tags": ["Summer2026"],
    "isInStock": true,
    "isActive": true
  }
}
```

#### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `promotionType` | int | Yes | Must be `5` for Product Search promotions |
| `reward` | OmniumPromotionReward | Yes | Discount configuration (percentage, tiered percentage, or fixed amount) |
| `productSearchRequest` | OmniumProductSearchRequest | Yes | Product search criteria defining which products qualify |

### OmniumPromotionReward

Defines the discount to apply. Supports three modes: flat percentage, tiered percentage steps, and fixed amount per currency/market.

**Flat percentage discount:**

```json
{
  "percentage": 25.0,
  "usePercentage": true
}
```

**Tiered percentage discount** (increasing discount based on order amount):

```json
{
  "usePercentage": true,
  "percentageSteps": [
    {
      "amount": 500,
      "percentage": 10.0,
      "currency": "NOK",
      "marketId": "NOR"
    },
    {
      "amount": 1000,
      "percentage": 15.0,
      "currency": "NOK",
      "marketId": "NOR"
    },
    {
      "amount": 2000,
      "percentage": 20.0,
      "currency": "NOK",
      "marketId": "NOR"
    }
  ]
}
```

**Fixed amount discount:**

```json
{
  "usePercentage": false,
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
  ]
}
```

#### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `percentage` | decimal | Conditional | Flat percentage discount (0-100). Required if `usePercentage = true` and `percentageSteps` is not set |
| `percentageSteps` | array | Conditional | Tiered percentage discounts that increase based on order amount. Each step has `amount` (threshold), `percentage`, `currency`, and `marketId` |
| `usePercentage` | bool | Yes | `true` for percentage or tiered percentage, `false` for fixed amount |
| `promotionAmounts` | array | Conditional | Fixed amount discounts per currency/market. Required if `usePercentage = false` |

### OmniumProductSearchRequest

Defines the search criteria for qualifying products. All criteria are combined with AND logic — products must match all specified filters.

#### Core Product Filtering

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `productIds` | string\[\] (max 2000) | Specific product IDs | `["prod1", "prod2"]` |
| `excludedProductIds` | string\[\] (max 2000) | Exclude specific products | `["prod3"]` |
| `productParentIds` | string\[\] (max 2000) | Filter by parent product IDs | `["parent1"]` |
| `productCategoryIds` | string\[\] (max 250) | Include products in these categories | `["cat123"]` |
| `tags` | string\[\] (max 250) | Include products with any of these tags | `["Summer", "Sale"]` |
| `excludedTags` | string\[\] (max 250) | Exclude products with any of these tags | `["Clearance"]` |
| `productType` | string | Filter by product type | `"Clothing"` |
| `searchText` | string (max 200) | Full-text search | `"summer dress"` |

#### Market and Store Filtering

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `marketId` | string | Filter by single market | `"NOR"` |
| `marketIds` | string\[\] | Filter by multiple markets | `["NOR", "SWE"]` |
| `marketGroupId` | string | Filter by market group | `"Nordics"` |
| `marketGroupIds` | string\[\] | Filter by multiple market groups | `["Nordics"]` |
| `storeId` | string | Filter by single store | `"store1"` |
| `storeIds` | string\[\] | Filter by multiple stores | `["store1", "store2"]` |
| `storeGroupIds` | string\[\] | Filter by store groups | `["group1"]` |

#### Price Filtering

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `priceFrom` | decimal? | Minimum price | `50.00` |
| `priceTo` | decimal? | Maximum price | `200.00` |
| `storeIdPriceFilter` | string | Filter prices by store | `"store1"` |
| `customerGroups` | string\[\] (max 250) | Filter prices by customer groups | `["VIP"]` |
| `isOnSale` | bool? | Products currently on sale | `true` |
| `isCostOnSale` | bool? | Products with cost on sale (requires separate cost prices enabled) | `true` |

#### Stock and Status Filtering

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `isInStock` | bool? | `true` = in stock, `false` = out of stock, `null` = both | `true` |
| `inStockMarketIds` | string\[\] (max 250) | Markets to check stock for. If not set, any market counts | `["NOR"]` |
| `inStockWarehouseIds` | string\[\] (max 500) | Warehouses to check stock for | `["warehouse1"]` |
| `isActive` | bool | `true` = active products only, `false` = both active and inactive | `true` |
| `isInactive` | bool | `true` = inactive products only (ignored if `isActive` is `true`) | `false` |
| `isPublished` | bool? | `true` = published products only | `true` |
| `isDeleted` | bool | `true` = deleted products only. Defaults to `false` | `false` |

#### Product Type Filtering

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `isSku` | bool? | `true` = SKU products only (no variants), `false` = non-SKU only | `true` |
| `isBundle` | bool? | `true` = bundle products only | `false` |
| `isPackage` | bool? | `true` = package products only | `false` |
| `isMainProductVariant` | bool? | `true` = main variants only | `true` |

#### Date-Based Filtering

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `modifiedFrom` | DateTime? | Products modified after this date | `"2026-01-01T00:00:00Z"` |
| `modifiedTo` | DateTime? | Products modified before this date | `"2026-06-30T23:59:59Z"` |
| `daysSincePublished` | int? | Products published within this many days (replaces `startPublishFrom`) | `30` |
| `startPublishFrom` | DateTime? | Publish start date from | `"2026-01-01T00:00:00Z"` |
| `startPublishTo` | DateTime? | Publish start date to | `"2026-12-31T23:59:59Z"` |
| `stopPublishFrom` | DateTime? | Stop-publish date from | `"2026-01-01T00:00:00Z"` |
| `stopPublishTo` | DateTime? | Stop-publish date to | `"2026-12-31T23:59:59Z"` |

#### Supplier and Assortment

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `supplierIds` | string\[\] (max 250) | Filter by supplier IDs | `["supplier1"]` |
| `supplierSkuIds` | string\[\] (max 250) | Filter by supplier SKU IDs | `["sku123"]` |
| `assortmentCodeIds` | string\[\] (max 500) | Filter by assortment codes | `["assort1"]` |
| `isAssortmentCodesRequired` | bool? | When `true`, products must match assortment codes | `true` |

#### Property and Facet Filtering

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `property` | object | Filter by a single property key/value pair | See below |
| `propertyListId` | string | Use a predefined property list from settings | `"list1"` |
| `facets` | array (max 250) | Filter by facet types and values (e.g., Brand, Color) | See below |

**Property filtering example:**

```json
{
  "property": {
    "key": "Color",
    "value": "Red"
  }
}
```

**Facet filtering example** (filter by Brand and Season facets):

```json
{
  "facets": [
    {
      "facetType": "Brand",
      "facets": [
        { "name": "Nike" },
        { "name": "Adidas" }
      ]
    },
    {
      "facetType": "Season",
      "facets": [
        { "name": "SS26" }
      ]
    }
  ]
}
```

#### Advanced Options

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| `gtins` | string\[\] (max 250) | Filter by GTIN/EAN/UPC codes | `["1234567890"]` |
| `externalIds` | string\[\] (max 250) | Filter by external IDs | `["ext123"]` |
| `componentIds` | string\[\] | Products containing specific components | `["comp1"]` |
| `promotionIds` | string\[\] (max 250) | Products with active prices from specific promotions | `["promo1"]` |
| `seoUris` | string\[\] (max 250) | Filter by SEO URIs | `["/summer-shoes"]` |

* * *

## Creating Promotions

### Tag-Based Promotion

**Scenario**: "20% off all products tagged 'Summer2026'"

```json
{
  "name": "Summer Sale 2026",
  "title": "20% Off Summer Collection!",
  "activeFrom": "2026-06-01T00:00:00Z",
  "activeTo": "2026-08-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 100,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 20.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "tags": ["Summer2026"],
      "isActive": true
    }
  }
}
```

### Price Range Promotion

**Scenario**: "10% off all products priced between 100 and 500 NOK"

```json
{
  "name": "Mid-Range Discount",
  "title": "10% Off 100-500 NOK Items!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 10.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "priceFrom": 100.0,
      "priceTo": 500.0,
      "marketId": "NOR",
      "isActive": true
    }
  }
}
```

### In-Stock Promotion

**Scenario**: "15% off all in-stock products from warehouse 'MAIN'"

```json
{
  "name": "In-Stock Flash Sale",
  "title": "15% Off In-Stock Items!",
  "activeFrom": "2026-03-01T00:00:00Z",
  "activeTo": "2026-03-07T23:59:59Z",
  "markets": ["NOR"],
  "priority": 100,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 15.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "isInStock": true,
      "inStockWarehouseIds": ["MAIN"],
      "marketId": "NOR",
      "isActive": true
    }
  }
}
```

### Fixed Amount Discount

**Scenario**: "50 NOK off products tagged 'NewArrival'"

```json
{
  "name": "New Arrival Discount",
  "title": "50 NOK Off New Arrivals!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-02-28T23:59:59Z",
  "markets": ["NOR"],
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "usePercentage": false,
      "promotionAmounts": [
        {
          "amount": 50.00,
          "currency": "NOK",
          "marketId": "NOR"
        }
      ]
    },
    "productSearchRequest": {
      "tags": ["NewArrival"],
      "marketId": "NOR",
      "isActive": true
    }
  }
}
```

* * *

## Examples

### Example 1: Recently Published Products

**Scenario**: "25% off products published in the last 30 days"

```json
{
  "name": "New Product Launch Promo",
  "title": "25% Off New Products!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 100,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 25.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "daysSincePublished": 30,
      "isActive": true
    }
  }
}
```

**Note**: `daysSincePublished` is rolling — products "age out" of the promotion automatically.

### Example 2: Supplier-Specific Promotion

**Scenario**: "10% off all products from supplier 'nike'"

```json
{
  "name": "Nike Supplier Discount",
  "title": "10% Off Nike Products!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-03-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 10.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "supplierIds": ["nike"],
      "isActive": true
    }
  }
}
```

### Example 3: Facet-Based Promotion

**Scenario**: "20% off all Nike products in the SS26 season"

```json
{
  "name": "Nike SS26 Campaign",
  "title": "20% Off Nike SS26!",
  "activeFrom": "2026-03-01T00:00:00Z",
  "activeTo": "2026-06-30T23:59:59Z",
  "markets": ["NOR"],
  "priority": 100,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 20.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "facets": [
        {
          "facetType": "Brand",
          "facets": [{ "name": "Nike" }]
        },
        {
          "facetType": "Season",
          "facets": [{ "name": "SS26" }]
        }
      ],
      "isActive": true
    }
  }
}
```

### Example 4: Multi-Criteria Promotion

**Scenario**: "15% off in-stock products tagged 'Winter' priced between 100-500 NOK"

```json
{
  "name": "Winter Clearance",
  "title": "15% Off Winter Collection!",
  "activeFrom": "2026-03-01T00:00:00Z",
  "activeTo": "2026-03-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 100,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 15.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "tags": ["Winter"],
      "priceFrom": 100.0,
      "priceTo": 500.0,
      "isInStock": true,
      "marketId": "NOR",
      "isActive": true
    }
  }
}
```

### Example 5: Category with Tag Exclusions

**Scenario**: "30% off category 'Shoes' except products tagged 'Premium'"

```json
{
  "name": "Shoes Sale - Standard Only",
  "title": "30% Off Shoes (Excludes Premium)!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-01-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 30.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "productCategoryIds": ["shoes"],
      "excludedTags": ["Premium"],
      "isActive": true
    }
  }
}
```

### Example 6: Tiered Percentage Steps

**Scenario**: "Increasing discount based on order amount — 10% from 500 NOK, 15% from 1000 NOK, 20% from 2000 NOK"

```json
{
  "name": "Tiered Tag Discount",
  "title": "Up to 20% Off!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "usePercentage": true,
      "percentageSteps": [
        {
          "amount": 500,
          "percentage": 10.0,
          "currency": "NOK",
          "marketId": "NOR"
        },
        {
          "amount": 1000,
          "percentage": 15.0,
          "currency": "NOK",
          "marketId": "NOR"
        },
        {
          "amount": 2000,
          "percentage": 20.0,
          "currency": "NOK",
          "marketId": "NOR"
        }
      ]
    },
    "productSearchRequest": {
      "tags": ["Eligible"],
      "isActive": true
    }
  }
}
```

### Example 7: Coupon Code Required

**Scenario**: "Use code SEARCH20 for 20% off tagged products"

```json
{
  "name": "Coupon Code Search Promo",
  "title": "Use Code SEARCH20!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "couponCode": "SEARCH20",
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 20.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "tags": ["Eligible"],
      "isActive": true
    }
  }
}
```

**Note**: Promotions with coupon codes do **not** generate product prices, since the discount only applies after the coupon is entered.

### Example 8: Multi-Currency Fixed Amount

**Scenario**: "50 NOK / 50 SEK off selected products"

```json
{
  "name": "Multi-Currency Tag Discount",
  "title": "Fixed Discount on Selected Items!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR", "SWE"],
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "usePercentage": false,
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
      ]
    },
    "productSearchRequest": {
      "tags": ["International"],
      "isActive": true
    }
  }
}
```

### Example 9: Property-Based Promotion

**Scenario**: "20% off all products with property 'Color' = 'Red'"

```json
{
  "name": "Red Items Sale",
  "title": "20% Off Red Items!",
  "activeFrom": "2026-02-01T00:00:00Z",
  "activeTo": "2026-02-14T23:59:59Z",
  "markets": ["NOR"],
  "priority": 200,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 20.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "property": {
        "key": "Color",
        "value": "Red"
      },
      "isActive": true
    }
  }
}
```

### Example 10: Customer Group Exclusive

**Scenario**: "VIP members get 25% off tagged products"

```json
{
  "name": "VIP Exclusive",
  "title": "VIP Members: 25% Off!",
  "activeFrom": "2026-01-01T00:00:00Z",
  "activeTo": "2026-12-31T23:59:59Z",
  "markets": ["NOR"],
  "customerGroups": [
    {
      "customerGroupId": "vip-members",
      "customerGroupName": "VIP Members"
    }
  ],
  "priority": 100,
  "promotionData": {
    "promotionType": 5,
    "reward": {
      "percentage": 25.0,
      "usePercentage": true
    },
    "productSearchRequest": {
      "tags": ["VIPEligible"],
      "isActive": true
    }
  }
}
```

* * *

## Advanced Features

### 1\. Dynamic Product Selection

Unlike Category/Brand promotions where you select specific categories, Product Search promotions dynamically evaluate products at evaluation time:

*   Products added after promotion creation that meet the criteria are automatically included
*   Products that no longer meet criteria are automatically excluded
*   Tag changes, stock changes, and price changes affect qualification in real time
*   No manual intervention needed when the product catalog changes

### 2\. Combining Search Criteria

All search criteria use AND logic. A product must match **all** specified filters:

```json
{
  "productSearchRequest": {
    "tags": ["Summer", "Outdoor"],
    "priceFrom": 50.0,
    "priceTo": 300.0,
    "isInStock": true,
    "inStockMarketIds": ["NOR", "SWE"],
    "supplierIds": ["supplier1"],
    "isActive": true,
    "daysSincePublished": 90
  }
}
```

This targets products that:

*   Have at least one of "Summer" or "Outdoor" tags (tags use OR within the list)
*   Are priced between 50-300
*   Are in stock in Norway or Sweden
*   Are from a specific supplier
*   Are active
*   Were published in the last 90 days

**Note**: `tags` and `excludedTags` use OR logic within their respective lists — a product matches if it has _any_ of the listed tags. But between different filter types, it's AND.

### 3\. Percentage Steps

Use `percentageSteps` to create tiered discounts that increase based on the order amount:

```json
{
  "reward": {
    "usePercentage": true,
    "percentageSteps": [
      { "amount": 500, "percentage": 10.0, "currency": "NOK", "marketId": "NOR" },
      { "amount": 1000, "percentage": 15.0, "currency": "NOK", "marketId": "NOR" },
      { "amount": 2000, "percentage": 20.0, "currency": "NOK", "marketId": "NOR" }
    ]
  }
}
```

The system selects the highest matching step based on the order amount. For a 1500 NOK order, the 15% step applies.

### 4\. Facet Filtering

Facets let you target products by attributes like Brand, Season, Color, etc. — using the same facet types configured in your Omnium product index:

```json
{
  "productSearchRequest": {
    "facets": [
      {
        "facetType": "Brand",
        "facets": [
          { "name": "Nike" },
          { "name": "Adidas" }
        ]
      }
    ]
  }
}
```

Multiple values within a facet type use OR logic (Nike OR Adidas). Multiple facet types use AND logic (must match all facet types).

### 5\. Combining with Standard Promotion Features

Product Search promotions support all standard promotion features:

**Customer Group Restrictions:**

```json
{
  "customerGroups": [
    {
      "customerGroupId": "vip-members",
      "customerGroupName": "VIP Members"
    }
  ]
}
```

**Store Restrictions:**

```json
{
  "stores": ["store1", "store2"],
  "filterOnWarehouseStores": true
}
```

**Order Type Restrictions:**

```json
{
  "orderTypes": ["online", "pos"]
}
```

**Note**: Promotions with `orderTypes` set do **not** generate product prices, since they depend on order context.

### 6\. Promotion Combination Rules

```json
{
  "canBeCombinedWithOtherPromotions": true,
  "alwaysApply": false
}
```

| Property | Description |
| --- | --- |
| `canBeCombinedWithOtherPromotions` | Allow combination with other combinable promotions |
| `alwaysApply` | Apply even if other promotions have `canBeCombinedWithOtherPromotions = false` |

### 7\. Translations

Provide localized titles and descriptions:

```json
{
  "promotionTranslations": [
    {
      "marketId": "NOR",
      "title": "20% rabatt på sommerkollektion",
      "description": "Spar på alle sommerprodukter"
    },
    {
      "marketId": "SWE",
      "title": "20% rabatt på sommarkollektionen",
      "description": "Spara på alla sommarprodukter"
    }
  ]
}
```

* * *

## Best Practices

### 1\. Be Specific with Search Criteria

Always include meaningful search criteria to limit the number of matching products. Broad searches affect both performance and can unintentionally discount products.

**Avoid** — too broad:

```json
{
  "productSearchRequest": {
    "isActive": true
  }
}
```

**Better** — targeted:

```json
{
  "productSearchRequest": {
    "tags": ["Summer2026"],
    "priceFrom": 50.0,
    "isActive": true
  }
}
```

### 2\. Test Search Criteria Before Creating the Promotion

Use the Product Search API to verify your criteria match the expected products:

```
POST /api/products/search
```

This helps you confirm the number of qualifying products and that no unexpected products are included.

### 3\. Use Tags for Flexible Product Targeting

Tags are the most flexible way to target products. They can be added and removed without changing product structure, making them ideal for promotional campaigns.

### 4\. Set Appropriate Priorities

Use spaced priority values for easier insertion later:

*   High-priority promotions: 100
*   Standard promotions: 200
*   Low-priority / fallback promotions: 300+

### 5\. Consider Price Generation Behavior

Product Search promotions generate prices on matching products. Keep in mind:

*   Coupon-required promotions do **not** generate prices
*   Promotions with `orderTypes` do **not** generate prices
*   The `totalHits` and `lastPriceUpdate` fields on the promotion track price generation progress

### 6\. Set Realistic Date Ranges

Always set `activeTo` dates to avoid promotions running indefinitely. For rolling promotions (e.g., "new arrivals"), use `daysSincePublished` instead of fixed dates.

### 7\. Use Descriptive Names

Internal names should indicate the promotion mechanics:

*   Good: "Search\_Summer2026\_20pct\_tags"
*   Bad: "Promo456"

* * *

## Troubleshooting

### Promotion Not Applying

**Check**:

1.  Is the promotion within its `activeFrom` and `activeTo` dates?
2.  Do products in the cart match the `productSearchRequest` criteria?
3.  Does the cart's market/store match the promotion's `markets`/`stores`?
4.  If using a coupon code, has it been applied to the cart?
5.  For customer group restrictions, does the customer belong to the required group?
6.  Are the search criteria too restrictive?

### No Products Qualifying

**Check**:

1.  Test the search criteria using the Product Search API (`POST /api/products/search`)
2.  Verify products exist that match ALL criteria (remember: filters use AND logic)
3.  Check if `excludedTags` are filtering out too many products
4.  Verify `isActive`, `isInStock` filters aren't excluding all products
5.  Confirm market/store filters align with available products

### Promotion Prices Not Appearing on Products

**Check**:

1.  Does the promotion have a coupon code? Coupon-required promotions don't generate prices
2.  Is `orderTypes` set? Order-type promotions don't generate prices
3.  Is `isBonusPointsReward` set to `true`? Bonus point promotions don't generate prices
4.  Check `totalHits` and `lastPriceUpdate` on the promotion to see if price generation has run
5.  The price generation runs asynchronously — allow time for it to complete

### Discount Amount Incorrect

**Check**:

1.  For fixed amount discounts, verify `promotionAmounts` includes the correct currency for the order's market
2.  For percentage discounts, verify `usePercentage = true` and `percentage` is set
3.  For percentage steps, verify the correct step is matched based on order amount
4.  Check if other promotions are being combined or blocking this one

### Performance Issues

**Check**:

1.  Search criteria specificity — avoid overly broad searches
2.  Use indexed fields (`tags`, `productCategoryIds`, `productIds`) when possible
3.  For high-traffic promotions, consider whether Category/Brand promotions (type 1) would be more efficient for simple category-based targeting

* * *

## API Response Models

### Success Response (Create)

```json
{
  "message": "Promotion 6b104835-c95c-4562-9b42-fba2e438eeec added, prices updated: 150",
  "statusCode": 200
}
```

The `prices updated` count indicates how many product prices were generated.

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
*   **Swagger**: [Promotions API Swagger Documentation](https://apitest.omnium.no/documentation/index.html#/Promotions) — interactive API explorer
*   **Category/Brand Filters**: For simpler promotions using predefined categories/brands, see [MultiBuy API Reference](multibuyApiReference.md)
*   **Date Formats**: Use ISO 8601 format (e.g., `2026-01-01T00:00:00Z`)

* * *

## Support

For questions or issues:

1.  Check this documentation
2.  Review the troubleshooting section
3.  Test search criteria using the Product Search API
4.  Examine API error messages for validation details
5.  Contact your Omnium support team

* * *

**Document Version**: 2.0 **Last Updated**: 2026 **API Version**: Compatible with Omnium OMS .NET 10.0+

**Changelog**:

*   **v2.0** (2026): Added facet filtering, percentage steps, price generation documentation, How It Works section, comparison table
*   **v1.0** (2025): Initial documentation
