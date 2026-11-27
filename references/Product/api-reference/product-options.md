# Options

Source: https://docs.omnium.no/docs/Product/api-reference/product-options

> Getting started with the product options

## Product Options

Product options refer to customizable elements, services, or additional features that can be added to a product. For instance, you can offer engraving on jewelry, allowing customers to choose their preferred text and style. Another example is offering waterproofing for clothing and footwear.

### Setup

Here is an example of how you could set up product options:

1.  Enable product options in the Omnium product settings.
2.  Create a new product type named "ProductOption" in the product configuration.
3.  Create a new product and set the type to "ProductOption". Give the product a name ("Engraving" or "Installation" are typical examples of product options). The product must be a SKU, so ensure "Is Sku" is activated and that the product has a SKU Id.
4.  Edit a product of your choice (except for the newly created Product Option product) and go to the "Options" tab. The "Title" is an optional text that will be displayed when fetching product options from our API. The Type defines what kind of option this is. Since this is engraving, select "Field" as this should be a text input, and select the product from the product selector. Only use "dropdown" if you are going to have multiple values to choose from.

With this setup, you could use the `GetProductOptions` endpoint to simplify which product options are available for a product. This is mostly useful if you need to fetch all product option values and product data when you have multiple values.

[GetProductOptions documentation](https://api.omnium.no/documentation/index.html#/Products/ProductsGetProductOptions)

Product options can also be added to products when creating or updating products using standard product endpoints.

* * *

### Add product option to cart

Use the `AddProductOptionsItemToCart` endpoint to add product options for a specific order line:

[AddProductOptionsItemToCart documentation](https://api.omnium.no/documentation/index.html#/Carts%20%7C%20Add/CartAddProductOptionsItemToCart)

* * *

### Alternative way of handling product options

In order to add product options to a cart, you do not necessarily have to set up product options on products. The endpoint ([AddProductOptionsItemToCart](https://api.omnium.no/documentation/index.html#/Carts%20%7C%20Add/CartAddProductOptionsItemToCart)) accepts adding a product option to a cart using only a SKU (and, if necessary, a custom price).
If you have specific needs or use cases that do not fit with adding product options to products, you could, for instance, use related products to add possible options, and/or use custom properties for price.

```json

{
  "cartId": "CART1234",
  "parentLineItemId": "53c7ba39-4b84-40ef-a14e-0fff3c660528",
  "productOptions": [
    {
      "skuId": "ENGRAVEMENT123",
      "price": 499
    }
  ]
}
```
