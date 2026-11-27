# OmniumOpeningHoursPatch

Class for storing store opening hours

**Fields:**

- `isOpen`: boolean, nullable — False if closed entire day, true if open this day
- `openFrom`: string, nullable — Closed stores should be set to 00:00:00 (TimeSpan.Zero)
- `openTo`: string, nullable — Closed stores should be set to 00:00:00 (TimeSpan.Zero)
- `extraIntervals`: List<[`OmniumOpeningHoursInterval`](OmniumOpeningHoursInterval.md)>, nullable, max length 10 — Further periods the store is open on the same day. Null keeps the current periods, an empty list removes them, and a list replaces them
