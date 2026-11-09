# OmniumInsightsProjectActivityDailyResponse

Daily project activity for the Insights API.
One row per (date, store, project type) with at least one transition (new, completed, or cancelled) on that day.

**Fields:**

- `date`: string, nullable — The day this row covers, formatted as yyyy-MM-dd in the tenant's timezone.
- `storeId`: string, nullable — The top-level Project.StoreId.
- `projectTypeName`: string, nullable — The project type name.
- `newProjects`: integer (int32) — Projects created on this day with Status = New.
- `completedProjects`: integer (int32) — Projects transitioning to Completed or WorkflowCompleted on this day, counted by Project.Finished.
- `cancelledProjects`: integer (int32) — Projects transitioning to any cancelled status on this day, counted by Project.Canceled.
- `estimatedValue`: number (decimal) — Sum of Project.ProjectValue for new projects created on this day.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
