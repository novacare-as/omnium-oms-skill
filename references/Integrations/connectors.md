# Connectors

Source: https://docs.omnium.no/docs/Integrations/connectors

> How the connector framework works — setting up integrations with external systems like ERPs, payment providers, shipping carriers, and e-commerce platforms.

## What Are Connectors?

Connectors are the bridge between Omnium and external systems. Every integration — whether it's exporting orders to an ERP, capturing payments via Stripe, or booking shipments with Bring — runs through a connector.

A connector consists of two parts:

1.  **Configuration** — Stored per tenant as connector settings. Contains the endpoint URL, credentials, custom properties, and market restrictions. Managed by administrators in the Omnium GUI.
2.  **Implementation** — The code that knows how to talk to the external system. Omnium ships with 50+ built-in implementations. The connector framework matches configuration to implementation at runtime.

This page explains how connectors work, how to set them up, and how they integrate with the rest of the system. For individual provider setup guides, see the Plugins section in the sidebar navigation.

* * *

## Connector Categories

Omnium organizes connectors by function:

| Category | What It Does | Examples | Documentation |
| --- | --- | --- | --- |
| **Payment** | Processes payments — authorization, capture, refund | Klarna, Stripe, Adyen, Vipps, PayPal | [Payment Plugins](../plugins/Payments.md) |
| **Shipping** | Books shipments, prints labels, tracks deliveries | Bring, PostNord, GLS, nShift, Ingrid | [Shipping Plugins](../plugins/Shipments.md) |
| **E-Commerce** | Syncs orders and products with webshop platforms | Shopify, Magento | [Shopify](../plugins/ECOM/Shopify.md), [Magento](../plugins/ECOM/Magento.md) |
| **ERP** | Exports orders, invoices, and inventory to business systems | Dynamics 365, Fortnox, PowerOffice, TripleTex | [Fortnox](../plugins/ERP/Fortnox.md), [PowerOffice](../plugins/ERP/PowerOffice.md), [TripleTex](../plugins/ERP/TripleTex.md) |
| **POS** | Integrates with point-of-sale systems | Sitoo, Flow, FrontSystems | [Sitoo](../plugins/POS/Sitoo.md), [Flow](../plugins/POS/Flow.md) |
| **CRM** | Syncs customer data and loyalty programs | Voyado | [Voyado](../plugins/CRM/voyado.md) |
| **WMS** | Integrates with warehouse management systems | Ongoing | [Ongoing](../plugins/WMS/Ongoing.md) |
| **Other** | Notifications, feeds, and specialized integrations | SendGrid, Google Feeds, LinkMobility | [SendGrid](../plugins/Other/Sendgrid.md), [Google Feeds](../plugins/Other/GoogleFeeds.md) |

* * *

## How Connectors Fit into the System

Connectors don't run in isolation — they're triggered by other parts of Omnium:

### Workflow Steps

The most common way connectors are used. When an order transitions to a new status, workflow steps fire — and many of those steps use connectors:

```
Order status changes to "Ship"
  → Workflow step: CapturePayments (uses Payment connector)
  → Workflow step: CompleteShipment (uses Shipping connector)
  → Workflow step: ExportOrder (uses ERP connector)
  → Workflow step: Notification (uses email/SMS connector)
```

Each workflow step has a **Connector** and **ConnectorId** field that tells it which connector to use. See [Order Lifecycle](../Order/order-lifecycle.md) for how workflows work.

### Scheduled Tasks

Background tasks that run on a schedule can use connectors to sync data:

*   Import inventory from ERP
*   Fetch orders from e-commerce platform
*   Sync customer data from CRM
*   Poll for delivery status updates from carriers

### Cart and Checkout

During checkout, connectors are called directly:

*   **Payment connectors** — Handle payment authorization and checkout sessions
*   **Shipping connectors** — Calculate shipping options and delivery estimates
*   **Validation connectors** — Validate customer data, addresses, or fraud checks

### Manual Actions

Staff can trigger connector actions manually from the Omnium GUI — for example, re-exporting an order to ERP or manually capturing a payment.

* * *

## Setting Up a Connector

### Step 1: Navigate to Connector Settings

Go to **Configuration > Settings > Integrations > Connectors** in the Omnium GUI.

You'll see a grid listing all configured connectors with their name, type, host, and credentials.

### Step 2: Add a New Connector

Click the context menu and select **Add**. A new connector entry is created with default values. Click it to open the editor.

### Step 3: Configure the Connector

The connector editor has multiple tabs:

#### Settings Tab

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Identifier used by the system to find this connector. Must match the expected connector name for the integration. | `Shopify`, `Dynamics365`, `Bring` |
| **Display Name** | Human-readable name shown in the GUI | `Shopify Norway`, `D365 Production` |
| **Type** | The connector implementation type | `Shopify`, `dynamics365` |
| **Connector ID** | Unique identifier. Required when you have multiple connectors of the same type (e.g., two Shopify stores). | `shopify-norway`, `shopify-sweden` |
| **Implementations** | Capabilities this connector should be used for, when the capability is not selected by a workflow step. Leave empty unless the integration documentation tells you to set it. | `ICreditPaymentExporter` |

The **Name** field is critical. It must exactly match the name expected by the integration (e.g., `Shopify`, `Dynamics365`, `Bring`). Check the specific plugin documentation for the correct name to use.

#### Authentication Tab

Connectors support multiple authentication schemes. Fill in whichever fields your integration requires:

**Token-based authentication:**

| Field | Description |
| --- | --- |
| **Host** | The API endpoint URL (e.g., `https://api.provider.com`) |
| **Bearer Token** | A long-lived API token sent as `Authorization: Bearer {token}` |

**Basic authentication:**

| Field | Description |
| --- | --- |
| **Host** | The API endpoint URL |
| **Username** | Basic auth username |
| **Password** | Basic auth password |

**OAuth authentication:**

| Field | Description |
| --- | --- |
| **Host** | The API endpoint URL |
| **Client App ID** | OAuth application/client ID |
| **Client App Secret** | OAuth application/client secret |
| **Tenant URL** | OAuth authority URL (e.g., for Azure AD) |
| **OAuth Tenant** | OAuth tenant identifier |
| **OAuth Resource** | OAuth resource URI |

**Other settings:**

| Field | Description |
| --- | --- |
| **Timeout** | HTTP request timeout in milliseconds (default varies by connector) |
| **Handler Lifetime** | How long to reuse the underlying HTTP connection handler |
| **Is Authenticated Manually** | Set to true if the connector handles authentication itself rather than using the standard header injection |

#### Properties Tab

Properties are key-value pairs for connector-specific settings that don't have dedicated fields. Each integration uses different properties — check the specific plugin documentation (see the Plugins section in the sidebar) for which properties are required.

**Common property patterns:**

| Property Key | Description | Example |
| --- | --- | --- |
| `AccessToken` | API access token | `shpat_abc123...` |
| `ShopifyUrl` | Store-specific URL | `mystore.myshopify.com` |
| `ServiceBusConnectionString` | Azure Service Bus connection | `Endpoint=sb://...` |
| `OrderQueueName` | Queue name for order sync | `orders-inbound` |
| `IsTest` | Enable test/sandbox mode | `true` |

Properties can be organized into groups using the **Key Group** field for easier management when a connector has many settings.

**Value types available:** String, Boolean, DateTime, Date, Number, Textarea, JSON, File, Store, OrderStatus

#### Custom Headers Tab

Add HTTP headers that are sent with every request to the external system. Useful for API versioning, tenant identification, or custom authentication schemes.

| Key | Value |
| --- | --- |
| `X-Api-Version` | `2024-01` |
| `X-Store-Id` | `store-norway` |

#### Markets Tab

Control which markets this connector serves:

| Field | Description |
| --- | --- |
| **Enabled For Markets** | If set, the connector is only available for these markets. If empty, available everywhere. |
| **Disabled For Markets** | These markets are excluded even if they match "Enabled For Markets". |
| **Enabled For Market Groups** | Same as above but for market groups. |
| **Disabled For Market Groups** | Same as above but for market groups. |

**Multiple connectors of the same type**: If you operate in multiple markets with different provider accounts (e.g., Shopify Norway and Shopify Sweden), create separate connector entries with unique **Connector IDs** and configure their market restrictions accordingly.

### Step 4: Save and Publish

Connector changes go through the **draft/publish workflow**:

1.  **Save as Draft** — Changes are saved but not active
2.  **Publish** — Changes become active across the system

This lets you prepare configuration changes and review them before they affect live operations.

* * *

## Connector Resolution

When the system needs a connector (e.g., a workflow step needs to export an order), it resolves the right connector instance using this priority:

```
1. Explicit Connector ID (if the workflow step specifies one)
   ↓ (not found)
2. Market-specific connector (matching the order's market)
   ↓ (not found)
3. Global connector matching the market group
   ↓ (not found)
4. Global connector matching the connector name/type
```

This means you can have:

*   A **default** connector for most markets
*   **Market-specific** overrides for markets that use different provider accounts
*   **Explicit** selection for workflow steps that must use a particular connector instance

### Capability-Based Resolution (Implementations)

Not every integration is triggered by a workflow step. Some capabilities run in response to an action in Omnium - a payment being credited, for example - where there is no step in which you could name a connector. For those, the connector advertises the capability itself through the **Implementations** field on the Settings tab.

`Implementations` is a list of capability names. When the action happens, Omnium uses every connector whose list contains the matching capability, so more than one system can receive the same data.

```json
{
  "Name": "FifoWebhook",
  "ConnectorId": "erp-credit-notes",
  "Implementations": ["ICreditPaymentExporter"]
}
```

Which capability names are meaningful depends on the connector - check the relevant plugin page, or [Credit Payment Export](credit-payment-export.md) for the credit case.

Only add a capability the connector actually supports. If a connector advertises a capability it cannot provide, the action that triggers it fails with a "Could not load service" error rather than being skipped.

* * *

## Payment and Shipping Configuration

Payment providers and shipping carriers have additional dedicated configuration beyond the standard connector settings.

### Payment Providers

Payment providers are configured under **Configuration > Payments** (not the Connectors section). Each payment method has:

| Field | Description |
| --- | --- |
| **Name** | Internal payment method identifier |
| **Payment Method Name** | Display name for the payment method |
| **Provider Name** | The payment gateway implementation (e.g., `Stripe`, `KlarnaCheckout`) |
| **Merchant ID** | Your merchant account identifier |
| **API Token** | API key or secret from the provider |
| **Base URL** | Provider API endpoint (test vs. production) |
| **Valid On Markets** | Which markets this payment method is available on |

See the specific [Payment Plugins documentation](../plugins/Payments.md) for provider-specific fields.

### Shipping Providers

Shipping providers are configured under **Configuration > Shipping**. Each provider has:

| Field | Description |
| --- | --- |
| **Name** | Internal provider identifier |
| **Shipping Gateway** | The gateway implementation (e.g., `bring`, `postnord`) |
| **Merchant ID** | Your carrier account ID |
| **API Token** | API key from the carrier |
| **Base URL** | Carrier API endpoint |
| **Is Test** | Toggle between test and production mode |
| **Shipment Options** | The shipping products available (e.g., "Express", "Standard", "Pickup Point") |
| **Valid On Markets** | Which markets this carrier serves |

See the specific [Shipping Plugins documentation](../plugins/Shipments.md) for carrier-specific fields.

* * *

## Connecting to Workflow Steps

Once a connector is configured, you connect it to your order workflow by referencing it in workflow steps.

### In the Workflow Chart

1.  Navigate to **Configuration > Order Types** and open the workflow chart
2.  Add a workflow step to a status (e.g., add `ExportOrder` to the "Ship" status)
3.  Set the step's **Connector** field to your connector name (e.g., `Dynamics365`)
4.  Optionally set the **Connector ID** if you have multiple connectors of the same type

### Connector and ConnectorId on Workflow Steps

| Field | When to Use |
| --- | --- |
| **Connector** | The connector name/type. Required for steps that call external systems. |
| **ConnectorId** | The specific connector instance ID. Only needed when you have multiple connectors of the same type and need to target a specific one. |

**Example:** You have two ERP connectors — one for Norway (`d365-norway`) and one for Sweden (`d365-sweden`). Your workflow step for ERP export sets:

*   **Connector** = `Dynamics365`
*   **ConnectorId** = `d365-norway`

Or, if the connectors have market restrictions configured, you can leave ConnectorId empty and the system will automatically select the right connector based on the order's market.

* * *

## Multiple Connectors of the Same Type

A common scenario is running the same type of integration for different markets, stores, or business units. Omnium handles this through:

### Option 1: Market Restrictions (Recommended)

Create multiple connectors with different market restrictions:

| Connector Name | Connector ID | Enabled For Markets |
| --- | --- | --- |
| `Shopify` | `shopify-nor` | `nor` |
| `Shopify` | `shopify-swe` | `swe` |

The system automatically selects the correct connector based on the order's market.

### Option 2: Explicit Selection

Reference a specific connector by ID in the workflow step configuration. Use this when market-based selection isn't sufficient — for example, when you need different connectors for different order types within the same market.

### Option 3: Store-Level Configuration

Some connectors support store-level routing via properties. For example, the Shopify connector uses an `OrderPrimaryStore` property to match connectors to specific stores.

* * *

## Field Mapping

Some connectors support **field mapping** — mapping Omnium property names to the external system's field names. This is configured in the connector's settings:

| Omnium Property | Connector Property |
| --- | --- |
| `Name` | `product_title` |
| `SkuId` | `sku` |
| `Brand` | `vendor` |

Field mapping is primarily used by e-commerce connectors (like Magento) where the external system's data model differs from Omnium's.

* * *

## Error Handling

### Retry Policies

By default, connectors use a **standard error policy** with automatic retries for transient failures (network timeouts, 5xx errors). You can disable this per connector by setting **Disable Standard Error Policy** to true.

### Workflow Step Error Behavior

When a connector call fails during a workflow step:

| StopOnError Setting | Behavior |
| --- | --- |
| `false` (default) | The workflow continues with the next step. The failed step is logged as an error. |
| `true` | The workflow stops. Remaining steps are skipped. The order stays in its current status for manual intervention. |

### Monitoring Connector Errors

*   **Event Log** — All connector calls are logged in the event log. Filter by category to find connector-specific events.
*   **Workflow Results** — Each workflow execution shows the result of every step, including error messages from failed connector calls.
*   **Order Errors** — Failed connector calls can add errors to the order entity, visible in the order detail view.

* * *

## Common Setup Patterns

### ERP Integration (Order Export)

**Goal:** Export completed orders to your ERP system.

1.  Create a connector with your ERP credentials
2.  Add the `ExportOrder` workflow step to the appropriate order status (e.g., "Ship" or "Completed")
3.  Set the workflow step's **Connector** field to your ERP connector name
4.  Configure the export format via connector properties

For more details, see [Data Out](data-out.md).

### E-Commerce Sync (Order Import)

**Goal:** Import orders from your webshop into Omnium.

1.  Create a connector with your e-commerce platform credentials
2.  Configure a **scheduled task** to poll for new orders at a regular interval
3.  Or set up a **webhook** from your platform to push orders to Omnium

For more details, see [Data In](data-in.md).

### Payment Processing

**Goal:** Accept and process payments during checkout.

1.  Configure a payment provider under **Configuration > Payments**
2.  Add payment workflow steps to your order statuses:
    *   `AuthorizePayment` at the "New" status
    *   `CapturePayments` at the "Ship" status
    *   `CancelPayments` at cancellation statuses

See the specific [Payment Plugins documentation](../plugins/Payments.md) for provider setup.

### Shipping and Label Printing

**Goal:** Book shipments and print labels.

1.  Configure a shipping provider under **Configuration > Shipping**
2.  Add shipping workflow steps:
    *   `CompleteShipment` — Books the shipment with the carrier
    *   `PrintShippingLabel` — Generates the shipping label
    *   `UpdateShipmentStatus` — Syncs tracking status from the carrier

See the specific [Shipping Plugins documentation](../plugins/Shipments.md) for carrier setup.

### Event-Driven Integration (Webhooks)

**Goal:** Notify external systems when events happen in Omnium.

1.  Add the `WebhookWorkflowStep` to the relevant order status
2.  Configure the webhook URL and HTTP method via workflow step properties
3.  Or use the **Event Subscription** system for broader event coverage

For more details, see [Events](events.md).

* * *

## Checklist: Before Going Live

Before activating a connector in production:

*   Credentials are set for the **production** environment (not test/sandbox)
*   The connector's **Host** URL points to the production API endpoint
*   **Market restrictions** are configured correctly (or left empty for all markets)
*   The connector is referenced in the correct **workflow steps**
*   You've tested the integration in the **test environment** first
*   **Timeout** values are appropriate for the external system's response times
*   **Error handling** is configured — decide whether workflow steps should stop on error or continue
*   The **draft is published** — connector changes don't take effect until published

* * *

## Where to Go Next

| Question | Documentation |
| --- | --- |
| How do I set up a specific provider? | [Payment Plugins](../plugins/Payments.md), [Shipping Plugins](../plugins/Shipments.md) |
| How do I import data into Omnium? | [Data In](data-in.md) |
| How do I export data from Omnium? | [Data Out](data-out.md) |
| How do webhooks and events work? | [Events](events.md) |
| How do I handle large data volumes? | [Scrolling](scrolling.md) |
| How do workflow steps trigger connectors? | [Order Lifecycle](../Order/order-lifecycle.md) |
