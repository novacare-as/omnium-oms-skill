# Carts | Templates

Source: https://api.omnium.no/documentation

> Various endpoints for carts. Cart templates are typically used as an easy way to create multiple offers to customers in a B2B context, but can be used in other scenarios as well.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/CartTemplate/{id}`

**Get cart template**

Operation ID: `CartTemplateGetCartTemplate`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumCartTemplate`](../../schemas/OmniumCartTemplate.md) — Success

---

## `PUT /api/CartTemplate`

**Add or update cart template**

Operation ID: `CartTemplateUpdateCartTemplate`

Add or update cart template

**Request body:** [`OmniumCartTemplate`](../../schemas/OmniumCartTemplate.md) — Cart template

**Responses:**

- 200: [`OmniumCartTemplate`](../../schemas/OmniumCartTemplate.md) — Success

---

## `DELETE /api/CartTemplate`

**Delete cart template**

Operation ID: `CartTemplateDeleteCartTemplate`

Search cart templates

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartTemplateId` | query | string | No | The ID of the cart template |

**Responses:**

- 200: Success

---

## `POST /api/CartTemplate/Search`

**Search cart template orders**

Operation ID: `CartTemplateSearch`

Search cart templates

**Request body:** [`OmniumCartTemplateSearchRequestModel`](../../schemas/OmniumCartTemplateSearchRequestModel.md) — Search request object for cart templates

**Responses:**

- 200: [`OmniumCartTemplateOmniumSearchResult`](../../schemas/OmniumCartTemplateOmniumSearchResult.md) — Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request

---

## `POST /api/CartTemplate/CreateCartFromTemplate`

**Create cart from template**

Operation ID: `CartTemplateCreateCartFromTemplate`

Create cart from template

**Request body:** [`OmniumCartTemplateCreateCartRequest`](../../schemas/OmniumCartTemplateCreateCartRequest.md)

**Responses:**

- 200: [`OmniumCartTemplate`](../../schemas/OmniumCartTemplate.md) — Success
