# Flow Retail

Source: https://docs.omnium.no/docs/plugins/POS/Flow

> Omnium integrates with Flow Retail to export products, prices, inventory, customers, and purchase orders.

## Overview

The Omnium–Flow Retail integration in Omnium enables one-way synchronization from Omnium OMS to Flow Retail POS. It pushes product catalog, pricing, inventory levels, customer data, and purchase orders into Flow, ensuring the POS system stays aligned with your e-commerce and back-office operations. Flow Retail has made substantial parts of the integration on their end, including the order sync. They utilize Omniums public API and event subscritpions. This documentation focus on the data Omnium exports to Flow. See [https://docs.flowretail.com/docs/integrations/order-management/omnium](https://docs.flowretail.com/docs/integrations/order-management/omnium) for the rest.

**Key capabilities:**

*   **Products**: Export product catalog, variants, product groups, brands, and images to Flow
*   **Prices**: Export selling prices and cost prices, both from separate price lists and product documents
*   **Inventory**: Push stock levels from Omnium to Flow stores. Flow push stock back to Omnium for stores where they are master
*   **Customers**: Export private and business customers to Flow. Flow updates Omnium if customer is created in Store
*   **Purchase Orders**: Export purchase orders, deliveries and purchase order reservations
*   **Stores**: Sync store details, opening hours, and warehouse configuration
*   **Orders**: This is handled completely by Flow

**Important:** All the integration logic in Omnium is **export-only** — data flows from Omnium to Flow. There is no webhook handler in Omnium or fetching of data back. Flow push data to us through our public API, this includes orders, customers and stock.

## Prerequisites

### Flow Requirements

*   Active Flow Retail account with API access
*   API access token for authentication
*   Flow tenant UID

### Omnium Requirements

*   At least one Market (or Market Group) configured
*   Products, stores, and suppliers set up in Omnium
*   Connector configured with Flow API credentials

## Basic Setup

### Connector Configuration

The Flow integration uses the connector name **`FlowRetail`**. Add a connector under **Configuration -> Settings -> Integrations -> Connectors**:

```json
{
    "name": "FlowRetail",
    "type": "pos",
    "host": "https://api.flow.retail/",
    "isAuthenticatedManually": true,
    "timeOut": "00:00:00",
    "implementations": [
        "IProductExporter",
        "IInventoryExporter",
        "IPrivateCustomerExporter",
        "IBusinessCustomerExporter",
        "IPurchaseOrderSynchronousExporter",
        "IStoreExporter"
    ],
    "properties": [],
    "customHeaders": [],
    "disableStandardErrorPolicy": false,
    "enabledForMarkets": [],
    "disabledForMarkets": []
}
```

Put the same config **Configuration -> Settings -> Markets -> Connectors** for having market specific settings. The config should be on at least one market. Some settings are global and should be under the global connector settings.

Only include the `implementations` that you need. For example, if you only need product and inventory sync, include only `IProductExporter` and `IInventoryExporter`, these are global settings.

### Required Properties

The following properties must be configured on the connector (at the global or market level):

| Property | Description | Required |
| --- | --- | --- |
| `DefaultTenantUid` | The Flow tenant identifier | Yes |
| `MainPricesListUid` | The UID of the main price list in Flow | Yes |
| `DefaultVatCodeUid` | Default VAT code UID for products without a specific VAT mapping | Yes |
| `OrganizationUid` | Flow organization identifier | Yes |
| `PurchaseNumberSeriesUid` | Number series for purchase orders in Flow | If using PO export |
| `VoucherNumberSeriesUid` | Number series for vouchers in Flow | If using vouchers |

Example property configuration:

```json
{
    "properties": [
        {
            "key": "DefaultTenantUid",
            "value": "your-flow-tenant-uid"
        },
        {
            "key": "MainPricesListUid",
            "value": "main-price-list-uid"
        },
        {
            "key": "DefaultVatCodeUid",
            "value": "standard-vat"
        },
        {
            "key": "OrganizationUid",
            "value": "your-org-uid"
        }
    ]
}
```

### Multi-Market vs Market Group Tenants

By default, the integration is configured **per market** — each market connects to its own Flow tenant. For scenarios where multiple markets share a single Flow tenant, enable market group-based tenants:

```json
{
    "key": "UseMarketGroupFlowTenants",
    "value": "true"
}
```

When enabled, markets within the same market group share the Flow tenant configuration.

## Data Transformation Notes

### UID Sanitization

Flow requires UIDs to contain only alphanumeric characters and underscores (`A-Za-z0-9_`). All Omnium IDs are automatically **UID-sanitized** before being sent to Flow — any characters outside this set are stripped.

### Price Conversion

All prices are converted to **cents** (integer) before sending to Flow. For example, a price of `199.50` in Omnium becomes `19950` in Flow.

### Unit Conversion

| Measurement | Omnium | Flow |
| --- | --- | --- |
| Weight | Decimal | Integer (grams) |
| Height/Width/Length | Decimal (from colli) | Integer (millimeters) |

## Additional Documentation

*   [Products](Flow/Products.md) — Product catalog synchronization
*   [Prices](Flow/Prices.md) — Price and cost price sync
*   [Inventory](Flow/Inventory.md) — Stock level export
*   [Customers](Flow/Customers.md) — Customer data export
*   [PurchaseOrders](Flow/PurchaseOrders.md) — Purchase order and delivery export
*   [Stores](Flow/Stores.md) — Store and warehouse sync
