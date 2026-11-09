# Event Log

Source: https://docs.omnium.no/docs/Order/order-logging/event-log

> The primary audit trail for all order operations in Omnium, covering status changes, workflows, payments, notifications, and errors.

## Event Log

The Event Log is the primary audit trail for all order operations. Every significant action on an order — status changes, workflow executions, payment operations, notifications, errors, and more — produces an event log entry persisted to the search index.

The Event Log is always active and cannot be disabled.

### What Gets Logged

Events are categorized using the `category` field:

| Category | Description |
| --- | --- |
| `Created` | Order was created |
| `Updated` | Order was modified |
| `Canceled` | Order was canceled |
| `Workflow` | Workflow started or completed |
| `WorkflowStep` | Individual workflow step executed (see [Verbose Logging](verbose-logging.md)) |
| `Notification` | Notification sent (email, SMS) |
| `Comment` | Comment added to the order |
| `Error` | An error occurred during processing |
| `Exported` | Order exported to an external system |
| `Imported` | Order imported from an external system |
| `Deleted` | Order or related entity deleted |
| `Information` | General informational event |
| `Published` | Entity published |
| `Added` | Item added to an entity |
| `BatchUpdate` | Batch update operation |
| `BatchAdd` | Batch add operation |

Each event includes contextual information such as the user who triggered it, the order status, shipment ID, market, store, and the origin of the action (API path, scheduled task, etc.).

### Event Log Data Model

| Property | Type | Description |
| --- | --- | --- |
| `id` | string | Unique event identifier |
| `timestamp` | DateTime | When the event occurred |
| `message` | string | Human-readable description |
| `category` | string | Event category (see table above) |
| `className` | string | Entity type (e.g., `Order`) |
| `subClassName` | string | Sub-type (e.g., order type name) |
| `objectId` | string | Order ID |
| `status` | string | Order status at time of event |
| `previousStatus` | string | Previous order status (for transitions) |
| `shipmentId` | string | Related shipment ID (if applicable) |
| `user` | string | User who triggered the event |
| `userId` | string | User ID |
| `isError` | bool | Whether this is an error event |
| `origin` | string | Where the event originated (API path, scheduled task, etc.) |
| `attachments` | list | Attached data (workflow results, export results, etc.) |
| `properties` | list | Additional key-value properties |
| `tags` | list | Event tags |

### Viewing the Event Log

The Event Log can be accessed in two ways:

*   **Per order**: Open any order in the UI, click the three-dot menu, and select **Log**
*   **Globally**: Navigate to **Configuration** > **Advanced** > **Events** to browse all events across the system

For subscribing to events via webhooks and queues, see [Events and Webhooks](../../Integrations/events.md).

### Event Log Retention

Event log retention is configured in **Configuration** > **Settings** > **Platform** > **Event Log**:

| Setting | Type | Description |
| --- | --- | --- |
| `EventLogPreservationDays` | int | Number of days to keep general event log items |
| `EventLogOrderPreservationDays` | int | Number of days to keep order-specific event log items |

Both settings must be configured. The minimum recommended value is 7 days.
