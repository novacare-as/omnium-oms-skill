# OmniumOmniStockLevel

Calculated stock level for a product in a specific store, used for online availability.

**Fields:**

- `storeId`: string, nullable — Store ID
- `stockLevel`: string, nullable — Stock level for the store. Possible values: 'HighInStock', 'LowInStock', 'OutOfStock'.
- `quantity`: number (decimal), nullable — Quantity the store can sell online: the available stock of the warehouses that pass the store's OmniStock rules, less the store's OmniStock buffer. Only set when the store has IsOmniStockQuantityEnabled turned on.
