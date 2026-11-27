# OmniumReplacementRequestModel

Request model for replacement order

**Fields:**

- `orderId`: string, required — Order id of the exsisting order to replace orderlines from.
- `orderLineReplacements`: List<[`OrderLineReplacementRequestModel`](OrderLineReplacementRequestModel.md)>, required — Request models for orderlines to replace
- `comment`: string, nullable — Comment will be added to the replacement payment, and as a property on the replacement order.
- `amountToCredit`: number (decimal), nullable — Optional: By default, a 'dummy' credit payment will be added to the original order, equal to the value of the replacement. This ensures the customer does not receive both the replacement and a full credit payment. In some cases, you may wish to issue a partial credit to the customer, for example, offering a 10% credit due to a delay or any other reason the replacement was necessary. In such scenarios, you should adjust this property's value to reflect the redced amount. For instance, if the total amount for the replacement is 200 and you want to credit the customer 50, you should set this propery's value to 150.

**Used directly by endpoints in:**

- [Orders | Returns](../endpoints/orders/returns.md)
