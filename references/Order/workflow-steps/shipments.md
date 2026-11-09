# Shipment Workflow Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments

> Workflow steps for managing shipments, shipping methods, labels, and delivery preparation.

## Overview

Shipment workflow steps manage all aspects of order fulfillment including shipment creation, shipping method selection, label printing, status updates, and delivery preparation. They enable splitting orders across shipments and integrating with shipping providers.

## Available Steps

### Shipment Creation & Completion

| Step | Key | Description |
| --- | --- | --- |
| [Create Default Shipment](shipments/create-default-shipment.md) | `CreateDefaultShipment` | Create initial shipment for orders without shipments |
| [Complete Shipment](shipments/complete-shipment.md) | `CompleteShipment` | Finalize shipment and notify shipping provider |
| [Prepare Shipment Delivery](shipments/prepare-shipment-delivery.md) | `PrepareShipmentDelivery` | Send shipment preparation to shipping provider |

### Status Management

| Step | Key | Description |
| --- | --- | --- |
| [Update Shipment Status](shipments/update-shipment-status.md) | `UpdateShipmentStatus` | Update shipment status |
| [Update Shipment Status for In Transit](shipments/update-shipment-status-for-in-transit.md) | `UpdateShipmentStatusForInTransit` | Update status for warehouse transfers |

### Shipping Methods

| Step | Key | Description |
| --- | --- | --- |
| [Select Default Shipping Method](shipments/select-default-shipping-method.md) | `SelectDefaultShippingMethod` | Set shipping method based on market configuration |
| [Change Shipping Method](shipments/change-shipping-method.md) | `ChangeShippingMethod` | Change to specified shipping method |
| [Change Shipping Method for Non-Colli](shipments/change-shipping-method-name-for-shipments-without-colli-products.md) | `ChangeShippingMethodNameForShipmentsWithoutColliProducts` | Change method for shipments without colli products |

### Shipment Splitting

| Step | Key | Description |
| --- | --- | --- |
| [Split Shipment Cost](shipments/split-shipment-cost.md) | `SplitShipmentCost` | Distribute shipping cost across shipments |
| [Try Split Shipment by Category](shipments/try-split-shipment-by-category-id.md) | `TrySplitShipmentByCategoryId` | Split shipment based on product category |
| [Split All Line Items](shipments/split-all-line-items.md) | `SplitAllLineItems` | Split each line item to separate shipment |
| [Split Order Lines to Be Purchased](shipments/split-order-lines-to-be-purchased-to-shipment.md) | `SplitOrderLinesToBePurchasedToShipment` | Split backorder items to separate shipment |
| [Split Shipments by Freight Class](shipments/split-shipments-by-freight-class.md) | `SplitShipmentsByFreightClass` | Split based on freight classification |

### Labels & Returns

| Step | Key | Description |
| --- | --- | --- |
| [Print Shipping Label](shipments/print-shipping-label.md) | `PrintShippingLabel` | Print label via cloud print integration |
| [Create Return Shipment Booking](shipments/create-return-shipment-booking.md) | `CreateReturnShipmentBooking` | Create return shipping booking |
| [Set Pickup Warehouse Code](shipments/set-pickup-warehouse-code.md) | `SetPickupWarehouseCode` | Set warehouse for pickup orders |

### Packages & Enrichment

| Step | Key | Description |
| --- | --- | --- |
| [Create Shipment Packages Based on Product Colli](shipments/create-shipment-packages-based-on-product-colli.md) | `CreateShipmentPackagesBasedOnProductColli` | Create packages from product colli data |
| [Try Map Shipment Description to Pickup Point](shipments/try-map-shipment-description-to-pickup-point.md) | `TryMapShipmentDescriptionToPickUpPoint` | Map shipment to pickup point |
| [Enrich Shipments with Properties](shipments/enrich-shipments-with-properties-from-shipment-option.md) | `EnrichShipmentsWithPropertiesFromShipmentOption` | Copy properties from shipment option config |

## Common Patterns

### Standard Fulfillment Flow

1.  **Create Default Shipment** - If no shipment exists
2.  **Select Default Shipping Method** - Based on market configuration
3.  **Prepare Shipment Delivery** - Send to shipping provider
4.  **Complete Shipment** - Finalize and get tracking

### Multi-Shipment Order

1.  **Split by Category/Freight Class** - Separate different product types
2.  **Split Shipment Cost** - Distribute shipping cost
3.  Process each shipment independently
