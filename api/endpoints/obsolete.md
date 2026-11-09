# Obsolete

Source: https://api.omnium.no/documentation

> Obsolete endpoints

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Cart/CreateOrderFromCart/{cartId}`

**Create order from cart. Use POST /api/carts/{cartId}/Checkout instead.**

Operation ID: `CartCreateOrderFromCartId` · **Deprecated**

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes |  |
| `orderType` | query | string | No | Order type to create (Pos, Online, ClickAndCollect, etc) |

**Responses:**

- 200: [`OmniumOrder`](../schemas/OmniumOrder.md) — Returning order
- 400: string — Bad Request
- 404: string — Cart does not exist

---

## `POST /api/Orders/{orderId}/Return`

**Create a return with all or some of the line items. Will also credit payment.**

Operation ID: `OrdersReturn` · **Deprecated**

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the order |

**Request body:** [`OmniumReturnRequestModel`](../schemas/OmniumReturnRequestModel.md) — List of items to return. StoreId for return and userId

**Responses:**

- 200: Success

---

## `GET /api/PrivateCustomers/Search`

**Search for private customers. Obsolete: Please use POST api/privateCustomers/search instead.**

Operation ID: `PrivateCustomerFreeTextSearch` · **Deprecated**

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `query` | query | string | No | Search query |

**Responses:**

- 200: [`OmniumPrivateCustomerOmniumSearchResult`](../schemas/OmniumPrivateCustomerOmniumSearchResult.md) — Success

---

## `GET /api/PrivateCustomers/GetAll`

**Get all private customers**

Operation ID: `PrivateCustomersGetAll` · **Deprecated**

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `sortOrder` | query | string | No | Sort order. E.g. ModifiedAscending, ModifiedDescending, CreatedAscending, CreatedDescending |
| `changedSince` | query | string (date-time) | No | Customers added or modified since a given date and time |

**Responses:**

- 200: [`OmniumPrivateCustomerOmniumSearchResult`](../schemas/OmniumPrivateCustomerOmniumSearchResult.md) — Success

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/AddWithConsents`

**Add customer to customer club member with consents. Customer is created if not exist.**

Operation ID: `PrivateCustomersAddNewCustomerClubMemberWithConsents` · **Deprecated**

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

Use: {id}/CustomerClubMember/AddWithConsentList instead.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Request body:** [`OmniumCustomerClubConsents`](../schemas/OmniumCustomerClubConsents.md) — Consents for this membership

**Responses:**

- 200: [`OmniumCustomerClubMember`](../schemas/OmniumCustomerClubMember.md) — Customer club object with summary
- 400: string — Could not create customer club member

---

## `POST /api/PrivateCustomers/{id}/CustomerClubMember/UpdateConsents`

**Update consents for customer club member**

Operation ID: `PrivateCustomersUpdateCustomerClubMemberConsents` · **Deprecated**

NB! Only to be used when customer club is enabled/added to the license for tenant. Send email to support@omnium.no if you need more information.

Use: {id}/CustomerClubMember/UpdateConsentList instead.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the customer |

**Request body:** [`OmniumCustomerClubConsents`](../schemas/OmniumCustomerClubConsents.md) — Consents for this membership

**Responses:**

- 200: [`OmniumCustomerClubMember`](../schemas/OmniumCustomerClubMember.md) — Customer club object with summary
- 404: string — Club member not found, or customer not found

---

## `POST /api/Products/Variants/Search`

**Search for variants \| Obsolete: Use product search instead.**

Operation ID: `ProductsSearchVariants` · **Deprecated**

**Request body:** [`OmniumProductSearchRequest`](../schemas/OmniumProductSearchRequest.md)

**Responses:**

- 200: [`OmniumProductListItemViewModelOmniumSearchResult`](../schemas/OmniumProductListItemViewModelOmniumSearchResult.md) — Search successful, returning variants
- 400: Search request invalid

---

## `POST /api/Products/Variants/ReindexVariantIndexByProductIds`

**Reindex variant index by product id**

Operation ID: `ProductsReindexVariantIndexByProductIds` · **Deprecated**

**Request body:** List<string>

**Responses:**

- 201: Reindex successful
- 400: string — Invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Products do not exist

---

## `POST /api/Projects/AddCommentToProject`

**Add partner comment to a project**

Operation ID: `ProjectsAddCommentToProject` · **Deprecated**

OBSOLETE - Use 'api/Comments/Add' instead

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md) — Partner comment to add to project

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with new comment. Updated project is returned.
- 400: Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `PATCH /api/Projects/{projectId}/customerComment/{commentId}`

**Update customer comment on a project**

Operation ID: `ProjectsUpdateCustomerComment` · **Deprecated**

OBSOLETE - Use 'api/Comments/Update' instead

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | ProjectId of the comment's project |
| `commentId` | path | string | Yes | Id of comment to update |

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md) — Customer comment to update on project

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with the updated version of the customer comment. Updated project is returned.
- 400: Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Projects/{projectId}/partnerComment`

**Add partner comment to a project**

Operation ID: `ProjectsAddPartnerCommentToProject` · **Deprecated**

OBSOLETE - Use 'api/Comments/Add' instead

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID to add comment to |
| `emailRecipient` | query | string | No | E-mail address if comment should be sent by e-mail |
| `smsRecipient` | query | string | No | Phone number if comment should be sent by SMS |

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md) — Partner comment to add to project

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with new partner comment. Updated project is returned.
- 400: Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `PATCH /api/Projects/{projectId}/partnerComment/{commentId}`

**Update partner comment on a project**

Operation ID: `ProjectsUpdatePartnerComment` · **Deprecated**

OBSOLETE - Use 'api/Comments/Update' instead

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | ProjectId of the comment's project |
| `commentId` | path | string | Yes | Id of comment to update |

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md) — Partner comment to update on project

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with the updated version of the partner comment. Updated project is returned.
- 400: Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Projects/{projectId}/customerComment`

**Add customer comment to project**

Operation ID: `ProjectsAddCustomerCommentToProject` · **Deprecated**

OBSOLETE - Use 'api/Comments/Add' instead

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID to add customer comment to |
| `emailRecipient` | query | string | No | E-mail address if comment should be sent by e-mail |
| `smsRecipient` | query | string | No | Phone number if comment should be sent by SMS |

**Request body:** [`OmniumComment`](../schemas/OmniumComment.md) — Customer comment to add to project

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with new customer comment. Updated project is returned.
- 400: Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `GET /api/Projects/CancelByPartner`

**Cancel project by partner**

Operation ID: `ProjectsCancelByPartner` · **Deprecated**

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | No |  |
| `comment` | query | string | No |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success

---

## `GET /api/Projects/CancelByCustomer`

**Cancel project by customer**

Operation ID: `ProjectsCancelByCustomer` · **Deprecated**

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | No |  |
| `comment` | query | string | No |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
