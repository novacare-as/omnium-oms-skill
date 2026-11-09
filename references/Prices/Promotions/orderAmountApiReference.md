# Order Amount

Source: https://docs.omnium.no/docs/Prices/Promotions/orderAmountApiReference

> API reference for creating and managing Order Amount promotions in Omnium OMS.

# Order Amount API Reference

## Table of Contents

1.  [Overview](orderAmountApiReference.md#overview)
2.  [Promotion Type](orderAmountApiReference.md#promotion-type)
3.  [API Endpoints](orderAmountApiReference.md#api-endpoints)
4.  [Data Models](orderAmountApiReference.md#data-models)
5.  [Creating Promotions](orderAmountApiReference.md#creating-promotions)
6.  [Examples](orderAmountApiReference.md#examples)
7.  [New Features](orderAmountApiReference.md#new-features)
8.  [Best Practices](orderAmountApiReference.md#best-practices)

* * *

## Overview

Order Amount promotions provide flat discounts on the order total, which can be set up based on the total order value and/or the total quantity of items in the cart. This promotion type is ideal for encouraging customers to increase their cart size to reach a threshold.

### Supported Discount Types

*   Percentage-based discount (e.g., 10% off)
*   Fixed amount discounts (e.g., $10 off)
*   Multi-currency support
*   Minimum order amount condition
*   Minimum total quantity condition
*   AND/OR condition operator for combining conditions

### Common Use Cases

*   "Get $10 off orders over $100"
*   "10% off when you buy 5 or more items"
*   "Use code BF2025 for 20% off your order"
*   "$10 off when order is $100+ AND you have 3+ items"
*   "10% off when order is $50+ OR you have 5+ items"

* * *

## Promotion Type

Order Amount promotions use `promotionType: 3` (OrderAmountPromotion).

### How It Works

1.  The system evaluates the order total against configured amount conditions or coupon codes
2.  Optionally evaluates the total item quantity against minimum quantity
3.  Combines conditions using AND or OR operator
4.  If conditions are met, the configured discount is applied to the order total

### Price Generation

Order Amount promotions **do not generate product prices**. The discount is applied as a flat discount that is subtracted from the order total.

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

The main request model for creating an Order Amount promotion.

```json
{
  "id": "string (Optional, GUID will be generated if not provided)",
  "name": "Order Amount Q1 2025",
  "title": "$10 off orders over $100",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-03-31T23:59:59Z",
  "markets": ["US", "UK"],
  "stores": [],
  "filterOnWarehouseStores": false,
  "customerGroups": [],
  "priority": 10,
  "couponCode": null,
  "additionalCoupons": [],
  "canBeCombinedWithOtherPromotions": true,
  "alwaysApply": false,
  "customerClubMembersOnly": false,
  "isBonusPointsReward": false,
  "orderTypes": [],
  "tags": ["Spring2025"],
  "properties": [],
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": false,
      "percentage": 0,
      "promotionAmounts": [
        {
          "amount": 10.00,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 100.00,
        "currency": "USD",
        "marketId": "US"
      }
    ],
    "minQuantity": null,
    "conditionOperator": 0
  }
}
```

### OmniumPromotionType (for OrderAmountPromotion)

The promotion data configuration for order amount promotions.

```json
{
  "promotionType": 3,
  "reward": {
    "usePercentage": false,
    "percentage": 0,
    "promotionAmounts": [
      {
        "amount": 10.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  },
  "amountCondition": [
    {
      "amount": 100.00,
      "currency": "USD",
      "marketId": "US"
    }
  ],
  "minQuantity": 3,
  "conditionOperator": 0
}
```

#### Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `promotionType` | int | Yes | Must be `3` for Order Amount promotions |
| `reward` | object | Yes | The discount to apply when conditions are met |
| `amountCondition` | array | No | Minimum order amounts per market/currency. Leave empty or null for no amount condition |
| `minQuantity` | int | No | Minimum total quantity of items required. Leave null for no quantity condition |
| `conditionOperator` | int | No | How to combine conditions: `0` = AND (default), `1` = OR |

### Reward Object

`promotionAmounts` carries the reward value for both reward kinds, and `usePercentage` tells you how to read it.

```json
{
  "usePercentage": true,
  "promotionAmounts": [
    {
      "amount": 10.0,
      "currency": "NOK",
      "marketId": "NO"
    }
  ]
}
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `usePercentage` | bool | Yes | `true` for percentage discount, `false` for fixed amount |
| `promotionAmounts` | array | Yes | Reward value per market. When `usePercentage` is `true`, `amount` is a percentage (0-100) and `currency` is ignored. When `usePercentage` is `false`, `amount` is a fixed amount in `currency` |
| `percentage` | decimal | No | Not used by Order Amount promotions. Set the percentage in `promotionAmounts[].amount` instead |

An Order Amount promotion with `usePercentage: true` gives no discount unless `promotionAmounts` contains an entry whose `marketId` matches the order's market. The `percentage` property is not read for this promotion type.

Matching of `promotionAmounts` entries differs between the two modes:

| `usePercentage` | Entry is matched on |
| --- | --- |
| `true` | `marketId` only |
| `false` | `marketId` **and** `currency` |

Because `currency` is ignored in percentage mode, an entry can keep a currency value from an earlier fixed-amount setup. A reward that reads `{ "amount": 20, "currency": "NOK" }` together with `usePercentage: true` is a 20 percent discount, not 20 NOK.

### Amount Condition Object

```json
{
  "amount": 100.00,
  "currency": "USD",
  "marketId": "US"
}
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | decimal | Yes | Minimum order amount required |
| `currency` | string | Yes | Currency code (e.g., "USD", "EUR") |
| `marketId` | string | Yes | Market identifier |

### Condition Operator Enum

| Value | Name | Description |
| --- | --- | --- |
| `0` | And | Both amount AND quantity conditions must be met |
| `1` | Or | At least one condition (amount OR quantity) must be met |

* * *

## Creating Promotions

### Basic Order Amount Promotion (Coupon code only)

**Scenario**: "Get $10 off orders when using a cupon code"

```json
{
  "name": "$10 Off Orders",
  "title": "Get $10 Off when using code NEW10!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "couponCode": "NEW10",
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": false,
      "promotionAmounts": [
        {
          "amount": 10.00,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    }
  }
}
```

### Basic Order Amount Promotion (Amount Only)

**Scenario**: "Get $10 off orders over $100"

```json
{
  "name": "$10 Off Orders Over $100",
  "title": "Get $10 Off!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": false,
      "promotionAmounts": [
        {
          "amount": 10.00,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 100.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

### Percentage Discount on Order Amount

**Scenario**: "Get 15% off orders over $75"

```json
{
  "name": "15% Off Orders Over $75",
  "title": "Save 15% Today!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 15.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 75.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

### Quantity-Based Promotion

**Scenario**: "Get 10% off when you buy 5 or more items"

```json
{
  "name": "10% Off 5+ Items",
  "title": "Buy More, Save More!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 10.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [],
    "minQuantity": 5,
    "conditionOperator": 0
  }
}
```

**Note**: Leave `amountCondition` empty or null when using only quantity conditions.

### Combined Conditions with AND

**Scenario**: "$20 off when order is $150+ AND you have 3+ items"

```json
{
  "name": "$20 Off - $150 + 3 Items",
  "title": "Spend $150 & Get 3 Items for $20 Off!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 5,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": false,
      "promotionAmounts": [
        {
          "amount": 20.00,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 150.00,
        "currency": "USD",
        "marketId": "US"
      }
    ],
    "minQuantity": 3,
    "conditionOperator": 0
  }
}
```

**Note**: `conditionOperator: 0` means BOTH conditions must be met.

### Combined Conditions with OR

**Scenario**: "10% off when order is $100+ OR you have 5+ items"

```json
{
  "name": "10% Off - $100 OR 5 Items",
  "title": "Reach $100 or 5 Items for 10% Off!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 10.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 100.00,
        "currency": "USD",
        "marketId": "US"
      }
    ],
    "minQuantity": 5,
    "conditionOperator": 1
  }
}
```

**Note**: `conditionOperator: 1` means AT LEAST ONE condition must be met.

* * *

## Examples

### Example 1: Multi-Currency Amount Condition

**Scenario**: "$10 off in US, €8 off in Europe"

```json
{
  "name": "Multi-Currency Order Discount",
  "title": "Save on Large Orders!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US", "EUR"],
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": false,
      "promotionAmounts": [
        {
          "amount": 10.00,
          "currency": "USD",
          "marketId": "US"
        },
        {
          "amount": 8.00,
          "currency": "EUR",
          "marketId": "EUR"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 100.00,
        "currency": "USD",
        "marketId": "US"
      },
      {
        "amount": 90.00,
        "currency": "EUR",
        "marketId": "EUR"
      }
    ]
  }
}
```

### Example 2: Coupon Code Required

**Scenario**: "Use code SAVE15 for 15% off orders over $50"

```json
{
  "name": "Coupon Code - SAVE15",
  "title": "Use Code SAVE15 for 15% Off!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "couponCode": "SAVE15",
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 15.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 50.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

### Example 3: Free Shipping Equivalent

**Scenario**: "Free shipping (equivalent to $5.99 off) on orders over $35"

```json
{
  "name": "Free Shipping Over $35",
  "title": "Free Shipping on $35+ Orders!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": false,
      "promotionAmounts": [
        {
          "amount": 5.99,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 35.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

**Note**: For actual free shipping, use a Shipping Promotion instead.

### Example 4: VIP Customer Exclusive

**Scenario**: "VIP Members: 20% off orders over $100"

```json
{
  "name": "VIP 20% Off",
  "title": "VIP Exclusive: 20% Off!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "customerGroups": [
    {
      "customerGroupId": "vip-members",
      "customerGroupName": "VIP Members"
    }
  ],
  "priority": 5,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 20.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 100.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

### Example 5: Progressive Discount Tiers

**Scenario**: Create multiple promotions for tiered discounts based on order amount

**Promotion 1**: "15% off orders over $200"

```json
{
  "name": "15% Off Over $200",
  "priority": 1,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 15.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 200.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

**Promotion 2**: "10% off orders over $100"

```json
{
  "name": "10% Off Over $100",
  "priority": 2,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 10.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 100.00,
        "currency": "USD",
        "marketId": "US"
      }
    ]
  }
}
```

**Note**: The higher priority (lower number) promotion will be evaluated first.

### Example 6: Bulk Purchase with AND Condition

**Scenario**: "$25 off when you spend $200+ AND buy 10+ items"

```json
{
  "name": "Bulk Purchase Discount",
  "title": "Spend $200 & Buy 10+ Items for $25 Off!",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 5,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": false,
      "promotionAmounts": [
        {
          "amount": 25.00,
          "currency": "USD",
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 200.00,
        "currency": "USD",
        "marketId": "US"
      }
    ],
    "minQuantity": 10,
    "conditionOperator": 0
  }
}
```

### Example 7: Flexible Discount with OR Condition

**Scenario**: "10% off - either spend $75 or buy 6 items"

```json
{
  "name": "Flexible Discount",
  "title": "10% Off - Your Choice!",
  "description": "Spend $75 OR buy 6 items to get 10% off",
  "activeFrom": "2025-01-01T00:00:00Z",
  "activeTo": "2025-12-31T23:59:59Z",
  "markets": ["US"],
  "priority": 10,
  "promotionData": {
    "promotionType": 3,
    "reward": {
      "usePercentage": true,
      "promotionAmounts": [
        {
          "amount": 10.0,
          "marketId": "US"
        }
      ]
    },
    "amountCondition": [
      {
        "amount": 75.00,
        "currency": "USD",
        "marketId": "US"
      }
    ],
    "minQuantity": 6,
    "conditionOperator": 1
  }
}
```

* * *

## New Features

### Minimum Quantity Condition

**Version**: 2.0 (2025)

Order Amount promotions now support a minimum total quantity condition. This allows you to create promotions based on the number of items in the cart, regardless of the order total.

#### Key Features:

*   Set a minimum total quantity of items required
*   Works independently or in combination with amount conditions
*   Counted across all items in the cart

#### Use Cases:

*   "Buy 5 or more items, get 10% off"
*   "Add 3 items to cart for $5 off"
*   "Purchase 10+ items for free shipping"

#### Example:

```json
{
  "minQuantity": 5
}
```

### Condition Operator (AND/OR Logic)

**Version**: 2.0 (2025)

When both amount and quantity conditions are set, you can now control how they are evaluated using the `conditionOperator` property.

#### Operators:

| Value | Operator | Behavior | Example |
| --- | --- | --- | --- |
| `0` | AND | Both conditions must be met | Order $100+ **AND** 3+ items |
| `1` | OR | At least one condition must be met | Order $100+ **OR** 5+ items |

#### Default Behavior:

*   If not specified, defaults to `0` (AND)
*   Only applies when BOTH `amountCondition` and `minQuantity` are set
*   Ignored when only one condition type is configured

#### Use Cases:

**AND Operator** (`0`):

*   "Spend $150 AND buy 5 items for free shipping"
*   "$20 off when you spend $100 AND have 3+ items"
*   Encourages both high spend AND high quantity

**OR Operator** (`1`):

*   "10% off when you spend $50 OR buy 5 items"
*   "Free shipping on $75+ orders OR 6+ items"
*   Gives customers flexibility in how they qualify

#### Example:

```json
{
  "amountCondition": [
    {
      "amount": 100.00,
      "currency": "USD",
      "marketId": "US"
    }
  ],
  "minQuantity": 3,
  "conditionOperator": 0
}
```

### Backward Compatibility

All existing Order Amount promotions continue to work without modification:

*   Promotions without `minQuantity` behave as before (amount-only)
*   `conditionOperator` defaults to `0` (AND) if not specified
*   No breaking changes to existing API contracts

* * *

## Best Practices

### 1\. Choose the Right Condition Type

**Amount-only conditions**:

*   Best for high-value cart encouragement
*   Works well for average order value (AOV) optimization
*   Example: "$10 off orders over $100"

**Quantity-only conditions**:

*   Best for inventory clearance
*   Encourages customers to add more items
*   Example: "10% off when you buy 5+ items"

**Combined conditions (AND)**:

*   Best for premium promotions
*   Ensures both high value AND high quantity
*   Example: "$25 off when order is $200+ AND 10+ items"

**Combined conditions (OR)**:

*   Best for flexible promotions
*   Gives customers multiple paths to discount
*   Example: "10% off $75+ OR 6+ items"

### 2\. Set Appropriate Thresholds

*   Research your average order value (AOV)
*   Set thresholds slightly above AOV to encourage upselling
*   Use round numbers ($50, $100, $200)
*   For quantity, consider typical purchase patterns

### 3\. Multi-Currency Consistency

Always provide amount conditions for all active markets:

```
"amountCondition": [
  {
    "amount": 100.00,
    "currency": "USD",
    "marketId": "US"
  },
  {
    "amount": 90.00,
    "currency": "EUR",
    "marketId": "EUR"
  }
]
```

### 4\. Reward Alignment

Match reward amounts to business goals:

*   **Percentage discounts**: Better for variable cart values
*   **Fixed amounts**: Better for predictable margins

### 5\. Priority Management

*   High-value promotions (e.g., VIP offers): Priority 0-5
*   Standard promotions: Priority 10-20
*   Fallback promotions: Priority 50+

### 6\. Testing Combined Conditions

When using `minQuantity` with `amountCondition`:

1.  Test with AND operator to ensure both conditions work
2.  Test with OR operator to verify either condition triggers
3.  Test edge cases (exactly at threshold)
4.  Verify behavior in multi-currency scenarios

### 7\. Communication Clarity

When using combined conditions with OR:

*   Clearly communicate both paths to customers
*   Use description: "Spend $75 OR buy 6 items to save!"
*   Update UI/email templates to show both options

### 8\. Combination Rules

Set appropriate combination settings:

```json
{
  "canBeCombinedWithOtherPromotions": true,
  "alwaysApply": false
}
```

*   Exclusive promotions: `canBeCombinedWithOtherPromotions = false`
*   Stackable promotions: `canBeCombinedWithOtherPromotions = true`

### 9\. Date Management

*   Always set `activeTo` to prevent indefinite running
*   For seasonal promotions, set precise start/end times
*   Consider timezone implications for global markets

### 10\. Monitoring and Optimization

*   Track conversion rates at different thresholds
*   Monitor average order values before/after promotion
*   Adjust thresholds based on performance data
*   A/B test different threshold amounts

* * *

## Troubleshooting

### Promotion Not Applying

**Check**:

1.  Is the promotion within its `activeFrom` and `activeTo` dates?
2.  Does the order total meet the `amountCondition`?
3.  If `minQuantity` is set, does the cart have enough items?
4.  If both conditions are set, verify `conditionOperator`:
    *   `0` (AND): Both must be met
    *   `1` (OR): At least one must be met
5.  Does the cart's market match the promotion's `markets`?
6.  If using a coupon code, has it been applied?
7.  For customer group restrictions, does the customer belong to the group?

### Discount Amount Incorrect

**Check**:

1.  For fixed amount discounts, verify `promotionAmounts` includes the correct currency
2.  For percentage discounts, verify `usePercentage = true` and `percentage` is set correctly
3.  Verify the promotion priority isn't causing a different promotion to apply
4.  Check if other promotions with `alwaysApply = true` are interfering

### Combined Conditions Not Working as Expected

**Check**:

1.  Verify both `amountCondition` and `minQuantity` are set
2.  Check `conditionOperator` value:
    *   `0` requires BOTH conditions
    *   `1` requires AT LEAST ONE condition
3.  Test each condition independently:
    *   Set `minQuantity = null` and test amount only
    *   Set `amountCondition = []` and test quantity only
4.  Verify quantity calculation includes all items in cart

### Multi-Currency Issues

**Check**:

1.  Ensure `amountCondition` includes entry for the order's currency
2.  Verify `marketId` matches the order's market
3.  Check that reward `promotionAmounts` also includes the currency

* * *

## API Response Models

### Success Response (Create)

```json
{
  "message": "Promotion {promotion-id} added, prices updated: 0",
  "statusCode": 200
}
```

**Note**: Order Amount promotions don't generate product prices, so "prices updated" will always be 0.

### Error Response

```json
{
  "error": "Validation error message",
  "statusCode": 400
}
```

* * *

## Additional Resources

*   **Promotion Types Overview**: See main [Promotions documentation](https://docs.omnium.no/docs/Prices/Promotions/promotions)
*   **Model Validation**: All `MaxLength` attributes indicate array size limits
*   **Date Formats**: Use ISO 8601 format (e.g., `2025-01-01T00:00:00Z`)
*   **Multi-Buy Promotions**: See [MultiBuy API Reference](multibuyApiReference.md)
*   **Shipping Promotions**: See [Shipping Promotions documentation](https://docs.omnium.no/docs/Prices/Promotions/promotions#shipping-promotions)

* * *

## Support

For questions or issues:

1.  Check this documentation
2.  Review the troubleshooting section
3.  Examine API error messages for validation details
4.  Contact your Omnium support team

* * *

**Document Version**: 2.0 **Last Updated**: 2025 **API Version**: Compatible with Omnium OMS .NET 9.0+ **New in Version 2.0**:

*   Minimum quantity condition support
*   AND/OR condition operator
*   Enhanced condition evaluation logic
