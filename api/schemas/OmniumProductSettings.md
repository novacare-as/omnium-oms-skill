# OmniumProductSettings

**Fields:**

- `readOnly`: boolean
- `showFilters`: boolean
- `rootCategoryId`: string, nullable
- `productContentLanguages`: List<[`OmniumProductContentLanguage`](OmniumProductContentLanguage.md)>, nullable, max length 250
- `seasonCategoryId`: string, nullable
- `productFacets`: List<[`OmniumProductFacet`](OmniumProductFacet.md)>, nullable, max length 250
- `hasPackages`: boolean
- `isProductStatisticsEnabled`: boolean — No longer used. Always false; kept so the response keeps its shape.
- `isProductOptionsEnabled`: boolean
- `isDefaultPriceOverridingPrices`: boolean
- `defaultProductCostCurrency`: string, nullable
- `currencies`: List<string>, nullable, max length 250
- `isIncompleteProductsEnabled`: boolean
- `isProductLanguagesEnabled`: boolean
- `isAssortmentStoreIdRequired`: boolean
- `isOmniumUrlProviderEnabled`: boolean
- `omniumUrlProviderTemplate`: string, nullable
- `priceManagement`: boolean
- `isPriceUpdateOperationDelayed`: boolean — No longer used. Always false; kept so the response keeps its shape.
- `isVariantPricesJoined`: boolean
- `isProductPriceSetToLowestVariantPrice`: boolean — If set to true, product price will be updated to the lowest variant price when the product is enriched.
- `isUpdatePricesAlwaysMarkedAsModified`: boolean — Set to true to force price updates with new "Modified" date, even if price has not changed
- `isLocationEqualForAllVariants`: boolean
- `hasExternalPrices`: boolean
- `hasCustomerSpecificPrices`: boolean
- `isVariantSearchEnabled`: boolean
- `relatedProductKeys`: List<string>, nullable, max length 250
- `imageAspectRatios`: List<[`OmniumAspectRatio`](OmniumAspectRatio.md)>, nullable, max length 250
- `isImagesAutoResizedOnUpload`: boolean
- `imageMaxSize`: [`OmniumAspectRatio`](OmniumAspectRatio.md)
- `assetPurposeKeys`: List<string>, nullable, max length 250
- `defaultProperties`: List<[`OmniumDefaultPropertyItem`](OmniumDefaultPropertyItem.md)>, nullable, max length 250
- `highlightedProperties`: List<string>, nullable, max length 250
- `productSearchSettings`: [`OmniumProductSearchSettings`](OmniumProductSearchSettings.md)
- `isTableStorageDisabled`: boolean
- `productTypes`: List<[`OmniumProductTypeItem`](OmniumProductTypeItem.md)>, nullable, max length 1000
- `tagSettings`: List<[`OmniumTagSettings`](OmniumTagSettings.md)>, nullable, max length 250

**Used directly by endpoints in:**

- [Settings | Products](../endpoints/settings/products.md)
