# Projects | Transactions

Source: https://api.omnium.no/documentation

> Project transactions

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/{projectId}/Transactions/{projectTransactionId}`

**Get project transaction**

Operation ID: `ProjectsTransactionsGetProjectTransaction`

Get project transaction by project ID and project transaction ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `transactionId` | query | string | No | Project transaction ID to get |
| `projectTransactionId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProjectTransaction`](../../schemas/OmniumProjectTransaction.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/Projects/{projectId}/Transactions/{projectTransactionId}`

**Update project transaction**

Operation ID: `ProjectsTransactionsProjectTransactionDelete`

Delete project transaction by project and project transaction ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `projectTransactionId` | path | string | Yes | Project transaction ID to delete |

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Projects/{projectId}/Transactions`

**Add project transaction**

Operation ID: `ProjectsTransactionsProjectTransactionAdd`

Add project transaction by project ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** [`OmniumProjectTransaction`](../../schemas/OmniumProjectTransaction.md) — Project transaction to add

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Projects/{projectId}/Transactions`

**Update project transactions**

Operation ID: `ProjectsTransactionsProjectTransactionsUpdate`

Update or add project transaction by project ID. Projects transactions with same ID will be overriden.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** [`OmniumProjectTransaction`](../../schemas/OmniumProjectTransaction.md) — Project transaction to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Projects/Transactions/Sum`

**Search for projects and return a sum over all transactions**

Operation ID: `ProjectsTransactionsGetTransactionSummary`

Get project transaction summaries from projectSearchParams.

**Request body:** [`OmniumProjectSearchRequest`](../../schemas/OmniumProjectSearchRequest.md) — Search request

**Responses:**

- 200: List<[`OmniumProjectTransactionSummary`](../../schemas/OmniumProjectTransactionSummary.md)> — Success

---

## `POST /api/Projects/{projectId}/Transactions/AddMany`

**Update many project transactions**

Operation ID: `ProjectsTransactionsProjectTransactionsAddMany`

Add project transactions by project ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** List<[`OmniumProjectTransaction`](../../schemas/OmniumProjectTransaction.md)> — Project transactions to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Projects/{projectId}/Transactions/UpdateMany`

**Update many project transactions**

Operation ID: `ProjectsTransactionsProjectTransactionUpdateMany`

Update or add project transactions by project ID. Projects transactions with same ID will be overriden.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** List<[`OmniumProjectTransaction`](../../schemas/OmniumProjectTransaction.md)> — Project transactions to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
