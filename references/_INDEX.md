# Omnium documentation index

Generated from https://docs.omnium.no by `scripts/sync-docs.ts` — do not edit by hand.
Every page of the site is listed below by topic, with its description. Paths are relative to this file.
Search this file for a keyword or jump to a topic, then read only the pages you need.

## Topics

- [Carts](#carts) (21 pages)
- [Configuration](#configuration) (92 pages)
- [Connectors & Plugins](#connectors--plugins) (76 pages)
- [Customers](#customers) (14 pages)
- [Getting Started, API Conventions & Security](#getting-started-api-conventions--security) (21 pages)
- [Integrations](#integrations) (12 pages)
- [Inventory](#inventory) (14 pages)
- [Orders](#orders) (223 pages)
- [Prices](#prices) (25 pages)
- [Products](#products) (60 pages)
- [Projects](#projects) (13 pages)
- [Purchase Orders](#purchase-orders) (22 pages)
- [Release notes](#release-notes) (8 pages)
- [Stores & Markets](#stores--markets) (6 pages)
- [Tutorials](#tutorials) (4 pages)
- [Notifications — Email & SMS](#notifications--email--sms) (12 pages)

## Carts

Carts and offers in Omnium — managing shopping carts, offers, and pre-order entities.

### Carts

- [Carts](Carts.md) — Carts and offers in Omnium — managing shopping carts, offers, and pre-order entities.
- [API Reference](Carts/cart-api.md) — Complete guide to building shopping cart experiences with the Omnium Cart API. Learn how to create carts, manage line items, apply discounts, and complete checkout in headless e-commerce scenarios.
- [Configuration](Carts/cart-config.md) — Learn how to configure cart settings and validators in Omnium.
- [Validation](Carts/validation.md) — How cart validation works in Omnium — ensuring carts are valid before they become orders.

### Carts/validation

- [Cart Validators](Carts/validation/cart-validators.md) — Reference for all built-in cart validators in Omnium.

### Carts/validation/cart-validators

- [Active Products Validator](Carts/validation/cart-validators/active-products-validator.md) — Validates that all products in the cart are active and available for purchase.
- [Credit Limit Validator](Carts/validation/cart-validators/credit-limit-validator.md) — Validates that the customer has sufficient credit to cover credit-based payments in the cart.
- [Discount Validator](Carts/validation/cart-validators/discount-validator.md) — Validates that discounts on the cart are correctly configured.
- [Inactive Customer Validator](Carts/validation/cart-validators/inactive-customer-validator.md) — Prevents checkout for inactive customers.
- [Inventory ATP Validator](Carts/validation/cart-validators/inventory-atp-validator.md) — Validates inventory availability using Available-to-Promise (ATP) data, including future delivery dates.
- [Inventory Validator](Carts/validation/cart-validators/inventory-validator.md) — Validates that all products in the cart have sufficient stock across the relevant warehouses.
- [Margins Validator](Carts/validation/cart-validators/margins-validator.md) — Validates that no line items in the cart are sold below cost price.
- [Null Price Validator](Carts/validation/cart-validators/null-price-validator.md) — Ensures all line items in the cart have a non-zero price.
- [Payments Validator](Carts/validation/cart-validators/payments-validator.md) — Validates that payment amounts on the cart match the order total.
- [Pricat ID Validator](Carts/validation/cart-validators/pricat-id-validator.md) — Validates Pricat ID consistency for pre-order carts.
- [Promotion Coupon Validator](Carts/validation/cart-validators/promotion-coupon-validator.md) — Validates promotion coupon codes and removes invalid ones from the cart.
- [Recalculate Cart Prices Validator](Carts/validation/cart-validators/recalculate-cart-prices-validator.md) — Recalculates line item prices using current product pricing and promotions.
- [Required Fields Validator](Carts/validation/cart-validators/required-fields-validator.md) — Validates that required fields are populated on the cart.
- [Sales Limitation Validator](Carts/validation/cart-validators/sales-limitation-validator.md) — Enforces product sales restrictions based on customer and market rules.
- [Shipment Validator](Carts/validation/cart-validators/shipment-validator.md) — Ensures that at least one shipment is selected on the cart.
- [Webhook Validator](Carts/validation/cart-validators/webhook-validator.md) — Calls an external HTTP endpoint to validate and optionally modify the cart during cart validation.

## Configuration

Platform settings, scheduled tasks, GUI extensions, reports, and other configuration options in Omnium.

### configuration

- [Configuration](configuration.md) — Platform settings, scheduled tasks, GUI extensions, reports, and other configuration options in Omnium.
- [Custom Reports](configuration/custom-reports.md) — Configure custom data export reports with flexible column mapping, data types, and role-based access control.
- [Email Client Settings](configuration/email-client-settings.md) — Configure how Omnium sends email, through SendGrid, an SMTP server or Microsoft 365 with the Microsoft Graph API.
- [Embedded Applications](configuration/embedded-applications.md) — Embed your own web application in the Omnium UI as a page or panel, receive user and object context through postMessage, and authenticate the user in your own application.
- [Formatting Settings](configuration/formatting-settings.md) — Configure the default time zone, time zones per store, market and market group, culture and phone number prefix.
- [Generic Concepts](configuration/generic.md) — This page provides an overview of generic concepts in Omnium, such as External IDs,properties and more.
- [GUI Extensions](configuration/gui-extensions.md) — Extend the Omnium UI with custom iframes, webhook actions, and context-aware panels — without modifying the core platform.
- [Number Options](configuration/numberoptions.md) — Configuration of number options for assigning IDs to entities.
- [Property Options](configuration/property-options.md) — Centrally managed dropdown value lists that can be reused across custom property dropdowns on products, projects, customers, stores, orders, and carts.
- [Rounding Settings](configuration/rounding-settings.md) — Configure price rounding policies with range-based rules and multiple rounding methods.
- [Scheduled Tasks](configuration/scheduled-tasks.md) — Configure and manage background jobs in Omnium
- [Settings API](configuration/settings-api.md) — Read your tenant's order types, order statuses, workflow steps, order settings and customer settings through the read-only Omnium Settings API.
- [SMS Client Settings](configuration/sms-client-settings.md) — Guide for configuring SMS providers in Omnium with per-market, market group, and store resolution.

### configuration/scheduled-tasks

- [Accounting Scheduled Tasks](configuration/scheduled-tasks/accounting.md) — Background jobs that generate daily web-fulfillment accounting postings and clean up unfinished draft postings
- [Analytics Scheduled Tasks](configuration/scheduled-tasks/analytics.md) — Background jobs for statistics generation, data aggregation, and reporting
- [Cart Scheduled Tasks](configuration/scheduled-tasks/carts.md) — Background jobs for cart lifecycle management, cleanup, and order conversion
- [Customer Club Scheduled Tasks](configuration/scheduled-tasks/customer-club.md) — Background jobs for loyalty program management, points, birthdays, and member notifications
- [Event Scheduled Tasks](configuration/scheduled-tasks/events.md) — Background jobs for event log management and cleanup
- [Inventory Scheduled Tasks](configuration/scheduled-tasks/inventory.md) — Background jobs for stock levels, allocation tracking, valuation, and reorder suggestions
- [Notification Scheduled Tasks](configuration/scheduled-tasks/notifications.md) — Background jobs for processing and sending pending notifications
- [Order Scheduled Tasks](configuration/scheduled-tasks/orders.md) — Background jobs for order lifecycle management, allocation, automation, and cleanup
- [Price Scheduled Tasks](configuration/scheduled-tasks/prices.md) — Background jobs for cleaning up expired price data
- [Products Scheduled Tasks](configuration/scheduled-tasks/products.md) — Background jobs for product data maintenance, pricing, assortment, and inventory status
- [Project Scheduled Tasks](configuration/scheduled-tasks/projects.md) — Background jobs for project lifecycle management, anonymization, and reactivation
- [Rating Scheduled Tasks](configuration/scheduled-tasks/ratings.md) — Background jobs for product rating notifications and verification
- [Store Scheduled Tasks](configuration/scheduled-tasks/stores.md) — Background jobs for store data maintenance and cleanup
- [Subscription Scheduled Tasks](configuration/scheduled-tasks/subscriptions.md) — Background jobs for subscription order processing and management
- [Voucher Scheduled Tasks](configuration/scheduled-tasks/vouchers.md) — Background jobs for voucher lifecycle management, expiration, and reactivation

### configuration/scheduled-tasks/accounting

- [Orphaned Posting Cleanup](configuration/scheduled-tasks/accounting/orphaned-posting-cleanup.md) — Remove accounting postings left in Draft status by an interrupted save
- [Web Fulfillment Posting](configuration/scheduled-tasks/accounting/web-fulfillment-posting.md) — Generate the daily web-fulfillment accounting postings for every store from the configured cutoff hour

### configuration/scheduled-tasks/analytics

- [Add Stats Customers](configuration/scheduled-tasks/analytics/add-stats-customers.md) — Queue changed customers for asynchronous statistics processing
- [Add Stats Orders](configuration/scheduled-tasks/analytics/add-stats-orders.md) — Queue changed orders for asynchronous statistics processing
- [Analytics Interaction](configuration/scheduled-tasks/analytics/analytics-interaction.md) — Index customer interaction analytics from orders
- [Analytics Inventory](configuration/scheduled-tasks/analytics/analytics-inventory.md) — Index inventory analytics data for reporting and dashboards
- [Analytics Order Line](configuration/scheduled-tasks/analytics/analytics-order-line.md) — Index order line analytics for sales reporting and analysis
- [Analytics Reorder Suggestions](configuration/scheduled-tasks/analytics/analytics-reorder-suggestions.md) — Generate product reorder suggestions based on sales patterns
- [Analytics Reorder Suggestions Delta](configuration/scheduled-tasks/analytics/analytics-reorder-suggestions-delta.md) — Update reorder suggestions based on recent inventory changes
- [Reindex All Stats Customers](configuration/scheduled-tasks/analytics/reindex-all-stats-customers.md) — Rebuild the entire customer statistics index from scratch

### configuration/scheduled-tasks/carts

- [Convert Authorized Carts to Orders](configuration/scheduled-tasks/carts/convert-authorized-cart-to-order.md) — Automatically create orders from carts with authorized payments
- [Delete Abandoned Carts](configuration/scheduled-tasks/carts/delete-abandoned-carts.md) — Automatically remove carts that have been inactive for extended periods

### configuration/scheduled-tasks/customer-club

- [Approve Membership Reminder](configuration/scheduled-tasks/customer-club/approve-membership-reminder.md) — Send reminder emails to members who haven't approved their membership consents
- [Birthday Points](configuration/scheduled-tasks/customer-club/birthday-points.md) — Award birthday bonus points to customer club members and send notifications
- [Delete Expired Points](configuration/scheduled-tasks/customer-club/delete-expired-points.md) — Remove expired loyalty points from member accounts and create transaction records
- [Delete Inactive Members](configuration/scheduled-tasks/customer-club/delete-inactive-members.md) — Remove or deactivate customer club members who haven't approved their consents
- [Expire Soon Notification](configuration/scheduled-tasks/customer-club/expire-soon-notification.md) — Notify customer club members about points that will expire soon
- [Monthly Report](configuration/scheduled-tasks/customer-club/monthly-report.md) — Generate and email monthly customer club membership statistics report
- [Newsletter](configuration/scheduled-tasks/customer-club/newsletter.md) — Process and send scheduled newsletters to customer segments
- [Point Balance Notification](configuration/scheduled-tasks/customer-club/point-balance-notification.md) — Notify customer club members when their point balance reaches a threshold
- [Set Interests Special](configuration/scheduled-tasks/customer-club/set-interests-special.md) — Automatically assign special interests to new customer club members based on their registration store

### configuration/scheduled-tasks/events

- [Delete Event Logs](configuration/scheduled-tasks/events/delete-event-log.md) — Remove event log entries older than the configured retention period

### configuration/scheduled-tasks/inventory

- [Add Cost and Currency to Inventory](configuration/scheduled-tasks/inventory/add-cost-currency-to-inventory.md) — Propagate cost and currency from products to inventory items
- [Inventory Value](configuration/scheduled-tasks/inventory/inventory-value.md) — Create daily snapshots of inventory valuation by warehouse and currency
- [Overallocated Inventory](configuration/scheduled-tasks/inventory/overallocated-inventory.md) — Detect and correct overallocated virtual stock to prevent overselling
- [Product Cost in Default Currency](configuration/scheduled-tasks/inventory/product-cost-default-currency.md) — Calculate and update product cost in the default currency
- [Product Unallocated Inventory](configuration/scheduled-tasks/inventory/product-unallocated-inventory.md) — Sync unallocated inventory data to product records
- [Resolve Over-Reserved Inventory](configuration/scheduled-tasks/inventory/resolve-over-reserved-inventory.md) — Automatically detect and remove inventory reservations that exceed available stock using FIFO order priority
- [Supplier Reorder Suggestions](configuration/scheduled-tasks/inventory/supplier-reorder-suggestions.md) — Update supplier records with reorder recommendations
- [Unallocated Inventory](configuration/scheduled-tasks/inventory/unallocated-inventory.md) — Recalculate unallocated inventory for all products with virtual stock locations

### configuration/scheduled-tasks/notifications

- [Process Notifications](configuration/scheduled-tasks/notifications/notification.md) — Retrieve and send pending notification messages

### configuration/scheduled-tasks/orders

- [Allocate Order to Purchase Order](configuration/scheduled-tasks/orders/allocate-order-to-purchase-order.md) — Automatically allocate unreserved order lines to incoming purchase orders
- [Cancel Expired Click and Collect](configuration/scheduled-tasks/orders/cancel-expired-click-collect.md) — Automatically cancel click and collect orders that exceed their time limits
- [Cancel Expired Orders](configuration/scheduled-tasks/orders/cancel-expired-orders.md) — Legacy task that cancels expired click and collect orders by flipping their status
- [Cancel Orders with Expired Pickup Deadline](configuration/scheduled-tasks/orders/cancel-orders-with-expired-pickup-deadline.md) — Automatically cancel orders where the customer pickup deadline has passed.
- [Create Draft Purchase Orders](configuration/scheduled-tasks/orders/create-draft-purchase-orders.md) — Automatically create and refresh one draft purchase order per supplier from the current reorder suggestions
- [Delete Old Orders](configuration/scheduled-tasks/orders/delete-old-orders.md) — Permanently remove orders older than the configured retention period
- [Order Automation](configuration/scheduled-tasks/orders/order-automation.md) — Automatically transition order status based on configurable conditions
- [Payment Settlements](configuration/scheduled-tasks/orders/payment-settlements.md) — Retrieve and record payment settlement data from payment providers
- [Try Reallocate Orders](configuration/scheduled-tasks/orders/try-reallocate-orders.md) — Process orders that have passed their reallocation deadline
- [Try Reserve Order Lines](configuration/scheduled-tasks/orders/try-reserve-order-lines.md) — Reserve inventory for unreserved order lines using FIFO logic
- [Update Order Status](configuration/scheduled-tasks/orders/update-order-status.md) — Process scheduled status transitions for orders
- [Update Overdue Orders](configuration/scheduled-tasks/orders/update-overdue-orders.md) — Mark orders as delayed when they pass their expected delivery date
- [Update Reservable Orders](configuration/scheduled-tasks/orders/update-reservable-orders.md) — Update the reservable status flag on orders for distribution processing

### configuration/scheduled-tasks/prices

- [Delete Expired Cost Prices](configuration/scheduled-tasks/prices/delete-expired-cost-prices.md) — Remove product cost prices that have passed their expiration date
- [Delete Expired Prices](configuration/scheduled-tasks/prices/delete-expired-prices.md) — Remove product prices that have passed their expiration date

### configuration/scheduled-tasks/products

- [Popularity Sort Index](configuration/scheduled-tasks/products/popularity-sort-index.md) — Calculate product popularity scores based on sales data for improved search and sorting
- [Product Expected Delivery Date](configuration/scheduled-tasks/products/product-expected-delivery-date.md) — Update expected delivery dates for products using ATP (Available to Promise) data
- [Product Inventory Full Status](configuration/scheduled-tasks/products/product-inventory-full-status.md) — Perform a complete refresh of inventory data on all products
- [Product Inventory Status](configuration/scheduled-tasks/products/product-inventory-status.md) — Update product inventory levels based on recent inventory changes
- [Product Lowest Price](configuration/scheduled-tasks/products/product-lowest-price.md) — Calculate and update the lowest available price for each product across all variants
- [Remove Unmodified Prices](configuration/scheduled-tasks/products/remove-unmodified-prices.md) — Clean up customer-specific prices that have not been updated recently
- [Send Product Alerts](configuration/scheduled-tasks/products/send-product-alerts.md) — Notify customers when products they are interested in are back in stock
- [Update Assortment By Price](configuration/scheduled-tasks/products/update-assortment-by-price.md) — Update product assortment based on price availability for markets and price lists
- [Update Assortment By Store](configuration/scheduled-tasks/products/update-assortment-by-store.md) — Update product assortment based on store assignment configuration
- [Update Product Categories](configuration/scheduled-tasks/products/update-product-categories.md) — Synchronize product category assignments across all products
- [Variant Location From Product](configuration/scheduled-tasks/products/variant-location-from-product.md) — Copy location data from products to their variants for warehouse placement

### configuration/scheduled-tasks/projects

- [Anonymize Obsolete Projects](configuration/scheduled-tasks/projects/anonymize-obsolete-projects.md) — Remove personal data from projects that are no longer active
- [Reactivate Projects on Hold](configuration/scheduled-tasks/projects/reactivate-projects-on-hold.md) — Automatically restore projects to active status when their hold period expires

### configuration/scheduled-tasks/ratings

- [Verify Rating Notification](configuration/scheduled-tasks/ratings/verify-rating-notification.md) — Send notifications for product ratings that require staff verification

### configuration/scheduled-tasks/stores

- [Delete Historical Opening Hours](configuration/scheduled-tasks/stores/delete-historical-opening-hours.md) — Remove additional opening hours entries that are past their date

### configuration/scheduled-tasks/subscriptions

- [Process Subscription Orders](configuration/scheduled-tasks/subscriptions/subscription-order.md) — Create pending orders for active subscriptions based on their schedules

### configuration/scheduled-tasks/vouchers

- [Voucher Expiration](configuration/scheduled-tasks/vouchers/voucher-expiration.md) — Automatically mark available vouchers as expired when past their expiry date
- [Voucher Reactivation](configuration/scheduled-tasks/vouchers/voucher-reactivation.md) — Automatically reactivate applied vouchers that are no longer on active carts or orders

## Connectors & Plugins

Pre-built integrations maintained by the Omnium team — payment providers, shipping carriers, ERP systems, POS, CRM, and more.

### plugins

- [Connectors & Plugins](plugins.md) — Pre-built integrations maintained by the Omnium team — payment providers, shipping carriers, ERP systems, POS, CRM, and more.
- [Payments](plugins/Payments.md) — Overview of how payments work in Omnium and the supported payment providers
- [Shipment](plugins/Shipments.md) — Learn all you need to know about configuring shipment providers in Omnium.

### plugins/CRM

- [Voyado](plugins/CRM/voyado.md) — Omnium provides a standardized integration with Voyado Engage. This integration provides the opportunity to outsource customer club and CRM functionality to Voyado.
- [Voyado Elevate (BETA)](plugins/CRM/voyadoElevate.md) — Omnium provides a standardized integration with Voyado Elevate.

### plugins/ECOM

- [Magento 2](plugins/ECOM/Magento.md) — Comprehensive technical documentation for the Omnium Magento 2 integration. Learn how to configure order synchronization, product import/export, inventory management, and customer sync.
- [Shopify](plugins/ECOM/Shopify.md) — Omnium integrates with Shopify to sync products, orders and inventory.

### plugins/ERP

- [Fortnox](plugins/ERP/Fortnox.md) — Learn about our Fortenox integration
- [PowerOffice](plugins/ERP/PowerOffice.md)
- [TripleTex](plugins/ERP/TripleTex.md)

### plugins/GiftCards

- [AwardIt](plugins/GiftCards/AwardIt.md) — This page describes the technical configuration required to enable AwardIt in Omnium, as well as API usage for buying and paying with gift cards.
- [Dintero](plugins/GiftCards/Dintero.md) — Technical configuration for issuing Dintero gift cards from Omnium orders, delivering the code and PIN by email, and redeeming the card in Dintero Checkout.

### plugins/Other

- [Google Feeds Integration](plugins/Other/GoogleFeeds.md) — Guide for setting up Google product feeds integration.
- [InRetrn](plugins/Other/InRetrn.md) — Guide for setting up the InRetrn returns integration in Omnium.
- [LINK Mobility](plugins/Other/LinkMobility.md) — Send SMS through LINK Mobility and let customers reply by SMS, with each order, return or case conversation on its own number from a subnumber range.
- [PinMeTo](plugins/Other/PinMeTo.md) — Guide for setting up PinMeTo integration in Omnium.
- [Sendgrid](plugins/Other/Sendgrid.md) — Guide for setting up the Omnium Sendgrid plugin.

### plugins/Payments

- [Adyen](plugins/Payments/adyen.md) — Configure Adyen payment provider with Omnium for online and in-store payments.
- [Aera](plugins/Payments/aera.md) — Configure Aera payment provider with Omnium for card and invoice payments.
- [Aera Invoice](plugins/Payments/aeraInvoice.md) — Configure Aera Invoice payment provider with Omnium for invoice-based B2B and B2C payments.
- [Atome](plugins/Payments/atome.md) — Configure Atome payment provider with Omnium for buy-now-pay-later payments in Asia-Pacific.
- [Authorize.Net](plugins/Payments/authorizeNet.md) — Configure Authorize.Net payment provider with Omnium for card payments.
- [Avarda](plugins/Payments/avarda.md) — Configure Avarda payment provider with Omnium for flexible payment options.
- [Bonus Points](plugins/Payments/bonusPoints.md) — Configure Bonus Points loyalty payment with Omnium for customer club point redemption.
- [Dintero](plugins/Payments/dintero.md) — Learn all you need to know about our Dintero plugin
- [Generic Payment](plugins/Payments/genericPayment.md) — Configure Generic Payment provider for custom webhook-based payment integrations.
- [Kustom Checkout](plugins/Payments/klarnav3.md) — Configure Kustom Checkout (formerly Klarna Checkout v3) with Omnium to process payments.
- [Netaxept](plugins/Payments/netaxept.md) — Configure Netaxept (Nets) payment provider with Omnium for card payments in the Nordics.
- [Nets Easy](plugins/Payments/netsEasy.md) — Configure Nets Easy (Nexi) payment provider with Omnium for online payments.
- [NGenius](plugins/Payments/ngenius.md) — Configure NGenius (Network International) payment provider with Omnium.
- [PayEx](plugins/Payments/payex.md) — Configure PayEx (Swedbank Pay) with Omnium to process card payments.
- [PayPal](plugins/Payments/paypal.md) — Configure PayPal payment provider with Omnium for online payments.
- [Qliro](plugins/Payments/qliro.md) — Comprehensive guide for integrating and configuring the Qliro payment plugin with Omnium, covering setup instructions, required fields, and advanced options.
- [Resursbank](plugins/Payments/resursbank.md) — Configure Resursbank payment provider with Omnium for consumer financing and payment solutions.
- [Shopify Payments](plugins/Payments/shopifyPayment.md) — Configure Shopify payment provider with Omnium for Shopify store payment processing.
- [Stripe](plugins/Payments/stripe.md) — Configure Stripe payment provider with Omnium for online payments.
- [Svea Checkout](plugins/Payments/sveaCheckout.md) — Configure Svea Checkout payment provider with Omnium for flexible payment options.
- [Svea InStore](plugins/Payments/sveaInstore.md) — Configure Svea InStore payment provider with Omnium for POS and in-store payments.
- [Toss](plugins/Payments/toss.md) — Configure Toss payment provider with Omnium for Korean payment processing.
- [Vipps (Legacy)](plugins/Payments/vipps.md) — Configure the legacy Vipps payment provider with Omnium for Norwegian mobile payments.
- [Vipps ePayment](plugins/Payments/vippsEPayment.md) — Configure Vipps ePayment provider with Omnium for Norwegian mobile payments.
- [Walley](plugins/Payments/Walley.md) — Configure Walley (formerly Collector) payment provider with Omnium for flexible payment options.
- [Webhook payment](plugins/Payments/webhookPayment.md) — Create a custom payment provider
- [Zaver](plugins/Payments/zaver.md) — Configure Zaver payment provider with Omnium for flexible payment options including installments and pay-later.

### plugins/POS

- [Flow Retail](plugins/POS/Flow.md) — Omnium integrates with Flow Retail to export products, prices, inventory, customers, and purchase orders.
- [Front Systems](plugins/POS/FrontSystems.md) — Omnium integrates with Front Systems to sync products, orders, customers, inventory and live cart calculations from 'carts' in POS
- [Sitoo](plugins/POS/Sitoo.md) — Omnium integrates with Sitoo to sync products, orders, customers, and inventory.

### plugins/POS/Flow

- [Customers](plugins/POS/Flow/Customers.md) — Customer data export from Omnium to Flow Retail for both private and business customers.
- [Inventory](plugins/POS/Flow/Inventory.md) — Inventory export from Omnium to Flow Retail stores.
- [Orders](plugins/POS/Flow/Orders.md) — Order flow and omnichannel capabilities.
- [Prices](plugins/POS/Flow/Prices.md) — Price synchronization from Omnium to Flow Retail including selling prices, cost prices, and SOA amounts.
- [Products](plugins/POS/Flow/Products.md) — Product synchronization from Omnium to Flow Retail including variants, product groups, brands, and images.
- [Purchase Orders](plugins/POS/Flow/PurchaseOrders.md) — Purchase order and delivery synchronization from Omnium to Flow Retail, including reservation handling.
- [Stores](plugins/POS/Flow/Stores.md) — Store, warehouse, and organization synchronization from Omnium to Flow Retail.

### plugins/POS/Sitoo

- [Customers](plugins/POS/Sitoo/Customers.md) — Customer data synchronization and CRM integration options.
- [Gift cards](plugins/POS/Sitoo/GiftCard.md) — Omnium acts as the master system for gift cards, and Sitoo accesses the gift card data via dedicated API endpoints provided by Omnium.
- [Supported Payment Providers](plugins/POS/Sitoo/hidden.md) — Omnium support for payments created in Sitoo
- [Inventory](plugins/POS/Sitoo/Inventory.md) — Inventory management and synchronization between Omnium and Sitoo.
- [Market/Eshop/Store](plugins/POS/Sitoo/MarketEshopStore.md) — Market, e-shop, and store configuration in Sitoo integration.
- [Orders](plugins/POS/Sitoo/Orders.md) — Order flows between Omnium and Sitoo — POS sales, click and collect, online delivery.
- [Prices](plugins/POS/Sitoo/Prices.md) — Price synchronization between Omnium and Sitoo including promotion prices, price lists, and tax.
- [Products](plugins/POS/Sitoo/Products.md) — Product synchronization between Omnium and Sitoo including categories, variants, and attributes.
- [Promotions](plugins/POS/Sitoo/Promotions.md) — Configure promotions once for use in both Sitoo and Omnium, reducing the need to manage settings in two places.
- [Shipment Method Mapping](plugins/POS/Sitoo/ShipmentMethodMapping.md) — How Omnium determines the shipment method for orders imported from Sitoo POS.
- [ShipmentsV3](plugins/POS/Sitoo/Shipments.md) — Purchase order deliveries integration using Sitoo's shipments-v3 API.
- [VAT / Product Groups](plugins/POS/Sitoo/VatGroups.md) — How to map Omnium products to Sitoo Product Groups for correct VAT rates

### plugins/Shipments

- [Bring](plugins/Shipments/bring.md) — Integration with Bring for shipment booking in Omnium.
- [GLS](plugins/Shipments/gls.md) — Integration with GLS for shipment booking in Omnium.
- [Ingrid Integration](plugins/Shipments/ingrid-plugin.md)
- [Logistra](plugins/Shipments/logistra.md) — Integration with Logistra (Cargonizer) for shipment booking in Omnium.
- [nShift Checkout v2](plugins/Shipments/nshiftCheckout.md) — Integration with nShift Checkout v2 for delivery options and partial shipment tracking in Omnium.
- [nShift Delivery](plugins/Shipments/nshiftDelivery.md) — Integration with nShift Delivery (Unifaun) for shipment booking in Omnium.
- [nShift Ship](plugins/Shipments/nshiftShip.md) — Integration with nShift Ship (Consignor) for shipment booking in Omnium.
- [Porterbuddy](plugins/Shipments/porterbuddy.md) — Integration with Porterbuddy for same-day and scheduled delivery in Omnium.
- [PostNord](plugins/Shipments/postnord.md) — Integration with PostNord for shipment booking in Omnium.

### plugins/WMS

- [Ongoing WMS](plugins/WMS/Ongoing.md) — Comprehensive technical documentation for the Omnium Ongoing Warehouse Management System integration. Learn how to configure, sync orders, inventory, products, and deliveries with Ongoing WMS.

## Customers

Manage private (B2C) and business (B2B) customers in Omnium — profiles, loyalty clubs, and communication.

### Customer

- [Customers](Customer.md) — Manage private (B2C) and business (B2B) customers in Omnium — profiles, loyalty clubs, and communication.
- [Cases](Customer/Cases.md) — Built-in CRM and support case system for managing customer inquiries, issues, and communication.
- [API Reference](Customer/customer-api.md) — This guide explains how to manage customer data in Omnium. It covers both private and business customers. The API allows you to handle customer interactions efficiently.
- [Customer Club](Customer/customer-club.md) — This guide explains the customer club functionality in Omnium. It covers both private and business customers, as well as how to use features like the Customer Club, track points, and update customer profiles. The API allows you to handle customer interactions efficiently.
- [Configuration](Customer/customer-config.md) — Learn how to configure customer settings in Omnium, including identification, creation controls, address handling, consent management, and B2B features. This guide covers all customer-related configuration options for administrators and developers.
- [Customer Management](Customer/customer-management.md) — How to work with B2C and B2B customers in Omnium — data model, API patterns, search, privacy, and integration.
- [Newsletter](Customer/newsletter.md) — Unsubscription process and setup for newsletters

### Customer/Cases

- [API Reference](Customer/Cases/cases-api.md) — Public API endpoints for managing cases — create, search, update, assign, change status, and delete.
- [Configuration](Customer/Cases/cases-config.md) — Enable and configure the Cases module — statuses, priorities, tags, case numbering, and support email settings.
- [Dashboard & Analytics](Customer/Cases/cases-dashboard.md) — Cases dashboard with key stats, charts by status, priority, assignee, source, and tag, plus filtering options.
- [Inbound Email](Customer/Cases/cases-inbound-email.md) — Automatically create cases from incoming customer emails using SendGrid Inbound Parse — setup, email flow, reply tracking, and troubleshooting.
- [Managing Cases](Customer/Cases/cases-management.md) — Working with cases in the Omnium UI — list view, creating, editing, assigning, status changes, bulk operations, and linking to other entities.
- [Notes & Communication](Customer/Cases/cases-notes-and-communication.md) — Public and internal case notes, email and SMS notifications, file attachments, and reply templates.
- [Overview & Concepts](Customer/Cases/cases-overview.md) — What cases are, key concepts, data model, status lifecycle, and how cases relate to other Omnium entities.

## Getting Started, API Conventions & Security

Authentication, API conventions, search, pagination, scroll, error handling, security, environments

### access

- [Access Rights](access.md) — Easily export and import data in JSON or Excel format for smooth integration with business systems and streamlined data management.

### docs

- [Hello, developer.engineer.integrator.architect.builder.explorer.e-com expert.agent.developer.developer.](docs.md) — Welcome to the Omnium technical documentation.

### Environments

- [Environments](Environments.md) — Understand Omnium's three environments — Dev, Test, and Production — along with rate limits and concurrency controls.
- [Operations](Environments/operations.md) — How to monitor, maintain, and optimize your Omnium instance — event logs, scheduled tasks, data maintenance, environment management, and performance best practices.
- [Rate Limits](Environments/rate-limits.md)
- [Test & Dev](Environments/test-dev.md)

### GettingStartedWithAPI

- [Getting Started](GettingStartedWithAPI.md) — Everything you need to start integrating with Omnium — access setup, authentication, API patterns, and hands-on tutorials.
- [API Developer Guide](GettingStartedWithAPI/api-developer-guide.md) — Complete guide to integrating with the Omnium API — authentication, searching, updating, error handling, and best practices.
- [Preparing for integration](GettingStartedWithAPI/getStarted.md) — Essential steps and considerations before integrating with the Omnium API.
- [Get Access](GettingStartedWithAPI/introtoapi.md) — Request access and set up your account for Omnium API integration.
- [Tutorials](GettingStartedWithAPI/Tutorials.md) — Step-by-step guides that walk you through complete integration scenarios with Omnium — from first API call to production-ready workflows.
- [Quick Guides](GettingStartedWithAPI/user-guides.md) — Find the documentation and API endpoints most relevant to your integration needs.

### GettingStartedWithAPI/Tutorials

- [ERP Integration](GettingStartedWithAPI/Tutorials/erp-integration.md) — This guide walks through a complete ERP integration with Omnium — subscribing to order events, fetching orders, confirming receipt, syncing inventory, reporting shipments, and processing returns.
- [Omnichannel e-com](GettingStartedWithAPI/Tutorials/omnichannel-ecom.md) — This guide shows how to set up a basic e-commerce store in Omnium, including markets, products, inventory, and a simple checkout flow.
- [POS Integration](GettingStartedWithAPI/Tutorials/pos-integration.md) — This guide walks through a complete POS integration with Omnium — pushing in-store sales and returns, transferring online orders to the store, synchronizing store inventory, and subscribing to changes with webhooks.

### Security

- [Security Overview](Security.md) — How Omnium protects your data — authentication, authorization, tenant isolation, and security best practices.
- [API Security Best Practices](Security/api-security.md) — How to securely manage API credentials, design permissions, handle errors, and prepare for production.
- [Authentication - UI](Security/authentication-roles.md) — Overview of authentication and authorization options in the Omnium UI and how roles are managed across identity providers.
- [SCIM 2.0 (beta)](Security/scim.md) — Automatic User Management with SCIM 2.0 (beta). Automatically synchronize users and roles to Omnium from any identity provider.

### support

- [Support](support.md) — Discover how to submit effective support requests at Omnium. This guide will help you understand how to include the right details to get your issue resolved as quickly as possible.

### training

- [Training](training.md) — Explore Omnium’s training offerings to help users, developers, and consultants fully understand the platform and its features.

## Integrations

Learn how to synchronize data with Omnium using delta queries, events, queues, and other integration patterns.

### Integrations

- [Integrations](Integrations.md) — Learn how to synchronize data with Omnium using delta queries, events, queues, and other integration patterns.
- [Connectors](Integrations/connectors.md) — How the connector framework works — setting up integrations with external systems like ERPs, payment providers, shipping carriers, and e-commerce platforms.
- [Credit Payment Export](Integrations/credit-payment-export.md) — Export a credit registered on an order as its own message, so the receiving system can post a separate credit document instead of modifying the original order.
- [Data In](Integrations/data-in.md) — Best practices for importing data to Omnium efficiently using batch operations and optimized endpoints.
- [Data Out](Integrations/data-out.md) — Best practices for retrieving and synchronizing data from Omnium using delta queries, events, and scrolling.
- [Delta Queries](Integrations/delta.md) — Learn how to use delta queries in Omnium to efficiently retrieve only the data that has changed since a specific timestamp, helping you keep your system synchronized with updates in Omnium.
- [Events](Integrations/events.md) — Complete guide to events in Omnium, including event structure, operation IDs, webhook integration, and subscription management.
- [GUI Export and Import](Integrations/gui-export-import.md) — Manual data export and import using Omnium's UI in JSON and Excel formats for transferring information between systems.
- [Product Query](Integrations/product-query.md) — The unified product query API — single-product lookups, filtered lists, pagination, and bulk extraction with explicit pricing context and configurable response shape.
- [Queues](Integrations/queues.md) — Learn how to integrate and manage message queues with Omnium, including setup, error handling, and secure communication for efficient event processing.
- [Scrolling](Integrations/scrolling.md) — Scrolling retrieves large datasets efficiently with a consistent order. Ideal for bulk processing and reporting, it requires proper scrollId management and completion.
- [Troubleshooting](Integrations/troubleshooting.md) — Common HTTP errors, integration issues, and step-by-step troubleshooting guides for Omnium.

## Inventory

Inventory management in Omnium — stock levels, ATP calculations, inventory valuation, and virtual stock locations.

### Inventory

- [Inventory](Inventory.md) — Inventory management in Omnium — stock levels, ATP calculations, inventory valuation, and virtual stock locations.
- [API Reference](Inventory/inventory-api.md)
- [Inventory ATP](Inventory/inventory-atp.md) — Understanding Available-To-Promise (ATP) calculations and how Omnium determines product availability and delivery dates
- [Configuration](Inventory/inventory-config.md) — Learn how to configure inventory management settings in Omnium. This guide covers inventory tracking, reservations, ATP providers, inventory valuation, and warehouse allocation.
- [Inventory Value](Inventory/inventory-value.md) — Understanding inventory valuation methods and how Omnium calculates inventory cost values
- [OmniStock](Inventory/omnistock.md) — Aggregate inventory across multiple warehouses and stores to determine online product availability.
- [Priority Stock](Inventory/priority-stock.md) — Mark units in a store's inventory as priority stock so allocation sells them first, for example a return the store took in for a product it does not carry.
- [Stock Buffer](Inventory/stock-buffer.md) — Hold back a fixed number of units from available inventory so they are not sold through normal cart or order flows.
- [Virtual Stock Locations](Inventory/virtual-stock-locations.md) — Learn how to configure virtual stock locations in Omnium.
- [Warehouse Locations](Inventory/warehouse-locations.md) — Track inventory at specific physical locations within warehouses. Assign stock to locations, transfer between locations, set default locations for fulfillment and returns.

### Inventory/inventory-atp

- [Omnium ATP Provider](Inventory/inventory-atp/omnium-atp-provider.md) — Built-in ATP provider that calculates availability based on Omnium's inventory and purchase order data

### Inventory/inventory-value

- [Average Cost Provider](Inventory/inventory-value/average-provider.md) — Weighted average inventory valuation with batch tracking
- [Default Provider](Inventory/inventory-value/default-provider.md) — Simple inventory valuation using a single cost per product
- [FIFO Provider](Inventory/inventory-value/fifo-provider.md) — First-In-First-Out inventory valuation with precise batch cost tracking

## Orders

Order management in Omnium — lifecycle, workflows, returns, click & collect, and API reference.

### Order

- [Orders](Order.md) — Order management in Omnium — lifecycle, workflows, returns, click & collect, and API reference.
- [Order API Reference](Order/api-reference.md) — Complete endpoint reference for the Omnium Order API. Covers creating, retrieving, updating, searching, and deleting orders, as well as managing order lines, payments, and documents.
- [Invoices API](Order/invoices-api.md) — Read the invoices, receipts and credit notes of an order, search them, and download them as PDF with the Omnium Invoices API.
- [Ledger](Order/Ledger.md) — Accounting postings in Omnium — how sales, VAT, tender, and gift cards are turned into balanced double-entry vouchers for export to your ERP or accounting system.
- [Order Guide](Order/order-api.md) — Conceptual guide to working with orders in Omnium. Covers the order model, payments, discounts, pricing, order types, and common integration patterns.
- [Click and Collect](Order/order-click-and-collect.md) — Working with click and collect orders in Omnium.
- [Configuration](Order/order-config.md) — Learn how to configure order types, workflows, order settings, returns, and automation in Omnium. This guide covers all order-related configuration options for administrators and developers.
- [FAQ](Order/order-faq.md) — Common questions about the Order API.
- [Order Lifecycle](Order/order-lifecycle.md) — How orders flow through Omnium — from creation to completion, with returns, cancellations, and everything in between.
- [Order Locking](Order/order-locking.md) — How concurrent order updates behave in Omnium, how to enable the optional per-order lock for your tenant, and how to handle the 409 ResourceLocked response.
- [Order Logging](Order/order-logging.md) — Understanding the logging and audit trail features on orders in Omnium, including event log, order status log, workflow execution results, comments, and errors.
- [Pick Lists](Order/order-pick-lists.md) — How pick lists group order shipments for warehouse and in-store picking in Omnium, including statuses, deviation handling, and the Pick List API.
- [Sample Order Types](Order/order-type-samples.md) — Sample order type configurations for click and collect, an online order with home delivery or pickup in store from a warehouse or a store, and endless aisle sales.
- [Workflow Steps](Order/workflow-steps.md) — Complete reference for all workflow steps (OrderActions) in Omnium OMS - the building blocks of order processing workflows.

### Order/Allocation

- [About Allocation Engine (BETA)](Order/Allocation/about-allocation-engine.md) — What the Omnium allocation engine is, how it decides which stores and warehouses an order ships from, and how to start using it.
- [Allocation API (BETA)](Order/Allocation/allocation-api.md) — Ask the allocation engine which warehouses an order or basket would ship from, without changing the order, the cart, or inventory.
- [Allocation Rules (BETA)](Order/Allocation/allocation-rules.md) — Create an allocation rule that steers which stores and warehouses the allocation engine ships an order from, with a worked example.
- [Allocation Settings (BETA)](Order/Allocation/allocation-settings.md) — Configure how the allocation engine behaves - splitting, distance, profiles, and what each store and shipping option can do - globally and per market.
- [Allocation Simulator (BETA)](Order/Allocation/allocation-simulator.md) — Run an order or cart through the allocation engine to see which warehouses it would ship from, and why, without changing anything.

### Order/api-reference

- [Workflow Endpoints](Order/api-reference/workflow.md) — API reference for order workflow endpoints. Update order and shipment statuses, handle partial deliveries, split shipments, and trigger workflow steps like payment capture, notifications, and inventory updates.

### Order/Ledger

- [API Reference](Order/Ledger/api-reference.md) — Public Accounting API reference — read accounting postings and ledger lines produced by Omnium, with endpoints, search requests, response models, and enums.
- [Export to an Accounting System](Order/Ledger/ledger-accounting-export.md) — How POS Z-report postings and web-fulfillment postings fit together, and how to turn postings and ledger lines from the Accounting API into vouchers in your accounting system or ERP.
- [Chart of Accounts](Order/Ledger/ledger-chart-of-accounts.md) — Map Omnium events to general-ledger account numbers — account categories, discriminators, currency and tax-group keys, country presets, and the rules Omnium uses to resolve which account a ledger line books to.
- [Configuration](Order/Ledger/ledger-config.md) — Configure Omnium accounting — enable postings, set currency and time zone, tune auto-balancing, schedule the daily web-fulfillment posting job, and validate the setup.
- [Posting Exclusions](Order/Ledger/ledger-posting-exclusions.md) — Keep selected orders out of web-fulfillment accounting postings with exclusion rules that filter by market, store, order type, order status, payment method, order tags, and sales or return side.
- [Postings & Ledger Lines](Order/Ledger/ledger-postings.md) — The double-entry posting model in Omnium — how sales, VAT, tender, returns, and gift cards become balanced ledger lines, plus the posting lifecycle and reposting behaviour.
- [Posting Preview (dry run)](Order/Ledger/ledger-preview.md) — Preview the accounting postings an order or a store/date range would generate, without committing them — useful for validating the chart of accounts and tax groups before going live.
- [Postings in the UI](Order/Ledger/ledger-reports.md) — Browse accounting postings under Reports — the list and detail views, ledger-line inspection, CSV export, the Accounting Ledger custom report, and the per-Z-report VAT settlement export.
- [Store Accounts](Order/Ledger/ledger-store-accounts.md) — Give a store its own accounting accounts that replace individual tenant chart-of-accounts entries, and set the store's accounting company code and accounting dimension code.
- [Tax Groups (VAT codes)](Order/Ledger/ledger-tax-groups.md) — Tenant-managed VAT codes in Omnium — a rate, an ERP/SAF-T external code (MVA-kode), validity windows for rate changes, store VAT rates with or without tenant VAT rates, and how tax groups tag products, prices, and ledger lines.

### Order/order-logging

- [Event Log](Order/order-logging/event-log.md) — The primary audit trail for all order operations in Omnium, covering status changes, workflows, payments, notifications, and errors.
- [Order Comments](Order/order-logging/order-comments.md) — Add manual audit trail notes and customer communication to orders via the UI or API, with email and SMS notification support.
- [Order Errors](Order/order-logging/order-errors.md) — How processing errors are tracked on orders, including the error model, severity levels, and resolution workflow.
- [Order Status Log](Order/order-logging/order-status-log.md) — Track shipment status transitions with precise timestamps and duration between changes for fulfillment performance analysis.
- [Verbose Logging](Order/order-logging/verbose-logging.md) — Optional detailed logging that creates individual Event Log entries for every workflow step execution, useful for troubleshooting.
- [Workflow Execution Results](Order/order-logging/workflow-execution-results.md) — Understand the results produced by each workflow step when processing orders, including status, errors, and duration.

### Order/Rental

- [Rental API](Order/Rental/rental-api.md) — API reference for the Omnium Rental API. Create and manage rental product instances, check availability, and add rental items to carts.
- [Rental Overview](Order/Rental/rental-overview.md) — Overview of the Omnium rental feature — how rental products work, how rental orders are structured, and how to configure rental in your tenant.

### Order/Returns

- [API Reference](Order/Returns/return-api.md) — Comprehensive guide to the Omnium Returns API. Learn how to create returns, process exchanges, create replacement orders, and manage return workflows programmatically.
- [Configuration](Order/Returns/return-config.md) — Learn how to configure return types, return statuses, return workflows, charges, and automation in Omnium. This guide covers all return-related configuration options for administrators and developers.
- [Return Workflow Steps](Order/Returns/return-workflow-steps.md) — Complete reference for all return workflow steps in Omnium OMS - the building blocks of return processing workflows.

### Order/Returns/return-workflow-steps

- [Customer Workflow Steps](Order/Returns/return-workflow-steps/customers.md) — Workflow steps for updating customer data and loyalty programs based on returns.
- [Enrichment Workflow Steps](Order/Returns/return-workflow-steps/enrichment.md) — Workflow steps for enriching return data with RMA numbers, external IDs, and custom data.
- [Export Workflow Steps](Order/Returns/return-workflow-steps/export.md) — Workflow steps for exporting return data to external systems.
- [Inventory Workflow Steps](Order/Returns/return-workflow-steps/inventory.md) — Workflow steps for managing inventory when processing returns.
- [Notification Workflow Steps](Order/Returns/return-workflow-steps/notifications.md) — Workflow steps for sending return-related notifications to customers.
- [Payment Workflow Steps](Order/Returns/return-workflow-steps/payment.md) — Workflow steps for processing refunds, credits, and payment exports on returns.
- [Replacement Workflow Steps](Order/Returns/return-workflow-steps/replacement.md) — Workflow steps for creating exchange and replacement orders from returns.
- [Shipment Workflow Steps](Order/Returns/return-workflow-steps/shipments.md) — Workflow steps for managing return shipments and labels.
- [Status Workflow Steps](Order/Returns/return-workflow-steps/status.md) — Workflow steps for updating order and project statuses based on return processing.

### Order/Returns/return-workflow-steps/customers

- [Update Customer Club](Order/Returns/return-workflow-steps/customers/update-customer-club.md) — Reverse customer loyalty points earned on the original order when items are returned.

### Order/Returns/return-workflow-steps/enrichment

- [Ensure RMA](Order/Returns/return-workflow-steps/enrichment/ensure-rma.md) — Generate a unique RMA (Return Merchandise Authorization) number for the return.
- [Generate External ID](Order/Returns/return-workflow-steps/enrichment/generate-external-id.md) — Create a unique external identifier for the return.
- [Set Custom Order Data](Order/Returns/return-workflow-steps/enrichment/set-custom-order-data.md) — Enrich return data from a custom connector implementation.

### Order/Returns/return-workflow-steps/export

- [Export Order](Order/Returns/return-workflow-steps/export/export-order.md) — Export return data to external systems via configured connectors.
- [Webhook Return Workflow Step](Order/Returns/return-workflow-steps/export/webhook-return-workflow-step.md) — Call an external HTTP endpoint during return processing, and optionally update the order from the response.

### Order/Returns/return-workflow-steps/inventory

- [Update Inventory](Order/Returns/return-workflow-steps/inventory/update-inventory.md) — Increase inventory levels for returned items.

### Order/Returns/return-workflow-steps/notifications

- [Notification](Order/Returns/return-workflow-steps/notifications/notification.md) — Send email or SMS notifications to customers about return status changes.

### Order/Returns/return-workflow-steps/payment

- [Create Credit Note](Order/Returns/return-workflow-steps/payment/create-credit-note.md) — Issue a credit note for a return, the return receipt that reverses the returned lines of a receipt or invoice, and email it to the customer.
- [Credit Return](Order/Returns/return-workflow-steps/payment/credit-return.md) — Process refunds by crediting payment amounts back to the customer's original payment method.
- [Export Payments](Order/Returns/return-workflow-steps/payment/export-payments.md) — Export return payment data to external payment systems and accounting integrations.

### Order/Returns/return-workflow-steps/replacement

- [Create Exchange Order](Order/Returns/return-workflow-steps/replacement/create-exchange-order.md) — Create a new order for items exchanged as part of the return.
- [Create Replacement Order](Order/Returns/return-workflow-steps/replacement/create-replacement-order.md) — Create a replacement order with current pricing for returned items.
- [Create Replacement Order Keeping Prices](Order/Returns/return-workflow-steps/replacement/create-replacement-order-keeping-prices.md) — Create a replacement order that preserves the original order's pricing.

### Order/Returns/return-workflow-steps/shipments

- [Complete Shipment](Order/Returns/return-workflow-steps/shipments/complete-shipment.md) — Mark return shipments as completed and notify shipping providers.
- [Create Return Shipment Booking](Order/Returns/return-workflow-steps/shipments/create-return-shipment-booking.md) — Book a return shipment and generate a return shipping label.

### Order/Returns/return-workflow-steps/status

- [Cancel Return](Order/Returns/return-workflow-steps/status/cancel-return.md) — Cancel the return and reset all associated financial values.
- [Update Order Status](Order/Returns/return-workflow-steps/status/update-order-status.md) — Update the original order's status to reflect the return.
- [Update Project Status](Order/Returns/return-workflow-steps/status/update-project-status.md) — Update the status of a project or claim associated with the return.

### Order/workflow-steps

- [Allocation Workflow Steps](Order/workflow-steps/allocation.md) — Workflow steps for warehouse allocation, order splitting, and reallocation in Omnium OMS.
- [Analytics Steps](Order/workflow-steps/analytics.md) — Workflow steps for analytics and reporting data indexing.
- [Customer Steps](Order/workflow-steps/customers.md) — Workflow steps for customer management and loyalty programs.
- [Enrichment Workflow Steps](Order/workflow-steps/enrichment.md) — Workflow steps for enriching orders with product data, customer information, tags, and metadata.
- [Export Steps](Order/workflow-steps/export.md) — Workflow steps for exporting orders, payments, and invoices to external systems.
- [Inventory Workflow Steps](Order/workflow-steps/inventory.md) — Workflow steps for managing inventory reservations, reductions, and calculations.
- [Notification Steps](Order/workflow-steps/notifications.md) — Workflow steps for sending customer notifications via email and SMS.
- [Payment Workflow Steps](Order/workflow-steps/payment.md) — Workflow steps for payment processing, authorization, capture, refunds, and financial operations in Omnium OMS.
- [Purchase Order Steps](Order/workflow-steps/purchase-orders.md) — Workflow steps for creating and managing purchase orders from sales orders.
- [Shipment Workflow Steps](Order/workflow-steps/shipments.md) — Workflow steps for managing shipments, shipping methods, labels, and delivery preparation.
- [Subscription Steps](Order/workflow-steps/subscriptions.md) — Workflow steps for managing subscriptions and recurring orders.
- [Validation Steps](Order/workflow-steps/validation.md) — Workflow steps for validating orders, payments, and data integrity.
- [Workflow Steps](Order/workflow-steps/workflow.md) — Steps for controlling order status transitions and workflow flow.

### Order/workflow-steps/allocation

- [Add Reallocation Metadata](Order/workflow-steps/allocation/add-reallocation-metadata.md) — Update order metadata based on shipment information after reallocation.
- [Allocate to Warehouse](Order/workflow-steps/allocation/allocate-to-warehouse.md) — Assign all order shipments to a specific warehouse using a configured warehouse code.
- [Product Package Breakdown](Order/workflow-steps/allocation/product-package-breakdown.md) — Break down bundled or packaged products into their individual component products.
- [Reallocate Entire Order Based on Zip Code](Order/workflow-steps/allocation/reallocate-entire-order-based-on-zip-code.md) — Move an entire order to the warehouse that serves the delivery zip code, without splitting.
- [Remove Order Lines to Be Purchased](Order/workflow-steps/allocation/remove-order-lines-to-be-purchased.md) — Unmark order lines for purchase order creation when they are shipped, picked up or canceled.
- [Remove Try Reallocate Deadline](Order/workflow-steps/allocation/remove-try-reallocate-deadline.md) — Clear the automatic reallocation deadline from shipments.
- [Reset All Package Components](Order/workflow-steps/allocation/reset-all-package-components.md) — Restore package products to their original state by removing broken-down components.
- [Set All Order Lines Not Reserved to Be Purchased](Order/workflow-steps/allocation/set-all-order-lines-not-reserved-to-be-purchased.md) — Mark order lines with insufficient inventory reservation for purchase order creation.
- [Set Try Reallocate Deadline](Order/workflow-steps/allocation/set-try-reallocate-deadline.md) — Set a deadline for automatic reallocation if the order isn't processed in time.
- [Set Warehouse Based on Zip](Order/workflow-steps/allocation/set-warehouse-based-on-zip.md) — Assign the default warehouse based on the delivery address zip code.
- [Split Colli Products to Separate Shipment](Order/workflow-steps/allocation/split-colli-products-to-separate-shipment.md) — Move order lines with colli (multi-package) products to a separate shipment.
- [Split Order Lines with Colli Products](Order/workflow-steps/allocation/split-order-lines-with-colli-products.md) — Split order lines containing colli products into individual line items with quantity 1.
- [Try Allocate Order to Current Warehouses](Order/workflow-steps/allocation/try-allocate-order-to-current-warehouses.md) — Lock shipments to their current warehouses if those warehouses have all required items in stock.
- [Try Reallocate by Category ID](Order/workflow-steps/allocation/try-reallocate-by-category-id.md) — Reallocate orders to a different warehouse based on whether they contain products from a specific category.
- [Try Reallocate by Product ID](Order/workflow-steps/allocation/try-reallocate-by-product-id.md) — Reallocate orders containing specific products to a designated warehouse.
- [Try Reallocate by Store Category ID](Order/workflow-steps/allocation/try-reallocate-by-store-category-id.md) — Reallocate orders based on store-level product category availability.
- [Try Reallocate Entire Order](Order/workflow-steps/allocation/try-reallocate-entire-order.md) — Attempt to move an entire order to any warehouse that has all items in stock.
- [Try Reallocate Entire Order to Specific Warehouse](Order/workflow-steps/allocation/try-reallocate-entire-order-to-specific-warehouse.md) — Attempt to move an entire order to a specific warehouse if it has all items in stock.
- [Try Reallocate on Cancel](Order/workflow-steps/allocation/try-reallocate-on-cancel.md) — Reallocate an order to the nearest warehouse with stock when a fulfillment location cancels.
- [Try Reallocate on Cancel Using Geo Location](Order/workflow-steps/allocation/try-reallocate-on-cancel-using-geo-location.md) — Reallocate an order to the nearest warehouse using geographic coordinates when a location cancels.
- [Try Reallocate to Other Warehouse](Order/workflow-steps/allocation/try-reallocate-to-other-warehouse.md) — Reallocate out-of-stock items to another warehouse with sufficient inventory.
- [Try Reallocate to Purchase Order](Order/workflow-steps/allocation/try-reallocate-to-purchase-order.md) — Allocate order lines to incoming purchase orders for future delivery dates.
- [Try Split Order to Warehouse](Order/workflow-steps/allocation/try-split-order-to-warehouse.md) — Split available items to a specific warehouse while leaving unavailable items for other routing.
- [Try Split Unreserved Order Lines](Order/workflow-steps/allocation/try-split-unreserved-order-lines.md) — Split order lines without inventory reservation using configurable filters and allocation schemes.
- [Try Split Unreserved Order Lines to Closest Zip](Order/workflow-steps/allocation/try-split-unreserved-order-lines-to-closest-zip.md) — Split unreserved order lines to the nearest warehouse based on zip code proximity.
- [Try Split Unreserved Order Lines to Nearest Coordinates](Order/workflow-steps/allocation/try-split-unreserved-order-lines-to-nearest-coordinates.md) — Split unreserved order lines to the nearest warehouse based on geographic coordinates.
- [Try Split Unreserved Order Lines to New Shipment](Order/workflow-steps/allocation/try-split-unreserved-order-lines-to-new-shipment.md) — Move unreserved order lines to a new shipment, optionally at a specific warehouse.

### Order/workflow-steps/analytics

- [Analytics Indexing](Order/workflow-steps/analytics/analytics-indexing.md) — Index order data for analytics and reporting.

### Order/workflow-steps/customers

- [Customer Club Calculate And Update Tier For Member](Order/workflow-steps/customers/customer-club-calculate-and-update-tier-for-member.md) — Calculate and update the loyalty tier for a customer club member.
- [Customer Club Calculate New Points On Hold](Order/workflow-steps/customers/customer-club-calculate-new-points-on-hold.md) — Calculate loyalty points for a new order and place them on hold.
- [Customer Club Calculate Points On Hold And Move To Earned](Order/workflow-steps/customers/customer-club-calculate-points-on-hold-and-move-to-earned.md) — Calculate loyalty points and immediately move them to earned status in one step.
- [Customer Club Cancel New Points On Hold](Order/workflow-steps/customers/customer-club-cancel-new-points-on-hold.md) — Cancel loyalty points that were placed on hold when an order is cancelled.
- [Customer Club Move From On Hold To Earned Points](Order/workflow-steps/customers/customer-club-move-from-on-hold-to-earned-points.md) — Move loyalty points from on-hold status to earned status when order completes.
- [Get or Create Customer From Order](Order/workflow-steps/customers/get-or-create-customer-from-order.md) — Create or update customer records from order data.

### Order/workflow-steps/enrichment

- [Add Click and Collect Tags](Order/workflow-steps/enrichment/add-click-and-collect-tags.md) — Add specific tags to click-and-collect orders for notification routing.
- [Add Custom Tags](Order/workflow-steps/enrichment/add-custom-tags.md) — Add configured custom tags to the order.
- [Add Order Tags](Order/workflow-steps/enrichment/add-order-tags.md) — Calculate and add default order tags based on shipment and customer data.
- [Add Order Tags by Category ID](Order/workflow-steps/enrichment/add-order-tags-by-category-id.md) — Add tags to orders based on product category membership.
- [Add Order Tags by SKU ID](Order/workflow-steps/enrichment/add-order-tags-by-sku-id.md) — Add tags to orders based on specific product SKUs.
- [Create Order Barcode](Order/workflow-steps/enrichment/create-order-barcode.md) — Generate a barcode identifier for the order.
- [Enrich B2B Customer ID](Order/workflow-steps/enrichment/enrich-b2b-customer-id.md) — Enrich order with B2B customer identifier for business customers.
- [Enrich Order Cost from Products](Order/workflow-steps/enrichment/enrich-order-cost-from-products.md) — Set cost data on order line items from product information.
- [Enrich Order from Product GTINs](Order/workflow-steps/enrichment/enrich-order-from-product-gtins.md) — Lookup products by GTIN and enrich order line items.
- [Enrich Order from Products](Order/workflow-steps/enrichment/enrich-order-from-products.md) — Populate order line items with product details from the product catalog.
- [Enrich Order Line with Location](Order/workflow-steps/enrichment/enrich-order-line-with-location.md) — Add warehouse location information to order line items.
- [Enrich Order Market](Order/workflow-steps/enrichment/enrich-order-market.md) — Set the market ID on the order based on the store configuration.
- [Enrich Order with Customer External IDs](Order/workflow-steps/enrichment/enrich-order-with-customer-external-ids.md) — Copy external IDs from the customer record to the order.
- [Enrich Order with Customer Properties](Order/workflow-steps/enrichment/enrich-order-with-customer-properties.md) — Copy custom properties from the customer record to the order.
- [Enrich Shipment Label](Order/workflow-steps/enrichment/enrich-shipment-label.md) — Set shipping label on shipments from the shipping option configuration.
- [Generate External ID](Order/workflow-steps/enrichment/generate-external-id.md) — Generate a unique external ID for the order using configured number service.
- [Generate Secret Key](Order/workflow-steps/enrichment/generate-secret-key.md) — Generate a cryptographically secure random secret key for secure order lookups without authentication.
- [Set Canceled Date](Order/workflow-steps/enrichment/set-canceled-date.md) — Set the cancellation timestamp on orders and line items.
- [Set Completed Date](Order/workflow-steps/enrichment/set-completed-date.md) — Set the completion timestamp on orders and shipments.
- [Set Current User as Sales Person](Order/workflow-steps/enrichment/set-current-user-as-sales-person.md) — Assign the current user as the sales person for the order.
- [Set Custom Order Data](Order/workflow-steps/enrichment/set-custom-order-data.md) — Enrich order using a custom connector implementation.
- [Set Customer Pickup Deadline](Order/workflow-steps/enrichment/set-customer-pickup-deadline.md) — Calculate and set a customer pickup deadline based on a configured number of working days and store opening hours.
- [Set Default External ID](Order/workflow-steps/enrichment/set-default-external-id.md) — Set external ID on order from the order type configuration.
- [Set Ready for Pickup Date](Order/workflow-steps/enrichment/set-ready-for-pickup-date.md) — Set the ready for pickup timestamp on click-and-collect orders.
- [Update Order Line Reserved Inventory](Order/workflow-steps/enrichment/update-order-line-reserved-inventory.md) — Set reserved inventory status on order lines based on inventory check, with optional property-based forced reservation.

### Order/workflow-steps/export

- [Export Invoices](Order/workflow-steps/export/export-invoices.md) — Export invoice data to external systems using invoice export connectors.
- [Export Order](Order/workflow-steps/export/export-order.md) — Complete guide to configuring the Export Order workflow step to send orders to external systems like ERPs, warehouses, and fulfillment centers.
- [Export Payments](Order/workflow-steps/export/export-payments.md) — Export payment data to external systems using payment exporter connectors.
- [FIFO Webhook](Order/workflow-steps/export/fifo-webhook.md) — Export orders, returns, and credit payments via HTTP POST with guaranteed ordering and automatic retries.
- [Print Click & Collect Order](Order/workflow-steps/export/print-click-and-collect-order.md) — Print order documents for Click & Collect fulfillment at store.
- [Webhook Workflow Step](Order/workflow-steps/export/webhook-workflow-step.md) — Call an external HTTP endpoint during order processing, and optionally update the order from the response.

### Order/workflow-steps/inventory

- [Calculate and Update Product Inventory](Order/workflow-steps/inventory/calculate-and-update-product-inventory.md) — Update inventory status on products based on order line SKUs.
- [Calculate ATP](Order/workflow-steps/inventory/calculate-atp.md) — Calculate Available-to-Promise (ATP) values for products in the order.
- [Change Status If Out of Stock](Order/workflow-steps/inventory/change-status-if-out-of-stock.md) — Trigger an order status change if any line item is out of stock.
- [Change Status If Unreserved](Order/workflow-steps/inventory/change-status-if-unreserved.md) — Split unreserved order lines into a new shipment and change their status.
- [Check POS Order for Return and Increase Inventory](Order/workflow-steps/inventory/check-pos-order-for-return-and-increase-inventory.md) — Increase inventory for returned items on POS orders.
- [Increase Reserved Inventory](Order/workflow-steps/inventory/increase-reserved-inventory.md) — Reserve inventory for order lines when an order is placed.
- [Mark Order Lines for Cross Dock](Order/workflow-steps/inventory/mark-order-lines-for-cross-dock.md) — Configure cross-docking and same-delivery consolidation for multi-warehouse orders.
- [Recalculate Reserved Inventory](Order/workflow-steps/inventory/recalculate-reserved-inventory.md) — Recalculate reserved inventory counts for products in the order.
- [Reduce Inventory](Order/workflow-steps/inventory/reduce-inventory.md) — Decrease actual inventory levels when an order is shipped or picked.
- [Reduce Inventory and Reserved Inventory](Order/workflow-steps/inventory/reduce-inventory-and-reserved-inventory.md) — Decrease both actual and reserved inventory when an order ships.
- [Reduce Inventory Only On Reserved Order Lines](Order/workflow-steps/inventory/reduce-inventory-only-on-reserved-order-lines.md) — Reduce inventory and conditionally reduce reserved inventory based on line item reservation status.
- [Reduce Reserved Inventory](Order/workflow-steps/inventory/reduce-reserved-inventory.md) — Release reserved inventory when an order or shipment is canceled.
- [Set All Order Lines To Reserved](Order/workflow-steps/inventory/set-all-order-lines-to-reserved.md) — Mark all order lines as having reserved inventory regardless of allocation results.
- [Set Items Out of Stock](Order/workflow-steps/inventory/set-items-out-of-stock.md) — Zero out inventory for all products in the order.
- [Set Shipment or Order Ready for Pickup](Order/workflow-steps/inventory/set-shipment-or-order-ready-for-pickup.md) — Prepare click-and-collect orders by setting warehouse and pickup deadline.

### Order/workflow-steps/notifications

- [Notification](Order/workflow-steps/notifications/notification.md) — Send email and SMS notifications to customers based on order status.

### Order/workflow-steps/payment

- [Add Payment Merchant ID](Order/workflow-steps/payment/add-payment-merchant-id.md) — Add the merchant ID from payment provider configuration to payment properties.
- [Add Payment Type Tag](Order/workflow-steps/payment/add-payment-type-tag.md) — Add order tags based on the payment methods used.
- [Add Shipment Info to Payment Provider](Order/workflow-steps/payment/add-shipment-info-to-payment-provider.md) — Send shipment tracking information to payment providers that support it.
- [Authorize Payment](Order/workflow-steps/payment/authorize-payment.md) — Authorize payment amounts with the payment provider for pending authorizations.
- [Cancel Payments](Order/workflow-steps/payment/cancel-payments.md) — Cancel or void all active payments on an order, or credit captured payments.
- [Capture Payments](Order/workflow-steps/payment/capture-payments.md) — Capture payment amounts from authorized payments when shipments are released.
- [Check and Update Coupon Usage](Order/workflow-steps/payment/check-and-update-coupon-usage.md) — Marks single-use promotion coupons as used in Omnium's internal tracking.
- [Check Personal Discount Coupons](Order/workflow-steps/payment/check-personal-discount-coupons.md) — Validate personal discount coupons with internal and external coupon providers.
- [Create and Send Gift Cards](Order/workflow-steps/payment/create-and-send-gift-cards.md) — Create purchased gift cards and send them to recipients.
- [Create Invoice](Order/workflow-steps/payment/create-invoice.md) — Generate an invoice for the order or specific shipment.
- [Create Payment Remaining](Order/workflow-steps/payment/create-payment-remaining.md) — Create an additional payment for any remaining unpaid amount on the order.
- [Create Receipts](Order/workflow-steps/payment/create-receipts.md) — Issue the paid receipts for an order, with the delivered lines and the payments that paid for them, for the customer to see in the webshop.
- [Credit Cancelled Order Lines](Order/workflow-steps/payment/credit-cancelled-order-lines.md) — Refund captured payment amounts for cancelled order lines.
- [Remove Authorization Expires](Order/workflow-steps/payment/remove-authorization-expires.md) — Clear payment authorization expiration dates after capture.
- [Reserve Gift Cards](Order/workflow-steps/payment/reserve-gift-cards.md) — Reserve gift card balances used as payment on the order.
- [Set Authorization Expires](Order/workflow-steps/payment/set-authorization-expires.md) — Calculate and set payment authorization expiration dates from payment provider settings.
- [Transfer Replacement Order Payment](Order/workflow-steps/payment/transfer-replacement-order-payment.md) — Transfer payment from the original order to replacement orders.
- [Try Redeem Personal Discount Coupons](Order/workflow-steps/payment/try-redeem-personal-discount-coupons.md) — Redeem personal discount coupons with internal and external coupon providers.
- [Try Release Remaining Auth](Order/workflow-steps/payment/try-release-remaining-auth.md) — Release any remaining authorization amount after partial capture.
- [Verify Order Payment Method](Order/workflow-steps/payment/verify-order-payment-method.md) — Validate that the order's payment method is allowed for processing.

### Order/workflow-steps/purchase-orders

- [Create Internal Transfer From Shipment](Order/workflow-steps/purchase-orders/create-internal-transfer-from-shipment.md) — Create internal transfer orders from shipments for unreserved inventory.
- [Create Order From Purchase Order](Order/workflow-steps/purchase-orders/create-order-from-purchase-order.md) — Create a sales order from a purchase order for inter-store transfers.
- [Create PO Delivery From Shipment](Order/workflow-steps/purchase-orders/create-po-delivery-from-shipment.md) — Create purchase order deliveries from order shipments.
- [Create Purchase Order From Order](Order/workflow-steps/purchase-orders/create-purchase-order-from-order.md) — Create a purchase order from a sales order for supplier fulfillment.

### Order/workflow-steps/rental

- [Create Rental Project from Order](Order/workflow-steps/rental/create-rental-project-from-order.md) — Creates a tracking project for each rental line item on a new order.
- [Update Rental Project Status](Order/workflow-steps/rental/update-rental-project-status.md) — Moves all rental projects linked to an order to a specified project workflow step.

### Order/workflow-steps/shipments

- [Change Shipping Method](Order/workflow-steps/shipments/change-shipping-method.md) — Change the shipping method for shipments to a specified method.
- [Change Shipping Method for Shipments Without Colli Products](Order/workflow-steps/shipments/change-shipping-method-name-for-shipments-without-colli-products.md) — Change shipping method for shipments that don't contain colli (bulky) products to reduce shipping costs.
- [Complete Shipment](Order/workflow-steps/shipments/complete-shipment.md) — Finalize shipments and notify shipping providers about completed shipments.
- [Create Default Shipment](Order/workflow-steps/shipments/create-default-shipment.md) — Create an initial shipment for orders that have no shipments.
- [Create Return Shipment Booking](Order/workflow-steps/shipments/create-return-shipment-booking.md) — Create a booking for return shipment with the shipping provider.
- [Create Shipment Packages Based on Product Colli](Order/workflow-steps/shipments/create-shipment-packages-based-on-product-colli.md) — Create shipment packages based on the colli (package) information defined on products.
- [Enrich Shipments with Properties from Shipment Option](Order/workflow-steps/shipments/enrich-shipments-with-properties-from-shipment-option.md) — Copy configured properties from the shipment option to the shipment.
- [Prepare Shipment Delivery](Order/workflow-steps/shipments/prepare-shipment-delivery.md) — Send shipment preparation notification to the shipping provider.
- [Print Shipping Label](Order/workflow-steps/shipments/print-shipping-label.md) — Print shipping label via cloud print integration with the shipping provider.
- [Select Default Shipping Method](Order/workflow-steps/shipments/select-default-shipping-method.md) — Set shipping method based on market configuration and shipping options.
- [Set Pickup Warehouse Code](Order/workflow-steps/shipments/set-pickup-warehouse-code.md) — Set the pickup warehouse code on shipments for click-and-collect orders.
- [Split All Line Items](Order/workflow-steps/shipments/split-all-line-items.md) — Split each line item into a separate shipment.
- [Split Order Lines to Be Purchased to Shipment](Order/workflow-steps/shipments/split-order-lines-to-be-purchased-to-shipment.md) — Split order lines that are waiting for purchase orders into a separate shipment.
- [Split Shipment Cost](Order/workflow-steps/shipments/split-shipment-cost.md) — Distribute shipping cost evenly across multiple shipments.
- [Split Shipments by Freight Class](Order/workflow-steps/shipments/split-shipments-by-freight-class.md) — Split shipments based on freight classification of products.
- [Try Map Shipment Description to Pickup Point](Order/workflow-steps/shipments/try-map-shipment-description-to-pickup-point.md) — Map shipment description data to pickup point information.
- [Try Split Shipment by Category ID](Order/workflow-steps/shipments/try-split-shipment-by-category-id.md) — Split shipment and reallocate to another warehouse based on product category.
- [Update Shipment Status](Order/workflow-steps/shipments/update-shipment-status.md) — Update the status of shipments based on order status transitions.
- [Update Shipment Status for In Transit](Order/workflow-steps/shipments/update-shipment-status-for-in-transit.md) — Update shipment status specifically for packages being transferred between warehouses.

### Order/workflow-steps/subscriptions

- [Create Replacement Subscription Orders](Order/workflow-steps/subscriptions/create-replacement-subscription-orders.md) — Automatically create replacement orders when subscription orders are cancelled.
- [Create Subscriptions](Order/workflow-steps/subscriptions/create-subscriptions.md) — Create subscriptions from order lines containing subscription products.

### Order/workflow-steps/validation

- [Check For Fraud](Order/workflow-steps/validation/check-for-fraud.md) — Run fraud detection checks on orders using configured fraud service connector.
- [Validate Colli Count](Order/workflow-steps/validation/validate-colli-count.md) — Validate that shipments with mandatory colli count have it set.
- [Validate Default External ID](Order/workflow-steps/validation/validate-default-external-id.md) — Validate that the required default external ID exists on the order.
- [Validate Order](Order/workflow-steps/validation/validate-order.md) — Run order validators to verify order data integrity and business rules.
- [Validate Serial Numbers](Order/workflow-steps/validation/validate-serial-numbers.md) — Validate that serializable products have serial numbers assigned.
- [Validate Tracking Number](Order/workflow-steps/validation/validate-tracking-number.md) — Validate that shipments have tracking numbers assigned.
- [Verify Capture Is Completed](Order/workflow-steps/validation/verify-capture-is-completed.md) — Verify that payment captures have been successfully completed for all active payments.
- [Verify Completely Paid](Order/workflow-steps/validation/verify-completely-paid.md) — Verify that an order has been 100% paid before proceeding.

### Order/workflow-steps/workflow

- [Change Shipment Order Status](Order/workflow-steps/workflow/change-shipment-order-status.md) — Change the order status of shipments to a specified status.
- [Change Status](Order/workflow-steps/workflow/change-status.md) — Change order or shipment status and/or order type.
- [Change Status Based On Product Properties](Order/workflow-steps/workflow/change-status-based-on-product-properties.md) — Conditionally change order status based on product property values.
- [Remove Update Status Date](Order/workflow-steps/workflow/remove-update-status-date.md) — Cancel a scheduled automatic status update.
- [Set Update Status Date](Order/workflow-steps/workflow/set-update-status-date.md) — Schedule automatic status update for a future time.

## Prices

How prices work in Omnium — price levels, promotions, price lists, prioritization, and tax handling.

### Prices

- [Prices](Prices.md) — How prices work in Omnium — price levels, promotions, price lists, prioritization, and tax handling.
- [Campaigns](Prices/Campaigns.md) — Plan, execute, and measure promotional campaigns in Omnium — group promotions, set revenue targets, and track performance in real time.
- [Lowest price history](Prices/lowest-price.md) — Automatically tracks the lowest valid price for products over a set period to ensure compliance with pricing regulations such as the EU Omnibus Directive.
- [Price list](Prices/PriceLists.md) — Create price lists to manage prices
- [Price prioritization rules](Prices/PricePrioritization.md) — Before adding prices to a product, it's important to understand how prices are prioritized. This includes filtering, sorting and selecting defaults based on the contextual input and available price configurations.
- [Prices and Tax](Prices/PricesAndTax.md) — How tax is stored on prices, how it flows through the cart and POS, and how to configure tax groups for VAT reporting.
- [Pricing and Promotions Overview](Prices/pricing-and-promotions.md) — How pricing works in Omnium — the relationship between price creation, price storage, promotions, and how the right price reaches your customer.
- [Promotions](Prices/Promotions.md) — Technical overview of Omnium's promotion system, including API endpoints, application logic, priorities, and combination rules.
- [Setting Up Prices](Prices/SettingUpPrices.md) — How to set up and manage prices in Omnium - choosing the right approach for your integration, using price lists for manual management, and keeping your price model efficient.

### Prices/Campaigns

- [API Reference](Prices/Campaigns/campaign-api.md) — Technical guide to the Campaign public REST API — create, update, search, and manage campaign lifecycles programmatically via the Omnium API.
- [Campaign Performance](Prices/Campaigns/campaign-performance.md) — How to track campaign revenue, sales volume, and variance against targets using the real-time performance dashboard and analytics charts.
- [Campaign Planning](Prices/Campaigns/campaign-planning.md) — How to set revenue targets and sales volume forecasts at the campaign, promotion, and SKU level for accurate campaign planning.
- [Campaign Promotions](Prices/Campaigns/campaign-promotions.md) — How to link and unlink promotions to campaigns, and how the relationship between campaigns and promotions works in practice.
- [Campaign Settings](Prices/Campaigns/campaign-settings.md) — How to configure campaign statuses with a locked status, campaign milestones and deadlines, planning dimensions, sales channels and the thresholds of the campaign overview.
- [Managing Campaigns](Prices/Campaigns/managing-campaigns.md) — How to create, edit, copy, and delete campaigns in the Omnium UI — including search, filtering, and status management.
- [Campaign Overview](Prices/Campaigns/overview.md) — Core concepts behind campaigns in Omnium — lifecycle statuses, the relationship between campaigns, promotions, and price lists, and how data is structured.

### Prices/Promotions

- [Conditional Pricing](Prices/Promotions/conditionalPricingApiReference.md) — API reference for conditional pricing - define custom promotional prices that activate when MultiBuy conditions are met.
- [Cost Price Promotion](Prices/Promotions/costPriceApiReference.md) — API reference for creating and managing Cost Price promotions in Omnium OMS. Calculate selling prices dynamically from cost prices with configurable markup.
- [Kit Promotions](Prices/Promotions/kitPromotionApiReference.md) — API reference for creating and managing Kit promotions (bundle discounts) in Omnium OMS.
- [MultiBuy](Prices/Promotions/multibuyApiReference.md) — API reference for creating and managing MultiBuy and Mix and Match promotions in Omnium OMS.
- [Order Amount](Prices/Promotions/orderAmountApiReference.md) — API reference for creating and managing Order Amount promotions in Omnium OMS.
- [Price Filters](Prices/Promotions/priceFilterApiReference.md) — API reference for configuring price filters on promotions to control which products are eligible based on their price type.
- [Price List Promotions](Prices/Promotions/priceListPromotionApiReference.md) — How price list promotions combine the price management capabilities of price lists with the targeting, scheduling, and combination features of promotions.
- [Product Search](Prices/Promotions/productSearchApiReference.md) — API reference for creating and managing Product Search promotions in Omnium OMS. Target products dynamically using flexible search criteria like tags, price ranges, stock status, and more.
- [Tiered Pricing](Prices/Promotions/tieredPricingApiReference.md) — API reference for creating and managing Tiered Pricing promotions in Omnium OMS.

## Products

Product catalog, categories, assets, assortment

### Product

- [Product](Product.md) — Introduction to products in Omnium
- [Configuration](Product/configuration.md) — Complete guide to product settings and configuration options in Omnium
- [Container Deposits](Product/container-deposits.md) — How Omnium charges container deposits (pant) as separate order lines that follow the product through carts, orders, cancellations, returns and reports
- [Gift Cards](Product/giftcards.md) — This page describes the technical configuration required to enable **gift cards** in Omnium, as well as API usage for buying and paying with gift cards.
- [Local Products](Product/local-products.md) — Store-specific product assortments with localized editing and access control
- [Product Assets](Product/product-assets.md) — Manage product images, documents, and media files in Omnium with automatic resizing and CDN delivery.
- [Product Assortment](Product/product-assortment.md) — Complete guide to controlling product visibility across stores, markets, and customers in Omnium
- [Product Categories](Product/product-categories.md) — Complete guide to product categories in Omnium - hierarchical organization, multi-language support, automatic creation, and API usage.
- [Product Components](Product/product-components.md) — Create packages, bundles, and kits by combining multiple products as components in Omnium.
- [Product Identifiers](Product/product-identifiers.md) — Deep dive into the product identification system in Omnium - understanding Id, ProductId, SkuId, ParentId, and VariantParentId
- [Recommendations](Product/recommendations.md) — Product recommendations in Omnium — related products, cart-based suggestions, and top sellers, with personalization and filtering.
- [Sales Restrictions](Product/sales-restrictions.md) — Product fields for controlling embargo dates, fixed-price legislation, and discount blocking in sales channels

### Product/api-reference

- [Assets](Product/api-reference/assets.md) — Getting started with assets
- [Alerts](Product/api-reference/product-alerts.md) — Getting started with product alerts
- [Categories](Product/api-reference/product-categories.md) — Getting started guide for working with product categories in Omnium, including model structure, enrichment settings, and synchronization best practices.
- [Options](Product/api-reference/product-options.md) — Getting started with the product options
- [Packages](Product/api-reference/product-packages.md) — How to handle product packages in Omnium via API
- [Properties](Product/api-reference/product-properties.md) — Learn how to configure and manage product properties, including dropdowns, lists, and custom value types.
- [Search](Product/api-reference/product-search.md) — Getting started with the product search api
- [Updates](Product/api-reference/product-updates.md) — Outlines best practices when updating products in Omnium via API

### Product/configuration

- [Completion Rates](Product/configuration/completion-rates.md) — Configure product completion rate tracking to measure and improve product data quality
- [Product Types](Product/configuration/product-types.md) — Configure product types with custom properties to categorize and structure your product catalog
- [Omnium URL Provider](Product/configuration/url-provider.md) — Configure automatic SEO-friendly URL generation for products in Omnium

### Product/container-deposits

- [API Reference](Product/container-deposits/api-reference.md) — Product deposit fields, the JSON shape of a container deposit line on carts and orders, orders received with deposits, returns of deposits and analytics rows for deposits
- [Configuration](Product/container-deposits/configuration.md) — Enable container deposits, define deposit types and their deposit articles, choose how orders from external channels are handled, and give products a deposit type

### Product/local-products

- [Access Control](Product/local-products/access-control.md) — How user permissions and store access control the editing of local products
- [Configuration](Product/local-products/configuration.md) — How to enable and configure the Local Products feature
- [Cost Prices](Product/local-products/cost-prices.md) — Managing store-specific cost prices for local products

### Product/product-assets

- [Asset API Reference](Product/product-assets/api-reference.md) — Complete API reference for product asset endpoints in Omnium, including CRUD operations and image uploads.
- [Asset Model Reference](Product/product-assets/asset-model.md) — Complete property reference for the Asset model in Omnium, including URLs, metadata, and custom properties.
- [Asset Upload](Product/product-assets/asset-upload.md) — How to upload assets to Omnium via external URLs and binary streams.
- [CDN](Product/product-assets/cdn.md) — Serve product images and assets through a Content Delivery Network for faster global delivery.
- [Asset Configuration](Product/product-assets/configuration.md) — Configure image processing settings for product assets in Omnium.
- [Preview Images](Product/product-assets/preview-images.md) — Automatic generation of resized preview images at configured aspect ratios for product assets.
- [Working with Product Assets](Product/product-assets/product-assets.md) — How assets are managed on products, including main image handling, variant inheritance, and asset operations.

### Product/product-assortment

- [Additional Controls](Product/product-assortment/additional-controls.md) — IsActive, publish dates, inventory, and other product visibility controls
- [Assortment Codes](Product/product-assortment/assortment-codes.md) — Time-based product groupings for seasonal and customer-specific assortments
- [B2B Pricing and Assortment Control](Product/product-assortment/b2b-assortment.md) — Price based assortment in B2B scenarios
- [Customer Categories](Product/product-assortment/customer-categories.md) — Customer-specific product visibility through category restrictions
- [Price-Based Assortment](Product/product-assortment/price-based-assortment.md) — Automatic product assortment based on price availability
- [Store Categories](Product/product-assortment/store-categories.md) — Automatic product assortment through store category configuration
- [Store and Market IDs](Product/product-assortment/store-market-ids.md) — Direct product assignment to stores, markets, and market groups

### Product/product-categories

- [Category API Reference](Product/product-categories/api-reference.md) — Complete API reference for product category endpoints in Omnium, including CRUD operations, tree queries, and scroll search.
- [Automatic Category Creation](Product/product-categories/automatic-categories.md) — Automatically create product categories from brand and season data using scheduled tasks in Omnium.
- [Category Model Reference](Product/product-categories/category-model.md) — Complete property reference for the ProductCategory model in Omnium, including all fields, data types, and usage notes.
- [Category Tree & Hierarchy](Product/product-categories/category-tree.md) — Understanding the category hierarchy in Omnium, including tree operations, sorting, and navigation building.
- [Category Configuration](Product/product-categories/configuration.md) — Configure product category settings in Omnium tenant settings including root categories, automatic enrichment, and caching options.
- [Dynamic Categories](Product/product-categories/dynamic-categories.md) — Create categories that automatically display products based on saved search criteria using the productSearchId feature.
- [Product Category Enrichment](Product/product-categories/product-enrichment.md) — How Omnium enriches products with category data, parent category population, and the sync scheduled task.

### Product/product-components

- [Component API Reference](Product/product-components/api-reference.md) — API reference for working with product components, packages, and bundles in Omnium.
- [Component Model Reference](Product/product-components/component-model.md) — Complete property reference for the ProductComponent model in Omnium.
- [Component Configuration](Product/product-components/configuration.md) — Configure packages, bundles, and component behavior in Omnium tenant settings.
- [Component Inventory](Product/product-components/inventory.md) — How Omnium handles inventory for packages, bundles, and kits - including calculated inventory and kit assembly.
- [Components in Orders](Product/product-components/orders.md) — How package and bundle components are handled in orders, including line item structure and pricing.
- [Package Types](Product/product-components/package-types.md) — Understanding the differences between Package, Bundle, and Kit product types in Omnium.

### Product/product-identifiers

- [Identifiers in API Import](Product/product-identifiers/api-import.md) — How to correctly set product identifiers when creating and updating products via the Omnium API
- [Identifiers in Excel Import](Product/product-identifiers/excel-import.md) — How to correctly set product identifiers when importing products and variants via Excel
- [ID Property Reference](Product/product-identifiers/id-reference.md) — Complete property reference for product identifier fields - Id, ProductId, SkuId, ParentId, and VariantParentId

### Product/recommendations

- [API Reference](Product/recommendations/api-reference.md) — Endpoints, request and response models for the Omnium Recommendations API.
- [Configuration](Product/recommendations/configuration.md) — Tenant settings that control how Omnium filters and surfaces product recommendations.

## Projects

Manage long-running activities like returns, claims, and complex sales processes using Omnium's project framework.

### Projects

- [Projects](Projects.md) — Manage long-running activities like returns, claims, and complex sales processes using Omnium's project framework.
- [Project Actions](Projects/project-actions.md) — Reference for all project workflow actions available in Omnium OMS.
- [API Reference](Projects/project-api.md)
- [Configuration](Projects/projects-configuration.md)

### Projects/project-actions

- [Change Project Type and Step](Projects/project-actions/change-project-type-and-step.md) — Configure the ChangeProjectTypeAndStep project action to move a project to a different project type and workflow step automatically.
- [Create Replacement Cart](Projects/project-actions/create-replacement-cart.md) — Configure the CreateReplacementCart project action to create a replacement cart from a linked return without immediately placing an order.
- [Create Replacement Order](Projects/project-actions/create-replacement-order.md) — Configure the CreateReplacementOrder project action to automatically create a replacement order from a linked return.
- [Create Replacement Order From Cart](Projects/project-actions/create-replacement-order-from-cart.md) — Configure the CreateReplacementOrderFromCart project action to convert an existing replacement cart into an order.
- [Credit Return](Projects/project-actions/credit-return.md) — Configure the CreditReturn project action to issue a payment credit for a linked return order.
- [Export Project](Projects/project-actions/export-project.md) — Configure the ExportProject project action to send project data to external systems via a connector.
- [Notification](Projects/project-actions/notification.md) — Configure the Notification project action to send email or SMS notifications when a project reaches a workflow step.
- [Refund Rental Deposit](Projects/project-actions/refund-rental-deposit.md) — Configure the RefundRentalDeposit project action to credit rental deposit amounts back to the customer when a rental project closes.
- [Update Return Status](Projects/project-actions/update-return-status.md) — Configure the UpdateReturnStatus project action to change the status of the linked return order form when a project workflow step executes.

## Purchase Orders

Manage procurement in Omnium — create purchase orders, track supplier deliveries, handle goods reception, and reserve customer orders against incoming stock.

### PurchaseOrders

- [Purchase Orders](PurchaseOrders.md) — Manage procurement in Omnium — create purchase orders, track supplier deliveries, handle goods reception, and reserve customer orders against incoming stock.
- [Deliveries](PurchaseOrders/Deliveries.md) — Learn about deliveries in Omnium — how they track inbound goods from suppliers and internal transfers, manage goods reception, and connect purchase orders to warehouse inventory.
- [API Reference](PurchaseOrders/purchase-order-api.md) — Complete guide to the Purchase Order API in Omnium. Learn how to create, manage, and fulfill purchase orders, handle deliveries and goods reception, and integrate with your procurement workflows.
- [Configuration](PurchaseOrders/purchase-order-config.md) — Learn how to configure purchase order statuses, workflows, reorder settings, deliveries, and automation in Omnium. This guide covers all purchase order configuration options for administrators and developers.
- [Reservations](PurchaseOrders/purchase-order-reservations.md) — Learn how order lines are reserved against purchase orders, how reservations transfer to warehouse stock during goods reception, and how to manage reservations via the API.
- [Suppliers](PurchaseOrders/Suppliers.md) — Learn about suppliers in Omnium — how they relate to purchase orders, products, lead times, and inventory replenishment.
- [Validation](PurchaseOrders/validation.md) — How purchase order validation works in Omnium — ensuring orders are valid before they are sent to suppliers.

### PurchaseOrders/Deliveries

- [Configuration](PurchaseOrders/Deliveries/delivery-config.md) — Configure delivery settings in Omnium — delivery numbering, goods reception behavior, shipment status updates, automatic status calculation, and delivery exports.
- [Goods Reception](PurchaseOrders/Deliveries/goods-reception.md) — How goods reception works in Omnium — receiving delivered goods into warehouse inventory, releasing order reservations, and handling partial deliveries.

### PurchaseOrders/Suppliers

- [API Reference](PurchaseOrders/Suppliers/supplier-api.md) — Complete guide to the Supplier API in Omnium. Learn how to create, search, update, and manage suppliers through the public REST API.
- [Supplier Assortment Codes](PurchaseOrders/Suppliers/supplier-assortment-codes.md) — Configure assortment codes on suppliers to control which products can be added to purchase orders. Includes settings reference, validation behavior, and UI filtering details.
- [Configuration](PurchaseOrders/Suppliers/supplier-config.md) — Configure supplier settings in Omnium, including local access control, tags, default properties, address types, and lead time defaults. This guide covers all supplier configuration options for administrators and developers.
- [Integration Guide](PurchaseOrders/Suppliers/supplier-erp-integration.md) — Step-by-step guide for integrating supplier data from an external system (such as M3, Dynamics 365, or SAP) into Omnium using the Suppliers API.

### PurchaseOrders/validation

- [Purchase Order Validators](PurchaseOrders/validation/purchase-order-validators.md) — Reference for all built-in purchase order validators in Omnium.

### PurchaseOrders/validation/purchase-order-validators

- [Assortment Code Validator](PurchaseOrders/validation/purchase-order-validators/assortment-code-validator.md) — Validates that products on the purchase order are compatible with the supplier's assortment codes and tenant restrictions.
- [Cost Price List Date Validator](PurchaseOrders/validation/purchase-order-validators/cost-price-list-date-validator.md) — Blocks a purchase order when its requested delivery date falls outside the validity period of the cost price list used for the order.
- [Internal Transfer Inventory Validator](PurchaseOrders/validation/purchase-order-validators/internal-transfer-inventory-validator.md) — Validates that the source warehouse has sufficient available stock to fulfil an internal transfer purchase order.
- [Package Break Validator](PurchaseOrders/validation/purchase-order-validators/package-break-validator.md) — Validates that ordered quantities are multiples of the supplier's packaging quantity.
- [Product Discontinuation Validator](PurchaseOrders/validation/purchase-order-validators/product-discontinuation-validator.md) — Validates that no products in the purchase order have passed their discontinuation date.
- [Product Supplier Order Amount Validator](PurchaseOrders/validation/purchase-order-validators/product-supplier-order-amount-validator.md) — Warns when the line items belonging to a secondary supplier fall outside that supplier's minimum or maximum order amount.
- [Purchase Order Amount Validator](PurchaseOrders/validation/purchase-order-validators/purchase-order-amount-validator.md) — Validates that the purchase order total is within the supplier's minimum and maximum order amount limits.
- [Purchase Order Zero Quantity Validator](PurchaseOrders/validation/purchase-order-validators/purchase-order-zero-quantity-validator.md) — Validates that no line items on the purchase order have a quantity of zero.

## Release notes

What changed recently in Omnium

### Releasenotes

- [Release notes](Releasenotes.md) — Stay up to date with the latest updates and features for orders in Omnium
- [2026 Omnium UI refresh](Releasenotes/new-ui-2026.md) — Introduction to the 2026 Omnium UI refresh, what has changed, and what it means for how you work.
- [2026](Releasenotes/releasenotes-1-2026.md) — Key updates, bug fixes, and improvements for Omnium in 2026, detailed week by week.
- [2025](Releasenotes/releasenotes-2-2025.md) — Key updates, bug fixes, and improvements for Omnium in 2025, detailed week by week.
- [2024](Releasenotes/releasenotes-3-2024.md) — Key updates, bug fixes, and improvements for Omnium in 2024, detailed week by week.
- [2023](Releasenotes/releasenotes-4-2023.md) — Key updates, bug fixes, and improvements for Omnium in 2023, detailed week by week.
- [2022](Releasenotes/releasenotes-5-2022.md) — Key updates, bug fixes, and improvements for Omnium in 2022, detailed week by week.
- [2021](Releasenotes/releasenotes-6-2021.md) — Key updates, bug fixes, and improvements for Omnium in 2021, detailed week by week.

## Stores & Markets

Stores, markets, warehouses, regions

### Markets

- [Markets](Markets.md) — Markets define regional context in Omnium — language, currency, tax, shipping, and more.
- [Configuration](Markets/markets-config.md) — Explore how to configure and manage markets in Omnium, including setting language, region, currency, tax, and shipment options. This guide helps you understand the key components and considerations for setting up markets for different customer needs and regions.

### Stores

- [Stores](Stores.md) — Introduction to stores in Omnium
- [API Reference](Stores/store-api.md) — Learn all you need to know about the store API
- [Configuration](Stores/store-config.md) — Learn how to configure store settings, store groups, store roles, and default properties in Omnium. This guide covers all store-related configuration options for administrators and developers.
- [Stores, Markets & Warehouses](Stores/stores-markets-warehouses.md) — How Omnium's location model works — the unified store entity, markets as regional context, warehouses as inventory locations, and how they all connect.

## Tutorials

Step-by-step guides (ERP, POS, omnichannel e-com integration)

### GettingStartedWithAPI

- [Tutorials](GettingStartedWithAPI/Tutorials.md) — Step-by-step guides that walk you through complete integration scenarios with Omnium — from first API call to production-ready workflows.

### GettingStartedWithAPI/Tutorials

- [ERP Integration](GettingStartedWithAPI/Tutorials/erp-integration.md) — This guide walks through a complete ERP integration with Omnium — subscribing to order events, fetching orders, confirming receipt, syncing inventory, reporting shipments, and processing returns.
- [Omnichannel e-com](GettingStartedWithAPI/Tutorials/omnichannel-ecom.md) — This guide shows how to set up a basic e-commerce store in Omnium, including markets, products, inventory, and a simple checkout flow.
- [POS Integration](GettingStartedWithAPI/Tutorials/pos-integration.md) — This guide walks through a complete POS integration with Omnium — pushing in-store sales and returns, transferring online orders to the store, synchronizing store inventory, and subscribing to changes with webhooks.

## Notifications — Email & SMS

Email, SMS, notification templates

### configuration/scheduled-tasks

- [Notification Scheduled Tasks](configuration/scheduled-tasks/notifications.md) — Background jobs for processing and sending pending notifications

### configuration/scheduled-tasks/customer-club

- [Expire Soon Notification](configuration/scheduled-tasks/customer-club/expire-soon-notification.md) — Notify customer club members about points that will expire soon
- [Point Balance Notification](configuration/scheduled-tasks/customer-club/point-balance-notification.md) — Notify customer club members when their point balance reaches a threshold

### configuration/scheduled-tasks/notifications

- [Process Notifications](configuration/scheduled-tasks/notifications/notification.md) — Retrieve and send pending notification messages

### configuration/scheduled-tasks/ratings

- [Verify Rating Notification](configuration/scheduled-tasks/ratings/verify-rating-notification.md) — Send notifications for product ratings that require staff verification

### Order/Returns/return-workflow-steps

- [Notification Workflow Steps](Order/Returns/return-workflow-steps/notifications.md) — Workflow steps for sending return-related notifications to customers.

### Order/Returns/return-workflow-steps/notifications

- [Notification](Order/Returns/return-workflow-steps/notifications/notification.md) — Send email or SMS notifications to customers about return status changes.

### Order/workflow-steps

- [Notification Steps](Order/workflow-steps/notifications.md) — Workflow steps for sending customer notifications via email and SMS.

### Order/workflow-steps/notifications

- [Notification](Order/workflow-steps/notifications/notification.md) — Send email and SMS notifications to customers based on order status.

### plugins/Other

- [LINK Mobility](plugins/Other/LinkMobility.md) — Send SMS through LINK Mobility and let customers reply by SMS, with each order, return or case conversation on its own number from a subnumber range.
- [Sendgrid](plugins/Other/Sendgrid.md) — Guide for setting up the Omnium Sendgrid plugin.

### Projects/project-actions

- [Notification](Projects/project-actions/notification.md) — Configure the Notification project action to send email or SMS notifications when a project reaches a workflow step.
