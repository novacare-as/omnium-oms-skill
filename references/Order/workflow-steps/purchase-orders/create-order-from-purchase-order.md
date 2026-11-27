# Create Order From Purchase Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/purchase-orders/create-order-from-purchase-order

> Create a sales order from a purchase order for inter-store transfers.

## Overview

The **Create Order From Purchase Order** step creates a sales order from a purchase order. This enables inter-store transfer scenarios where one store (purchasing store) orders inventory from another store (supplier store) within the same Omnium instance.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateOrderFromPurchaseOrder` |
| **Group** | Modify |
| **Applicable Statuses** | New, InProgress, Completed |

## Configuration Properties

This step supports optional configuration properties:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `OrderType` | String | No | Order type to use for created orders (defaults to tenant default) |
| `MarketId` | String | No | Market to use for created orders (defaults to PO market or user default) |

### Configuration Example

```json
{
  "name": "CreateOrderFromPurchaseOrder",
  "active": true,
  "runAfterOrderIsSaved": false,
  "stopOnError": true,
  "properties": [
    {
      "key": "OrderType",
      "value": "B2B"
    },
    {
      "key": "MarketId",
      "value": "NO"
    }
  ]
}
```

## Behavior

### What It Does

1.  **Validates** that the supplier has an associated Omnium Store ID
2.  **Creates/retrieves B2B customer** representing the purchasing store
3.  **Maps purchase order** details to a new order structure:
    *   All line items with pricing, quantities, and product details
    *   Customer information from purchasing store
    *   Billing address from purchasing store
    *   Contact person from purchaser details
    *   Custom properties and metadata
4.  **Generates order number** using configured number service
5.  **Creates order** on the supplier's store
6.  **Links order** back to purchase order via `OrderForm.PurchaseOrderId`

### Prerequisites

*   **Supplier must be a store**: The supplier referenced in the purchase order must have an `OmniumStoreId` configured
*   **Both stores exist**: Purchasing store and supplier store must be active in the system
*   **Market access**: User/system must have access to the target market

### Side Effects

*   New sales order created on supplier store
*   B2B customer created/updated for purchasing store
*   Order number generated and consumed from number sequence
*   Purchase order linked to created order

## Business Cases

### When to Use

*   **Inter-store transfers**: One store orders inventory from another store
*   **Central warehouse distribution**: Stores order from central warehouse store
*   **Franchise fulfillment**: Franchise locations order from corporate stores
*   **Multi-location retailers**: Automated stock redistribution between locations

### Example Scenarios

**Scenario 1: Store-to-Store Transfer**

Store A needs inventory. Purchase order created with Store B as supplier. Upon confirmation, workflow automatically creates a sales order on Store B for fulfillment.

```
Store A (purchaser) → PO Created → PO Confirmed → Order created on Store B (supplier)
```

**Scenario 2: Warehouse Distribution**

Multiple stores order from central warehouse. Purchase orders from various stores automatically create sales orders on warehouse store.

```
Store 1, 2, 3 (purchasers) → POs Confirmed → Orders created on Warehouse Store
```

**Scenario 3: B2B Inter-Store Orders**

Regional distribution center orders bulk inventory from main warehouse using B2B order type.

```json
{
  "properties": [
    {
      "key": "OrderType",
      "value": "B2B"
    }
  ]
}
```

## Data Mapping

### What Gets Transferred

All purchase order details are preserved when creating the sales order:

*   ✅ **Line Items**: All products with quantities, pricing, discounts
*   ✅ **Product Details**: SKU, EAN, GTIN, descriptions, images
*   ✅ **Pricing**: Unit prices, extended prices, tax rates, tax amounts
*   ✅ **Package/Bundles**: Component structure maintained
*   ✅ **Delivery Dates**: Requested delivery dates
*   ✅ **Currency**: Billing currency preserved
*   ✅ **Custom Properties**: Order and line-level custom properties
*   ✅ **Supplier SKUs**: Supplier-specific product identifiers

### Order Defaults

The following are set on the created order:

*   **Store**: Set to supplier's Omnium Store ID
*   **Customer Type**: B2B
*   **Customer**: Created from purchasing store details
*   **Billing Address**: Purchasing store's address
*   **Contact Person**: Created from purchaser name and ID
*   **Order Status**: Default status for the order type
*   **Market**: Determined by configuration or purchase order
*   **Order Type**: Determined by configuration or tenant default

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order created successfully | Success with order number | Yes |
| Supplier not a store | Warning (no order created) | Depends on `stopOnError` |
| Supplier not found | Error | No |
| Store not found | Warning (no order created) | Depends on `stopOnError` |
| Order number already exists | Error | No |
| Market validation fails | Error | No |

### Warning vs Error

**Warning**: Supplier doesn't have an Omnium Store ID. The workflow step logs a warning but doesn't create an order. This allows the workflow to continue (unless `stopOnError: true`).

**Error**: System errors like missing entities or duplicate order numbers. These always halt workflow execution.

## Configuration Examples

### Example 1: Basic Setup on Confirmed Status

```json
{
  "name": "Confirmed",
  "workflowSteps": [
    {
      "name": "CreateOrderFromPurchaseOrder",
      "active": true,
      "runAfterOrderIsSaved": false,
      "stopOnError": true
    }
  ]
}
```

Creates orders using system defaults when PO is confirmed.

### Example 2: B2B Orders with Specific Market

```json
{
  "name": "Approved",
  "workflowSteps": [
    {
      "name": "CreateOrderFromPurchaseOrder",
      "active": true,
      "runAfterOrderIsSaved": false,
      "stopOnError": true,
      "properties": [
        {
          "key": "OrderType",
          "value": "B2B"
        },
        {
          "key": "MarketId",
          "value": "NO"
        }
      ]
    }
  ]
}
```

All created orders will be B2B type in Norwegian market.

### Example 3: Combined with Other Steps

```json
{
  "name": "Processing",
  "workflowSteps": [
    {
      "name": "SendEmailNotification",
      "active": true,
      "runAfterOrderIsSaved": false,
      "stopOnError": false
    },
    {
      "name": "CreateOrderFromPurchaseOrder",
      "active": true,
      "runAfterOrderIsSaved": false,
      "stopOnError": true,
      "properties": [
        {
          "key": "OrderType",
          "value": "Transfer"
        }
      ]
    },
    {
      "name": "UpdateInventoryReservation",
      "active": true,
      "runAfterOrderIsSaved": true,
      "stopOnError": false
    }
  ]
}
```

Sends notification, creates transfer order, then updates inventory.

## Setup Requirements

### Supplier Configuration

For this workflow step to work, suppliers must be configured as stores:

1.  Navigate to Supplier configuration
2.  Set the `OmniumStoreId` field to reference an existing store
3.  Ensure the referenced store is active and properly configured

### Store Configuration

Both purchasing and supplier stores must:

*   Be active in the system
*   Have complete address information (for billing address mapping)
*   Be assigned to appropriate markets
*   Have order types configured

### Number Service

Ensure order number services are configured for:

*   The order type being used (default or specified)
*   The target market
*   Proper number sequencing

Order types can point to their own number series through `OrderNumberType`. See [order number generation](../../order-config.md#order-number-generation).

## Monitoring and Troubleshooting

### Success Indicators

*   New order appears in supplier store's order list
*   Purchase order shows linked order number in events
*   Workflow execution result shows success with order number message
*   B2B customer created/updated for purchasing store

### Common Issues

**Issue**: "Supplier is not a registered store in Omnium" warning

**Solution**: Link the supplier to an Omnium store by setting `OmniumStoreId` on the supplier record.

* * *

**Issue**: Orders created in wrong market

**Solution**: Add explicit `MarketId` property to workflow step configuration.

* * *

**Issue**: Order number already exists

**Solution**: Check number service configuration and ensure sequences aren't exhausted.

* * *

**Issue**: Wrong order type used

**Solution**: Add explicit `OrderType` property to workflow step configuration.

### Tracking Created Orders

To find orders created by this workflow:

1.  **By Purchase Order**: Filter orders where `OrderForm.PurchaseOrderId` equals the source PO
2.  **By Customer Type**: Filter for customer type "B2B"
3.  **By Store**: Filter orders by supplier store ID
4.  **By Workflow Logs**: Review purchase order event logs for execution results

## Related Steps

*   [Create Purchase Order From Order](create-purchase-order-from-order.md) - Create POs from orders
*   [Create Internal Transfer From Shipment](create-internal-transfer-from-shipment.md) - Internal transfers

## Best Practices

1.  **Use explicit order types**: Specify `OrderType` property to ensure consistent order classification
2.  **Set `stopOnError: true`**: For critical workflows to prevent partial processing
3.  **Configure before enabling**: Ensure all suppliers have store IDs before activating
4.  **Monitor warnings**: Regular review of "supplier not a store" warnings
5.  **Test thoroughly**: Use test environment to validate configuration before production
6.  **Document your setup**: Maintain clear documentation of which statuses trigger order creation

* * *

**Last Updated**: February 2026
**Applies To**: Omnium OMS v9.0+
