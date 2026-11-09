# OmniumOrderSearchRequest

Order search request

**Fields:**

- `orderNumber`: string, nullable — Order number or order ID
- `email`: string, nullable — Customer e-mail
- `phone`: string, nullable — Customer phone number
- `selectedStatuses`: List<string>, nullable, max length 250 — Limit search to selected order statuses
- `excludedStatuses`: List<string>, nullable, max length 250 — Exclude orders with given statuses
- `excludedShipmentExternalIdProviders`: List<string>, nullable, max length 250 — Exclude orders where all shipments has external Ids from given providers
- `customerName`: string, nullable — Customer name
- `customerNumber`: string, nullable — Customer Number
- `customerId`: string, nullable — Customer Id
- `customerIds`: List<string>, nullable, max length 250 — Customer Ids
- `contactPersonPhone`: string, nullable — Contact person phone number
- `contactPersonEmail`: string, nullable — Contact person e-mail
- `salesChannels`: List<string>, nullable, max length 250 — Sales channels
- `customerContact`: string, nullable — Customer contact person
- `salesPersonId`: string, nullable — Sales person ID (e-mail of Omnium user)
- `createdFrom`: string (date-time), nullable — Orders created from date
- `createdTo`: string (date-time), nullable — Orders created before date
- `modifiedFrom`: string (date-time), nullable — Orders modified from date
- `modifiedTo`: string (date-time), nullable — Orders modified before date
- `readyForPickupFrom`: string (date-time), nullable — Orders ready to pick up from date
- `readyForPickupTo`: string (date-time), nullable — Orders ready to pick up before date
- `completedFrom`: string (date-time), nullable — Orders completed from date
- `completedTo`: string (date-time), nullable — Orders completed before date
- `followUpDateFrom`: string (date-time), nullable — Orders with follow-up from date
- `followUpDateTo`: string (date-time), nullable — Orders with follow-up to date
- `requestedDeliveryFrom`: string (date-time), nullable — Orders with requested delivery date from
- `requestedDeliveryTo`: string (date-time), nullable — Orders with requested delivery date to
- `urgent`: boolean — Urgent orders (pick limit or pickup limit exceeded)
- `selectedStores`: List<string>, nullable, max length 250 — Limit search by store IDs
- `selectedMarkets`: List<string>, nullable, max length 250 — Limit search by market IDs
- `orderType`: string, nullable, **deprecated** — Limit to single order type. Use OrderTypes instead for filtering by multiple order types.
- `productNumbers`: List<string>, nullable, max length 250 — Limit to orders containing selected product numbers
- `productSerialNumbers`: List<string>, nullable, max length 250 — Limit to order containing selected product serial numbers
- `productTypes`: List<string>, nullable, max length 250 — Limit to order containing selected product types
- `selectedDiscounts`: List<string>, nullable, max length 250 — Limit to orders containing selected discounts
- `searchText`: string, nullable — Free search text
- `inventoryStatus`: string, nullable — Limit search to inventory status ("InStock", "PartiallyInStock", "NotInStock")
- `shippingMethodName`: string, nullable — Shipping method name
- `shippingMethodNames`: List<string>, nullable, max length 250 — Shipping method names
- `paymentStatuses`: List<string>, nullable, max length 250 — Limit search to payment statuses. "Paid", "NotPaid", "PartiallyPaid" and "OverPaid" compare the order total with the authorized amount, so a reservation counts as paid. "Reserved" selects orders where money is still reserved but not captured, and "Captured" orders that are paid with nothing left to capture. Several values are combined with OR.
- `paymentTransactionTypes`: List<string>, nullable, max length 250 — Filter orders by payment transaction types ("Authorization", "Capture" for instance)
- `paymentTransactionStatus`: string, nullable — Filter orders by payment transaction status ("Failed" for instance)
- `paymentTransactionDateFrom`: string (date-time), nullable — Filter orders by payment transaction by date (from)
- `paymentTransactionDateTo`: string (date-time), nullable — Filter orders by payment transaction by date (to)
- `futureDeliveries`: boolean — Only show future deliveries (orders with future requested delivery date)
- `hasErrors`: boolean — Only show orders with errors
- `showOrdersWithAuthExpires`: boolean — Search orders with payment authorize about to expire
- `externalIds`: List<string>, nullable, max length 250 — Search orders with external IDs
- `shipmentExternalIds`: List<string>, nullable, max length 250 — Search orders with shipment external IDs
- `take`: integer (int32) — Number of orders to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `sortOrder`: string, nullable — Sort order for the results. Defaults to created date descending. Possible values: CreatedAscending, CreatedDescending, ModifiedAscending, ModifiedDescending, CustomerNameAscending, CustomerNameDescending StatusAscending, StatusDescending, OrderIdAscending, OrderIdDescending, StoreAscending, StoreDescending, TotalAscending, TotalDescending and DocumentID. If you do not care about the order you should use DocumentId
- `projectId`: string, nullable — Search orders by project ID
- `subscriptionId`: string, nullable — Search orders by subscription ID
- `property`: [`OmniumPropertyItem`](OmniumPropertyItem.md)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Search orders by properties, value, key, keyGroup or valueType
- `picklistIds`: List<string>, nullable, max length 250 — Only orders which appear on the pick list.
- `disableFacets`: boolean, nullable — Set to true to disable facet generation. Disabling facets will improve performance and reduce data payload.
- `tags`: List<string>, nullable, max length 250 — Filter by tags
- `excludedTags`: List<string>, nullable, max length 250 — Filter by excluding tags
- `secretKey`: string, nullable — Search by order secret key
- `shipmentOrderStatuses`: List<string>, nullable, max length 250 — Limit search to orders with shipments matching given shipment order statuses
- `orderTypes`: List<string>, nullable, max length 250 — Limit to multiple order types
- `orderLineIsAwaitingPurchaseOrder`: boolean, nullable — Filter orders containing order lines where IsAwaitingPurchaseOrder matches (true/false)

**Used directly by endpoints in:**

- [Orders | Search](../endpoints/orders/search.md)
