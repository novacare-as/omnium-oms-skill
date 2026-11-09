# Customers | B2C | Privacy

Source: https://api.omnium.no/documentation

> Endpoints for ensuring privacy and GDPR compliance.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/CustomerPrivacy/ChangePrivateCustomerId`

**Change private customer id, and all data assosiated with that id over to new customer object.**

Operation ID: `CustomerPrivacyChangePrivateCustomerId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `fromCustomerId` | query | string | Yes | Move data from this customer. Customer with this id will also be deleted! |
| `toCustomerId` | query | string | Yes | Move data to this customer. Created if not exist. |

**Responses:**

- 200: [`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/CustomerPrivacy/ChangePrivateCustomerIdBatch`

**Batch change private customer id, and all data assosiated with that id over to new customer object Max size in batch is 50**

Operation ID: `CustomerPrivacyChangePrivateCustomerIdBatch`

**Request body:** List<[`OmniumChangeCustomerId`](../../schemas/OmniumChangeCustomerId.md)>

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `GET /api/CustomerPrivacy/ChangeBusinessCustomerId`

**Change business customer id, and all data assosiated with that id over to new customer object.**

Operation ID: `CustomerPrivacyChangeBusinessCustomerId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `fromCustomerId` | query | string | Yes | Move data from this customer. Customer with this id will also be deleted! |
| `toCustomerId` | query | string | Yes | Move data to this customer. Created if not exist. |

**Responses:**

- 200: [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — Success
- 404: string — Not Found
