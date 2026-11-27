# Order Status Log

Source: https://docs.omnium.no/docs/Order/order-logging/order-status-log

> Track shipment status transitions with precise timestamps and duration between changes for fulfillment performance analysis.

## Order Status Log

The Order Status Log tracks shipment status transitions with precise timestamps and the duration between each change. Unlike the [Event Log](event-log.md) (which logs all kinds of events), the Order Status Log focuses specifically on status progression and is stored directly on each Shipment object.

### Configuration

Enable the Order Status Log in your tenant settings:

```
"OrderSettings": {
  "UseOrderStatusLog": true
}
```

Each status is logged only once per shipment. If an order re-enters a previous status, it will not create a duplicate entry.

### Data Model

The `orderStatusLog` array on each shipment contains entries with:

| Property | Type | Description |
| --- | --- | --- |
| `status` | string | The order status that was entered |
| `timestamp` | DateTime | UTC timestamp when the status change occurred |
| `durationSincePreviousMs` | long? | Milliseconds since the previous status change (`null` for the first entry) |

### API Access

The status log is available on shipments via the public API:

```json
{
  "shipments": [
    {
      "shipmentId": "SHIP-001",
      "orderStatusLog": [
        {
          "status": "New",
          "timestamp": "2025-01-15T10:30:00Z",
          "durationSincePreviousMs": null
        },
        {
          "status": "Processing",
          "timestamp": "2025-01-15T10:45:00Z",
          "durationSincePreviousMs": 900000
        },
        {
          "status": "Shipped",
          "timestamp": "2025-01-15T14:20:00Z",
          "durationSincePreviousMs": 12900000
        }
      ]
    }
  ]
}
```

### Reports

When Order Status Log is enabled, two reporting features become available under **Reports** > **Order Reports** in the Omnium UI.

#### Average Handling Time by Status (Chart)

A horizontal bar chart that shows the average time orders spend in each status, measured in hours. The chart aggregates `durationSincePreviousMs` across all shipments matching your filters and displays one bar per status, sorted by longest duration first.

The chart updates dynamically when you change the report filters (date range, order statuses, order types, stores).

#### Order Progress Report (Export)

A downloadable report that shows the status duration timeline for every shipment. Each row represents a shipment, and each configured order status gets its own column showing the duration in seconds since the previous status transition.

The report columns are:

| Column | Description |
| --- | --- |
| OrderNumber | Order number |
| OrderId | Order ID |
| Store | Store name |
| ShipmentId | Shipment ID |
| ShipmentStatus | Current shipment status |
| ShippingMethod | Shipping method name |
| Created | Order created date |
| Completed | Order completed date |
| _<Status columns>_ | One column per order status, showing duration in seconds since the previous status |

The Order Progress Report is available in the export dropdown on the Order Reports page. It only appears when `UseOrderStatusLog` is enabled.

### Use Cases

*   **Measuring fulfillment performance**: Calculate how long orders spend in each status (e.g., time from "New" to "Picked", or "Packed" to "Shipped")
*   **Identifying bottlenecks**: Compare processing durations across warehouses or order types to find slow steps
*   **SLA compliance tracking**: Monitor whether orders are being processed within agreed timeframes
