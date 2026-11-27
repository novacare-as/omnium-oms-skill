# Dintero Discounts (Deal Engine)

Source: https://docs.omnium.no/docs/plugins/Payments/dintero-discounts

> Get the best price for a cart from Dintero Discounts (Deal Engine) and send the final sale and return receipts to Deal Engine

## Overview

Dintero Discounts, also called Deal Engine, calculates customer-specific discounts and deals (for example mix-and-match, fixed prices, member and employee discounts) on a receipt. Omnium can send a cart to Deal Engine to get the best price, keep the result on the cart and the order, and send the final receipt of each sale and each return to Deal Engine so it counts the use of its discounts.

The integration has three parts:

| Part | What it does | Where it runs |
| --- | --- | --- |
| Cart discounts | Sends the cart to Deal Engine and puts the discounts on the cart lines | Cart validator `dinteroDiscountValidator` |
| Sale receipt | Sends the sold lines of a shipment (or of the whole order) to Deal Engine | Export order step in the order workflow, connector `dinteroReceiptExporter` |
| Return receipt | Sends a negative receipt for the returned units | Export order step in the return workflow, connector `dinteroReceiptExporter` |

Omnium remains the source of the final prices. After the calculation, the cart and the order carry the Deal Engine price, and other systems (web shop, payment, ERP) read the price from Omnium.

## Prerequisites

*   A Dintero payment type in the market. See [Dintero](dintero.md) for the payment type setup.
*   **Calculate prices on carts and orders** turned on in the product settings. The Deal Engine result is applied as a line discount, and Omnium only calculates line discounts when price calculation is on. Without it, the validator returns an error and does not call Deal Engine.
*   A store on the cart, unless you use a fixed Deal Engine store id. Deal Engine identifies the sale by its store.

## Configure the Dintero payment type

Open the Dintero payment type under **Configuration → Settings → Payment → Payment Types** and turn on **Enable Dintero Discounts**. The Deal Engine fields are shown when the switch is on.

| Setting | Key | Description |
| --- | --- | --- |
| **Enable Dintero Discounts** | `DealEngineEnabled` | Turns the integration on. When off, Omnium never calls Deal Engine, carts keep the Omnium prices, and no receipts are sent. Use it to stop all Deal Engine calls at once, for example during a traffic spike. |
| **Deal Engine store id** | `DealEngineStoreId` | Optional. Every cart and receipt is sent as this store, for example the web shop. When empty, the store of the cart or order is sent. |
| **Deal Engine store id prefix** | `DealEngineStoreIdPrefix` | Optional. Put in front of the store of the cart when Deal Engine knows the stores by another id. With the prefix `EP`, store `057` is sent as `EP057`. Hidden when a fixed store id is set. |
| **Deal Engine gateway URL** | `DealEngineBaseUrl` | Optional. Set it when Deal Engine is reached through an API gateway signed with AWS Signature Version 4. When empty, Omnium calls D intero directly. |
| **AWS region** | `DealEngineAwsRegion` | The AWS region of the gateway, for example `eu-west-1`. Required with a gateway URL. |
| **AWS service name** | `DealEngineAwsService` | The AWS service the gateway signs for. When empty, `execute-api` (API Gateway) is used. |
| **AWS access key** | `DealEngineAwsAccessKey` | The access key for the gateway. Required with a gateway URL. |
| **AWS secret key** | `DealEngineAwsSecretKey` | The secret key for the gateway. Required with a gateway URL. |

The AWS fields are shown when a gateway URL is set. Values are trimmed, so a space pasted around a value is ignored.

### Calling Dintero directly or through a gateway

| Mode | Discount calculation | Receipts | Authentication |
| --- | --- | --- | --- |
| Direct (no gateway URL) | `POST https://api.dintero.com/v1/accounts/{accountId}/discounts/available_for_receipt` | `POST https://api.dintero.com/v1/accounts/{accountId}/receipts` | The Account ID, Client ID and Client secret of the Dintero payment type. The Dintero client needs access to Dintero Discounts. |
| Gateway | `POST {gateway URL}/available-for-receipt` | `POST {gateway URL}/receipt` | AWS Signature Version 4 with the AWS settings above |

The request body is the same Dintero receipt in both modes. A call that takes longer than 10 seconds fails, so a slow Deal Engine never holds the web shop.

## Calculate the best price for a cart

### Enable the validator

Add the cart validator as a connector under **Configuration → Settings → Integrations → Connectors**:

```json
{
  "name": "dinteroDiscountValidator",
  "implementations": ["IValidator"]
}
```

See [Cart validation](../../Carts/validation.md) for how validators run.

### Ask for the best price with DealEngineMode

The validator only calls Deal Engine when the web shop asks for it, through the cart property `DealEngineMode`. Set the property on the cart, then [validate the cart](../../Carts/cart-api.md#validate-cart). With [Save complete cart](../../Carts/cart-api.md#save-complete-cart), send the full cart with the property added, as the endpoint replaces the cart. To run only this validator, send `"validators": ["dinteroDiscountValidator"]` in the validate request.

| Value | Behavior |
| --- | --- |
| `Activate` | Calls Deal Engine only when the cart changed since the last answer. An unchanged cart keeps its Deal Engine discounts without a call. |
| `Checkout` | Always calls Deal Engine. Use it when the customer goes to checkout, so the price is calculated with the current Deal Engine rules. |
| `None` or missing | The validator does nothing. |

The validator sets `DealEngineMode` to `None` in the same save, so a later cart change or validation never calls Deal Engine by itself. The web shop sets the mode again when it wants a new price.

Excerpt of the cart with the property:

```json
{
  "id": "C1048213",
  "marketId": "NOR",
  "storeId": "057",
  "customerId": "4f2a9c1e-7b3d-4e8a-9f10-2c5d6e7f8a90",
  "properties": [
    { "key": "DealEngineMode", "value": "Checkout" }
  ]
}
```

### When the cart counts as changed

After each successful answer, Omnium stores a fingerprint of the cart in the cart property `DealEngineHash`. With `Activate`, Deal Engine is called again only when the fingerprint is different. The fingerprint covers:

*   Market, customer, customer type and store
*   Discount codes
*   Each line: SKU, quantity and price
*   The shipping cost of each shipment

A change to an Omnium campaign, or to the rules in Deal Engine, does not change the fingerprint. Use `Checkout` before payment so the customer always pays the current best price.

### What Omnium sends

Omnium resets the cart to the Omnium prices and campaigns, then sends it to Deal Engine as a receipt with `entry_status` `None`:

| Receipt field | Source |
| --- | --- |
| `store.id` | The fixed store id, or the store of the cart with the prefix in front. An empty store when the cart has none. |
| `customer_id` | The customer id of the cart. Left out for a guest cart. |
| `customer` | Always sent: `type` is `company` for a B2B customer and `customer` otherwise, with `pays_tax` `true`. |
| `discount_code` | The discount codes on the cart. Left out when the cart has none. |
| `items` | One item per cart line, in the order of the lines, with `line_id` starting at 1. `gross_amount` is the Omnium price times the quantity. |
| `items[].discount_lines` | The Omnium discounts on the line: campaigns as `periodic`, manual discounts as `manual`, and the line's share of order discounts as `periodic`. |
| `items[].groups` | The main category of the product, as the item group. |
| `items[].eligible_for_discount` | `false` for a line that is excluded from promotions or blocked for discounts. |
| Shipping | One item per shipment with a shipping cost, after the product lines. |

All amounts are in the smallest currency unit (øre).

### How the result is applied

For each cart line that Deal Engine gives an `external` discount, Omnium adds one manual line discount that replaces the other line discounts:

| Discount field | Value |
| --- | --- |
| `discountId` | `dintero-{lineItemId}` |
| `discountName` | The receipt texts of the Deal Engine discounts on the line, separated by commas, or `Dintero` when none has a receipt text |
| `discountCode` | The Deal Engine discount ids, separated by commas |
| `discountAmount` | The sum of all discount lines Deal Engine returned for the line: the Omnium campaigns Deal Engine kept and its own discounts. The line's share of an Omnium order discount is left out, as Omnium applies it on top. |

Omnium uses the Deal Engine answer as it is, including discounts that stack. The Omnium price and campaigns stay on the line: when the Dintero discount is removed, the line gets the Omnium price again.

Each line with a Dintero discount also gets the property `DealEngineDiscountLines`, a JSON array of the discount lines the discount amount is the sum of. A Deal Engine (`external`) line carries the receipt text of its discount as description. The receipts after the sale use it to send each discount on its own line.

Discounts with an id starting with `dintero-` belong to this integration. Omnium removes and replaces them on every Deal Engine call, so do not create discounts with that prefix yourself.

### Errors

The validator returns a failed validation with one of these messages:

| Condition | Message |
| --- | --- |
| Price calculation is off | Dintero discounts need price management to be enabled in the product settings. |
| No Dintero payment type for the market | No Dintero payment settings were found for the market of the cart. |
| Deal Engine answers with an error or does not answer in time, or the payment type is missing a setting the call needs (the Account ID, or an AWS setting with a gateway URL) | Could not get the discounts from Dintero: {reason} |

In the last two cases the Dintero discounts are removed first, so the cart has the Omnium prices. When price calculation is off, the cart is left as it is.

When **Enable Dintero Discounts** is off and the web shop asks for a price (`Activate` or `Checkout`), the validator removes any Dintero discounts and returns no error.

## Send the sale receipt

Deal Engine counts the use of its discounts (for example a limit per customer) from the final receipts. The connector `dinteroReceiptExporter` sends them.

### Set up the connector

Add the connector under **Configuration → Settings → Integrations → Connectors**. The Export order step finds it by its name: when no connector with that name is available for the market of the order, the step reports "Order exporter not found" (in the return workflow: "Return exporter not found").

```json
{
  "name": "dinteroReceiptExporter",
  "connectorId": "dinteroReceiptExporter",
  "implementations": ["IOrderExporter", "IReturnExporter"],
  "properties": [
    { "key": "ExportReceiptsForFullOrders", "value": "false" }
  ]
}
```

| Property | Description |
| --- | --- |
| `ExportReceiptsForFullOrders` | `false` (default): one receipt for each exported shipment, with `receipt_id` `{orderNumber}-{shipmentId}`. `true`: one receipt for the whole order, sent when every shipment is delivered or cancelled, with the order number as `receipt_id`. The property is read from the connector with the `connectorId`, so set a `connectorId` for it to take effect. |

An order without an order number uses the order id in `receipt_id`. An export that runs without a shipment (for example a manual export of the order) also sends one receipt for the whole order, when every shipment is delivered or cancelled.

See [Connectors](../../Integrations/connectors.md) for connector settings in general.

### Add the step to the order workflow

Add an [Export order](../../Order/workflow-steps/export/export-order.md) step with the connector `dinteroReceiptExporter` to the order status where the sale is done, for example the shipped status after the shipment is completed and the payment captured. The step marks the shipment when its receipt is sent, see below.

### What the sale receipt contains

*   Only the sold units of each line (quantity minus cancelled quantity). A line with all units cancelled is left out.
*   Each discount on its own discount line: the discount lines kept in `DealEngineDiscountLines` (Omnium campaigns as `periodic`, Deal Engine discounts as `external` with their receipt text), scaled to the units sold.
*   The shipping of the shipments in the receipt.
*   `entry_status` `Concluded`, and `purchase_at` and `transaction_date` set to the time of the export.

### Sent once, and visible on the order

*   Dintero can accept the same receipt twice, so each sent shipment gets the property `IsExportedToDealEngine` with the value `true`, and it is never sent again. A rerun of the workflow step sends nothing.
*   The receipt JSON is put on the order event log before it is sent, so the order shows what Deal Engine got, also when the send fails.
*   A failed send leaves the shipment unmarked and adds the error `DealEngineReceiptError` to the order. The next run of the step sends it again.
*   Nothing is sent when **Enable Dintero Discounts** is off.

## Send the return receipt

When a return is registered, the same connector sends a negative receipt so Deal Engine counts the returned units back.

### Add the step to the return workflow

Return workflow steps are configured per return status under **Configuration → Settings → Orders → Return settings**, on the **Return statuses** tab. Add an [Export order](../../Order/Returns/return-workflow-steps/export/export-order.md) step with the connector `dinteroReceiptExporter` to the status where the return is done, for example `Completed`, after the credit steps. Do not turn on **Run after order is saved** for this step: the return is not saved again after those steps, so the marker that prevents a second receipt would be lost.

A tenant with no return statuses of its own uses a built-in `Completed` status, which is not shown in the list. As soon as you add a return status, the built-in one is no longer used. Add the built-in steps again together with the export step, or returns are no longer credited: EnsureRma, CreditReturn, UpdateInventory, UpdateCustomerClub, CreateCreditNote, UpdateOrderStatus and Notification. Turn on **Is default** for `Completed` so new returns start in it.

### What the return receipt contains

*   One receipt for each return, with the return id as `receipt_id` and the order id as `transaction_id`.
*   Only the returned units of lines that were in a sent sale receipt (a shipment with `IsExportedToDealEngine`). Deal Engine never counted other lines (sold before the integration was turned on, or with it switched off), so they are left out. A credit without returned lines sends nothing.
*   Each item is the sale item of the order line for the returned units with the opposite sign: negative `quantity`, `gross_amount`, `net_amount` and discount line amounts, so Deal Engine gets back what it counted for those units.
*   `is_return_item` `true` and `eligible_for_discount` `false` on each item, `entry_status` `Concluded`, and no shipping.

Example (abbreviated: the receipt also has `purchase_at`, `transaction_date`, `amount_due`, the `*_dwh` amounts and the discount ids): 1 of 7 units returned from a line sold for 92.40 NOK after 223.30 NOK fixed-price discount and 12.60 NOK employee discount.

```json
{
  "store": { "id": "EP057" },
  "receipt_id": "80005",
  "transaction_id": "900055",
  "currency": "NOK",
  "items": [
    {
      "id": "102069",
      "line_id": 1,
      "quantity": -1,
      "description": "Toilet paper 6-pack",
      "gross_amount": -4690,
      "net_amount": -1320,
      "eligible_for_discount": false,
      "is_return_item": true,
      "discount_lines": [
        { "line_id": 0, "amount": -3190, "discount_type": "external", "description": "Fixed price" },
        { "line_id": 1, "amount": -180, "discount_type": "external", "description": "Employee discount 12%" }
      ]
    }
  ],
  "gross_amount": -4690,
  "net_amount": -1320,
  "no_of_items": -1,
  "entry_status": "Concluded",
  "customer": { "type": "customer", "pays_tax": true }
}
```

### Sent once, and visible on the order

*   The return gets the property `IsExportedToDealEngine` with the value `true` when its receipt is sent, and it is never sent again.
*   The receipt JSON is put on the order event log before it is sent.
*   A failed send leaves the return unmarked and adds the error `DealEngineReturnReceiptError` to the order. It has its own key, so a sent return never clears the error of a failed sale receipt.

## Related

*   [Dintero](dintero.md)
*   [Cart API](../../Carts/cart-api.md)
*   [Cart validation](../../Carts/validation.md)
*   [Connectors](../../Integrations/connectors.md)
