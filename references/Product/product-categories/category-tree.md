# Category Tree & Hierarchy

Source: https://docs.omnium.no/docs/Product/product-categories/category-tree

> Understanding the category hierarchy in Omnium, including tree operations, sorting, and navigation building.

Categories in Omnium form a hierarchical tree structure through parent-child relationships. This page explains how the hierarchy works and how to work with category trees.

* * *

## How Hierarchy Works

### Parent-Child Relationships

Categories are linked through the `parentId` property:

```
Root Category (parentId: null)
├── Child Category A (parentId: "root")
│   ├── Grandchild A1 (parentId: "child-a")
│   └── Grandchild A2 (parentId: "child-a")
└── Child Category B (parentId: "root")
    └── Grandchild B1 (parentId: "child-b")
```

*   Categories with `parentId: null` are root-level categories
*   The `rootCategoryId` tenant setting defines the primary catalog root
*   There is no limit on nesting depth

### Root Category

The `rootCategoryId` setting in [tenant configuration](configuration.md) identifies the top of your catalog hierarchy:

```
"ProductSettings": {
  "RootCategoryId": "catalog"
}
```

Categories outside this hierarchy may not appear in standard navigation but are still accessible via API.

* * *

## Sorting Categories

Categories within the same parent are sorted by the `sortIndex` property:

| sortIndex | Category |
| --- | --- |
| 0 | Featured |
| 100 | Clothing |
| 200 | Electronics |
| 300 | Home & Garden |

**Best practices:**

*   Use increments of 10 or 100 to allow inserting categories later
*   Lower values appear first
*   Categories with the same `sortIndex` are sorted alphabetically by name

* * *

## Multi-Language Considerations

Category trees exist per language. Each language has its own set of category documents with localized content.

**Example:** Requesting the tree in English returns:

```
Clothing
├── Men
└── Women
```

**The same tree in Norwegian:**

```
Klær
├── Herre
└── Dame
```

All tree operations accept a `language` parameter to specify which language version to retrieve.

The hierarchy structure (parent-child relationships) is the same across all languages - only the names and descriptions differ.

* * *

## Tree Operations

### Getting the Full Tree

Retrieve the complete category hierarchy with product counts:

```
GET /api/productcategories/GetCategoryTree
```

Response structure (a bare array of tree nodes):

```json
[
  {
    "productCategory": {
      "id": "clothing_en",
      "categoryId": "clothing",
      "name": "Clothing"
    },
    "productCount": 1500,
    "subCategories": [
      {
        "productCategory": {
          "id": "mens_en",
          "categoryId": "mens",
          "name": "Men"
        },
        "productCount": 750,
        "subCategories": [...]
      },
      {
        "productCategory": {
          "id": "womens_en",
          "categoryId": "womens",
          "name": "Women"
        },
        "productCount": 750,
        "subCategories": [...]
      }
    ]
  }
]
```

### Getting Subcategories

Retrieve direct children of a specific category:

```
GET /api/productcategories/{parentCategoryId}/SubCategories?language=en
```

This returns only immediate children, not the full subtree.

### Filtered Tree by Search

Get a tree filtered by product search criteria:

```
POST /api/productcategories/GetCategoryTreeBySearch?rootCategoryId={rootCategoryId}
Content-Type: application/json

{
  "brand": "Acme",
  "isActive": true
}
```

The request body is a plain product search request. The optional `rootCategoryId` query parameter overrides the default root category.

This returns only categories containing products matching the search, with accurate product counts for the filtered results.

* * *

## Building Navigation

### Basic Category Menu

1.  Fetch the category tree starting from `rootCategoryId`
2.  Render top-level children as main menu items
3.  Render grandchildren as dropdown/submenu items

```
// Pseudocode - the tree response is an array of nodes
const tree = await fetchCategoryTree();

tree.forEach(mainNode => {
  renderMenuItem(mainNode.productCategory.name, mainNode.productCategory.categoryId);

  mainNode.subCategories.forEach(subNode => {
    renderSubmenuItem(subNode.productCategory.name, subNode.productCategory.categoryId);
  });
});
```

### Breadcrumb Navigation

Build breadcrumbs by traversing from a category up to the root:

```
Home > Clothing > Men > Shirts
```

1.  Start with the current category
2.  Follow `parentId` to get the parent category
3.  Repeat until `parentId` is null or matches `rootCategoryId`
4.  Reverse the array for display

### Category with Product Counts

The tree response includes `productCount` for displaying alongside category names:

```
Clothing (1,500)
├── Men (750)
│   ├── Shirts (200)
│   └── Pants (150)
└── Women (750)
```

* * *

## Orphaned Categories

**Orphaned categories** occur when a category's `parentId` references a category that doesn't exist. This can happen after deleting a parent category without updating its children.

### Detecting Orphans

Orphaned categories will not appear in tree responses because they cannot be linked to the hierarchy. They remain accessible via direct API queries.

### Fixing Orphans

To fix orphaned categories:

1.  Query categories where `parentId` doesn't match any existing category
2.  Update the `parentId` to a valid category or set to null (making it a root)
3.  Or delete the orphaned categories if no longer needed

```
PUT /api/productcategories
Content-Type: application/json

{
  "categoryId": "orphaned-category",
  "language": "en",
  "parentId": "new-valid-parent"
}
```

* * *

## Moving Categories

To move a category to a different parent, update its `parentId`:

```
PUT /api/productcategories
Content-Type: application/json

{
  "categoryId": "shirts",
  "language": "en",
  "parentId": "new-parent-category"
}
```

When moving categories, remember to update all language versions. The hierarchy should be consistent across languages.

Moving a category automatically moves all its descendants - the subtree structure is preserved.

* * *

## Performance Considerations

### Caching

Category tree operations are cached by Omnium for improved performance. Cache is automatically invalidated when categories are modified.

### Deep Hierarchies

Very deep hierarchies (10+ levels) may impact:

*   Tree fetch performance
*   UI rendering complexity
*   [Parent category addition](configuration.md#understanding-parent-category-addition) processing

For most e-commerce use cases, 3-5 levels of hierarchy are sufficient.

### Large Category Counts

For catalogs with thousands of categories:

*   Use pagination via the [ScrollSearch API](api-reference.md#scroll-search)
*   Fetch subtrees on-demand rather than the complete tree
