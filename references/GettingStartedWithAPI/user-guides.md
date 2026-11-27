# Quick Guides

Source: https://docs.omnium.no/docs/GettingStartedWithAPI/user-guides

> Find the documentation and API endpoints most relevant to your integration needs.

## Welcome to Omnium

Different teams integrate with Omnium in different ways. Select your role below to find the most relevant documentation, key concepts, and API endpoints for your work.

*   [E-commerce Frontend](user-guides.md#e-commerce-frontend-developers) — Building webshops, mobile apps, or headless commerce
*   [PIM Integration](user-guides.md#pim-integrators) — Syncing product data from PIM systems
*   [ERP Integration](user-guides.md#erp-integrators) — Order sync, inventory, and financial systems
*   [WMS Integration](user-guides.md#wms-integrators) — Warehouse management, fulfillment, and logistics
*   [Configuration & Admin](user-guides.md#configuration--admin) — Tenants, users, markets, and system settings
*   [Payment Integration](user-guides.md#payment-integrators) — Payment providers and checkout flows
*   [Shipping Integration](user-guides.md#shipping-integrators) — Shipping providers, delivery, and tracking
*   [Business Analysts](user-guides.md#business-analysts) — Reporting, analytics, and data exports

* * *

## Common Resources

Before diving into role-specific content, ensure you have:

*   **API Access**: [Get Access Guide](introtoapi.md) - Request credentials and understand authentication
*   **API Documentation**: [api.omnium.no](https://api.omnium.no) - Complete Swagger documentation
*   **Test Environment**: [apitest.omnium.no](https://apitest.omnium.no) - Sandbox for development

* * *

## E-commerce Frontend Developers

Build webshops, mobile apps, or headless commerce solutions using Omnium's product catalog, cart, and checkout APIs.

### What You'll Build

*   Product listing and search pages
*   Shopping cart functionality
*   Checkout flows with payment and shipping
*   Customer account and order history
*   Inventory availability displays

### Key Concepts

| Concept | Description |
| --- | --- |
| **Products** | Searchable catalog with variants, pricing, and assets |
| **Cart** | Shopping session with items, discounts, shipping, and payment |
| **Orders** | Completed purchases with status tracking |
| **Markets** | Geographic/business segments with currency and language |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/Products/SearchProducts` | Search and filter products with facets |
| `POST /api/Cart/AddItemToCart` | Create cart or add items |
| `GET /api/Cart/{cartId}` | Retrieve cart details |
| `POST /api/Cart/{cartId}/Validate` | Validate before checkout |
| `POST /api/Cart/CreateOrderFromCart/{cartId}` | Complete checkout |
| `POST /api/Orders/Search` | Customer order history |
| `POST /api/Inventory/Search` | Check stock availability |

### Documentation

*   [Omnichannel E-commerce Tutorial](Tutorials/omnichannel-ecom.md) - End-to-end tutorial
*   [Products](../Product.md) - Product model and search
*   [Carts](../Carts.md) - Cart operations and checkout
*   [Inventory](../Inventory.md) - Stock management

* * *

## PIM Integrators

Sync product information from PIM systems (Akeneo, inRiver, Bluestone, etc.) into Omnium.

### What You'll Build

*   Product import pipelines
*   Category synchronization
*   Asset and image management
*   Multi-language product content
*   Price list updates

### Key Concepts

| Concept | Description |
| --- | --- |
| **Product** | Master product with variants (SKUs) |
| **Categories** | Hierarchical product classification |
| **Assets** | Images and media attached to products |
| **Prices** | Market-specific pricing with validity periods |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/Products` | Create product with variants |
| `PATCH /api/Products/PatchMany` | Bulk update products (up to 1000) |
| `POST /api/ProductCategories/AddMany` | Create/update categories |
| `PUT /api/Prices/AddMany` | Bulk price updates |
| `POST /api/Products/SearchProducts` | Verify imported products |

### Best Practices

*   Use `PatchMany` for updates - it only updates changed fields
*   Set prices at product level when variants share the same price
*   Use delta queries to sync only changed products

### Documentation

*   [Product Model](../Product.md) - Complete product structure
*   [Product Categories](../Product/product-categories.md) - Category management
*   [Product Assets](../Product/product-assets.md) - Image and media handling
*   [Prices](../Prices.md) - Pricing strategies
*   [Data In: Best Practices](../Integrations/data-in.md) - Bulk import patterns

* * *

## ERP Integrators

Integrate with ERP systems (Dynamics 365, SAP, Fortnox, etc.) for order sync, inventory, and financial data.

### What You'll Build

*   Order export to ERP
*   Order status synchronization
*   Inventory level updates
*   Return and refund processing
*   Purchase order management

### Key Concepts

| Concept | Description |
| --- | --- |
| **Order** | Customer purchase with workflow status |
| **Workflow** | Order processing steps (validation, payment, fulfillment) |
| **Returns** | Return requests and replacement orders |
| **Events** | Real-time notifications for order changes |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/Orders/Search` | Query orders (use `modifiedFrom` for delta) |
| `POST /api/Orders/{orderId}/UpdateStatus` | Update order workflow status |
| `PUT /api/Inventory/UpdateMany` | Sync inventory levels |
| `POST /api/Returns` | Process returns |
| `POST /api/Orders` | Create orders from ERP |

### Integration Patterns

*   **Polling**: Use `modifiedFrom` parameter for delta queries
*   **Real-time**: Subscribe to events via webhooks or Azure queues
*   **Batch**: Use bulk endpoints for high-volume operations

### Documentation

*   [Orders](../Order.md) - Order model and operations
*   [Order Workflows](../Order/workflow-steps.md) - Status management
*   [Events](../Integrations/events.md) - Real-time subscriptions
*   [Delta Queries](../Integrations/delta.md) - Efficient polling
*   [Data Out](../Integrations/data-out.md) - Export patterns

### Pre-built Connectors

*   [Fortnox](../plugins/ERP/Fortnox.md)
*   [PowerOffice](../plugins/ERP/PowerOffice.md)
*   [TripleTex](../plugins/ERP/TripleTex.md)

* * *

## WMS Integrators

Connect warehouse management systems for fulfillment, stock updates, and shipment tracking.

### What You'll Build

*   Real-time inventory synchronization
*   Order fulfillment feeds
*   Shipment creation and tracking
*   Pick/pack operations
*   Goods receiving

### Key Concepts

| Concept | Description |
| --- | --- |
| **Inventory** | Stock levels per SKU and warehouse |
| **Warehouse** | Fulfillment location (store with `isWarehouse: true`) |
| **Shipment** | Delivery tracking with carrier information |
| **Allocation** | Reserving inventory for orders |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `PUT /api/Inventory/UpdateMany` | Bulk inventory updates (recommended) |
| `POST /api/Inventory/Search` | Query current stock levels |
| `POST /api/Orders/Search` | Get orders for fulfillment |
| `PUT /api/OrderShipments/{orderId}` | Create shipments with tracking |
| `POST /api/Stores/SearchStores` | Get warehouse configuration |

### Best Practices

*   Use `UpdateMany` for inventory - it preserves reserved quantities
*   Subscribe to order events for real-time fulfillment triggers
*   Include tracking information when creating shipments

### Documentation

*   [Inventory](../Inventory.md) - Stock management
*   [Stores](../Stores.md) - Warehouse configuration
*   [Order Shipments](../Order/workflow-steps/shipments.md) - Shipment handling
*   [Events](../Integrations/events.md) - Real-time order notifications

### Pre-built Connectors

*   [Ongoing WMS](../plugins/WMS/Ongoing.md)

* * *

## Configuration & Admin

Set up and configure Omnium tenants, users, markets, and integrations.

### What You'll Manage

*   Market and store structure
*   User accounts and permissions
*   API credentials
*   Integration connectors
*   System settings

### Key Concepts

| Concept | Description |
| --- | --- |
| **Market** | Geographic/business segment with currency and language |
| **Store** | Sales channel or warehouse location |
| **Roles** | Permission groups for users |
| **Triggers** | Event subscriptions and webhooks |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `PUT /api/Markets/Update` | Configure markets |
| `POST /api/Stores/AddMany` | Create stores/warehouses |
| `GET/POST /api/Users` | User management |
| `GET/POST /api/Role` | Role and permission management |
| `GET/POST /api/Trigger` | Event subscription setup |
| `GET/PUT /api/Settings` | System configuration |

### Getting Started

1.  Set up markets for your geographic regions
2.  Create stores and designate warehouses
3.  Configure API users with appropriate permissions
4.  Set up event subscriptions for integrations

### Documentation

*   [Markets](../Markets.md) - Market configuration
*   [Stores](../Stores.md) - Store and warehouse setup
*   [Security](../Security.md) - Authentication and authorization
*   [Configuration](../configuration.md) - System settings
*   [Events](../Integrations/events.md) - Webhook setup

* * *

## Payment Integrators

Implement payment provider integrations for checkout and payment processing.

### What You'll Build

*   Payment method integration
*   Checkout session handling
*   Payment capture and refunds
*   Payment reconciliation

### Key Concepts

| Concept | Description |
| --- | --- |
| **Payment Method** | Configured payment provider (Klarna, Vipps, etc.) |
| **Payment Session** | Provider-specific checkout session |
| **Capture** | Finalizing payment after order fulfillment |
| **Refund** | Returning funds to customer |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/Cart/{cartId}/GetPaymentOptions` | Available payment methods |
| `PUT /api/Cart/{cartId}/AddPayments` | Add payment to cart |
| `POST /api/Cart/CreateOrderFromCart/{cartId}` | Complete checkout |

### Pre-built Payment Connectors

Omnium has ready-to-use integrations for major payment providers:

| Provider | Documentation |
| --- | --- |
| Klarna | [Klarna V3](../plugins/Payments/klarnav3.md) |
| Vipps | [Vipps](../plugins/Payments/vipps.md) |
| Dintero | [Dintero](../plugins/Payments/dintero.md) |
| Nets Easy | [Nets Easy](../plugins/Payments/netsEasy.md) |
| Qliro | [Qliro](../plugins/Payments/qliro.md) |
| Walley | [Walley](../plugins/Payments/Walley.md) |
| Resurs Bank | [Resurs Bank](../plugins/Payments/resursbank.md) |
| Zaver | [Zaver](../plugins/Payments/zaver.md) |
| Aera | [Aera](../plugins/Payments/aera.md) |

### Documentation

*   [Carts - Payment](../Carts.md) - Cart payment operations
*   [Order Payment Steps](../Order/workflow-steps/payment.md) - Payment workflow

* * *

## Shipping Integrators

Connect shipping providers for delivery options, label generation, and tracking.

### What You'll Build

*   Shipping option retrieval
*   Rate calculation
*   Label generation
*   Tracking updates
*   Delivery notifications

### Key Concepts

| Concept | Description |
| --- | --- |
| **Shipping Method** | Configured delivery option |
| **Shipment** | Order delivery with tracking |
| **Carrier** | Shipping provider (PostNord, Bring, etc.) |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/Cart/{cartId}/GetShippingOptions` | Available shipping methods |
| `PUT /api/Cart/{cartId}/AddShipments` | Add shipping to cart |
| `PUT /api/OrderShipments/{orderId}` | Create shipment with tracking |
| `GET /api/ShipmentOptions` | Query shipping configuration |

### Pre-built Shipping Connectors

Omnium integrates with Nordic and international carriers:

| Provider | Documentation |
| --- | --- |
| PostNord | [PostNord](../plugins/Shipments/postnord.md) |
| nShift Delivery | [nShift Delivery](../plugins/Shipments/nshiftDelivery.md) |
| nShift Ship | [nShift Ship](../plugins/Shipments/nshiftShip.md) |
| Ingrid | [Ingrid](../plugins/Shipments/ingrid-plugin.md) |
| Ongoing | [Ongoing](../plugins/WMS/Ongoing.md) |

### Documentation

*   [Order Shipments](../Order/workflow-steps/shipments.md) - Shipment handling
*   [Stores](../Stores.md) - Warehouse configuration for fulfillment

* * *

## Business Analysts

Access reporting, analytics, and data exports for business intelligence.

### What You'll Access

*   Order reports and analytics
*   Sales data exports
*   Inventory reports
*   Customer insights
*   Product performance data

### Key Concepts

| Concept | Description |
| --- | --- |
| **Delta Queries** | Fetch only changed records since last sync |
| **Scrolling** | Paginate through large datasets |
| **Events** | Subscribe to data changes |

### Essential API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/Orders/Search` | Query orders with filters |
| `POST /api/Products/SearchProducts` | Product catalog data |
| `POST /api/Inventory/Search` | Stock level reports |
| `POST /api/PrivateCustomers/Search` | Customer data, B2C (respect GDPR) |
| `POST /api/BusinessCustomers/Search` | Customer data, B2B (respect GDPR) |
| `POST /api/AnalyticsOrders/Search` | Order analytics data |

### Data Export Patterns

*   Use `modifiedFrom` for incremental exports
*   Use scrolling for large result sets
*   Subscribe to events for real-time data feeds

### Documentation

*   [Data Out](../Integrations/data-out.md) - Export patterns
*   [Delta Queries](../Integrations/delta.md) - Incremental data fetching
*   [Scrolling](../Integrations/scrolling.md) - Large dataset pagination
*   [Events](../Integrations/events.md) - Real-time data subscriptions
*   [Customer](../Customer.md) - Customer data management

* * *

## Need Help?

*   **API Questions**: Explore [api.omnium.no](https://api.omnium.no) for complete endpoint documentation
*   **Integration Support**: Contact [info@omnium.no](mailto:info@omnium.no)
*   **Demo Environment**: Request a demo tenant to test your integration
