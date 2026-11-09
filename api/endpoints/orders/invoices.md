# Orders | Invoices

Source: https://api.omnium.no/documentation

> Invoices

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Invoices/Orders/{orderId}`

**Get all invoices associated with order**

Operation ID: `InvoicesGetInvoicesByOrder`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order identification |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `isPaid` | query | boolean | No | If the invoices are paid or not |

**Responses:**

- 200: [`OmniumInvoiceOmniumSearchResult`](../../schemas/OmniumInvoiceOmniumSearchResult.md) — Invoices found and returned
- 400: Parameters are invalid
- 404: No invoices found
