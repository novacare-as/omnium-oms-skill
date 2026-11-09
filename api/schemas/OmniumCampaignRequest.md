# OmniumCampaignRequest

Request model for creating or updating a campaign.

**Fields:**

- `id`: string, nullable — Unique Id of the campaign. A GUID will be generated if not provided.
- `name`: string, required — Campaign display name.
- `description`: string, nullable — Optional internal description of the campaign.
- `tags`: List<string>, nullable — Tags for categorizing and filtering campaigns.
- `startDate`: string (date-time), required — Campaign start date.
- `endDate`: string (date-time), required — Campaign end date. Must be after StartDate.
- `status`: string, nullable — Initial lifecycle status of the campaign. Valid values: Planning, Active, Completed, Archived. Defaults to Planning if not specified.
- `markets`: List<string>, nullable — Markets where the campaign applies.
- `stores`: List<string>, nullable — Stores where the campaign applies. Empty means all stores.
- `planningNotes`: string, nullable — Internal notes for campaign planning.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties for extensibility.

**Used directly by endpoints in:**

- [Promotions | Campaigns](../endpoints/promotions/campaigns.md)
