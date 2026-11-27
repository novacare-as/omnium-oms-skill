# Projects | Change orders

Source: https://api.omnium.no/documentation

> Project change orders

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/{projectId}/ChangeOrders/{projectChangeOrderId}`

**Get project change order**

Operation ID: `ProjectsChangeOrdersGetProjectChangeOrder`

Get project change order by project ID and project change order ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `changeOrderId` | query | string | No | Project change order ID to get |
| `projectChangeOrderId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProjectChangeOrder`](../../schemas/OmniumProjectChangeOrder.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/Projects/{projectId}/ChangeOrders/{projectChangeOrderId}`

**Update project change order**

Operation ID: `ProjectsChangeOrdersProjectChangeOrderDelete`

Delete project change order by project and project change order ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |
| `projectChangeOrderId` | path | string | Yes | Project change order ID to delete |

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Projects/{projectId}/ChangeOrders`

**Add project change order**

Operation ID: `ProjectsChangeOrdersProjectChangeOrderAdd`

Add project change order by project ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** [`OmniumProjectChangeOrder`](../../schemas/OmniumProjectChangeOrder.md) — Project change order to add

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Projects/{projectId}/ChangeOrders`

**Update project change orders**

Operation ID: `ProjectsChangeOrdersProjectChangeOrdersUpdate`

Update or add project change order by project ID. Projects change orders with same ID will be overriden.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** [`OmniumProjectChangeOrder`](../../schemas/OmniumProjectChangeOrder.md) — Project change order to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Projects/{projectId}/ChangeOrders/AddMany`

**Update many project change orders**

Operation ID: `ProjectsChangeOrdersProjectChangeOrdersAddMany`

Add project change orders by project ID.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** List<[`OmniumProjectChangeOrder`](../../schemas/OmniumProjectChangeOrder.md)> — Project change orders to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Projects/{projectId}/ChangeOrders/UpdateMany`

**Update many project change orders**

Operation ID: `ProjectsChangeOrdersProjectChangeOrderUpdateMany`

Update or add project change orders by project ID. Projects change orders with same ID will be overriden.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project ID |

**Request body:** List<[`OmniumProjectChangeOrder`](../../schemas/OmniumProjectChangeOrder.md)> — Project change orders to add or update

**Responses:**

- 200: [`OmniumProject`](../../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
