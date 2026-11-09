# OmniumPickListSearchRequest

PickList search request.

**Fields:**

- `take`: integer (int32) — Number of orders to take.
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take]).
- `createdFrom`: string (date-time), nullable — PickLists created from date.
- `createdTo`: string (date-time), nullable — PickLists created to date.
- `sortOrder`: string, nullable — Sort order for the results. Defaults to created date descending. Possible values: CreatedAscending, CreatedDescending, ModifiedAscending, ModifiedDescending.

**Used directly by endpoints in:**

- [Orders | Pick Lists](../endpoints/orders/pick-lists.md)
