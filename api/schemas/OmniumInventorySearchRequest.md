# OmniumInventorySearchRequest

Contains all parameters for doing an inventory search. At least one parameter must be set

**Fields:**

- `lastModified`: string (date-time), nullable — Set LastModified to a specific DateTime to get items only modified after that time
- `marketId`: string, nullable — Filter inventory on market ID
- `marketGroupId`: string, nullable — Filter inventory on market group ID
- `productCodes`: List<string>, nullable, max length 5000 — Filter inventory on product codes (SKU / Product ID)
- `warehouseCodes`: List<string>, nullable, max length 250 — Filter inventory on warehouse codes. Will be ignored if IsWebWarehouse is true
- `isWebWarehouse`: boolean — If true, search will return inventory for all warehouses with IsWebWarehouse set to true. WarehouseCodes list is ignored
- `isInStock`: boolean, nullable — If true, only inventory items with positive values are returned
- `isBatchesExcluded`: boolean, nullable — Indicates whether inventory batches should be excluded in the response. This is applicable only if the FIFO principle is activated.

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
