# Virtual Stock Locations

Source: https://docs.omnium.no/docs/Inventory/virtual-stock-locations

> Learn how to configure virtual stock locations in Omnium.

## Virtual Stock Locations (VSL)

Virtual Stock Locations (VSLs) allow you to partition physical warehouse inventory across multiple virtual warehouses. This is particularly useful when you need to allocate inventory to different sales channels (e.g., online store, marketplace, B2B portal) from a single physical warehouse while maintaining separate inventory tracking for each channel.

### How VSLs Work

When VSLs are enabled, each physical warehouse can have multiple virtual stock locations associated with it. Inventory at the physical warehouse level represents the total available stock, while each VSL tracks how much of that stock is allocated to a specific channel or purpose.

**Key concepts:**

*   **Physical warehouse**: The actual storage location containing the physical inventory
*   **Virtual stock location**: A logical partition of the physical warehouse's inventory
*   **Unallocated inventory**: Physical inventory that has not been assigned to any VSL

The relationship between physical and virtual inventory is:

```
Physical Inventory = Sum of VSL Inventories + Unallocated Inventory
```

### Enabling VSLs

To enable virtual stock locations, set the `UseVirtualStockLocations` property to `true`:

```
"InventoryManagement": {
  "UseVirtualStockLocations": true
}
```

### Setting Up Warehouses for VSL

When introducing virtual stock locations, the recommended approach is to create new warehouses for the virtual locations while keeping the existing physical warehouses unchanged. This ensures Omnium handles inventory and reservations correctly and avoids breaking functionality or displaying historical data incorrectly.

**Configuration steps:**

1.  **Mark virtual warehouses**: Set "Is virtual" on each virtual warehouse
2.  **Mark physical warehouses**: Set "Has virtual stock locations" on physical warehouses that will use VSLs
3.  **Link warehouses**: Set the physical warehouse as the "related warehouse" on each virtual warehouse
4.  **Update sales channels**: Point sales channels to the virtual warehouses instead of the physical warehouse

**Important**: Once VSLs are introduced, no sales channels should be directly linked to the physical warehouse. All stores served by a physical warehouse with VSLs should have one of the virtual warehouses as their available warehouse.

### VSL Configuration Settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| UseVirtualStockLocations | bool | false | Enables virtual stock location functionality. When enabled, inventory can be partitioned across multiple virtual warehouses linked to a physical warehouse. |
| ApplyVslRulesOnInventoryUpdatesFromApi | bool | false | Feature flag that controls whether inventory rules are applied when inventory is updated via the API. See [Applying Rules to API Inventory Updates](virtual-stock-locations.md#applying-rules-to-api-inventory-updates) for details. |
| WarehouseAllocationAvailableForStoreRoles | List<string> | \[\] | Restricts warehouse allocation operations to stores with specific roles. Leave empty to allow all stores to perform allocations. |

### Sample Configuration

```
"InventoryManagement": {
  "UseVirtualStockLocations": true,
  "ApplyVslRulesOnInventoryUpdatesFromApi": true,
  "WarehouseAllocationAvailableForStoreRoles": ["Warehouse", "Distribution"]
}
```

* * *

## Inventory Rules

Inventory rules define how incoming inventory should be distributed across virtual stock locations. Rules are evaluated based on priority and can target specific products, categories, or brands.

### Rule Properties

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Display name for the rule |
| Description | string | Optional description explaining the rule's purpose |
| PhysicalWarehouseCode | string | The physical warehouse this rule applies to |
| SkuIds | List<string> | Optional list of specific SKU IDs this rule applies to |
| CategoryIds | List<string> | Optional list of category IDs this rule applies to |
| Brands | List<string> | Optional list of brand names this rule applies to |
| Priority | int | Execution order (lower numbers execute first) |
| IsDynamic | bool | Whether this rule should apply to API-triggered inventory changes |
| IsActive | bool | Whether the rule is currently active |
| WarehouseAllocations | List | The allocation definitions for each VSL |

### Rule Matching

Rules are matched to products based on the following criteria (in order of specificity):

1.  **SKU match**: If `SkuIds` contains the product's SKU
2.  **Category match**: If `CategoryIds` contains any of the product's categories
3.  **Brand match**: If `Brands` contains the product's brand

A rule applies to a product if any of the configured criteria match. If multiple rules match a product, they are processed in priority order (lowest priority number first).

### Warehouse Allocations

Each rule contains one or more warehouse allocations that define how inventory should be distributed to VSLs.

| Property | Type | Description |
| --- | --- | --- |
| WarehouseCode | string | The virtual warehouse code to allocate to |
| Type | string | Allocation type: "Minimum", "Fixed", or "Percent" |
| Amount | decimal | The amount for Fixed (quantity) or Percent (percentage) allocations |
| MinimumQuantity | int | The minimum quantity to maintain (for Minimum type) |
| Priority | int | Order within this rule's allocations (lower numbers first) |

### Allocation Types

Inventory rules support three allocation types, processed in the following order:

#### 1\. Minimum Allocation

Ensures a minimum quantity is always maintained at a VSL before other allocations occur. Use this when a channel must always have at least a certain amount of stock available.

**Example**: Ensure the B2B portal always has at least 10 units of a product.

```json
{
  "WarehouseCode": "VSL-B2B",
  "Type": "Minimum",
  "MinimumQuantity": 10,
  "Priority": 1
}
```

#### 2\. Fixed Allocation

Allocates an exact quantity to a VSL. Use this when a channel should receive a specific number of units regardless of the total incoming quantity.

**Example**: Always allocate exactly 50 units to the marketplace.

```json
{
  "WarehouseCode": "VSL-MARKETPLACE",
  "Type": "Fixed",
  "Amount": 50,
  "Priority": 2
}
```

#### 3\. Percent Allocation

Distributes remaining inventory proportionally across VSLs based on percentages. Percent allocations are processed after Minimum and Fixed allocations have been satisfied.

**Example**: Split remaining inventory 60/40 between online store and outlet.

```json
[
  {
    "WarehouseCode": "VSL-ONLINE",
    "Type": "Percent",
    "Amount": 60,
    "Priority": 3
  },
  {
    "WarehouseCode": "VSL-OUTLET",
    "Type": "Percent",
    "Amount": 40,
    "Priority": 3
  }
]
```

### Allocation Processing Order

When inventory arrives, allocations are processed in this order:

1.  **Minimum allocations**: Fill minimum quantity requirements for each VSL
2.  **Fixed allocations**: Allocate fixed quantities to each VSL
3.  **Percent allocations**: Distribute remaining quantity by percentage

Within each type, allocations are processed by their priority value (lower numbers first).

### Complete Rule Example

The following example shows a complete inventory rule that:

*   Applies to products in the "Electronics" category
*   Ensures the B2B channel has at least 5 units
*   Allocates a fixed 20 units to the marketplace
*   Distributes remaining inventory 70/30 between online and outlet

```json
{
  "Name": "Electronics Allocation Rule",
  "Description": "Standard allocation for electronics products",
  "PhysicalWarehouseCode": "WAREHOUSE-MAIN",
  "CategoryIds": ["electronics"],
  "Priority": 1,
  "IsDynamic": false,
  "IsActive": true,
  "WarehouseAllocations": [
    {
      "WarehouseCode": "VSL-B2B",
      "Type": "Minimum",
      "MinimumQuantity": 5,
      "Priority": 1
    },
    {
      "WarehouseCode": "VSL-MARKETPLACE",
      "Type": "Fixed",
      "Amount": 20,
      "Priority": 2
    },
    {
      "WarehouseCode": "VSL-ONLINE",
      "Type": "Percent",
      "Amount": 70,
      "Priority": 3
    },
    {
      "WarehouseCode": "VSL-OUTLET",
      "Type": "Percent",
      "Amount": 30,
      "Priority": 3
    }
  ]
}
```

* * *

## Dynamic Inventory Rules

Dynamic rules are a special type of inventory rule designed to maintain inventory balance across VSLs when inventory is **reduced** (e.g., from sales orders). While standard rules primarily handle allocation when inventory **increases** (such as during goods reception), dynamic rules ensure that the configured distribution percentages are maintained as inventory is consumed.

### Standard vs Dynamic Rules

| Aspect | Standard Rules | Dynamic Rules |
| --- | --- | --- |
| Primary trigger | Inventory increases (goods reception) | Inventory decreases (sales, adjustments) |
| Purpose | Allocate incoming inventory to VSLs | Maintain balance across VSLs as inventory is consumed |
| Allocation types | Minimum, Fixed, Percent | Percent only |
| Use case | Initial distribution of new stock | Ongoing rebalancing during sales activity |

### How Dynamic Rules Work

When inventory is reduced at a VSL (for example, due to a sales order), dynamic rules:

1.  Identify all VSLs with dynamic percentage allocations for the affected SKU
2.  Reduce inventory proportionally from other VSLs in the same allocation group
3.  Redistribute the remaining inventory to maintain the target percentage ratios

**Example**: If you have two VSLs configured at 60/40 split and a sale reduces inventory at the first VSL, the system will rebalance by adjusting inventory at the second VSL to maintain the 60/40 ratio.

### Dynamic Rule Limitations

Dynamic rules only support **Percent** allocation types. Minimum and Fixed allocations are not applied during dynamic redistribution. This is because dynamic rules are designed to maintain proportional distribution rather than absolute quantities.

### When to Use Dynamic Rules

Use dynamic rules when:

*   You need to maintain consistent inventory ratios across channels as sales occur
*   One channel selling should proportionally affect inventory availability at other channels
*   You want automatic rebalancing without manual intervention

### Configuration

Create a dynamic rule by setting `IsDynamic: true`:

```json
{
  "Name": "Dynamic Channel Distribution",
  "PhysicalWarehouseCode": "WAREHOUSE-MAIN",
  "Priority": 1,
  "IsDynamic": true,
  "IsActive": true,
  "WarehouseAllocations": [
    {
      "WarehouseCode": "VSL-ONLINE",
      "Type": "Percent",
      "Amount": 60,
      "Priority": 1
    },
    {
      "WarehouseCode": "VSL-OUTLET",
      "Type": "Percent",
      "Amount": 40,
      "Priority": 1
    }
  ]
}
```

* * *

## Applying Rules to API Inventory Updates

When inventory is updated via the API (rather than through goods reception or sales orders), you can control whether inventory rules should be applied using the `ApplyVslRulesOnInventoryUpdatesFromApi` setting.

### Configuration

```
"InventoryManagement": {
  "UseVirtualStockLocations": true,
  "ApplyVslRulesOnInventoryUpdatesFromApi": true
}
```

### When to Enable

Enable this setting when:

*   External systems (ERP, WMS) push inventory updates via API
*   You want these API updates to be automatically distributed according to your allocation rules
*   The API updates represent physical inventory changes that should affect VSL allocations

### When to Disable

Disable this setting when:

*   API updates should directly modify the specified inventory location without redistribution
*   External systems manage VSL allocations themselves
*   You need precise control over which inventory location receives the update

* * *

## Unallocated Inventory

Unallocated inventory represents physical warehouse stock that has not been assigned to any virtual stock location. This can occur when:

*   Inventory arrives without matching allocation rules
*   VSL allocations don't consume all available inventory
*   Manual adjustments are made to physical inventory

### Monitoring Unallocated Inventory

The system tracks unallocated inventory per SKU per physical warehouse. A positive unallocated value indicates inventory available for allocation. A negative value indicates **overallocation** — more inventory has been allocated to VSLs than exists at the physical warehouse.

### Handling Negative Inventory Spikes

When a negative spike occurs in physical warehouse inventory (e.g., from external inventory corrections), the system reacts to prevent overallocation:

**Scenario 1: Unallocated inventory can absorb the change**

If the unallocated inventory is greater than or equal to the negative spike, the unallocated inventory absorbs the change. The unallocated inventory decreases along with the physical inventory level, while VSL inventory levels remain unchanged.

**Scenario 2: Unallocated inventory cannot fully absorb the change**

If the unallocated inventory is less than the negative spike:

1.  The system first absorbs as much as possible by reducing unallocated inventory to zero
2.  The remaining difference is corrected by reducing inventory at the VSL with the highest inventory level
3.  If needed, reductions are spread across multiple VSLs until the overallocation is resolved

### Automatic Overallocation Correction

Overallocation (negative unallocated inventory) can occur due to:

*   Timing issues between sales and inventory updates
*   Manual inventory adjustments
*   Integration delays

The system includes an automatic correction mechanism via a scheduled task that runs approximately every minute. This task:

1.  Identifies overallocated inventory (negative unallocated values)
2.  Reduces VSL inventory levels to correct the overallocation
3.  Reduces from VSLs with the highest available inventory first

This prevents overselling by ensuring VSL inventory levels don't exceed actual physical stock. Note that correction may not be instantaneous but should complete within a reasonable time.

### Best Practices

*   Monitor unallocated inventory levels regularly
    *   There is both a UI and dashboard gadget for displaying unallocatedInventories
*   Ensure allocation rules account for all expected inventory
*   Configure percent allocations to total 100% when possible
*   Use the automatic overallocation correction as a safety net, not a primary mechanism

* * *

## Purchase Orders and Goods Reception

Inventory rules integrate with the purchase order and goods reception workflow to allocate incoming inventory to VSLs.

### Allocation During Goods Reception

When goods are received against a purchase order, the system can allocate the received quantity to VSLs in two ways:

1.  **Rule-based allocation**: Apply inventory rules to determine VSL distribution
2.  **Quantity-based allocation**: Distribute based on pre-defined allocations on the purchase order line

### Rule-Based Allocation

When a goods reception line has `AllocateBasedOnRules` set to true (or inherits this from the purchase order line), the system:

1.  Retrieves active inventory rules matching the received SKU
2.  Evaluates allocations based on current VSL inventory levels
3.  Creates virtual goods reception lines for each VSL

This is useful when you want consistent allocation behavior regardless of how the purchase order was created.

### Quantity-Based Allocation

If the purchase order line already has VSL allocations defined (`VirtualWarehouseAllocations`), the goods reception distributes the received quantity proportionally to each VSL based on remaining undelivered quantities.

This is useful when:

*   Allocations were determined during purchase order creation
*   Different products on the same PO need different allocation strategies
*   Manual override of standard rules is required

### Unallocated Goods Reception

Goods can be received as unallocated by setting `ReceiveAsUnallocated` on the goods reception line. This adds inventory to the physical warehouse without distributing to VSLs, increasing the unallocated inventory pool.

* * *

## Integration Scenarios

### Scenario 1: Multi-Channel Retail

A retailer operates an online store, a marketplace presence, and physical stores. They want to allocate warehouse inventory across these channels.

**Configuration:**

*   Create VSLs for each channel: `VSL-ONLINE`, `VSL-MARKETPLACE`, `VSL-STORES`
*   Create inventory rules with percent allocations (e.g., 50% online, 30% marketplace, 20% stores)
*   Enable dynamic rules for API updates from ERP

### Scenario 2: Priority Channel Allocation

A business wants to ensure their premium B2B channel always has stock before allocating to retail.

**Configuration:**

*   Create a rule with minimum allocation for B2B (e.g., maintain 20 units)
*   Add percent allocations for remaining inventory to retail channels
*   Rules ensure B2B gets priority before retail allocation

### Scenario 3: Product-Specific Distribution

Different product categories require different channel strategies. Electronics sell well online while apparel sells better in stores.

**Configuration:**

*   Create category-specific rules with different allocation percentages
*   Electronics rule: 80% online, 20% stores
*   Apparel rule: 30% online, 70% stores
*   Use priority to control which rule applies when products match multiple rules

* * *

## Troubleshooting

### Inventory Not Allocating to VSLs

1.  Verify `UseVirtualStockLocations` is enabled
2.  Check that inventory rules exist and are active (`IsActive: true`)
3.  Confirm the rule's `PhysicalWarehouseCode` matches the warehouse receiving inventory
4.  Verify the product matches rule criteria (SKU, category, or brand)

### Dynamic Rules Not Rebalancing

1.  Verify the rule has `IsDynamic: true`
2.  Check that the rule uses Percent allocation types only (Minimum and Fixed are not supported for dynamic rules)
3.  Confirm inventory reductions are occurring at VSLs covered by the rule
4.  Verify the rule matches the affected SKU (by SKU, category, or brand)

### API Inventory Updates Not Distributing to VSLs

1.  Ensure `ApplyVslRulesOnInventoryUpdatesFromApi` is enabled
2.  Verify inventory rules exist and match the updated SKU
3.  Check that the API update targets the physical warehouse (not a VSL directly)

### Unexpected Allocation Amounts

1.  Review rule priorities — lower numbers execute first
2.  Check allocation priorities within rules
3.  Remember allocation order: Minimum → Fixed → Percent
4.  Verify percentage allocations consider existing VSL inventory for dynamic rules

### Negative Unallocated Inventory

This indicates overallocation. The system will automatically correct this over time, but you can:

1.  Review recent sales and inventory adjustments
2.  Check for timing issues between systems
3.  Manually adjust VSL inventory if immediate correction is needed
