# OmniumInvoiceSearchRequest

**Fields:**

- `take`: integer (int32) — Paged search - max number of invoices to return
- `page`: integer (int32) — Paged search - page
- `invoiceId`: string, nullable — Search Invoices by Id
- `invoiceTypes`: List<string>, nullable, max length 250 — Search Invoices by invoice types
- `email`: string, nullable — Search Invoices by Email
- `phone`: string, nullable — Search Invoices by Phone
- `customerName`: string, nullable — Search Invoices by CustomerName
- `customerId`: string, nullable — Search Invoices by CustomerId
- `orderId`: string, nullable — Search Invoices by OrderId
- `shipmentId`: string, nullable — Search Invoices by ShipmentId
- `projectId`: string, nullable — Search Invoices by ProjectId
- `query`: string, nullable — Free text search Invoices (search applies to fields Id, OrderId, ProjectId, CustomerName, CustomerId, InvoiceNumber, Kid and ExternalIds)
- `isPaid`: boolean, nullable — Search Invoices by payment statust
- `createdFrom`: string (date-time), nullable — Search Invoices by CreatedDate
- `createdTo`: string (date-time), nullable — Search Invoices by CreatedDate
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Search Invoices by property values and or keys (match all)
- `sortOrder`: string, nullable — Sort result. Available options [CreatedAscending, CreatedDescending, ModifiedAscending, ModifiedDescending, InvoiceDueDateAscending, InvoiceDueDateDescending]
- `marketIds`: List<string>, nullable — Limit search by market IDs
- `storeIds`: List<string>, nullable — Limit search by store IDs
- `includeTotals`: boolean — Include the `totals` field in the response

**Used directly by endpoints in:**

- [Invoices](../endpoints/invoices.md)
