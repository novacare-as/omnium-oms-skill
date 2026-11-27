# Validation

Source: https://docs.omnium.no/docs/PurchaseOrders/validation

> How purchase order validation works in Omnium — ensuring orders are valid before they are sent to suppliers.

## Introduction

Validation in Omnium ensures that a purchase order meets all business requirements before it is submitted or exported to a supplier. When a purchase order is saved or updated, Omnium runs all configured validators and attaches any errors or warnings directly to the affected order lines and the order itself.

Validation is triggered automatically when:

*   A purchase order is created or updated via the Omnium UI
*   A purchase order is created or updated via the API

Each validator can attach errors or warnings at two levels:

*   **Line item level** — the specific line causing the problem is flagged
*   **Order level** — an aggregate error is added to the purchase order summarising how many lines are affected

Errors and warnings use two severity levels:

*   **Error** — indicates a blocking problem (e.g. discontinued product, insufficient inventory)
*   **Warning** — indicates an advisory issue that does not necessarily block submission (e.g. order amount below minimum, package break allowed)

Omnium ships with a set of built-in validators. Each validator is registered as a connector and must be enabled per tenant in the `Connectors` section of the tenant settings. See [Purchase Order Validators](validation/purchase-order-validators.md) for a full reference.
