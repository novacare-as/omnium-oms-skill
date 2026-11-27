# OmniumProductUnit

Model for additional product units with conversion factor

**Fields:**

- `unit`: string, nullable — Unit (E.g. lbs, kg, pcs, etc...)
- `conversionFactor`: number (decimal) — Conversion factor (number of this unit in main product unit)
- `supplierSkuId`: string, nullable — Supplier sku ID
- `basePriceUnit`: boolean, nullable — If true, this unit is main unit
- `ean`: string, nullable — Unit EAN / GTIN
- `length`: number (decimal), nullable — Unit length
- `width`: number (decimal), nullable — Unit width
- `height`: number (decimal), nullable — Unit height
- `volume`: number (decimal), nullable — Unit volume in dm2
- `weight`: number (decimal), nullable — Unit weight
- `unitType`: string, nullable — Unit type (F-pack / D-pack)
- `isSupplierUnit`: boolean, nullable — True if unit is a supplier unit
- `isConsumerUnit`: boolean, nullable — True if unit is a consumer unit
