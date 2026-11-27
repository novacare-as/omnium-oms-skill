# Enrichment Workflow Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment

> Workflow steps for enriching orders with product data, customer information, tags, and metadata.

## Overview

Enrichment workflow steps enhance order data by adding information from products, customers, and configuration. They set dates, generate IDs, add tags, and populate order properties needed for downstream processing.

## Available Steps

### Product Enrichment

| Step | Key | Description |
| --- | --- | --- |
| [Enrich Order from Products](enrichment/enrich-order-from-products.md) | `EnrichOrderFromProducts` | Populate order lines with product details |
| [Enrich Order Cost from Products](enrichment/enrich-order-cost-from-products.md) | `EnrichOrderCostFromProducts` | Set cost data from product information |
| [Enrich Order from Product GTINs](enrichment/enrich-order-from-product-gtins.md) | `EnrichOrderFromProductGtins` | Lookup products by GTIN and enrich |
| [Enrich Order Line with Location](enrichment/enrich-order-line-with-location.md) | `EnrichOrderLineWithLocation` | Add warehouse location to order lines |

### Market & Customer Enrichment

| Step | Key | Description |
| --- | --- | --- |
| [Enrich Order Market](enrichment/enrich-order-market.md) | `EnrichOrderMarket` | Set market based on store |
| [Enrich B2B Customer ID](enrichment/enrich-b2b-customer-id.md) | `EnrichB2BCustomerId` | Set B2B customer identifier |
| [Enrich Order with Customer External IDs](enrichment/enrich-order-with-customer-external-ids.md) | `EnrichOrderWithCustomerExternalIds` | Copy external IDs from customer |
| [Enrich Order with Customer Properties](enrichment/enrich-order-with-customer-properties.md) | `EnrichOrderWithCustomerProperties` | Copy properties from customer |

### Shipment & Inventory Enrichment

| Step | Key | Description |
| --- | --- | --- |
| [Enrich Shipment Label](enrichment/enrich-shipment-label.md) | `EnrichShipmentLabel` | Set shipping label from option config |
| [Update Order Line Reserved Inventory](enrichment/update-order-line-reserved-inventory.md) | `UpdateOrderLineReservedInventory` | Set reserved inventory on lines |

### Dates & IDs

| Step | Key | Description |
| --- | --- | --- |
| [Set Completed Date](enrichment/set-completed-date.md) | `SetCompletedDate` | Set completion timestamp |
| [Set Canceled Date](enrichment/set-canceled-date.md) | `SetCanceledDate` | Set cancellation timestamp |
| [Set Ready for Pickup Date](enrichment/set-ready-for-pickup-date.md) | `SetReadyForPickupDate` | Set pickup ready timestamp |
| [Set Customer Pickup Deadline](enrichment/set-customer-pickup-deadline.md) | `SetCustomerPickupDeadline` | Calculate and set the customer pickup deadline using working days |
| [Set Default External ID](enrichment/set-default-external-id.md) | `SetDefaultExternalId` | Set external ID from order type config |
| [Generate External ID](enrichment/generate-external-id.md) | `GenerateExternalId` | Generate unique external ID |
| [Create Order Barcode](enrichment/create-order-barcode.md) | `CreateOrderBarcode` | Generate barcode for order |

### Custom Data & Sales

| Step | Key | Description |
| --- | --- | --- |
| [Set Custom Order Data](enrichment/set-custom-order-data.md) | `SetCustomOrderData` | Enrich from custom connector |
| [Set Current User as Sales Person](enrichment/set-current-user-as-sales-person.md) | `SetCurrentUserAsSalesPerson` | Assign current user as sales person |

### Tags

| Step | Key | Description |
| --- | --- | --- |
| [Add Order Tags](enrichment/add-order-tags.md) | `AddOrderTags` | Add default calculated tags |
| [Add Custom Tags](enrichment/add-custom-tags.md) | `AddCustomTags` | Add configured custom tags |
| [Add Click and Collect Tags](enrichment/add-click-and-collect-tags.md) | `AddClickAndCollectTags` | Add click-and-collect specific tags |
| [Add Order Tags by Category ID](enrichment/add-order-tags-by-category-id.md) | `AddOrderTagsByCategoryId` | Add tags based on product categories |
| [Add Order Tags by SKU ID](enrichment/add-order-tags-by-sku-id.md) | `AddOrderTagsBySkuId` | Add tags based on product SKUs |

## Common Patterns

### New Order Enrichment

1.  **Enrich Order from Products** - Get product details
2.  **Enrich Order Market** - Set market context
3.  **Enrich Order with Customer External IDs** - Copy customer data
4.  **Add Order Tags** - Calculate and add tags
5.  **Generate External ID** - Create unique ID for ERP

### Completion Flow

1.  **Set Completed Date** - Record completion time
2.  Tags and IDs already set from earlier enrichment
