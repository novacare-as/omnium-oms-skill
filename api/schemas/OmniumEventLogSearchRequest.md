# OmniumEventLogSearchRequest

Search request for event log items

**Fields:**

- `take`: integer (int32) — Number of items pr page
- `page`: integer (int32) — Page to fetch
- `createdFrom`: string (date-time), nullable — Events created after this time
- `createdTo`: string (date-time), nullable — Events created before this time
- `eventLogModel`: [`OmniumEventLogModelType`](OmniumEventLogModelType.md)
- `eventLogType`: [`OmniumEventLogType`](OmniumEventLogType.md)
- `storeIds`: List<string>, nullable — Events created in context of given stores
- `marketIds`: List<string>, nullable — Events created in context of given markets
- `eventLogItemId`: string, nullable — ID of OmniumEventLogItem
- `objectId`: string, nullable — ID of the object that the event occured for
- `status`: string, nullable — Status of the object
- `user`: string, nullable — The ID of the user who triggered the event

**Used directly by endpoints in:**

- [Event Log](../endpoints/event-log.md)
