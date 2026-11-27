# Customers | Customer groups

Source: https://api.omnium.no/documentation

> Customers groups are used to organize groups of customers and assign prices and promotions to groups of customers.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/CustomerGroups/{customerGroupId}`

**Get a customer group**

Operation ID: `CustomerGroupsGetCustomerGroup`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerGroupId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumCustomerGroup`](../../schemas/OmniumCustomerGroup.md) — Success

---

## `POST /api/CustomerGroups/CustomerGroups/Search`

**Search customer groups logs**

Operation ID: `CustomerGroupsSearch`

Search customer groups.

**Request body:** [`OmniumCustomerGroupSearchRequest`](../../schemas/OmniumCustomerGroupSearchRequest.md) — Search request object for customer groups

**Responses:**

- 200: [`OmniumCustomerGroupOmniumSearchResult`](../../schemas/OmniumCustomerGroupOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `PUT /api/CustomerGroups/CustomerGroups/Add`

**Add/update customer group**

Operation ID: `CustomerGroupsAdd`

Add/update a customer group.

**Request body:** [`OmniumCustomerGroup`](../../schemas/OmniumCustomerGroup.md) — Omnium CustomerGroup object

**Responses:**

- 200: [`OmniumCustomerGroup`](../../schemas/OmniumCustomerGroup.md) — Success
- 400: string — Bad Request

---

## `DELETE /api/CustomerGroups/CustomerGroups/{id}`

**Delete customer group**

Operation ID: `CustomerGroupsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 200: Customer group deleted
- 404: Customer group not found
