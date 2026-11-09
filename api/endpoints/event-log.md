# Event Log

Source: https://api.omnium.no/documentation

> Event log endpoints

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/EventLog/Search`

**Search in the event log**

Operation ID: `EventLogSearch`

**Request body:** [`OmniumEventLogSearchRequest`](../schemas/OmniumEventLogSearchRequest.md)

**Responses:**

- 200: [`OmniumEventLogItemOmniumResult`](../schemas/OmniumEventLogItemOmniumResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/EventLog/SearchByPrevious/{eventLogModel}/{objectId}`

**Search for events based on previous event**

Operation ID: `EventLogSearchByPrevious`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `eventLogModel` | path | [`OmniumEventLogModelType`](../schemas/OmniumEventLogModelType.md) | Yes | Type of the object the event occured for |
| `objectId` | path | string | Yes | Id of the object the event occured for |

**Request body:** [`OmniumEventLogCompareRequest`](../schemas/OmniumEventLogCompareRequest.md)

**Responses:**

- 200: List<[`OmniumEventLogItem`](../schemas/OmniumEventLogItem.md)> — Success
- 204: Success
- 400: string — Bad Request
