# OmniumInsightsProjectInProgressResponse

Current snapshot of projects in progress for the Insights API.
One row per (store, project type). This is NOT a daily series — it reflects the state at query time
for projects created within the requested [fromDate, toDate] window.

**Fields:**

- `storeId`: string, nullable — The top-level Project.StoreId.
- `projectTypeName`: string, nullable — The project type name.
- `unclarifiedProjects`: integer (int32) — Count of projects created within the requested window that currently have Status in {New, Active, OnHold}.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
