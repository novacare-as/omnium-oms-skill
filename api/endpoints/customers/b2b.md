# Customers | B2B

Source: https://api.omnium.no/documentation

> Business customers are used for B2B commerce. Share many of the same properties as private customers.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/BusinessCustomers`

**Add business customer to database**

Operation ID: `BusinessCustomersPost`

**Request body:** [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — The business customer to add

**Responses:**

- 200: [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `POST /api/BusinessCustomers/Update`

**Update business customer**

Operation ID: `BusinessCustomersUpdate`

**Request body:** [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — The customer to update

**Responses:**

- 200: [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — The customer to update, with the given customerId, was not found

---

## `PATCH /api/BusinessCustomers/PatchBusinessCustomer`

**Patch business customer - update only some values in request**

Operation ID: `BusinessCustomersPatchBusinessCustomer`

**Request body:** [`OmniumBusinessCustomerPatch`](../../schemas/OmniumBusinessCustomerPatch.md) — Business customer patch. Only properties with value will be updated.

**Responses:**

- 200: [`OmniumCustomerUpdateResult`](../../schemas/OmniumCustomerUpdateResult.md) — Business customer updated successfully
- 400: string — Business customer patch is invalid
- 404: string — Not Found

---

## `PUT /api/BusinessCustomers/AddOrUpdateMany`

**Add or update a range of customers to the OMS. Max size in batch is 100**

Operation ID: `BusinessCustomersAddOrUpdateMany`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `enrichContactsFromPrivateCustomers` | query | boolean | No | If true then Omnium will attempt to enrich the contacts with info from existing private customers in Omnium based on the given PrivateCustomerId on the contact. NB! The info sent in the request body will override the enriched values. |
| `exportBusinessCustomers` | query | boolean | No | Whether the business customers should be exported |

**Request body:** List<[`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md)> — A list of business customer objects that needs to be added/updated to the OMS

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `GET /api/BusinessCustomers/GetBusinessCustomerByContactPhone`

**Get business customers by searching for phone number of contact person**

Operation ID: `BusinessCustomersGetBusinessCustomerByContactPhone`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `phoneNumber` | query | string | Yes | Phone number of contact person |

**Responses:**

- 200: List<[`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md)> — Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `GET /api/BusinessCustomers/GetBusinessCustomerByContactPrivateCustomerId`

**Get business customers by searching for contact person private customer ID**

Operation ID: `BusinessCustomersGetBusinessCustomerByContactPrivateCustomerId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `privateCustomerId` | query | string | Yes |  |

**Responses:**

- 200: List<[`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md)> — Success
- 400: string — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `GET /api/BusinessCustomers/GetBusinessCustomerByContactEmail`

**Get business customers by searching for e-mail of contact person**

Operation ID: `BusinessCustomersGetBusinessCustomerByContactEmail`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `email` | query | string | Yes | Email of contact person |

**Responses:**

- 200: List<[`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md)> — Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `GET /api/BusinessCustomers/{id}`

**Get business customer by ID**

Operation ID: `BusinessCustomersGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Customer ID |

**Responses:**

- 200: [`OmniumBusinessCustomer`](../../schemas/OmniumBusinessCustomer.md) — Success
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Business customer with the given id was not found

---

## `DELETE /api/BusinessCustomers/{id}`

**Delete business customer**

Operation ID: `BusinessCustomersDeleteBusinessCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Business customer ID |

**Responses:**

- 204: Customer is deleted
- 404: string — Customer does not exist

---

## `GET /api/BusinessCustomers/Search`

**Free text search for business customers**

Operation ID: `BusinessCustomerFreeTextSearch` · **Deprecated**

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `query` | query | string | No | Search query |

**Responses:**

- 200: [`OmniumBusinessCustomerOmniumSearchResult`](../../schemas/OmniumBusinessCustomerOmniumSearchResult.md) — Success

---

## `POST /api/BusinessCustomers/Search`

**Search business customers**

Operation ID: `BusinessCustomersSearch`

**Request body:** [`OmniumCustomerSearchRequest`](../../schemas/OmniumCustomerSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumBusinessCustomerOmniumSearchResult`](../../schemas/OmniumBusinessCustomerOmniumSearchResult.md) — Returning items found
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `GET /api/BusinessCustomers/GetAll`

**Get all business customers, or get all business customers that has been changed since a given date and time.**

Operation ID: `BusinessCustomersGetAll`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `sortOrder` | query | string | No | Sort order. E.g. ModifiedAscending, ModifiedDescending, CreatedAscending, CreatedDescending |
| `changedSince` | query | string (date-time) | No | Customers added or modified since a given date and time |

**Responses:**

- 200: [`OmniumBusinessCustomerOmniumSearchResult`](../../schemas/OmniumBusinessCustomerOmniumSearchResult.md) — Success

---

## `GET /api/BusinessCustomers/{id}/SalesLimitations`

**Get all sales limitations for the customer.**

Operation ID: `BusinessCustomersGetSalesLimitationsForCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |
| `marketId` | query | string | No | Market ID for the the customer |

**Responses:**

- 200: List<[`OmniumSalesLimitation`](../../schemas/OmniumSalesLimitation.md)> — Success

---

## `GET /api/BusinessCustomers/SalesLimitations`

**Get all sales limitations all customers.**

Operation ID: `BusinessCustomersGetSalesLimitations`

**Responses:**

- 200: List<[`OmniumSalesLimitation`](../../schemas/OmniumSalesLimitation.md)> — Success

---

## `POST /api/BusinessCustomers/Scroll`

**Scroll business Customer by search**

Operation ID: `BusinessCustomersScrollSearch`

Scrolling is not intended for real time user requests, but rather for processing large amounts of data. Only use scroll endpoints if you intend to fetch all items returned by the search request.
           Paging (take, page) is disabled for scroll searches.

**Request body:** [`OmniumCustomerSearchRequest`](../../schemas/OmniumCustomerSearchRequest.md)

**Responses:**

- 200: [`OmniumBusinessCustomerOmniumSearchResult`](../../schemas/OmniumBusinessCustomerOmniumSearchResult.md) — Search successful, returning business customers
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Search request invalid

---

## `GET /api/BusinessCustomers/Scroll/{id}`

**Scroll is used to get a large amount of business customers.**

Operation ID: `BusinessCustomersScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumBusinessCustomerOmniumSearchResult`](../../schemas/OmniumBusinessCustomerOmniumSearchResult.md) — Success

---

## `POST /api/BusinessCustomers/SendEmailToCustomer/{businessCustomerId}`

**Send email to business customer. Gets logged as note to customer. Consider using Notifications/SendEmail for more general purposes.**

Operation ID: `BusinessCustomersSendEmailToCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerId` | path | string | Yes | Customer |

**Request body:** [`OmniumEmailMessage`](../../schemas/OmniumEmailMessage.md) — E-mail-message to send

**Responses:**

- 200: Email is sent
- 400: string — Email is invalid
- 404: string — Not Found

---

## `DELETE /api/BusinessCustomers/DeleteAll`

**Deleting ALL items! For development environments ONLY**

Operation ID: `BusinessCustomersDeleteAll`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `safeword` | query | string | No |  |
| `tenantId` | query | string | No |  |

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `POST /api/BusinessCustomers/UpdateCustomerNumber`

**Update customer number on customer and all orders**

Operation ID: `BusinessCustomersUpdateCustomerNumber`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | Yes | ID of the customer |
| `customerNumber` | query | string | Yes | The new customer number to be added |

**Responses:**

- 200: Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request
- 404: string — The customer was not found

---

## `GET /api/BusinessCustomers/GetNextCustomerNumber`

**Get next generated customer number.**

Operation ID: `BusinessCustomersGetNextCustomerNumber`

Requires that CustomerNumberOptions is configured, with auto create enabled.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | query | string | No | Optional: Provide if multiple CustomerNumberOptions configured |

**Responses:**

- 200: string — CustomerNumber
- 400: string — CustomerNumber not available
- 404: string — NumberOptions not configured

---

## `GET /api/BusinessCustomers/GetConfiguredConsents`

**Get configured consent types for business customers**

Operation ID: `BusinessCustomersGetConfiguredConsents`

A consent type can be limited to one or more markets. A consent type with no markets configured is
considered global and applies to every market.

When marketIds is omitted, every configured consent type is returned.

When one or more market ids are supplied, the response contains the consent types configured for at
least one of those markets, plus all global consent types (those without any markets). Pass "*" to get
every consent type regardless of market.

Repeat the parameter to filter on several markets, for example:
{?marketIds=NO&marketIds=SE}

Market ids are matched case-insensitively, so {NO} and {no} return the same consent types.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketIds` | query | List<string> | No | Optional market ids to filter on. Omit to get all configured consent types. |

**Responses:**

- 200: List<[`OmniumConsentType`](../../schemas/OmniumConsentType.md)> — List of configured consent types
- 404: string — No consent types configured, or none matching the requested markets
