# Customers | B2C

Source: https://api.omnium.no/documentation

> Private customers are used for B2C or D2C commerce.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/PrivateCustomers`

**Add a private customer customer to database.**

Operation ID: `PrivateCustomersPost`

**Request body:** [`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md) — The customer object to be stored in the OMS

**Responses:**

- 200: [`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md) — Success
- 400: string — Bad Request

---

## `POST /api/PrivateCustomers/AddMany`

**Adds a range of new customers to the OMS. Only not existing customers will be added(based on customerId) Max size in batch is 100**

Operation ID: `PrivateCustomersAddMany`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `exportCustomers` | query | boolean | No | If true - Omnium will trigger configured connectors to export updated customers |

**Request body:** List<[`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md)> — A list of privateCustomers objects that needs to be added to the OMS

**Responses:**

- 200: string — Success
- 201: Success
- 400: string — Bad Request

---

## `PUT /api/PrivateCustomers/AddOrUpdateMany`

**Add or update a range of customers to the OMS. Max size in batch is 100**

Operation ID: `PrivateCustomersAddOrUpdateMany`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `exportCustomers` | query | boolean | No | If true - Omnium will trigger configured connectors to export updated customers |

**Request body:** List<[`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md)> — A list of privateCustomers objects that needs to be added/updated to the OMS

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `POST /api/PrivateCustomers/Update`

**Update private customer**

Operation ID: `PrivateCustomersUpdate`

**Request body:** [`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md) — The customer object to be updated in the OMS

**Responses:**

- 200: [`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md) — Success
- 400: string — Bad Request
- 404: string — The customer to update was not found

---

## `PATCH /api/PrivateCustomers/PatchPrivateCustomer`

**Patch private customer - update only some values in request**

Operation ID: `PrivateCustomersPatchPrivateCustomer`

**Request body:** [`OmniumPrivateCustomerPatch`](../../schemas/OmniumPrivateCustomerPatch.md) — Private customer patch. Only properties with value will be updated.

**Responses:**

- 200: [`OmniumCustomerUpdateResult`](../../schemas/OmniumCustomerUpdateResult.md) — Private customer updated successfully
- 400: string — Private customer patch is invalid
- 404: string — Customer not found

---

## `PATCH /api/PrivateCustomers/PatchManyPrivateCustomers`

**Patch many private customers in one call. For each patch only properties with a value are updated - the rest are left unchanged. Changed customers are indexed in bulk. Only existing customers are processed - unknown customers are skipped and returned in NotFoundIds. Max size in batch is 100.**

Operation ID: `PrivateCustomersPatchManyPrivateCustomers`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `exportCustomers` | query | boolean | No | If true - Omnium will trigger configured connectors to export updated customers |

**Request body:** List<[`OmniumPrivateCustomerPatch`](../../schemas/OmniumPrivateCustomerPatch.md)> — List of private customer patches. Each patch must include a CustomerId. Only properties with a value will be updated.

**Responses:**

- 200: [`OmniumCustomerUpdateResult`](../../schemas/OmniumCustomerUpdateResult.md) — Returns a summary of how many customers were updated, unchanged, and not found.
- 400: string — Request is null, empty, or exceeds the batch limit

---

## `GET /api/PrivateCustomers/{id}`

**Gets the specified customer identifier.**

Operation ID: `PrivateCustomersGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The customer identifier. |

**Responses:**

- 200: [`OmniumPrivateCustomer`](../../schemas/OmniumPrivateCustomer.md) — Returning the customer
- 404: string — The customer, with the given customerId, was not found

---

## `DELETE /api/PrivateCustomers/{id}`

**Delete the private customer. If the customer is a contact person on any business customers, the relation will be deleted**

Operation ID: `PrivateCustomersDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer to delete |

**Responses:**

- 204: Private customer has been deleted
- 404: string — The customer with the given ID was not found

---

## `GET /api/PrivateCustomers/GetCustomerByPhoneAndStore`

**Gets customer and related customer club membership info. Customer must have registered phone number and be connected to the specified store.**

Operation ID: `PrivateCustomersGetCustomerByPhoneAndStore`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `phoneNumber` | query | string | Yes | The customers phone number. |
| `storeId` | query | string | Yes | The store the customer is connected to. |

**Responses:**

- 200: [`OmniumPrivateCustomerViewModel`](../../schemas/OmniumPrivateCustomerViewModel.md) — Returning customer view model
- 404: string — No customer with given combo of store and phone number was found

---

## `DELETE /api/PrivateCustomers/Anonymize`

**Delete the private customer and anonymize all related orders, projects, and other data.**

Operation ID: `PrivateCustomersAnonymizeCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | query | string | Yes | ID of the customer to anonymize |

**Responses:**

- 200: Anonymization successful, or customer is already anonymized
- 400: string — Anonymization failed usually if customer has open orders
- 404: string — Customer not found

---

## `GET /api/PrivateCustomers/Information/{id}`

**Get all customer personal data, orders, and other data stored in the OMS.**

Operation ID: `PrivateCustomersGetPrivateCustomerInformation`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Responses:**

- 200: [`OmniumPrivateCustomerInfo`](../../schemas/OmniumPrivateCustomerInfo.md) — Success
- 404: string — Not Found

---

## `POST /api/PrivateCustomers/Consents`

**Add a new consent for the customer**

Operation ID: `PrivateCustomersAddConsent`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | Yes | ID of the customer |

**Request body:** [`OmniumConsent`](../../schemas/OmniumConsent.md) — The consent to be added

**Responses:**

- 200: Success
- 400: string — Bad Request
- 404: string — The customer was not found

---

## `POST /api/PrivateCustomers/Consents/AddMany`

**Add consents for many customers in one call. For each customer, a consent of a new type is added and a consent of an existing type is updated (the previous value is kept in consent history). Changed customers are indexed in bulk. Only existing customers are processed - unknown customers are skipped and returned in NotFoundIds. Max size in batch is 1000.**

Operation ID: `PrivateCustomersAddManyConsents`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `exportCustomers` | query | boolean | No | If true - Omnium will trigger configured connectors to export updated customers |

**Request body:** List<[`OmniumCustomerConsents`](../../schemas/OmniumCustomerConsents.md)> — List of customers and the consents to add for each

**Responses:**

- 200: [`OmniumCustomerUpdateResult`](../../schemas/OmniumCustomerUpdateResult.md) — Returns a summary of how many customers were updated, unchanged, and not found.
- 400: string — Request is null, empty, or exceeds the batch limit

---

## `GET /api/PrivateCustomers/Consents/{id}`

**Get all consents for the customer.**

Operation ID: `PrivateCustomersGetConsentsForCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Responses:**

- 200: List<[`OmniumConsent`](../../schemas/OmniumConsent.md)> — A list of consents
- 404: string — The customer was not found

---

## `POST /api/PrivateCustomers/Search`

**Search private customers**

Operation ID: `PrivateCustomersSearch`

**Request body:** [`OmniumCustomerSearchRequest`](../../schemas/OmniumCustomerSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumPrivateCustomerOmniumSearchResult`](../../schemas/OmniumPrivateCustomerOmniumSearchResult.md) — Returns list of private customers

---

## `POST /api/PrivateCustomers/Scroll`

**Scroll privateCustomers by search**

Operation ID: `PrivateCustomersScrollSearch`

Scrolling is not intended for real time user requests, but rather for processing large amounts of data. Only use scroll endpoints if you intend to fetch all items returned by the search request.
           Paging (take, page) is disabled for scroll searches.

**Request body:** [`OmniumCustomerSearchRequest`](../../schemas/OmniumCustomerSearchRequest.md)

**Responses:**

- 200: [`OmniumPrivateCustomerOmniumSearchResult`](../../schemas/OmniumPrivateCustomerOmniumSearchResult.md) — Search successful, returning privateCustomers
- 400: Search request invalid

---

## `GET /api/PrivateCustomers/Scroll/{id}`

**Scroll privateCustomers is used to get a large amount of customers.**

Operation ID: `PrivateCustomersScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumPrivateCustomerOmniumResult`](../../schemas/OmniumPrivateCustomerOmniumResult.md) — Success

---

## `GET /api/PrivateCustomers/{id}/CustomerClubMember`

**Get a customer club member**

Operation ID: `PrivateCustomersGetCustomerClubMember`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Customer club object with summary
- 404: string — Customer club member was not found, or the membership is ended

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/Add`

**Add customer to customer club. Customer is created if not exist. This membership will be approved(consent by default)**

Operation ID: `PrivateCustomersAddNewCustomerClubMember`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Customer club object with summary
- 400: string — Could not create customer club member

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/AddPending`

**Add customer to customer club. Customer is created if not exist. Membership is not approved. To be approved, update consents for this customer**

Operation ID: `PrivateCustomersAddNewPendingCustomerClubMember`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |
| `storeId` | query | string | Yes | ID of the store the customer is coming from |
| `phone` | query | string | No | Optional. If not set, id is used as phone |

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Customer club object with summary
- 400: string — Could not create customer club member

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/AddWithConsentList`

**Add customer to customer club member with consents. Customer is created if not exist.**

Operation ID: `PrivateCustomersAddNewCustomerClubMemberWithConsentList`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |
| `salesPersonId` | query | string | No | Id of the person who recruited the member |

**Request body:** List<[`OmniumConsent`](../../schemas/OmniumConsent.md)> — Consents for this membership. Supported consent type: "ApprovedConsents", "EmailMarketing", "SmsMarketing"

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Customer club object with summary
- 400: string — Could not create customer club member

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/UpdateConsentList`

**Update consent list for customer club member**

Operation ID: `PrivateCustomersUpdateCustomerClubMemberConsentList`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Request body:** List<[`OmniumConsent`](../../schemas/OmniumConsent.md)> — Consents for this membership. This will update existing consents and add new. Supported consent type: "ApprovedConsents", "EmailMarketing", "SmsMarketing"

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Customer club object with summary
- 400: string — Bad Request
- 404: string — Club member not found, or customer not found

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/AddWithPatchRequest`

**Add customer to customer club member with patch request, containing both consents, interests, and signUp storeId. Customer is created if not exist.**

Operation ID: `PrivateCustomersAddNewCustomerClubMemberWithPatch`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Request body:** [`OmniumCustomerClubMemberPatchRequest`](../../schemas/OmniumCustomerClubMemberPatchRequest.md) — Consents and interests for this customer. StoreId can also be set.

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Customer club member
- 400: string — CustomerClubMemberPatchRequest consents is required

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/UpdatedWithPatchRequest`

**Update customer club member. Consents and interests will be updated/override with what you send in**

Operation ID: `PrivateCustomersUpdateCustomerClubMemberWithPatch`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Request body:** [`OmniumCustomerClubMemberPatchRequest`](../../schemas/OmniumCustomerClubMemberPatchRequest.md) — Consents, interests for this customer.StoreId can also be set. Will override existing

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Customer club member
- 400: string — CustomerClubMemberPatchRequest consents is required
- 404: string — Club member not found, or customer not found

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/UpdateInterests`

**Update list of interests for a customer club member. The list sent in, will replace existing(add or remove). Send in empty list(not null) if all interests should be removed**

Operation ID: `PrivateCustomersUpdateCustomerClubMemberInterests`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Member id |

**Request body:** List<string> — Interest to store, if customer has other interests, they will be deleted. Send in empty lists if all interests should be removed.

**Responses:**

- 200: [`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md) — Updated customer club member
- 404: string — Club member not found, or customer not found

---

## `DELETE /api/PrivateCustomers/{id}/CustomerClubMember/Remove`

**Remove a customer from customer club**

Operation ID: `PrivateCustomersRemoveCustomerClubMember`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Responses:**

- 200: Updated customer club member
- 204: Success
- 400: string — Could not remove customer club member
- 404: string — Club member not found, or customer not found

---

## `PUT /api/PrivateCustomers/AddOrUpdateManyCustomerClubMembers`

**Add or update a range of CustomerClub members to the OMS. Max size in batch is 100 Use this endpoint only for import or clean up. All existing points etc will be overridden with the input data Private customer objects will not be created. Use other endpoint for this**

Operation ID: `PrivateCustomersAddOrUpdateManyCustomerClubMembers`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

**Request body:** List<[`OmniumCustomerClubMember`](../../schemas/OmniumCustomerClubMember.md)> — A list of customerClubMembers objects that needs to be added/updated to the OMS

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `GET /api/PrivateCustomers/GetAllCustomerClubMembers`

**Get all Customer club members**

Operation ID: `PrivateCustomersGetAllCustomerClubMembers`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 1000. Minimum 1. |
| `memberSince` | query | string (date-time) | No | Members since a given date and time |

**Responses:**

- 200: [`OmniumCustomerClubMemberOmniumResult`](../../schemas/OmniumCustomerClubMemberOmniumResult.md) — Success

---

## `POST /api/PrivateCustomers/CustomerClubMembers/Search`

**Search for customerClubMembers.**

Operation ID: `CustomerClubMembersSearch`

**Request body:** [`OmniumCustomerClubMemberSearchRequest`](../../schemas/OmniumCustomerClubMemberSearchRequest.md) — Search request object.

**Responses:**

- 200: [`OmniumCustomerClubMemberOmniumResult`](../../schemas/OmniumCustomerClubMemberOmniumResult.md) — Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `GET /api/PrivateCustomers/ScrollCustomerClubMembers/{id}`

**Scroll customerClubMembers is used to get a large amount of customerClubMember items.**

Operation ID: `PrivateCustomersScrollCustomerClubMembers`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

            The scroll Id can be obtained from a standard search request that supports scrolling.
            Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumCustomerClubMemberOmniumResult`](../../schemas/OmniumCustomerClubMemberOmniumResult.md) — Success

---

## `GET /api/PrivateCustomers/GetCustomerClubInterests`

**Get available CustomerClub interests. Used to segment users and marketing**

Operation ID: `PrivateCustomersGetCustomerClubInterests`

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

**Responses:**

- 200: List<[`OmniumCustomerClubInterests`](../../schemas/OmniumCustomerClubInterests.md)> — List of interests
- 400: string — Customer club is not defined
- 404: string — Interests not found

---

## `GET /api/PrivateCustomers/GetConfiguredConsents`

**Get configured consent types for private customers**

Operation ID: `PrivateCustomersGetConfiguredConsents`

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

---

## `POST /api/PrivateCustomers/UpdateCustomerNumber`

**Update customer number on customer and all orders**

Operation ID: `PrivateCustomersUpdateCustomerNumber`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | Yes | ID of the customer |
| `customerNumber` | query | string | Yes | The new customer number to be added |

**Responses:**

- 200: Success
- 400: string — Bad Request
- 404: string — The customer was not found

---

## `GET /api/PrivateCustomers/GetNextCustomerNumber`

**Get next generated customer number.**

Operation ID: `PrivateCustomersGetNextCustomerNumber`

Requires that CustomerNumberOptions is configured, with auto create enabled.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | query | string | No | Optional: Provide if multiple CustomerNumberOptions configured |

**Responses:**

- 200: CustomerNumber
- 400: string — CustomerNumber not available
- 404: string — NumberOptions not configured

---

## `POST /api/PrivateCustomers/AddComment`

**Add a comment to a customer**

Operation ID: `PrivateCustomersAddComment`

Sample request for adding a comment without notifications:

    POST /api/PrivateCustomers/AddComment
    {
       "CustomerId": "customer@example.com",
       "CommentText": "Customer requested a callback regarding their recent order.",
       "CreatedBy": "CRM System"
    }

Sample request for adding a comment with email notification:

    POST /api/PrivateCustomers/AddComment
    {
       "CustomerId": "customer@example.com",
       "CommentText": "Thank you for contacting us. We have received your inquiry and will respond shortly.",
       "SendEmail": true,
       "EmailSubject": "Inquiry Received",
       "EmailTo": "customer@example.com",
       "EmailFrom": "support@yourcompany.com",
       "SenderName": "Customer Support"
    }

Sample request for adding a comment with SMS notification:

    POST /api/PrivateCustomers/AddComment
    {
       "CustomerId": "customer@example.com",
       "CommentText": "Your order has been shipped and will arrive within 2-3 business days.",
       "SendSms": true,
       "SmsPhoneNumber": "+4712345678"
    }

Notes:
- CreatedBy defaults to the current API user's username if not specified.
- EmailTo, EmailFrom, SenderName, and SmsPhoneNumber will fall back to the store's (or global) default settings in Omnium if not specified.
- EmailTo falls back to the customer's email. SmsPhoneNumber falls back to the customer's phone.

**Request body:** [`OmniumCustomerCommentRequest`](../../schemas/OmniumCustomerCommentRequest.md) — The comment request containing customer ID, comment text, and notification settings

**Responses:**

- 200: Comment added successfully
- 400: string — Invalid request
- 404: string — Customer not found

---

## `POST /api/PrivateCustomers/AddInternalComment`

**Add an internal comment to a customer**

Operation ID: `PrivateCustomersAddInternalComment`

Internal comments are only visible to Omnium users (not the customer).
If CreatedBy is not set, api user will be added as creator

Sample request for adding an internal comment without notifications:

    POST /api/PrivateCustomers/AddInternalComment
    {
       "CustomerId": "customer@example.com",
       "CommentText": "Customer called about delayed shipment. Promised to investigate."
    }

Sample request for adding an internal comment with email notification:

    POST /api/PrivateCustomers/AddInternalComment
    {
       "CustomerId": "customer@example.com",
       "CommentText": "Internal note regarding customer inquiry",
       "SendEmail": true,
       "EmailSubject": "Internal: Customer Follow-up Required",
       "EmailTo": "support@yourcompany.com"
    }

**Request body:** [`OmniumCustomerCommentRequest`](../../schemas/OmniumCustomerCommentRequest.md) — The comment request containing customer ID, comment text, and notification settings

**Responses:**

- 200: Internal comment added successfully
- 400: string — Invalid request
- 404: string — Customer not found
