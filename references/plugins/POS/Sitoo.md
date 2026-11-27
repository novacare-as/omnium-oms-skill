# Sitoo

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo

> Omnium integrates with Sitoo to sync products, orders, customers, and inventory.

## Overview

The Omnium–Sitoo integration enables bidirectional synchronization between Omnium Order Management System and Sitoo POS. It connects your e-commerce operations with in-store point-of-sale, providing a unified
view of orders, products, inventory, and customers.

**Key capabilities:**

*   **Orders**: Import POS sales into Omnium; export online orders to Sitoo for in-store fulfillment
*   **Products**: Export product catalog, variants, categories, and images to Sitoo
*   **Inventory**: Sync stock levels between warehouses and stores
*   **Pricing**: Export price lists and promotional pricing
*   **Click & Collect**: Support for Buy Online, Pickup In Store (BOPIS)
*   **Ship from Store**: Fulfill online orders from store inventory
*   **Returns & Exchanges**: Handle returns and exchange transactions across channels

## Prerequisites

Before configuring the integration, ensure you have:

### Sitoo Requirements

*   Active Sitoo account with API access enabled
*   Admin access to Sitoo admin portal to:
    *   Generate API credentials
    *   Configure webhooks (for real-time order sync)
    *   View store/eshop IDs and warehouse IDs

### Omnium Requirements

*   At least one Market set up (the integration is configured per market)
*   Warehouses configured in Omnium (if using inventory sync)
*   Product catalog imported (if exporting products to Sitoo)

## Basic Setup

### Omnium Connector Setup

The Sitoo integration requires connectors configured at **two levels**:

1.  **Global connector** (tenant level) — Default settings and shared configuration
2.  **Market connector** (per market) — Market-specific settings including authentication

Both are required. The market connector inherits from the global connector but can override settings.

#### Global vs Market Connector

| Aspect | Global Connector | Market Connector |
| --- | --- | --- |
| Location | Configuration → Settings → Integrations → Connectors | Market → Connectors |
| Purpose | Default settings, shared configuration | Market-specific credentials and settings |
| Required | Yes | Yes (at least one market) |
| API credentials | No | Yes — each market connects to its own Sitoo eshop |
| Settings | Feature flags, order types, defaults | Eshop ID, API token, market-specific overrides |

#### Why Both?

*   **Multi-market scenarios**: Each market may connect to a different Sitoo eshop or region
*   **Different credentials**: Each Sitoo eshop has its own API credentials
*   **Setting inheritance**: Common settings defined once globally, only differences at market level

#### Global Connector Settings (Tenant Level)

Add a connector with name `sitoo` under **Configuration -> Settings -> Integrations -> Connectors**. Click on the three dots in the top right corner to edit the JSON list of connectors and add the following:

```json
{
    "name": "sitoo",
    "type": "pos",
    "isAuthenticatedManually": true,
    "timeOut": "00:00:00",
    "implementations": [
        "IOrderExporter"
    ],
    "properties": [
        {
            "key": "SitooOrderType",
            "value": "PosSitoo",
            "editKey": true
        }
    ],
    "customHeaders": [],
    "disableStandardErrorPolicy": false,
    "enabledForMarkets": [],
    "disabledForMarkets": []
}
```

The **"SitooOrderType"** property determines the order type for orders originating from Sitoo and should correspond to something under **Configuration -> Settings -> Orders -> Order Types**.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsitoo-global-connector.7df3c324.png&w=3840&q=75)

#### Market Connector Settings (Per Market)

Under **Configuration -> Settings -> Integrations -> Sitoo**, select the marked to add Sitoo connector for and enable Sitoo:

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsitoo-market-connector.cdc51016.png&w=3840&q=75)

This will add a connector on that marked, located in the json file under market settings.

#### API Keys

Next, obtain your Sitoo API keys (preferably at least three) and insert them into the Sitoo integration GUI. The API-key should be in the format: base64\_encode("{API ID}" + ":" + "{password}"), which is found under "Add Request Header", when you obtain the API key from Sitoo. Along with the base URL, account number, and e-shop ID (usually 1), you need to select the market corresponding to the Sitoo back office. Each Sitoo back office per market allows for product databases with different languages and currencies.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsitoo-api-keys.22e912ea.png&w=3840&q=75)

#### Why Multiple API Keys?

Sitoo enforces rate limits per API key. Using a single API key for all operations can cause bottlenecks when:

*   Product catalog sync runs during business hours
*   Multiple order imports/exports happen simultaneously
*   Inventory updates compete with order processing

**Solution**: Configure separate API keys for different operation types. Each key gets its own rate limit quota from Sitoo.

Single API Key:

Multiple API Keys:

#### Available API Key Types

| Key Type | Operations |
| --- | --- |
| `ProductExporter` | Product catalog sync to Sitoo |
| `OrderImporterScheduledTask` | Importing POS orders from Sitoo |
| `OrderExporter` | Exporting online orders to Sitoo |
| `InventoryImporterScheduledTask` | Importing stock levels |
| `InventoryExporter` | Exporting stock updates |
| `Events` | Processing webhook events |
| `ZReportFetcher` | Fetching end-of-day reports |

#### Json Configuration Example

```json
{
"PropertyList": [
  {
    "Key": "AdditionalSitooApiKeys",
    "Value": "ProductExporter:cHJvZDprZXk=|OrderImporterScheduledTask:b3JkZXI6a2V5|InventoryExporter:aW52OmtleQ=="
  }
]
}
```

Format: KeyType1:Base64Token|KeyType2:Base64Token|...

### Stores and Warehouses

Next, we need to connect/map the warehouses in Sitoo and Omnium. In Sitoo, warehouses is an entity seperate from stores, while in Omnium, all warehouse is a store. In the Sitoo integration GUI, there is a panel you can use. However, it is still under development and often not sufficient.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsitoo-warehouse-mapping.5b31d3a1.png&w=3840&q=75)

The connection between warehouses should be both ways, with an external ID in Omnium with key "SitooWarehouseId": ../\_images/sitoo-store-ids.png

And an external ID in Sitoo:

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsitoo-warehouse.88c86232.png&w=3840&q=75)

In addition, we need to specify in Omnium the Sitoo warehouse type using a property with the key "SitooWarehouseType":

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsitoo-warehouse-type.f4598c00.png&w=3840&q=75)

We recommend using virtual, as Omnium is the master of stock levels. See [https://developer.sitoo.com/guides/stores-and-warehouses#warehouses](https://developer.sitoo.com/guides/stores-and-warehouses#warehouses).

With the warehouses being one to one between Sitoo and Omnium, the next step is stores in Sitoo. These need to have their external Id set to the Id of the corresponding store in Omnium:

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsitoo-external-store-id.e6beb676.png&w=3840&q=75)

The store's external ID is used by the integration to set the correct store on the order. This value is not used for stockkeeping, but it is still crucial to set it correctly.

In Omnium, ensure the store's external ID matches the corresponding store in Sitoo. This external ID is used by the integration to assign the correct store to the order.

* * *

### Order export

Orders can be exported from Omnium to Sitoo as part of an order workflow. The export is triggered by a workflow step and supports several export modes depending on what needs to be communicated to Sitoo. Sitoo connector must implement `IOrderExporter`

The export mode is controlled by the `OrderExportType` property set on the workflow step. The following modes are supported:

| `OrderExportType` value | What it does |
| --- | --- |
| `Order` | Creates or updates the full order in Sitoo |
| `OrderDelivery` | Exports a shipment/delivery update to Sitoo |
| `ReadyForPickup` | Marks the order as ready for pickup (Click & Collect) |
| _(not set)_ | Defaults to full order export |

#### Order Type in Sitoo

When exporting a full order, the type in Sitoo is determined by the payment status:

*   **Paid order** → exported as a Sitoo `Order`
*   **Unpaid / pending** → exported as a Sitoo `Booking`

#### Discount Handling

How line item prices are exported depends on the order type and configuration:

*   **Paid orders** always export with final discounted prices.
*   **Bookings** also export with discounts by default. If `IgnorePromotionPricesInProductSync` is set to `true`, bookings export at list price instead — this prevents double discounting when Sitoo recalculates promotions as the booking is completed at the POS.
*   To force specific Omnium order types to always export with discounts regardless of the above setting, add them to the connector option `ExportWithDiscountsForOrderTypes` (key group).

#### Delivery Export and Status Mapping

When exporting an `OrderDelivery`, the Sitoo order state is also updated based on the Omnium order status:

*   Status marked as cancelled → Sitoo order set to `Cancelled`
*   Status marked as delivered/shipped → Sitoo order set to `Closed`
*   All other statuses → Sitoo order set to `Open`

For the delivery to be exported successfully, each shipment's warehouse must have a `SitooWarehouseId` external ID configured on the corresponding Omnium store.

#### Required Configuration

1.  An API key of type `OrderExporter` must be configured in the Sitoo connector options. This key is used for all order export API calls.

2.  The Sitoo order exporter is invoked from an order workflow step. The step must specify `OrderExportType` as a property to control the export mode. The relevant connector is `sitoo`.

3.  The Sitoo connector must be configured to implement `IOrderExporter` in the tenant settings. Without this, the order export workflow step will not invoke the
    Sitoo exporter.

* * *

### Events

Sitoo uses webhooks to notify Omnium about changes in real-time. When an event occurs in Sitoo (e.g., a new order is placed at the POS), Sitoo sends a POST request to the configured webhook URL, and Omnium processes the event accordingly.

#### Event Types

| Event Type | Trigger | Omnium Action |
| --- | --- | --- |
| `order` | New POS order created or updated | Import order into Omnium |
| `order-delivery` | Order delivery status changes | Update order fulfillment status |
| `warehouse-transaction` | Stock movement in Sitoo warehouse | Sync inventory levels |

#### Configuring the Webhook

To register Omnium as an event subscriber, navigate to **Settings -> Event Subscription** in the Sitoo back office and add the following configuration:

```json
{
    "event_subscriptions": [
        {
            "base_url": "https://api.omnium.no/api/sitoowebhook/{TenantId}/{MarketId}/",
            "api_token": "{api_token}",
            "event_types": [
                "order",
                "order-delivery",
                "warehouse-transaction"
            ]
        }
    ]
}
```

| Placeholder | Description | Example |
| --- | --- | --- |
| `{TenantId}` | Your Omnium tenant identifier | `MyShop` |
| `{MarketId}` | The market code for this integration | `NOR`, `SWE` |
| `api_token` | Shared secret for webhook auth | (generate one) |

The `api_token` in Sitoo must match the `WebhookApiKey` property in the Sitoo connector settings in Omnium:

```json
{
    "Key": "WebhookApiKey",
    "Value": "{api-token}"
}
```

After configuration, you can verify the webhook is working by:

1.  Creating a test order in Sitoo POS
2.  Checking that the order appears in Omnium within a few seconds

## Additional Documentation

Sitoo documentation: [Sitoo Developer Guide](https://developer.sitoo.com/introduction/#overview)
