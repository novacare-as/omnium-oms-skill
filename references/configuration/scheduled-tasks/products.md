# Products Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products

> Background jobs for product data maintenance, pricing, assortment, and inventory status

The Products scheduled tasks are responsible for maintaining product data integrity, calculating prices, managing product assortments, updating inventory status on products, and sending product alerts to customers.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Popularity Sort Index](products/popularity-sort-index.md) | Calculate product popularity scores based on sales data | Full |
| [Product Lowest Price](products/product-lowest-price.md) | Calculate and update the lowest price for each product | Full |
| [Remove Unmodified Prices](products/remove-unmodified-prices.md) | Clean up customer-specific prices that have not been updated recently | Full |
| [Send Product Alerts](products/send-product-alerts.md) | Notify customers when products are back in stock | Delta |
| [Update Assortment By Price](products/update-assortment-by-price.md) | Update product assortment based on price availability | Full |
| [Update Assortment By Store](products/update-assortment-by-store.md) | Update product assortment based on store assignment | Full |
| [Update Product Categories](products/update-product-categories.md) | Synchronize product category assignments | Full |
| [Variant Location From Product](products/variant-location-from-product.md) | Copy location data from products to their variants | Full |
| [Product Inventory Status](products/product-inventory-status.md) | Update product inventory levels based on recent inventory changes | Delta |
| [Product Inventory Full Status](products/product-inventory-full-status.md) | Perform a complete refresh of inventory data on all products | Full |
| [Product Expected Delivery Date](products/product-expected-delivery-date.md) | Update expected delivery dates for products using ATP data | Full |

* * *

## Overview

Product tasks work together to maintain accurate and up-to-date product information in Omnium:

1.  **Pricing Tasks** - Calculate lowest prices and clean up stale customer-specific pricing
2.  **Inventory Tasks** - Keep product inventory status synchronized with actual inventory levels
3.  **Assortment Tasks** - Manage which products are available in which markets and stores
4.  **Category Tasks** - Maintain product categorization
5.  **Customer Notification Tasks** - Send alerts when products become available

* * *

## Common Use Cases

### Price Maintenance

Enable the lowest price and unmodified prices tasks to maintain accurate pricing information and clean up stale customer-specific prices.

### Inventory Visibility

Use the inventory status tasks to ensure product availability is accurately reflected in your storefront and search results.

### Multi-Store Operations

Enable assortment tasks to manage which products appear in different stores or markets based on pricing and store configuration.

### Back-in-Stock Notifications

Enable the product alerts task to automatically notify customers when items they are interested in become available.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Inventory delta tasks | `*/5 * * * *` (every 5 minutes) | Keep inventory visibility near real-time |
| Inventory full tasks | `0 4 * * 0` (weekly at 4 AM Sunday) | Resource-intensive, run off-peak |
| Price tasks | `0 2 * * *` (daily at 2 AM) | Run after price imports |
| Assortment tasks | `0 3 * * *` (daily at 3 AM) | Run during off-peak hours |
| Alert tasks | `*/15 * * * *` (every 15 minutes) | Balance responsiveness with system load |
