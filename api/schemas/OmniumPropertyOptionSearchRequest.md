# OmniumPropertyOptionSearchRequest

Search request for property options.

**Fields:**

- `take`: integer (int32) — Number of items per page. Defaults to 50 when zero. Max 1000.
- `page`: integer (int32) — Page to fetch (1-based). Defaults to 1 when zero.
- `group`: string, nullable — Group key (case-insensitive). When set, only options in this group are returned.
- `query`: string, nullable — Free text prefix match against the option value (case-insensitive).
- `ids`: List<string>, nullable — Filter to a specific set of option ids.
- `createdFrom`: string (date-time), nullable — Only return options created at or after this UTC timestamp.
- `createdTo`: string (date-time), nullable — Only return options created at or before this UTC timestamp.
- `isActive`: boolean, nullable — Filter by active state. Leave null to include both active and inactive options.

**Used directly by endpoints in:**

- [Settings | Property Options](../endpoints/settings/property-options.md)
