# Tokens

Source: https://api.omnium.no/documentation

> Get JWT token for access to Omnium APIs.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Token`

**Create a new token**

Operation ID: `TokenPost`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `clientId` | query | string | No |  |
| `clientSecret` | query | string | No |  |
| `returnAsJson` | query | boolean | No |  |

**Responses:**

- 200: [`OmniumTokenResponse`](../schemas/OmniumTokenResponse.md) — Success
