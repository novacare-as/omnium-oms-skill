# Assortment Code Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/assortment-code-validator

> Validates that products on the purchase order are compatible with the supplier's assortment codes and tenant restrictions.

## Overview

The **Assortment Code Validator** performs up to three independent checks against each line item to ensure the product is valid for the given supplier and tenant configuration. The checks cover tenant-wide non-purchasable assortment codes, supplier-defined assortment code requirements, and supplier assignment on the product.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `assortmentCodeValidator` |
| **Validation Type** | Assortment |
| **Validation Scope** | LineItem |

## Behavior

For each line item the validator looks up the product and runs the following checks:

### 1\. Non-purchasable assortment codes

Checks whether the product has any currently active assortment codes that appear in the tenant's `NonPurchasableAssortmentCodes` list (configured in `PurchaseOrderSettings`). An assortment code is considered active if its `ValidFrom` and `ValidTo` dates include the current date.

*   If a match is found: adds a **warning** to the line item listing the invalid codes

### 2\. Supplier assortment codes (when supplier has assortment codes configured)

When the supplier has one or more assortment codes defined, checks whether the product (or its variant) has at least one active assortment code that matches the supplier's required codes. Variant assortment codes are checked in addition to product-level codes when the line item code matches a specific variant SKU.

*   If no matching code is found: adds an **error** to the line item

### 3\. Supplier assignment (when supplier has no assortment codes)

When the supplier has no assortment codes configured, falls back to checking whether the product's `SupplierId` (or any entry in `AdditionalSuppliers`) matches the purchase order's supplier. If the purchase order has no supplier set, this check is skipped.

*   If the supplier does not match: adds a **warning** to the line item

After all line items are validated, errors for each check type are aggregated to the purchase order level.

## Error messages

| Condition | Severity | Error Key |
| --- | --- | --- |
| Product has non-purchasable assortment codes | Warning | `NonPurchasableAssortmentCode` |
| Product not in supplier's assortment codes | Error | `ProductNotInSupplierAssortment` |
| Product has wrong or missing supplier | Warning | `WrongOrMissingSupplierOnProduct` |

## Configuration

Non-purchasable assortment codes are configured in tenant settings under `PurchaseOrderSettings.NonPurchasableAssortmentCodes`. Supplier assortment codes are configured on the supplier. See [Supplier Assortment Codes](../../Suppliers/supplier-assortment-codes.md) for details.

No additional connector properties are required.

```json
{
  "name": "assortmentCodeValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```
