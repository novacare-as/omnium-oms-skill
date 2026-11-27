# OmniumCampaignSearchRequest

Represents a search request for campaigns in the system.

**Fields:**

- `startFrom`: string (date-time), nullable — Filter campaigns that start after this date. Only campaigns where StartDate >= StartFrom will be included.
- `startTo`: string (date-time), nullable — Filter campaigns that start before this date. Only campaigns where StartDate <= StartTo will be included.
- `endFrom`: string (date-time), nullable — Filter campaigns that end after this date. Only campaigns where EndDate >= EndFrom will be included.
- `endTo`: string (date-time), nullable — Filter campaigns that end before this date. Only campaigns where EndDate <= EndTo will be included.
- `statuses`: List<string>, nullable — Filter by campaign statuses. Empty means all statuses. Valid values: Planning, Active, Completed, Archived
- `marketIds`: List<string>, nullable — Filter by market IDs.
- `storeIds`: List<string>, nullable — Filter by store IDs.
- `tags`: List<string>, nullable — Filter by tags.
- `searchText`: string, nullable — Free-text search across name, description, and tags.
- `campaignIds`: List<string>, nullable — Filter by specific campaign IDs.
- `page`: integer (int32) — Page number for pagination. Defaults to 1.
- `take`: integer (int32) — Number of results per page. Defaults to 20.
- `sortOrder`: string, nullable — Sort order. Options: StartDateAsc, StartDateDesc, EndDateAsc, EndDateDesc, NameAsc, NameDesc.
- `excludeArchived`: boolean — If true, excludes archived campaigns from results. Defaults to true.

**Used directly by endpoints in:**

- [Promotions | Campaigns](../endpoints/promotions/campaigns.md)
