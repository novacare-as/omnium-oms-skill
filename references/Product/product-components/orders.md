# Components in Orders

Source: https://docs.omnium.no/docs/Product/product-components/orders

> How package and bundle components are handled in orders, including line item structure and pricing.

When packages or bundles are added to orders, they can be represented as individual component lines or as a single package line. This page explains how components work in orders.

* * *

## Order Line Structure

When a package is added to an order with breakdown enabled, it creates multiple order lines:

```
Order
└── LineItems
    ├── Package Line (parent)
    │   ├── Code: "starter-kit"
    │   ├── IsPackageProduct: true
    │   └── Components: [...]
    ├── Component Line 1
    │   ├── Code: "camera-x100"
    │   ├── PackageLineItemId: "{parent-id}"
    │   └── ComponentId: "camera-component"
    ├── Component Line 2
    │   ├── Code: "lens-standard"
    │   ├── PackageLineItemId: "{parent-id}"
    │   └── ComponentId: "lens-component"
    └── Component Line 3
        ├── Code: "camera-bag"
        ├── PackageLineItemId: "{parent-id}"
        └── ComponentId: "bag-component"
```

* * *

## OrderLine Properties for Packages

| Property | Type | Description |
| --- | --- | --- |
| `IsPackageProduct` | bool | Line is a package/bundle product |
| `IsPackageBrokeDown` | bool | Package was broken into components |
| `IsBundle` | bool | Line is a bundle |
| `PackageName` | string | Display name of the parent package |
| `PackageSkuId` | string | SKU of the parent package |
| `PackageLineItemId` | string | Links component to parent package line |
| `ComponentId` | string | Matches component in package definition |
| `Components` | List<ProductComponent> | Nested component definitions |

### Parent Line Properties

The package line item:

```json
{
  "lineItemId": "line-001",
  "code": "starter-kit",
  "isPackageProduct": true,
  "isPackageBrokeDown": true,
  "components": [...]
}
```

### Component Line Properties

Each component line item:

```json
{
  "lineItemId": "line-002",
  "code": "camera-x100",
  "packageLineItemId": "line-001",
  "packageSkuId": "starter-kit",
  "componentId": "camera-component",
  "quantity": 1
}
```

* * *

## Adding Packages to Orders

### Automatic Breakdown

When `DisablePackageAutoBreakdownOnAddProductFromOrder` is `false` (default):

1.  Package is added to order
2.  System retrieves component definitions
3.  Creates separate order line for each component
4.  Links components to parent via `PackageLineItemId`
5.  Calculates prices for all lines

### No Breakdown

When `DisablePackageAutoBreakdownOnAddProductFromOrder` is `true`:

1.  Package is added as single line item
2.  `Components` property contains component data
3.  No separate component lines created
4.  Package price applies to single line

* * *

## Quantity Handling

Component quantities are multiplied by package quantity:

```
Package Quantity × Component Quantity = Order Line Quantity
```

### Example

Package ordered: quantity = 2 Components:

*   Camera: qty 1 → Order line: 2
*   Batteries: qty 2 → Order line: 4
*   Bag: qty 1 → Order line: 2

```json
{
  "lineItems": [
    { "code": "starter-kit", "quantity": 2 },
    { "code": "camera", "quantity": 2, "componentId": "camera-comp" },
    { "code": "batteries", "quantity": 4, "componentId": "battery-comp" },
    { "code": "bag", "quantity": 2, "componentId": "bag-comp" }
  ]
}
```

* * *

## Pricing in Orders

### Package Pricing

Without price allocation:

```
Package Line:    ExtendedPrice = Package Price × Quantity
Component Lines: ExtendedPrice = 0 (or component's price if independent)
```

### Price Allocation

With `AllocatePackagePricesToComponents` enabled:

```
Package Line:    ExtendedPrice = 0
Component Lines: ExtendedPrice = Proportional share of package price
```

### Example: Price Allocation

Package price: $300, Quantity: 1 Components: Camera (60%), Lens (30%), Bag (10%)

| Line | ExtendedPrice |
| --- | --- |
| Package | $0 |
| Camera | $180 |
| Lens | $90 |
| Bag | $30 |
| **Total** | **$300** |

* * *

## Component Options in Orders

When a component has options, the selected option's SKU is used:

### Selection Flow

1.  Package added with component options
2.  Customer/system selects option for each component
3.  Selected `SkuId` is used for the component order line
4.  Price offsets (if any) are applied

### Order Line with Selected Option

```json
{
  "code": "lens-premium",
  "packageLineItemId": "pkg-001",
  "componentId": "lens-component"
}
```

The selected option's price offset is not stored as a separate field on the order line. During breakdown it is folded into the component line's `extendedPrice`, `discountedPrice`, and `lineItemDiscountAmount`.

* * *

## Modifying Package Orders

### Changing Package Quantity

When package quantity changes:

1.  All component line quantities are recalculated
2.  Component qty = new package qty × component qty
3.  Prices are recalculated

### Removing a Package

When a package is removed:

1.  Package line is deleted
2.  All component lines with matching `PackageLineItemId` are deleted
3.  Order totals are recalculated

### Modifying Components

Modifying individual component lines after package breakdown may cause inconsistencies. Consider removing and re-adding the entire package instead.

* * *

## Order Calculation

### Total Calculation

Order totals consider package structure:

```
SubTotal = Σ(all line ExtendedPrices)
         = Package price + Component prices (if not allocated)
         = Component prices only (if allocated)
```

### Tax Calculation

Taxes are calculated per line:

*   Package line: Tax on package price
*   Component lines: Tax on component prices (if allocated)

### Discount Application

Discounts can apply to:

*   Package line: Discount on entire package
*   Component lines: Discount on individual components

* * *

## Shipment Integration

When packages are added with shipment context:

```json
{
  "shipmentId": "ship-001",
  "lineItems": [
    {
      "code": "starter-kit",
      "shipmentId": "ship-001"
    },
    {
      "code": "camera",
      "shipmentId": "ship-001",
      "packageLineItemId": "pkg-001"
    }
  ]
}
```

All component lines inherit the shipment from the package.

* * *

## Inventory Reservation

When packages are ordered:

### With Breakdown

Each component line reserves inventory separately:

*   Camera: Reserve 1
*   Batteries: Reserve 2
*   Bag: Reserve 1

### Without Breakdown

Package line may reserve package-level inventory or trigger component reservations based on configuration.

* * *

## Order Display

### Invoice Display

Configure how packages appear on invoices:

| Setting | Display |
| --- | --- |
| Breakdown enabled | Shows each component as line item |
| Breakdown disabled | Shows package as single line |
| Price allocated | Shows component prices |
| Price not allocated | Shows package price only |

### Customer-Facing Display

Consider:

*   Whether to show package grouping
*   Component vs package pricing display
*   Quantity representation

* * *

## Troubleshooting

### Components Not Linked

| Symptom | Cause | Solution |
| --- | --- | --- |
| Component lines missing `PackageLineItemId` | Direct component add | Add via package, not directly |
| `ComponentId` not set on order line | Product component has no `componentId` set, and the package was not added via cart flow | Re-add via cart, or set `componentId` on the product components |

### Price Discrepancies

| Symptom | Cause | Solution |
| --- | --- | --- |
| Double-counted prices | Allocation not enabled | Enable `AllocatePackagePricesToComponents` |
| Zero component prices | Allocation enabled | This is expected behavior |

### Quantity Mismatch

| Symptom | Cause | Solution |
| --- | --- | --- |
| Wrong component quantities | Package qty changed after add | Recalculate component quantities |
| Missing components | Partial breakdown | Re-add entire package |
