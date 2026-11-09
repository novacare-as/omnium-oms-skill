# Inventory ATP

Source: https://docs.omnium.no/docs/Inventory/inventory-atp

> Understanding Available-To-Promise (ATP) calculations and how Omnium determines product availability and delivery dates

Available-To-Promise (ATP) is the ability to determine when products will be available for delivery based on current inventory, reservations, and incoming purchase orders. ATP calculations help provide realistic delivery date promises to customers and optimize inventory allocation across orders.

Omnium provides a pluggable ATP provider system that can calculate availability using internal data or integrate with external systems like ERP.

* * *

## What is ATP?

ATP answers the question: **"When can I deliver this product to the customer?"**

Unlike simple stock checks that only consider current inventory, ATP looks forward in time by considering:

*   **Current on-hand inventory** - Physical stock available now
*   **Reserved inventory** - Stock already committed to other orders
*   **Incoming inventory** - Future deliveries from purchase orders
*   **Reservations on future stock** - Orders already allocated to incoming purchase orders

This allows Omnium to:

*   Promise delivery dates even when current stock is insufficient
*   Allocate incoming purchase order quantities to waiting orders
*   Update product expected delivery dates automatically
*   Validate orders against realistic availability

* * *

## Key Concepts

### ATP Entry

ATP data is stored on inventory items as a list of future availability entries. Each entry represents expected inventory from a purchase order delivery.

| Property | Description |
| --- | --- |
| Date | Expected delivery date from the purchase order |
| Quantity | Total quantity expected to be delivered |
| ReservedQuantity | Quantity already reserved for existing orders |
| AvailableQuantity | Quantity available for new orders (Quantity minus ReservedQuantity) |
| PurchaseOrderId | Reference to the source purchase order |
| PurchaseOrderLineId | Reference to the specific line item |
| DeliveryId | Reference to the delivery (if partial deliveries) |

### ATP Request

When calculating ATP, a request specifies what availability information is needed.

| Property | Description |
| --- | --- |
| Sku | The product SKU to check availability for |
| Quantity | The quantity needed |
| RequestedDeliveryDate | Optional target date - if specified, ATP checks if quantity is available by this date |
| WarehouseCodes | Optional list of warehouses to check (defaults to all) |

### ATP Result

The result of an ATP calculation provides availability information.

| Property | Description |
| --- | --- |
| Sku | The requested SKU |
| AvailableNow | Current available quantity (on-hand minus reserved) |
| AvailableAt | Date when the requested quantity will be available |
| Quantity | The quantity that can be fulfilled |
| CanBeDelivered | Whether the request can be fulfilled (by the requested date if specified) |
| AtpCalculationType | Identifier for the calculation type (from provider settings) |

* * *

## How ATP Works in Omnium

### ATP Data Flow

```
Purchase Orders with Expected Delivery Dates
              |
              v
+---------------------------+
| ATP Index Recalculation   |
| - Get active PO lines     |
| - Calculate reservations  |
| - Build ATP entries       |
+---------------------------+
              |
              v
+---------------------------+
| Store ATP on Inventory    |
| (per SKU/warehouse)       |
+---------------------------+
              |
              v
+---------------------------+
| ATP Calculation           |
| - Sum current + future    |
| - Check vs. requested qty |
| - Determine delivery date |
+---------------------------+
              |
              v
+---------------------------+
| Update product delivery   |
| dates and validate orders |
+---------------------------+
```

### When ATP is Calculated

ATP recalculation is triggered in several scenarios:

1.  **Order workflow** - The `CalculateAtp` order action recalculates ATP for SKUs in the order when orders reach certain statuses (typically `New` or `OrderCanceled`)
2.  **Purchase order changes** - When purchase orders are created, updated, or deliveries arrive
3.  **Manual trigger** - ATP can be recalculated on demand for specific SKUs
4.  **Background processing** - ATP can be queued for asynchronous recalculation

### ATP Calculation Algorithm

When calculating whether a quantity can be delivered:

1.  **Get current availability**

    *   Calculate available now as: on-hand inventory minus reserved inventory
2.  **If no ATP entries exist** - Only current stock is considered

3.  **If ATP entries exist** - Accumulate future availability by date:

    *   Sort ATP entries by date (earliest first)
    *   For each entry, add available quantity to cumulative total
    *   Check if cumulative meets the requested quantity
    *   If a requested delivery date is specified, verify the date is achievable
4.  **Return result** with the earliest date when quantity is available

### Package Products

For package products (bundles), ATP is calculated specially:

*   Each component's ATP is calculated separately
*   The package delivery date is the **latest** component delivery date
*   If any component cannot be delivered, the package cannot be delivered
*   Components that are available now don't affect the delivery date

* * *

## ATP Providers

ATP providers implement the actual calculation logic. Omnium supports multiple providers that can be configured per tenant.

| Provider | Key | Description |
| --- | --- | --- |
| [Omnium ATP Provider](inventory-atp/omnium-atp-provider.md) | `OmniumAtpProvider` | Built-in provider using Omnium's inventory and purchase order data |
| Dynamics 365 Brav | `BravAtpProvider` | Integration with Dynamics 365 Brav for external ATP calculations |

### No Provider Configured

When no ATP provider is configured:

*   ATP data is not calculated or stored on inventory items
*   Product expected delivery dates are not automatically updated
*   Cart/order validation only considers current inventory levels
*   The `CalculateAtp` order action has no effect

This is suitable when:

*   Inventory is managed entirely in an external system
*   You only need simple stock availability (in stock / out of stock)
*   Expected delivery dates are managed manually or through other mechanisms

* * *

## ATP Validation

Omnium validates cart and order inventory considering ATP data:

1.  **Skips validation** for pre-orders (pre-orders don't require current availability)
2.  **Checks current availability** against line item quantities
3.  **If RequestedDeliveryDate is set** - Also considers ATP entries up to that date
4.  **Returns validation errors** for items that cannot be fulfilled

The validator considers inventory from all available warehouses for the order's store, including:

*   Directly assigned warehouses
*   Primary warehouses
*   Warehouses linked through store configuration

* * *

## Order Actions

### CalculateAtp Order Action

**Key:** `CalculateAtp`

Recalculates ATP for products in the order that have purchase order reservations.

**Default Statuses:** `New`, `OrderCanceled`

**Properties:**

| Property | Type | Description |
| --- | --- | --- |
| SkipProductUpdate | Boolean | When true, skips updating product expected delivery dates after ATP calculation |

**Behavior:**

1.  Gets SKUs from order lines with reserved inventory from purchase orders
2.  Updates ATP data on inventory items
3.  Unless `SkipProductUpdate` is true, also updates product expected delivery dates

* * *

## Product Expected Delivery Date

ATP calculations can automatically update the `ExpectedDeliveryDate` on product variants. This provides visibility into when out-of-stock products will be available.

The update process:

1.  Calculate ATP for product SKUs
2.  For regular products: Set expected delivery date based on when quantity becomes available
3.  For packages: Set to the latest component delivery date
4.  Only updates products whose delivery date actually changed
5.  Triggers product events for audit trail

**Note:** Only primary warehouses are considered when updating product delivery dates.

* * *

## Configuration

ATP providers are configured in tenant settings:

```json
{
  "InventoryManagement": {
    "AtpProviders": [
      {
        "Key": "OmniumAtpProvider",
        "AtpCalculationType": null
      }
    ]
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| Key | string | Provider identifier (must match a registered provider) |
| AtpCalculationType | string | Optional type parameter passed to the provider for custom behavior |

For detailed configuration, see [Inventory Configuration](inventory-config.md#atp-providers).

* * *

## Related Topics

*   [Inventory Configuration](inventory-config.md)
*   [Virtual Stock Locations](virtual-stock-locations.md)
*   [Inventory API](inventory-api.md)
