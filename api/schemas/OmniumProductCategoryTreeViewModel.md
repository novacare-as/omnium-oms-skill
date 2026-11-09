# OmniumProductCategoryTreeViewModel

View model for product category tree

**Fields:**

- `productCategory`: [`OmniumProductCategory`](OmniumProductCategory.md)
- `productCount`: integer (int32) — Number of products in category
- `subCategories`: List<[`OmniumProductCategoryTreeViewModel`](OmniumProductCategoryTreeViewModel.md)>, nullable, max length 250 — List of product category sub items

**Used directly by endpoints in:**

- [Products | Categories](../endpoints/products/categories.md)
