# OmniumFieldSelection

Controls which fields are included or excluded in the response.
The Include/Exclude lists work with any entity type.
Entity-specific shorthand flags can be added in derived classes.

**Fields:**

- `include`: List<string>, nullable, max length 250 — Only return these specific fields. Fields use camelCase with dot notation for nested fields. When set, only these fields (plus Id) are returned.
- `exclude`: List<string>, nullable, max length 250 — Exclude these specific fields. Fields use camelCase with dot notation.
