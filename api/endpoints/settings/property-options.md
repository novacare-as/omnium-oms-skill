# Settings | Property Options

Source: https://api.omnium.no/documentation

> Property options for products, customers, and other entities

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/PropertyOptions`

**Returns all options in a group, sorted by SortOrder ascending.**

Operation ID: `PropertyOptionsGetByGroup`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `group` | query | string | No | Group name (case-insensitive). |
| `includeInactive` | query | boolean | No | Include options where IsActive is false (defaults to false). |

**Responses:**

- 200: List<[`OmniumPropertyOption`](../../schemas/OmniumPropertyOption.md)> — Options returned.
- 400: string — Group is required.

---

## `POST /api/PropertyOptions`

**Create a new property option.**

Operation ID: `PropertyOptionsPost`

**Request body:** [`OmniumPropertyOption`](../../schemas/OmniumPropertyOption.md) — The option to create.

**Responses:**

- 201: [`OmniumPropertyOption`](../../schemas/OmniumPropertyOption.md) — Option created.
- 400: string — Invalid input.

---

## `GET /api/PropertyOptions/groups`

**Returns the list of distinct group display names.**

Operation ID: `PropertyOptionsGetGroups`

**Responses:**

- 200: List<string> — Group names returned.

---

## `POST /api/PropertyOptions/Search`

**Search property options with paging. Use this to look up specific options by id, group, or other filters without being limited by the per-group cap on the basic GET endpoint.**

Operation ID: `PropertyOptionsSearch`

**Request body:** [`OmniumPropertyOptionSearchRequest`](../../schemas/OmniumPropertyOptionSearchRequest.md) — Search filters and paging parameters.

**Responses:**

- 200: [`OmniumPropertyOptionOmniumResult`](../../schemas/OmniumPropertyOptionOmniumResult.md) — Search results returned.
- 400: string — Invalid request (e.g. Take exceeds the maximum of 1000).

---

## `POST /api/PropertyOptions/Scroll`

**Start a scroll over all property options matching the supplied filters. Use this when a group has more than ~20,000 options and offset paging via Search is not viable. Take is forced to 1000 and the client paging fields on the request body are ignored.**

Operation ID: `PropertyOptionsScrollSearch`

**Request body:** [`OmniumPropertyOptionSearchRequest`](../../schemas/OmniumPropertyOptionSearchRequest.md) — Search filters. Page and Take are ignored.

**Responses:**

- 200: [`OmniumPropertyOptionOmniumResult`](../../schemas/OmniumPropertyOptionOmniumResult.md) — First batch of results and a ScrollId. When ScrollId is null, all results have been returned.
- 400: string — Invalid request.

---

## `GET /api/PropertyOptions/Scroll/{id}`

**Continue a scroll started by POST /api/PropertyOptions/Scroll. Repeat with the returned ScrollId until ScrollId is null, which means all results have been returned and the server-side scroll has been cleared.**

Operation ID: `PropertyOptionsScroll`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ScrollId returned by the previous Scroll call. |

**Responses:**

- 200: [`OmniumPropertyOptionOmniumResult`](../../schemas/OmniumPropertyOptionOmniumResult.md) — Next batch of results. ScrollId is null when no more pages remain.

---

## `POST /api/PropertyOptions/AddMany`

**Create multiple property options in a single request.**

Operation ID: `PropertyOptionsAddMany`

**Request body:** List<[`OmniumPropertyOption`](../../schemas/OmniumPropertyOption.md)> — The options to create.

**Responses:**

- 201: List<[`OmniumPropertyOption`](../../schemas/OmniumPropertyOption.md)> — Options created.
- 400: string — Invalid input.

---

## `PUT /api/PropertyOptions/{id}`

**Update a property option. Group key is immutable; only Value, SortOrder, and IsActive can change.**

Operation ID: `PropertyOptionsPut`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Id of the option to update. |

**Request body:** [`OmniumPropertyOption`](../../schemas/OmniumPropertyOption.md) — The updated option payload.

**Responses:**

- 200: [`OmniumPropertyOption`](../../schemas/OmniumPropertyOption.md) — Option updated.
- 400: string — Invalid input.
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Option not found.

---

## `DELETE /api/PropertyOptions/{id}`

**Delete a property option. Does not modify any DefaultPropertyItem.PropertyOptionGroup references.**

Operation ID: `PropertyOptionsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Id of the option to delete. |

**Responses:**

- 200: Option deleted.
