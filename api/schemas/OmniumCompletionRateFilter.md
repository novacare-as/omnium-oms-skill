# OmniumCompletionRateFilter

Filter options for product completion rate

**Fields:**

- `min`: integer (int32), nullable — Minimum completion rate percentage (0-100)
- `max`: integer (int32), nullable — Maximum completion rate percentage (0-100)
- `isValid`: boolean, nullable — Filter by completion validity. True returns only products where all required fields are filled in. False returns only products missing required fields.
- `field`: string, nullable — Filter by a specific field name to check if it is completed or not. Use together with IsCompleted.
- `isCompleted`: boolean, nullable — When used with Field: true returns products where the field is completed, false returns products where the field is not completed.
- `isSkuOnly`: boolean, nullable — Only check for existing values on SKU's. If enabled, this will only retrieve products where the selected field is 'completed' for all variants or SKU's.
