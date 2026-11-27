# OmniumOpeningHours

Class for storing store opening hours

**Fields:**

- `isOpen`: boolean — False if closed entire day, true if open this day
- `openFrom`: string — Closed stores should be set to 00:00:00 (TimeSpan.Zero)
- `openTo`: string — Closed stores should be set to 00:00:00 (TimeSpan.Zero)
- `extraIntervals`: List<[`OmniumOpeningHoursInterval`](OmniumOpeningHoursInterval.md)>, nullable, max length 10 — Further periods the store is open on the same day, for a store that closes during the day. A store open 09:00-12:00 and 13:00-17:00 has OpenFrom 09:00, OpenTo 12:00 and one extra interval 13:00-17:00. OpenFrom-OpenTo is always the earliest period of the day, and the periods must not overlap.
