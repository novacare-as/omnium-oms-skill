# OmniumCategoryAndBrandFilter

**Fields:**

- `categories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, max length 500
- `requiredCategories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, max length 250
- `excludedCategories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, max length 250
- `brands`: List<string>, nullable, max length 250
- `excludedBrands`: List<string>, nullable, max length 250
- `products`: List<[`OmniumPromotionProduct`](OmniumPromotionProduct.md)>, nullable, max length 20000
- `excludedProducts`: List<[`OmniumPromotionProduct`](OmniumPromotionProduct.md)>, nullable, max length 20000
- `seasons`: List<string>, nullable, max length 250
- `excludedSeasons`: List<string>, nullable, max length 250
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250
- `excludedProperties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250
