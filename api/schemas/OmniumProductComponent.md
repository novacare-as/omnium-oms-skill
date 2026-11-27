# OmniumProductComponent

Product package component

**Fields:**

- `componentId`: string, nullable — Component ID (Unique GUID)
- `id`: string, nullable — OBSOLETE Component product ID - Use ProductId instead
- `productId`: string, nullable — Component product ID
- `skuId`: string, nullable — Component SkuId - use this to preselect variant in package.
- `quantity`: number (decimal) — Quantity of component in package
- `isRequired`: boolean — This property is for external use only and has no functional effect within Omnium.
- `options`: List<[`OmniumComponentOption`](OmniumComponentOption.md)>, nullable — A list of selectable options for this component. The SkuId is populated when an option is selected.
- `componentName`: string, nullable — The display name of the component. Primarily relevant when using component options where no default value is selected.
- `shipTogetherWithComponentId`: string, nullable — ComponentId of a sibling component this component cannot be separated from during allocation. Components linked this way are always delivered from the same warehouse - e.g. a print that must ship together with its garment.

**Used directly by endpoints in:**

- [Carts | Add](../endpoints/carts/add.md)
- [Carts | Update](../endpoints/carts/update.md)
