# Prices

Source: https://docs.omnium.no/docs/Prices

> How prices work in Omnium — price levels, promotions, price lists, prioritization, and tax handling.

## Introduction

This guide explains how prices work in Omnium, including how they are structured, stored, and retrieved. It covers price levels, ID generation, and options for managing large price sets. You will also find details on using external price services and handling market-specific pricing.

* * *

## In this section

*   [Pricing & Promotions Overview](Prices/pricing-and-promotions.md) — How price creation, storage, promotions, and delivery to customers fit together
*   [Setting Up Prices](Prices/SettingUpPrices.md) — Choose the right approach for your integration and keep your price model efficient
*   [Promotions](Prices/Promotions.md) — Promotion types, API endpoints, priorities, and combination rules
*   [Campaigns](Prices/Campaigns.md) — Plan, execute, and measure promotional campaigns with revenue targets and performance tracking
*   [Price Lists](Prices/PriceLists.md) — Create and manage price lists for grouped pricing
*   [Price Prioritization](Prices/PricePrioritization.md) — How prices are filtered, sorted, and selected based on context
*   [Lowest Price History](Prices/lowest-price.md) — Automatic tracking of lowest valid price for regulatory compliance
*   [Prices and Tax](Prices/PricesAndTax.md) — Tax-inclusive and tax-exclusive pricing across different contexts

* * *

## Product Prices

### Price Levels

Prices can be set at two levels:

1.  Product-level
2.  Variant-level (not recommended!)

We **recommend setting all prices at the product level**.

If a specific variant requires a different price, it should still be defined at the product level using the `skuId` field to indicate which variant the price applies to.

If all variants share the same price, define **one product-level price** without specifying a `skuId`.

> Defining prices directly inside each variant is possible, but not recommended. It can slightly reduce performance when filtering or sorting by price, and often results in bloated product models by duplicating prices across all variants - even when the prices are identical.

**Important:**
If both a general price (without `skuId`) and a variant-specific price (with `skuId`) exist, the **variant-specific price will always be prioritized** for the matching variant.

* * *

### Best Practice Examples

**Note:** The examples below have been simplified to focus on pricing. Both the product and price models include additional properties not shown here.

#### ✅ Recommended: All variants have the same price or the product does not have variants

```json
{
  "id": "some-product",
  "prices": [
    {
      "unitPrice": 500
    }
  ]
}
```

#### ✅ Recommended: One variant has a different price

```json
{
  "id": "some-product",
  "prices": [
    {
      "unitPrice": 500
    },
    {
      "unitPrice": 2000,
      "skuId": "golden-sku"
    }
  ]
}
```

#### ✅ Recommended: All variants have different prices

```json
{
  "id": "some-product",
  "prices": [
    {
      "unitPrice": 500,
	  "skuId": "sku1"
    },
    {
      "unitPrice": 600,
      "skuId": "sku2"
    },
    {
      "unitPrice": 700,
      "skuId": "sku3"
    }
  ]
}
```

#### ❌ Not Recommended: Prices defined directly on variants

```json
{
  "id": "some-product",
  "variants": [
    {
      "skuId": "golden-sku",
      "prices": [
        {
          "unitPrice": 2000
        }
      ]
    },
    {
      "skuId": "other-sku1",
      "prices": [
        {
          "unitPrice": 500
        }
      ]
    },
    {
      "skuId": "other-sku2",
      "prices": [
        {
          "unitPrice": 500
        }
      ]
    }
  ]
}
```

### Price ID Generation

Price IDs follow this convention:

```json
{CustomerId}_{CustomerGroup}_{VariantId}_{MarketId}_{MarketGroupId}_{CurrencyCode}_{SalesCode}_{PromotionId}_{StoreId}_{PriceListId}_{ValidUntil}_{ValidFrom}
```

Override this convention using an `ExternalId` for prices fetched from external systems.

### Key Features

*   **Market-Specific Prices:** Prices can also be specific to customers, groups, or stores.
*   **External Promotion Support:** Use `IsExternalPromotion` for prices tied to external systems.
*   **Flexible Date Handling:** Use `null` for dates if no validity range is required.

### Separate Prices

For products with **100+ prices**, prices can be stored separately to avoid bloated product models. Bloated models are slower to fetch and update.

When separate prices are enabled:

*   Product searches (e.g. for PLPs) will still return products **with prices included**, but only the relevant price for the current market, customer, etc.
*   As a bonus, you can also use **dedicated price search endpoints** to search or retrieve prices directly at price-level (e.g. for reporting or customer-specific logic).

> ⚠️ Query performance on product searches will generally be slower with separate prices enabled. Only use this if you have very large price sets – for example, **customer-specific pricing** with **hundreds or thousands of prices per SKU**.

#### Alternative: Search Prices via Product Search

Instead of using dedicated price search endpoints, you could search for prices by using the **product scroll search endpoint** with specific field filtering:

```json
{
  "marketId": "NOR",
  "modifiedFrom": "2025-12-17T06:10:41.133Z",
  "includedFields": {
    "specificFields": [
      "prices"
    ]
  }
}
```

You can use any search parameters to get exactly the products (and prices) that you need. For instance, you can also filter by product IDs:

```json
{
  "marketId": "NOR",
  "productIds": [
    "1234"
  ],
  "includedFields": {
    "specificFields": [
      "prices"
    ]
  }
}
```

Please contact support if you believe you need to use separate prices, and we'll help you migrate the current data.

### External Price Service

It is possible to set up an external price service that fetches prices from a third-party system that you are hosting yourself.

⚠️ **Important:**
This is **not commonly needed** when using Omnium.
It’s intended for rare edge cases where your pricing system cannot be synchronized to Omnium through normal means.

If external prices is setup, prices will be fetched via the external service when:

*   Searching for products
*   Adding items to cart
*   Recalculating prices in cart

You may also store prices in Omnium as usual, allowing you to combine Omnium-managed prices with prices fetched from an external service.

An example where this would be the case would be if you have customer specific prices with an extremly complex price calculation that is hard (or impossible) to migrate from. You could then serve the customer specific prices form the external price service, but still keep the non-customer specific prices in Omnium.

#### Payload example

```json
{
  "customerId": "5002497",
  "customerProperties": [
    {
      "key": "Hobby",
      "value": "fishing"
    }
  ],
  "marketId": "NOR",
  "skus": [
    {
      "sku": "123",
      "price": {
        "marketId": "NOR",
        "unitPrice": 9.90,
        "currencyCode": "NOK",
        "isTaxExcluded": true
        // ... additional price properties
      },
      "isBundle": false,
      "isPackage": false,
      "quantity": 3,
      "components": [],
      "properties": [
        {
          "key": "SomeExternalSystemReference",
          "value": "ZXC"
        }
      ]
    }
  ]
}
```

*   The included `price` field contains the price from Omnium (if available).
*   Included product and customer properties can be configured. By default, **no custom properties** are included unless explicitly specified.

#### Expected Response

The external price service should return an
[OmniumExternalPriceResponse](https://apitest.omnium.no/documentation/index.html#/model-OmniumExternalPriceResponse)

⚠️ **Important:** The external price service must be optimized for speed. A slow response will degrade performance for both product search and cart operations in Omnium.

#### Setup Example

The external price service is added as a connector. Below is an example on how you could set this up with JSON:

```
"connectors": [
  {
    "name": "ExternalPricesConnector",
    "properties": [
      {
        "key": "GetPricesUrl",
        "value": "https://some.url.to/a/price/service"
      },
      {
        "key": "IncludedProductProperties",
        "value": "SomeProductProp||SomeOtherProperty"
      },
      {
        "key": "IsNonMarketSpecificPriceFallbackEnabled",
        "value": "true",
        "valueType": "Boolean"
      },
      {
        "key": "IncludedCustomerProperties",
        "value": "SomeCustomerProp||SomeOtherCustomerProp"
      }
    ],
    "customHeaders": [
      {
        "key": "custom-auth-or-whatever",
        "value": "xxx"
      }
    ]
  }
]
```

**Configuration Properties:**

*   **GetPricesUrl**: The endpoint URL for your external price service
*   **IncludedProductProperties**: Custom product properties (from the "Properties" attribute) to include in the request, separated by `||`
*   **IncludedCustomerProperties**: Custom customer properties (from the "Properties" attribute) to include in the request, separated by `||`
*   **IsNonMarketSpecificPriceFallbackEnabled**: When set to `true`, enables fallback to non-market-specific prices if market-specific prices are not available
*   **customHeaders**: Any custom headers required for authentication or other purposes

* * *
