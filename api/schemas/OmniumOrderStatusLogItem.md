# OmniumOrderStatusLogItem

Represents a single step in an order's status timeline, including the timestamp of the status change and the duration since the previous step.

**Fields:**

- `status`: string, nullable — The status the order entered at this point in the timeline.
- `timestamp`: string (date-time) — The exact time when the order first entered this status. Stored in UTC.
- `durationSincePreviousMs`: integer (int64), nullable — The duration in milliseconds since the previous status was recorded. Null for the first status.
