# Purchase Order Validators

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators

> Reference for all built-in purchase order validators in Omnium.

## Overview

Omnium provides the following built-in purchase order validators. Each validator implements the `IPurchaseOrderValidator` interface and is registered as a connector. To enable a validator, add it to the **Connectors** section in tenant settings with the `IPurchaseOrderValidator` implementation.

| Validator | Connector ID | Description |
| --- | --- | --- |
| [Assortment Code](purchase-order-validators/assortment-code-validator.md) | `assortmentCodeValidator` | Validates product assortment codes against supplier and tenant settings |
| [Cost Price List Date](purchase-order-validators/cost-price-list-date-validator.md) | `costPriceListDateValidator` | Blocks orders whose requested delivery date falls outside the cost price list validity period |
| [Internal Transfer Inventory](purchase-order-validators/internal-transfer-inventory-validator.md) | `internalTransferInventoryValidator` | Validates that the source warehouse has sufficient stock for internal transfers |
| [Package Break](purchase-order-validators/package-break-validator.md) | `packageBreakValidator` | Validates that ordered quantities are multiples of the supplier's packaging quantity |
| [Product Discontinuation](purchase-order-validators/product-discontinuation-validator.md) | `productDiscontinuationValidator` | Blocks ordering of products whose discontinuation date has passed |
| [Product Supplier Order Amount](purchase-order-validators/product-supplier-order-amount-validator.md) | `productSupplierOrderAmountValidator` | Warns when the lines of a secondary supplier fall outside that supplier's order amount limits |
| [Purchase Order Amount](purchase-order-validators/purchase-order-amount-validator.md) | `purchaseOrderAmountValidator` | Warns when the order total falls outside the supplier's minimum or maximum order amount |
| [Purchase Order Zero Quantity](purchase-order-validators/purchase-order-zero-quantity-validator.md) | `zeroQuantityValidator` | Blocks purchase orders that contain line items with a quantity of zero |

## Connector configuration

To enable a validator, add it to the `connectors` array in tenant settings:

```json
{
  "name": "productDiscontinuationValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```

Refer to each validator's page for details on additional configuration properties.
