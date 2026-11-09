# Customers | B2C | Versions

Source: https://api.omnium.no/documentation

> Fetch previous versions of private customers.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/PrivateCustomers/Versions/{customerId}`

**Get a list of all version items.**

Operation ID: `PrivateCustomerVersionsVersionList`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | path | string | Yes | Customer ID to fetch the version list for |

**Responses:**

- 200: List<[`OmniumVersionListItem`](../../schemas/OmniumVersionListItem.md)> — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `GET /api/PrivateCustomers/Versions/{customerId}/{versionId}`

**Get specific private customer version**

Operation ID: `PrivateCustomerGetVersion`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | path | string | Yes | Customer ID |
| `versionId` | path | string | Yes | Version ID to fetch |

**Responses:**

- 200: [`OmniumPrivateCustomerOmniumVersion`](../../schemas/OmniumPrivateCustomerOmniumVersion.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
