# Accounting | Ledger Lines

Source: https://api.omnium.no/documentation

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Accounting/Postings/{id}/Lines`

**Get all ledger lines for a given posting.**

Operation ID: `AccountingGetLinesForPosting`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Posting ID |

**Responses:**

- 200: List<[`OmniumAccountingLedgerLine`](../../schemas/OmniumAccountingLedgerLine.md)> — Ledger lines returned
- 400: string — Posting ID is invalid

---

## `GET /api/Accounting/Postings/{postingId}/Lines/{id}`

**Get a single ledger line by ID. The posting ID is required because ledger lines are partitioned by posting in storage.**

Operation ID: `AccountingGetLine`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `postingId` | path | string | Yes | ID of the parent posting |
| `id` | path | string | Yes | Ledger line ID |

**Responses:**

- 200: [`OmniumAccountingLedgerLine`](../../schemas/OmniumAccountingLedgerLine.md) — Ledger line found and returned
- 400: string — IDs are invalid
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Ledger line does not exist on this posting

---

## `POST /api/Accounting/LedgerLines/Search`

**Search accounting ledger lines.**

Operation ID: `AccountingSearchLedgerLines`

**Request body:** [`OmniumAccountingLedgerLineSearchRequest`](../../schemas/OmniumAccountingLedgerLineSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumAccountingLedgerLineOmniumSearchResult`](../../schemas/OmniumAccountingLedgerLineOmniumSearchResult.md) — Search results returned
- 400: string — Invalid page size or pagination
