# OmniumProjectTransactionSummary

Project transaction summaries

**Fields:**

- `projectId`: string, nullable — Unique project identifier
- `partsTransactionSummary`: [`OmniumProjectTransaction`](OmniumProjectTransaction.md)
- `changeTransactionSummary`: [`OmniumProjectTransaction`](OmniumProjectTransaction.md)
- `totalTransactionSummary`: [`OmniumProjectTransaction`](OmniumProjectTransaction.md)
- `totalHits`: integer (int64) — Number of projects matching the search criteria

**Used directly by endpoints in:**

- [Projects | Transactions](../endpoints/projects/transactions.md)
