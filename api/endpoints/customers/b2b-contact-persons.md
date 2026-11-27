# Customers | B2B | Contact persons

Source: https://api.omnium.no/documentation

> Manage contact persons on Business Customers.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/BusinessCustomer/{businessCustomerId}/ContactPerson/GetContactPersons`

**Get contact persons on business customer**

Operation ID: `BusinessCustomerContactPersonGetContactPersons`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerId` | path | string | Yes |  |

**Responses:**

- 200: List<[`OmniumContactPerson`](../../schemas/OmniumContactPerson.md)> — Success
- 404: string — Not Found

---

## `PUT /api/BusinessCustomer/{businessCustomerId}/ContactPerson/AddContactPerson`

**Add contact person to business customer. Replace if contact person with the same id, email or phone already exists.**

Operation ID: `BusinessCustomerContactPersonAddContactPerson`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerId` | path | string | Yes |  |

**Request body:** [`OmniumContactPerson`](../../schemas/OmniumContactPerson.md)

**Responses:**

- 200: List<[`OmniumContactPerson`](../../schemas/OmniumContactPerson.md)> — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/BusinessCustomer/{businessCustomerId}/ContactPerson/DeleteContactPerson`

**Deletes the contact person with matching id, email or phone.**

Operation ID: `BusinessCustomerContactPersonDeleteContactPerson`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerId` | path | string | Yes |  |
| `contactPersonId` | query | string | No |  |
| `contactPersonEmail` | query | string | No |  |
| `contactPersonPhone` | query | string | No |  |

**Responses:**

- 200: Success
- 400: string — Bad Request
- 404: string — Not Found
