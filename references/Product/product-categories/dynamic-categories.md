# Dynamic Categories

Source: https://docs.omnium.no/docs/Product/product-categories/dynamic-categories

> Create categories that automatically display products based on saved search criteria using the productSearchId feature.

Dynamic categories allow you to create category pages that automatically display products matching saved search criteria, without manually assigning products to the category.

* * *

## What Are Dynamic Categories?

A dynamic category is a category linked to a **saved search**. Instead of displaying products that have the category assigned to them, it displays products that match the saved search criteria.

This enables:

*   Automatic product collections (no manual assignment needed)
*   Real-time product lists that update as products change
*   Complex filtering criteria without product modifications

* * *

## How It Works

### The `productSearchId` Property

Categories have a `productSearchId` property that links them to a saved product search:

```json
{
  "categoryId": "new-arrivals",
  "name": "New Arrivals",
  "productSearchId": "search-new-products-30-days",
  "parentId": "catalog"
}
```

When `productSearchId` is set:

*   The category acts as a "virtual" category
*   Products displayed come from the saved search, not from category assignments
*   Product counts reflect the saved search results

### Saved Search

A saved search stores product search criteria:

```json
{
  "id": "search-new-products-30-days",
  "name": "Products created in last 30 days",
  "searchRequest": {
    "createdFrom": "now-30d",
    "isActive": true,
    "sortOrder": "createdDescending"
  }
}
```

### Running a Saved Search via the API

You can also run a saved search directly through the [Product Query API](../../Integrations/product-query.md): pass its ID as `savedSearchId` on `POST /api/products/Query` or `POST /api/products/Query/Scroll`. The saved search supplies the base filters, and fields set on the request — pagination, sorting, and any filter overrides — replace the saved values per field. An unknown ID, or the ID of a saved search that is not a product search, is rejected with HTTP 400.

```json
{
  "savedSearchId": "search-new-products-30-days",
  "take": 50,
  "marketIds": ["NOR"]
}
```

* * *

## Use Cases

### New Arrivals

Display products created recently without manually tagging them:

**Saved Search:**

```json
{
  "id": "new-arrivals-search",
  "searchRequest": {
    "createdFrom": "now-30d",
    "isActive": true,
    "sortOrder": "createdDescending"
  }
}
```

**Category:**

```json
{
  "categoryId": "new-arrivals",
  "name": "New Arrivals",
  "productSearchId": "new-arrivals-search"
}
```

### On Sale

Display products with active promotions or discounted prices:

**Saved Search:**

```json
{
  "id": "on-sale-search",
  "searchRequest": {
    "hasPromotion": true,
    "isActive": true
  }
}
```

**Category:**

```json
{
  "categoryId": "sale",
  "name": "On Sale",
  "productSearchId": "on-sale-search"
}
```

### Best Sellers

Display top-selling products based on sales data:

**Saved Search:**

```json
{
  "id": "best-sellers-search",
  "searchRequest": {
    "isActive": true,
    "sortOrder": "popularityDescending",
    "take": 100
  }
}
```

**Category:**

```json
{
  "categoryId": "best-sellers",
  "name": "Best Sellers",
  "productSearchId": "best-sellers-search"
}
```

### Brand Collections

Display all products from a specific brand:

**Saved Search:**

```json
{
  "id": "acme-brand-search",
  "searchRequest": {
    "brand": "Acme",
    "isActive": true
  }
}
```

**Category:**

```json
{
  "categoryId": "acme-collection",
  "name": "Acme Collection",
  "productSearchId": "acme-brand-search"
}
```

* * *

## Setting Up Dynamic Categories

### Step 1: Create the Saved Search

Create a saved search with your desired criteria via the Omnium UI or API:

```
POST /api/savedsearches
Content-Type: application/json

{
  "name": "Summer Collection",
  "searchRequest": {
    "season": "Summer 2024",
    "isActive": true
  }
}
```

Note the returned `id` for the saved search.

### Step 2: Create or Update the Category

Create a category with the `productSearchId` property:

```
POST /api/productcategories
Content-Type: application/json

{
  "categoryId": "summer-collection",
  "name": "Summer Collection",
  "language": "en",
  "parentId": "seasonal",
  "productSearchId": "search-id-from-step-1"
}
```

### Step 3: Verify

The category now displays products from the saved search. Test by:

1.  Viewing the category in the Omnium UI
2.  Fetching products via the category tree API
3.  Verifying product counts match expectations

* * *

## Important Considerations

### No Manual Assignment

Products in dynamic categories are **not** assigned to the category:

*   Products don't have the category in their `categoryIds`
*   The relationship is defined by the search criteria only
*   Changing the saved search immediately changes which products appear

### Category Tree Behavior

Dynamic categories appear in the category tree with product counts based on the saved search:

```json
{
  "categoryId": "new-arrivals",
  "name": "New Arrivals",
  "productCount": 45,
  "productSearchId": "new-arrivals-search"
}
```

### Parent Category Addition

When `isProductCategoryParentsAdded` is enabled, products in dynamic categories **do not** automatically get the dynamic category or its parents added to their `categoryIds`. The relationship remains virtual.

### Combining Static and Dynamic

A category can have **either**:

*   Manually assigned products (no `productSearchId`)
*   Dynamic products from a saved search (`productSearchId` set)

You cannot combine both. If `productSearchId` is set, manual assignments are ignored for display purposes.

### Performance

Dynamic categories execute the saved search query each time products are requested. For frequently accessed categories:

*   Keep saved search criteria efficient
*   Consider caching if available
*   Monitor query performance

* * *

## Limitations

| Limitation | Description |
| --- | --- |
| Single source | Categories display either static assignments OR saved search results, not both |
| No enrichment | Products don't have the dynamic category in their `productCategories` |
| Search limitations | Limited to what can be expressed in a saved search |
| Real-time only | Historical category membership is not tracked |

* * *

## Removing Dynamic Behavior

To convert a dynamic category back to a static category:

```
PUT /api/productcategories
Content-Type: application/json

{
  "categoryId": "new-arrivals",
  "name": "New Arrivals",
  "language": "en",
  "productSearchId": null
}
```

After removing `productSearchId`, products will need to be manually assigned to the category to appear.
