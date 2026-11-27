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
| **Suffix** | string | A suffix to be added to the number (e.g., "-B" for "1-B", "2-B"). | Optional |
| **MarketGroupId** | string | Applies the number option to the markets in this market group. A number option on the market itself takes priority. When no other option of the number type applies, Omnium also uses it for other markets, except for `BusinessCustomerNumberOptions`. | Optional |
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
*   `BusinessCustomerNumberOptions`
*   `CartNumberOptions`
*   `ReturnNumberOptions`
*   `RmaNumberOptions`
*   `ProjectNumberOptions`
*   `PickListNumberOptions`
*   `ReceiptNumberOptions`
*   `InvoiceNumberOptions`
*   `CreditNoteNumberOptions`
*   `CaseIdNumberOptions` and `CaseNumberOptions` (see [case numbers](../Customer/Cases/cases-config.md#case-numbers))

* * *

### Receipt number series

The [Create Receipts](../Order/workflow-steps/payment/create-receipts.md) workflow step numbers receipts from the `ReceiptNumberOptions` number type. When no `ReceiptNumberOptions` is configured for the market or tenant, receipts take their numbers from `InvoiceNumberOptions`. A receipt is a sales document and must have a number from a series, so it never falls back to `GuidNumberService`: when neither number type is configured with another service, the step issues no receipt.

* * *

### Business customer number series

Business customers can take their customer numbers from a series of their own. Add a number option with the number type `BusinessCustomerNumberOptions`. Without it, business customers take their numbers from `CustomerNumberOptions`, the same series as private customers.

The business series applies when you request a number with `GET /api/BusinessCustomers/GetNextCustomerNumber` and when you create a business customer in the Omnium UI. Private customers always use `CustomerNumberOptions`, also through `GET /api/PrivateCustomers/GetNextCustomerNumber`. When `IsAutoCreateDisabled` is true on the series that applies, `GetNextCustomerNumber` returns `400 Bad Request`.

When a market is given (the `marketId` query parameter, or in the Omnium UI your selected market when you have selected exactly one market), Omnium looks for `BusinessCustomerNumberOptions` in this order:

1.  The number options of the market.
2.  The tenant number options with the `MarketGroupId` of the market.
3.  The tenant number options without a `MarketGroupId`.

When none of these has a business series, the business customer takes a number from `CustomerNumberOptions` for its market. A business series for another market group never applies to a market. When you request a number without a market, Omnium uses the business series without a `MarketGroupId`, or else the first business series on the tenant.

When `BusinessCustomerNumberOptions` and `CustomerNumberOptions` count with separate counters (a different `Key` or `Service`, or a different `KeyPostfix` with `SequentialNumberService`) and have the same `Prefix` and `Suffix`, a business customer and a private customer can get the same customer ID. The settings validation shows a warning in that case. Give the business series its own `Prefix` or `Suffix`, or use the same `Key`, `KeyPostfix` and `Service` so both series share one counter. A `StartSequence` that keeps the two series apart also prevents the same ID, but the warning stays, because the validation does not compare start numbers.

* * *

### Order type specific number series

An order type can use its own number series instead of the tenant or market `OrderNumberOptions`. Set the `OrderNumberType` property on the order type to the `Key` of the number option to use. See [order number generation](../Order/order-config.md#order-number-generation) for the resolution order and a configuration example.
