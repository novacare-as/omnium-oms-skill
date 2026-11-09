# Component Configuration

Source: https://docs.omnium.no/docs/Product/product-components/configuration

> Configure packages, bundles, and component behavior in Omnium tenant settings.

Product component configuration is managed through tenant settings. This page covers the settings that control package and bundle behavior.

* * *

## Enabling Packages

The component feature must be enabled before packages and bundles can be used.

### HasPackages

Master switch for the package/bundle functionality.

```json
{
  "ProductSettings": {
    "HasPackages": true
  }
}
```

When enabled:

*   Products can be marked as packages (`IsPackage: true`) or bundles (`IsBundle: true`)
*   Component inventory calculation is activated
*   Package-specific order handling becomes available

Disabling `HasPackages` after packages have been created may cause unexpected behavior. Ensure all package products are handled before disabling.

* * *

## Order Behavior Settings

### DisablePackageAutoBreakdownOnAddProductFromOrder

Controls whether packages automatically expand into component lines when added to orders.

```json
{
  "ProductSettings": {
    "DisablePackageAutoBreakdownOnAddProductFromOrder": false
  }
}
```

| Value | Behavior |
| --- | --- |
| `false` (default) | Package breaks down into individual component order lines |
| `true` | Package remains as a single order line |

**When breakdown is enabled:**

*   Each component becomes a separate order line
*   Component lines are linked to the parent package via `PackageLineItemId`
*   Inventory is reserved for each component individually

**When breakdown is disabled:**

*   Package appears as a single line item
*   Useful for display purposes or simplified order management

* * *

## Pricing Settings

### AllocatePackagePricesToComponents

Controls how package pricing is distributed to component lines in orders.

```json
{
  "ProductSettings": {
    "AllocatePackagePricesToComponents": true
  }
}
```

| Value | Behavior |
| --- | --- |
| `false` (default) | Package and component prices are independent |
| `true` | Package price is proportionally allocated to components |

**When allocation is enabled:**

*   Package line's `ExtendedPrice` is set to 0 (prevents double-counting)
*   Component prices are proportionally calculated from the package price
*   Each component receives: `(package_price × component_share)`

**Example:**

Package price: $100 Components: Camera ($60 share), Lens ($30 share), Bag ($10 share)

With allocation enabled:

```
Package line:    ExtendedPrice = $0
Camera line:     ExtendedPrice = $60
Lens line:       ExtendedPrice = $30
Bag line:        ExtendedPrice = $10
Order total:     $100
```

Without allocation:

```
Package line:    ExtendedPrice = $100
Camera line:     ExtendedPrice = $0 (or component's own price)
Lens line:       ExtendedPrice = $0
Bag line:        ExtendedPrice = $0
```

Use price allocation when you want accurate revenue attribution per component, especially for reporting and analytics.

* * *

## Configuration via UI

These settings are available in the Omnium administration interface:

**Configuration → Settings → Products**

| UI Label | Setting |
| --- | --- |
| Enable Packages and Bundles | `HasPackages` |
| Disable Package Auto Breakdown | `DisablePackageAutoBreakdownOnAddProductFromOrder` |
| Allocate Package Prices to Components | `AllocatePackagePricesToComponents` |

The breakdown and allocation settings are only visible when `HasPackages` is enabled.

* * *

## Complete Configuration Example

```json
{
  "ProductSettings": {
    "HasPackages": true,
    "DisablePackageAutoBreakdownOnAddProductFromOrder": false,
    "AllocatePackagePricesToComponents": true
  }
}
```

This configuration:

1.  Enables the package/bundle feature
2.  Automatically breaks down packages into component lines in orders
3.  Distributes the package price proportionally to component lines

* * *

## Best Practices

### When to Enable Price Allocation

Enable `AllocatePackagePricesToComponents` when:

*   You need accurate revenue reporting per product
*   Components are fulfilled separately
*   You use analytics that track product-level sales

### When to Disable Auto Breakdown

Disable auto breakdown when:

*   Packages should appear as single items on invoices
*   You don't need component-level inventory tracking in orders
*   Simplified order display is preferred

### Inventory Considerations

With `HasPackages` enabled:

*   Component inventory updates trigger package inventory recalculation
*   Package inventory = minimum assemblable packages from component inventory
*   Virtual components are excluded from inventory calculations

* * *

## Related Settings

Other settings that may affect package behavior:

| Setting | Description |
| --- | --- |
| Inventory Settings | Affects how component inventory is tracked |
| Order Settings | May affect order line display and processing |
| Export Settings | Controls whether package changes trigger exports |
