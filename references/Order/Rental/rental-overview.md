# Rental Overview

Source: https://docs.omnium.no/docs/Order/Rental/rental-overview

> Overview of the Omnium rental feature — how rental products work, how rental orders are structured, and how to configure rental in your tenant.

The rental feature lets you manage time-based product lending through Omnium. A customer rents a specific physical product instance for a defined period and pays a daily rate plus an optional deposit.

## How rental works

Rental in Omnium is built on two layers:

1.  **Rental products** — Physical instances of a rentable item. Each instance is a distinct product derived from a _source product_. You manage inventory, availability, and pricing at the instance level.
2.  **Rental orders** — Standard Omnium orders containing rental line items. A rental line item represents one rented instance for a specific period. The quantity on the line equals the number of rental days.

When a rental order is placed, the [Create Rental Project from Order](../workflow-steps/rental/create-rental-project-from-order.md) workflow step creates a project for each rental line. That project tracks the rental period, deposit amounts, and lifecycle (return, deposit withheld, refund).

* * *

## Rental products

### Source products and rental instances

A _source product_ is the catalog item that represents the rentable article (e.g., a specific bicycle model). You cannot rent a source product directly. Instead, you create _rental product instances_ from it — one instance per physical unit available for rent.

Each rental instance:

*   Has `isRental: true` on the product model
*   Stores a reference to its source product via `rentalSourceProductId`
*   Has its own SKU and can carry individual pricing

### Prices

A rental product carries two types of prices:

| Price type | `priceType` value | Purpose |
| --- | --- | --- |
| Daily rate | _(any value except `"Deposit"`)_ | Per-day charge billed on the rental line item |
| Deposit | `"Deposit"` | One-time deposit billed on a separate deposit line item |

* * *

## Rental order lines

When a rental item is added to a cart, two line items are created:

### Rental line item

| Field | Value |
| --- | --- |
| `isRental` | `true` |
| `quantity` | Number of daily rates: one for every started 24 hours of the rental period, and at least one |
| `placedPrice` | Daily rate from the rental product's price |
| Property `RentalFrom` | Rental period start (ISO 8601) |
| Property `RentalTo` | Rental period end (ISO 8601) |
| Property `IsRental` | `"true"` |

### Deposit line item

| Field | Value |
| --- | --- |
| `code` | `{rentalProductSkuId}-deposit` |
| `quantity` | `1` |
| `placedPrice` | Deposit amount from the rental product's deposit price |
| `taxRate` | `0` (deposits are tax-exempt) |
| Property `DepositFor` | SKU of the rental product this deposit covers |

The deposit line item is linked to the rental line item via the `DepositFor` property. The [Refund Rental Deposit](../../Projects/project-actions/refund-rental-deposit.md) project action uses this property to identify the correct line when issuing a refund.

* * *

## Configuration

Rental is controlled by these settings in **Configuration → Settings → Orders**.

| Setting | Type | Description |
| --- | --- | --- |
| `isRentalEnabled` | bool | Enables rental features in the Omnium UI |
| `rentalProjectTypeId` | string | ID of the project type used when creating rental projects from orders. Setting this also enables rental-related UI features. |
| `rentalReturnBufferMinutes` | int | **Reserve the unit after return (minutes)**. How long a rental instance stays reserved after it is returned, for example for checking and cleaning. No rental can start in this time, and a rental must end this long before the next one starts. Empty or `0` turns it off. See [Reservation after return](rental-api.md#reservation-after-return). |

Rental projects are only created automatically when `rentalProjectTypeId` is set. If you enable `isRentalEnabled` without configuring `rentalProjectTypeId`, rental order lines will be processed but no tracking project will be created.

* * *

## In the Omnium UI

When rental is enabled, the following features become available:

*   **Rental product management** — Create, view, and delete rental product instances from a source product. Manage per-instance pricing.
*   **Availability calendar** — Check which rental instances are available or booked for a given period, grouped by source product.
*   **Rental order view** — Rental line items and deposit line items are displayed with their rental period and associated project on the order detail page.
*   **Search filters** — Filter orders and products by rental-specific criteria.

* * *

## Related

*   [Rental API](rental-api.md) — Full API reference for managing rental products and adding rentals to carts
*   [Create Rental Project from Order](../workflow-steps/rental/create-rental-project-from-order.md) — Workflow step that creates rental projects when an order is placed
*   [Refund Rental Deposit](../../Projects/project-actions/refund-rental-deposit.md) — Project action for refunding the deposit at end of rental
