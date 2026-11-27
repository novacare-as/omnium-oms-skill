# Assets | Files

Source: https://api.omnium.no/documentation

> File operations.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Files/{serviceType}/Download`

**Download file/asset with a give path and serviceType. ServiceType is found on the asset**

Operation ID: `FilesDownload`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `serviceType` | path | string | Yes | The service type which should be specified on the asset |

**Request body:** [`OmniumFileDownloadRequest`](../../schemas/OmniumFileDownloadRequest.md) — File path

**Responses:**

- 200: string — Success
- 400: Invalid service type
- 404: Asset was not found with the selected service type
