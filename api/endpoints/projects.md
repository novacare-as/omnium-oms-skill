# Projects

Source: https://api.omnium.no/documentation

> Projects

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Projects/{projectId}`

**Get single project**

Operation ID: `ProjectsGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project found and returned
- 400: string — Project ID is invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Project does not exist

---

## `GET /api/Projects/GetProjectsByPartner`

**Get all projects associated with supplier**

Operation ID: `ProjectsGetProjectsByPartner`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `partnerId` | query | string | No | Partner identification |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `sortOrder` | query | string | No | Property to sort by |

**Responses:**

- 200: [`OmniumProjectOmniumSearchResult`](../schemas/OmniumProjectOmniumSearchResult.md) — Projects found and returned
- 400: string — Parameters are invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — No projects found

---

## `GET /api/Projects/GetProjectsByCustomer`

**Get all projects associated with customer**

Operation ID: `ProjectsGetProjectsByCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | No | Customer identification |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `sortOrder` | query | string | No | Property to sort by |

**Responses:**

- 200: [`OmniumProjectOmniumSearchResult`](../schemas/OmniumProjectOmniumSearchResult.md) — Projects found and returned
- 400: string — Parameters are invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — No projects found

---

## `POST /api/Projects/Search`

**Search for projects**

Operation ID: `ProjectsSearch`

**Request body:** [`OmniumProjectSearchRequest`](../schemas/OmniumProjectSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumProjectOmniumSearchResult`](../schemas/OmniumProjectOmniumSearchResult.md) — Success

---

## `GET /api/Projects/Create`

**Add project to OMS.**

Operation ID: `ProjectsCreate`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectTypeId` | query | string | No | ID of the project type to create |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Projects created and returned
- 400: string — ProjectTypeId invalid

---

## `POST /api/Projects/AddLogItem`

**Add log item to project**

Operation ID: `ProjectsAddLogItem`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | No |  |

**Request body:** [`OmniumProjectLog`](../schemas/OmniumProjectLog.md)

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/Activate`

**Activate project - Used to reactivate cancelled projects or projects on hold. Will trigger reactivation notification if configured on the project type.**

Operation ID: `ProjectsActivate`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | Yes |  |
| `comment` | query | string | No |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request

---

## `POST /api/Projects/UpdateProjectStatus`

Operation ID: `ProjectsUpdateProjectStatus`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | No |  |
| `status` | query | string | No |  |
| `comment` | query | string | No |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request

---

## `POST /api/Projects/UpdateProjectProductStatus`

**Update the status of individual products in a project**

Operation ID: `ProjectsUpdateProjectProductStatus`

**Request body:** [`OmniumUpdateProjectProductStatusRequest`](../schemas/OmniumUpdateProjectProductStatusRequest.md) — Request containing project ID and per-product status updates

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Product statuses updated successfully. Updated project is returned.
- 400: string — Invalid request
- 404: string — Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Projects`

**Update project**

Operation ID: `ProjectsUpdateProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No | If true, workflow will be processed |

**Request body:** [`OmniumProjectUpdateRequest`](../schemas/OmniumProjectUpdateRequest.md) — Project to update

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with updated information. Updated project is returned.
- 400: string — Invalid project in request
- 404: string — Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `PATCH /api/Projects`

**Patch Project - update only values in request**

Operation ID: `ProjectsPatchProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No | If true, workflow will be processed |

**Request body:** [`OmniumProjectPatch`](../schemas/OmniumProjectPatch.md) — Project patches. Properties with value will be updated

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project updated successfully
- 400: string — Project patch is invalid
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Projects/{projectId}/partner/{businessCustomerId}`

**Add partner to project**

Operation ID: `ProjectsAddPartnerToProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |
| `businessCustomerId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with updated information. Updated project is returned.
- 400: string — Invalid project in request
- 404: string — Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `DELETE /api/Projects/{projectId}/partner`

**Delete partner from project**

Operation ID: `ProjectsDeletePartnerFromProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with updated information. Updated project is returned.
- 400: string — Invalid project in request
- 404: string — Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `GET /api/Projects/GetProjectTypes`

**Get all project types**

Operation ID: `ProjectsGetProjectTypes`

**Responses:**

- 200: List<[`OmniumProjectType`](../schemas/OmniumProjectType.md)> — Projects found and returned
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — No project types found

---

## `POST /api/Projects/AddCustomerToProject`

**Add customer info to a project**

Operation ID: `ProjectsAddCustomerToProject`

**Request body:** [`OmniumProject`](../schemas/OmniumProject.md) — Project containing customer object to store

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with new customer. Updated project is returned.
- 400: string — Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/AddBusinessCustomerToProject`

**Add existing business customer info to a project**

Operation ID: `ProjectsAddBusinessCustomerToProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | query | string | Yes | ID of project |
| `businessCustomerId` | query | string | Yes | ID of business customer |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with new customer. Updated project is returned.
- 404: string — Business customer not found

---

## `POST /api/Projects/AddStoreToProject`

**Add store id to a project**

Operation ID: `ProjectsAddStoreToProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No | If true, workflow will be processed |

**Request body:** [`OmniumProject`](../schemas/OmniumProject.md) — Project containing store id

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with new store. Updated project is returned.
- 400: string — Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/AddFormElementsToProject`

**Add information (key, value) to a project**

Operation ID: `ProjectsAddFormElementsToProject`

**Request body:** [`OmniumProject`](../schemas/OmniumProject.md) — Project containing form data

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project is saved with form elements. Updated project is returned.
- 400: string — Invalid project in request
- 404: Project not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `GET /api/Projects/{projectId}/Invoices`

**Get all invoices associated with project**

Operation ID: `ProjectsGetInvoicesForProject`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | Project identification |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1. |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1. |
| `isPaid` | query | boolean | No | Add filter on payment-status |

**Responses:**

- 200: [`OmniumInvoiceOmniumSearchResult`](../schemas/OmniumInvoiceOmniumSearchResult.md) — Invoices found and returned
- 400: string — Parameters are invalid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — No invoices found

---

## `POST /api/Projects/Cancel`

**Cancel project**

Operation ID: `ProjectsCancel`

**Request body:** [`OmniumProjectCancelRequest`](../schemas/OmniumProjectCancelRequest.md)

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/Decline`

**Decline workflow step (go to previous step)**

Operation ID: `ProjectsDecline`

**Request body:** [`OmniumWorkflowStepRequest`](../schemas/OmniumWorkflowStepRequest.md)

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/Accept`

**Accept workflow step (go to next step)**

Operation ID: `ProjectsAccept`

**Request body:** [`OmniumWorkflowStepRequest`](../schemas/OmniumWorkflowStepRequest.md)

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/AcceptPartnerRequest`

**Accept workflow step (go to next step)**

Operation ID: `ProjectsAcceptPartnerRequest`

**Request body:** [`OmniumWorkflowStepRequest`](../schemas/OmniumWorkflowStepRequest.md)

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/{projectId}/Partners`

**Add partners to project**

Operation ID: `ProjectsAddPartners`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerIds` | query | List<string> | No |  |
| `projectId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `DELETE /api/Projects/{projectId}/Partners`

**Delete partners from project**

Operation ID: `ProjectsDeletePartners`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `businessCustomerIds` | query | List<string> | No |  |
| `projectId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/DeclinePartnerRequest`

**Decline workflow step (go to previous step)**

Operation ID: `ProjectsDeclinePartnerRequest`

**Request body:** [`OmniumWorkflowStepRequest`](../schemas/OmniumWorkflowStepRequest.md)

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/GoToWorkflowStep`

**Go to specific workflow step**

Operation ID: `ProjectsGoToWorkflowStep`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No | Default true: the project type's workflow is processed for the step being moved to, which may notify the customer by email/SMS. Set to false to move the step silently - the step change, project log entry, deadline and any status transition are still saved, only the workflow actions are skipped |

**Request body:** [`OmniumWorkflowStepRequest`](../schemas/OmniumWorkflowStepRequest.md)

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Success
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/{projectId}/ChangeProjectType`

**Change the project type of a project, or refresh the project from the project type it already has**

Operation ID: `ProjectsChangeProjectType`

The workflow steps, check lists and the settings the project copies from its project type are taken from the project type again.
Leave ProjectTypeId empty to refresh the project from its current project type, for example after steps have been added to the project type.
Unless ResetWorkflowSteps is true, steps and check list items that match keep their dates and completion, and a project that stays on
its current step keeps its deadline.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes | ID of the project |
| `runWorkflow` | query | boolean | No | If true, the workflow actions of the new current step are processed, which may notify the customer by email/SMS |

**Request body:** [`OmniumChangeProjectTypeRequest`](../schemas/OmniumChangeProjectTypeRequest.md) — The project type and step to change to

**Responses:**

- 200: [`OmniumProject`](../schemas/OmniumProject.md) — Project type changed. Updated project is returned.
- 400: string — Invalid request, or the workflow step is not on the project type
- 404: string — Project or project type not found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/{projectId}/AddRejectingPartner`

**Add partner to list of partners rejecting project**

Operation ID: `ProjectsAddRejectingPartner`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |
| `rejectingPartnerId` | query | string | No | PartnerId |

**Responses:**

- 200: Partner successfully added to list of rejecting partners
- 400: string
- 404: string
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `DELETE /api/Projects/{projectId}/RemoveRejectingPartner`

**Remove partner from list of partners rejecting project**

Operation ID: `ProjectsRemoveRejectingPartner`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |
| `rejectingPartnerId` | query | string | No | PartnerId |

**Responses:**

- 200: Partner successfully removed from list of rejecting partners
- 400: string
- 404: string
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/Project/{projectId}/SendEmail`

**Send E-mail**

Operation ID: `ProjectsSendEmail`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |

**Request body:** [`OmniumEmailMessage`](../schemas/OmniumEmailMessage.md) — E-mail-message to send

**Responses:**

- 200: Email is sent
- 400: string — Email is invalid
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/Projects/Project/{projectId}/SendSms`

**Send SMS**

Operation ID: `ProjectsSendSms`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `projectId` | path | string | Yes |  |

**Request body:** [`OmniumSmsMessage`](../schemas/OmniumSmsMessage.md) — SMS-message to send

**Responses:**

- 200: SMS is sent
- 400: string — SMS is invalid
- 404: string — Not Found
- 409: [`ProblemDetails`](../schemas/ProblemDetails.md) — Conflict
