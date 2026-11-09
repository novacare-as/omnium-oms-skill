# OmniumProductListItemViewModel

View model for product list item

**Fields:**

- `id`: string, nullable, max length 10000 — Product unique ID
- `productId`: string, nullable — Product ID
- `skuId`: string, nullable — Product SKU ID
- `ean`: string, nullable, **deprecated** — EAN code
- `gtins`: List<string>, nullable — GTIN codes
- `name`: string, nullable — Product name
- `alternativeProductName`: string, nullable — Alternative product name
- `mainImageUrl`: string, nullable — Product image url
- `isActive`: boolean — True if product is active. False if it should be hidden from customers.
- `isSku`: boolean — True if product is stock keeping unit / product or variant that can be sold
- `isBundle`: boolean — True if product is a bundle of other products (unlike package, price is sum of components)
- `isPackage`: boolean — True if product is package of other products (unlike bundle, price is specified for package)
- `isBackorder`: boolean — If true, the product have no reorder level, and will usually not be in stock
- `isRental`: boolean — If true, the product is available for rental
- `rentalSourceProductId`: string, nullable — The SKU ID of the original product this rental product was created from
- `colli`: List<[`OmniumProductColli`](OmniumProductColli.md)>, nullable, max length 250 — List of colli, used for shipment
- `catalog`: string, nullable, **deprecated** — Catalog name
- `catalogNodes`: List<string>, nullable, max length 250 — Catalog nodes (if multiple)
- `marketIds`: List<string>, nullable, max length 250 — Market IDs
- `variants`: List<[`OmniumProductListItemViewModel`](OmniumProductListItemViewModel.md)>, nullable, max length 250 — List of variants
- `prices`: List<[`OmniumPrice`](OmniumPrice.md)>, nullable, max length 250 — List of prices
- `price`: [`OmniumPrice`](OmniumPrice.md)
- `expectedDeliveryDate`: string (date-time), nullable — Total inventory quantity for all warehouses
- `inventory`: List<[`OmniumProductInventory`](OmniumProductInventory.md)>, nullable, max length 250 — List of warehouse inventory for the product.
- `cost`: number (decimal) — Product net cost
- `costInDefaultCurrency`: number (decimal), nullable — Product cost in default currency
- `costPrices`: List<[`OmniumCostPrice`](OmniumCostPrice.md)>, nullable — List of product cost prices retrieved from separate index. Only relevant if HasSeparateCostPrices = true.
- `supplierSkuId`: string, nullable — External product ID from supplier
- `supplierName`: string, nullable — Name of main product supplier
- `supplierId`: string, nullable — Main supplier ID
- `averageRating`: number (double) — Average rating for product
- `ratingCount`: integer (int32) — Number of ratings for the product
- `brand`: string, nullable — Product brand
- `color`: string, nullable — Product color
- `gender`: string, nullable — Product gender
- `season`: string, nullable — Product season
- `countryOfOrigin`: string, nullable — Product country of origin
- `sizeType`: string, nullable — Product size type
- `weight`: number (double), nullable — Product weight in kilograms (kg)
- `unit`: string, nullable — Product unit, used for describing what unit the quantities are in
- `units`: List<[`OmniumProductUnit`](OmniumProductUnit.md)>, nullable, max length 250 — List of additional units
- `size`: string, nullable — Product size
- `parentId`: string, nullable — Product parent ID
- `seoInfo`: [`OmniumSeoInfo`](OmniumSeoInfo.md)
- `productCategories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, **deprecated**, max length 250 — Product categories
- `categories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, max length 500 — Product categories
- `categoryIds`: List<string>, nullable, max length 250 — List of category IDs
- `mainCategoryId`: string, nullable — Main category id
- `mainCategoryName`: string, nullable — Main category name
- `tags`: List<string>, nullable, max length 250 — List of product tags
- `badges`: List<[`OmniumProductBadge`](OmniumProductBadge.md)>, nullable, max length 250 — List of product badges or labels to display on product
- `relatedProducts`: List<[`OmniumRelatedProduct`](OmniumRelatedProduct.md)>, nullable, max length 250 — Related products
- `shortDescription`: string, nullable — Short product description
- `productType`: string, nullable — Product type which product will inherit properties from
- `description`: string, nullable — Product description
- `specification`: string, nullable — Product specification
- `isMainProductVariant`: boolean — If true, this variant should represent the product in flattened variant lists
- `published`: string (date-time), nullable — Published datetime.
- `stopPublished`: string (date-time), nullable — Product activation end date. Can be null
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List of properties. Key value pairs with any non strongly typed properties.
- `productOptions`: List<[`OmniumProductOption`](OmniumProductOption.md)>, nullable, max length 250 — Available product options for the product
- `components`: List<[`OmniumProductComponent`](OmniumProductComponent.md)>, nullable, max length 250 — Components included in product - only relevant if products is package/bundle
- `promotionIds`: List<string>, nullable, max length 250 — Promotions associated with the product
- `isVirtual`: boolean, nullable — If true the product inventory status is ignored. Inventory for these products will not be taken into account nor affected by workflow or order management.
- `isOpenPrice`: boolean, nullable — When true, the price is entered in the POS when the product is added to a cart. The price on the order line is locked, and the line is excluded from promotions.
- `grossProfitPercent`: number (decimal), nullable — Gross profit in percent of the price excl. tax that the order line cost is calculated from. Set only when the product's CostCalculationMethod is GrossProfitPercent.
- `storeIds`: List<string>, nullable, max length 1000 — List of available store IDs. If not set, the product will be available for all stores.
- `assets`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250
- `leadTime`: integer (int32), nullable — Lead time in days
- `supplierLeadTime`: integer (int32), nullable — Supplier lead time in days
- `sortIndex`: integer (int32), nullable — Calculated - Used for manual sorting of products (SortIndexBase + SortIndexBoost)
- `sortIndexBase`: integer (int32), nullable — Used for manual sorting of products
- `sortIndexBoost`: integer (int32), nullable — Used for manual sorting of products
- `modified`: string (date-time), nullable — Used for manual sorting of products
- `lowestPriceHistory`: List<[`OmniumPriceReference`](OmniumPriceReference.md)>, nullable, max length 250 — Price history: the lowest price for each market and unit. In each market the entry without a unit comes first, and the other units follow by price.
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external IDs. External IDs are visible in Omnium's UI and useful for display, searching and filtering on IDs originating from other systems.
- `discontinued`: string (date-time), nullable — Product discontinuation date. If discontinued date has passed, it should not be reordered from supplier

**Used directly by endpoints in:**

- [Products | Rentals](../endpoints/products/rentals.md)
