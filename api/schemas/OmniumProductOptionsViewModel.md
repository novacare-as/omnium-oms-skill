# OmniumProductOptionsViewModel

Product options view model, containing both product options and the reference product models

**Fields:**

- `productOptionViewModels`: List<[`OmniumProductOptionViewModel`](OmniumProductOptionViewModel.md)>, nullable, max length 250 — List of product options
- `products`: List<[`OmniumProduct`](OmniumProduct.md)>, nullable, max length 250 — Referenced product(s) from the product options

**Used directly by endpoints in:**

- [Products](../endpoints/products.md)
