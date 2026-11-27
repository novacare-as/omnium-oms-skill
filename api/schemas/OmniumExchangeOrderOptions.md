# OmniumExchangeOrderOptions

Options for creating an exchange order from a return

**Fields:**

- `exchangeOrderId`: string, nullable — Optional: Specify the ID which the newly created exchange order will get. If not specified, Omnium will generate the ID
- `exchangeOrderLines`: List<[`OmniumOrderLine`](OmniumOrderLine.md)>, nullable — The order lines that will be purchased in the new exchange order - not the returned items. So if you return item A and exchange it to item B, the ExchangeOrderLines should contain item B.
- `additionalPayments`: List<[`OmniumPayment`](OmniumPayment.md)>, nullable — If the exchange item(s) cost more then the original item, you must provide additional payments
- `orderType`: string, nullable — Specify which order type the replacement order should be. If not provided, it will be the same type as the order that had been exchanged. This is typically set if the original order was a click-and-collect order, but the exchange order should be a POS order.
- `shippingMethodName`: string, nullable — Optional: The shipping method which should be used for the exchange order If not set, the shipping method name for the original order will be used. This is typically set if an online order has been returned and exchange in store. You would then set this to 'PickUpInStore'
- `orderStatus`: string, nullable — Order status that the exchange order should be set to (New or Completed for instance)
- `shipmentOrderStatus`: string, nullable — Optional: Order status the exchange order's shipment (freight) is set to. Use "New" when the exchange item must still be picked and shipped from the warehouse; "Completed" for in-store-pickup exchanges with no warehouse leg. If not set, the shipment inherits Omnium.Public.Orders.Models.OmniumExchangeOrderOptions.OrderStatus (so a "New" exchange order gets a "New" shipment); if neither is set it defaults to "Completed".
- `outboundWarehouseCode`: string, nullable — Optional: The warehouse code to be used for the exchange order. If not provided, it is inherited from the original order.
- `storeId`: string, nullable — Optional: Explicitly sets the Store ID for the exchange order. Priority order: 1. This value. 2. StoreId from the Return Request. 3. StoreId from the Original Order.
