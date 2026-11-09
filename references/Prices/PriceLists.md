# Price list

Source: https://docs.omnium.no/docs/Prices/PriceLists

> Create price lists to manage prices

## Introduction

A price list is composed of two components: the price list and price list items. The price list contains information such as the type and market it applies to.
The price list items represent the prices for each SKU.

Each price list item must correspond to a specific SKU, meaning that prices from the price list are always variant-specific.

It is possible to control whether prices should be applied at the variant level or the product level using the setting: `IsPricesStoredOnlyOnProduct`.

* * *

## Create a New Price List

You can use a price list for different purposes, depending on the type you select:

*   **Default**: Standard price list functionality used to set prices directly.
*   **Price Factor**: Used as a conversion factor, not for assigning specific prices.

The **List Type** determines what kind of prices the price list generates. When activating the price list, you can choose to generate:

*   **Sales prices**
*   **Cost prices**
*   **Both**

For example, you might configure a price list to generate only cost prices for the products it includes.

* * *

## Add Price List Items to a Price List

Price list items can be added using the user interface (GUI), Excel import, or the API.

* * *

## Activate and Deactivate the Price List

When products are added to the cart, the price is taken from the product—not directly from the price list.
This means that prices defined in the price list must be applied to the product in order to take effect. The **Activate** (or **Update**) button performs this function: it copies the price from the price list item to the product and marks the item as active.

As a result, whenever new items are added to a price list, the list must be updated (republished) to apply those prices to the products.
