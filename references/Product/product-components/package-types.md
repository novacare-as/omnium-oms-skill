# Package Types

Source: https://docs.omnium.no/docs/Product/product-components/package-types

> Understanding the differences between Package, Bundle, and Kit product types in Omnium.

Omnium supports three types of composite products, each with different behaviors and use cases. This page explains the differences and when to use each type.

* * *

## Overview

Composite products are identified by boolean flags on the product:

| Type | Flag | Primary Use |
| --- | --- | --- |
| Package | `IsPackage` | Fixed collections with price offsets |
| Bundle | `IsBundle` | Flexible collections with component pricing |
| Kit | `IsKit` | Pre-assembled products with independent inventory |

* * *

## Package

A package is a fixed collection of products sold as a single unit, typically with a defined package price.

### Characteristics

| Aspect | Behavior |
| --- | --- |
| **Price** | Package has its own price; component options can have price offsets |
| **Inventory** | Calculated from component availability |
| **Options** | Supports component options with price adjustments |
| **Order Display** | Can break down into component lines or remain as single item |

### When to Use Packages

*   **Fixed product bundles**: Camera with lens and bag
*   **Gift sets**: Predefined collections sold at a set price
*   **Promotional bundles**: Buy-together deals with a package discount

### Package Example

```json
{
  "productId": "camera-starter-kit",
  "name": "Camera Starter Kit",
  "isPackage": true,
  "price": 999.00,
  "components": [
    {
      "componentId": "camera",
      "productId": "dslr-camera",
      "skuId": "dslr-camera-black",
      "quantity": 1
    },
    {
      "componentId": "lens",
      "productId": "standard-lens",
      "quantity": 1,
      "options": [
        { "skuId": "lens-18-55", "priceOffsets": [] },
        {
          "skuId": "lens-18-135",
          "priceOffsets": [{ "marketId": "default", "amount": 100.00 }]
        }
      ]
    },
    {
      "componentId": "bag",
      "productId": "camera-bag",
      "quantity": 1
    }
  ]
}
```

### Price Offsets

Package components can have price offsets that adjust the package price when selected:

```json
{
  "options": [
    { "skuId": "standard-option", "priceOffsets": [] },
    {
      "skuId": "premium-option",
      "priceOffsets": [{ "marketId": "default", "amount": 50.00 }]
    }
  ]
}
```

If the base package is $100 and the premium option adds $50, the total becomes $150.

* * *

## Bundle

A bundle is a collection of products where each component typically maintains its own pricing, and the bundle price may be calculated from component prices.

### Characteristics

| Aspect | Behavior |
| --- | --- |
| **Price** | Often derived from component prices |
| **Inventory** | Calculated from component availability |
| **Options** | Supports component options (price offsets less common) |
| **Order Display** | Typically breaks down into component lines |

### When to Use Bundles

*   **Configurable products**: Build-your-own computer
*   **Meal deals**: Pick your main, side, and drink
*   **Subscription boxes**: Curated collections

### Bundle Example

```json
{
  "productId": "build-your-pc",
  "name": "Build Your Own PC",
  "isBundle": true,
  "components": [
    {
      "componentId": "processor",
      "componentName": "Choose Processor",
      "quantity": 1,
      "options": [
        { "productId": "cpu-i5" },
        { "productId": "cpu-i7" },
        { "productId": "cpu-i9" }
      ]
    },
    {
      "componentId": "memory",
      "componentName": "Choose RAM",
      "quantity": 1,
      "options": [
        { "productId": "ram-16gb" },
        { "productId": "ram-32gb" }
      ]
    },
    {
      "componentId": "storage",
      "componentName": "Choose Storage",
      "quantity": 1,
      "options": [
        { "productId": "ssd-512gb" },
        { "productId": "ssd-1tb" }
      ]
    }
  ]
}
```

* * *

## Kit

A kit is a **pre-assembled** collection of products that has its own independent inventory. Unlike packages and bundles where inventory is calculated from components, kits are physically assembled in the warehouse before being sold.

### Key Concept: Pre-Assembled Products

Kits represent products that are assembled from components **before** they are sold, not at the time of purchase. The assembly process:

1.  **Reduces** inventory of each component product
2.  **Creates** inventory for the kit as a finished product
3.  **Tracks cost** based on component costs (FIFO)

Once assembled, the kit is sold as a single unit with its own inventory, pricing, and cost tracking.

### Characteristics

| Aspect | Behavior |
| --- | --- |
| **Price** | Kit has its own price (independent of component prices) |
| **Inventory** | Direct inventory - created when kit is assembled |
| **Cost** | Calculated from component costs using FIFO batches |
| **Assembly** | Physical assembly in warehouse via "Create Kit" operation |
| **Components** | Can still be sold individually as separate products |
| **Order Display** | Treated as a single product (not broken down) |

### When to Use Kits

Kits are ideal when you need to:

*   **Pre-assemble products** in the warehouse before selling
*   **Track kit inventory separately** from component inventory
*   **Sell components both individually and as assembled kits**
*   **Manage cost and valuation** for assembled products

### Common Kit Use Cases

| Use Case | Example | Why Use Kit? |
| --- | --- | --- |
| **Gift bags** | Holiday gift bag with multiple items | Pre-packed, counted as single inventory unit |
| **Goodie bags** | Event swag bag with various promotional items | Assembled before event, tracked separately |
| **Chocolate boxes** | Assorted chocolate box with multiple flavors | Each flavor sold individually or in assorted box |
| **Promotional sets** | Limited-edition collection for a campaign | Assembled in advance, tracked for promotion |
| **Sample kits** | Product samples bundled for demos/testing | Assembled from sample inventory, tracked separately |
| **Subscription boxes** | Monthly curated box with mixed products | Pre-assembled before shipping date |

### Kit Assembly Process

The assembly process happens in the warehouse before products are available for sale:

```
Before Assembly:
├── Component A: 100 units in stock
├── Component B: 80 units in stock
├── Component C: 150 units in stock
└── Kit Product: 0 units in stock

Assembly: Create 20 kits (1x A, 2x B, 1x C each)

After Assembly:
├── Component A: 80 units (-20)
├── Component B: 40 units (-40)
├── Component C: 130 units (-20)
└── Kit Product: 20 units in stock ← NEW INVENTORY
```

### Kit Example

```json
{
  "productId": "holiday-gift-bag-2024",
  "name": "Holiday Gift Bag 2024",
  "isKit": true,
  "price": 49.99,
  "components": [
    {
      "componentId": "chocolate",
      "productId": "premium-chocolate-bar",
      "skuId": "choc-dark-100g",
      "quantity": 2
    },
    {
      "componentId": "candle",
      "productId": "scented-candle",
      "skuId": "candle-vanilla",
      "quantity": 1
    },
    {
      "componentId": "mug",
      "productId": "ceramic-mug",
      "skuId": "mug-festive-red",
      "quantity": 1
    }
  ]
}
```

### Kit Cost Calculation

When assembling kits, the cost is calculated from component costs:

1.  **FIFO batches**: Component costs are taken from the oldest inventory batches first
2.  **Currency conversion**: Mixed-currency component costs are converted to a common currency
3.  **Stored on kit**: The total cost is stored on the kit's inventory batch

This cost data is used for:

*   **Profit reporting**: Calculate margin when kit is sold
*   **Inventory valuation**: Value of kit inventory for accounting

### Kit vs Package: Key Difference

| Aspect | Kit | Package |
| --- | --- | --- |
| **Inventory source** | Own inventory (pre-assembled) | Calculated from components |
| **When assembled** | Before sale (in warehouse) | At time of sale (virtual) |
| **Component inventory** | Reduced when kit is assembled | Reserved when package is ordered |
| **Cost tracking** | Tracked on kit inventory batch | Not tracked |
| **Can disassemble** | No (one-way) | N/A (never physically assembled) |

### Kit Lifecycle

```
1. Define kit product with components
2. Components exist as separate products with their own inventory
3. Warehouse assembles kits using "Create Kit" operation
4. Kit inventory increases, component inventory decreases
5. Kit is sold as a single product
6. Remaining kits can be:
   - Sold at discount
   - Written off via inventory adjustment
   - Held for future sale
```

Kit assembly is a one-way operation. Once components are assembled into a kit, they cannot be disassembled back into individual components. Plan kit quantities carefully based on expected demand.

* * *

## Comparison Table

| Feature | Package | Bundle | Kit |
| --- | --- | --- | --- |
| **Inventory** | Calculated from components | Calculated from components | Own inventory (pre-assembled) |
| **Assembly** | Virtual (at sale time) | Virtual (at sale time) | Physical (in warehouse) |
| **Fixed price** | Yes | Often calculated | Yes |
| **Price offsets on options** | Yes | No | No |
| **Cost tracking** | No | No | Yes (FIFO from components) |
| **Auto breakdown in orders** | Configurable | Yes | No |
| **Component options** | Yes | Yes | Yes |
| **Typical use case** | Gift sets, promotions | Configurable products | Pre-assembled products |

* * *

## Variant Packages

Variants can also be packages or bundles, independent of their parent product.

### Variant-Level Flags

```json
{
  "productId": "main-product",
  "isPackage": false,
  "variants": [
    {
      "skuId": "variant-single",
      "isPackage": false
    },
    {
      "skuId": "variant-bundle",
      "isPackage": true,
      "components": [...]
    }
  ]
}
```

### Use Case: Size-Based Bundling

*   Single item variant (IsPackage: false)
*   3-pack variant (IsPackage: true, quantity: 3)
*   6-pack variant (IsPackage: true, quantity: 6)

* * *

## Choosing the Right Type

### Use Package When:

*   You have a fixed set of products sold together
*   The package has its own price (not sum of components)
*   Component options should adjust the package price
*   You want to control whether orders show package or components
*   **No physical assembly is needed** - components ship separately or package is conceptual

### Use Bundle When:

*   Components have their own independent prices
*   The bundle price is calculated from selected components
*   You're building a "configurator" experience
*   Components are always shown individually in orders
*   **No physical assembly is needed** - customer selects what to include

### Use Kit When:

*   Products are **physically assembled in the warehouse** before sale
*   You need **independent inventory** for the assembled product
*   Components can also be **sold individually**
*   You need to **track cost** of assembled products for profit/valuation
*   Examples: gift bags, chocolate boxes, promotional sets, sample kits

* * *

## Migration Between Types

To change a product from one type to another:

1.  Update the appropriate flag (`IsPackage`, `IsBundle`)
2.  Review component definitions (price offsets work differently)
3.  Consider impact on existing orders
4.  Test inventory calculations

```json
{
  "productId": "my-product",
  "isPackage": false,
  "isBundle": true,
  "components": [...]
}
```

Changing types on products with existing orders may affect order history display and reporting. Test thoroughly before making changes in production.
