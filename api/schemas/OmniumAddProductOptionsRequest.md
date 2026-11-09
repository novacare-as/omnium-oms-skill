# OmniumAddProductOptionsRequest

For adding one or more product options to a product in cart

**Fields:**

- `cartId`: string, required — Cart id for the existing cart
- `parentLineItemId`: string, required — LineItemId for the existing product that you wish to add product options to
- `productOptions`: List<[`OmniumAddProductOptionRequestValue`](OmniumAddProductOptionRequestValue.md)>, required, max length 250 — The list of product options to add

**Used directly by endpoints in:**

- [Carts | Add](../endpoints/carts/add.md)
