# OmniumOrderPatch

Omnium order patch object

**Fields:**

- `id`: string, nullable — Unique order ID
- `orderNumber`: string, nullable — Order identifier - does not have to be unique for each store, market etc
- `customerId`: string, nullable — The ID of the customer - should be a unique value
- `customerNumber`: string, nullable — The customer number
- `billingCurrency`: string, nullable — Currency of the order. e.g. "USD","NOK"
- `customerClubMemberId`: string, nullable — If Customer is member of customer club, set Customer ID as member ID.
- `customerName`: string, nullable — Name of customer
- `customerPhone`: string, nullable — Customer phone number with prefix. e.g. +4740000000
- `customerEmail`: string, nullable — Customer e-mail
- `customerType`: string, nullable — B2B or B2C (Business customer or private customer / consumer)
- `marketId`: string, nullable — Market ID e.g. US, NOR, SWE
- `billingAddress`: [`OmniumOrderAddress`](OmniumOrderAddress.md)
- `orderForm`: [`OmniumOrderFormPatch`](OmniumOrderFormPatch.md)
- `status`: string, nullable — Order status, e.g. "New", "InProgress", "Cancelled", etc.
- `remainingPayment`: number (decimal), nullable — Amount not paid
- `salesPersonId`: string, nullable — id of seller
- `salesPersonName`: string, nullable — Name of seller
- `salesChannel`: string, nullable — Name of sales channel
- `modifiedBy`: string, nullable — Modified by
- `created`: string (date-time), nullable — Order created date
- `followUpDate`: string (date-time), nullable — Order follow-up date
- `received`: string (date-time), nullable — Order received date
- `customerPickupDeadline`: string (date-time), nullable — Customer deadline for picking up order
- `storePickDate`: string (date-time), nullable — Employee deadline for picking order
- `requestedDeliveryDate`: string (date-time), nullable — Delivery date requested by customer
- `updateStatusDate`: string (date-time), nullable — Date when order should be moved to next status. (Updated by UpdateOrderStatusScheduledTask)
- `nextOrderStatus`: string, nullable — Status order should be moved to. (Updated by UpdateOrderStatusScheduledTask)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `propertiesRemovalConditions`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Specifies conditions for removing existing properties before proceeding with the patch operation. Each item in this list is a property specification with multiple attributes that must all match an existing property for it to be removed. For instance, a condition { "KeyGroup": "KeyGroupToRemove", "ValueType": "List" } will remove properties only if both KeyGroup == "KeyGroupToRemove" and ValueType == "List". Multiple items in this list are evaluated with "OR" logic, so any matching condition will trigger removal.
- `keepExistingCustomProperties`: boolean, nullable — Set to 'false' if you want to update the whole 'properties' list. If true, new properties will be added to the existing list of properties. 'True' by default.
- `paymentType`: string, nullable — Name of payment provider
- `orderType`: string, nullable — Order type e.g. "Online", "Pos"...
- `storeId`: string, nullable — Store ID responsible for order
- `returnOrderForms`: List<[`OmniumReturnOrderFormPatch`](OmniumReturnOrderFormPatch.md)>, nullable, max length 250 — Returns
- `customerReference`: string, nullable — Reference provided by customer
- `customerContact`: string, nullable — Customer contact person
- `customerRequisition`: string, nullable — Customer requisition provided by customer
- `contactPerson`: [`OmniumContactPerson`](OmniumContactPerson.md)
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external order IDs
- `isReadOnly`: boolean, nullable — If true, the order is not editable in Omnium. Used for completed PoS orders, historic data etc
- `isNotificationsDisabled`: boolean, nullable — If true, notifications will not be sent to customer
- `relatedOrders`: List<string>, nullable — List of related order IDs
- `session`: string, nullable — Session code used for referencing a web session
- `assets`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — Order assets (documents, media, files)
- `replacementOrderIds`: List<string>, nullable, max length 250 — List of replacement order IDs for this order
- `projectId`: string, nullable — Project ID - used if order is part of a project
- `subscriptionId`: string, nullable — Subscription ID - used if order is part of a subscription
- `tags`: List<string>, nullable, max length 250 — Order tags (Used by notification filters, and for grouping / filtering orders)
- `ignorePromotions`: boolean, nullable — Promotion prices will be ignored when product added to cart
- `orderOrigin`: string, nullable — The origin of the order should identify where the order was created. Typical values are "OMS", "ERP", "WEB" or "POS".
- `orderNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — Order comments, for internal use / not for customer
- `publicOrderNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — Order comments, visible for customer
- `forceUpdate`: List<string>, nullable, max length 250 — Used to update nullable prop like datetime to null, if original object has value, and you want to set null(remove value) Property name should then be in this list. Like "AuthorizationExpires" for a payment NB: Only impl for AuthorizationExpires at the moment
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable, max length 250 — List of errors on the current order.
- `keepExistingListItems`: boolean, nullable — Determines behaviour when updating list where items does not have unique id (properties, errors). If true, new items will be added to the existing list. If false, the existing list will be replaced with the new list. 'True' by default.
- `customerGroups`: List<string>, nullable, max length 250 — Customer groups (for discount calculation)
- `invoiceComment`: string, nullable — Invoice comment

**Used directly by endpoints in:**

- [Carts | Update](../endpoints/carts/update.md)
- [Orders | Update](../endpoints/orders/update.md)
