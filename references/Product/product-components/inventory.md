# Component Inventory

Source: https://docs.omnium.no/docs/Product/product-components/inventory

> How Omnium handles inventory for packages, bundles, and kits - including calculated inventory and kit assembly.

Omnium handles inventory differently for each composite product type. Packages and bundles use **calculated inventory** based on component availability, while kits have their own **direct inventory** created through assembly. This page explains both approaches.

* * *

## Package & Bundle Calculated Inventory

Package and bundle inventory represents the maximum number of complete units that can be assembled from available component inventory. This inventory is **calculated automatically** and updates when component inventory changes.

### Calculation Formula

```
Package Inventory = MIN(
  floor(component1_available / component1_quantity),
  floor(component2_available / component2_quantity),
  ...
)
```

### Example

Package "Starter Kit" contains:

*   1× Camera (20 available)
*   2× Batteries (50 available)
*   1× Bag (15 available)

Calculation:

*   Camera: 20 ÷ 1 = 20 packages possible
*   Batteries: 50 ÷ 2 = 25 packages possible
*   Bag: 15 ÷ 1 = 15 packages possible

**Package inventory = 15** (limited by bag availability)

* * *

## Inventory Properties

Package inventory is stored in the `CalculatedInventory` property:

| Property | Description |
| --- | --- |
| `InventoryItem.Inventory` | Raw inventory count (not used for packages) |
| `InventoryItem.CalculatedInventory` | Calculated package availability |
| `InventoryItem.Reserved` | Reserved quantity |

### Available Inventory Formula

```
Available = Inventory + CalculatedInventory - Reserved
```

For packages, `CalculatedInventory` contains the calculated package availability.

* * *

## When Calculation Occurs

Package inventory is recalculated automatically in two scenarios:

### On Product Save

When a package product is saved, Omnium recalculates its inventory based on current component availability.

### On Component Inventory Update

When any component's inventory changes, Omnium identifies all packages that include that component and recalculates their availability.

### Triggering Conditions

Recalculation is triggered when:

*   `HasPackages` tenant setting is enabled
*   Product has `IsPackage: true` or `IsBundle: true`
*   Variant has `IsPackage: true` or `IsBundle: true`

* * *

## Nested Packages

Packages can contain other packages as components (nested packages).

### Recursion Depth

The system supports up to **3 levels** of nesting to prevent infinite loops:

```
Level 1: Top Package
    └── Level 2: Component Package
            └── Level 3: Sub-Component Package
                    └── (No further recursion)
```

### Nested Calculation Example

```
Gift Set (Package)
├── Perfume (simple product, 30 available)
└── Travel Kit (Package)
    ├── Mini Lotion (100 available)
    └── Mini Soap (80 available)
    → Travel Kit inventory = 80

Gift Set inventory = MIN(30, 80) = 30
```

* * *

## Excluded Products

Certain products are excluded from inventory calculations:

### Virtual Products

Products marked as virtual don't count toward inventory:

```json
{
  "productId": "digital-download",
  "isVirtual": true
}
```

Virtual components are skipped in package inventory calculation.

### Products Without Inventory

Components without inventory items are excluded from the calculation, allowing the package inventory to be determined by other components.

* * *

## Warehouse-Specific Inventory

Package inventory can be calculated per warehouse when using warehouse-specific inventory.

### Configuration

When inventory is warehouse-specific:

*   Each warehouse has separate component availability
*   Package inventory is calculated per warehouse
*   Total package inventory = sum across warehouses

### Example

| Warehouse | Camera | Battery (qty: 2) | Bag | Package Available |
| --- | --- | --- | --- | --- |
| Oslo | 10 | 30 | 8 | 8 |
| Bergen | 5 | 20 | 12 | 5 |
| **Total** | 15 | 50 | 20 | **13** |

* * *

## Component Options Impact

When components have options, inventory considers all selectable variants.

### Behavior

*   Component with specific `SkuId`: Uses that SKU's inventory
*   Component with `Options`: Uses the selected option's inventory
*   Component with only `ProductId`: Considers aggregate variant inventory

### Example with Options

```json
{
  "componentId": "color-choice",
  "productId": "shirt",
  "options": [
    { "skuId": "shirt-blue" },
    { "skuId": "shirt-red" }
  ]
}
```

Inventory depends on which option is selected or preselected via `SkuId`.

* * *

## Performance Considerations

### Large Component Lists

For packages with many components:

*   Each component requires an inventory lookup
*   Consider caching for frequently accessed packages
*   Monitor recalculation time for complex packages

### High Update Frequency

When component inventory updates frequently:

*   Package recalculation is triggered each time
*   Background processing queues prevent blocking
*   Consider batching inventory updates

Package inventory recalculation happens asynchronously via background processing to minimize impact on API response times.

* * *

## Troubleshooting

### Package Shows Zero Inventory

| Cause | Solution |
| --- | --- |
| Component has zero inventory | Restock the limiting component |
| Component not found | Verify component ProductId/SkuId exists |
| Virtual component blocking | Check IsVirtual flag on components |
| HasPackages disabled | Enable in tenant settings |

### Inventory Not Updating

| Cause | Solution |
| --- | --- |
| Recalculation not triggered | Save the package product to trigger |
| Background job delayed | Check background task queue |
| Nested package > level 3 | Simplify package structure |

### Incorrect Calculation

| Cause | Solution |
| --- | --- |
| Wrong component quantity | Verify quantity values |
| Stale cache | Clear inventory cache |
| Warehouse mismatch | Check warehouse configuration |

* * *

## Kit Inventory

Unlike packages and bundles, **kits have their own direct inventory**. Kit inventory is not calculated from components - it is created when kits are physically assembled.

### How Kit Inventory Works

Kits use standard product inventory, not calculated inventory:

| Property | Package/Bundle | Kit |
| --- | --- | --- |
| `Inventory` | 0 (not used) | Actual kit count |
| `CalculatedInventory` | Calculated from components | 0 (not used) |
| `Reserved` | Package reservations | Kit reservations |

### Creating Kit Inventory

Kit inventory is created through the "Create Kit" operation:

1.  Select a kit product and warehouse
2.  Specify quantity to assemble
3.  System validates component availability
4.  Component inventory is **reduced** (FIFO)
5.  Kit inventory is **increased**
6.  Kit cost is calculated from component costs

```
Create Kit: "Holiday Gift Bag" × 50 units

Component changes:
├── Chocolate Bar: -100 units (2 per kit)
├── Scented Candle: -50 units (1 per kit)
└── Ceramic Mug: -50 units (1 per kit)

Kit inventory: +50 units
Kit cost: (component costs × quantities) via FIFO
```

### Kit Cost Tracking

When kits are assembled, the cost is calculated and stored:

1.  **FIFO method**: Component costs come from oldest inventory batches
2.  **Currency handling**: Mixed currencies are converted to kit currency
3.  **Batch creation**: Kit inventory includes cost for profit/valuation reporting

### Kit vs Package Inventory Comparison

| Scenario | Package | Kit |
| --- | --- | --- |
| Component inventory decreases | Package availability decreases (recalculated) | No change to kit inventory |
| Restocking components | Package availability increases (recalculated) | Must assemble new kits to increase kit inventory |
| Selling the composite product | Component inventory reserved/reduced | Kit inventory reduced |
| Inventory valuation | Based on components | Based on kit's own cost |

### When to Use Kit Inventory

Use kits when you need:

*   **Independent inventory** not tied to component availability
*   **Physical assembly** before the product is sold
*   **Cost tracking** for profit reporting
*   **Components sold individually** while also available in kits

Kit assembly is irreversible. Once components are assembled into a kit, they cannot be disassembled. Plan kit quantities based on demand forecasts.

* * *

## Inventory Export

When package inventory changes, export behavior depends on settings:

```json
{
  "InventoryManagementSettings": {
    "IsProductInventoryExportDisabled": false
  }
}
```

When export is enabled:

*   Updated package inventory triggers export
*   Component inventory updates cascade to package exports
*   Export includes calculated availability
