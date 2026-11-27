# OmniumShipmentOption

Information about a specific shipment product, provider(Bring, Postnord, HeltHjem...), returns, price etc.

**Fields:**

- `shippingMethodId`: string, nullable — Unique id for this option(if ShippingMethodName is not enough
- `shippingGateway`: string, nullable — Provider gateway to use, e.g Bring, PostNord.
- `shippingPriceGateway`: string, nullable — If shipment prices and valid shipment options should be calculated by provider, but booking should not be done set ShippingPriceGateway to provider name, and set ShippingGateway to "Empty"
- `shippingMethodName`: string, nullable — Unique name to identify the shipping product. This value should match what the sales channel adds to an order and sends to OMS.
- `countryCode`: string, nullable — Two letter countryCode. Providers use this to get pickupPoints
- `shippingCompany`: string, nullable — If PickUp Point provider diff from ShippingGateway. GateWay is Logistra, and pickupPoint service is PostNord
- `shipmentProduct`: string, nullable — The product to book. E.g "PICKUP_PARCEL", "mypack". Get this value from provider
- `shipmentProductName`: string, nullable — Some providers need both ShipmentProduct and ShipmentProductName. Then ShipmentProduct will be "12543" and name "mypack"
- `providerNotification`: boolean — If provider should use notifications(Send out sms/emails from Bring/Postnord)
- `shipmentReturnProduct`: string, nullable — If return label should be created. Add provider name for return here. "MYPACK_COLLECT_RETURN"
- `shippingSubTotal`: number (decimal) — Set if a default shipping cost is used
- `getPriceFromProvider`: boolean — Set if prices should be calculated by provider, based on cart/order and address
- `addTaxOnProviderPrice`: boolean — Should tax be added to provider shipping cost
- `additionalCustomerPricePercentage`: number (decimal) — Most providers gives you a cost price for the shipment. If needed, add a surcharge here in percentage
- `discountedPrice`: number (decimal) — If there is a discounted price for the shipment
- `discountLabel`: string, nullable — Discount label
- `deliveryTime`: string, nullable — Default delivery time for this option
- `logoUrl`: string, nullable — Provider logo
- `vueTemplate`: string, nullable — Internal url to correct edit template
- `defaultPackage`: [`OmniumDefaultPackage`](OmniumDefaultPackage.md)
- `numberOfCollisMandatory`: boolean — Set if it is mandatory to send in number of collies
- `shipmentDeliveryType`: string, nullable — "Delivery" or "PickUp". "Delivery" is used when shipment is sent from store. "PickUp" is used when customer collect the shipment from store
- `translateKey`: string, nullable — Internal name for this shipment type. Use label for public
- `label`: string, nullable — Friendly name for this shipment option.
- `labelTranslationKey`: string, nullable — Translation key for this shipment option.
- `description`: string, nullable — A user friendly description of this shipment option
- `isDefaultShipment`: boolean — Used internally as a fallback if no other shipment options is found
- `consigneeType`: string, nullable — CONSUMER or BUSINESS, is used by providers. Check with correct provider
- `consignorType`: string, nullable — CONSUMER or BUSINESS, is used by providers. Check with correct provider
- `defaultWarehouseCode`: string, nullable — Set if you use a default warehouse to send from
- `isWarehouseSetAutomatically`: boolean — Used if shipment options is added from Oms, and warehouse should be set automatically
- `providerServices`: string, nullable — Provider specific values(comma separated) e.g "postnord_notification_email", "postnord_notification_sms"
- `hideInOms`: boolean — Not visible in Oms gui
- `hideFromApi`: boolean — Not visible in public api
- `includeGoodsDescription`: boolean — Some providers needs a description of the goods. Then this should be true
- `externalShippingMethodName`: string, nullable — Should be used for additional ID or mapping to external systems.
- `pickUpPoints`: List<[`OmniumPickUpPoint`](OmniumPickUpPoint.md)>, nullable, max length 250 — Pickup points returned by a provider
- `servicePointProvider`: string, nullable — If provider for pickUp/service points differ from ShippingGateway
- `servicePointRequired`: boolean — If this shipment options require a pickUp/service point
- `getServicePoints`: boolean — If we should search for pickUp/service points, based on customer address
- `printerId`: string, nullable — Used by providers that support cloud print Only in use if shipping option require special printer, else printer id should be on store. Ask us about setup
- `shouldParseDescription`: boolean — Used by special magento cases. Ask us if needed
- `validOnMarkets`: List<string>, nullable, max length 250 — The markets this shipment option is valid for
- `taxRate`: number (decimal) — Tax rate for the options, if differ from market tax rate. Only in used if we should calculate prices
- `taxGroupCode`: string, nullable — VAT code (tax group) of the shipping cost. When set and the tenant uses VAT codes, shipping is charged the rate this code has for the order's store instead of TaxRate. Must be one of the tenant's VAT codes.
- `shippingTax`: number (decimal) — Tax on shipping cost
- `shippingSubTotalExclTax`: number (decimal) — Shipping cost excl tax
- `discountedPriceTax`: number (decimal) — Discounted price tax
- `discountedPriceExclTax`: number (decimal) — Discounted price excl tax
- `discountAmount`: number (decimal) — Amount of discount given to the customer
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250
- `constraints`: [`OmniumShipmentOptionConstraints`](OmniumShipmentOptionConstraints.md)
- `cost`: [`OmniumShipmentOptionCost`](OmniumShipmentOptionCost.md)

**Used directly by endpoints in:**

- [Markets](../endpoints/markets.md)
