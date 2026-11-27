# Category API Reference

Source: https://docs.omnium.no/docs/Product/product-categories/api-reference

> Complete API reference for product category endpoints in Omnium, including CRUD operations, tree queries, and scroll search.

This page documents the public API endpoints for managing product categories in Omnium.

**Base URL:** `/api/productcategories`

**Authentication:** All endpoints require authentication. Read operations require `ProductRead` access; write operations require `ProductAdmin` access.

* * *

## Endpoints Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/{categoryId}` | Get a single category |
| GET | `/` | List all categories (paginated) |
| GET | `/GetCategoryTree` | Get the full category hierarchy |
| POST | `/GetCategoryTreeBySearch` | Get hierarchy filtered by product search |
| GET | `/{parentId}/SubCategories` | Get immediate child categories |
| POST | `/` | Create a category |
| POST | `/AddMany` | Batch create categories |
| PUT | `/` | Update a category |
| DELETE | `/{productCategoryId}` | Delete a category |
| POST | `/ScrollSearch` | Scroll search for large result sets |
| GET | `/Scroll/{id}` | Continue scroll search |

* * *

## Get Single Category

Retrieve a single category by ID.

```
GET /api/productcategories/{categoryId}?language={language}
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | Yes | Category ID, with or without language suffix (e.g., `mens-shirts` or `mens-shirts_en`) |
| `language` | string | No | Language code (e.g., `en`, `no`). Used if `categoryId` doesn't include language suffix |

### Response

```json
{
  "categoryId": "mens-shirts",
  "id": "mens-shirts_en",
  "name": "Men's Shirts",
  "description": "All men's shirts",
  "parentId": "mens-clothing",
  "language": "en",
  "sortIndex": 100,
  "isHidden": false,
  "isMainCategory": false,
  "imageUrl": "https://cdn.example.com/category.jpg"
}
```

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Category found and returned |
| 400 | Invalid category ID |
| 404 | Category not found |

* * *

## List All Categories

Retrieve all categories with pagination.

```
GET /api/productcategories?pageSize={pageSize}&page={page}
```

### Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `pageSize` | int | 1000 | Number of items per page (max 1000) |
| `page` | int | 1 | Page number |

### Response

```json
{
  "result": [
    {
      "categoryId": "mens-shirts",
      "name": "Men's Shirts",
      "language": "en"
    }
  ],
  "totalHits": 150,
  "scrollId": null,
  "facets": []
}
```

Pagination is limited to 20,000 total items. For larger datasets, use the [Scroll Search](api-reference.md#scroll-search) endpoint.

* * *

## Get Category Tree

Retrieve the complete category hierarchy with product counts.

```
GET /api/productcategories/GetCategoryTree
```

### Response

```json
[
  {
    "productCategory": {
      "categoryId": "clothing",
      "name": "Clothing"
    },
    "productCount": 1500,
    "subCategories": [
      {
        "productCategory": {
          "categoryId": "mens",
          "name": "Men"
        },
        "productCount": 750,
        "subCategories": [...]
      }
    ]
  }
]
```

* * *

## Get Category Tree by Search

Retrieve a category tree filtered by product search criteria. Returns only categories containing products that match the search, with accurate counts.

```
POST /api/productcategories/GetCategoryTreeBySearch?rootCategoryId={rootCategoryId}
Content-Type: application/json
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `rootCategoryId` | string | No | Override the default root category |

### Request Body

```json
{
  "brand": "Acme",
  "isActive": true,
  "marketId": "us"
}
```

### Response

Same structure as [Get Category Tree](api-reference.md#get-category-tree), but filtered to only include categories with matching products.

### Use Cases

*   Show category navigation filtered by current search facets
*   Display brand-specific category trees
*   Build market-specific navigation

* * *

## Get Subcategories

Retrieve immediate children of a parent category.

```
GET /api/productcategories/{parentId}/SubCategories?language={language}
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `parentId` | string | Yes | Parent category ID. Use `rootCategoryId` to get top-level categories |
| `language` | string | No | Language code. Defaults to tenant default |

### Response

```json
[
  {
    "categoryId": "mens-shirts",
    "name": "Shirts",
    "parentId": "mens-clothing",
    "sortIndex": 100
  },
  {
    "categoryId": "mens-pants",
    "name": "Pants",
    "parentId": "mens-clothing",
    "sortIndex": 200
  }
]
```

* * *

## Create Category

Create a new category.

```
POST /api/productcategories
Content-Type: application/json
```

### Request Body

```json
{
  "categoryId": "summer-collection",
  "name": "Summer Collection",
  "description": "Summer 2024 products",
  "parentId": "seasonal",
  "language": "en",
  "sortIndex": 100,
  "isHidden": false,
  "imageUrl": "https://cdn.example.com/summer.jpg",
  "metaTitle": "Summer Collection | Shop Now",
  "metaDescription": "Browse our summer collection"
}
```

### Required Fields

| Field | Description |
| --- | --- |
| `categoryId` | Unique identifier for the category |

### Optional Fields

| Field | Default | Description |
| --- | --- | --- |
| `language` | Tenant default | Language code |
| `parentId` | `rootCategoryId` | Parent category |
| `name` | \- | Display name |
| `description` | \- | Category description |
| `sortIndex` | 0 | Sort order |
| `isHidden` | false | Hide from end users |

### Status Codes

| Code | Description |
| --- | --- |
| 201 | Category created |
| 400 | Invalid request (missing categoryId, etc.) |

* * *

## Batch Create Categories

Create multiple categories in a single request.

```
POST /api/productcategories/AddMany
Content-Type: application/json
```

### Request Body

```json
[
  {
    "categoryId": "spring-2024",
    "name": "Spring 2024",
    "parentId": "seasonal",
    "language": "en"
  },
  {
    "categoryId": "spring-2024",
    "name": "Vår 2024",
    "parentId": "seasonal",
    "language": "no"
  }
]
```

### Status Codes

| Code | Description |
| --- | --- |
| 201 | Categories created |
| 400 | Invalid request |

* * *

## Update Category

Update an existing category. This performs a full replacement.

```
PUT /api/productcategories
Content-Type: application/json
```

### Request Body

Same as [Create Category](api-reference.md#create-category). Include all fields you want to preserve.

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Category updated |
| 400 | Invalid request |

This endpoint performs a full replacement. Any fields not included in the request will be reset to defaults or removed.

* * *

## Delete Category

Delete a single category.

```
DELETE /api/productcategories/{productCategoryId}
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `productCategoryId` | string | Yes | Full category ID including language (e.g., `mens-shirts_en`) |

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Category deleted |
| 400 | Invalid category ID |
| 404 | Category not found |

Deleting a category does not automatically remove it from products or reassign child categories. Handle these cleanup tasks separately.

* * *

## Scroll Search

Search categories with scroll-based pagination for large result sets.

```
POST /api/productcategories/ScrollSearch
Content-Type: application/json
```

### Request Body

```json
{
  "take": 5000,
  "language": "en",
  "parentIds": ["clothing"]
}
```

### Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `take` | int | 5000 | Number of items per scroll (max 10,000) |
| `language` | string | \- | Filter by language |
| `parentIds` | string\[\] | \- | Filter by parent category IDs |

### Response

```json
{
  "result": [...],
  "scrollId": "DXF1ZXJ5...",
  "totalHits": 15000
}
```

### Continuing the Scroll

Use the `scrollId` to fetch the next batch:

```
GET /api/productcategories/Scroll/{scrollId}
```

Continue calling until `result` is empty or `scrollId` is null.

* * *

## Common Use Cases

### Build Category Navigation

```
// Get full tree for navigation menu
const tree = await fetch('/api/productcategories/GetCategoryTree');

// Or get filtered tree for search results page
const filteredTree = await fetch('/api/productcategories/GetCategoryTreeBySearch', {
  method: 'POST',
  body: JSON.stringify({ brand: 'Acme', isActive: true })
});
```

### Create Multi-Language Categories

```
// Create category in all languages
const languages = ['en', 'no', 'sv'];
const categories = languages.map(lang => ({
  categoryId: 'summer-2024',
  name: getLocalizedName('summer-2024', lang),
  language: lang,
  parentId: 'seasonal'
}));

await fetch('/api/productcategories/AddMany', {
  method: 'POST',
  body: JSON.stringify(categories)
});
```

### Export All Categories

```
// Use scroll search for large exports
let allCategories = [];
let response = await fetch('/api/productcategories/ScrollSearch', {
  method: 'POST',
  body: JSON.stringify({ take: 10000 })
}).then(r => r.json());

allCategories.push(...response.result);

while (response.scrollId) {
  response = await fetch(`/api/productcategories/Scroll/${response.scrollId}`)
    .then(r => r.json());
  allCategories.push(...response.result);
}
```

* * *

## Error Handling

All endpoints return standard HTTP status codes. Error responses include a message:

```json
{
  "message": "Category ID is required"
}
```

| Status | Description |
| --- | --- |
| 400 | Bad Request - Invalid parameters or request body |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Category doesn't exist |
| 500 | Server Error - Internal error, retry later |
