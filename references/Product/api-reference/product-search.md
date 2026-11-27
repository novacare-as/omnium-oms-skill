# Search

Source: https://docs.omnium.no/docs/Product/api-reference/product-search

> Getting started with the product search api

## Guidelines for Effective Product Retrieval

When retrieving products from Omnium, especially for e-commerce, consider the following:

*   **Leverage Search Parameters**
    Use the various search parameters available with `SearchProducts` to tailor your queries effectively. This endpoint automatically gives you the "best" price for the product based on your search queries: It will filter prices on `storeId`, `marketId`, `customerId`, `customerGroupId` while also checking promotions filtering on active/inactive prices.
    Keep in mind that `SearchProducts` is not intended for deep pagination. If you are building an integration and need to fetch all products, you should use the scroll endpoints instead.

*   **Optimize Data Retrieval**
    Use the `includedFields` and `excludedFields` parameters to retrieve only necessary data. For example:

    *   Do you need to fetch all product categories or custom properties?
    *   Could you exclude variants when searching for products on a product list page?
*   **Predefined Property Lists**
    Utilize the `PropertyListId` search parameter to predefine which custom properties to return, set up directly in the Omnium UI.

*   **Ensure Accurate Pricing**
    Use parameters like `marketId`, `storeId`, `customerId`, and `language` to get the correct price for returned products.

*   **Disable Unnecessary Features**
    Disable facets unless required for your search. This reduces payload size and improves server and client-side performance.

*   **Single Product Retrieval**
    Consider using `SearchProducts` instead of `GET` when fetching individual products, particularly if you don’t need all product properties. This will also ensure that you get the right price for the product based on your search parameters, such as `marketId` or `customerId`.

*   **High-Frequency Products**
    For frequently loaded products, such as those visible on checkout or front pages, consider setting up caching with a short expiration time.

*   **Large scale queries**
    For large-scale queries (20,000+ products), typically for most integrations, avoid using `SearchProducts` as this is not intended for deep pagination. Instead, use `ScrollSearch` for fetching all matching products.

* * *

#### Searching products

Search products using the `SearchProducts` endpoint:

[SearchProducts documentation](https://api.omnium.no/documentation/index.html#/Products/post_api_Products_SearchProducts)

```json
{
  "take": 10,
  "page": 1,
  "searchText": "CamelBak"
}
```

_A simple search object, with a free text search, fetching 10 first items._

* * *

#### Sort order

When no sort order is specified, products are sorted by last modified date (descending) for searches without a free text query, or by relevance score (descending) when `searchText` is set. To specify an explicit sort order, add the `sortOrder` property to the search request:

```json
{
  "take": 10,
  "page": 1,
  "searchText": "CamelBak",
  "sortOrder": "CreatedDescending"
}
```

_Sample query sorted by created date descending._

The following sort orders are available:

*   CreatedAscending
*   CreatedDescending
*   BrandAscending
*   BrandDescending
*   AverageRatingAscending
*   AverageRatingDescending
*   ColorAscending
*   ColorDescending
*   NameAscending
*   NameDescending
*   SpecificationAscending
*   SpecificationDescending
*   SupplierNameAscending
*   SupplierNameDescending
*   SkuIdAscending
*   SkuIdDescending
*   CatalogAscending
*   CatalogDescending
*   PriceAscending
*   PriceDescending
*   InventoryAscending
*   InventoryDescending
*   IsInStockAscending
*   IsInStockDescending
*   CostPriceAscending
*   CostPriceDescending
*   ModifiedAscending
*   ModifiedDescending
*   LocationAscending
*   LocationDescending
*   PublishedAscending
*   PublishedDescending
*   SortIndexAscending
*   SortIndexDescending
*   PopularityDescending
*   PopularityAscending
*   DiscountPercentAscending
*   DiscountPercentDescending
*   ScoreDescending
*   ParentIdAscending
*   ParentIdDescending

* * *

##### Secondary and tertiary sort order

To add a secondary sort order, use the `SortOrder2nd` property in `productSearchRequest`. If it is used, the primary sort order (`SortOrder`) is required.

```json
{
  "take": 10,
  "page": 1,
  "sortOrder": "DiscountPercentDescending",
  "sortOrder2nd": "InventoryDescending"
}
```

_Sample query sorting by discount percent, and then by inventory._

To add a third sort order, use `SortOrder3rd`. If set, the primary (`SortOrder`) and secondary (`SortOrder2nd`) sort order are required.

* * *

#### Including and excluding fields

##### Excluding fields

There are two ways of excluding fields from product search:

1.  Using boolean values to exclude large properties:

```json
{
  "take": 10,
  "page": 1,
  "excludedFields": {
    "isVariantsExcluded": true,
    "isProductCategoriesExcluded": true,
    "isPropertiesExcluded": true,
    "isPricesExcluded": true,
    "isAssetsExcluded": true,
    "isInventoryExcluded": true
  }
}
```

2.  Excluding fields from a list of field names:

```json
{
  "take": 10,
  "page": 1,
  "excludedFields": {
    "specificFields": ["productCategories"]
  }
}
```

_Sample query excluding categories from search result._

##### Include only selected fields

Exclude all fields except for `ID`. This would only be useful when used together with `IncludedFields`.

```json
{
  "take": 10,
  "page": 1,
  "excludedFields": {
    "isEverythingExcluded": true
  },
  "includedFields": {
    "specificFields": [
      "color"
    ]
  }
}
```

_Sample query getting only the color field from the product._

`includedFields` can also be used without `isEverythingExcluded` to add fields that are not included by default. For example, `inventory` (per-warehouse stock quantities) is not returned on the product level by default. To include it, add `"inventory"` to `specificFields`:

```json
{
  "take": 10,
  "page": 1,
  "includedFields": {
    "specificFields": [
      "inventory"
    ]
  }
}
```

_Sample query that adds per-warehouse inventory to the product level in the response._

* * *

#### Sort index threshold

Sort index can be used for setting a threshold for returning products through search. Typically used for showing the most important products in content blocks or limiting the assortment in product lists in general.

```json
{
  "take": 10,
  "page": 1,
  "sortOrder": "CreatedDescending",
  "sortIndexThreshold": 5
}
```

_Sample query with sort index threshold 5._

Sort index value for a product is the sum of `sortIndexBase` and `sortIndexBoost`. The `sortIndexBase` is calculated by Omnium according to how many stores have the item in stock and how many stores have a price for that product.

In product settings, a boost value for promotion prices can be set by adding a value to `omniumSortIndexProviderPromotionBoost`. If a product has a price with a promotion, this value will be added to the sort index boost.
