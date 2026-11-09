# OmniumEventLogItem

**Fields:**

- `id`: string, nullable — Event log item ID
- `timestamp`: string (date-time) — Timestamp for when the event occured (UTC)
- `eventLogModel`: [`OmniumEventLogModelType`](OmniumEventLogModelType.md)
- `eventLogType`: [`OmniumEventLogType`](OmniumEventLogType.md)
- `objectId`: string, nullable — ID of the object that the event occured for
- `status`: string, nullable — The status of the object
- `market`: string, nullable — The market the event occured in context of
- `storeId`: string, nullable — The market the event occured in context of
- `userName`: string, nullable — The name of the user who triggered the event
- `userId`: string, nullable — The ID of the user who triggered the event
- `message`: string, nullable — SMS notification text sent to the customer. Null for non-SMS or non-notification events.
- `attachments`: List<[`OmniumEventDataAttachment`](OmniumEventDataAttachment.md)>, nullable — Structured attachments containing additional event data (e.g. SMS recipient phone number)

**Used directly by endpoints in:**

- [Event Log](../endpoints/event-log.md)
