# Invoices

Source: https://api.omnium.no/documentation

> Invoices

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Invoices`

**Get all invoices**

Operation ID: `InvoicesGetInvoices`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `isPaid` | query | boolean | No | Filter on paid or unpaid invoices. Leave unassigned to get all. |

**Responses:**

- 200: [`OmniumInvoiceOmniumSearchResult`](../schemas/OmniumInvoiceOmniumSearchResult.md) — Invoices found and returned
- 400: Parameters are invalid
- 404: No invoices found

---

## `GET /api/Invoices/{invoiceId}`

**Returns a single invoice**

Operation ID: `InvoicesGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `invoiceId` | path | string | Yes | Invoice ID |

**Responses:**

- 200: [`OmniumInvoice`](../schemas/OmniumInvoice.md) — Invoice found and returned
- 400: Invoice ID is invalid
- 404: Invoice does not exist

---

## `DELETE /api/Invoices/{invoiceId}`

**Delete invoice and related invoice file**

Operation ID: `InvoicesDelete`

Delete Invoice and related invoice file

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `invoiceId` | path | string | Yes |  |

**Responses:**

- 200: Invoice added successfully
- 400: Bad request
- 404: Not found

---

## `GET /api/Invoices/Customers/{customerId}`

**Get all invoices associated with customer**

Operation ID: `InvoicesGetInvoicesByCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | path | string | Yes | Customer identification |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `isPaid` | query | boolean | No | If the invoices are paid or not |

**Responses:**

- 200: [`OmniumInvoiceOmniumSearchResult`](../schemas/OmniumInvoiceOmniumSearchResult.md) — Invoices found and returned
- 400: Parameters are invalid
- 404: No invoices found

---

## `GET /api/Invoices/GetAsPdf/{invoiceId}`

**Get copy of invoice**

Operation ID: `InvoicesGetAsPdf`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `invoiceId` | path | string | Yes |  |

**Responses:**

- 200: `application/pdf` — Success
- 404: Not Found

---

## `PUT /api/Invoices/UpdateInvoice`

**Add/Update invoice**

Operation ID: `InvoicesUpdateInvoice`

Add a new invoice, or update an existing invoice

**Request body:** [`OmniumInvoice`](../schemas/OmniumInvoice.md)

**Responses:**

- 200: [`OmniumInvoice`](../schemas/OmniumInvoice.md) — Invoice added successfully
- 400: Bad request
- 404: Invalid data

---

## `POST /api/Invoices/Search`

**Search for invoices**

Operation ID: `InvoicesSearch`

Search for invoices.

**Request body:** [`OmniumInvoiceSearchRequest`](../schemas/OmniumInvoiceSearchRequest.md) — Invoice search request

**Responses:**

- 200: [`OmniumInvoiceOmniumInvoiceTotalsOmniumSearchResultWithTotals`](../schemas/OmniumInvoiceOmniumInvoiceTotalsOmniumSearchResultWithTotals.md) — Invoices found and returned
- 400: Parameters are invalid
- 404: No invoices found

---

## `POST /api/Invoices/AddInvoice`

**Upload invoice-file from stream - creates new invoice**

Operation ID: `InvoicesAddInvoice`

Upload invoice-file from stream. Creates a new invoice. Use UpdateInvoice to populate object with additional data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `fileName` | query | string | Yes | Name of uploaded invoice file |
| `projectId` | query | string | No | Project connected to the created invoice (Optional) |
| `orderId` | query | string | No | Order connected to the created invoice (Optional) |

**Request body:** `application/octet-stream`

**Responses:**

- 201: [`OmniumInvoice`](../schemas/OmniumInvoice.md) — Invoice added successfully
- 400: Bad request
- 404: Invalid projectId

---

## `POST /api/Invoices/{invoiceId}/AddFileToInvoice`

**Upload invoice-file from stream - attach to existing invoice**

Operation ID: `InvoicesAddFileToInvoice`

Upload invoice-file from stream. Attaches the file to an existing invoice

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `invoiceId` | path | string | Yes | id of the invoice |
| `fileName` | query | string | No | name of file |

**Request body:** `application/octet-stream`

**Responses:**

- 200: [`OmniumInvoice`](../schemas/OmniumInvoice.md) — Invoice added successfully
- 400: Bad request
- 404: Invalid invoiceId - invoice does not exist

---

## `POST /api/Invoices/{invoiceId}/AddAsset`

**Add asset to invoice from stream. If assetId is supplied and an asset already exists with the given ID, then asset will be patched with the supplied data. If assetId is supplied and no asset with the given ID exists, then the created asset will be assigned the supplied assetId. If assetId is empty, a new asset will be created and assigned a guid as ID.**

Operation ID: `InvoicesAddAsset`

Add new invoice asset from stream

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `invoiceId` | path | string | Yes |  |
| `fileName` | query | string | Yes |  |
| `assetId` | query | string | No |  |

**Request body:** `application/octet-stream`

**Responses:**

- 200: [`OmniumInvoice`](../schemas/OmniumInvoice.md) — Asset added successfully
- 400: Bad request
- 404: Invoice does not exist
