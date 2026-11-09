# OmniumInvoice

Invoices

**Fields:**

- `id`: string, nullable — Invoice ID
- `url`: string, nullable — Invoice URL (invoice PDF or other external url)
- `invoiceNumber`: string, nullable — Invoice number
- `invoiceType`: string, nullable — Invoice type [Ingoing, Outgoing, Receipt]. A Receipt is the paid sales document Omnium issues for one shipment.
- `invoiceDate`: string (date-time) — Invoice date
- `customerId`: string, nullable — Customer ID
- `customerName`: string, nullable — Customer name
- `customerEmail`: string, nullable — Customer email
- `customerType`: string, nullable — Customer type (Business / Private)
- `invoiceDueDate`: string (date-time) — Invoice due date
- `kid`: string, nullable — Invoice KID-number (Norwegian customer identification number)
- `comment`: string, nullable — Invoice comment
- `orderId`: string, nullable — Original order Id
- `shipmentId`: string, nullable — The shipment of the order this invoice documents, when it covers one shipment only. A receipt always has one.
- `projectId`: string, nullable — Id of related project
- `deliveryDate`: string (date-time) — Deliver date
- `amount`: number (decimal) — In the order currency, typically USD, SEK, NOK.
- `amountExcludingTax`: number (decimal) — Amount excluding tax
- `amountRoundoff`: number (decimal) — Amount of round off to nearest integer
- `amountOutstanding`: number (decimal) — The amount outstanding
- `currency`: string, nullable — Invoice currency
- `isCreditNote`: boolean — True if invoice is a credit note
- `creditedInvoiceIds`: List<string>, nullable — For a credit note: the ids of the invoices and receipts it reverses
- `origin`: string, nullable — Where the invoice originated (Which system provided the ID)
- `storeId`: string, nullable — Invoice store ID
- `marketId`: string, nullable — Invoice market ID
- `modified`: string (date-time) — Modified date
- `created`: string (date-time) — Created date
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — External IDs
- `paymentMethodName`: string, nullable, **deprecated** — Payment method
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `assets`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — Assets
- `lineItems`: List<[`OmniumOrderLine`](OmniumOrderLine.md)>, nullable, max length 1000 — Invoiced order lines
- `payments`: List<[`OmniumPayment`](OmniumPayment.md)>, nullable, max length 250 — All order payments
- `invoiceSenderAddress`: [`OmniumOrderAddress`](OmniumOrderAddress.md)
- `customerAddress`: [`OmniumOrderAddress`](OmniumOrderAddress.md)
- `deliveryAddress`: [`OmniumOrderAddress`](OmniumOrderAddress.md)

**Used directly by endpoints in:**

- [Invoices](../endpoints/invoices.md)
