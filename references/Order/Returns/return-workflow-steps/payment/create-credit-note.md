# Create Credit Note

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/payment/create-credit-note

> Issue a credit note for a return, the return receipt that reverses the returned lines of a receipt or invoice, and email it to the customer.

## Overview

The **Create Credit Note** step issues a credit note when a return is processed. A credit note is the return receipt, or refund document, for a return: it lists the returned lines and the amounts that are paid back, as negative amounts. When the order has receipts, the credit note names the receipts it credits.

Omnium stores a credit note as an invoice with `isCreditNote` set to true. Your webshop or customer portal reads the credit notes of an order and downloads each one as a PDF through the [Invoices API](../../../invoices-api.md), the same way as receipts.

The step runs in the return workflow, not in the order workflow. Add it to the return status the return gets when it is processed, usually **Completed**.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateCreditNote` |
| **Group** | Payments |

## Configuration Properties

This step has no configurable properties. The credit note number comes from the number series of the market or tenant, see [Credit note number series](create-credit-note.md#credit-note-number-series).

## Behavior

### Set Up Credit Notes for Returns

1.  Add **Create credit note** to the return status the return gets when it is processed, in **Configuration → Settings → Orders → Return settings**, on the **Return statuses** tab. If your tenant has no return statuses of its own, the default **Completed** status already has the step. See [Return Workflow Steps](../../return-workflow-steps.md).
2.  Configure a `CreditNoteNumberOptions` number series for the market or tenant. The UI calls it **Credit note number**.
3.  To email the credit note, select the **Credit notes** attachment on the return notification, see [Emailing the credit note](create-credit-note.md#emailing-the-credit-note).

The step applies to returns that are processed after you add it. A return that was processed earlier gets no credit note.

### What It Does

1.  Takes the credit note number from the credit note number series
2.  Issues the credit note with the returned lines and the amounts of the return
3.  Lists the receipts that hold the returned lines in `creditedInvoiceIds`, the oldest receipt first. Invoices of the order are not listed.
4.  Records the credit note ID on the return in the external ID `OmniumCreditNoteId`
5.  Sends the credit note with the **Invoice email** notification, when the tenant has one that applies to the order

The step does not check whether the return already has a credit note. A return that runs the step two times gets two credit notes, and the return keeps the ID of the last one. Add the step to one return status only.

### What the Credit Note Contains

| Content | Value |
| --- | --- |
| Order lines | The returned lines, with their prices as negative amounts |
| Amounts | The return total, the amount excluding VAT and the VAT, as negative amounts |
| Shipping cost | The returned shipping cost, as a negative amount |
| Due date | The credit note date. A credit note settles against the document it corrects, so it has no payment terms. |
| Credited receipts | The receipts that hold the returned lines, printed on the PDF as the documents the credit note credits |
| Buyer | The billing address of the order and the delivery address of its first shipment |
| Seller | The store name, address and organization number |

The credit note PDF has the title **COPY OF CREDIT NOTE**, translated to the market language (**KOPI AV KREDITNOTA** in Norwegian). When `IsInvoiceOriginal` is on in the [order settings](../../../order-config.md), the title is **CREDIT NOTE** (**KREDITNOTA** in Norwegian). To change the layout, choose an [invoice template](../../../../Markets/markets-config.md#invoice-template) for the market.

### Emailing the Credit Note

There are two ways to email a credit note to the customer. Use one of them, or the customer gets the credit note two times.

**Attach it to the return notification.** Select the **Credit notes** attachment on the return notification the customer gets when the return is processed. The email then carries the credit note PDF of the return it is about. The return notification builds its email when the **Notification** step runs, so place Create Credit Note before Notification, in the same return status or in a status the return passes through earlier. The default **Completed** status already has them in this order. Do not turn on **Run after order is saved** for Create Credit Note unless Notification has it too: the steps with it turned off run first, whatever their position in the list. An email for a return without a credit note has no credit note attached.

**Send it as an invoice email.** When the tenant has an **Invoice email** notification, the step sends the credit note PDF in its own email as soon as the credit note is issued. The step uses the first active Invoice email whose market and order type filters match the order. The same notification also sends the invoices that the [Create Invoice](../../../workflow-steps/payment/create-invoice.md) step issues, but not receipts.

### Credit Note Number Series

The step takes the credit note number from the `CreditNoteNumberOptions` number series of the order's market or tenant. Without a credit note series it uses the `InvoiceNumberOptions` series. When neither series is configured, the credit note gets a GUID as its number, so configure a series when the credit note must have a sequential number. See [Number Options](../../../../configuration/numberoptions.md).

### Prerequisites

*   The step is in the return status the return gets when it is processed
*   The return has lines

### Side Effects

*   Creates one invoice with `isCreditNote` set to true
*   Sets the external ID `OmniumCreditNoteId` on the return to the credit note ID
*   Sends the Invoice email notification, when one applies to the order

## Business Cases

### When to Use

*   **Return receipts in the webshop**: Show the customer a credit note for each return, next to the receipts of the order
*   **Refund documentation**: Give the customer and your accounting a document for the amount that is paid back
*   **VAT reporting**: Reverse the VAT of the returned lines with a numbered document

### Example Scenarios

**Scenario 1: Return of one line from a receipt** The customer got receipt K-10234 for a shipment with two lines and returns one of them for 499.00. When the return is completed, the step issues credit note KN-2041 for -499.00, and the credit note names K-10234 as the receipt it credits.

**Scenario 2: Credit note in the return confirmation** The **Completed** return status has Create Credit Note before Notification, and the return notification has the **Credit notes** attachment selected. When the return is completed, the customer gets one email that confirms the return and carries the credit note PDF.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Credit note issued | Success | Yes |
| The return or the order is missing | Warning (no credit note issued) | Yes |
| The credit note could not be numbered or saved | Error, order error added | No |
| The Invoice email could not be built or sent | Error, order error added (the credit note is already issued) | No |

An error stops the return workflow, so the steps after Create Credit Note in the same status do not run, and the return keeps its previous status. Processing the return again issues another credit note.

## Related Steps

*   [Credit Return](credit-return.md) - Pays the return amount back to the customer
*   [Notification](../notifications/notification.md) - Sends the return notification that can carry the credit note
*   [Create Receipts](../../../workflow-steps/payment/create-receipts.md) - Issues the receipts a credit note credits
*   [Export Payments](export-payments.md) - Sends payment data to external systems
