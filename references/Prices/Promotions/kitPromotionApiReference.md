# Kit Promotions

Source: https://docs.omnium.no/docs/Prices/Promotions/kitPromotionApiReference

> API reference for creating and managing Kit promotions (bundle discounts) in Omnium OMS.

# Kit Promotions API Reference

## Table of Contents

1.  [Overview](kitPromotionApiReference.md#overview)
2.  [How Kit Promotions Work](kitPromotionApiReference.md#how-kit-promotions-work)
3.  [API Endpoints](kitPromotionApiReference.md#api-endpoints)
4.  [Data Models](kitPromotionApiReference.md#data-models)
5.  [Creating Kit Promotions](kitPromotionApiReference.md#creating-kit-promotions)
6.  [Examples](kitPromotionApiReference.md#examples)
7.  [Advanced Features](kitPromotionApiReference.md#advanced-features)
8.  [Best Practices](kitPromotionApiReference.md#best-practices)

* * *

## Overview

Kit promotions allow you to create bundle discounts where customers must purchase one item from each specified component group to receive a discount on the entire kit. This is ideal for creating product bundles with promotional pricing.

### Key Features

*   **Multi-component bundles**: Define multiple component groups (e.g., shirt + pants + shoes)
*   **Flexible quantities**: Control required and discounted quantities per component
*   **Multiple discount types**: Percentage, fixed amount, or fixed price discounts
*   **Required/Optional components**: Mark component groups as required or optional
*   **Category/Brand filtering**: Define which products qualify for each component

### Supported Discount Types

*   **Percentage discount** (e.g., 20% off the entire kit)
*   **Fixed amount discount** (e.g., $10 off the kit total)
*   **Fixed price** (e.g., Complete outfit for $99)

* * *

## How Kit Promotions Work

### Basic Concept

A kit promotion requires customers to purchase items from multiple **component groups** to receive a discount. Each component group can have different requirements:

**Example Kit**: "Complete Outfit Bundle"

*   **Component 1 (Required)**: 1x Shirt (any from Shirts category)
*   **Component 2 (Required)**: 1x Pants (any from Pants category)
*   **Component 3 (Optional)**: 1x Accessories (any from Accessories category)

**Reward**: 20% off the entire kit when customer has items from all required components

### Component Groups

Each component group defines:

*   **Required Quantity**: How many items customer must have from this group
*   **Discounted Quantity**: How many items from this group receive the discount
*   **Category/Brand Filter**: Which products qualify for this component
*   **Required Flag**: Whether this component is mandatory for the kit discount

### Discount Application

The kit discount is applied proportionally across all qualifying items in the customer's cart based on their individual prices and the specified discount type.

* * *

## API Endpoints

### Base URL

```
/api/promotions
```

### Create Kit Promotion

```
POST /api/promotions
Content-Type: application/json
```

**Request Body**: `OmniumPromotionRequest` with `promotionType: 4`

### Update Kit Promotion (Patch)

```
PATCH /api/promotions
Content-Type: application/json
```

**Request Body**: `OmniumPromotionPatch`

### Get Kit Promotions

```
GET /api/promotions/{id}
```

### Search Kit Promotions

```
POST /api/promotions/search
Content-Type: application/json
```

### Delete Kit Promotion

```
DELETE /api/promotions/{id}
```

* * *

## Data Models

### OmniumPromotionRequest

The main request model for creating a kit promotion.

```json
{
  "id": "string (optional, GUID will be generated if not provided)",
  "name": "Complete Outfit Kit",
  "title": "Complete Outfit - 20% Off Bundle",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US", "UK"],
  "stores": ["store1", "store2"],
  "priority": 10,
  "couponCode": "BUNDLE20",
  "canBeCombinedWithOtherPromotions": false,
  "alwaysApply": false,
  "customerClubMembersOnly": false,
  "orderTypes": ["online", "pos"],
  "tags": ["Bundle", "Outfit"],
  "promotionData": {
    "promotionType": 4,
    "categoryAndBrandFilter": {},
    "promotionKitReward": {
      "rewardType": 0,
      "promotionKitComponentGroups": []
    },
    "reward": {
      "percentage": 20.0,
      "usePercentage": true
    }
  }
}
```

### OmniumPromotionKitReward

Defines the kit-specific reward structure and component groups.

```json
{
  "rewardType": 0,
  "promotionKitComponentGroups": [
    {
      "requiredQuantity": 1,
      "discountedQuantity": 1,
      "required": true,
      "categoryAndBrandFilter": {
        "categories": [
          {
            "categoryId": "shirts",
            "name": "Shirts"
          }
        ]
      }
    }
  ]
}
```

#### Properties

| Property | Type | Description |
| --- | --- | --- |
| `rewardType` | int | Reward type: 0=Percentage, 1=Amount, 2=FixedPrice |
| `promotionKitComponentGroups` | array | List of component groups that make up the kit |

### OmniumPromotionKitComponentGroup

Defines a single component group within the kit.

```json
{
  "requiredQuantity": 1,
  "discountedQuantity": 1,
  "required": true,
  "categoryAndBrandFilter": {
    "categories": [
      {
        "categoryId": "shoes",
        "name": "Shoes"
      }
    ],
    "brands": ["Nike", "Adidas"],
    "products": [],
    "excludedCategories": [],
    "excludedBrands": [],
    "excludedProducts": []
  }
}
```

#### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `requiredQuantity` | int | No | Number of items required from this component (null = 1 or more) |
| `discountedQuantity` | int | Yes | Number of items from this component that receive discount (0 = all qualifying items) |
| `required` | bool | Yes | Whether this component group must be present for the kit discount to apply |
| `categoryAndBrandFilter` | object | Yes | Defines which products qualify for this component group |

### Reward Types

Kit promotions support three reward types:

#### Percentage Discount (rewardType: 0)

```json
{
  "promotionKitReward": {
    "rewardType": 0
  },
  "reward": {
    "percentage": 25.0,
    "usePercentage": true
  }
}
```

#### Fixed Amount Discount (rewardType: 1)

```json
{
  "promotionKitReward": {
    "rewardType": 1
  },
  "reward": {
    "promotionAmounts": [
      {
        "amount": 15.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

#### Fixed Price (rewardType: 2)

```json
{
  "promotionKitReward": {
    "rewardType": 2
  },
  "reward": {
    "promotionAmounts": [
      {
        "amount": 99.99,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

* * *

## Creating Kit Promotions

### Basic Kit Promotion (Percentage)

**Scenario**: "Complete Outfit Bundle: 20% off when you buy 1 shirt + 1 pants + 1 shoes"

```json
{
  "name": "Complete Outfit Bundle",
  "title": "Complete Outfit - 20% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 0,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "shirts",
                "name": "Shirts"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "pants",
                "name": "Pants"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "shoes",
                "name": "Shoes"
              }
            ]
          }
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

### Kit with Optional Components

**Scenario**: "Workout Bundle: Buy shirt + shorts, optionally add accessories for extra discount"

```json
{
  "name": "Workout Bundle",
  "title": "Workout Bundle - Up to 25% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 0,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "workout-shirts",
                "name": "Workout Shirts"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "shorts",
                "name": "Shorts"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": false,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "accessories",
                "name": "Workout Accessories"
              }
            ]
          }
        }
      ]
    },
    "reward": {
      "percentage": 25.0,
      "usePercentage": true
    }
  }
}
```

**Note**: When optional components are present, the discount applies to all qualifying items. The percentage might be higher to account for the variable nature of the bundle.

### Fixed Price Kit

**Scenario**: "Complete Business Look: Get shirt + tie + pants for $99"

```json
{
  "name": "Business Look Fixed Price",
  "title": "Complete Business Look - $99 Total!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 2,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "dress-shirts",
                "name": "Dress Shirts"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "ties",
                "name": "Ties"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "dress-pants",
                "name": "Dress Pants"
              }
            ]
          }
        }
      ]
    },
    "reward": {
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

* * *

## Examples

### Example 1: Brand-Specific Kit

**Scenario**: "Nike Complete Set: Buy Nike shirt + Nike shorts + Nike shoes, get 15% off"

```json
{
  "name": "Nike Complete Set",
  "title": "Nike Complete Set - 15% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US", "UK"],
  "priority": 10,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 0,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "athletic-shirts",
                "name": "Athletic Shirts"
              }
            ],
            "brands": ["Nike"]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "athletic-shorts",
                "name": "Athletic Shorts"
              }
            ],
            "brands": ["Nike"]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "athletic-shoes",
                "name": "Athletic Shoes"
              }
            ],
            "brands": ["Nike"]
          }
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

### Example 2: Multi-Currency Fixed Amount

**Scenario**: "$20 off in US, £15 off in UK for electronics bundle"

```json
{
  "name": "Electronics Bundle Discount",
  "title": "Electronics Bundle - Save Money!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US", "UK"],
  "priority": 10,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 1,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "laptops",
                "name": "Laptops"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "accessories",
                "name": "Laptop Accessories"
              }
            ]
          }
        }
      ]
    },
    "reward": {
      "promotionAmounts": [
        {
          "amount": 20.00,
          "currency": "USD",
          "marketId": "US"
        },
        {
          "amount": 15.00,
          "currency": "GBP",
          "marketId": "UK"
        }
      ]
    }
  }
}
```

### Example 3: Variable Quantity Kit

**Scenario**: "Family Pack: Buy 2 adults + 2 kids clothing items, get 30% off all"

```json
{
  "name": "Family Pack Clothing",
  "title": "Family Pack - 30% Off All Items!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 0,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 2,
          "discountedQuantity": 0,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "adult-clothing",
                "name": "Adult Clothing"
              }
            ]
          }
        },
        {
          "requiredQuantity": 2,
          "discountedQuantity": 0,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "kids-clothing",
                "name": "Kids Clothing"
              }
            ]
          }
        }
      ]
    },
    "reward": {
      "percentage": 30.0,
      "usePercentage": true
    }
  }
}
```

**Note**: `discountedQuantity: 0` means all qualifying items from that component group receive the discount.

### Example 4: Specific Products Kit

**Scenario**: "Starter Pack: Buy specific phone + specific case + specific charger"

```json
{
  "name": "Phone Starter Pack",
  "title": "Complete Phone Starter Pack - $50 Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 1,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "products": [
              {
                "productId": "iphone-15-pro",
                "productName": "iPhone 15 Pro",
                "isSku": false
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "products": [
              {
                "productId": "iphone-15-case-premium",
                "productName": "iPhone 15 Premium Case",
                "isSku": true
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "products": [
              {
                "productId": "fast-charger-20w",
                "productName": "20W Fast Charger",
                "isSku": true
              }
            ]
          }
        }
      ]
    },
    "reward": {
      "promotionAmounts": [
        {
          "amount": 50.00,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    }
  }
}
```

### Example 5: Coupon-Required Kit

**Scenario**: "Use code BUNDLE25 for special kit discount"

```json
{
  "name": "Special Bundle Code",
  "title": "Use Code BUNDLE25 for 25% Off!",
  "activeFrom": "2024-01-01T00:00:00Z",
  "activeTo": "2024-12-31T23:59:59Z",
  "markets": ["US"],
  "couponCode": "BUNDLE25",
  "priority": 5,
  "promotionData": {
    "promotionType": 4,
    "promotionKitReward": {
      "rewardType": 0,
      "promotionKitComponentGroups": [
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "jackets",
                "name": "Jackets"
              }
            ]
          }
        },
        {
          "requiredQuantity": 1,
          "discountedQuantity": 1,
          "required": true,
          "categoryAndBrandFilter": {
            "categories": [
              {
                "categoryId": "jeans",
                "name": "Jeans"
              }
            ]
          }
        }
      ]
    },
    "reward": {
      "percentage": 25.0,
      "usePercentage": true
    }
  }
}
```

* * *

## Advanced Features

### 1\. Product Property Filtering

Use product properties to create highly targeted kit components.

**Example**: "Summer Kit: Red shirts + Blue shorts + White shoes"

```json
{
  "promotionKitReward": {
    "promotionKitComponentGroups": [
      {
        "requiredQuantity": 1,
        "discountedQuantity": 1,
        "required": true,
        "categoryAndBrandFilter": {
          "categories": [
            {
              "categoryId": "shirts",
              "name": "Shirts"
            }
          ],
          "properties": [
            {
              "key": "Color",
              "value": "Red"
            },
            {
              "key": "Season",
              "value": "Summer"
            }
          ]
        }
      },
      {
        "requiredQuantity": 1,
        "discountedQuantity": 1,
        "required": true,
        "categoryAndBrandFilter": {
          "categories": [
            {
              "categoryId": "shorts",
              "name": "Shorts"
            }
          ],
          "properties": [
            {
              "key": "Color",
              "value": "Blue"
            }
          ]
        }
      },
      {
        "requiredQuantity": 1,
        "discountedQuantity": 1,
        "required": true,
        "categoryAndBrandFilter": {
          "categories": [
            {
              "categoryId": "shoes",
              "name": "Shoes"
            }
          ],
          "properties": [
            {
              "key": "Color",
              "value": "White"
            }
          ]
        }
      }
    ]
  }
}
```

### 2\. Exclusion Rules

Exclude specific products, brands, or categories from kit components.

```json
{
  "categoryAndBrandFilter": {
    "categories": [
      {
        "categoryId": "all-shoes",
        "name": "All Shoes"
      }
    ],
    "excludedBrands": ["Luxury Brand", "Premium Brand"],
    "excludedProducts": [
      {
        "productId": "limited-edition-sneakers",
        "productName": "Limited Edition Sneakers",
        "isSku": true
      }
    ]
  }
}
```

### 3\. Store and Market Targeting

Target specific stores or markets for kit promotions.

```json
{
  "markets": ["US", "CA"],
  "stores": ["flagship-store", "outlet-store"],
  "orderTypes": ["online"],
  "customerGroups": [
    {
      "customerGroupId": "premium-members",
      "customerGroupName": "Premium Members"
    }
  ]
}
```

### 4\. Seasonal Filtering

Create season-specific kits.

```json
{
  "categoryAndBrandFilter": {
    "categories": [
      {
        "categoryId": "clothing",
        "name": "Clothing"
      }
    ],
    "seasons": ["Winter", "Fall"],
    "excludedSeasons": ["Summer"]
  }
}
```

* * *

## Best Practices

### 1\. Plan Component Groups Carefully

*   **Keep it simple**: Start with 2-3 component groups for easier customer understanding
*   **Clear categories**: Ensure each component group has distinct product categories
*   **Balanced pricing**: Consider the price range of items in each component group

### 2\. Set Realistic Requirements

*   **Reasonable quantities**: Most kits work best with `requiredQuantity: 1` per component
*   **Optional components**: Use sparingly to avoid customer confusion
*   **Clear benefits**: Ensure the discount provides meaningful savings

### 3\. Use Descriptive Names

Kit promotions should have clear, descriptive names and titles:

*   Good: "Complete Outfit Bundle - 20% Off"
*   Good: "Workout Starter Kit - $25 Off"
*   Bad: "Kit Promo 1"

### 4\. Test Multiple Scenarios

Before activating kit promotions, test with various cart configurations:

1.  **Minimum requirements**: Test with exact required quantities
2.  **Extra items**: Test with more items than required
3.  **Mixed brands**: Test with different brands in each component (if allowed)
4.  **Price variations**: Test with different price points within each component

### 5\. Consider Customer Experience

*   **Clear messaging**: Ensure customers understand what's required for the discount
*   **Visual indicators**: Use kit promotions where the UI can clearly show progress
*   **Reasonable combinations**: Avoid overly complex requirements

### 6\. Multi-Currency Considerations

For multi-market promotions, always provide amounts for all relevant currencies:

```json
{
  "reward": {
    "promotionAmounts": [
      {
        "amount": 25.00,
        "currency": "USD",
        "marketId": "US"
      },
      {
        "amount": 20.00,
        "currency": "EUR",
        "marketId": "EU"
      },
      {
        "amount": 22.00,
        "currency": "GBP",
        "marketId": "UK"
      }
    ],
    "usePercentage": false
  }
}
```

* * *

## Troubleshooting

### Kit Promotion Not Applying

**Check**:

1.  Does the cart contain at least one item from each **required** component group?
2.  Do cart items meet the `requiredQuantity` for each component group?
3.  Are the products in the cart correctly categorized/branded to match the `categoryAndBrandFilter`?
4.  Is the promotion within its active date range (`activeFrom` to `activeTo`)?
5.  If using a coupon code, has it been applied to the cart?
6.  Do cart market/store match the promotion's `markets`/`stores`?

### Discount Amount Incorrect

**Check**:

1.  For fixed amount discounts, verify `promotionAmounts` includes the correct currency
2.  For fixed price promotions, ensure `rewardType: 2` and total kit price is set correctly
3.  For percentage discounts, verify `usePercentage = true` and percentage value
4.  Verify that `discountedQuantity` settings match your expectations

### Component Groups Not Working

**Check**:

1.  Verify products exist in the specified categories/brands in your product catalog
2.  Check that `required: true` components are all satisfied
3.  For optional components, ensure they're properly marked with `required: false`
4.  Validate product property filters (if used) match actual product properties

### Complex Kit Troubleshooting

For complex kits with multiple components:

1.  **Test components individually**: Temporarily create simple promotions for each component group to verify products qualify
2.  **Check exclusion rules**: Ensure `excludedCategories`, `excludedBrands`, or `excludedProducts` aren't filtering out expected items
3.  **Verify property filters**: If using product properties, ensure they exist on products and match exactly
4.  **Review combination rules**: Check if other promotions are conflicting with kit promotion application

* * *

## API Response Models

### Success Response (Create)

When a kit promotion is successfully created:

```json
{
  "message": "Promotion 6b104835-c95c-4562-9b42-fba2e438eeec added",
  "statusCode": 200
}
```

**Note:** Kit promotions do not generate individual product prices for display on product listing or detail pages. The discount is calculated at cart time when all required component items are present.

### Error Response

```json
{
  "error": "Validation error: Component group 1 is missing categoryAndBrandFilter",
  "statusCode": 400
}
```

* * *

## Additional Resources

*   **Promotion Types Overview**: Kit promotion uses `PromotionType: 4`
*   **Model Validation**: All `MaxLength` attributes indicate array size limits (typically 250 items)
*   **Date Formats**: Use ISO 8601 format (e.g., `2024-01-01T00:00:00Z`)
*   **Property Filtering**: See the [MultiBuy API Reference](multibuyApiReference.md) for detailed information on `categoryAndBrandFilter` options

* * *

## Support

For questions or issues:

1.  Check this documentation
2.  Review the troubleshooting section
3.  Examine API error messages for validation details
4.  Test kit promotions in your test environment before activating
5.  Contact your Omnium support team

* * *
