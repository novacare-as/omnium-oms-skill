# OmniumProductCategoryPatch

Product category patch model for partial updates

**Fields:**

- `id`: string, nullable — Product category ID (Calculated, unique, including language prefix: {CategoryId}_{Language}). Used to identify the category to patch.
- `categoryId`: string, nullable — Product category ID (Without language prefix)
- `name`: string, nullable — Product category name
- `description`: string, nullable — Product category short description
- `parentId`: string, nullable — Parent category ID
- `language`: string, nullable — Product category language code
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Properties
- `keepExistingProperties`: boolean, nullable — Set to 'false' if you want to update the whole 'properties' list. If true, new properties will be added to the existing list of properties. 'True' by default.
- `isMainCategory`: boolean, nullable — Is product category a primary category
- `imageUrl`: string, nullable — Image Url
- `assets`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — Product category media files
- `keepExistingAssets`: boolean, nullable — Set to 'false' if you want to update the whole 'Assets' list. If true, new assets will be added to the existing list of assets. 'True' by default.
- `isHidden`: boolean, nullable — True if category should be hidden to end users
- `metaDescription`: string, nullable — Meta description
- `metaTitle`: string, nullable — Meta title
- `metaKeywords`: string, nullable — Meta keywords
- `sortIndex`: integer (int32), nullable — Sort index
- `productSearchId`: string, nullable — Product search ID. If this property has value, the category is a dynamic category representing a saved search request. Mutually exclusive with Omnium.Public.Products.Models.OmniumProductCategoryPatch.SearchGroupId. Sending both in the same payload is rejected with 400. If only this field is present, Omnium.Public.Products.Models.OmniumProductCategoryPatch.SearchGroupId is cleared.
- `searchGroupId`: string, nullable — Search group ID. If set, the category is a dynamic category representing a search group. Mutually exclusive with Omnium.Public.Products.Models.OmniumProductCategoryPatch.ProductSearchId. Sending both in the same payload is rejected with 400. If only this field is present, Omnium.Public.Products.Models.OmniumProductCategoryPatch.ProductSearchId is cleared.
- `googleProductCategoryId`: string, nullable — Google's category id of the item (see Google product taxonomy).
- `fieldsToForceNull`: List<string>, nullable — Force nullable category fields to null. Use the property path, e.g. "Description".

**Used directly by endpoints in:**

- [Products | Categories](../endpoints/products/categories.md)
