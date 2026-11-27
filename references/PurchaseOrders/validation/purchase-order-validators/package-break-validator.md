# Package Break Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/package-break-validator

> Validates that ordered quantities are multiples of the supplier's packaging quantity.

## Overview

The **Package Break Validator** ensures that the quantity ordered for each line item is a multiple of the supplier's packaging quantity (`SupplierPackagingQuantity`). Breaking a supplier's package — ordering a quantity that is not a full multiple — may not be accepted by the supplier. The severity of the validation result depends on whether package breaks are permitted on the line item.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `packageBreakValidator` |
| **Validation Type** | Quantity |
| **Validation Scope** | LineItem |

## Behavior

1.  Iterates through all line items in the purchase order
2.  Skips lines where `SupplierPackagingQuantity` is not set or is zero, or where `AllowSupplierPackageBreak` is not set
3.  Checks whether the ordered quantity is a multiple of `SupplierPackagingQuantity`
4.  If the quantity is **not** a multiple:
    *   When `AllowSupplierPackageBreak` is `true`: adds a **warning** to the line item with the closest valid multiple as a suggestion
    *   When `AllowSupplierPackageBreak` is `false`: adds an **error** to both the line item and the order
5.  If the quantity is a valid multiple, removes any existing package break error

## Error messages

| Condition | Severity | Translation Key |
| --- | --- | --- |
| Package break, and breaks are allowed | Warning | `PackageBreakWarningMessage` |
| Package break, and breaks are not allowed | Error | `PackageBreakErrorMessage` |
| Detail message (both cases) | — | `SupplierPackageBreakDetailsMessage` (includes the closest valid multiple) |

## Configuration

No additional properties required. The `SupplierPackagingQuantity` and `AllowSupplierPackageBreak` values are set per line item and sourced from supplier product data.

```json
{
  "name": "packageBreakValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```
