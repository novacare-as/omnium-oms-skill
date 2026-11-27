# Configuration

Source: https://docs.omnium.no/docs/Carts/cart-config

> Learn how to configure cart settings and validators in Omnium.

## Cart settings

Cart settings control the behavior of shopping carts in Omnium, including numbering, validation, market handling, and UI options.

### General settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsOrderNumbersUsedAsCartNumber | bool | false | When enabled, cart numbers use the order number sequence. Additionally, when a cart is converted to an order, the order number will be the same as the cart's number. This ensures a consistent numbering scheme across carts and orders. |
| IsCartVersionEnabled | bool | false | When enabled, each time a cart is saved, a version snapshot is stored in the version history. This allows you to track changes to the cart over time and review previous states. |
| IsMetaDataDeletedWhenCreatingCartFromOrder | bool | false | When enabled, custom properties (metadata) are not copied when creating a cart from an existing order. Use this when you want replacement or re-order carts to start fresh without inheriting the original order's properties. |
| MaximumNumberOfOrderLines | int | 100 | Maximum number of order lines allowed in a shopping cart. If set to 0, the default maximum of 100 is used. Carts exceeding this limit will receive an error when saved. |
| MaximumNumberOfItems | int | 0 (off) | Maximum total quantity in a shopping cart, counted as the sum of all order line quantities. Adding a line or changing a line quantity that would push the total above the limit is rejected with `400 Too many items in cart`. Set to 0 to turn the check off. Component lines of a bundle or package are not counted, since the bundle or package line already counts. |

#### Sample

```
"CartSettings": {
  "IsOrderNumbersUsedAsCartNumber": true,
  "IsCartVersionEnabled": true,
  "IsMetaDataDeletedWhenCreatingCartFromOrder": false,
  "MaximumNumberOfOrderLines": 150,
  "MaximumNumberOfItems": 500
}
```

### Market and customer settings

These settings control how market selection works in relation to customers.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsCustomerMarketDefaultOnCart | bool | false | When enabled, selecting a customer in the shopping cart automatically sets the cart's market to match the customer's market. This ensures that the customer always sees prices and shipping options for their home market. |
| IsAskForMarketWhenMismatch | bool | false | When enabled (and IsCustomerMarketDefaultOnCart is also enabled), a confirmation dialog is shown when the selected market doesn't match the customer's market. This gives the user the choice to either update to the customer's market or keep the current selection. Only applies when IsCustomerMarketDefaultOnCart is enabled. |

#### Sample

```
"CartSettings": {
  "IsCustomerMarketDefaultOnCart": true,
  "IsAskForMarketWhenMismatch": true
}
```

### Validation settings

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsCartValidatedManually | bool | false | When enabled, cart validation is triggered only when the user clicks the validation button manually. When disabled (default), validation runs automatically when the cart is saved. Use manual validation for performance optimization on complex carts or when validation involves expensive external calls. |

#### Sample

```
"CartSettings": {
  "IsCartValidatedManually": true
}
```

### UI and display settings

These settings control how cart information is displayed in the Omnium user interface.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| UseCartCreationModal | bool | false | When enabled, a modal dialog is shown when creating a new shopping cart, allowing the user to select market, store, and order type upfront. When disabled, carts are created with defaults and these values can be set afterward. |
| IsUseUnitsInCart | bool | false | When enabled and a product has multiple units of measure configured, users can select a different unit of measure in the cart. Useful for B2B scenarios where products may be sold in different package sizes (e.g., "each", "box of 12", "pallet"). |
| IsWarehouseHiddenInShipmentSelector | bool | false | When enabled, the warehouse selection is hidden in the shipping selector. Use this when warehouse allocation is determined later in the order process (e.g., by an ERP system or warehouse management system), making the warehouse selection irrelevant at cart stage. |
| ShowRecalculatePricesOnStoreSelected | bool | false | When enabled, the user is prompted to confirm whether prices should be recalculated when the store is changed in the cart. This is useful when different stores may have different pricing, and you want to give users control over when prices are updated. |

#### Sample

```
"CartSettings": {
  "UseCartCreationModal": true,
  "IsUseUnitsInCart": true,
  "IsWarehouseHiddenInShipmentSelector": true,
  "ShowRecalculatePricesOnStoreSelected": true
}
```

### Comment templates

Cart comment templates allow you to define predefined comment texts that can be quickly selected when adding comments to carts.

| Property | Type | Description |
| --- | --- | --- |
| CommentTemplates | List<CommentTemplate> | List of predefined comment templates |

Each comment template has the following structure:

| Property | Type | Description |
| --- | --- | --- |
| TemplateName | string | Display name for the template |
| Properties | List<PropertyItem> | Template content and configuration |

#### Sample

```
"CartSettings": {
  "CommentTemplates": [
    {
      "TemplateName": "PriceOverride",
      "Properties": [
        { "Name": "Subject", "Value": "Price adjustment" },
        { "Name": "Body", "Value": "Price has been adjusted per customer agreement." }
      ]
    },
    {
      "TemplateName": "SpecialHandling",
      "Properties": [
        { "Name": "Subject", "Value": "Special handling required" },
        { "Name": "Body", "Value": "This order requires special handling. Please see instructions." }
      ]
    }
  ]
}
```

### Complete cart settings example

```json
{
  "CartSettings": {
    "IsOrderNumbersUsedAsCartNumber": true,
    "IsCartVersionEnabled": true,
    "IsMetaDataDeletedWhenCreatingCartFromOrder": false,
    "IsCustomerMarketDefaultOnCart": true,
    "IsAskForMarketWhenMismatch": true,
    "MaximumNumberOfOrderLines": 100,
    "MaximumNumberOfItems": 0,
    "IsCartValidatedManually": false,
    "IsUseUnitsInCart": false,
    "IsWarehouseHiddenInShipmentSelector": false,
    "ShowRecalculatePricesOnStoreSelected": true,
    "UseCartCreationModal": true,
    "CommentTemplates": [
      {
        "TemplateName": "PriceOverride",
        "Properties": [
          { "Name": "Subject", "Value": "Price adjustment" },
          { "Name": "Body", "Value": "Price has been adjusted per customer agreement." }
        ]
      }
    ]
  }
}
```

* * *

## Cart validators

Cart validators check that a cart is valid — for example that items are in stock, prices are set, and payments match the total. Validation errors and warnings are surfaced in the Omnium UI and returned by the cart `Validate` API. Omnium runs all configured `IValidator` connectors whenever a cart is validated.

Omnium provides [built-in validators](cart-config.md#built-in-validators), and the [Webhook Validator](validation/cart-validators/webhook-validator.md) lets you run custom validation in your own system by posting the cart to an HTTP endpoint you host.

## Validator configuration

### Adding a validator

To add a new validator (either built-in or webhook), navigate to **Connections** in settings.

#### Required properties

| Property | Sample Value | Description |
| --- | --- | --- |
| Name | `webhookValidator` | Connector name. Must match a registered validator key — it is **not** free-form. For the Webhook Validator it must be `webhookValidator`; for built-in validators use their connector ID (e.g. `inventoryValidator`). |
| Host | `https://acme.com` | For the Webhook Validator, the endpoint Omnium posts the cart to. Not used by built-in validators. |
| Implementations | `["IValidator"]` | Connector capabilities. For validators this must include `IValidator`. |

The connector `name` must be a registered validator key. An unrecognized name — for example `Webhook`, or a made-up name like `customBusinessRulesValidator` — makes cart validation throw while building the validator list, which blocks validation for the entire cart. For the Webhook Validator the name must be `webhookValidator`.

#### Sample configuration

```json
{
    "connectors": [
        {
            "name": "activeProductsValidator",
            "isAuthenticatedManually": false,
            "timeOut": "00:00:00",
            "implementations": [
                "IValidator"
            ],
            "disableStandardErrorPolicy": false
        },
        {
            "name": "webhookValidator",
            "host": "https://acme.com/api/ValidatorEndpoint",
            "isAuthenticatedManually": false,
            "timeOut": "00:00:00",
            "implementations": [
                "IValidator"
            ],
            "disableStandardErrorPolicy": false
        }
    ]
}
```

## Validation service

The validation service is triggered by the cart service in Omnium. It runs in the following scenarios:

*   When the cart is modified in the GUI.
*   When the user accesses the cart in the GUI.
*   When the cart is modified via the API.

Additionally, Omnium provides a `ValidateCart` endpoint that triggers the same validation logic:

### Endpoint

[Omnium Cart Validate Endpoint](https://api.omnium.no/documentation/index.html#/Carts/CartValidate)

### Request — what your endpoint receives

When the Webhook Validator runs, Omnium sends a `POST` request to the connector's `host` with the full cart as the JSON body (camelCase property names).

### Response — what your endpoint returns

Return HTTP `200` with a validation result:

```json
{
  "isValidatedSuccessful": true,
  "validationErrors": [],
  "validationWarnings": [],
  "value": null
}
```

*   A non-empty `validationErrors` fails validation. Errors and warnings are shown in the Omnium UI; the displayed text comes from each entry's `message`.
*   To change the cart, return the updated cart in `value` and Omnium applies it back. Omit `value` (or return `{}`) to leave the cart unchanged.

For the complete request and response contract, see the [Webhook Validator](validation/cart-validators/webhook-validator.md) page.

## Built-in validators

### Validator overview

| **Name** | **Description** | **Use Case** |
| --- | --- | --- |
| **InventoryValidator** | Validates that each item in the cart has sufficient stock across the relevant warehouses. It calculates availability per SKU based on actual inventory, reserved quantities, and calculated quantities. Inventory validation is skipped for virtual products (`IsVirtual = true`). | Prevents overselling by checking stock availability across relevant warehouses before order placement. |
| **ActiveProductsValidator** | Checks that all products in the cart are active (`IsActive = true`) before allowing the cart to proceed. If any products are inactive, the validator returns a list of validation errors—one for each inactive SKU. Each error includes a message and a reference to the specific product that caused the issue. | Ensures only active, purchasable products are included in orders. |
| **InactiveCustomerValidator** | Validates whether the associated customer is marked as inactive. If the customer has `IsInactive = true`, the cart is blocked from proceeding. | Prevents checkout for inactive customers to ensure only valid, active customers can place orders. |
| **DiscountValidator** | Ensures applied discounts are valid and can be applied to the cart. | Prevents invalid or expired discounts from being applied to orders. |
| **NullPriceValidator** | Checks if any items in the order have a price of zero. | Prevents submission of carts with products that are missing price information. |
| **PaymentsValidator** | Validates that the total amount paid matches the order total. Fails if there are no payments, or if the total paid is too low or too high. | Prevents submission of carts with missing, insufficient, or excessive payments. |
| **CreditLimitValidator** | Validates that the customer's credit is sufficient to cover the cart total for credit-based payments. Includes checks for credit denial, remaining credit, and credit limit. | Prevents orders from being placed if the customer lacks sufficient credit or is not allowed to purchase on credit. |
| **PromotionCouponValidator** | Validates that all promotion coupon codes in the cart are valid. Invalid codes are removed and trigger a validation error. | Prevents the use of expired or invalid coupon codes by validating them and removing any that fail. |
| **InventoryAtpValidator** | Ensures fulfillment based on current and future inventory levels using Available-to-Promise (ATP) calculations. | Validates orders against projected inventory availability for future delivery dates. |
| **RequiredFieldsValidator** | Validates that all required fields are present in the order. The fields to check are defined in tenant settings and optionally filtered by order type. | Prevents submission of incomplete carts by ensuring that configured fields are not empty or missing. |
| **SalesLimitationValidator** | Checks for sales limitations on specific products, such as maximum quantities per customer or restricted product categories. | Enforces sales policies and product purchase limits. |
| **ShipmentValidator** | Ensures that at least one shipment is selected in the cart before submission. It checks whether the cart's order form contains any shipments, and returns a validation error if none are found. | Prevents carts from being submitted without a selected delivery method by ensuring that a shipment is present. |
| **PriCatIdValidator** | Validates that the cart has a Pricat ID and that all products in the cart share consistent Pricat IDs. If the cart is a pre-order and missing a Pricat ID, it adds a blank value and returns a warning. It also checks if product Pricat IDs match the cart's, and fails if mismatched or inconsistent. | Ensures product catalog consistency for pre-order and wholesale scenarios. |

Each validator provides tailored validation logic to meet specific business requirements. Custom validators can also be implemented for additional flexibility.

* * *

## Validator setup examples

### RequiredFieldsValidator

The following provides an example of how to set up the `RequiredFieldsValidator`. This validator ensures that carts with `OrderType = Online` have the field `CustomerReference` set. The validator supports both built-in properties on the cart object and custom properties.

```json
{
    "name": "requiredFieldsValidator",
    "isAuthenticatedManually": false,
    "timeOut": "00:00:00",
    "implementations": [
        "IValidator"
    ],
    "properties": [
        {
            "key": "OrderType",
            "value": "Online"
        },
        {
            "key": "Field",
            "value": "CustomerReference"
        }
    ],
    "disableStandardErrorPolicy": false,
    "enabledForMarkets": [],
    "disabledForMarkets": []
}
```

### InventoryValidator

The inventory validator checks stock availability across warehouses. No additional configuration properties are required beyond the standard connector setup.

```json
{
    "name": "inventoryValidator",
    "isAuthenticatedManually": false,
    "timeOut": "00:00:00",
    "implementations": [
        "IValidator"
    ],
    "disableStandardErrorPolicy": false
}
```

### Webhook Validator

To run custom validation logic in your own system, configure the **Webhook Validator**. It posts the cart to an HTTP endpoint you host and applies the validation result it returns. The connector `name` must be exactly `webhookValidator`.

```json
{
    "name": "webhookValidator",
    "host": "https://your-api.com/api/validate-cart",
    "bearerToken": "YOUR_API_KEY",
    "isAuthenticatedManually": false,
    "timeOut": "00:00:30",
    "implementations": [
        "IValidator"
    ],
    "disableStandardErrorPolicy": false
}
```

Your endpoint receives the complete cart as a `POST` body and returns a validation result — `isValidatedSuccessful`, `validationErrors`, `validationWarnings`, and an optional modified cart in `value`. For the full request and response contract, configuration properties, and authentication options, see the dedicated [Webhook Validator](validation/cart-validators/webhook-validator.md) page.
