# Product Discontinuation Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/product-discontinuation-validator

> Validates that no products in the purchase order have passed their discontinuation date.

## Overview

The **Product Discontinuation Validator** checks that every product on the purchase order is still active. If a product's `Discontinued` date is set and has passed, the validator adds an error to the affected line item and an aggregate error to the order, preventing the order from being submitted with discontinued products.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `productDiscontinuationValidator` |
| **Validation Type** | Product |
| **Validation Scope** | LineItem |

## Behavior

1.  Iterates through all line items in the purchase order
2.  For each line item, looks up the product by product ID or SKU ID
3.  If no product is found for the line item code, the line is skipped
4.  Checks whether `Discontinued` is set and whether the date is in the past
5.  If discontinued, adds an **error** to the line item with the discontinuation date
6.  Removes the error from lines where the product is still active
7.  Aggregates line item errors to the purchase order level

## Error messages

| Condition | Severity | Message |
| --- | --- | --- |
| Product's discontinuation date has passed | Error | `The product {productId}, {productName}, has been discontinued. This product was discontinued from {date}.` |

## Configuration

No additional properties required.

```json
{
  "name": "productDiscontinuationValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```

## Related

The `Discontinued` date on a product is set via the **Products** section in the Omnium UI or via the Products API. A product is considered discontinued when `Discontinued` is not null and the date is earlier than the current UTC time.
