# OmniumProductCategory

Product category

**Fields:**

- `id`: string, nullable — Product category ID (Calculated, unique, including language prefix: {CategoryId}_{Language})
- `categoryId`: string, nullable — Product category ID (Without language prefix). Required when adding a new category
- `name`: string, nullable — Product category name
- `description`: string, nullable — Product category short description
- `parentId`: string, nullable — Parent category ID
- `language`: string, nullable — Product category language code
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Properties
- `isMainCategory`: boolean — Is product category a primary category
- `imageUrl`: string, nullable — Image Url
- `assets`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — Product category media files
- `isHidden`: boolean — True if category should be hidden to end users
- `metaDescription`: string, nullable — Meta description
- `metaTitle`: string, nullable — Meta title
- `metaKeywords`: string, nullable — Meta keywords
- `sortIndex`: integer (int32) — Sort index
- `productSearchId`: string, nullable — Product search ID. If this property has value, the category is a dynamic category representing a saved search request. Use GetByProductSearch endpoint to fetch products. Mutually exclusive with Omnium.Public.Products.Models.OmniumProductCategory.SearchGroupId.
- `searchGroupId`: string, nullable — Search group ID. If set, the category is a dynamic category representing a search group. Related products are fetched by search only — not by category association. Mutually exclusive with Omnium.Public.Products.Models.OmniumProductCategory.ProductSearchId.
- `googleProductCategoryId`: string, nullable — Google's category id of the item (see [Google product taxonomy](https://support.google.com/merchants/answer/1705911)).

**Used directly by endpoints in:**

- [Products | Categories](../endpoints/products/categories.md)
