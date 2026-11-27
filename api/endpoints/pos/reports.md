# POS | Reports

Source: https://api.omnium.no/documentation

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/ZReport/GetOmniumZReports`

**Endpoint for fetching z reports. Reports are fetched from POS connectors if any IZReportFetcher connectors are configured for the tenant.**

Operation ID: `ZReportGetOmniumZReports`

ToDate will default to DateTime.now and fromDate will default to DateTime.Now.AddDays(-10);

When StoreGroupIds are provided they are expanded to the stores in those groups and merged
with any explicitly listed StoreIds before fetching.

Example to fetch the last 10 days of z-reports:
{
    "fromDate": null,
    "toDate": null,
    "marketIds": null,
    "storeIds": null,
    "storeGroupIds": null
}

**Request body:** [`OmniumZReportFilter`](../../schemas/OmniumZReportFilter.md)

**Responses:**

- 200: List<[`OmniumZReport`](../../schemas/OmniumZReport.md)> — Success
- 400: string — Bad Request

---

## `POST /api/ZReport/GenerateSAFTReport`

Operation ID: `ZReportGenerateSAFTReport`

**Request body:** [`GenerateSAFTReportRequest`](../../schemas/GenerateSAFTReportRequest.md)

**Responses:**

- 200: Success
- 400: string — Bad Request
