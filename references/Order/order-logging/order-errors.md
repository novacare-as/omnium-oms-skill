# Order Errors

Source: https://docs.omnium.no/docs/Order/order-logging/order-errors

> How processing errors are tracked on orders, including the error model, severity levels, and resolution workflow.

## Order Errors

When order processing fails, errors are added to the order's error list. These errors provide structured information about what went wrong and are visible directly on the order.

### Error Model

The `errors` array on an order contains `EntityError` entries:

| Property | Type | Description |
| --- | --- | --- |
| `key` | string | Error identifier/code |
| `message` | string | Human-readable error message |
| `details` | string | Additional error details |
| `referenceId` | string | Reference to a related entity (e.g., shipment ID, payment ID) |
| `severity` | string | Error severity level |
| `occured` | DateTime | When the error occurred |
| `status` | string | Error status (e.g., `New`, `Solved`) |
| `comment` | string | Optional comment on the error (e.g., resolution notes) |

### How Errors Work

*   Orders with errors are **flagged visually** in the order list UI, making them easy to spot
*   Errors can be **reviewed** on the order detail page
*   Errors can be **resolved** by marking them as `Solved` with an optional comment
*   Workflow steps without `StopOnError` enabled will add an error but allow the workflow to continue

**Example error on an order:**

```json
{
  "errors": [
    {
      "key": "PaymentCaptureFailed",
      "message": "Payment capture failed for transaction TX-9876",
      "details": "Gateway returned: insufficient funds",
      "referenceId": "PAY-001",
      "severity": "Error",
      "occured": "2025-01-15T14:20:00Z",
      "status": "New",
      "comment": null
    }
  ]
}
```
