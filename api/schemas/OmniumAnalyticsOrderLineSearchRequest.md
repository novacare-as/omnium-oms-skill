# OmniumAnalyticsOrderLineSearchRequest

Search analytics orders (analytics must be activated in configuration to yield results)

**Fields:**

- `page`: integer (int32) — Page number of the search results.
- `take`: integer (int32) — Number of records to retrieve per page.
- `sortOrder`: string, nullable — Sort order
- `language`: string, nullable — Language filter
- `storeIds`: List<string>, nullable — Store IDs filter
- `warehouseCodes`: List<string>, nullable — Warehouse codes filter
- `pickupWarehouseCodes`: List<string>, nullable — Pickup warehouse codes filter
- `countryNames`: List<string>, nullable — Country name filter
- `postalCodes`: List<string>, nullable — Postal code filter
- `citys`: List<string>, nullable — City filter
- `marketIds`: List<string>, nullable — Market IDs filter
- `currencies`: List<string>, nullable — Currency filter
- `shippingMethodNames`: List<string>, nullable — Shipping method name filter
- `customerNames`: List<string>, nullable — Customer name filter
- `supplierNames`: List<string>, nullable — Supplier name filter
- `shipmentDeliveryTypes`: List<string>, nullable — Shipment delivery types filter (Pickup / Delivery)
- `brands`: List<string>, nullable — Brand filter
- `sizes`: List<string>, nullable — Size filter
- `colors`: List<string>, nullable — Color filter
- `productTypes`: List<string>, nullable — Product type filter
- `productIds`: List<string>, nullable — Product ID filter
- `productNames`: List<string>, nullable — Product name filter
- `parentIds`: List<string>, nullable — Parent ID filter
- `productGenders`: List<string>, nullable — Gender filter
- `productCategory`: List<string>, nullable — Product category name filter
- `salesPersonIds`: List<string>, nullable — Sales person ID filter
- `salesPersonNames`: List<string>, nullable — Sales person name filter
- `mainProductCategory`: List<string>, nullable — Main product category filter
- `eanCodes`: List<string>, nullable — EAN / GTIN filter
- `skuIds`: List<string>, nullable — SkuID filter
- `customerIds`: List<string>, nullable — Customer ID filter
- `orderIds`: List<string>, nullable — Order ID filter
- `orderStatuses`: List<string>, nullable — Order status filter
- `orderLineDeliveryStatuses`: List<string>, nullable — Order line delivery status filter
- `orderTypes`: List<string>, nullable — Order type filter
- `orderNumbers`: List<string>, nullable — Order number filter
- `orderLineProperties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Order line properties filter
- `orderProperties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Order properties filter
- `paymentStatuses`: List<string>, nullable — Payment status filter
- `paymentMethodNames`: List<string>, nullable — Payment method name filter
- `promotionNames`: List<string>, nullable — Promotion name filter
- `contactPersonEmails`: List<string>, nullable — Contact person e-mail filter
- `contactPersonPhones`: List<string>, nullable — Contact person phone filter
- `createdFrom`: string (date-time), nullable — Created date from filter (orders crated after given date)
- `createdTo`: string (date-time), nullable — Created date to filter (orders created before given date)
- `completedFrom`: string (date-time), nullable — Completed date from filter (orders completed after given date)
- `completedTo`: string (date-time), nullable — Completed date to filter (orders completed before given date)
- `groupBy`: string, nullable — Group by (Property name from AnalyticsOrderLine. E.g. "MainCategory", "SalesPersonName", "ProductName", etc...)
- `includeShipping`: boolean — Include shipping order lines
- `includeReturns`: boolean — Include return order lines
- `includeOrderLines`: boolean, nullable — Include order lines (default true)
- `isOrderPropertiesIncluded`: boolean — Include order information
- `isProductPropertiesIncluded`: boolean — Include product information
- `isCustomerPropertiesIncluded`: boolean — Include customer information
- `isPaymentPropertiesIncluded`: boolean — Include payment information
- `isShipmentPropertiesIncluded`: boolean — Include shipment information
- `isStorePropertiesIncluded`: boolean — Include store information
- `isWarehousePropertiesIncluded`: boolean — Include warehouse information
- `isPromotionPropertiesIncluded`: boolean — Include promotion information
- `isSupplierPropertiesIncluded`: boolean — Include supplier information
- `isShippingAddressPropertiesIncluded`: boolean — Include shipping address information
- `isInvoiceAddressPropertiesIncluded`: boolean — Include invoice address information
- `isContactPersonIncluded`: boolean — Include order contact person information
- `isOrderDefaultPropertiesIncluded`: boolean — Include default properties from the order (Default property items are configurable in the configuration)
- `searchText`: string, nullable — Free text search

**Used directly by endpoints in:**

- [Orders | Analytics](../endpoints/orders/analytics.md)
