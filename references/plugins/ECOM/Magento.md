# Magento 2

Source: https://docs.omnium.no/docs/plugins/ECOM/Magento

> Comprehensive technical documentation for the Omnium Magento 2 integration. Learn how to configure order synchronization, product import/export, inventory management, and customer sync.

The Omnium Magento 2 integration provides bidirectional synchronization between Omnium OMS and Adobe Commerce/Magento 2. This integration enables e-commerce order management with full support for product synchronization, inventory management, customer sync, and order status updates.

## Overview

The integration supports:

*   **Order Import**: Imports orders from Magento to Omnium for fulfillment
*   **Order Export**: Updates order status, invoices, and shipments back to Magento
*   **Product Import**: Imports products from Magento (simple, configurable, and bundle products)
*   **Product Export**: Exports product data and prices to Magento
*   **Inventory Export**: Synchronizes stock levels from Omnium to Magento
*   **Customer Sync**: Imports customer data from Magento to Omnium

## Architecture

```
┌─────────────┐                    ┌─────────────────┐
│   Omnium    │◄──────────────────►│   Magento 2     │
│     OMS     │   REST API         │                 │
└─────────────┘                    └─────────────────┘
      │                                    │
      │ ┌─────────────────────────────────┐│
      │ │  Data Flows:                    ││
      │ │  ← Orders (import)              ││
      │ │  → Order status (export)        ││
      │ │  ← Products (import)            ││
      │ │  → Products/Prices (export)     ││
      │ │  → Inventory (export)           ││
      │ │  ← Customers (import)           ││
      │ └─────────────────────────────────┘│
      ▼                                    ▼
```

## Configuration

### Connector Options

The Magento integration is configured via connector options in the tenant settings. Add a connector with the name `Magento`.

| Property | Type | Description |
| --- | --- | --- |
| **Host** | string | The Magento API base URL (e.g., `https://your-store.com/rest/`) |
| **Username** | string | API access token (Bearer token) |
| **Password** | string | Not used for token auth, can be empty |

### Order Import/Export Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `IsExportInvoiceEnabled` | bool | false | Enable invoice creation in Magento when order is captured |
| `IsExportShipOrderEnabled` | bool | false | Enable shipment creation in Magento when order ships |
| `IsExportStatusEnabled` | bool | false | Enable order status updates to Magento |
| `CustomerIdField` | string | phone | Field to use as customer ID (`email` or `phone`) |
| `IsMagentoSkuModifiedByOptions` | bool | false | Strip option suffixes from SKU (e.g., `SKU-M-Red` → `SKU`) |
| `IsShipmentMethodInKlarnaExtensions` | bool | false | Read shipping method from Klarna extension attributes |
| `PickUpInStoreShippingMethod` | string | \- | Shipping method name for click & collect orders |
| `PickUpIdStoreExternalIdName` | string | \- | External ID name for store lookup |

### Product Import/Export Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `IsOmniumMasterForProducts` | bool | false | Omnium is master for product data (enables full product export) |
| `IsConfigurableProductsEnabled` | bool | false | Export configurable products (products with variants) |
| `IsProductUpdatedOnMultipleMarkets` | bool | false | Update product prices per market/store view |
| `IsSpecialPriceMapperToProduct` | bool | false | Map Magento special prices to Omnium prices |
| `IsBrandIncludedInProductName` | bool | false | Prepend brand to product name |
| `DefaultAttributeSetId` | string | **Required** | Default attribute set ID for new products |
| `DefaultTaxClassId` | string | \- | Default tax class ID for new products |
| `VariantIdentifierCustomAttribute` | string | \- | Custom attribute(s) that identify variants (comma-separated) |
| `EanCustomAttribute` | string | \- | Custom attribute name for EAN/barcode |
| `ExcludedProductFields` | string | \- | Product fields to exclude from import (separated by `||`) |
| `MagentoIdFieldMapping` | string | \- | Custom attribute to use as product ID instead of SKU |

### Inventory Export Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `IsInventoryExportOnlyForPrimaryWarehouses` | bool | false | Only export inventory from primary warehouses |

### Property Mapping (Product Export)

Map Omnium product fields to Magento custom attributes using `map_` prefixed properties:

| Property | Description |
| --- | --- |
| `map_VariantParentId` | Maps to configurable product's parent ID |
| `map_Brand` | Maps Brand field to specified Magento attribute |
| `map_Color` | Maps Color field to specified Magento attribute |
| `map_Size` | Maps Size field to specified Magento attribute |
| `map_{PropertyName}` | Maps any product property to a Magento attribute |

Example configuration:

```json
{
  "Properties": [
    { "Key": "map_Brand", "Value": "manufacturer" },
    { "Key": "map_Color", "Value": "color" },
    { "Key": "map_Size", "Value": "size" }
  ]
}
```

### Market Configuration

For multi-store Magento setups, configure markets with Magento store codes:

| Property | Entity | Description |
| --- | --- | --- |
| `magentoStoreCode` | Market | Magento store view code for product content |
| `magentoStoreId` | Store | Magento website ID for inventory source |

### Store Configuration

| Property | Entity | Description |
| --- | --- | --- |
| `MagentoSourceCode` | Store (ExternalId) | Magento MSI source code for inventory |
| `MagentoIsStoreExcluded` | Store | Exclude store from inventory export |

## Order Import

Orders are imported from Magento via the `MagentoOrderScheduledTask`. The scheduler polls Magento for orders changed since the last sync.

### Import Flow

1.  Scheduled task queries Magento for orders updated since last sync (minus 10 minutes buffer)
2.  Orders are paginated and fetched in batches of 100
3.  Each Magento order is mapped to an Omnium order
4.  New orders with status `New` or `PaymentReview` are processed through the order workflow
5.  Existing orders are updated if not already in a progressed state

### Order Status Mapping

| Magento Status | Omnium Status | Description |
| --- | --- | --- |
| `new`, `processing`, `created`, `svea_pending` | New | New order ready for processing |
| `pending`, `pending_payment`, `payment_review` | PaymentReview | Order awaiting payment confirmation |
| `packing` | InProgress | Order being fulfilled |
| `complete` | Ship | Order shipped |
| `canceled` | OrderCanceled | Order canceled |
| `returned`, `closed` | Returned | Order returned/refunded |
| `holded` | OnHold | Order on hold |

### Payment Mapping

The integration maps various payment methods automatically:

| Payment Method | Handling |
| --- | --- |
| `klarna_kco` | Extracts transaction ID from status history comments |
| `vipps` | Uses order increment ID as transaction ID (configurable) |
| `netaxept` | Extracts GUID from status history |
| `sveacheckout` (Swish/Trustly) | Adds automatic capture transaction |
| Gift Cards (FrontSystems, AW) | Creates separate payment entries |
| Reward Points | Creates bonus point payment |

### Shipping Integration

The integration supports multiple shipping providers:

*   **Ingrid**: Reads TOS ID, carrier, location from extension attributes
*   **Klarna Shipping Assistant**: Reads delivery details from Klarna extensions
*   **Porterbuddy**: Fetches tracking number from Magento shipments
*   **Service Points**: Extracts service point ID from shipping method name

### Order Properties

| Property | Description |
| --- | --- |
| `MagentoEntityId` | Magento order entity ID |
| `MagentoStatus` | Original Magento status |
| `IngridTosId` | Ingrid Transport Order Session ID |
| `MagentoExternalCustomerId` | External customer ID from Magento |

## Order Export

Orders are exported to Magento when workflow triggers.

### Export Operations

| Operation | Property | Description |
| --- | --- | --- |
| **Invoice** | `IsExportInvoiceEnabled` | Creates invoice in Magento |
| **Ship** | `IsExportShipOrderEnabled` | Creates shipment in Magento |
| **Status** | `IsExportStatusEnabled` | Updates order status in Magento |

### Export Flow

1.  Order reaches export workflow step
2.  Exporter checks which operations are enabled
3.  For invoice: Calls `POST /V1/order/{id}/invoice`
4.  For ship: Calls `POST /V1/order/{id}/ship`
5.  For status: Calls order status update endpoint
6.  Success/failure tracked via order properties

### Export Properties

| Property | Description |
| --- | --- |
| `MagentoInvoiceExport` | Set to `true` after successful invoice |
| `MagentoShipOrderExport` | Set to `true` after successful shipment |
| `MagentoOrderStatusExport` | Set to `true` after successful status update |

## Product Import

Products are imported from Magento via scheduled tasks that support both delta and full imports.

### Scheduled Tasks

| Task | Description |
| --- | --- |
| `MagentoProductImporterScheduledTask` | Delta import of changed products |
| `MagentoFullProductImporterScheduledTask` | Full catalog import |

### Import Flow

1.  Task queries Magento for products changed since last sync
2.  Configurable products and their variants are processed together
3.  Simple products are identified as standalone or variants based on visibility
4.  Products are enriched with existing Omnium data and saved

### Product Type Handling

| Magento Type | Omnium Handling |
| --- | --- |
| `simple` (visibility=1) | Imported as variant of parent product |
| `simple` (visibility>1) | Imported as standalone product |
| `configurable` | Imported as product with variants |
| `bundle` | Variants flattened into individual products |

### Field Mapping

| Magento Field | Omnium Field |
| --- | --- |
| `sku` | SkuId, ProductId |
| `name` | Name |
| `price` | Prices\[\].UnitPrice |
| `special_price` | Prices\[\] (with ValidFrom/ValidUntil) |
| `status` | IsActive (2=Disabled) |
| `description` | Description |
| `short_description` | ShortDescription |
| `image` | MainImageUrl |
| `media_gallery_entries` | Assets |
| `category_ids` | CategoryIds, ProductCategories |
| `cost_price` / `price_in` | Cost |
| `warehouse_location` | Location |
| `delivery_date` | ExpectedDeliveryDate |

### Custom Attribute Mapping

| Magento Attribute | Omnium Field |
| --- | --- |
| `brand` / `manufacturer` / `brands` | Brand |
| `color` | Color |
| `size` (and variants) | Size |
| `supplier` | SupplierName |
| `supplier_article_number` / `supplier_sku` | SupplierSkuId |
| `season` | Season |
| `front_gender` | Gender |
| `front_product_id` | ExternalId (FrontSystemsId) |

## Product Export

Products are exported to Magento when Omnium is the master system (`IsOmniumMasterForProducts=true`).

### Export Flow

1.  Products trigger export via scheduled task or manual action
2.  Products are mapped to Magento format with configured attribute mappings
3.  Products are grouped by market/store view
4.  Batch PUT requests update products in Magento
5.  Configurable product links are created for parent-child relationships

### Mapping Configuration

Use `map_` prefixed properties to map Omnium fields to Magento attributes:

```json
{
  "Properties": [
    { "Key": "map_Brand", "Value": "manufacturer" },
    { "Key": "map_VariantParentId", "Value": "parent_sku" },
    { "Key": "map_Color", "Value": "color" },
    { "Key": "map_Size", "Value": "size" }
  ]
}
```

### Website Assignment

Products are assigned to Magento websites based on store configuration:

*   Store must have `magentoStoreId` property set
*   Product must be assigned to the store in Omnium

## Inventory Export

Inventory is exported from Omnium to Magento.

### Export Methods

**Single Source (Legacy)**

*   Uses `PUT /V1/products/{sku}/stockItems/{itemId}`
*   Requires `IsInventoryExportOnlyForPrimaryWarehouses=true`
*   Only exports inventory for primary warehouses

**Multi-Source Inventory (MSI)**

*   Uses `POST /V1/inventory/source-items`
*   Supports multiple warehouses/sources
*   Each store maps to a Magento source via `MagentoSourceCode` external ID

### Export Flow

1.  Inventory change triggers export
2.  Store is validated (must be warehouse, not excluded)
3.  Source code is resolved from store external ID or store ID
4.  Available quantity is calculated
5.  Source item is posted to Magento with status (1=in stock, 0=out of stock)

### Configurable Product Stock

When a variant comes back in stock, the exporter also checks if the configurable (parent) product needs its stock status updated.

### Scheduled Task

| Task | Description |
| --- | --- |
| `MagentoInventoryExporterScheduledTask` | Full inventory export for changed items |

## Customer Sync

Customers are imported from Magento via the `MagentoCustomersScheduledTask`.

### Import Flow

1.  Task queries Magento for customers changed since last sync
2.  Customers are matched by email address
3.  New customers are created in Omnium
4.  Customer club memberships are synchronized

### Field Mapping

| Magento Field | Omnium Field |
| --- | --- |
| `email` | Id, CustomerNumber, Email |
| `firstname` | FirstName |
| `lastname` | LastName |
| `addresses[0].telephone` | Phone |
| `gender` | Gender (0=Male, 1=Female) |
| `addresses[0].*` | Address |

### External IDs

| Provider | Description |
| --- | --- |
| `MagentoId` | Magento customer entity ID |

### Customer Club Integration

The `MagentoCustomerClubService` synchronizes customer group memberships with Omnium customer clubs using the `MagentoCustomerClubGroupId` property.

## Scheduled Tasks

| Task Name | Group | Type | Description |
| --- | --- | --- | --- |
| `MagentoOrderScheduledTask` | Plugins | Delta | Import orders from Magento |
| `MagentoProductImporterScheduledTask` | Plugins | Delta | Import changed products |
| `MagentoFullProductImporterScheduledTask` | Plugins | Full | Full catalog import |
| `MagentoInventoryExporterScheduledTask` | Plugins | Delta | Export inventory to Magento |
| `MagentoCustomersScheduledTask` | Plugins | Delta | Import customers from Magento |

## External IDs and Properties

### External ID Providers

| Provider | Entity | Description |
| --- | --- | --- |
| `MagentoEntityId` | Order, Product | Magento entity ID |
| `MagentoId` | Customer | Magento customer ID |
| `MagentoSourceCode` | Store | Magento MSI source code |
| `MagentoExternalOrderId` | Order | External order ID |
| `FrontSystemsId` | Product | FrontSystems product ID |

### Order Properties

| Property | Description |
| --- | --- |
| `MagentoEntityId` | Magento order entity ID |
| `MagentoStatus` | Original Magento status |
| `MagentoInvoiceExport` | Invoice export completed |
| `MagentoShipOrderExport` | Shipment export completed |
| `IngridTosId` | Ingrid session ID |

### Product Properties

| Property | Description |
| --- | --- |
| `IsExportedToMagento` | Product has been exported |
| `ImportTag` | Tag from import batch |

## Payment Provider Integration

### Klarna

*   Transaction ID extracted from status history
*   Klarna reference stored in `KlarnaReference` property
*   Delivery details read from extension attributes

### Svea (Swish/Trustly)

*   Payment type determined from `svea_payment_method` extension
*   Direct capture automatically added for Swish and Trustly payments

### Vipps

*   Transaction ID can use order increment ID (`IsVippsTransactionOrderId=true`)

### Gift Cards

*   FrontSystems gift cards: Enable via `IsFrontSystemGiftCardEnabled`
*   AW Gift Cards: Automatically detected from extension attributes

## Workflow Integration

### Order Import Workflow

Orders from Magento automatically enter the configured order workflow. The `PaymentReview` status marks orders as read-only until payment is confirmed.

### Order Export Workflow Step

Add a workflow step using the `Magento` connector to trigger exports:

```json
{
  "Name": "ExportToMagento",
  "Connector": "Magento",
  "Active": true
}
```

## Error Handling

*   Order sync continues even if individual orders fail
*   Product import logs missing parent products for variants

## Troubleshooting

### Common Issues

| Issue | Possible Cause | Solution |
| --- | --- | --- |
| Orders not importing | API token expired | Regenerate access token in Magento |
| Products missing variants | Visibility not set correctly | Check `VariantIdentifierCustomAttribute` config |
| Inventory not updating | Source code mismatch | Verify `MagentoSourceCode` external ID on store |
| Prices not syncing per market | Market not configured | Add `magentoStoreCode` property to market |

### Debugging Tips

1.  Check scheduled task logs for sync errors
2.  Verify connector options are correctly configured
3.  Test API connectivity with Magento admin
4.  Check order events for export status
5.  Verify market/store mappings for multi-store setups

## API Endpoints Used

| Operation | Endpoint |
| --- | --- |
| Get Orders | `GET /V1/orders` |
| Get Products | `GET /V1/products` |
| Get Product by ID | `GET /V1/products/{id}` |
| Update Product | `PUT /V1/products/{sku}` |
| Get Stock | `GET /V1/stockItems/{productSku}` |
| Update Stock | `PUT /V1/products/{sku}/stockItems/{itemId}` |
| Post Source Items | `POST /V1/inventory/source-items` |
| Invoice Order | `POST /V1/order/{id}/invoice` |
| Ship Order | `POST /V1/order/{id}/ship` |
| Get Customers | `GET /V1/customers/search` |
| Get Categories | `GET /V1/categories` |
| Get Shipments | `GET /V1/shipments` |
| Get Product Attributes | `GET /V1/products/attributes/{attributeCode}` |
