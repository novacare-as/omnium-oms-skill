# OmniumSortField

Sort field and direction for query endpoints. Available field names are entity-specific.

**Fields:**

- `field`: string, nullable — Field to sort by. Available fields depend on the entity type. Examples for products: "price", "name", "modified", "created", "sortIndex", "relevance". Products also support sorting by a custom property via "properties.{key}", e.g. "properties.countryOfOrigin" (key match is case-insensitive; values sort as text; products without the property are placed last).
- `direction`: string, nullable — Sort direction: "asc" or "desc"
