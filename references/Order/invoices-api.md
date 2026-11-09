# Invoices API

Source: https://docs.omnium.no/docs/Order/invoices-api

> Read the invoices, receipts and credit notes of an order, search them, and download them as PDF with the Omnium Invoices API.

The Invoices API gives access to the sales documents of orders and projects: invoices, receipts and credit notes. Omnium creates these documents in order and return workflow steps, and external systems such as an ERP can add their own. Use the API to show a customer the receipts of an order in your webshop, to search documents, and to download a document as a PDF.

All endpoints are available at:

```
https://api.omnium.no/api/Invoices
```

The endpoints require an API user with read access to orders. Uploading a new invoice file with `AddInvoice` requires admin access to orders.

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/Invoices` | List all invoices, paged, optionally filtered to paid or unpaid documents with `isPaid` |
| GET | `/api/Invoices/{invoiceId}` | Get one invoice |
| GET | `/api/Invoices/Orders/{orderId}` | List the invoices, receipts and credit notes of an order |
| GET | `/api/Invoices/Customers/{customerId}` | List the invoices of a customer |
| GET | `/api/Invoices/GetAsPdf/{invoiceId}` | Download an invoice, receipt or credit note as a PDF |
| POST | `/api/Invoices/Search` | Search invoices with filters, sorting and optional totals |
| PUT | `/api/Invoices/UpdateInvoice` | Add a new invoice, or replace an existing invoice |
| POST | `/api/Invoices/AddInvoice` | Upload an invoice file and create a new invoice for it, optionally linked to an order (`orderId`) or project (`projectId`). Returns 201 Created. |
| POST | `/api/Invoices/{invoiceId}/AddFileToInvoice` | Upload an invoice file and attach it to an existing invoice |
| POST | `/api/Invoices/{invoiceId}/AddAsset` | Upload a file and add it as an asset on an invoice. Pass `assetId` to update the asset with that ID, or to give the new asset that ID. |
| DELETE | `/api/Invoices/{invoiceId}` | Delete an invoice and its invoice file |

### Paging

The list endpoints (`/api/Invoices`, `/Orders/{orderId}` and `/Customers/{customerId}`) take the query parameters `page` (default 1), `pageSize` (default 20, maximum 1000) and `isPaid`. The product of `page` and `pageSize` must stay below 20000. `isPaid=false` returns only documents with an outstanding amount above 0. `isPaid=true` returns only documents with an outstanding amount of 0 or less, receipts included. Invoices from the Create Invoice step have no outstanding amount set, so `isPaid=true` returns them too. Leave `isPaid` out to get all documents.

`Search` takes `page` and `take` in the request body. Both are required and must be greater than 0.

## Invoices, receipts and credit notes

The same invoice model holds three kinds of documents:

| Document | How to recognize it | What it is |
| --- | --- | --- |
| Invoice | `isCreditNote` is false and `invoiceType` is not `Receipt` | A sales document the customer may still owe money on. Invoices from an ERP can carry `amountOutstanding`, `invoiceDueDate` and `kid`. |
| Receipt | `invoiceType` is `Receipt` and `isCreditNote` is false | The paid sales document for one delivered shipment, issued by the [Create Receipts](workflow-steps/payment/create-receipts.md) workflow step. |
| Credit note | `isCreditNote` is true | A document that reverses all or part of an invoice or receipt, issued for a return. |

### Receipts

A receipt documents one shipment of an order. An order with several shipments has one receipt per shipment, so get all of them with `GET /api/Invoices/Orders/{orderId}`, or one with a search on `shipmentId`. On a receipt:

*   `shipmentId` is the shipment it documents and `orderId` is the order
*   `lineItems` are the delivered lines of the shipment, with the delivered quantity
*   `payments` are the payments that paid the shipment, and together they equal `amount`
*   `amountOutstanding` is 0, and `invoiceDueDate` is the same as `invoiceDate`
*   `kid` is empty
*   `deliveryDate` is the date the shipment was completed, or the issue date when the shipment has no completed date
*   `origin` is `Omnium`

### Credit notes

A credit note from a return lists the receipts that hold the returned lines in `creditedInvoiceIds`. The credit note PDF prints them as the documents it credits.

## Invoice model

| Field | Type | Description |
| --- | --- | --- |
| `Id` | string | Invoice ID. For documents Omnium creates, this is the number from the number series. An invoice gets a GUID when no invoice number series is configured. |
| `InvoiceNumber` | string | Invoice number |
| `InvoiceType` | string | Document type, for example `Receipt` for a receipt |
| `InvoiceDate` | datetime | When the document was issued |
| `InvoiceDueDate` | datetime | When an invoice is due. The same as `InvoiceDate` on a receipt or credit note. |
| `DeliveryDate` | datetime | When the goods were delivered |
| `OrderId` | string | The order the document belongs to |
| `ShipmentId` | string | The shipment of the order the document covers, when it covers one shipment only. A receipt always has one. |
| `ProjectId` | string | The project the document belongs to |
| `CustomerId` | string | Customer ID |
| `CustomerName` | string | Customer name |
| `CustomerEmail` | string | Customer email |
| `CustomerType` | string | Customer type, copied from the order (for example `B2C` or `B2B`) |
| `Amount` | decimal | Total amount including VAT, in the document currency |
| `AmountExcludingTax` | decimal | Total amount excluding VAT |
| `AmountRoundoff` | decimal | Rounding to the nearest whole amount |
| `AmountOutstanding` | decimal | The amount not paid yet, as provided by the system that created the invoice. 0 on a receipt. Invoices from the Create Invoice step do not set it. |
| `Currency` | string | Document currency |
| `Kid` | string | Norwegian customer identification number (KID) for the payment |
| `IsCreditNote` | bool | True when the document is a credit note |
| `CreditedInvoiceIds` | array | For a credit note: the IDs of the invoices and receipts it reverses |
| `Origin` | string | The system that created the document, for example `Omnium` |
| `StoreId` | string | Store ID |
| `MarketId` | string | Market ID |
| `Url` | string | Link to an uploaded invoice file or another external document |
| `Comment` | string | Comment |
| `LineItems` | array | The invoiced order lines, in the order line format |
| `Payments` | array | Payments, in the order payment format. On a receipt: the payments that paid the shipment. |
| `CustomerAddress` | object | Billing address |
| `DeliveryAddress` | object | Delivery address |
| `InvoiceSenderAddress` | object | The sender's address |
| `ExternalIds` | array | References to external systems |
| `Properties` | array | Custom properties |
| `Assets` | array | Files added to the invoice |
| `Created` | datetime | When the record was created |
| `Modified` | datetime | When the record was last changed |

## Get the receipts of an order

```
GET /api/Invoices/Orders/1004812 HTTP/1.1
Host: api.omnium.no
Authorization: Bearer YOUR_API_KEY
```

```json
{
  "totalHits": 1,
  "result": [
    {
      "id": "K-10235",
      "invoiceNumber": "K-10235",
      "invoiceType": "Receipt",
      "invoiceDate": "2026-10-24T09:14:02Z",
      "invoiceDueDate": "2026-10-24T09:14:02Z",
      "deliveryDate": "2026-10-24T09:00:00Z",
      "orderId": "1004812",
      "shipmentId": "2",
      "customerId": "C123456",
      "customerName": "Kari Nordmann",
      "amount": 1298.0,
      "amountExcludingTax": 1038.4,
      "amountOutstanding": 0.0,
      "currency": "NOK",
      "isCreditNote": false,
      "origin": "Omnium",
      "storeId": "oslo-sentrum",
      "marketId": "NOR",
      "lineItems": [
        {
          "code": "JKT-FJORD-M",
          "displayName": "Regnjakke Fjord",
          "quantity": 1,
          "extendedPrice": 1199.0,
          "taxRate": 25.0
        }
      ],
      "payments": [
        {
          "paymentMethodName": "Klarna",
          "transactionType": "Capture",
          "amount": 1098.0
        },
        {
          "paymentMethodName": "GiftCard",
          "transactionType": "Sale",
          "amount": 200.0
        }
      ]
    }
  ]
}
```

## Search invoices

Send the filters in the request body. Every filter you set must match.

| Field | Type | Description |
| --- | --- | --- |
| `Page` | int | Page number. Required, greater than 0. |
| `Take` | int | Number of documents per page. Required, greater than 0. |
| `InvoiceId` | string | Documents with this ID |
| `InvoiceTypes` | array | Documents with one of these invoice types, for example `["Receipt"]` |
| `OrderId` | string | Documents of this order |
| `ShipmentId` | string | Documents of this shipment |
| `CustomerId` | string | Documents of this customer |
| `ProjectId` | string | Documents of this project |
| `Query` | string | Free text search in `Id`, `OrderId`, `ProjectId`, `CustomerName`, `CustomerId`, `InvoiceNumber`, `Kid` and the external IDs |
| `IsPaid` | bool | `false` for documents with an outstanding amount above 0, `true` for documents with an outstanding amount of 0 or less. Leave it out to get all documents. |
| `CreatedFrom` | datetime | Documents created at or after this time |
| `CreatedTo` | datetime | Documents created at or before this time |
| `Properties` | array | Documents with these property keys and values |
| `MarketIds` | array | Documents in these markets |
| `StoreIds` | array | Documents in these stores |
| `SortOrder` | string | `CreatedAscending`, `CreatedDescending`, `ModifiedAscending`, `ModifiedDescending`, `InvoiceDueDateAscending` or `InvoiceDueDateDescending` |
| `IncludeTotals` | bool | Add a `totals` object with `totalAmountSum` and `totalAmountExcludingVatSum` for all matching documents |

This request finds the receipt of shipment 2 on order 1004812:

```
POST /api/Invoices/Search HTTP/1.1
Host: api.omnium.no
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "page": 1,
  "take": 10,
  "orderId": "1004812",
  "shipmentId": "2",
  "invoiceTypes": ["Receipt"]
}
```

## Download a document as a PDF

`GET /api/Invoices/GetAsPdf/{invoiceId}` returns the document as `application/pdf`. A document that an ERP connector provides can come from that system. Omnium renders the documents it creates itself:

*   A receipt has the title **RECEIPT** in the market language and a paid line that names the payment methods, such as **Paid with Klarna**, instead of the due date, KID and bank account. It also shows the delivery date, the shipment, the payments, the VAT rate of each line and the VAT per rate.
*   A credit note shows the receipts it credits.

These documents use the standard layout unless the market has an [invoice template](../Markets/markets-config.md#invoice-template).

## Add or update an invoice

`PUT /api/Invoices/UpdateInvoice` takes an invoice in the model above. Without an `id`, Omnium adds a new invoice and takes the ID from the invoice number series of the invoice's market or tenant, or a GUID when no series is configured. With an `id`, the request replaces the stored invoice with that ID. The request fails with 400 Bad Request when `customerId`, `orderId`, `projectId` or `storeId` refers to something that does not exist, when `marketId` is not one of the tenant's markets, or when `customerEmail` is not a valid email address. The upload endpoints take the file content as the request body, with the file name in the `fileName` query parameter.

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
