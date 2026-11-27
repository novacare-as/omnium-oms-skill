# Create Receipts

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/create-receipts

> Issue the paid receipts for an order, with the delivered lines and the payments that paid for them, for the customer to see in the webshop.

## Overview

The **Create Receipts** step issues the receipts for an order paid through a payment provider, such as Klarna, Vipps or Adyen. A receipt is the paid sales document for what was delivered: it lists the delivered order lines, the shipping cost, the VAT per rate and the payments that paid for them. Each delivered shipment gets its own receipt, so an order with three shipments gets three receipts.

Omnium stores a receipt as an invoice with the invoice type `Receipt`. Your webshop or customer portal reads the receipts of an order and downloads each one as a PDF through the [Invoices API](../../invoices-api.md).

The step issues the receipt when the goods are delivered, not when the payment is captured. Place it after [Capture Payments](capture-payments.md) in the status where the shipment is shipped or picked up. The **Fulfill - Complete shipment and capture payment** workflow group template includes the step after Capture Payments.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReceipts` |
| **Group** | Payments |
| **Applicable Statuses** | Ship, PickedUp, Completed |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ErrorTag` | String | No | \- | A tag added to the order when a receipt cannot be issued. |
| `ExcludedPaymentMethods` | String | No | \- | Payment methods whose sales document another system issues, such as an ERP or a marketplace, separated by commas. Nothing paid with one of them gets a receipt. Use the payment method names on the orders. Case does not matter. |

## Behavior

### What It Does

1.  Selects the shipments to issue receipts for:

    *   At shipment level: the shipment the workflow runs for
    *   At order level: every shipment of the order that is not cancelled. The step does not check whether a shipment has shipped, so at order level, run it only in a status where every shipment is delivered.
2.  Skips a shipment that:

    *   Was paid at the POS and already has a POS receipt
    *   Already has a receipt, or an invoice for that shipment, such as one from the [Create Invoice](create-invoice.md) step
    *   Has no delivered lines and a total of 0
    *   Was paid with the store's own invoice, the `OmniumInvoice` payment method, as that invoice is its sales document
    *   Was paid with a payment method in `ExcludedPaymentMethods`

    For the last two, a payment counts when it was taken for the shipment or belongs to no shipment. A payment that failed or was voided does not count, so a customer who gave up on a method and paid with another one still gets a receipt.

3.  Works out which payments paid the shipment:

    *   The payments captured for the shipment
    *   A share of the payments that belong to no shipment, such as a gift card or bonus used at checkout or a payment captured at checkout, less what earlier receipts on the order already used
    *   Invoiced payments do not count, because the customer has not paid them yet
4.  Issues no receipt for a shipment that is not fully paid, and adds an order error instead

5.  Issues the receipt with a number from the receipt number series, and records its ID on the shipment

### What the Receipt Contains

| Content | Value |
| --- | --- |
| Invoice type | `Receipt` |
| Order and shipment | The order ID and the shipment ID |
| Order lines | The delivered lines of the shipment, with the quantity less any cancelled units |
| Amounts | The shipment total, the amount excluding VAT, the VAT, and the shipping cost with its VAT rate |
| Payments | One entry per payment that paid the shipment. Together they equal the shipment total. |
| Delivery date | The date the shipment was completed, or the issue date when the shipment has no completed date |
| Paid state | The outstanding amount is 0 and the due date is the invoice date. A receipt has no KID and no bank account. |
| Paid line | Names the payment methods that paid the shipment, for example **Paid with Klarna**. Each method is shown by the display name of its payment type, or by its method name when it has no display name. |
| Buyer | The billing address, including the organization number for a business customer |
| Seller | The store name, address and organization number, and the store's or market's document footer, as they were when the receipt was issued |

The receipt PDF has the title **RECEIPT**, translated to the market language (**KVITTERING** in Norwegian). It shows a paid line that names the payment methods instead of the due date, KID and bank account, the delivery date and the shipment, the payments, a VAT rate column on the lines, and a VAT summary per rate. To change the layout, choose an [invoice template](../../../Markets/markets-config.md#invoice-template) for the market.

Put the seller details that a sales document must show, such as the legal company name and organization number, in the store's or market's document footer. A receipt keeps the footer it was issued with, so a later change to the footer does not change receipts that already exist. A receipt issued while no footer was set shows the current store or market footer.

### Orders Paid with a Provider's Invoice

A shipment paid with a payment provider's invoice or part payment, such as Klarna's, gets a receipt when the provider captures the payment. The provider settles the order with the store, and the customer pays the provider later. The paid line names the provider, so the customer can see that the provider's invoice is for the same purchase.

A shipment paid with the store's own invoice gets no receipt. Use [Create Invoice](create-invoice.md) for those orders.

### Emailing the Receipt

The step does not send an email itself. To email the receipt, select the **Receipts** attachment on the order notification the customer gets when the goods are sent or picked up. The email then carries the receipt PDF of the shipment it is about, or of every shipment that has a receipt when the email is for the whole order. An email for a shipment without a receipt has no receipt attached.

The order notification builds its email when the **Notification** step runs, so place Create Receipts before Notification in the same status. When the receipt is attached, turn off the **Copy of receipt** attachment on the same notification. That attachment is a printout of the whole order, not the numbered receipt.

### Receipt Number Series

The step takes the receipt number from the `ReceiptNumberOptions` number series of the order's market or tenant. Without a receipt series it uses the `InvoiceNumberOptions` series. A receipt must have a number from a series, so the step issues no receipt when neither series is configured with a service other than `GuidNumberService`. See [Number Options](../../../configuration/numberoptions.md).

### Prerequisites

*   The tenant has access to Invoices
*   A `ReceiptNumberOptions` or `InvoiceNumberOptions` number series is configured with a service other than `GuidNumberService`
*   The payments are captured, usually by Capture Payments earlier in the same status

### Side Effects

*   Creates one invoice of the type `Receipt` per issued shipment
*   Sets the external ID `OmniumReceiptId` on the shipment to the receipt ID
*   Logs an invoice event for each receipt, which event subscriptions can deliver as a webhook
*   Adds the order error **Receipt not issued** when a shipment could not get a receipt, and removes it on a later run in which no shipment fails or is left not fully paid

## Business Cases

### When to Use

*   **Receipts in the webshop**: Show the customer a paid sales document for each delivery
*   **Orders paid through a payment provider**: The provider handles the payment, and Omnium issues the sales document
*   **Split deliveries**: Give each shipment its own receipt with only the lines it delivered

### Example Scenarios

**Scenario 1: Klarna order in two shipments** The first shipment ships and Capture Payments captures 1,499.00 for it. The step issues receipt K-10234 for that shipment. The second shipment ships a week later and gets receipt K-10235.

**Scenario 2: Gift card used at checkout** The customer pays 300.00 with a gift card and the rest with Klarna. The first shipment of 200.00 takes 200.00 of the gift card. The second shipment of 500.00 takes the remaining 100.00 of the gift card and 400.00 captured from Klarna.

**Scenario 3: Marketplace orders** The store sells on a marketplace that issues the sales documents for the store, and the orders carry the payment method `Zalando`. With `ExcludedPaymentMethods` set to `Zalando`, those shipments get no receipt and the order gets no error, while webshop orders get their receipts as before.

**Scenario 4: Shipment not fully paid** The capture for a shipment failed, so the payments do not cover the shipment total. The step issues no receipt, adds the order error and tags the order with the `ErrorTag` value. When the shipment is paid, the step issues the receipt the next time it runs for the shipment.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (no receipt issued) | Yes |
| Receipt issued | Success | Yes |
| Shipment paid with the store's own invoice or an excluded payment method | Success (no receipt issued) | Yes |
| No shipment got a receipt: each one already has a receipt or an invoice, has a POS receipt, or has nothing delivered | Warning | Yes |
| Shipment is not fully paid | Warning, order error added | Yes |
| Tenant has no access to Invoices | Warning | Yes |
| No receipt or invoice number series configured | Error, order error added | Yes |
| Receipt could not be saved | Error, order error added | Yes |

An error does not stop the workflow, because the goods are delivered whether or not the receipt could be issued.

## Related Steps

*   [Capture Payments](capture-payments.md) - Captures the payments the receipt lists
*   [Create Invoice](create-invoice.md) - Creates an invoice the customer pays later
*   [Create Credit Note](../../Returns/return-workflow-steps/payment/create-credit-note.md) - Credits the receipts that hold returned lines
