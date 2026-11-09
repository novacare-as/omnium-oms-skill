# 2025

Source: https://docs.omnium.no/docs/Releasenotes/releasenotes-2-2025

> Key updates, bug fixes, and improvements for Omnium in 2025, detailed week by week.

## Upcoming Release 2025-42

Release date: Jan 06, 2026

### Main focus areas

This release expands API capabilities for order export, improves payment robustness and flexibility, and adds new workflow tooling for enriching order data. It also strengthens access control in order management across market groups.

### Key changes and improvements

#### Order Management

*   New API endpoint `api/orders/exportorders` allows exporting orders by providing `orderIds` and a `connectorName`.
*   Order actions can now be restricted by **market group**, enabling finer-grained control in multi-market setups.

#### Payments

*   Added support for retrieving **missing payment transactions** from Aera.
*   Manual payment transactions can now be associated with a **store**, improving traceability and reporting.

#### Workflow

*   New workflow step **“Enrich order lines with location”** enriches order lines with location data from warehouse inventory, with fallback to product location when inventory data is unavailable.

#### Products

*   Order lines can now be enriched with **location information** via workflow configuration, supporting more accurate picking and fulfillment processes.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20287 | Order management | You can now export orders through the api with api/orders/exportorders. Provide orderIds and a connectorName. |
| Feature | #DEV-20282 | Payments | Support for retrieving missing payment transactions from Aera. |
| Feature | #DEV-20228 | Product | New workflow step: "Enrich order lines with location" that enriches order lines with location information from warehouse inventory, with fallback to product location. |
| Feature | #DEV-20140 | Order management | Order actions are now market group restrictable. |
| Feature | #DEV-19673 | Payments | Payment, Manually transaction: Possible to set store for the transaction. |

## Release 2025-41

Release date: Dec 16, 2025

### Main focus areas

This release enhances product search capabilities, expands notification and messaging functionality, improves payment integration workflows, and increases flexibility in order and inventory management. Several connectors also gain robustness and more detailed data handling.

### Highlights and improvements

#### Notifications

*   API now supports adding **order notes/comments** and triggering **SMS + Email** notifications.
*   Dynamic message templates now support **seller firstName and lastName**.

#### Product

*   Product search can now filter on **variant-level external IDs**, including free text hits.
*   Product mass update now supports updating **Published**, **StopPublished**, and **Discontinued** dates.

#### Cart

*   The unit dropdown now correctly filters based on **consumer units** defined on the product.

#### Order Management

*   Workflow step for reducing reserved inventory can now be used **outside cancellation scenarios**.
*   Allocation workflows now support splitting order lines based on order line custom properties.

#### Payment Integration

*   Adyen: Direct-capture payment types (e.g., Trustly) can now be added to the provider. Omnium will automatically create a **capture transaction** upon receiving the Authorization webhook.

#### Integrations

**Voyado Connector**

*   Fix for mapping issues when orders have **no payments** in Omnium.

**Front Systems Connector**

*   POS sales can now be fetched via **events** instead of the scheduled task.
*   Event-based sales import includes **more detailed payment information**.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20278 | Notifcation | Now possible to add order notes/comments and trigger SMS+Email via API |
| Bugfix | #DEV-20271 | Voyado Connector | Fix for mapping issue in Voyado connector when orders has no payments in Omnium. |
| Feature | #DEV-20262 | Front Systems Connector | Front Systems: POS sales can now be fetched via events instead of the scheduled task. Sales fetched via events will also contain more detailed payment information |
| Bugfix | #DEV-20258 | Cart | The unit dropdown in cart will now filter on consumer units from the product |
| Feature | #DEV-20211 | Product | Product search: now possible to filter on external ID on variant level. Free text searches will also get hits on external IDs on variant level |
| Feature | #DEV-20156 | Payment integration | Adyen: When using payment types (such as Trustly) with direct capture enabled, these types can be added to the payment provider. Omnium will then add a capture transaction to the order when the Adyen Authorization webhook is received. |
| Feature | #DEV-20112 | Product | Product mass update dialog now supports Published, StopPublished, and Discontinued dates |
| Feature | #DEV-20111 | Notifcation | Dynamic message templates now supports seller firstName and lastName |
| Feature | #DEV-19906 | Order management | Extend workflow step for reducing reserved inventory to be used outside of cancellation context. |
| Feature | #DEV-20131 | Order management | Adding support for splitting order lines based on order line custom properties. |

## Release 2025-40

Release date: Dec 09, 2025

### Main focus areas

This release delivers major enhancements across promotions, pricing, order management, inventory workflows, and integrations. Key themes include improved performance, richer filtering options, clearer data visibility, and expanded API/connector capabilities.

### Highlights and Improvements

#### Prices

*   Lowest price history now marks the current price with **`IsCurrentPrice: true`**, improving clarity in price transparency workflows.

#### Promotions

*   **Category/Brand** and **Multibuy** promotions now support **filtering on custom properties**, allowing more granular targeting.
*   **Order Amount Discount** promotions now allow combining **quantity** and **amount** as criteria.
*   Promotion price **deletes** now run in the background for faster UI responsiveness.
*   Promotion price **generation** moved to a queue for better performance; queue status now visible in the UI.
*   API support added for **Product Search Promotions**.
*   Updated API documentation for **Multibuy promotions**.

#### Orders & Order Management

*   Ability to **filter orders by supplier** in order search.
*   A warning now appears when **payment authorization has expired**.
*   Analytics order search now supports **partial product name matching**.
*   Split shipment creation now supports specifying **ShippingMethodName**.
*   `VersionId` is now included in **OmniumOrder**.

#### Shipment

*   **Bring return booking**: Now possible to disable Bring’s customer email for returns to avoid confusing notifications.

#### Customer & Business Customer

*   Customer club notifications can now be filtered by **market**.
*   Business customers’ **contact persons** can now hold **multiple roles**.

#### Product

*   The **Discontinued** flag is now visible in the product list (product search).

#### Inventory

*   Excel-based inventory count imports now fetch live Omnium inventory when product IDs are missing, ensuring accurate deviations and up-to-date data.

#### Purchase Orders

*   Fixed text search in PO lists.
*   Removed "Plural GTINS"—suppliers now use a **single GTIN per product**, simplifying data consistency.

#### Cost Prices

*   Cost price API now supports **Ignore Dates**, allowing overwriting cost prices even when dates differ.

#### Integrations

**Front Systems Connector**

*   Ship-from-store omnichannel orders can now be completed as **websales**.
*   Receipt number from Front Systems is now mapped to **externalId** when importing orders.

**Voyado Connector**

*   Support for **multi-identifier contact lookup** added.

#### Notifications

*   Customer club notifications now support **market filters**.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20199 | Prices | Lowest price history: If the lowest price entry is the current price, it will be marked with 'IsCurrentPrice':true |
| Feature | #DEV-20197 | Promotions | Category or brand and Multibuy promotions now supports filtering on custom properties. |
| Feature | #DEV-20191 |  | VersionId is now included in OmniumOrder |
| Feature | #DEV-20174 | Front Systems Connector | Front Systems: Ship from store omnichannel orders may now also be completed as websales |
| Feature | #DEV-20173 | Shipment | Bring return shipment booking: It is now possible to deactivate Bring from sending the customer an email with information about the booked return. Since this email is sent when the order itself is dispatched, some customers find it confusing. |
| Bugfix | #DEV-20149 | orders | Added the ability to filter orders by supplier in the order search. |
| Bugfix | #DEV-20148 | Purchase orders | Fix text search in list for orders to purchase |
| Feature | #DEV-20144 | Promotions | Order Amount Discount now supports setting a combination of qantity and/or amount as criteria. |
| Feature | #DEV-20119 | Product | Discontinued property added to product list view model(product search) |
| Feature | #DEV-20085 | Order management | Adding support for specifying ShippingMethodName when creating split shipments. |
| Feature | #DEV-20070 | Notifcation | Customer club notifications: Possible to add market filters |
| Feature | #DEV-20061 | Inventory | Inventory count now fetches the inventory in Omnium when importing from excel without product id and when updating the stock to get the correct deviation and the lastest changes. |
| Feature | #DEV-20059 | Front Systems Connector | Map receipt number from Front Systems to externalId in Omnium when importing orders from Front Systems. |
| Feature | #DEV-20047 | Promotions | Make promotion price deletes run in the background for better performance and better responiveness in the UI. |
| Feature | #DEV-20024 | Promotions | Added API support for creating Product Search Promotions - See API reference at docs.omnium.no |
| Feature | #DEV-20023 | Cost Prices | Cost price API: Ignore dates flag. Seperate cost prices now supports overwriting cost prices with different dates. |
| Feature | #DEV-20017 | Promotions | Moving promotion price generation to queue for better performance. The queue status is visible in the Omnium UI for improved transparency. |
| Feature | #DEV-20015 | orders | Shows a warning message when payment authorization has expired. |
| Feature | #DEV-19967 | Documentation | Updated Technical documentation with API reference for Multi buy promotions. |
| Bugfix | #DEV-19949 | Order management | Analytics order search now supports partial product name matching. |
| Feature | #DEV-19910 | Voyado Connector | Adding support for looking up contacts in Voyado based on multiple identifiers. |
| Feature | #DEV-19324 |  | Contact persons on business customers can now have multiple roles |
| Feature | #DEV-18561 | Purchase orders | Plural GTINS on purchase order line is removed as a supplier only can have a single GTIN for a product. Use GTIN instead. |

## Release 2025-39

Release date: Nov 18, 2025

### Main focus areas

This release enhances workflow automation, order and purchase order management, and payment integrations — with several new endpoints and improved API flexibility for customers and events.

### Highlights and Improvements

#### Product

*   The **Edit Product** view now filters purchase orders based on selected stores for faster navigation and better focus.

#### Purchase Orders

*   Added a **new API endpoint** to split purchase order lines while moving associated allocations and reservations.
*   **Partial delivery creation** now distributes reservations between lines automatically, with optional auto-splitting based on order type settings.

#### Cart

*   Introduced a **new endpoint** for removing payments from a cart, enabling more flexible checkout handling.

#### Inventory

*   Product inventory data now **reloads automatically** when opening the modal, ensuring users always see the latest stock data and avoid unsaved inconsistencies.

#### Customer API

*   Added support for **excluding customers by tags** in search results for more precise filtering.

#### Payment Integrations

*   **Adyen:**
    *   Added a setting to **activate split payments**, now documented in the Adyen configuration view.
    *   Split Payout now supports **Pay by Link** transactions.

#### Order Management

*   Added a **new workflow step** that can split order lines into a separate shipment, with filters for targeting specific order line properties.

#### Events

*   Events can now be **filtered by store groups**, making it easier to focus on relevant operational areas.

#### Infrastructure

*   **Webhooks** now include `X-Delivery-Count` and `X-Max-Delivery-Count` headers to indicate the number of retry attempts for improved observability.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19974 | Product | Edit product GUI: filter purchase orders based on selected stores. |
| Feature | #DEV-19963 | Purchase orders | New endpoint for splitting purchase order lines and moving allocations/reservations. |
| Feature | #DEV-19961 | Cart | Adding new endpoint for removing payments from cart. |
| Bugfix | #DEV-19959 | Inventory | Product inventory is now reloaded when opening the modal to get the newest data and discard unsaved changes. |
| Feature | #DEV-19947 | Api | Customer API: exclude customers with certain tags from search result. |
| Feature | #DEV-19937 | Payment integration | Adyen: Setting for activate split payments. Documented in payment config view for Adyen. |
| Feature | #DEV-19931 | Events | Now you can filter events on storegroups. |
| Feature | #DEV-19902 | Order management | New workflow step for splitting order lines into new shipment. The workflow step support filters on order line properties to only split selected order lines. |
| Feature | #DEV-19701 | Purchase orders | Reservations are distributed between purchase order lines when creating new partial deliveries. Order lines can also be split if order types are added to OrderTypesWithAutomaticLineSplitting. |
| Feature | #DEV-19461 | Infrastructure | Webhooks now includes X-Delivery-Count and X-Max-Delivery-Count in their requests to show retry count. |
| Feature | #DEV-18322 | Payments | Adyen: When split payout is activated, our integration now support split on payByLink. |

## Release 2025-38

Release date: Nov 11, 2025

### Main focus areas

This release introduces major improvements across API, integrations, and user management, including support for role synchronization from Entra ID, enhanced gift card functionality, refined inventory and workflow behavior, and broader tagging and promotion capabilities.

### Highlights and Improvements

#### Integrations

*   **Front Systems:** Integration now supports split shipments for BOPS, ROPIS, Ship-from-Store, and BORIS scenarios.
*   **Sitoo:**
    *   Added support for **Credit Note** and **Voucher** gift card types.
*   **Voyado:** Improved delivery address mapping robustness (from previous release context).

#### Authentication & User Management

*   **Auth:** Enterprise App roles from Entra ID / Azure AD can now be synchronized to Omnium UI users.
*   **Users:** Introduced **Linked Roles**—roles can now include other roles (e.g., markets, stores, or additional roles). Linked roles automatically inherit associated permissions, reducing manual maintenance.

#### API

*   Added **distributed locking framework** to prevent race conditions during concurrent order updates.
*   Added endpoints for searching and scrolling **gift cards**, with transactions included in the response model.
*   `AddItemToCart` and `AddManyItemsToCart` now support **custom properties** in requests.

#### Gift Cards

*   Gift cards now store more transaction details and support multi-currency usage.

#### Purchase Orders

*   Added support for **patching tags** on purchase orders.

#### Order Management

*   Order line templates now show returned items with a translated `[RETURNED]` indicator.

#### Workflow

*   Added new property `SkipWarehouseAssignment` to the `CreateDefaultShipment` workflow step.

#### Customer

*   Customer API now supports **tags**, available in both `search` and `put` operations.

#### Inventory

*   Improved precision in **Recalculate Reserved Inventory**, ensuring reservations are only fetched for non-delivered and non-cancelled orders.

#### Promotions

*   **Multibuy promotions** now support **money** as a reward type.
*   Promotions can now specify eligible products based on **search criteria**.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19923 | Front Systems Connector | Front Systems integration now support split shipment for BOPS, ROPIS, ship from store & BORIS. |
| Feature | #DEV-19920 | Auth | Now possible to synchronize Enterprise App roles from Entra ID / Azure AD to (UI) users in Omnium. |
| Feature | #DEV-19912 | Purchase orders | Purchase order patch: Now it is possible to patch tags. |
| Feature | #DEV-19897 | Order management | Order line templates now display returned items with translated \[RETURNED\] indicator. |
| Feature | #DEV-19896 | Workflow | New property SkipWarehouseAssignment for workflow step CreateDefaultShipment. |
| Feature | #DEV-19889 | Customer | Adding support for tags in customer API. Supported both in search and put. |
| Feature | #DEV-19878 | Promotions | Multibuy promotion now supports money as reward type. |
| Feature | #DEV-19866 | Users | Role Management Enhancement - Linked Roles. You can now link roles to other roles to simplify permission management. Example: “Omnium Norway West Order Managers” includes a market, five stores, and an additional role. Create roles with optional linked roles (stores, markets, or other roles). Linked roles automatically inherit all associated permissions. Fewer manual assignments to users when there are changes to market, stores or roles. |
| Feature | #DEV-19833 | Inventory | "Recalculate reserved inventory" is more precise when trying to find reservations from non-delivered and non-canceled orders. It has been fetching wrong orders in cases where different order types have the same statuses but with different settings for "Order is canceled"/"Order is delivered". |
| Feature | #DEV-19782 | Api | Added optional distributed locking framework to prevent race conditions during concurrent order updates. |
| Feature | #DEV-19427 | Api | API endpoints for searching and scrolling gift cards have been added. Transactions are also returned in the gift card model. |
| Feature | #DEV-19425 | Giftcard | More information is stored on gift card transactions, and gift cards can now handle usage in different currencies. |
| Feature | #DEV-19424 | Sitoo Connector | Added functionality for credit note as a type of gift card. This is also available in the Sitoo integration. |
| Feature | #DEV-19423 | Sitoo Connector | The Sitoo integration now supports Voucher type gift cards. |
| Feature | #DEV-19364 | Api | AddItemToCart and AddManyItemsToCart endpoints now support custom properties in request. |
| Feature | #DEV-18550 | Promotions | Adding support specifying promotion products based on search. |

## Release 2025-37

Release date: Nov 04, 2025

### Main focus areas

This release focuses on performance optimizations in order allocation, expanded connector functionality, and enhanced promotion and payment configuration options.

### Highlights and Improvements

#### Order Management

*   Improved performance for allocation to purchase orders for virtual stock locations (VSLs).

#### Payment Integration

*   **Dintero:** Added new configuration setting to disable Split Payout.

#### Connectors

*   **PinMeTo:** Added support for importing store data directly from PinMeTo.
*   **Voyado:** Improved robustness in delivery address mapping in `VoyadoOrderV3Connector`.
*   **Front Systems:** Added support for applying Omnium promotions when using coupons in Front Systems POS.

#### Promotions

*   Added support for fixed percentage discounts on order totals.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19831 | Order management | Performance improvements for allocation to purchase orders for VSLs |
| Feature | #DEV-19829 | Payment integration | New setting in Dintero integration for disabling Split Payout. |
| Feature | #DEV-19284 | PinMeTo Connector | Adding support for importing store data from PinMeTo. |
| Bugfix | #DEV-19823 | Voyado Connector | Improving robustness in mapping of delivery address in VoyadoOrderV3Connector. |
| Feature | #DEV-19834 | Promotions | Adding support for fixed percentage order total discount. |
| Feature | #DEV-19816 | Front Systems Connector | Adding support for applying Omnium promotion when using coupon in Front Systems POS. |

## Release 2025-36

Release date: Oct 28, 2025

### Main focus areas

This release focuses on improving integration robustness, API reliability, and performance, alongside enhancements to promotions, event subscriptions, and shopping cart usability.

### Highlights and Improvements

#### Sitoo Connector

*   Added integration setting allowing all **manual discounts** from Sitoo to always apply.
*   Introduced **Click & Collect v2** support (currently in beta).

#### API

*   Added an **optional distributed locking framework** to prevent race conditions during concurrent order updates.

#### Prices

*   Fixed performance degradation affecting separate price updates — performance restored to optimal levels.

#### Promotions

*   Promotion API endpoints now support fetching, adding, and patching **custom properties**.

#### Payment Integration

*   **Walley:** Product names are now included in return data for improved transparency.

#### Events

*   Event subscription configuration improved with enhanced **market and store selectors**.

#### Cart

*   When adding products from list search, it is now possible to select **“SKU and unit”** as list type.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19798 | Sitoo Connector | Added a setting in the integration to allow all manual discounts from Sitoo to always apply. |
| Feature | #DEV-19782 | Api | Added optional distributed locking framework to prevent race conditions during concurrent order updates. |
| Bugfix | #DEV-19754 | Prices | Fixed a bug where separate price updates performance was degraded (now back to super speed). |
| Feature | #DEV-19753 | Promotions | Promotion endpoints now supports fetching, adding and patching promotion custom properties. |
| Feature | #DEV-19726 | Payment integration | Now, product names are added to Walley returns. |
| Feature | #DEV-19586 | Sitoo Connector | We now aim to support Sitoo Click and Collect v2. Currently in beta. |
| Feature | #DEV-19532 | Events | Event subscriptions - improved market and store selectors. |
| Feature | #DEV-19361 | Cart | Now possible to select "Sku and unit" as list type when adding products from list search. |

## Release 2025-35

Release date: Oct 21, 2025

### Main focus areas

This release delivers performance enhancements, stronger integrations, and improved usability in customer management, inventory reporting, and the mobile app experience.

### Highlights and Improvements

#### Customer

*   **API:** `AddOrUpdateMany` endpoint in the BusinessCustomer API now automatically sets `createdDate` and `modifiedDate`.
*   **GUI:** Customers can now be marked as inactive (`isInactive`) directly from the interface.

#### Price Lists

*   Improved performance when updating price lists.

#### Voyado Connector

*   Extended custom mapping support for customer export to include `storeExternalId`.

#### Inventory

*   New **Inventory Value by Warehouse** report added, showing booked, converted, and original stock values across currencies for better financial insight.

#### Order Management

*   Contact persons can now be added directly to orders.

#### Mobile App

*   Purchase orders can now be edited in the mobile web app by searching for products by SKU or name, scanning barcodes, and adjusting quantities.

#### Products

*   New scheduled task for setting store assortment in Omnium and Sitoo based on inventory status.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Bugfix | #DEV-19732 | Customer | The AddOrUpdateMany endpoint in the BusinessCustomer API has been enhanced to automatically set the createdDate and modifiedDate. |
| Feature | #DEV-19725 | Price list | Performance improvement for price list updates. |
| Feature | #DEV-19706 | Voyado Connector | Extend support for custom mapping in Voyado customer export to support mapping of storeExternalId. |
| Feature | #DEV-19703 | Customer | Customer GUI - possible to toggle isInactive on customers. |
| Feature | #DEV-19693 | Inventory | Added Inventory Value by Warehouse report showing booked, converted, and original stock values across currencies for improved financial transparency. |
| Feature | #DEV-19252 | Order management | Added the possibility to add contact persons to orders. |
| Feature | #DEV-18461 | Mobile App | In the mobile web app, purchase orders can now be easily modified by searching products by SKU or name, scanning barcodes, and updating quantities. |
| Feature | #DEV-18027 | Product | New scheduled task for setting store assortment in Omnium and Sitoo based on inventory status. |

## Release 2025-34

Release date: Oct 14, 2025

### Main focus areas

This release enhances supplier management with improved filtering, visibility, and configuration options, extends purchase order and order management functionality, and improves product search precision and Voyado integration.

### Highlights and Improvements

#### Voyado Connector

*   Extended mapping in `VoyadoOrderV3Exporter` to include color and size on line items.

#### Purchase Orders

*   Purchase order lines can now be split into multiple lines.
*   Option added to create a new order line when modifying quantity from the **Products** tab.

#### Order Management

*   The `IsAwaitingPurchaseOrder` property now integrates with order workflows for better status handling.

#### Products

*   Product list dropdowns now filter and highlight a single SKU when an exact match is found.

#### Suppliers

*   Suppliers can now be filtered by reorder need, with a scheduled task maintaining this status.
*   Supplier list supports filtering by tag, creation date, and reorder suggestion status.
*   Supplier email and phone number are now visible in the supplier view.
*   Custom address types can be configured and assigned to supplier addresses.
*   Suppliers now support default custom properties configured in system settings.

#### Cart

*   Public orders: Discount objects now include `PromotionAdvancedReward` when enabled on the promotion.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19660 | Voyado Connector | Extend mapping in VoyadoOrderV3Exporter to map color and size on line items. |
| Feature | #DEV-19656 | Purchase orders | It's now possible to split a purchase order line into multiple order lines. Also added the option to create a new order line when modifying the quantity from the "products" tab. |
| Feature | #DEV-19648 | Order management | Extending the functionality of property IsAwaitingPurchaseOrder to work with order workflows. |
| Feature | #DEV-19641 | Product | Product list dropdowns now filter and highlight a single SKU when an exact match is searched for. |
| Feature | #DEV-19636 | Supplier | Suppliers can now be filtered by reorder need. A scheduled task updates this status for quick identification and filtering. |
| Feature | #DEV-19635 | Supplier | Supplier list now supports filtering by tag, created date, and reorder suggestion status. |
| Feature | #DEV-19634 | Supplier | Supplier email and phone number are now visible in the supplier view. |
| Feature | #DEV-19633 | Supplier | Custom address types can now be configured and assigned to supplier addresses. |
| Feature | #DEV-19627 | Supplier | Suppliers now support default custom properties configured in system settings. |
| Feature | #DEV-19363 | Cart | Public order model: discount objects now contains PromotionAdvancedReward if enabled on promotion. |

## Release 2025-33

Release date: Oct 7, 2025

### Main focus areas

This release delivers improvements in purchase order management, enhanced product search and relationships, supplier data enrichment, and new integrations for payments and Voyado. Several bug fixes also strengthen stability across customer, inventory, and core services.

### Highlights and Improvements

#### Bug Fixes

*   **Customer:** BusinessCustomer API search now supports `marketGroupIds`.
*   **Inventory:** Additional verification added before reducing inventory in `VslOverallocatedInventoryScheduledTask`.
*   **Core:** Fixed outdated information being returned from cached user context.

#### Excel Import/Export

*   File manager now supports sorting files by attributes such as name, date, and type.

#### Order Management

*   Reserved orders list for inventories excludes cancelled, delivered, and older orders, and is now sorted by creation date for clarity.

#### Purchase Orders

*   New scheduled task recalculates reorder suggestions based on updated inventory per store or warehouse.
*   New user interface extension added to the left side of purchase orders.
*   Configurable status can now be triggered automatically when all deliveries are fully received.
*   Deliveries can now be created on locked purchase orders.

#### Products

*   Related products can be defined at the variant (SKU) level for more granular relationships.
*   Products can be searched by component IDs, returning all products that include the specified IDs.
*   Free-text product search in the UI now includes external IDs.

#### Suppliers

*   Supplier view expanded with statistics, multiple addresses, default shipping cost, and preferred shipping provider.

#### UI Extensions

*   New GUI-extension gadget available for the dashboard.

#### Integrations

*   **Voyado Connector:** Added support for specifying a consent flag to control membership status.
*   **Payments (Adyen via Sitoo):** Payments with a `SitooReceiptId` can now be captured, cancelled, and refunded in Omnium.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Bugfix | #DEV-19631 | Customer | Api - BusinessCustomer search: Possible to search for users with marketGroupIds |
| Bugfix | #DEV-19624 | Inventory | Adding extra verification of overallocation status before reducing inventory in VslOverallocatedInventoryScheduledTask. |
| Bugfix | #DEV-19619 | Core | Fixing issue with outdated info in cached user context. |
| Feature | #DEV-19617 | Excel import/export | File manager now supports sorting by attributes like name, date, and file type. |
| Feature | #DEV-19616 | Order management | Reserved orders list for inventories now hides cancelled, delivered, and older orders, and is sorted by order creation date for improved clarity. |
| Feature | #DEV-19608 | Purchase orders | A new scheduled task recalculates reorder suggestions based on recently updated inventory items per store or warehouse. |
| Feature | #DEV-19594 | Product | Related products can now be configured at the variant (SKU) level, allowing more granular and targeted product relationships. |
| Feature | #DEV-19592 | Supplier | Supplier view now includes statistics and new fields such as multiple addresses, default shipping cost, and preferred shipping provider. |
| Feature | #DEV-19591 | Purchase orders | New user interface extension which is located on the left side of purchase orders |
| Feature | #DEV-19587 | UI Extensions | New GUI-extension gadget for the dashboard |
| Feature | #DEV-19584 | Product | Products can now be searched by component IDs, returning all products that include the specified IDs in component-related properties such as skuId or productId. |
| Feature | #DEV-19578 | Product | Product search now also includes external IDs for free text searches for searching done in the Omnim UI |
| Feature | #DEV-19543 | Voyado Connector | Adding support for specifying a consent that controls membership status in the Voyado connector. |
| Feature | #DEV-19537 | Purchase orders | A configurable status can now be set to trigger automatically when all deliveries on a purchase order are fully received. |
| Feature | #DEV-19500 | Purchase orders | Deliveries can now be created on locked purchase orders |
| Feature | #DEV-19443 | Payments | Adyen payments created in Sitoo can now be captured, cancelled and refunded in Omnium. This will work on payments that has a SitooReceiptId set in the externalIds on payments. |

## Release 2025-32

Release date: Sep 30, 2025

### Focus Areas

This release strengthens integrations (Voyado, Sitoo, Aera), improves purchase order management and store APIs, introduces new analytics and promotion capabilities, and enhances return handling and event logging.

### Highlights and Improvements

#### Payments & Integrations

*   **Aera:** Support added for collect payments when authorization has expired.
*   **Voyado:**
    *   Option to export receipts only for full orders once all shipments are completed or cancelled.
    *   Request bodies for order, order action, and receipt exports are now logged in the order event log.
*   **Sitoo:** Extended mapping of payment methods (e.g., Visa, Vipps++) in SitooPayment → OmniumPayment.

#### Analytics

*   Discontinued date is now included in analytics reports.

#### Store API

*   Stores can now be searched by `externalIds`.

#### Returns

*   Return reasons can include associated charges, automatically applied to returns.

#### Purchase Orders

*   Support for default and highlighted properties in purchase order settings.
*   Ability to add custom templates as attachments to customer comments.
*   Order comments can now be copied into purchase order notes.

#### Orders & Workflow

*   CancelOrderLines workflow step extended to support virtual stock locations.
*   New customer status on orders can now be determined via order queries.

#### Products

*   New events added for `PostVariant`, `PatchVariant`, `PostManyVariants`, and `PatchManyVariants`.

#### Promotions

*   Cart promotions now support rounding policies to control how promotional prices are rounded.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19540 | Payment integration | Support Aera collect when authorization has expired. |
| Feature | #DEV-19534 | Voyado Connector | Adding support for only exporting receipts to Voyado for full orders when all shipments are completed or cancelled. |
| Feature | #DEV-19530 | Analytics | Show discontinued date in analytics report. |
| Feature | #DEV-19528 | Store | Now possible to search stores by externalIds in Store API. |
| Feature | #DEV-19523 | Returns | Return reasons can now include associated charges that are automatically added to returns using those reasons. |
| Feature | #DEV-19519 | Voyado Connector | Now logging request bodies for order, order action and receipt export to Voyado in order event log. |
| Feature | #DEV-19515 | Purchase orders | Added support for default and highlighted properties in purchase order settings. You can now also add custom templates as attachments to customer comments. |
| Bugfix | #DEV-19498 | Order management | Extend CancelOrderLines-workflow step to support virtual stock locations. |
| Feature | #DEV-19492 | Product | Added events for PostVariant/PatchVariant/PostManyVariants/PatchManyVariants. |
| Feature | #DEV-19408 | Sitoo Connector | We have now added more details about paymentMethod eg. Visa/vipps++ to SitooPayment→OmniumPayment mapping in our sitooIntegration. |
| Feature | #DEV-18543 | Promotions | Rounding policies can now be applied to cart promotions to control how promotional prices are rounded. |
| Feature | #DEV-18032 | Purchase orders | Order comments can now be copied to purchase order comments (Notes). |
| Feature | #DEV-17292 | Customer | New customer status on orders can now be determined via order queries, not just by checking if a customer card exists. |

## Release 2025-31

Release date: Sep 23, 2025

### Focus Areas

This release enhances multiple connectors (Voyado, Sitoo, Front Systems), introduces new API roles, strengthens workflow and analytics modules, and provides improved purchase order and product management features.

### Highlights and Improvements

#### Connectors

*   **Voyado:**
    *   Improved registration store mapping, allowing one Omnium store to map to multiple Voyado stores based on `marketId`.
    *   Added support for separate discovery keys on created contacts.
    *   Language mapping introduced in Voyado Order v3 Connector.
*   **Sitoo:**
    *   Unit and conversion factor mapping added to order export.
    *   Order lines not delivered in a booking are now cancelled in Omnium.
*   **Front Systems:**
    *   Fixed exception caused by mapping error in the connector.

#### API & Roles

*   New API user role **"User"** with access to User and Roles API endpoints.

#### Analytics & Pricing

*   Reorder suggestions can round up recommended minimum quantities, ensuring at least one unit remains in stock.
*   New scheduled task for deleting expired cost prices, configurable via tenant settings.
*   Products can now store cost in default currency, with scheduled updates based on exchange rates.

#### Workflow

*   New workflow step allows setting the pickup warehouse code on an order for customer pickup scenarios.

#### Purchase Orders

*   Purchase orders can now be edited via mobile view, including line additions and barcode-based updates.
*   Mass update of purchase order status is now supported.

#### Customers

*   Deleting a private customer automatically removes them as contact person from linked business customers.

#### Orders

*   Scheduled tasks allocating orders to purchase orders now support order type filters.

#### Products

*   Products can be marked as **discontinued** from a specific date.
*   Discontinued products are flagged in product lists and can be blocked from being added to purchase orders.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19468 | Voyado Connector | Improving mapping of registration store when creating Voyado contacts. It is now possible to map one store in Omnium to several Voyado stores based on customer marketId. |
| Feature | #DEV-19467 | Sitoo Connector | Map unit and conversion factor on order lines in export of orders to Sitoo. |
| Feature | #DEV-19463 | API | New API user role "User" gives access to the User and Roles API endpoints. |
| Feature | #DEV-19453 | Analytics | A new setting in the reorder suggestions module allows recommended minimum quantities to be rounded up, ensuring at least one unit is kept in stock for low-selling products. |
| Feature | #DEV-19436 | Voyado Connector | Adding support for creating separate discovery keys for created Voyado contacts. |
| Feature | #DEV-19434 | Front Systems Connector | Fixing exception caused by mapping error in Front Connector. |
| Feature | #DEV-19431 | Voyado Connector | Adding mapping of languages in Voyado Order v3 Connector. |
| Feature | #DEV-19430 | Prices | New scheduled task for deleting expired cost prices. Specify a treshold in the tenant settings in the same way as one does for deleting expired sales prices. |
| Feature | #DEV-19419 | Workflow | New workflow step allows setting the pickup warehouse code on an order to define the store or warehouse for customer pickup. |
| Feature | #DEV-19406 | Purchase orders | Purchase orders can now be edited in the mobile view, including adding new lines and updating quantities via barcode scanning. |
| Feature | #DEV-19396 | Customer | Delete private customer: If a customer is listed as a contact person for any business customers, that relation will now be automatically removed. |
| Feature | #DEV-19390 | Orders | Order type filters are now supported in scheduled tasks that allocate orders to purchase orders. |
| Feature | #DEV-19337 | Products | Products can now have cost set in default currency. Added scheduled task to update product cost regularly based on current exchange rate. |
| Bugfix | #DEV-19147 | Sitoo Connector | If any order lines are not delivered in a booking in Sitoo, they will be cancelled on the order in Omnium. |
| Feature | #DEV-18033 | Purchase orders | Purchase orders can now be selected for mass update of status. |
| Feature | #DEV-16477 | Product | Products can now be marked as discontinued from a specific date. Discontinued products are flagged in the product list, and a validator can block them from being added to purchase orders. |

## Release 2025-30

Release date: Sep 16, 2025

### Focus Areas

This release centers on enhanced POS integrations (particularly with Sitoo and Front Systems), improved product customization, and environment configuration tools for system administrators and integrators.

### Highlights and Improvements

#### POS & Integrations

*   **Sitoo Integration:**

    *   `PaymentMethodName` is now mapped to `externalId` on payment objects.
    *   Custom return statuses can be set when handling returns via Sitoo.
    *   Improved handling of combined return and resale of the same SKU, ensuring correct interpretation as a return.
    *   Extended `ShipmentV3` integration for more robust data synchronization.
    *   Added support for mapping special custom attributes, e.g. for use in promotion filtering.
*   **Front Systems Connector:**

    *   Full support for BORIS (Buy Online Return In Store) now available.
    *   Two-way inventory synchronization is now supported, enabling updates both from and to Front Systems.

#### Products

*   New support for customizable print templates, enabling dynamic document outputs per product or use case.

#### Platform & Settings

*   New option in the general settings menu allows copying all settings between development and test environments, improving configuration management across stages.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19401 | Sitoo Connector | Sitoo Integration: PaymentMethodName is now mapped to externalId on a Sitoo payment. |
| Feature | #DEV-19400 | Front Systems Connector | Front Systems integration now fully supports BORIS |
| Feature | #DEV-19394 | Sitoo Connector | It is now possible to set a specific return status when the return is handled in Sitoo. |
| Feature | #DEV-19378 | Front Systems Connector | Front Systems inventory now supports two way inventory sync (and not just one way sync from Front Systems) |
| Feature | #DEV-19359 | Product | Product - Now possible to create customizable print templates |
| Feature | #DEV-19358 | Core | A new menu point has been added to general settings menu. This allows you to copy all settings between the development and the test environment. |
| Feature | #DEV-18695 | Sitoo Connector | Sitoo Integration: Mapping of special custom attributes, used for promotion filtering. |
| Feature | #DEV-18609 | Sitoo Connector | We have improved our ShipmentV3 integration with Sitoo. |
| Feature | #DEV-16856 | Sitoo Connector | Sitoo Integration: Option to handle return and new sale of the same sku as an actual return. |

## Release 2025-29

Release date: Sep 09, 2025

### Focus Areas

This release delivers enhancements across integrations, reporting, and system robustness. Key improvements include more flexible connector mappings, UI-level event controls, and better accessibility to exports and transactional data.

### Highlights and Improvements

#### Connectors

*   **Voyado:** Extended support for customized mapping between Omnium orders and Voyado receipts.
*   **Tripletex:** Fixed detection of existing customers with leading zeroes in customer numbers.
*   **Sitoo:** Enabled synchronization of promotions from Omnium to Sitoo.

#### Purchase Orders

*   Purchase list now displays supplier SKU ID to improve clarity and accuracy in procurement workflows.

#### Inventory

*   Enhanced robustness in inventory transaction creation for faster and more reliable processing.

#### Product Management

*   Added `FreightClass` to the product patch model, supporting more detailed logistics handling.

#### Events

*   Users can now retrigger events directly from the Omnium UI, offering improved operational control.

#### Reports

*   Inventory exports moved from the configuration area to the reports section for better user accessibility.

#### Notifications

*   Added support for custom fonts in notification templates, enabling more precise branding control.

#### General UI

*   Fixed VAT mode toggle to ensure the dashboard reflects changes in real time.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19297 | Voyado Connector | Adding support for more customization in the mapping between Omnium orders and Voyado receipts. |
| Feature | #DEV-19283 | Purchase orders | Orders to purchase-list now show supplier sku ID. |
| Bugfix | #DEV-19281 | Inventory | Improvements to inventory transaction creation robustness, allowing even faster processing of inventory transactions. |
| Bugfix | #DEV-19278 |  | Detect existing customers in Tripletex based on customer number. This previously did not work if the customer number started with a zero. |
| Feature | #DEV-19277 | Product | FreightClass added to product patch model |
| Feature | #DEV-19239 | Events | Now possible to retrigger an event from Omnium UI. |
| Feature | #DEV-19238 | Reports | Inventory exports are now moved from configuration area to reports area for better accessibility |
| Feature | #DEV-19210 | Notifcation | Notifications - Added support for adding custom fonts to notification templates, giving you more control over branding and design. |
| Feature | #DEV-18694 |  | Sitoo Integration: Sync of promotions from Omnium to Sitoo. |
| Bugfix | #DEV-18544 |  | Update dashboard when toggle vat mode |

## Release 2025-28

Release date: Sep 02, 2025

### Focus Areas

This release extends API functionality across products, users, and inventory, and improves purchase order visibility.

* * *

### Highlights and Improvements

#### Products

*   API now supports searching products by supplier `skuIds`.

#### Users

*   API now supports management of multi-employee users.

#### Inventory

*   Public endpoints added for searching inventory transactions, including scroll support.

#### Purchase Orders

*   Purchase order list view can now be expanded to show product and line item details.

* * *

Release date: Sep 02, 2025

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19233 | Product | Adding support for searching products by supplier skuIds in the API. |
| Feature | #DEV-19134 | Users | Adding support for managing multi emplyee users via API. |
| Feature | #DEV-18611 | Inventory | Public endpoints for searching inventory transactions, with scroll, added. |
| Feature | #DEV-18035 | Purchase orders | Purchase order list now supports expansion to show product and line item details. |

## Release 2025-27

Release date: Aug 26, 2025

### Focus Areas

This release introduces new API endpoints for carts, inventory, and purchase orders, along with improvements to returns and price validation. It focuses on making workflows more flexible and manageable through UI and backend enhancements.

* * *

### Highlights and Improvements

#### Inventory

*   New API endpoint supports incremental updates to inventory quantities, allowing for more efficient stock synchronization.

#### Carts

*   New API endpoint for removing vouchers from carts.
*   New cart validator allows prices on cart items to be reset and recalculated after changes, ensuring consistency.

#### Purchase Orders

*   Purchase order lines in the **Edit Purchase Order** view can now be sorted and searched, improving usability for large orders.
*   New endpoint added for specifying which delivery is being used for goods reception, replacing reliance on GUID-based line item IDs.

#### Orders & Returns

*   A new button in the return list allows creation of returns without an existing order. A default order type can be set for the associated dummy order.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-19157 | Inventory | New endpoint for incremental inventory updates via API. |
| Feature | #DEV-19112 | Carts | New API endpoint for removing vouchers from carts. |
| Feature | #DEV-18686 | Purchase orders | A new endpoint for specifying what delivery one are doing goods reception for. Previously one relied on the line items have GUID line item Ids. |
| Feature | #DEV-19199 | Purchase orders | Purchase order lines in the Edit Purchase Order view can now be searched and sorted for easier management. |
| Featyre | #DEV-19209 | Prices | A new cart validator is available to reset prices on cart items, ensuring prices are recalculated after modifications. |
| Feature | #DEV-19105 | Orders | New button in the return list allows creating a return without an original order. A default order type can be configured for the “dummy” order used in this process. |

## Release 2025-26

Release date: Aug 19, 2025

### Focus Areas

This release focuses on improving API flexibility, enriching order and promotion workflows, and strengthening visibility in purchase orders and batch operations. It also adds support for advanced webhook integrations and enhances logging and traceability.

* * *

### Highlights and Improvements

#### Orders

*   The order patch endpoint now supports:
    *   `KeepExistingCustomProperties`
    *   `PropertiesRemovalConditions`
    *   Adding multiple list-type properties on both orders and order lines.

#### Purchase Orders

*   New widget displays related customer and shipping info when only one reservation is linked to a purchase order.
*   New API endpoint enables explicit selection of which delivery a goods reception applies to—removing reliance on line item GUIDs.

#### Price Lists & Integrations

*   The **Webhook Workflow Step** now supports custom request headers by defining keygroup `"RequestHeaders"` in properties.

#### Promotions

*   Introduced new "Kit promotion" type: discount is applied when all defined components are added to the cart.

#### Products

*   Fixed issue where prices on product options could not be updated via API—this is now supported.

#### GUI & Logging

*   Batch updates displayed in the event log now include the origin and all affected entity IDs for better traceability.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Bugfix | #DEV-19133 | Products | Prices on Product Options can now be updated from the API. |
| Feature | #DEV-19103 | Orders | Order Patch - Added KeepExistingCustomProperties & PropertiesRemovalConditions. Patch now supports adding multiple "List" properties on order and order line. |
| Feature | #DEV-19111 | Price lists | "Webhook workflow step" now supports having custom request headers by adding properties with keygroup set to "RequestHeaders". |
| Feature | #DEV-18034 | Purchase orders | New widget in purchase order that shows related customer and shipping information when there is only one related reservation. |
| Feature | #DEV-18650 | GUI | Batch updates shown in the event log now also displays origin and all affected IDs. |
| Feature | #DEV-18686 | Purchase orders | A new endpoint for specifying what delivery one are doing goods reception for. Previously one relied on the line items have GUID line item Ids. |
| Feature | #DEV-18047 | Promotions | New promotion type "Kit promotion" - define components of the kit, if all components is added to cart, the discount will be applied to the components. |

## Release 2025-25

Release date: Aug 12, 2025

### Focus Areas

This release delivers major enhancements in price list management, cart handling, and purchase order workflows. It also improves infrastructure performance, report access control, and customization of user interfaces and notifications. Several connector-specific fixes and enhancements are also included.

* * *

### Highlights and Improvements

#### Price Lists & Pricing

*   New API endpoints for searching and scrolling price list items with support for large datasets.
*   Activation/deactivation of price lists is now processed asynchronously via background jobs, improving UI responsiveness.
*   Mass deletion of price list items is now supported.
*   When pricing by unit, unit-specific prices are prioritized over unit-less prices.

#### Carts

*   Users can now select specific line items/groups when adjusting quantities.
*   Multiple shipments can be managed more easily, with options to assign lines to selected shipments and to override default pricing using warehouse-specific prices.
*   Inactive product order lines now show a warning icon.
*   `SortOrder` field added to the cart search API.
*   Visual improvements to the shipment modal, with clearer distinction between physical and virtual warehouses.

#### Purchase Orders

*   New read-only statuses prevent editing exported purchase orders.
*   Option added to include packages as-is when creating purchase orders from customer orders.
*   Purchase order templates can now be customized for both print and notifications.
*   Copy-pasting product lists into purchase orders supports setting custom prices and discounts.
*   Notifications (email/SMS) are now fully integrated and log both content and sending status.

#### Orders

*   New endpoint added for overwriting orders.

#### Products

*   Assortment selector improved in product edit view.
*   New setting allows hiding the "Create New Product" button from the UI for controlled environments.
*   Mass update allows conditional removal of properties and categories.
*   Support added for creating custom views in the product edit screen.

#### Inventory

*   Inventory and virtual inventory quick edit views now display reservations and availability.
*   VSL allocation modal now includes reservation and availability indicators per location.

#### Reports

*   Custom reports can now be restricted based on user roles.
*   Inventory transaction reports support additional product attributes such as name, color, and size.

#### Notifications

*   Order templates now support additional merge tags: brand, alt. product name, expected delivery/shipment dates, shipment ID, and shipment order status.
*   Order lines can now be grouped by shipment in email templates.

#### GUI & UX

*   Dropdowns in the UI now support grouped rows for better navigation.
*   Mobile app improvements for numeric input.
*   General performance and scalability improvements.
*   PDF merge function used for shipping labels has been replaced with a more robust implementation.

#### Connectors

*   **Tripletex**: Fixed rounding issues in shipment cost and discount mapping.
*   **Voyado**: Improved `shippingMethod` mapping in Order V3 format.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-18582 | Price lists | New API endpoints are available for searching and scrolling price list items with support for large datasets. |
| Feature | #DEV-18549 | Price lists | Improved price list processing: Activating and deactivating price lists is now processed via a background queue. This eliminates long loading times in the UI and instead shows a clear status indicator on the price list. |
| Feature | #DEV-18203 | Price lists | It is now possible to select price list items and mass delete them. |
| Feature | #DEV-17897 | Infrastructure | Improved performance and scalability under the hood. |
| Feature | #DEV-18644 | Infrastructure | Replaced PDF merge function used for merging shipping labels. |
| Feature | #DEV-18556 | Prices | Unit specific prices will be prioritized over prices without unit specified, if searching for a price in context of a unit. |
| Feature | #DEV-18476 | Orders | New endpoint for overwriting orders. |
| Feature | #DEV-18636 | Payments | PaymentMethodId has been marked as deprecated since we only use PaymentMethodName. The field might be removed in the future. |
| Feature | #DEV-18597 | Products | Product - improvements to assortment selector on 'edit product'. |
| Feature | #DEV-18202 | Products | A new setting allows the “Create New Product” button in the UI to be hidden, supporting use cases where products are created through plugins or integrations. |
| Feature | #DEV-18388 | Carts | Cart enhancements - Now possible to select the lineItem/group you want to be adding/removing quantity from. |
| Feature | #DEV-18321 | Carts | Cart - Easier management of multiple shipments. It is now possible to create a shipment for selected order lines and to change the selected shipment when adding products to the cart. Additionally, stores can now be flagged with HasWarehouseSpecificPrices = true. When enabled, prices are fetched from the shipment's warehouse instead of the selected store. |
| Feature | #DEV-18256 | Carts | Cart & Order - added warning icon for order lines with inactive products. |
| Feature | #DEV-18620 | Carts | Api: SortOrder is now added to cart search request. |
| Bugfix | #DEV-18384 | Carts | Improments to the shipment modal in the cart view. Highlight VSLs in the warehouse selector and show both selected physical and virtual warehouse in the modal. |
| Feature | #DEV-18260 | Inventory | Enhancing product inventory view. Now showing reservations and available inventory in the inventory and virtual inventory quick edit views. |
| Feature | #DEV-18352 | Inventory | Improving VSL allocation modal by showing reservations and available inventory. This makes it more clear what the actual availability of a product is on different location allowing for more informed allocations. |
| Feature | #DEV-18166 | Reports | Custom reports can now be restricted by user roles, allowing role-based access control for report visibility and management. |
| Feature | #DEV-18484 | Reports | Inventory transaction custom reports now support product properties like name, color, and size for improved reporting flexibility. |
| Feature | #DEV-18407 | Gui | Dropdowns in the UI now support grouped rows, improving navigation in larger lists. |
| Feature | #DEV-18519 | Gui | Product - Create custom views for "Edit product". |
| Feature | #DEV-18433 | Purchase orders | Purchase orders now support read-only statuses to prevent changes after export. |
| Feature | #DEV-18514 | Purchase orders | New setting allows packages to be included as-is when generating purchase orders from customer orders, without breaking them down into components. |
| Feature | #DEV-18356 | Purchase orders | Purchase order - Design your own templates for purchase order print and notifications. |
| Bugfix | #DEV-18507 | Purchase orders | Custom price and discount can now be set when pasting product list information to create purchase order line items. |
| Feature | #DEV-18522 | Notifications | Order design templates - add merge tags for brand, alternative product name, expected delivery date, shipment ID, shipment order status and expected shipment date. |
| Feature | #DEV-18589 | Notifications | Order templates - added shipments merge group which allows order lines to be grouped by shipment. |
| Bugfix | #DEV-18627 | Tripletex connector | Fixing rounding issue in shipment cost in Tripletex connector. |
| Bugfix | #DEV-18631 | Tripletex connector | Fix issue in Tripletex shipment discount mapping. |
| Feature | #DEV-18638 | Voyado connector | Improve mapping of shippingMethod in Voyado Order V3 mapping. |

## Release 2025-24

Release date: June 24, 2025

### Focus Areas

This release adds greater flexibility in delivery and pricing logic, improves mass update tooling for product data, and enhances transparency and traceability in order and purchase workflows. New support for an additional payment method is also introduced.

* * *

### Highlights and Improvements

#### Purchase Orders

*   Delivery status can now be manually edited in the UI, overriding automatic calculations.
*   Notifications (email and SMS) related to purchase orders are now logged in the event log, and delivery status is recorded in the workflow action log.

#### Products

*   Mass update functionality now supports removal of existing properties based on specified conditions, and removal of selected categories.

#### Orders & Workflow

*   New events are triggered when an order is successfully reallocated using the "Try reallocate on cancel" step.

#### Pricing

*   If no price is defined for a selected unit, the system will now default to using the base unit price multiplied by the conversion factor, simplifying multi-unit support.

#### Payments

*   New support added for the **Aera Invoice** payment type.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17301 | Purchase orders | Delivery - It's now possible to edit delivery status manually from the UI, and override the delivery status calculation |
| Feature | #DEV-16826 | Product | Product - enhancements to "mass update" from the UI. It is now possible to create a list of properties that specifies conditions for removing existing properties. It is also possible to specify categories to remove |
| Feature | #DEV-18357 | Purchase orders | Purchase order notifications (email and SMS) are now logged in the event log. Sending status is also recorded in the workflow action log. |
| Feature | #DEV-18463 | Order | Added events for when a order is successfully reallocated using the "Try reallocate on cancel" workflow step. |
| Feature | #DEV-18416 | Prices | If no price exists for the selected unit, default to the base unit price multiplied by the conversion factor. This allows the use of units on products without specifying individual prices for each unit type. |
| Feature | #DEV-18288 | Payment provider Aera | New payment type for Aera Invoice |

## Release 2025-23

Release date: June 17, 2025

### Focus Areas

This release improves purchase order automation and performance, new help menu directly in the UI, and introduces several backend reliability improvements including scroll API behavior.

* * *

### Highlights and Improvements

#### Purchase Orders

*   Purchase order lines now include `color` and `brand` attributes in the UI, API, and Excel exports.
*   New workflow step automatically sets expected delivery date based on supplier settings or defaults.
*   Added workflow step for automatic recalculation of ATP values for relevant inventories.
*   Users can now manually unlink reorder suggestions from a purchase order to allow further modifications.
*   Workflow steps can now be executed after a purchase order is saved, aligning with customer order workflows.
*   Significant performance boost to the scheduled task generating reorder suggestions.

#### API & Core Behavior

*   Scroll API endpoints now return `404 Not Found` if a scroll ID is missing or expired, instead of a misleading `200 OK`.

#### Invoices

*   Invoices now include full address data: customer billing address, sender address, and delivery address.

#### UI & Usability

*   A new context-aware help menu has been added, showing relevant articles based on the current view.
*   The mobile app now uses a numeric keyboard by default for numeric input fields.

#### Connectors

*   **Sitoo**: `registerId` is now included in the order property list.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-18268 | Core | Scroll-endpoints now return "404 Not Found" if a scroll with a given ID has expired or does not exist. Previously, they would always return "200 OK". |
| Feature | #DEV-18318 | Support | A new context-aware help menu is now available, providing quick access to relevant help articles based on the user's current view. |
| Feature | #DEV-18350 | Invoices | Invoice now contains addresses: Customer/billing address, invoice sender address, and delivery address. |
| Feature | #DEV-18283 | Purchase orders | Purchase order lines now include color and brand properties, available in the UI, API, and Excel exports. |
| Feature | #DEV-18365 | Purchase orders | A new purchase order workflow step automatically sets the expected delivery date based on supplier settings or default values. |
| Feature | #DEV-18366 | Purchase orders | A new purchase order workflow step now automatically recalculates ATP values for the inventories included in the order. |
| Feature | #DEV-18367 | Purchase orders | Users can now manually release the link between a reorder suggestion and a purchase order to allow new suggestions before confirmation of the previous purchase order. |
| Feature | #DEV-18375 | Purchase orders | Purchase order workflows can now include steps that run automatically after the order is saved, similar to customer order workflows. |
| Feature | #DEV-18391 | Purchase orders | The scheduled task for generating reorder suggestions has received major performance improvements for faster execution. |
| Feature | #DEV-18369 | Sitoo Connector | We now add registerId to our order property list. |
| Feature | #DEV-18381 | GUI | The mobile app now defaults to the numeric keyboard for numeric input fields. |

## Release 2025-22

Release date: June 11, 2025

### Focus Areas

This release brings significant improvements to order and cart workflows, purchase order integrations, payment provider support, and performance across product data processing. Key enhancements include deeper automation, improved data quality enforcement, and broader integration capabilities.

* * *

### Highlights and Improvements

#### User Interface & Usability

*   New **quick-edit view** for order lines in carts, enabling faster and customizable edits.
*   **Cart groups** can now be duplicated in the UI, including their line items.
*   **Employee names** are now shown in the log view in multi-user environments for better traceability.

#### Orders & Workflows

*   New **workflow step** to change order status based on matching order line property values.
*   Workflow support for **enriching orders with product data via GTIN**.
*   Shipment workflow can now **enrich shipments with custom properties** from the selected shipment option.

#### Purchase Orders

*   Purchase order lines now include **color and brand** data – visible in UI, API, and Excel.
*   **Integration with Sitoo**: Export purchase orders to Sitoo as deliveries, and reconcile counted differences back into Omnium.

#### Payments & Integrations

*   **New integration with Zaver** for Swedish payments up to €500,000.
*   **New Aera integration** now supports capture, release, and refund operations.
*   **Shopify connector** now supports **custom shipment option mapping** during order sync.

#### Customers & API

*   **Customer search API** improved: optionally exclude customers without `storeIds` when filtering.
*   **Bulk API events** added for B2B/B2C customer add/update operations.

#### Reporting & Products

*   New **category view in product reports**: browse category tree and view revenue by subcategory.
*   **Product inventory task** performance improved; now includes inactive products and can run more frequently.
*   **Excel product import** now supports **assortment code** input.

#### Core Platform & Data Integrity

*   **Data size validation**: JSON payloads are validated per entity before storage (warning at ~750kB, hard fail at 1MB) to maintain system performance.
    *   See [docs](../Product.md#best-practices) for details.

#### Invoices

*   **Invoice search API** now supports filtering by `marketIds` and `storeIds`.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-18101 | Orders | New workflow step - Change the status of an order based on matching property values on order lines. |
| Feature | #DEV-18102 | Orders | New workflow step for enriching order with product information, fetching products using GTIN. |
| Feature | #DEV-17656 | Orders | New workflow step: Enrich shipments with custom properties from the connected shipment option. |
| Feature | #DEV-18254 | Carts | New customizable quick edit view for order lines. |
| Feature | #DEV-16227 | Carts | Cart groups can now be duplicated in the UI, including all their line items. |
| Feature | #DEV-18283 | Purchase Orders | Purchase order lines now include color and brand properties, available in the UI, API, and Excel exports. |
| Feature | #DEV-18143 | Purchase Orders | You can now create purchase Orders in omnium, export it as a delivery in sitoo, and then receive the counted difference in omnium on your purchase order once the delivery is finished. This means your store employees can do even more actions in sitoo. To set up: Make an ordreflow step that exports your purchaseorder to sitoo, and then set up the events in sitoo to include shipments-v3. |
| Feature | #DEV-17978 | Payments | New swedish payment provider Zaver for payments up to 500k euro. See the technical documentation for how to setup [`Zaver`](../plugins/Payments/zaver.md). |
| Feature | #DEV-18051 | Payments | New integration for the payment provider Aera. We now support capture, cancellation/release and refund of existing Aera payment sessions. |
| Feature | #DEV-18238 | Customers | Business customer search: now possible to set 'isStoreIdsRequired' to exclude customers without any storeIds set if you are filtering by storeIds. |
| Feature | #DEV-18252 | Customers | Api: Added events for B2B and B2C customer add/update many. |
| Feature | #DEV-17356 | Reports | A new category view has been added to product reports, allowing users to browse the category tree and view revenue by subcategory. |
| Feature | #DEV-18235 | Products | Product inventory scheduled task performance has been significantly improved. The task can now run more frequently and it will also include inactive products. |
| Feature | #DEV-18045 | Products | Product Excel import now supports importing assortment codes to products. |
| Feature | #DEV-18236 | Core | Data size validation: JSON size is now measured per entity (a product for instance) before storing data (warning at ~750kB, hard fail at 1MB); oversized documents will be rejected to ensure performance – especially important for frequently updated product data. We've been monitoring your usage for a long while, so those few affected users are already notified. Please see [https://docs.omnium.no/docs/Product#best-practices](../Product.md#best-practices) |
| Feature | #DEV-18000 | Users | Employee names are now shown in the log view for actions performed in multi-user environments. |
| Feature | #DEV-18259 | Invoices | Api: Invoice search now support marketIds and storeIds filters. |
| Feature | #DEV-18281 | Shopify Connector | Shopify order sync. Possible to add custom shipment option mapping. See: [https://docs.omnium.no/docs/plugins/ECOM/Shopify#shipment-option-mapping](../plugins/ECOM/Shopify.md#shipment-option-mapping) |

## Release 2025-21

**Release date:** 03 Jun 2025

### Focus Areas

This release further strengthens integration support for payments and external platforms, while adding configurability and visibility improvements across the invoice model, customer data, and purchase order management. Several enhancements also support more advanced use of custom properties and pricing logic.

* * *

### Highlights and Improvements

#### Payments & Integrations

*   Added support for **authorization** in webhook-based payment providers.
*   **Aera** integration now supports capture, release, and refund of existing sessions.
*   **Adyen** integration now supports **split payments** across multiple accounts.
*   Updated **Voyado connector** to support **Order API v3**.

#### Orders & Purchase Workflows

*   New workflow step enables **shipment enrichment** with custom properties from the selected shipment option.
*   **Tags** are now shown in list views for **purchase orders and deliveries**. Filtering is available in both UI and API with support for included/excluded tags.

#### Invoices & Financials

*   The invoice model has been updated to support **multiple payments** instead of a single payment method string.
*   Payments are now the preferred structure for assigning payment details to invoices.

#### Business Customers & API

*   Business customer search can now **exclude customers without `storeIds`** when filtering by store ID.
*   Business customer patch endpoint now supports:
    *   `PropertiesRemovalConditions`
    *   `KeepExistingCustomProperties` for greater control of custom property updates.

#### Prices & Cart Logic

*   External price request logic now includes **item quantity** when adding items to the cart, enabling more precise pricing integrations.

#### Reports & Export

*   **Product brand** is now included in the **Excel export** of inventory data.

#### Platform Core

*   Custom properties can now use **JSON as a value type**, allowing for more complex and structured data to be stored and configured in the UI.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17826 | Payments | Adding support for authorization with webhook payment providers. |
| Feature | #DEV-18051 | Payments | New integration for the payment provider Aera. We now support capture, cancellation/release and refund of existing Aera payment sessions. |
| Feature | #DEV-18075 | Payments | Adding support for splitting payments on different accounts in Adyen. |
| Feature | #DEV-17656 | Orders | New workflow step: Enrich shipments with custom properties from the connected shipment option. |
| Feature | #DEV-17583 | Voyado Connector | Adding support for Voyado Order API v3. |
| Feature | #DEV-18179 | Reports | Product brand is now included in the Excel export of inventory. |
| Feature | #DEV-18190 | Prices | External price requests now contains the quantity of the item when adding an item to cart. |
| Feature | #DEV-18192 | Business Customers | Patch Business Customer: Added PropertiesRemovalConditions and KeepExistingCustomProperties for more control over custom properties when patching. |
| Feature | #DEV-18238 | Business Customers | Business customer search: now possible to set 'isStoreIdsRequired' to exclude customers without any storeIds set if you are filtering by storeIds. |
| Feature | #DEV-18227 | Invoices | Invoice model now contains a list of payments, instead of just a single paymentMethodName. Payments are now the preffered way of settings payment information to an invoice. |
| Feature | #DEV-18162 | Purchase Orders | Tags are now shown in the list views for purchase orders and deliveries. Tag filters are available in both the UI and API, including support for included and excluded tag filtering. |
| Feature | #DEV-16859 | GUI | Support JSON as value type on custom properties. |

## Release 2025-20

**Release date:** 27 May 2025

### Focus Areas

This release focuses on enhancing configurability, tag-based visibility logic, and UI scalability. It also brings improvements to pick list workflows, API flexibility, and integration capabilities across Shopify, orders, and notifications.

* * *

### Highlights and Improvements

#### GUI & User Experience

*   Custom properties now support **JSON as a value type**.
*   Improved **store and warehouse picker** for customers with large location datasets.
*   GUI extensions can now be **filtered by tags** applied to the selected object in the UI.

#### Order Management & Workflows

*   A **scheduled task** now auto-updates order status if order lines pass their **ETA**.
*   New setting: when ETA changes on a purchase order or delivery, connected orders or shipments can also be auto-updated.
*   **Returns** can now be partially updated using a new **PATCH endpoint**.
*   API now supports fetching **specific versions** of an order.
*   **Order statuses** now support **included/excluded tag filters** for workflow visibility control.

#### Purchase Orders & Tags

*   **Purchase order statuses** and **delivery workflows** now support **tag filters** for conditional visibility.
*   **Tags** are now shown in purchase order and delivery list views (UI + API) with support for include/exclude filtering.

#### Carts & Product Configuration

*   New API endpoint: `/api/Cart/{cartId}/DeleteShipments` for deleting shipments in a cart.
*   Support for **standalone custom order lines** (configurable products) without a linked product.

#### Pick Lists

*   Pick lists can now be **validated by scanning order IDs and product barcodes**; validated orders are highlighted in green.
*   **Extended order metadata** (size, color, brand) is now shown in the pick list UI view, similar to the printed version.

#### Products & Data Handling

*   Patch requests for OmniumProduct can now explicitly **set nullable fields to null** using `FieldsToForceNull`.

#### Notifications & Messaging

*   Email notifications now show **readable labels** for dynamic fields instead of technical IDs.
*   Added support for **barcode and QR code** merge tags in notification templates.

#### Shopify Connector

*   Product export now syncs **SEO title and description** from Omnium to Shopify.

#### Settings & Configuration

*   New setting: `CustomNumberOptions` added to number field configurations.

#### Invoices & Events

*   It is now possible to **subscribe to invoice creation events** for integration or automation purposes.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17332 | Products | It is now possible to patch nullable fields in OmniumProduct to null by adding the path to the field to the list of strings named FieldsToForceNull, e.g. "SeoInfo.ExcludeFromFeed" or "ExternalIds". |
| Feature | #DEV-16859 | GUI | Support JSON as value type on custom properties. |
| Feature | #DEV-18079 | GUI | Store and warehouse picker and search functionality have been improved for customers with a large number of locations. |
| Feature | #DEV-18163 | GUI | GUI extensions can now be filtered based on the tags applied to the selected object in the UI. |
| Feature | #DEV-17316 | Settings | Number options - new option "CustomNumberOptions". |
| Feature | #DEV-17314 | Carts | Support creation of configurable products, standalone custom order lines without a linked product. |
| Feature | #DEV-18081 | Carts | New API-endpoint for deleting shipments /api/Cart/{cartId}/DeleteShipments. |
| Feature | #DEV-17918 | Purchase Orders | Purchase order statuses now support included and excluded tag filters, enabling tag-based visibility control in the workflow. |
| Feature | #DEV-18162 | Purchase orders | Tags are now shown in the list views for purchase orders and deliveries. Tag filters are available in both the UI and API, including support for included and excluded tag filtering. |
| Feature | #DEV-17835 | Settings | Order statuses can now define included and excluded tags, enabling tag-based visibility control in the order workflow. |
| Feature | #DEV-17679 | Pick lists | Pick lists can now be validated by scanning order IDs and product barcodes. Validated orders are marked in green to indicate correct picking. |
| Feature | #DEV-17680 | Pick lists | The pick list view now includes extended order metadata such as size, color, and brand, just like printed pick lists. |
| Feature | #DEV-18080 | Shopify connector | Shopify product export: Sync Omnium Seo title and description to Shopify product. |
| Feature | #DEV-17618 | Notifications | Dynamic fields in email notifications now show readable and searchable labels instead of technical IDs. |
| Feature | #DEV-18100 | Notifications | Added barcode and QR code merge tags. |
| Feature | #DEV-17015 | Orders | A scheduled task now automatically updates the order status for any orders with order lines that have passed their ETA date. New setting: Update shipment / order status of all connected orders when the ETA is updated for an purchase order or delivery. |
| Feature | #DEV-17976 | Orders | A PATCH endpoint is now available for returns, supporting partial updates to return orders. |
| Feature | #DEV-18145 | Orders | API now open for fetching specific order versions. |
| Feature | #DEV-18147 | Invoices | Now possible to subscribe to invoice creation events. |

## Release 2025-19

**Release date:** 20 May 2025

### Focus Areas

This release introduces user interface improvements for settings and purchase order management, adds finer integration control for Voyado and Shopify, and enhances usability in order handling workflows.

* * *

### Highlights and Improvements

#### GUI & Performance

*   **Settings UI** performance has been significantly improved, with faster load times and smoother interactions.

#### Orders & Workflow

*   Users are now **automatically redirected to the order** when a cart is converted in the Omnium UI, streamlining navigation.

#### Purchase Orders

*   Purchase order lines can now be **reordered via drag-and-drop** directly in the UI for easier manual adjustments.

#### Voyado Connector

*   It is now possible to configure **Voyado connectors per market group**, allowing more granular control of data flows across regions.

#### Shopify Connector

*   **Custom properties** from Omnium can now be synced to Shopify **metafields** of type `integer` and `boolean`.
    *   See documentation: [Shopify Metafields](../plugins/ECOM/Shopify.md#meta-fields)

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17529 | Voyado Connector | Support separating Voyado connectors on market group level. |
| Feature | #DEV-18007 | Purchase Orders | Purchase order lines can now be rearranged via drag-and-drop in the UI. |
| Feature | #DEV-18021 | Orders | Automatic redirect to orders for converted carts in the Omnium UI. |
| Feature | #DEV-18058 | Shopify Connector | Shopify product sync: We now support syncing Omnium custom properties to metafields of type integer and boolean. Documented here: [https://docs.omnium.no/docs/plugins/ECOM/Shopify#meta-fields](../plugins/ECOM/Shopify.md#meta-fields) |
| Feature | #DEV-18054 | GUI | The settings UI has been significantly optimized for better performance and faster load times. |

## Release 2025-18

**Release date:** 13 May 2025

### Focus Areas

This release introduces improved inventory handling for backorders, support for granular package deletion in carts, and additional control over product-related bonus behavior in Voyado. It also includes a new integration with the Swedish payment provider Zaver.

* * *

### Highlights and Improvements

#### Inventory Management

*   Order lines with **insufficient inventory** will no longer be invalidated if the product is flagged as **backorderable**.
*   A new inventory transaction type **"Manual"** has been introduced for improved tracking of manual adjustments.

#### Order API Enhancements

*   The cart API now supports a **`deleteComponents`** parameter when deleting a package or bundle. When set to `true`, it will also remove all associated component lines.

#### Voyado Connector

*   Products in Omnium can now be marked to **exclude them from generating bonus points** when receipts are exported to Voyado.

#### Payments & Integrations

*   Added support for the **Zaver** payment provider (Sweden), supporting payments up to **€500,000**.
    *   Setup instructions: [Zaver Integration](../plugins/Payments/zaver.md)

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-16214 | Voyado connector | It is now possible to mark products in Omnium so that they do not trigger bonus points generation in Voyado when receipts with these products are exported to Voyado. |
| Feature | #DEV-17908 | Inventory | Order lines with insufficient inventory are no longer invalidated by the inventory validator if the product is marked as a backorder product. |
| Feature | #DEV-17977 | Inventory | New inventory transaction type "Manual". |
| Feature | #DEV-17927 | Orders | Deleting an order line from the cart using the API now supports an optional parameter, deleteComponents. If you're deleting a package or bundle, you can set deleteComponents to true to also delete all components associated with that package or bundle. |
| Feature | #DEV-17896 | Payments | New swedish payment provider Zaver for payments up to 500k euro. See the technical documentation for how to setup Zaver ([https://docs.omnium.no/docs/plugins/Payments/zaver](../plugins/Payments/zaver.md)). |

## Release 2025-17

**Release date:** 06 May 2025

### Focus Areas

This release introduces a flexible rounding policy framework for pricing, enhancements to returns and exchange workflows, and improvements to integrations, notifications, and product list usability. It also includes extended support for custom SMS and payment providers.

* * *

### Highlights and Improvements

#### Pricing & Rounding Policies

*   A new **decimal rounding policy** has been added, allowing prices to be rounded to the nearest decimal.
*   **Rounding models** now support multiple rule types and configurations.
*   The **settings UI** now allows full management of rounding rules and policies.
*   **Promotions** can now be linked to specific rounding policies for consistent price rounding.
*   **Price lists** can apply a rounding policy to enforce fixed prices across the list.

#### Returns & Exchange Orders

*   Return endpoint now supports **exchange order creation**, which includes:
    *   Creating a return
    *   Creating a new exchange order
    *   Transferring full or partial payment to the new order for future return processing

#### Notifications

*   You can now configure an **external SMS provider using Basic Authentication** via settings (URL, username, password).
*   A new **merge tag for line item images without predefined styling** has been added for greater template flexibility.

#### Payments & Providers

*   Added support for the **Zaver** payment provider (Sweden).

#### Product Management

*   **Advanced filters** in the product list are now **grouped with headings**, improving navigation and usability.
*   `SeoInformation.Keywords` has been added to the **global inheritance model** for products.

#### Sitoo Integration

*   New support for **mapping “DeliveryInfo”** from a product’s custom property.
*   A **new setting** allows selection of the **product language** used in the export to Sitoo.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17840 | Notifications | You can now configure an external SMS provider using Basic Authentication. Simply set the URL, username, and password in the SMS settings to bring your own SMS provider using basic authentication. |
| Feature | #DEV-17849 | Notifications | New merge tag for lineitem image without predefined styling in notification templates. |
| Feature | #DEV-17487 | Payments | New payment provider Zaver. |
| Feature | #DEV-17342 | Prices | A new decimal rounding policy has been added to the rounding framework, allowing prices to be rounded to the nearest decimal value. |
| Feature | #DEV-17343 | Prices | Models have been added to the rounding policy framework, enabling flexible configuration and support for multiple types of rounding rules. |
| Feature | #DEV-17344 | Prices | Rounding rules can now be managed and configured through the settings UI. |
| Feature | #DEV-17345 | Prices | Promotions can now be assigned to rounding policies, which define how prices are calculated and rounded within the promotion. |
| Feature | #DEV-17450 | Prices | Price lists can now apply a rounding policy to fix all prices according to the selected rounding rule. |
| Feature | #DEV-16827 | Products | Advanced filters in the product list are now grouped with headings to improve navigation and usability. |
| Feature | #DEV-17894 | Products | SeoInformation.Keywords added to Global inheritance - Built-in properties. |
| Feature | #DEV-17753 | Orders | Return endpoint now has options to create an 'Exchange order' - for instance, if you return an item and exchange it for another item. This will 1: Create a return. 2: Create a new order (the exchange order). 3: Transfer the original payment (or part of it) from the original order to the exchange order, so that future returns may credit the original payment. |
| Feature | #DEV-17872 | Sitoo integration | Adding mapping of "DeliveryInfo" on products from custom property in Omnium. |
| Feature | #DEV-17844 | Sitoo integration | New setting for selecting which product language to export. |

## Release 2025-16

**Release date:** 29 Apr 2025

### Focus Areas

This release introduces extended functionality for order processing, promotions, and UI extensions. It also brings enhancements to pick workflows, API capabilities, and system performance in high-volume environments.

* * *

### Highlights and Improvements

#### Promotions

*   “Multi-buy / Mix & Match” promotion type now supports fixed pricing (e.g. buy 2 items for 399 NOK).

#### GUI Extensions

*   Iframe-based GUI extensions can now receive full object payloads via event listeners, simplifying setup and data access.
*   Support for injecting selected store IDs into iframe URLs via `{{selectedStoreIds}}` placeholder.

#### Order Management

*   Added setting to trigger custom `WebhookOrderValidator` when opening orders.
*   Serial numbers can now be scanned or set directly in the order and picking views.
*   The `Order/GetAsPdf` endpoint now supports custom templates and partial shipments.
*   `InvoiceComment` can now be patched via cart/order API.

#### Pick Lists

*   Order status in the “Orders to Pick” view can now be set to any allowed status.
*   “Ready to Pick” filter is now configurable to include custom statuses.

#### API and Integrations

*   Price lists can now be activated or deactivated via API.
*   Tripletex connector now supports invoicing partial shipments.

#### Notifications

*   Notification template editor extended with new merge tags: order status, completion date, footer text, and address line 2.

#### Imports & Inventory

*   Inventory batch recalculation is now triggered during Excel import.
*   Significant performance improvements in the inventory view when working with 100+ stores.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17565 | Promotions | Extended promotion type "Multi-buy / Mix&Match" with support for fixed price. Buy 2 T-shirts and pay 399 NOK. |
| Feature | #DEV-17710 | GUI | You can now receive entire objects in your iframes. By adding an event listener you will see much more data being sent, and the setup process on gui extensions will be easier as you dont have to send individual data through the url. |
| Feature | #DEV-17681 | GUI | UI extensions with iframes can now have querystring param for selected stores. `{{selectedStoreIds}}` in url will be replaced with a comma separated list of ids, if user has selected some stores in Omnium GUI. |
| Feature | #DEV-17278 | Orders | Added setting to run order validator (WebhookOrderValidator) when an order is opened. |
| Feature | #DEV-17627 | Carts | Order property "InvoiceComment" added to cart/order patch object. |
| Feature | #DEV-17304 | Orders | Api endpoint extended. Order/GetAsPdf now support both custom design template and order info only for a specific shipment. |
| Feature | #DEV-17644 | Orders | Serial numbers can now be set or scanned directly in the order view and the “Orders to Pick” view to update order lines. |
| Feature | #DEV-17662 | Pick lists | In the “Orders to Pick” view, order status can now be set to any status defined in orderStatus.availableStatuses. Admin view has been updated with editing options for this setting. |
| Feature | #DEV-17527 | Pick lists | It is now possible to configure which statuses should be included by default in the “Ready to Pick” filter. This allows custom statuses to be treated as ready for picking. |
| Feature | #DEV-17688 | Prices | Price lists can now be activated and deactivated through the API. |
| Feature | #DEV-17684 | Notifications | Template Editor - Now with More Merge Tags: Order Status, Completion Date, Store Footer Text, and Customer Address Line 2. |
| Feature | #DEV-17361 | Tripletex connector | Now possible to send invoices for partial shipments. |
| Feature | #DEV-16996 | Excel import | Now running recalculation of inventory batches when importing inventory items from Excel. |
| Feature | #DEV-17838 | Inventory | Improved performance for inventory view when there are a large amount of stores (100+). |

## Release 2025-15

**Release date:** 23 Apr 2025

### Focus Areas

This release brings a wide range of functional enhancements across carts, products, and pick list handling. It also improves multilingual support, GUI extension points, and expands configuration options for connectors and notifications.

* * *

### Highlights and Improvements

#### Products

*   Scroll-based product search now supports the same sorting options as standard search, with added support for sorting by `ParentId`.
*   Added support for creating language-specific product copies across multiple languages.

#### Carts

*   New API endpoint `AddBundleToCart` for adding bundles in a single operation.
*   Quick edit mode introduced for both the "Cost" and "Order Details" tabs to streamline cart updates.
*   Order lines can now be excluded from the promotion engine, allowing for manual discounts when needed.

#### Orders & Workflow

*   A new workflow step supports delayed order processing, giving more control over fulfillment timing.

#### Pick Lists

*   Pick lists in the UI can now be sorted and filtered by status, date, user, and warehouse, improving operational visibility.

#### Purchase Orders

*   Purchase orders are now integrated with the notification system. Custom email templates and automated alerts can be configured for status changes.

#### Customers

*   Added support for the `IgnoreEnrichment` flag on customers to prevent enrichment from order data during processing.

#### GUI Extensions

*   `GuiExtensionArea` is now available for order line details, enabling dynamic URLs based on `{{order.id}}`.
*   Settings UI now includes improved copy and expanded language support: Finnish, French, Dutch, Polish, Spanish, and Italian.

#### API & Integration

*   New endpoint to reactivate on-hold or cancelled projects.
*   Open API specification received several validation fixes to improve client generation stability.

#### Connectors

*   **Voyado:**
    *   New method for excluding specific SKUs from receipts.
    *   StoreId mapping now supports external IDs for improved sync.
*   **Tripletex:**
    *   Account mapping for product postings can now be configured at both product and category level.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17437 | Products | Product scroll search now supports same sorting as standard product search. Also extended with sorting on ParentId. |
| Feature | #DEV-17473 | Products | Adding support for creating copy for multiple languages. |
| Feature | #DEV-16855 | Carts | New api endpoint "AddBundleToCart" for adding bundle to cart. |
| Feature | #DEV-17568 | Carts | New quick edit mode for the 'Cost' tab. |
| Feature | #DEV-16720 | Carts | Adding new quick edit mode for order lines which can be activated from the "Order Details" and "Cost" tabs. |
| Feature | #DEV-16215 | Carts | Order lines can now be excluded from the promotion engine to allow manual discounting by sales representatives. |
| Feature | #DEV-17288 | GUI | Added GuiExtensionArea to Order-Orderlinedetails. Use {{order.id}} in url to get details from order in url. |
| Feature | #DEV-17528 | GUI | Improved texts in the settings UI and added support for Finnish, French, Dutch, Polish, Spanish, and Italian. |
| Feature | #DEV-17027 | Projects | New API-endpoint for reactivating projects on hold and cancelled projects. |
| Feature | #DEV-17481 | Orders | New Workflow Step for Delayed Order Processing. |
| Feature | #DEV-17587 | Customers | Add the custom property IgnoreEnrichment = true to a customer to prevent enrichment from order data during order processing. |
| Feature | #DEV-17586 | Purchase orders | Purchase orders are now supported in the notification system. Custom email templates and automated notifications can be configured for status changes. |
| Feature | #DEV-17533 | Pick lists | Pick lists can now be sorted in the UI and filtered by status, date, user, and warehouse. |
| Feature | #DEV-17584 | Voyado connector | Adding new method for specifying skus in Omnium that should not be exported on Voyado receipts. |
| Feature | #DEV-17523 | Voyado connector | Adding support for configuring mapping between Omnium and Voyado StoreIds by setting externalIds. |
| Feature | #DEV-17595 | API spec | Multiple validation fixes for Open API client generation. |
| Feature | #DEV-16895 | Tripetex connector | Adding support for configuring which accounts to post products to in Tripletex both on products and product categories. |

## Release 2025-14

**Release date:** 08 Apr 2025

### Focus Areas

This release focuses on improving order accuracy, product selection in purchase workflows, and enhanced control in data synchronization with Voyado.

* * *

### Highlights and Improvements

#### Voyado Connector

*   Order lines can now be excluded from Voyado receipts by setting the `ExcludeFromVoyadoReceipts = true` property on products. This value is enriched automatically onto order lines and configurable via system settings.

#### Orders & Workflow

*   A new scheduled task has been added to automatically re-reserve inventory for open orders that failed initial reservation.

#### Purchase Orders

*   The product selection modal for purchase orders now includes filters for active/inactive products.
*   Products with assortment codes marked as not orderable are excluded from reorder suggestions. A scheduled task will also clean up existing irrelevant reorder suggestions.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-16927 | Voyado connector | Adding support for excluding order lines from receipts sent to Voyado. Order lines with property ExcludeFromVoyadoReceipts = true will be excluded. This property should be set on products and enriched onto order lines. The enrichment can be configured from Configuration → Orders → Order line under "Enrich order line from products". |
| Feature | #DEV-17014 | Orders | New scheduled task that processes open orders and attempemts to re-reserve them. |
| Feature | #DEV-17322 | Purchase orders | It is now possible to filter on active/inactive products in the purchase order add product modal. |
| Feature | #DEV-16502 | Purchase orders | Products that has assortment codes that cannot be ordered, are no longer included in the reorder suggestions. Old suggestions with products irrelevant for reordering will now be deleted by the scheduled task "Analytics reorder suggestions". |

## Release 2025-13

**Release date:** 01 Apr 2025

### Focus Areas

This release introduces enhancements to cart handling, supplier visibility, project workflows, and external integrations. It also adds new customization options for GUI extensions and improves compatibility with region-specific services.

* * *

### Highlights and Improvements

#### Carts

*   Users can now be assigned a default order type for new carts. This is overridden if the cart’s store has its own default.
*   Quick edit mode added for modifying cart order lines more efficiently.

#### Suppliers

*   Supplier IDs now support automated number generation.
*   Supplier access can now be restricted to specific stores or store groups.

#### Projects & Products

*   New project notification type available for reactivation events.
*   Product update logic improved: modifications to inventory status can now skip updating the product’s modified date, which helps control delta exports.

#### Integrations

*   **SendGrid**: Base URL is now configurable, allowing use of `api.eu.sendgrid.com` for EU-based accounts.
*   **Sitoo**: New mapping added from `inventoryItem.Location` to `BinLocation`.

#### GUI Extensions

*   Extended support for embedding external iFrames in the delivery workflow UI, including:
    *   `Delivery-MainView`
    *   `Delivery-ProcessGoodsModal`
    *   `Delivery-ProcessGoodsModal-After`
    *   Delivery context menu – "Manage"

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-16784 | Carts | Added support for setting default order type on users. When set this will be the default order type of created carts for this user. Default ordertype from cart store will override the default ordertype of a user. |
| Feature | #DEV-16998 | Carts | New quick edit mode for cart order lines. |
| Feature | #DEV-17199 | Suppliers | Added number generator for supplier-IDs. |
| Feature | #DEV-17224 | Suppliers | Suppliers are now only available to selected stores or store groups. |
| Feature | #DEV-16347 | Projects | Added new way of setting up project type notification for when projects are reactivated. |
| Feature | #DEV-16958 | Projects | New setting for avoiding updating modified date on products when only the inventory status is updated. This is typically used to prevent these updates from being included in product result sets when performing delta queries based on the modified date. |
| Feature | #DEV-17318 | Sendgrid | Now possible to specify base url. Default is api.sendgrid.com. Now you can override this with api.eu.sendgrid.com if api key is generated as a EU-based user. |
| Feature | #DEV-17240 | Sitoo integration | Added mapping of inventoryItem.Location to BinLocation in Sitoo. |
| Feature | #DEV-17321 | UI-extensions | Added more GuiExtensionAreas for iFrames from other webpages inside Omnnium. The new additions are Delivery-MainView, Delivery-ProcessGoodsModal, Delivery-ProcessGoodsModal-After and the contextmenu on delivery - manage. |

## Release 2025-12

**Release date:** 25 Mar 2025

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-16783 | Products | Possible to select multiple products from product list and export them to available product exporters. |
| Feature | #DEV-17076 | Products | Significant performance improvements in product search, faceting/aggregation, and indexing, especially at scale. |
| Feature | #DEV-17102 | Purchase Orders | A boolean flag on the Purchase Order API: If true, the PO gets a reference to a delivery that is created with the PO. All line items added to the PO gets the Deliery ID of the PO. |
| Feature | #DEV-17225 | Price Lists | Delete price list and list items through API. |
| Feature | #DEV-17164 | Price Lists | The date when the price list was activated is now stored in the field Published, on a PriceList. |
| Feature | #DEV-16852 | Price Lists | Get and Add priceListItems in API. |

## Release 2025-11

**Release date:** 18 Mar 2025

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-17023 | Orders | When viewing the event log for a single order, events from the order's originating cart are also displayed. This allows users to track the event history for both the order and the cart. |
| Feature | #DEV-17038 | Customers | Added delete events for B2B and B2C customer. |
| Feature | #DEV-17001 | Carts | It's now possible to select unit when adding product to cart from the products page if the product has units. |
| Feature | #DEV-16944 | Products | Added ratingCount property to ProductListItem in order to support returning rating count through product serach. |
| Feature | #DEV-16922 | Reports | Inventory transactions can now be exported as custom reports in the UI. |

## Release 2025-10

**Release date:** 11 Mar 2025

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-16896 | Settings | New setting in UI: 'Enable strict assortment code handling' (IsAssortmentCodesRequired). If strict assortment code handling is enabled, for product searches for customers that are performed and do not include assortment codes, only the products without assortment codes will be returned. This can also be overridden by a new property that has been added to product search requests: 'IsAssortmentCodesRequired'. |
| Feature | #DEV-16861 | Settings | New setting under order config, order lines: "Enrich order line from products". Possible to add custom properties that you want to be copied over from product to order line. |
| Feature | #DEV-16503 | Purchase Orders | Enabled visibility of supplier inventory within the purchase proposal list. This provides an overview of the number of items available at the supplier, which can be used as a basis when processing a purchase proposal. |

## Release 2025-09

**Release date:** 04 Mar 2025

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #86c2abxgn | Carts | Added tags filtering on cart product search. |
| Feature | #86c2a1c1m | Invites | We now display an "Expired" label on invites that are no longer valid. It is also now possible to "Renew" an invite to prevent expiration. |
| Feature | #86c29qexz | UI-extensions | We now display success response messages from webhook events triggered through UI-extensions. |
| Feature | #86c2aa5fr | Notifications | New merge tag on order line: "Delivered quantity". |

## Release 2025-08

**Release date:** 27 Feb 2025

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #86c262whc | UI | Adding auto-focus on search fields in Omnium UI to simplify searching in lists for customers, carts, orders, and products. |
| Feature | #86c25r9d2 | Products | Product custom view - Add custom properties in create product view. |
| Feature | #86c25kzh1 | Orders | `Order/returns/CreateReplacementOrder` endpoint is now extended to allow for switching the returned product with a new one. Add the `sku` to the `replacementItem`, and the item on the matching orderline will be replaced. |

## Release 2025-07

**Release date:** 20 Feb 2025

| Type | Issue no | Domain | Description |
| --- | --- | --- | --- |
| Feature | #15531 | Orders | Adding support for using selected orders modal (from order list) to trigger export of all selected orders through an available order exporter. |
| Feature | #15177 | Customers | Improved access control on market specific consents through the UI. |
| Feature | #15788 | Notifications | New SMS provider, Sveve. |

## Release 2025-06

**Release date:** 11 Feb 2025

| Type | Issue no | Domain | Description |
| --- | --- | --- | --- |
| Feature | #15656 | Carts | When changing store for a cart in Omnium UI, the user is now prompted with a choice to update the cart's order type if the selected store's order type differs from the current order type. |
| Feature | #15698 | Gift cards | Now possible to export gift cards to excel report. |
| Feature | #15768 | Prices | Price lists now have an option to create prices excluding tax. |
| Feature | #15382 | Customers | Business customers now have separate consent settings and consents are displayed as in private customers. Consents that were previously used for business customer must be added to the settings for it to be available with the consent type dropdown on business customers. |
| Feature | #15683 | Inventory | Improved web app for mobile devices with scanning features. Possible to scan items for inventory lookup and reorder planning. The feature is still work in progress. |
| Feature | #15733 | Custome reports | Adding support for creating custom reports for Deliveries. |
| Feature | #15734 | Orders | Order search can now be filtered by sales channel in both GUI and API. |

## Release 2025-05

**Release date:** 04 Feb 2025

| Type | Issue no | Domain | Description |
| --- | --- | --- | --- |
| Feature | #15626 | Gift cards | Gift card overview now has toggle to select expired/active/all gift cards. |
| Feature | #15539 | Custom views | Added additional options to "create product" custom view. Now possible to set default values. |
| Feature | #15616 | Payments | API - adding overwriteExisting parameter to AddPaymentToCart. This way we support adding new payments without overwriting existing. |
| Feature | #15632 | Orders | Added DeliveredDate to OmniumOrderline Model, working both from patch, get, and other endpoints using our generic mapper. |

## Release 2025-04

**Release date:** 29 Jan 2025

| Type | Issue no | Domain | Description |
| --- | --- | --- | --- |
| Feature | #14883 | Templates | Adding PDF options in configuration to edit padding and format size. |
| Feature | #15166 | UI Extensions | UI extensions with iframes can have querystrings with information from current user and selected language. |

## Release 2025-03

**Release date:** 22 Jan 2025

| Type | Issue no | Domain | Description |
| --- | --- | --- | --- |
| Feature | #15466 | Purchase Orders | Purchase orders and deliveries can be filtered by estimated time of arrival. |
| Feature | #15408 | Purchase Orders | Customer orders with references to purchase orders now keep their reference to the purchase order lines after goods reception. New property "IsAwaitingPurchaseOrder" will be true while awaiting purchase order, and set to null during goods reception. |
| Feature | #15212 | Virtual Stock Locations | Adding new component RuleSimulator to inventory rule UI. This allows for simulating inventory rules to make it easier to understand their execution. |

## Release 2025-02

**Release date:** 14 Jan 2025

| Type | Issue no | Domain | Description |
| --- | --- | --- | --- |
| Feature | #14948 | Promotions | New calender view for promotions. |
| Feature | #15337 | Orders | Order view enhancement. In the order information box, we display the total number of both internal and public comments/notes. Clicking on it will navigate to the comments view. |
| Feature | #11934 | Vouchers | Adding support for vouchers as payment method in Omnium. |
| Feature | #11931 | Integrations | Support sync of Voyado bonus checks to Omnium and application of these to carts as vouchers. |

## Release 2025-01

**Release date:** 07 Jan 2025

| **Type** | **Issue no** | **Domain** | **Description** |
| --- | --- | --- | --- |
| Feature | #15317 | Carts | Possible to export a cart to a new cart, creating a duplicate, from the cart menu in UI. |
| Feature | #14974 | Notifications | New botification replacement `{SELLER_ID}`. Can be used as replacement text in to, cc, or bcc. When seller is set from Omnium, `{SELLER_ID}` will be the user/seller email. |
