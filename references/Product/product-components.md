# Product Components

Source: https://docs.omnium.no/docs/Product/product-components

> Create packages, bundles, and kits by combining multiple products as components in Omnium.

Product components enable you to create composite products that consist of multiple individual products. This feature supports packages, bundles, and kits - each with different behaviors for pricing, inventory, and order handling.

* * *

## Key Concepts

### What Are Product Components?

Components are references to other products that make up a composite product. A package or bundle product contains a list of components, where each component specifies:

*   Which product/SKU is included
*   The quantity of that product
*   Optional selectable variants
*   Price adjustments (for packages with options)

### Package Types

Omnium supports three types of composite products:

| Type | Flag | Description |
| --- | --- | --- |
| Package | `IsPackage` | Fixed collection with specific components and optional price offsets |
| Bundle | `IsBundle` | Flexible collection, often with component options |
| Kit | `IsKit` | Pre-assembled collection with independent inventory |

### Component Properties on Products

Products with components have these relevant properties:

| Property | Type | Description |
| --- | --- | --- |
| `IsPackage` | bool | Product is a package |
| `IsBundle` | bool | Product is a bundle |
| `IsKit` | bool | Product is a kit |
| `Components` | List<ProductComponent> | Collection of component products |

* * *

## Feature Overview

### Automatic Inventory Calculation

When components have inventory, the package's available inventory is automatically calculated as the minimum number of complete packages that can be assembled.

### Component Options

Components can offer selectable options, allowing customers to choose between variants:

```json
{
  "componentId": "shirt-component",
  "productId": "basic-shirt",
  "options": [
    { "skuId": "basic-shirt-blue" },
    { "skuId": "basic-shirt-red" },
    { "skuId": "basic-shirt-green" }
  ]
}
```

### Order Integration

When packages are added to orders, they can either:

*   Remain as a single line item
*   Break down into individual component lines (configurable)

* * *

## Common Use Cases

### Product Bundles (Package/Bundle)

Sell multiple products together at a discount:

*   "Starter Kit" - Includes camera, lens, and bag
*   "Gift Set" - Perfume + lotion + sample

### Configurable Packages (Bundle)

Allow customers to customize their package:

*   "Build Your Own Bundle" - Choose 3 items from a selection
*   "Meal Deal" - Pick main, side, and drink

### Pre-Assembled Products (Kit)

Products physically assembled in the warehouse before sale:

*   **Gift bags** - Holiday or promotional gift bags with multiple items
*   **Chocolate boxes** - Assorted chocolates packed as a single unit
*   **Sample kits** - Product samples bundled for demos or testing
*   **Subscription boxes** - Monthly curated boxes assembled before shipping

### Bill of Materials

Track component products for manufacturing or assembly:

*   Raw materials that combine into finished goods
*   Parts that make up a complete product

* * *

## Documentation Sections

| Section | Description |
| --- | --- |
| [Configuration](product-components/configuration.md) | Tenant settings for packages and bundles |
| [Component Model](product-components/component-model.md) | Complete property reference |
| [Package Types](product-components/package-types.md) | Differences between Package, Bundle, and Kit |
| [Inventory](product-components/inventory.md) | How component inventory is calculated |
| [Orders](product-components/orders.md) | How components work in orders |
| [API Reference](product-components/api-reference.md) | API endpoints |

* * *

## Quick Start

### 1\. Enable Packages

Enable the feature in tenant settings:

```json
{
  "ProductSettings": {
    "HasPackages": true
  }
}
```

### 2\. Create a Package Product

```json
{
  "productId": "starter-kit",
  "name": "Photography Starter Kit",
  "isPackage": true,
  "components": [
    {
      "componentId": "camera-component",
      "productId": "camera-model-x",
      "skuId": "camera-model-x-black",
      "quantity": 1
    },
    {
      "componentId": "lens-component",
      "productId": "standard-lens",
      "quantity": 1
    },
    {
      "componentId": "bag-component",
      "productId": "camera-bag",
      "quantity": 1
    }
  ]
}
```

### 3\. Package Inventory Is Calculated Automatically

If components have inventory:

*   Camera: 10 available
*   Lens: 25 available
*   Bag: 8 available

Package inventory = 8 (limited by the bag with lowest availability)
