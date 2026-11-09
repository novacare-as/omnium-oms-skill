# Webhook Workflow Step

Source: https://docs.omnium.no/docs/Order/workflow-steps/export/webhook-workflow-step

> Call an external HTTP endpoint during order processing, and optionally update the order from the response.

## Overview

The **Webhook workflow step** calls an external HTTP endpoint with the full order as a POST request, waits for a response, and optionally updates the order with data returned from the external system. This makes it suitable for validation, enrichment, fraud checks, or any custom logic that needs to run synchronously during order processing.

Unlike [Export Order](export-order.md) which is one-way (fire and forget), this step is **two-way** — the external system can modify the order by returning updated fields in the response.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `WebhookWorkflowStep` |
| **Group** | Export |
| **Applicable Statuses** | All |

* * *

## Setup

There are two ways to configure the webhook endpoint: **inline** on the workflow step, or via a **connector** in tenant settings.

### Option A: Inline (simplest)

Specify `Host` directly as a workflow step property. No connector setup needed. Use properties with `KeyGroup: "RequestHeaders"` to add authentication or other custom headers.

```json
{
  "name": "WebhookWorkflowStep",
  "active": true,
  "Connector": "Webhook",
  "Properties": [
    { "Key": "Host", "Value": "https://validation.example.com/api/validate" },
    { "Key": "Authorization", "Value": "Bearer your-token", "KeyGroup": "RequestHeaders" }
  ]
}
```

Optionally add `"StopOnError": true` to halt the workflow on failure. To set a specific order status on failure, add `ErrorStatus` to the properties:

```json
{
  "name": "WebhookWorkflowStep",
  "active": true,
  "Connector": "Webhook",
  "StopOnError": true,
  "Properties": [
    { "Key": "Host", "Value": "https://validation.example.com/api/validate" },
    { "Key": "Authorization", "Value": "Bearer your-token", "KeyGroup": "RequestHeaders" },
    { "Key": "ErrorStatus", "Value": "ValidationFailed" }
  ]
}
```

### Option B: Connector (for shared/reusable config)

If multiple workflow steps need the same endpoint, or you want to manage credentials separately, create a connector in tenant settings and reference it from the workflow step.

**Connector** (Configuration > Settings > Integrations > Connectors):

```json
{
  "Name": "Webhook",
  "ConnectorId": "my-validation-service",
  "DisplayName": "Order Validation",
  "Host": "https://validation.example.com/api/validate",
  "BearerToken": "your-token-here"
}
```

**Workflow step:**

```json
{
  "name": "WebhookWorkflowStep",
  "active": true,
  "Connector": "Webhook",
  "ConnectorId": "my-validation-service",
  "StopOnError": true,
  "Properties": [
    { "Key": "ErrorStatus", "Value": "ValidationFailed" }
  ]
}
```

The `ConnectorId` on the workflow step must match the `ConnectorId` on the connector. If you only have one webhook connector, you can omit `ConnectorId` on both — it will match by `Name` alone.

**Multiple connectors:** You can have several webhook connectors with different `ConnectorId` values, and reference them from different workflow steps. Connector selection priority: `ConnectorId` > market match > `Name`.

**Note:** If `Host` is set as a workflow step property, it takes precedence over the connector's Host for the actual HTTP call. You do not need a connector configured to use inline mode.

* * *

## Request Format

Omnium sends a `POST` request with the following body:

```json
{
  "Value": {
    "Id": "ORD-12345",
    "Status": "New",
    "CustomerEmail": "customer@example.com",
    "OrderLines": [ ... ],
    "ShippingAddress": { ... },
    "Properties": [ ... ]
  },
  "WorkflowStep": {
    "Name": "WebhookWorkflowStep",
    "Connector": "Webhook",
    "ConnectorId": "my-validation-service",
    "StopOnError": true,
    "Properties": [ ... ]
  },
  "ShipmentId": "SHIP-67890"
}
```

`Value` contains the full `OmniumOrder` object. `WorkflowStep` contains the step configuration, including any custom properties you added to the step. `ShipmentId` is included when the step runs in the context of a specific shipment, and identifies which shipment on the order triggered the call — useful because an order can have multiple shipments. The field is omitted when the step is not shipment-scoped.

**Headers included automatically:**

| Header | Description |
| --- | --- |
| `User-Agent` | `OmniumOms/{version}` |
| `Accept` | `application/json` |
| `X-Delivery-Count` | Current attempt number (starts at 1) |
| `X-Max-Delivery-Count` | Maximum attempts (default: 4) |

Plus any custom headers you configure via properties with `KeyGroup: "RequestHeaders"` on the workflow step (see [Setup](webhook-workflow-step.md#setup)).

When using a connector, `Authorization` is set automatically based on the connector's auth config (BearerToken, Username/Password).

* * *

## Building Your Webhook Endpoint

Your endpoint receives a POST request (see [Request Format](webhook-workflow-step.md#request-format) above) and must return a JSON response that tells Omnium what to do next. The response model is `OmniumOrderWorkflowExecutionPatchResult` and has two parts:

1.  **`OrderActionExecutionResults`** — tells Omnium whether the step succeeded or failed
2.  **`OrderPatch`** (optional) — updates to apply to the order

**Field name casing:** the response body is deserialized case-insensitively, so both `camelCase` and `PascalCase` field names are accepted. The canonical naming policy is **camelCase** (e.g. `orderActionExecutionResults`, `cancelWorkflow`, `orderPatch`). The examples below use PascalCase for readability, but `{ "orderActionExecutionResults": [ { "actionStatus": "Success" } ] }` works identically. This applies to the [return webhook step](https://docs.omnium.no/docs/Returns/return-workflow-steps/export/webhook-return-workflow-step) as well.

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

Include an `OrderPatch` with the fields you want to change. All fields are optional — only include what you want to update.

```json
{
  "OrderActionExecutionResults": [
    { "ActionStatus": "Success" }
  ],
  "OrderPatch": {
    "Status": "Validated",
    "Tags": ["fraud-checked"],
    "Properties": [
      { "Key": "ValidationScore", "Value": "95" }
    ]
  }
}
```

### Failure — stop the workflow

Set `CancelWorkflow` to `true`. If the workflow step has `StopOnError` enabled, this stops the workflow and sets the order status to `ErrorStatus`. Use `ErrorReason` to provide a message visible in the order history.

```json
{
  "OrderActionExecutionResults": [
    {
      "ActionStatus": "Error",
      "CancelWorkflow": true,
      "ErrorReason": "Shipping address could not be validated"
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

The `OrderPatch` object uses the same model as the [PATCH Order API](../../api-reference.md#patch-order). Key fields you can update:

`Status`, `OrderType`, `Tags`, `Properties`, `StoreId`, `CustomerEmail`, `CustomerPhone`, `CustomerName`, `BillingAddress`, `OrderForm` (order lines), `FollowUpDate`, `Assets`, `ExternalIds`, `OrderNotes`, `PublicOrderNotes`, `Errors`, `OrderOrigin`, `RelatedOrders`, `SalesPersonId`, `SalesPersonName`, `IsReadOnly`, `IsNotificationsDisabled`

* * *

## Behavior

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| HTTP 200, no `CancelWorkflow` | Success | Yes |
| HTTP 200 with `OrderPatch` | Success, order updated | Yes |
| HTTP 200 with `CancelWorkflow: true` and `StopOnError` | Error, status set to `ErrorStatus` | No |
| HTTP 200 with `CancelWorkflow: true`, no `StopOnError` | Warning | Yes |
| Connector not found | Error | Yes |

On success, an order event is created (operation: `ExecuteExportOrder`) and any previous `WebhookWorkflowStep` errors are cleared from the order.

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

## Related Steps

*   [Export Order](export-order.md) — One-way order export (no response handling)
