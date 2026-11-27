# OmniumCampaign

Represents a campaign in the public API.

**Fields:**

- `id`: string, nullable — Unique identifier for the campaign.
- `name`: string, nullable — Campaign display name.
- `description`: string, nullable — Optional internal description of the campaign.
- `tags`: List<string>, nullable — Tags for categorizing and filtering campaigns.
- `startDate`: string (date-time) — Campaign start date.
- `endDate`: string (date-time) — Campaign end date.
- `status`: string, nullable — Current lifecycle status of the campaign. Valid values: Planning, Active, Completed, Archived
- `markets`: List<string>, nullable — Markets where the campaign applies.
- `stores`: List<string>, nullable — Stores where the campaign applies. Empty means all stores.
- `planningNotes`: string, nullable — Internal notes for campaign planning.
- `createdDate`: string (date-time), nullable — Timestamp when the campaign was created.
- `updatedDate`: string (date-time), nullable — Timestamp when the campaign was last updated.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties for extensibility.
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable — List of validation or processing errors.
- `internalComments`: List<[`OmniumComment`](OmniumComment.md)>, nullable — Internal comments on this campaign (employee-to-employee).

**Used directly by endpoints in:**

- [Promotions | Campaigns](../endpoints/promotions/campaigns.md)
