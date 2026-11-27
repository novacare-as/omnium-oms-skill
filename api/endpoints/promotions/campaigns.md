# Promotions | Campaigns

Source: https://api.omnium.no/documentation

> Campaign management API for planning and grouping promotions

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Campaigns/{id}`

**Returns a single campaign**

Operation ID: `CampaignsGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the campaign to return |

**Responses:**

- 200: [`OmniumCampaign`](../../schemas/OmniumCampaign.md) — Success
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — The campaign was not found

---

## `PUT /api/Campaigns/{id}`

**Update an existing campaign**

Operation ID: `CampaignsUpdate`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the campaign to update |

**Request body:** [`OmniumCampaignRequest`](../../schemas/OmniumCampaignRequest.md) — Updated campaign data

**Responses:**

- 200: [`OmniumCampaign`](../../schemas/OmniumCampaign.md) — Success
- 400: string — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `DELETE /api/Campaigns/{id}`

**Delete a campaign**

Operation ID: `CampaignsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the campaign to delete |

**Responses:**

- 204: Success
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `POST /api/Campaigns/Search`

**Search for campaigns**

Operation ID: `CampaignsSearch`

**Request body:** [`OmniumCampaignSearchRequest`](../../schemas/OmniumCampaignSearchRequest.md) — Search filters

**Responses:**

- 200: [`OmniumCampaignOmniumSearchResult`](../../schemas/OmniumCampaignOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/Campaigns`

**Create a new campaign**

Operation ID: `CampaignsCreate`

**Request body:** [`OmniumCampaignRequest`](../../schemas/OmniumCampaignRequest.md) — Campaign data

**Responses:**

- 201: [`OmniumCampaign`](../../schemas/OmniumCampaign.md) — Success
- 400: string — Bad Request

---

## `PATCH /api/Campaigns/{id}/status`

**Update the status of a campaign**

Operation ID: `CampaignsUpdateStatus`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the campaign |

**Request body:** [`OmniumCampaignStatusUpdate`](../../schemas/OmniumCampaignStatusUpdate.md) — The new status

**Responses:**

- 200: [`OmniumCampaign`](../../schemas/OmniumCampaign.md) — Success
- 400: string — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `GET /api/Campaigns/{id}/promotions`

**Get promotion IDs linked to a campaign**

Operation ID: `CampaignsGetLinkedPromotions`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the campaign |

**Responses:**

- 200: List<string> — Success
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found
