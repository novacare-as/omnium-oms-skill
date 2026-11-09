# Order Locking

Source: https://docs.omnium.no/docs/Order/order-locking

> How concurrent order updates behave in Omnium, how to enable the optional per-order lock for your tenant, and how to handle the 409 ResourceLocked response.

Every order write in Omnium, whether it comes from the API, the Omnium UI, or a workflow run, loads the order, applies the change, and saves the whole order back. There is no field-level merge between requests. When two requests for the same order overlap, the request that saves last wins, and it overwrites every change the other request made, including fields it did not touch itself.

Order locking is an optional, per-tenant feature that prevents this. When it is enabled, an order can only be modified by one operation at a time. A second request for the same order is rejected with `409 Conflict` instead of silently overwriting or being overwritten.

This page describes what happens with and without the lock, which endpoints use it, what the conflict response looks like, and how to write an integration that behaves correctly in both cases.

## Why concurrent order writes conflict

Consider an ERP integration that writes its own order number to an order and then moves the order to the next status, as two separate calls issued without waiting for the first to complete:

1.  `PATCH /api/Orders/{orderId}/PatchOrder` with `externalIds` is received. Omnium loads the order, adds the external ID, and starts saving.
2.  `POST /api/Orders/{orderId}/UpdateStatus` is received a few hundred milliseconds later. Omnium loads the order. The save from step 1 has not completed yet, so the loaded order has no external ID.
3.  The status update runs its workflow and saves the whole order. This save lands after the save from step 1 and replaces it.

The result is an order in the new status without the external ID. Neither request failed. Both returned `200 OK`.

The same happens between any two writers: two integrations, an integration and a user editing the order in the UI, or a workflow that runs for a long time while another request modifies the same order. A workflow run operates on the order as it was loaded when the request started and saves it when the workflow completes, so a change made by another request in between is lost.

Without order locking there is no error, no warning, and no conflict response when two writes overlap. The only trace is the order's version history, where the later version is missing the earlier change.

## Enable order locking for your tenant

Order locking is disabled by default. It is enabled per tenant by Omnium; contact Omnium support to have it turned on for your environments.

Once enabled, the lock applies to every locking endpoint listed below, to order status changes made in the Omnium UI, and to asynchronous workflow processing. It is not something a single API call opts into or out of.

## How the lock works

When a request reaches a locking endpoint, Omnium acquires a lock on the order ID before the request is processed and releases it when the response has been produced. While the lock is held, any other locking request for the same order ID fails immediately with `409 Conflict`. Requests are not queued and do not wait for the lock to become free; the caller decides when to retry.

Each lock has a maximum duration as a safety net in case a request never completes. Standard updates hold the lock for at most 30 seconds. Endpoints that run the order workflow hold it for at most 300 seconds, because workflow steps such as payment capture, ERP export, and shipment booking can take time. A request that finishes earlier releases the lock immediately; the maximum duration is not a wait time.

The lock is per order. Requests for different orders never block each other.

### Asynchronous workflow processing

`UpdateStatus` with `executeWorkFlowAsync: true` and `OrderLinesUpdate` with `enqueue: true` return `202 Accepted` and process the update in the background. The background processing also takes the order lock. If the order is locked, or temporarily read-only because another workflow is still processing it, when the queued update is picked up, the update is retried with increasing delays (1, 3, 5, 10, and 20 seconds). If the order is still locked after the last retry, the update is not applied: an error is written on the order and an error event is emitted, so you can detect the failure through the order's `errors` list or an event subscription.

## Endpoints that lock the order

The following endpoints acquire the order lock when order locking is enabled for the tenant.

| Method | Endpoint | Maximum lock duration |
| --- | --- | --- |
| POST | `/api/Orders/Update` | 300 s |
| PUT | `/api/Orders/Update` | 30 s |
| POST | `/api/Orders/{orderId}/UpdateStatus` | 300 s |
| POST | `/api/Orders/{orderId}/OrderLinesUpdate` | 300 s |
| PATCH | `/api/Orders/{orderId}/PatchOrder` | 30 s |
| PATCH | `/api/Orders/{orderId}/PatchUpdateOrderLines` | 30 s |
| POST | `/api/Orders/PatchLineItemIds` | 30 s |
| POST | `/api/Orders/{orderId}/OrderLines` | 30 s |
| POST | `/api/Orders/{orderId}/AddManyOrderLines` | 30 s |
| POST | `/api/Orders/{orderId}/OrderLines/{lineItemId}/Cancel` | 30 s |
| PUT | `/api/Orders/{orderId}/AddOrderLineProperties` | 30 s |
| PUT | `/api/Orders/{orderId}/AddPayments` | 30 s |
| POST | `/api/Orders/{orderId}/AddPayments` | 30 s |
| PUT | `/api/Orders/{orderId}/PutPayments` | 30 s |
| POST | `/api/Orders/{orderId}/CreditPayment` | 30 s |
| PUT | `/api/OrderShipments/{orderId}` | 30 s |
| PATCH | `/api/OrderShipments/{orderId}` | 30 s |
| DELETE | `/api/OrderShipments/{orderId}/DeleteShipments` | 30 s |
| PUT | `/api/OrderShipments/{orderId}/AddOrderLinesToShipment` | 30 s |
| PUT | `/api/OrderShipments/{orderId}/RemoveOrderLinesFromShipment` | 30 s |

Order write endpoints not in this table, such as `POST /api/Orders/OrderLines/Cancel` for cancelling lines across several orders, do not take the lock. Read endpoints never take the lock and are never blocked by it.

## The 409 ResourceLocked response

When the order is locked by another operation, the response is `409 Conflict` with a JSON body:

```json
{
  "error": "ResourceLocked",
  "message": "The requested resource is currently being processed by another operation. Please try again.",
  "retryAfter": 27,
  "lockHolder": "erp-integration@example.com",
  "lockedSince": "2026-08-31T13:54:45.871Z",
  "operation": "UpdateStatusWorkflow",
  "resourceStatus": "Open"
}
```

| Field | Type | Description |
| --- | --- | --- |
| `error` | string | Always `ResourceLocked`. Use this to tell a lock conflict apart from other `409` responses |
| `message` | string | Human-readable description |
| `retryAfter` | int | Seconds until the current lock expires at the latest. The lock is usually released well before this |
| `lockHolder` | string | The user or API user whose request holds the lock, or `System` when background processing holds it |
| `lockedSince` | datetime | When the lock was acquired (UTC) |
| `operation` | string | The operation holding the lock, for example `UpdateStatusWorkflow`, `PatchOrder`, or `UpdateAndWorkflow`. Background processing reports `Queue:` followed by the queue name |
| `resourceStatus` | string | The order status sent in the lock holder's request, when that request had one. Otherwise `null` |

`409 Conflict` is also returned by `POST /api/Orders` when an order with the same ID already exists. That response has a plain-text body, not a JSON body with `error: "ResourceLocked"`. Check the body before treating a `409` as a lock conflict.

## Handle order locking in your integration

Whether or not locking is enabled for your tenant, the safest pattern is the same. Locking turns a silent overwrite into a visible error; it does not order your requests for you.

*   **Send dependent writes in sequence.** Wait for the response to one write before sending the next write for the same order. This alone prevents the overwrite described above, with or without the lock.
*   **Combine changes into one request where the API allows it.** `PatchOrder` accepts `status` together with `externalIds` and other fields, so an external order number and a status change can be written in a single patch without running any workflow steps. `UpdateStatus` accepts shipment information alongside the status.
*   **Retry on `ResourceLocked`.** When the body has `"error": "ResourceLocked"`, wait a short time (a few seconds, or up to `retryAfter` seconds) and send the same request again. Status updates and patches are safe to repeat.
*   **Handle `409` as a possible lock conflict on every locking endpoint**, not only the workflow endpoints. A patch can be rejected because a workflow is running on the order, and a status update can be rejected because a user is changing the order status in the UI.
*   **Verify critical fields after a status change.** If you write an external ID and then change the status in separate requests, read the order back after the status change and re-apply the external ID if it is missing. This protects you if a third party writes to the order at the same time.

Without locking, the same integration behaves identically as long as its own writes are sequential; the difference is that a conflict with another writer is not reported.

## Related documentation

*   [Order API reference](api-reference.md)
*   [Workflow endpoints](api-reference/workflow.md)
*   [Order lifecycle](order-lifecycle.md)
*   [Troubleshooting](../Integrations/troubleshooting.md)
