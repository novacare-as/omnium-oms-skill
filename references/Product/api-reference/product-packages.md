# Packages

Source: https://docs.omnium.no/docs/Product/api-reference/product-packages

> How to handle product packages in Omnium via API

## Package Products

Package products refer to products that include multiple components. See also the help article [Packages and Bundles](https://help.omnium.no/hc/en-us/articles/29577471337617-Getting-started-with-Packages-and-Bundles).

### Setup

To enable package products, you need to enable the "Package products" feature in the Omnium product settings.

A product is a package product if it has `IsPackage` set to `true`. It also has to have components added to the list of components on the product, see details [here](https://api.omnium.no/documentation/index.html#/model-OmniumProductComponent).

To add package products to Omnium via API, you can use any of the endpoints described in [Updates](product-updates.md).

* * *

### Add package products to cart

Use the `AddPackageItemToCart` endpoint to add package items to the cart:

[AddPackageItemToCart documentation](https://api.omnium.no/documentation/index.html#/Carts%20%7C%20Add/CartAddPackageItemToCart)

* * *
