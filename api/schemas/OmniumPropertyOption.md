# OmniumPropertyOption

A single value belonging to a centrally managed dropdown option group.

**Fields:**

- `id`: string, nullable — Unique identifier (auto-generated GUID if omitted on create).
- `group`: string, required, max length 100 — Group key. Stored normalized (lowercase, trimmed). Used to look up options for a property dropdown.
- `groupDisplayName`: string, nullable, max length 100 — Group display name shown in the UI. Preserves original casing from first creation.
- `value`: string, required, max length 500 — The selectable option text shown in the dropdown.
- `sortOrder`: integer (int32) — Sort order within the group (ascending).
- `isActive`: boolean — When false, the option is hidden from end-user dropdowns but kept in the admin UI.
- `allowAddingNewValuesInline`: boolean — When true, end users may add new values to this group from the property editor (with confirmation). Propagated across all options in the group.
- `createdDate`: string (date-time) — UTC timestamp of when this option was created.

**Used directly by endpoints in:**

- [Settings | Property Options](../endpoints/settings/property-options.md)
