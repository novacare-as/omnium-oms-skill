# Supplier Assortment Codes

Source: https://docs.omnium.no/docs/PurchaseOrders/Suppliers/supplier-assortment-codes

> Configure assortment codes on suppliers to control which products can be added to purchase orders. Includes settings reference, validation behavior, and UI filtering details.

## Overview

Suppliers can be configured with **assortment codes** that define which products they are able to deliver. When assortment codes are set on a supplier, Omnium uses them to:

1.  **Filter the product list** — When adding products to a purchase order, only products with matching active assortment codes are shown.
2.  **Validate order lines** — A validator checks each product line on the purchase order against the supplier's assortment codes and raises an error if a product does not have a matching code.

This provides a more flexible alternative to the traditional supplier ID filtering, especially when multiple suppliers carry overlapping product ranges.

* * *

## Prerequisites

Assortment codes must first be configured at the tenant level under **Configuration > Settings > Products > Assortment Codes**. These are the same assortment codes used on products. Once configured at the tenant level, they become available for selection on suppliers.

* * *

## Configuring assortment codes on a supplier

Assortment codes are managed on the **Assortment** tab of the supplier edit page.

A multi-select dropdown displays all assortment codes configured in the tenant's product settings. Select the codes that represent the product categories this supplier can deliver.

The assortment codes selector only appears on the supplier edit page if the tenant has assortment codes configured in product settings.

### Supplier model

| Property | Type | Description |
| --- | --- | --- |
| `AssortmentCodes` | List<string> | Assortment code IDs that define which products this supplier can deliver. Available via the public API on `OmniumSupplier`. |

* * *

## UseStrictAssortment setting

A tenant-level setting controls how product filtering works when adding products to a purchase order.

| Property | Type | Default | Location |
| --- | --- | --- | --- |
| `UseStrictAssortment` | bool | false | **Configuration > Settings > Products > Supplier Settings** |

### Behavior when disabled (default)

*   The product search on a purchase order is filtered by the **supplier ID** as before.
*   If the supplier has assortment codes configured, those are applied as an **additional hard filter** on the product search (the user cannot clear this filter).
*   If no results are found for the supplier ID, Omnium automatically broadens the search by removing the supplier filter.

### Behavior when enabled

*   The product search is filtered **only by the supplier's assortment codes** — the supplier ID filter is not applied.
*   If the supplier has no assortment codes configured, the product list is **empty** (no products are shown).
*   The automatic broadening of search results on zero hits is disabled — the assortment code filter is strictly enforced.

```
UseStrictAssortment = false (default)
┌──────────────────────────────────────────────┐
│ Product search filtered by:                  │
│   1. Supplier ID  (primary filter)           │
│   2. Supplier's assortment codes  (if set)   │
│                                              │
│ If 0 results → removes supplier ID filter    │
│   and retries                                │
└──────────────────────────────────────────────┘

UseStrictAssortment = true
┌──────────────────────────────────────────────┐
│ Product search filtered by:                  │
│   1. Supplier's assortment codes  (only)     │
│                                              │
│ Supplier has no assortment codes?            │
│   → Empty product list (no search)           │
│                                              │
│ Supplier ID filter is NOT applied            │
└──────────────────────────────────────────────┘
```

### Sample configuration

```
"ProductSettings": {
  "SupplierSettings": {
    "UseStrictAssortment": true
  }
}
```

* * *

## Validation

The `AssortmentCodeValidator` checks each product line on a purchase order against the supplier's assortment codes. This validation runs regardless of the `UseStrictAssortment` setting.

### Validation logic

For each line item on the purchase order:

1.  The validator looks up the supplier by the purchase order's `SupplierId`.
2.  If the supplier has no assortment codes configured, the line passes validation.
3.  If the supplier has assortment codes, the validator checks whether the product has at least one **active** assortment code that matches one of the supplier's codes.
4.  An assortment code is considered active when `ValidFrom ≤ now` (or is null) and `ValidTo > now` (or is null).
5.  If no matching active code is found, the line is flagged with the error `ProductNotInSupplierAssortment`.

```
Product assortment codes: [ELECTRONICS (active), FURNITURE (expired)]
Supplier assortment codes: [ELECTRONICS, ACCESSORIES]

→ Match found (ELECTRONICS) → Line passes validation
```

```
Product assortment codes: [FURNITURE (active)]
Supplier assortment codes: [ELECTRONICS, ACCESSORIES]

→ No match → Error: ProductNotInSupplierAssortment
```

This validation applies to all products on a purchase order, including those added via the API. Products added through the UI are pre-filtered, but API consumers should ensure products match the supplier's assortment before adding them.

* * *

## SupplierId on purchase order lines

Each purchase order line now includes a `SupplierId` field that records which supplier the product is associated with. This value is automatically populated during enrichment from the product's (or variant's) `SupplierId` if not already set.

| Property | Type | Description |
| --- | --- | --- |
| `SupplierId` | string | The supplier ID of the product, populated automatically during purchase order enrichment. Stored on the line for traceability. |

* * *

## Public API

The `AssortmentCodes` field is available on the `OmniumSupplier` model in the public API. It is a simple list of strings representing the assortment code IDs assigned to the supplier.

```json
{
  "id": "supplier-123",
  "name": "Acme Wholesale",
  "assortmentCodes": ["ELECTRONICS", "ACCESSORIES"],
  ...
}
```

* * *

## Example scenario

1.  **Tenant setup**: Assortment codes `ELECTRONICS`, `ACCESSORIES`, and `FURNITURE` are configured in product settings.
2.  **Supplier setup**: Supplier "Acme Wholesale" is configured with assortment codes `ELECTRONICS` and `ACCESSORIES`.
3.  **Product setup**: Products are tagged with assortment codes (e.g., a laptop has `ELECTRONICS`, a desk has `FURNITURE`).
4.  **Creating a purchase order**: When opening the Products tab on a PO for Acme Wholesale, only products with active `ELECTRONICS` or `ACCESSORIES` assortment codes appear in the search results.
5.  **Validation**: If a product with only `FURNITURE` is added via the API, the validator flags the line with `ProductNotInSupplierAssortment`.
