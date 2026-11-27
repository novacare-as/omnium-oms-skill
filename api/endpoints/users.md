# Users

Source: https://api.omnium.no/documentation

> Administrate users and roles

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Role/{roleId}`

**Get role by ID**

Operation ID: `RoleGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `roleId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumRole`](../schemas/OmniumRole.md) — Success
- 404: string — Not Found

---

## `DELETE /api/Role/{roleId}`

**Delete a role**

Operation ID: `RoleDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `roleId` | path | string | Yes |  |

**Responses:**

- 200: Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `GET /api/Role/GetAll`

**Get all roles**

Operation ID: `RoleGetAll`

**Responses:**

- 200: List<[`OmniumRole`](../schemas/OmniumRole.md)> — Success
- 404: string — Not Found

---

## `POST /api/Role/Add`

**Add a new OmniumRole**

Operation ID: `RoleAdd`

**Request body:** [`OmniumRole`](../schemas/OmniumRole.md)

**Responses:**

- 201: [`OmniumRole`](../schemas/OmniumRole.md) — Success
- 400: string — Bad Request

---

## `PUT /api/Role/Update`

**Update a role**

Operation ID: `RoleUpdate`

**Request body:** [`OmniumRole`](../schemas/OmniumRole.md)

**Responses:**

- 200: [`OmniumRole`](../schemas/OmniumRole.md) — Success
- 400: string — Bad Request

---

## `POST /api/User/Add`

**Add a new omnium user. ID must be a valid email-address and not be in use by another user.**

Operation ID: `UserAdd`

**Request body:** [`OmniumUserModel`](../schemas/OmniumUserModel.md) — The user object

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `PUT /api/User`

**Add or save a user. ID must be a valid email-address.**

Operation ID: `UserPut`

**Request body:** [`OmniumUserModel`](../schemas/OmniumUserModel.md) — The user object

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `GET /api/User/{id}`

**Get an omnium user.**

Operation ID: `UserGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumUserModel`](../schemas/OmniumUserModel.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PATCH /api/User/{id}`

**Patch user - update only values in request**

Operation ID: `UserPatchUser`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | User ID to patch |

**Request body:** [`OmniumUserPatch`](../schemas/OmniumUserPatch.md) — Patch request

**Responses:**

- 200: User updated successfully
- 400: string — Invalid userId

---

## `DELETE /api/User/{id}`

**Deletes a single user from the OMS**

Operation ID: `UserDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `GET /api/User/GetAll`

**Get all users**

Operation ID: `UserGetAll`

Valid sort orders: UserAscending, UserDescending, CreatedAscending, CreatedDescending, LastLoginAscending, LastLoginDescending, FirstnameLastnameEmail

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `sortOrder` | query | string | No | Sort order (optional) |

**Responses:**

- 200: List<[`OmniumUserModel`](../schemas/OmniumUserModel.md)> — Success
- 404: string — Not Found
