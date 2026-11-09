# OmniumInsightsProductDailyResponse

Daily product sales for the Insights API.
One row per (date, store, top-level category, SKU). Up to 20 SKUs are returned per category bucket, sorted by revenue.

**Fields:**

- `date`: string, nullable — The day this row covers, formatted as yyyy-MM-dd in the tenant's timezone.
- `storeId`: string, nullable — The internal Omnium store ID.
- `categoryId`: string, nullable — Top-level category ID (Product.MainCategoryLevel1).
- `categoryName`: string, nullable — Top-level category name.
- `sku`: string, nullable — The SKU identifier from the order line.
- `productName`: string, nullable — Product name as captured on the order line.
- `quantitySold`: number (decimal) — Sum of order-line Quantity for this SKU within the bucket.
- `revenue`: number (decimal) — Sum of order-line ExtendedPrice (incl. VAT) for this SKU within the bucket.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
