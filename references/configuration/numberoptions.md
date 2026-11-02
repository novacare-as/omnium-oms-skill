# Number Options

Source: https://docs.omnium.no/docs/configuration/numberoptions

> Configuration of number options for assigning IDs to entities.

### Overview

Number option settings determine how new IDs are assigned to entities such as customers, orders, carts, etc. Each number option is associated with a specific number type. The first defined configuration for a number type will be used when creating new IDs.

For example, when a new customer is created, Omnium will search for the first available "CustomerNumberOptions" on the selected market. If none are found, it will fall back to the first "CustomerNumberOptions" defined in the generic number options section of the configuration file. If no option is defined there, the system defaults to "GuidNumberService."

* * *

### Number Option Model

The table below outlines the properties of a number option:

| Property | Type | Description | Notes |
| --- | --- | --- | --- |
| **NumberType** | string | Specifies the number type (e.g., SupplierNumberOptions, CustomerNumberOptions). | Required |
| **Key** | string | Unique key for the incrementing value (e.g., OrderNumber, CustomerNumber). | Required |
| **StartSequence** | long | The starting point for the new number series. | Optional |
| **Prefix** | string | A prefix to be added to the number (e.g., "C-" for "C-1", "C-2"). | Optional |
| **Service** | string | The number service used (e.g., "SequentialNumberService", "GuidNumberService"). | Required |
| **TranslateKey** | string | Key for translating the number option name. | Optional |
| **ValidationRegex** | string | Regex pattern for validating the ID. | Optional |
| **IsReadOnly** | bool | If true, the number is non-editable in the GUI. | Optional |
| **IsAutoCreateDisabled** | bool | If true, automatic number assignment is disabled in the GUI (allowing manual entry). | Optional |

* * *

### Number Types

Number types are used to distinguish between different entity types. Below are the most common number types:

*   `SupplierNumberOptions`
*   `DeliveryNumberOptions`
*   `PurchaseOrderNumberOptions`
*   `OrderNumberOptions`
*   `CustomerNumberOptions`
*   `CartNumberOptions`
*   `ReturnNumberOptions`
*   `RmaNumberOptions`
*   `ProjectNumberOptions`
*   `PickListNumberOptions`
*   `ReceiptNumberOptions`
*   `InvoiceNumberOptions`
*   `CreditNoteNumberOptions`

* * *

### Receipt number series

The [Create Receipts](../Order/workflow-steps/payment/create-receipts.md) workflow step numbers receipts from the `ReceiptNumberOptions` number type. When no `ReceiptNumberOptions` is configured for the market or tenant, receipts take their numbers from `InvoiceNumberOptions`. A receipt is a sales document and must have a number from a series, so it never falls back to `GuidNumberService`: when neither number type is configured with another service, the step issues no receipt.

* * *

### Order type specific number series

An order type can use its own number series instead of the tenant or market `OrderNumberOptions`. Set the `OrderNumberType` property on the order type to the `Key` of the number option to use. See [order number generation](../Order/order-config.md#order-number-generation) for the resolution order and a configuration example.
