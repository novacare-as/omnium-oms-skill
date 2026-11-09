# OmniumDefaultPropertyItem

**Fields:**

- `valueOptions`: List<string>, nullable, max length 250 — For predefined options (multiselect)
- `isCustomValueOptionAllowed`: boolean — Allow adding custom values.
- `isMultiSelectEnabled`: boolean — Only relevant for the "DropDown" valueType. If true, multiple values can be selected.
- `readOnly`: boolean — Make property read only
- `propertyOptionGroup`: string, nullable — Name of a centrally managed PropertyOption group whose values should populate this dropdown. When set, takes precedence over ValueOptions.
- `key`: string, nullable — Property key
- `value`: string, nullable — Property value
- `valueType`: string, nullable — Data type (Number, Xhtml, String, DateTime, Boolean, etc)
- `keyGroup`: string, nullable — For grouping properties
