# Component Model Reference

Source: https://docs.omnium.no/docs/Product/product-components/component-model

> Complete property reference for the ProductComponent model in Omnium.

This page documents all properties of the `ProductComponent` model used for defining package and bundle components.

* * *

## ProductComponent Properties

| Property | Type | Description |
| --- | --- | --- |
| `ComponentId` | string | Optional identifier for this component within the package. Auto-generated at cart-time if not set on the product. |
| `ProductId` | string | Product ID of the component product |
| `SkuId` | string | Specific variant SKU (for preselection) |
| `Quantity` | decimal | Quantity of this component in the package |
| `Options` | List<ComponentOption> | Selectable variant options |
| `IsRequired` | bool | Indicates if component is required (informational only) |
| `ComponentName` | string | Display name when no default option is selected |

### Legacy Properties

| Property | Type | Description |
| --- | --- | --- |
| `Id` | string | Legacy component product ID (use `ProductId` instead) |

* * *

## Key Properties Explained

### ComponentId

Optional identifier for a component within a package definition.

```json
{
  "componentId": "camera-component-001",
  "productId": "camera-x100"
}
```

*   **Optional on the product** — if you do not set `componentId` when creating or updating a product, it will be `null` when fetched via the product API
*   **Auto-generated at cart-time** — when a package is added to a cart, the system assigns a GUID to any component that does not already have a `componentId`
*   Used to link component order lines back to the component definition
*   If you need to match order line components back to product components, set `componentId` explicitly on the product

`ComponentId` is NOT auto-generated when saving a product. It is only auto-generated when the product is added to a cart or order. If you need a stable identifier to reference components on the product level, set it yourself when creating the product.

### ProductId vs SkuId

These properties work together to identify the component product:

| Scenario | ProductId | SkuId | Behavior |
| --- | --- | --- | --- |
| Specific variant | Set | Set | Uses exact SKU specified |
| Any variant | Set | Empty | Allows any variant of the product |
| With options | Set | Empty | Customer selects from options |

**Example: Specific SKU**

```json
{
  "productId": "shirt-basic",
  "skuId": "shirt-basic-blue-m"
}
```

**Example: Any variant**

```json
{
  "productId": "shirt-basic",
  "skuId": null
}
```

### Quantity

The quantity of this component included in one package unit.

```json
{
  "componentId": "battery-pack",
  "productId": "aa-battery",
  "quantity": 4
}
```

This affects:

*   **Inventory calculation**: Available packages = floor(component\_inventory / quantity)
*   **Order lines**: Component quantity = package\_quantity × component\_quantity

### IsRequired

Indicates whether the component is mandatory for the package.

```json
{
  "componentId": "optional-accessory",
  "productId": "carrying-case",
  "isRequired": false
}
```

The `IsRequired` flag is informational only and does not enforce business logic. It's used by external systems or UI to indicate component requirements.

### ComponentName

Display name shown when no specific option is preselected.

```json
{
  "componentId": "choose-color",
  "productId": "basic-shirt",
  "componentName": "Choose Your Shirt Color",
  "options": [...]
}
```

* * *

## ComponentOption

Options allow customers to choose between different variants for a component.

### ComponentOption Properties

| Property | Type | Description |
| --- | --- | --- |
| `SkuId` | string | SKU of the selectable option |
| `ProductId` | string | Product ID (when SKU should not be defaulted) |
| `PriceOffsets` | List<Price> | Price adjustments for this option (packages only) |

### Basic Options

Simple variant selection:

```json
{
  "componentId": "shirt-component",
  "productId": "basic-shirt",
  "options": [
    { "skuId": "basic-shirt-blue-s" },
    { "skuId": "basic-shirt-blue-m" },
    { "skuId": "basic-shirt-blue-l" }
  ]
}
```

### Options with Price Offsets

For packages, options can have price adjustments:

```json
{
  "componentId": "upgrade-component",
  "productId": "lens",
  "options": [
    {
      "skuId": "lens-standard",
      "priceOffsets": []
    },
    {
      "skuId": "lens-premium",
      "priceOffsets": [
        { "marketId": "default", "amount": 50.00 }
      ]
    },
    {
      "skuId": "lens-professional",
      "priceOffsets": [
        { "marketId": "default", "amount": 150.00 }
      ]
    }
  ]
}
```

Price offsets only apply to **packages** (`IsPackage: true`), not bundles. For bundles, component prices are typically independent.

### Options with ProductId Only

Allow any variant of a product to be selected:

```json
{
  "componentId": "flexible-component",
  "options": [
    { "productId": "product-a" },
    { "productId": "product-b" }
  ]
}
```

When only `ProductId` is set, the customer can select any variant of that product.

* * *

## Complete Component Examples

### Fixed Component

A component with a specific SKU and quantity:

```json
{
  "componentId": "fixed-001",
  "productId": "camera-body",
  "skuId": "camera-body-black",
  "quantity": 1,
  "isRequired": true
}
```

### Selectable Component

A component where the customer chooses a variant:

```json
{
  "componentId": "selectable-001",
  "productId": "memory-card",
  "componentName": "Choose Memory Card Size",
  "quantity": 1,
  "isRequired": true,
  "options": [
    {
      "skuId": "memory-card-32gb",
      "priceOffsets": []
    },
    {
      "skuId": "memory-card-64gb",
      "priceOffsets": [
        { "marketId": "default", "amount": 20.00 }
      ]
    },
    {
      "skuId": "memory-card-128gb",
      "priceOffsets": [
        { "marketId": "default", "amount": 50.00 }
      ]
    }
  ]
}
```

### Optional Component

A component that may or may not be included:

```json
{
  "componentId": "optional-001",
  "productId": "extended-warranty",
  "skuId": "warranty-2year",
  "quantity": 1,
  "isRequired": false,
  "componentName": "Optional: Extended Warranty"
}
```

* * *

## Package with Multiple Components

Complete example of a package product:

```json
{
  "productId": "photography-kit",
  "name": "Professional Photography Kit",
  "isPackage": true,
  "components": [
    {
      "componentId": "camera-001",
      "productId": "pro-camera",
      "skuId": "pro-camera-black",
      "quantity": 1,
      "isRequired": true
    },
    {
      "componentId": "lens-001",
      "productId": "zoom-lens",
      "componentName": "Choose Your Lens",
      "quantity": 1,
      "isRequired": true,
      "options": [
        { "skuId": "zoom-lens-24-70" },
        {
          "skuId": "zoom-lens-70-200",
          "priceOffsets": [{ "marketId": "default", "amount": 200.00 }]
        }
      ]
    },
    {
      "componentId": "battery-001",
      "productId": "camera-battery",
      "skuId": "camera-battery-standard",
      "quantity": 2,
      "isRequired": true
    },
    {
      "componentId": "bag-001",
      "productId": "camera-bag",
      "skuId": "camera-bag-large",
      "quantity": 1,
      "isRequired": false,
      "componentName": "Optional Camera Bag"
    }
  ]
}
```

* * *

## Searching Components

Components are stored as nested objects within products, which enables queries like:

*   Find all packages containing a specific product
*   Search for packages with certain components
*   Filter by component quantity
