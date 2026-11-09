# OmniumShippingOption

Shipping option to use on cart / order

**Fields:**

- `shippingMethodName`: string, nullable — Unique name for this shipping method
- `shippingCompany`: string, nullable — Shipping company e.g., PostNord, Bring, UPS
- `label`: string, nullable — Shipping option friendly name
- `description`: string, nullable — Short description about the shipping option
- `deliveryTime`: string, nullable — Shipping provider, approx. delivery time
- `taxRate`: number (decimal) — Tax rate
- `taxGroupCode`: string, nullable — VAT code of the shipping cost, when the shipping method has one. TaxRate is the rate of this code for the cart's store.
- `shippingTax`: number (decimal) — Shipment cost tax, before any discounts
- `shippingSubTotal`: number (decimal) — Shipping cost before any discounts
- `shippingSubTotalExclTax`: number (decimal) — Shipping cost before any discounts, excl tax
- `discountAmount`: number (decimal) — Amount of shipping discount, incl tax
- `discountedPrice`: number (decimal) — The actual shipping cost, if discounted
- `discountedPriceExclTax`: number (decimal) — The actual shipping cost, if discounted, excl tax
- `discountedPriceTax`: number (decimal) — Discounted price tax amount
- `discountLabel`: string, nullable — Label for discount e.g., "Free shipping for orders above 1000 Nok"
- `pickUpPoints`: List<[`OmniumShippingPickUpPoint`](OmniumShippingPickUpPoint.md)>, nullable, max length 250 — A list of pickUp points the customer can select from. Can be null
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
