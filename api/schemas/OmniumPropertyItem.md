# OmniumPropertyItem

Generic property item (key values)

**Fields:**

- `key`: string, nullable — Property key
- `value`: string, nullable — Property value
- `valueType`: string, nullable — Data type (Number, Xhtml, String, DateTime, Boolean, etc)
- `keyGroup`: string, nullable — For grouping properties
- `items`: List<[`OmniumPropertyItemValue`](OmniumPropertyItemValue.md)>, nullable, max length 100 — Sub-properties of this property, so one property holds a record of several values, e.g. a material with its share of the product. Supported on products and product variants, where they are searchable through the Property, IncludedProperties and ExcludedProperties product search filters: every requested item must match on the same property. Other entities store them with the property.
