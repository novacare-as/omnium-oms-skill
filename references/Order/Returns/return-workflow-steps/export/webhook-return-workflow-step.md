# Webhook Return Workflow Step

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/export/webhook-return-workflow-step

> Call an external HTTP endpoint during return processing, and optionally update the order from the response.

## Overview

The **Webhook Return Workflow Step** calls an external HTTP endpoint with the full order as a POST request, waits for a response, and optionally updates the order with data returned from the external system. This is the return equivalent of the [Webhook Workflow Step](../../../workflow-steps/export/webhook-workflow-step.md) used in order processing.

Unlike [Export Order](export-order.md) which is one-way (fire and forget), this step is **two-way** — the external system can modify the order by returning updated fields in the response.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `WebhookReturnWorkflowStep` |
| **Group** | Export |
| **Applicable Statuses** | Returned, PartiallyReturned |

* * *

## Setup

There are two ways to configure the webhook endpoint: **inline** on the workflow step, or via a **connector** in tenant settings. This works identically to the order-side [Webhook Workflow Step setup](../../../workflow-steps/export/webhook-workflow-step.md#setup).

### Option A: Inline (simplest)

Specify `Host` directly as a workflow step property. No connector setup needed. Use properties with `KeyGroup: "RequestHeaders"` to add authentication or other custom headers.

```json
{
  "name": "WebhookReturnWorkflowStep",
  "active": true,
  "connector": "Webhook",
  "properties": [
    { "key": "Host", "value": "https://erp.example.com/api/returns" },
    { "key": "Authorization", "value": "Bearer your-token", "keyGroup": "RequestHeaders" }
  ]
}
```

Optionally add `"stopOnError": true` to halt the workflow on failure. To set a specific order status on failure, add `ErrorStatus` to the properties:

```json
{
  "name": "WebhookReturnWorkflowStep",
  "active": true,
  "connector": "Webhook",
  "stopOnError": true,
  "properties": [
    { "key": "Host", "value": "https://erp.example.com/api/returns" },
    { "key": "Authorization", "value": "Bearer your-token", "keyGroup": "RequestHeaders" },
    { "key": "ErrorStatus", "value": "ReturnFailed" }
  ]
}
```

### Option B: Connector (for shared/reusable config)

If multiple workflow steps need the same endpoint, or you want to manage credentials separately, create a connector in tenant settings and reference it from the workflow step.

**Connector** (Configuration > Settings > Integrations > Connectors):

```json
{
  "Name": "Webhook",
  "ConnectorId": "my-return-service",
  "DisplayName": "Return Processing Service",
  "Host": "https://erp.example.com/api/returns",
  "BearerToken": "your-token-here"
}
```

**Workflow step:**

```json
{
  "name": "WebhookReturnWorkflowStep",
  "active": true,
  "connector": "Webhook",
  "connectorId": "my-return-service",
  "stopOnError": true,
  "properties": [
    { "key": "ErrorStatus", "value": "ReturnFailed" }
  ]
}
```

The `ConnectorId` on the workflow step must match the `ConnectorId` on the connector. If you only have one webhook connector, you can omit `ConnectorId` on both.

**Note:** If `Host` is set as a workflow step property, it takes precedence over the connector's Host for the actual HTTP call. You do not need a connector configured to use inline mode.

* * *

## Request Format

Omnium sends a `POST` request with the following body:

```json
{
  "Value": {
    "Id": "ORD-12345",
    "Status": "Returned",
    "OrderLines": [ ... ],
    "Properties": [ ... ]
  },
  "WorkflowStep": {
    "Name": "WebhookReturnWorkflowStep",
    "Connector": "Webhook",
    "StopOnError": true,
    "Properties": [ ... ]
  },
  "ReturnOrderFormId": "return-form-001"
}
```

`Value` contains the full `OmniumOrder` object. `WorkflowStep` contains the step configuration, including any custom properties. `ReturnOrderFormId` identifies which return triggered the workflow, allowing the external system to look up the specific return details.

**Headers included automatically:**

| Header | Description |
| --- | --- |
| `User-Agent` | `OmniumOms/{version}` |
| `Accept` | `application/json` |
| `X-Delivery-Count` | Current attempt number (starts at 1) |
| `X-Max-Delivery-Count` | Maximum attempts (default: 4) |

Plus any custom headers you configure via properties with `KeyGroup: "RequestHeaders"` on the workflow step.

When using a connector, `Authorization` is set automatically based on the connector's auth config (BearerToken, Username/Password).

* * *

## Building Your Webhook Endpoint

Your endpoint receives a POST request (see [Request Format](webhook-return-workflow-step.md#request-format) above) and must return a JSON response that tells Omnium what to do next. The response model is `OmniumOrderWorkflowExecutionPatchResult` — identical to the [order-side webhook](../../../workflow-steps/export/webhook-workflow-step.md#building-your-webhook-endpoint).

### Success — continue workflow, no changes

Return HTTP 200 with an empty body, `{}`, or:

```json
{
  "OrderActionExecutionResults": [
    { "ActionStatus": "Success" }
  ]
}
```

### Success — continue workflow, update the order

Include an `OrderPatch` with the fields you want to change:

```json
{
  "OrderActionExecutionResults": [
    { "ActionStatus": "Success" }
  ],
  "OrderPatch": {
    "Tags": ["return-synced"],
    "Properties": [
      { "Key": "ERPCreditNoteId", "Value": "CN-789" }
    ]
  }
}
```

### Failure — stop the workflow

Set `CancelWorkflow` to `true`. If the workflow step has `StopOnError` enabled, this stops the workflow and sets the order status to `ErrorStatus`.

```json
{
  "OrderActionExecutionResults": [
    {
      "ActionStatus": "Error",
      "CancelWorkflow": true,
      "ErrorReason": "Credit note creation failed in ERP"
    }
  ]
}
```

### OrderActionExecutionResults fields

| Field | Type | Description |
| --- | --- | --- |
| `ActionStatus` | string | `"Success"`, `"Warning"`, or `"Error"` |
| `CancelWorkflow` | bool | `true` to signal failure (workflow stops if `StopOnError` is set) |
| `ErrorReason` | string | Error message shown in order history |

### OrderPatch fields

The `OrderPatch` object uses the same model as the [PATCH Order API](../../../api-reference.md#patch-order). Key fields you can update:

`Status`, `OrderType`, `Tags`, `Properties`, `FollowUpDate`, `Assets`, `Origin`, `Errors`, `Name`

* * *

## Behavior

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| HTTP 200, no `CancelWorkflow` | Success | Yes |
| HTTP 200 with `OrderPatch` | Success, order updated | Yes |
| HTTP 200 with `CancelWorkflow: true` and `StopOnError` | Error, status set to `ErrorStatus` | No |
| HTTP 200 with `CancelWorkflow: true`, no `StopOnError` | Warning | Yes |
| Connector not found | Error | Yes |

On success, an order event is created and any previous `WebhookReturnWorkflowStep` errors are cleared from the order.

* * *

## Retry Policy

Failed requests are retried automatically: **3 retries** with delays of 1s, 5s, and 15s. Retries are triggered by network errors (timeouts, connection failures) and non-success HTTP responses (except 400 and 404, which are not retried). The `X-Delivery-Count` header tells your endpoint which attempt this is.

* * *

## Configuration Reference

### Workflow Step Properties

| Property | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `Connector` | Yes | string | — | Connector name (always `"Webhook"`) |
| `ConnectorId` | No | string | — | Matches a specific connector instance |
| `RunAfterOrderIsSaved` | No | bool | `false` | Wait for order to be persisted before calling webhook (adds 1s delay in worker context, refreshes the search index in web context) |
| `StopOnError` | No | bool | `false` | Stop workflow on failure |
| `TranslateKey` | No | string | — | UI translation key for the step name |

**Step-level properties** (set inside the `Properties` array):

| Key | Type | Description |
| --- | --- | --- |
| `Host` | string | Webhook endpoint URL (inline mode — takes precedence over connector) |
| `ErrorStatus` | string | Set order to this status on failure (only when `StopOnError` is true) |
| Properties with `KeyGroup: "RequestHeaders"` | — | Custom HTTP headers added to every request |

### Connector Properties

| Property | Type | Description |
| --- | --- | --- |
| `Name` | string | Must be `"Webhook"` |
| `ConnectorId` | string | Unique ID for this connector instance |
| `Host` | string | Webhook endpoint URL |
| `BearerToken` | string | Bearer token for `Authorization` header |
| `Username` / `Password` | string | Basic auth credentials |
| `Timeout` | TimeSpan | Response timeout (e.g. `"00:00:30"`) |
| `CustomHeaders` | list | Custom HTTP headers set on the HttpClient |
| `EnabledForMarkets` | string\[\] | Only use for these markets |
| `DisabledForMarkets` | string\[\] | Exclude these markets |

* * *

## Comparison with Export Order

| Feature | Export Order | Webhook Return Workflow Step |
| --- | --- | --- |
| Direction | One-way (fire and forget) | Two-way (can update order) |
| Response | `ExportLogItem` (success/fail) | `OmniumOrderWorkflowExecutionPatchResult` (success/fail + order patch) |
| Use case | Sync return data to external system | Custom logic with order updates (validation, enrichment, ERP sync with feedback) |

* * *

## Related Steps

*   [Export Order](export-order.md) — One-way return export (no response handling)
*   [Webhook Workflow Step](../../../workflow-steps/export/webhook-workflow-step.md) — The equivalent step for order workflows
