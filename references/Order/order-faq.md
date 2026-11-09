# FAQ

Source: https://docs.omnium.no/docs/Order/order-faq

> Common questions about the Order API.

## Adding orders

### Why is the order status set to "Queued" sometimes?

When a new order is processed for the first time, the order is enqueued in our internal queue system. The order status will then briefly be set to "Queued". In most cases, the order will only have this status for a second or two, depending on the complexity of your workflow. When an order is queued, you should _not_ try to update the order, but await until the order processing has completed.

* * *

### Why are there order lines on both shipments and the order form?

Usually, all order lines would have been added to shipments, but not always. There are a few edge cases, such as when order lines are reallocated or when a user is managing shipments on an order.

* * *

### What about total amounts? And what's up with the "calculated" values I can see in the Swagger documentation?

All totals (Total, NetTotal, SubTotal, TaxTotal, etc.) are calculated by Omnium, which is why you do not need to include them in the request to add an order. The same goes for the calculated order line amounts, such as ExtendedPrice. As you can see in the [basic example for creating an order](order-api.md#example-creating-an-order), only the PlacedPrice is set, which is the price per unit without any discounts.

* * *

### What is "code" on order lines?

"Code" should reference a SKU. The following properties should all reference the same value:

*   Product/Variant → "Sku"
*   Order Line → "Code"
*   Inventory → "Sku"

* * *

### Shipping, shipment - what is the difference?

Shipping refers to the freight information, while the shipment refers to the delivery, which contains all order lines and shipping information.

* * *

### What is the difference between a warehouse and a store?

A warehouse is, in fact, a store in Omnium. The difference is how it is referenced on the order. The store is the seller, and the warehouse is the sender, but they are the same type of entity.

* * *

### Should I set the product name, cost, or other product-related data on the order line while adding the order?

You could set it, but if you have already imported your product catalog to Omnium, the order lines will automatically be enriched and populate properties related to the product. If you do set it, Omnium will not override it.

* * *

## Updating orders

### There seem to be a lot of endpoints that I could use to update an order. Why not just use "UpdateOrder" for everything?

Using specialized endpoints is encouraged as there could be event subscribers for those specific operations. It will also provider a better overview of changes done to an order. Some endpoint will also simplify how you would add information, which should be descibed in the endpoint swagger documentation.

* * *

## Configuration

### Why are the Payment and Shipment tabs missing on the order details page?

This usually happens when the `enableEdit` setting is set to `false` for the order type.

**How to fix it:**

1.  Go to `Configuration → Order Types → [Your Order Type]`
2.  Set `enableEdit` to `true`
3.  Save and publish your changes

Once this setting is enabled, the **Payment** and **Shipment** tabs will be visible on the order details page.

* * *
