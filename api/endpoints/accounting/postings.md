# Accounting | Postings

Source: https://api.omnium.no/documentation

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Accounting/Postings/{id}`

**Get a single accounting posting by ID.**

Operation ID: `AccountingGetPosting`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Posting ID |

**Responses:**

- 200: [`OmniumAccountingPosting`](../../schemas/OmniumAccountingPosting.md) — Posting found and returned
- 400: string — Posting ID is invalid
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Posting does not exist

---

## `GET /api/Accounting/Postings/ByZReport/{zReportId}`

**Get the (current, non-Superseded) accounting posting built from a given Z-report.**

Operation ID: `AccountingGetPostingByZReport`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `zReportId` | path | string | Yes | Z-report ID |

**Responses:**

- 200: [`OmniumAccountingPosting`](../../schemas/OmniumAccountingPosting.md) — Posting found and returned
- 400: string — Z-report ID is invalid
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — No posting exists for the given Z-report

---

## `POST /api/Accounting/Postings/Search`

**Search accounting postings.**

Operation ID: `AccountingSearchPostings`

**Request body:** [`OmniumAccountingPostingSearchRequest`](../../schemas/OmniumAccountingPostingSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumAccountingPostingOmniumSearchResult`](../../schemas/OmniumAccountingPostingOmniumSearchResult.md) — Search results returned
- 400: string — Invalid page size or pagination
