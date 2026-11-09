# OmniumExcludedProductFieldOptions

Options for excluding fields

**Fields:**

- `isEverythingExcluded`: boolean, nullable — Exclude all properties, except for ID. This would only be useful when used together with IncludedFields
- `isVariantsExcluded`: boolean, nullable — Exclude all variant data
- `isProductCategoriesExcluded`: boolean, nullable — Exclude all product categories
- `isPropertiesExcluded`: boolean, nullable — Exclude all custom properties
- `isPricesExcluded`: boolean, nullable — Excluded all prices
- `isAssetsExcluded`: boolean, nullable — Exclude all assets (not MainImageUrl)
- `isInventoryExcluded`: boolean, nullable — Exclude all inventory
- `specificFields`: List<string>, nullable, max length 250 — List of specific fields to exclude. Fields should be camel cased and levels should be seperated with a dot (.),  such as "description", "prices.properties" or "variant.productCategories"
